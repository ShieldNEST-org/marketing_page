'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { IoTimeOutline, IoArrowForward, IoChevronForward, IoCloseOutline } from 'react-icons/io5';

// Format blog content with enhanced HTML structure for better readability and engagement
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

  // Create callout boxes for important points (lines starting with !!!)
  formatted = formatted.replace(/^!!! (.+)$/gm, '<div class="callout-box">$1</div>');

  // Create warning boxes (lines starting with ⚠️ or WARNING)
  formatted = formatted.replace(/^(?:⚠️|WARNING:?) (.+)$/gm, '<div class="warning-box">$1</div>');

  // Create success/tip boxes (lines starting with ✅ or TIP)
  formatted = formatted.replace(/^(?:✅|TIP:?) (.+)$/gm, '<div class="tip-box">$1</div>');

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
      trimmed.startsWith('<div') ||
      trimmed.startsWith('<callout-box') ||
      trimmed.startsWith('<warning-box') ||
      trimmed.startsWith('<tip-box')
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

// Helper to group posts by date
function groupPostsByDate(posts: BlogPost[]): Map<string, BlogPost[]> {
  const grouped = new Map<string, BlogPost[]>();
  posts.forEach(post => {
    const dateKey = new Date(post.publishedAt).toISOString().split('T')[0];
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(post);
  });
  return grouped;
}

