'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { IoTimeOutline, IoPersonOutline, IoArrowForward, IoChevronForward } from 'react-icons/io5';

// Format blog content with enhanced HTML structure for better readability
function formatBlogContent(content: string): string {
  let formatted = content;
  
  // Convert markdown-style headers to styled HTML
  formatted = formatted.replace(/^### (.+)$/gm, '<h4>$1</h4>');
  formatted = formatted.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  formatted = formatted.replace(/^# (.+)$/gm, '<h2>$1</h2>');
  
  // Convert **bold** to styled strong tags
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to styled em tags
  formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert `code` to inline code
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Convert markdown links [text](url) to styled links
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Convert blockquotes (lines starting with >)
  formatted = formatted.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  
  // Merge consecutive blockquotes
  formatted = formatted.replace(/<\/blockquote>\n<blockquote>/g, '\n');
  
  // Convert horizontal rules (--- or ***)
  formatted = formatted.replace(/^(?:---|\*\*\*)$/gm, '<hr />');
  
  // Convert unordered lists (lines starting with - or *)
  formatted = formatted.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
  formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Convert numbered lists (lines starting with 1. 2. etc)
  formatted = formatted.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  
  // Split into paragraphs on double newlines
  const paragraphs = formatted.split(/\n\n+/);
  
  formatted = paragraphs.map(para => {
    const trimmed = para.trim();
    // Don't wrap if already has block-level HTML
    if (
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('<ol') ||
      trimmed.startsWith('<hr') ||
      trimmed.startsWith('<pre') ||
      trimmed.startsWith('<div')
    ) {
      return trimmed;
    }
    // Wrap in paragraph if has content
    if (trimmed.length > 0) {
      // Convert single line breaks to <br /> within paragraphs
      const withBreaks = trimmed.replace(/\n/g, '<br />');
      return `<p>${withBreaks}</p>`;
    }
    return '';
  }).filter(p => p.length > 0).join('\n\n');
  
  return formatted;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  keywords: string[];
  readingTime: number;
  publishedAt: string;
  author: string;
  imageUrl?: string;
  optimized?: boolean;
}

interface BlogResponse {
  posts: BlogPost[];
  meta: {
    total: number;
    type?: string;
    topic?: string;
    offset?: number;
    hasMore?: boolean;
    generatedAt: string;
  };
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [historyOffset, setHistoryOffset] = useState(0);
  const [showLoadMore, setShowLoadMore] = useState(false);
  
  // Track if initial fetch has been done to prevent refetch
  const hasFetched = useRef(false);
  // Track component mount state to prevent state updates after unmount
  const isMounted = useRef(true);

  // Lighthouse-optimized data fetching with error boundaries
  const fetchBlogPosts = useCallback(async (type: 'today' | 'history' = 'today', offset: number = 0) => {
    try {
      if (type === 'today') {
        // Only show loading if we don't have posts yet (prevents flash)
        if (posts.length === 0) {
          setLoading(true);
        }
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        type,
        limit: type === 'today' ? '10' : '3',
        ...(type === 'history' && { offset: offset.toString() })
      });

      const response = await fetch(`/api/blog?${params}`, {
        // Use cache for initial load, no-store for explicit refreshes
        cache: type === 'today' ? 'default' : 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogResponse = await response.json();

      // Only update state if component is still mounted
      if (!isMounted.current) return;

      if (type === 'today') {
        // Performance optimization: Preload critical content
        setPosts(data.posts);
        setShowLoadMore(data.posts.length > 0);
        setHasMore(data.posts.length >= 10); // If we got 10, there might be more

        // Accessibility: Announce content loaded to screen readers
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const announcement = document.createElement('div');
          announcement.setAttribute('aria-live', 'polite');
          announcement.setAttribute('aria-atomic', 'true');
          announcement.className = 'sr-only';
          announcement.textContent = `Loaded ${data.posts.length} blog posts about crypto security`;
          document.body.appendChild(announcement);
          setTimeout(() => document.body.removeChild(announcement), 1000);
        }
      } else {
        // Append historical posts
        setPosts(prevPosts => [...prevPosts, ...data.posts]);
        setHasMore(data.meta.hasMore || false);
        setHistoryOffset(prevOffset => prevOffset + 3);
      }

    } catch (err) {
      // Only update state if component is still mounted
      if (!isMounted.current) return;
      
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
      console.error('Blog loading error:', err);
    } finally {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [posts.length]);

  // Load more historical posts
  const loadMorePosts = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchBlogPosts('history', historyOffset);
    }
  }, [fetchBlogPosts, loadingMore, hasMore, historyOffset]);

  useEffect(() => {
    // Set mounted ref
    isMounted.current = true;
    
    // Only fetch once on initial mount
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchBlogPosts();
    }
    
    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [fetchBlogPosts]);

  // Performance optimization: Lazy load post content
  const handlePostClick = useCallback((post: BlogPost) => {
    setSelectedPost(post);
    // Smooth scroll to post content for better UX
    setTimeout(() => {
      document.getElementById('blog-content')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, []);

  // Lighthouse optimization: Format date for SEO
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  if (loading) {
    return (
      <section id="blog" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[#101216]" aria-labelledby="blog-title">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2
              id="blog-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
            >
              Latest from Our <span className="text-[#25d695]">Security Blog</span>
            </h2>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </div>

          {/* Loading skeleton optimized for mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <article key={i} className="neo-float-purple p-4 sm:p-5 lg:p-6 animate-pulse" aria-hidden="true">
                <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="h-16 bg-gray-700 rounded"></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blog" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[#101216]" aria-labelledby="blog-title">
        <div className="container mx-auto max-w-7xl text-center">
          <h2
            id="blog-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
          >
            Today's <span className="text-[#25d695]">Security Insights</span>
          </h2>
          <div className="neo-float-purple p-8 max-w-md mx-auto">
            <p className="text-gray-300 mb-4">Unable to load blog posts at this time.</p>
            <button
              onClick={() => fetchBlogPosts('today')}
              className="btn-coreum-green px-6 py-3"
              aria-label="Retry loading blog posts"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // If no posts and not loading, don't render the section at all
  // This prevents the big empty black stripe on mobile
  if (posts.length === 0 && !loading) {
    return null;
  }

  return (
    <section id="blog" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[#101216]" aria-labelledby="blog-title">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header - SEO Optimized */}
        <header className="text-center mb-16">
          <h2
            id="blog-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
          >
            Today's <span className="text-[#25d695]">Security Insights</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Fresh daily content covering Coreum, Cosmos ecosystem, airdrops, and blockchain security from the Shield Nest Team.
          </p>
          {posts.length > 0 && (
            <div className="mt-4 text-sm text-gray-400">
              {posts.length} posts published today • Fresh content throughout the day
            </div>
          )}
        </header>

        {/* Blog Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group neo-float-purple p-4 sm:p-5 lg:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              onClick={() => handlePostClick(post)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePostClick(post);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Read ${post.title}`}
              itemScope
              itemType="https://schema.org/BlogPosting"
            >
              {/* Blog Post Image */}
              <div className="relative h-32 sm:h-40 lg:h-48 mb-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#25d695]/10 to-purple-500/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#25d695]/20 to-purple-500/20 border border-[#25d695]/30 flex items-center justify-center">
                        <IoPersonOutline className="w-8 h-8 text-[#25d695]" />
                      </div>
                    </div>
                  </>
                )}
                {/* Reading time badge */}
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {post.readingTime} min read
                </div>
              </div>

              {/* Structured Data for SEO */}
              <meta itemProp="headline" content={post.title} />
              <meta itemProp="author" content={post.author} />
              <meta itemProp="datePublished" content={post.publishedAt} />
              <meta itemProp="keywords" content={post.keywords.join(', ')} />

              <h3
                className="text-lg sm:text-xl lg:text-xl font-bold text-white mb-3 group-hover:text-[#25d695] transition-colors line-clamp-2"
                itemProp="name"
              >
                {post.title}
              </h3>

              <p className="text-gray-400 mb-4 line-clamp-3" itemProp="description">
                {post.excerpt}
              </p>

              {/* Post Meta */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <IoTimeOutline className="w-4 h-4" />
                    <span>{post.readingTime} min</span>
                  </div>
                  <time dateTime={post.publishedAt} itemProp="datePublished">
                    {formatDate(post.publishedAt)}
                  </time>
                </div>
                <IoChevronForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        {showLoadMore && hasMore && (
          <div className="text-center mt-8 sm:mt-12">
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="btn-coreum-green px-8 py-3 text-lg inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Load more historical blog posts"
            >
              {loadingMore ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  Load More Posts
                  <IoChevronForward className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-sm text-gray-400 mt-2">
              Load 3 more posts from our history
            </p>
          </div>
        )}

        {/* Selected Post Content - Enhanced Visual Design */}
        {selectedPost && (
          <div
            id="blog-content"
            className="neo-float-green p-4 sm:p-6 lg:p-10 mt-8 sm:mt-10 lg:mt-12 relative overflow-hidden"
            itemScope
            itemType="https://schema.org/BlogPosting"
          >
            {/* Decorative background gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#25d695]/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-4xl mx-auto relative z-10">
              <header className="mb-8 sm:mb-10 pb-8 border-b border-gray-700/50">
                {/* Category/Reading badge */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#25d695]/15 text-[#25d695] text-sm font-semibold rounded-full border border-[#25d695]/30">
                    Security Insights
                  </span>
                  <span className="px-3 py-1 bg-purple-500/15 text-purple-400 text-sm font-medium rounded-full border border-purple-500/30">
                    {selectedPost.readingTime} min read
                  </span>
                </div>
                
                {/* Title with gradient accent */}
                <h3 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-5 leading-tight"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                  itemProp="headline"
                >
                  {selectedPost.title}
                </h3>
                
                {/* Author and date info */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#25d695] to-purple-500 flex items-center justify-center">
                      <IoPersonOutline className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-300">Shield Nest Team</span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <time dateTime={selectedPost.publishedAt} itemProp="datePublished" className="text-gray-400">
                    {formatDate(selectedPost.publishedAt)}
                  </time>
                </div>
                
                {/* Excerpt as lead paragraph */}
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed border-l-4 border-[#25d695]/50 pl-4 bg-[#25d695]/5 py-3 rounded-r-lg" itemProp="description">
                  {selectedPost.excerpt}
                </p>
              </header>

              {/* Blog Content - Enhanced Readability Styling */}
              <div
                className="blog-article max-w-none"
                itemProp="articleBody"
                dangerouslySetInnerHTML={{
                  __html: formatBlogContent(selectedPost.content)
                }}
              />

              {/* Decorative divider before footer */}
              <div className="my-10 sm:my-12 flex items-center justify-center">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
                <div className="mx-4 text-[#25d695]">✦</div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#25d695]/50" />
              </div>
              
              {/* Keywords for SEO - Enhanced styling */}
              <footer className="pt-6 sm:pt-8 border-t border-gray-700/50">
                <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider font-medium">Related Topics</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {selectedPost.keywords.map((keyword, i) => {
                    // Alternate between color schemes for visual variety
                    const colors = [
                      'bg-[#25d695]/10 text-[#25d695] border-[#25d695]/30 hover:bg-[#25d695]/20',
                      'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20',
                      'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20',
                      'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20',
                    ];
                    return (
                      <span
                        key={i}
                        className={`px-4 py-1.5 ${colors[i % colors.length]} rounded-full text-sm font-medium border transition-colors cursor-default`}
                      >
                        #{keyword}
                      </span>
                    );
                  })}
                </div>
              </footer>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16">
          <a
            href="https://v1.shieldnest.org"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-coreum-green px-8 py-4 text-lg inline-flex items-center gap-3"
            aria-label="Launch SHIELDNEST app to secure your portfolio"
          >
            Secure Your Portfolio Today
            <IoArrowForward className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "SHIELDNEST Security Blog",
            "description": "Expert crypto security insights and Coreum blockchain updates",
            "url": "https://shieldnest.org/blog",
            "publisher": {
              "@type": "Organization",
              "name": "SHIELDNEST",
              "url": "https://shieldnest.org"
            },
            "author": {
              "@type": "Organization",
              "name": "Shield Nest Team"
            },
            "blogPost": posts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "author": {
                "@type": "Organization",
                "name": "Shield Nest Team"
              },
              "datePublished": post.publishedAt,
              "keywords": post.keywords
            }))
          })
        }}
      />
    </section>
  );
}