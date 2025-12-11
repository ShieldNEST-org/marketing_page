-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  reading_time INTEGER NOT NULL DEFAULT 3,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author TEXT NOT NULL DEFAULT 'Shield Nest Team',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_keywords ON blog_posts USING GIN (keywords);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access for blog posts" ON blog_posts
    FOR SELECT USING (true);

-- Create policy for service role to insert/update
CREATE POLICY "Service role can manage blog posts" ON blog_posts
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '[^a-zA-Z0-9\-]', ''), '--', '-'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;