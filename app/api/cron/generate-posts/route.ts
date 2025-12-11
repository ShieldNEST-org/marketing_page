import { NextRequest, NextResponse } from 'next/server';
import { blogGenerator } from '@/lib/blog-generator';

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting daily blog post generation...');

    // Generate and save 10 blog posts
    const posts = await blogGenerator.generateAndSavePosts(10);

    console.log(`Successfully generated and saved ${posts.length} blog posts`);

    return NextResponse.json({
      success: true,
      message: `Generated ${posts.length} blog posts`,
      posts: posts.map(p => ({ title: p.title, slug: p.slug })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog posts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Only allow GET requests for cron jobs
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}