// Helper to format date for section headers
function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visibleDays, setVisibleDays] = useState(5);
  
  // Track if initial fetch has been done to prevent refetch
  const hasFetched = useRef(false);
  // Track component mount state to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Refs for horizontal scroll containers
  const scrollContainerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Lighthouse-optimized data fetching with error boundaries
  const fetchBlogPosts = useCallback(async (loadMore: boolean = false) => {
    try {
      if (!loadMore) {
        if (posts.length === 0) {
          setLoading(true);
        }
        setError(null);
      } else {
        setLoadingMore(true);
      }

      // Fetch more posts to ensure we have enough days of content
      const params = new URLSearchParams({
        type: 'today',
        limit: '50', // Get more posts to have multiple days
      });

      const response = await fetch(`/api/blog?${params}`, {
        cache: 'default',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogResponse = await response.json();

      if (!isMounted.current) return;

      setPosts(data.posts);
      setHasMore(data.posts.length >= 50);

      // Accessibility: Announce content loaded
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Loaded ${data.posts.length} blog posts about crypto security`;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
      }

    } catch (err) {
      if (!isMounted.current) return;
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
      console.error('Blog loading error:', err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [posts.length]);

  // Load more days
  const loadMoreDays = useCallback(() => {
    setVisibleDays(prev => prev + 5);
  }, []);
  
  // Scroll handlers for horizontal navigation
  const scrollRow = useCallback((dateKey: string, direction: 'left' | 'right') => {
    const container = scrollContainerRefs.current.get(dateKey);
    if (container) {
      const scrollAmount = 320; // Card width + gap
      container.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

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
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-100 mb-6 leading-tight"
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
              {posts.length} posts • Scroll to explore each day's content
            </div>
          )}
        </header>

        {/* Blog Posts Grouped by Day - Horizontal Scroll */}
        <div className="space-y-8 sm:space-y-10 mb-12">
          {(() => {
            const grouped = groupPostsByDate(posts);
            const sortedDates = Array.from(grouped.keys()).sort((a, b) => 
              new Date(b).getTime() - new Date(a).getTime()
            );
            const visibleDates = sortedDates.slice(0, visibleDays);
            const hasMoreDays = sortedDates.length > visibleDays;
            
            return (
              <>
                {visibleDates.map((dateKey, dayIndex) => {
                  const dayPosts = grouped.get(dateKey) || [];
                  // First day's first 3 images should load eagerly for LCP
                  const isFirstDay = dayIndex === 0;
                  return (
                    <div key={dateKey} className="relative">
                      {/* Day Header */}
                      <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                            {formatDateHeader(dateKey)}
                          </h3>
                          <span className="px-2.5 py-1 bg-[#25d695]/15 text-[#25d695] text-sm font-medium rounded-full border border-[#25d695]/30">
                            {dayPosts.length} {dayPosts.length === 1 ? 'post' : 'posts'}
                          </span>
                        </div>
                        {/* Scroll Arrows - Desktop */}
                        <div className="hidden sm:flex items-center gap-2">
                          <button
                            onClick={() => scrollRow(dateKey, 'left')}
                            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 text-gray-400 hover:text-white transition-all border border-gray-700/50"
                            aria-label="Scroll left"
                          >
                            <IoChevronForward className="w-5 h-5 rotate-180" />
                          </button>
                          <button
                            onClick={() => scrollRow(dateKey, 'right')}
                            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 text-gray-400 hover:text-white transition-all border border-gray-700/50"
                            aria-label="Scroll right"
                          >
                            <IoChevronForward className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Horizontal Scroll Container */}
                      <div 
                        ref={(el) => {
                          if (el) scrollContainerRefs.current.set(dateKey, el);
                        }}
                        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                        style={{ 
                          scrollbarWidth: 'none', 
                          msOverflowStyle: 'none',
                          WebkitOverflowScrolling: 'touch'
                        }}
                      >
                        {dayPosts.map((post, postIndex) => (
                          <article
                            key={post.id}
                            className="group neo-float-purple p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] flex-shrink-0 w-[280px] sm:w-[300px] snap-start"
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
                            <div className="relative h-36 mb-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden">
                              {post.imageUrl ? (
                                <Image
                                  src={post.imageUrl}
                                  alt={post.title}
                                  fill
                                  className="object-cover"
                                  sizes="300px"
                                  unoptimized
                                  priority={isFirstDay && postIndex < 3}
                                  loading={isFirstDay && postIndex < 3 ? 'eager' : 'lazy'}
                                />
                              ) : (
                                <>
                                  <div className="absolute inset-0 bg-gradient-to-br from-[#25d695]/10 to-purple-500/10"></div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#25d695]/20 to-purple-500/20 border border-[#25d695]/30 flex items-center justify-center overflow-hidden">
                                      <Image
                                        src="/shieldmarketingfavicon.svg"
                                        alt="Shield Nest Team"
                                        width={56}
                                        height={56}
                                        className="object-cover scale-110"
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                              {/* Reading time badge */}
                              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                {post.readingTime} min
                              </div>
                            </div>

                            {/* Structured Data for SEO */}
                            <meta itemProp="headline" content={post.title} />
                            <meta itemProp="author" content={post.author} />
                            <meta itemProp="datePublished" content={post.publishedAt} />
                            <meta itemProp="keywords" content={post.keywords.join(', ')} />

                            <h4
                              className="text-base font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors line-clamp-2"
                              itemProp="name"
                            >
                              {post.title}
                            </h4>

                            <p className="text-gray-400 text-sm mb-3 line-clamp-2" itemProp="description">
                              {post.excerpt}
                            </p>

                            {/* Post Meta */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <IoTimeOutline className="w-3.5 h-3.5" />
                                <span>{post.readingTime} min read</span>
                              </div>
                              <IoChevronForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {/* Load Previous Days Button */}
                {hasMoreDays && (
                  <div className="text-center mt-8 sm:mt-10">
                    <button
                      onClick={loadMoreDays}
                      className="btn-coreum-green px-8 py-3 text-lg inline-flex items-center gap-3"
                      aria-label="Load previous 5 days of blog posts"
                    >
                      Load Previous 5 Days
                      <IoChevronForward className="w-5 h-5 rotate-90" />
                    </button>
                    <p className="text-sm text-gray-400 mt-2">
                      {sortedDates.length - visibleDays} more days available
                    </p>
                  </div>
                )}
              </>
            );
          })()}
        </div>

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
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100 mb-4 sm:mb-5 leading-tight"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                  itemProp="headline"
                >
                  {selectedPost.title}
                </h3>
                
                {/* Author and date info */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#25d695]/20 to-purple-500/20 border border-[#25d695]/30 flex items-center justify-center overflow-hidden">
                      <Image
                        src="/shieldmarketingfavicon.svg"
                        alt="Shield Nest Team"
                        width={32}
                        height={32}
                        className="object-cover scale-110"
                      />
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

              {/* Close Button - Sticky to Bottom */}
              <div className="sticky bottom-0 left-0 right-0 bg-[#101216]/95 backdrop-blur-md border-t border-gray-700/50 p-4 mt-8">
                <div className="flex justify-center">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#101216] border-2 border-red-500/40 hover:border-red-500 rounded-xl text-red-400 hover:text-red-300 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_25px_rgba(239,68,68,0.3)] group"
                    aria-label="Close blog post"
                  >
                    <span className="text-sm font-medium">Close Article</span>
                    <IoCloseOutline className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>
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