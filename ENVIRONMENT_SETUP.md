# Environment Variables Setup

## Required Environment Variables

### Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Grok API Configuration
```bash
GROK_API_KEY=your_grok_api_key
```

### Vercel Cron Authentication
```bash
CRON_SECRET=your_cron_secret_here
```
Note: This is the standard Vercel environment variable for cron job authentication.

### Legacy (Optional - will be removed)
```bash
OPENAI_API_KEY=your_openai_api_key
```

## Setup Instructions

1. **Create a Supabase Project:**
   - Go to https://supabase.com
   - Create a new project
   - Run the SQL schema from `database/schema.sql` in the Supabase SQL editor

2. **Get Grok API Key:**
   - Visit https://console.x.ai/
   - Create an account and get your API key

3. **Set Environment Variables:**
   - Copy the variables above to your `.env.local` file
   - For Vercel deployment, add them in your project settings

## Database Schema

The blog posts are stored in a `blog_posts` table with the following structure:
- `id`: UUID primary key
- `title`: Post title
- `slug`: URL-friendly slug
- `excerpt`: Brief description
- `content`: Full post content
- `keywords`: Array of SEO keywords
- `reading_time`: Estimated reading time in minutes
- `published_at`: Publication timestamp
- `author`: Author name (defaults to "Shield Nest Team")
- `image_url`: Optional image URL
- `created_at`/`updated_at`: Timestamps