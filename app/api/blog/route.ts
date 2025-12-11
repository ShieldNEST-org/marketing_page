import { NextRequest, NextResponse } from 'next/server';
import { getTodaysPosts, getPostsPaginated, getPostById } from '@/lib/supabase';

// Revalidate every 5 minutes
export const revalidate = 300;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'today'; // 'today', 'history', 'single'
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50); // Max 50 posts
    const offset = parseInt(searchParams.get('offset') || '0');
    const postId = searchParams.get('id');

    let posts: any[] = [];

    if (type === 'single' && postId) {
      // Fetch single post by ID
      const post = await getPostById(postId);
      posts = post ? [post] : [];
    } else if (type === 'today') {
      // Fetch today's posts (default behavior)
      posts = await getTodaysPosts();

      // If no posts today, fall back to recent posts
      if (posts.length === 0) {
        posts = await getPostsPaginated(0, limit);
      }
    } else if (type === 'history') {
      // Fetch historical posts with pagination
      posts = await getPostsPaginated(offset, limit);
    } else {
      // Default: fetch recent posts
      posts = await getPostsPaginated(0, limit);
    }

    // Transform database posts to API format
    const transformedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      keywords: post.keywords || [],
      readingTime: post.reading_time,
      publishedAt: post.published_at,
      author: post.author,
      imageUrl: post.image_url,
      optimized: true
    }));

    // Add cache headers for CDN and browser caching
    const response = NextResponse.json({
      posts: transformedPosts,
      meta: {
        total: transformedPosts.length,
        type,
        offset: type === 'history' ? offset : undefined,
        hasMore: type === 'history' && transformedPosts.length === limit,
        generatedAt: new Date().toISOString()
      }
    });

    // Cache for 5 minutes on CDN, stale-while-revalidate for 1 hour
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=3600'
    );

    return response;

  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog content', posts: [], meta: { total: 0, generatedAt: new Date().toISOString() } },
      { status: 500 }
    );
  }
}

// POST endpoint for admin blog management (future use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Future: Save custom blog posts to database
    return NextResponse.json({ success: true, message: 'Blog post created' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}