import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create clients only if environment variables are available
// During build time, these might not be available, so we create mock clients
const createSupabaseClient = (url?: string, key?: string) => {
  if (!url || !key) {
    // Return a mock client for build time
    return {
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        gte: () => ({ lt: () => ({ order: () => ({ ascending: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }) }) }),
        order: () => ({ range: () => Promise.resolve({ data: [], error: null }) }),
      }),
      rpc: () => Promise.resolve({ error: null })
    } as any;
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Client-side client (for browser use)
export const supabase = createSupabaseClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Server-side client (for API routes and server components)
export const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey);

// Database types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keywords: string[];
  reading_time: number;
  published_at: string;
  author: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// Database functions
export async function getTodaysPosts(): Promise<BlogPost[]> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .gte('published_at', `${today}T00:00:00Z`)
    .lt('published_at', `${today}T23:59:59Z`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching today\'s posts:', error);
    return [];
  }

  return data || [];
}

export async function getPostsPaginated(offset: number = 0, limit: number = 3): Promise<BlogPost[]> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching paginated posts:', error);
    return [];
  }

  return data || [];
}

export async function saveBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost | null> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert(post)
    .select()
    .single();

  if (error) {
    console.error('Error saving blog post:', error);
    return null;
  }

  return data;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }

  return data;
}