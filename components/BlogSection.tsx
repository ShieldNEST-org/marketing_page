'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { IoTimeOutline, IoArrowForward, IoChevronForward, IoCloseOutline } from 'react-icons/io5';

// Format blog content with enhanced HTML structure
function formatBlogContent(content: string): string {
  let formatted = content;
  formatted = formatted.replace(/^### (.+)$/gm, '<h4 class="text-xl font-bold mt-8 mb-4">$1</h4>');
  formatted = formatted.replace(/^## (.+)$/gm, '<h3 class="text-2xl font-bold mt-10 mb-6 border-l-4 border-accent pl-4">$1</h3>');
  formatted = formatted.replace(/^# (.+)$/gm, '<h2 class="text-3xl font-black mt-12 mb-8">$1</h2>');
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
  formatted = formatted.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-accent">$1</code>');
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline hover:text-primary transition-colors">$1</a>');
  formatted = formatted.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary bg-muted/30 p-6 my-8 italic text-lg">$1</blockquote>');
  
  const paragraphs = formatted.split(/\n\n+/);
  return paragraphs.map(para => {
    const trimmed = para.trim();
    if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<ul')) return trimmed;
    return trimmed.length > 0 ? `<p class="mb-6 leading-relaxed text-muted-foreground">${trimmed}</p>` : '';
  }).filter(p => p.length > 0).join('\n\n');
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
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const hasFetched = useRef(false);

  const fetchBlogPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/blog?type=today&limit=6');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Blog loading error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchBlogPosts();
    }
  }, [fetchBlogPosts]);

  if (loading) return null;
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-32 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Latest Insights</h2>
            <div className="w-20 h-2 bg-accent-secondary" />
          </div>
          <p className="text-muted-foreground max-w-md">
            Daily technical updates and security research from the Shieldnest Development Team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <article 
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="card-open-bottom p-8 group cursor-pointer hover:border-accent-secondary transition-all flex flex-col"
            >
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-secondary mb-4">
                <IoTimeOutline />
                <span>{post.readingTime} MIN READ</span>
                <span className="text-border">•</span>
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-2xl font-black mb-4 line-clamp-2 group-hover:text-accent-secondary transition-colors">{post.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-8 flex-grow">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                Read Article <IoArrowForward />
              </div>
            </article>
          ))}
        </div>

        {selectedPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setSelectedPost(null)} />
            <div className="relative w-full max-w-4xl max-h-full overflow-y-auto bg-card border border-border p-8 sm:p-16 scrollbar-hide">
              <button 
                onClick={() => setSelectedPost(null)}
                className="sticky top-0 float-right p-4 -mr-8 -mt-8 text-muted-foreground hover:text-accent transition-colors"
              >
                <IoCloseOutline className="w-8 h-8" />
              </button>
              
              <div className="max-w-2xl mx-auto">
                <div className="accent-line-left mb-12">
                  <span className="text-sm font-bold uppercase tracking-widest text-accent-secondary">Research & Analysis</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-8">{selectedPost.title}</h2>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-16 pb-8 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Image src="/shld_dark.svg" alt="Shieldnest" width={16} height={16} />
                    </div>
                    <span className="font-bold text-foreground uppercase tracking-wider text-xs">Shieldnest Team</span>
                  </div>
                  <span>{new Date(selectedPost.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatBlogContent(selectedPost.content) }}
                />

                <div className="mt-20 pt-10 border-t border-border">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Keywords</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedPost.keywords.map(kw => (
                      <span key={kw} className="px-3 py-1 bg-muted text-[10px] font-black uppercase tracking-widest text-accent-secondary border border-border">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
