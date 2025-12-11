# SHIELDNEST Marketing Landing Page

A modern, animated marketing landing page for SHIELDNEST - built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with beautiful animations
- **Modern UI**: Gradient backgrounds, glassmorphism effects, and smooth transitions
- **Performance Optimized**: Fast loading times with Next.js App Router
- **SEO Ready**: Metadata and OpenGraph tags configured
- **CTA Integration**: Direct links to app.shieldnest.org
- **Automated Blog System**: Daily AI-generated content with Grok API
- **Database-Driven**: Supabase-powered blog storage and retrieval

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Custom CSS animations and Tailwind utilities
- **Database**: Supabase (PostgreSQL)
- **AI Content**: Grok API (xAI)
- **Deployment**: Vercel with cron jobs

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Setup blog system (database, schema, sample posts)
npm run setup-blog
```

Visit [http://localhost:3000](http://localhost:3000) to see the landing page.

### Blog System Setup

1. **Set up Supabase project** and get your credentials
2. **Get Grok API key** from [console.x.ai](https://console.x.ai/)
3. **Configure environment variables** (see `ENVIRONMENT_SETUP.md`)
4. **Run setup script**: `npm run setup-blog`
5. **Deploy to Vercel** - cron jobs will run automatically

The blog system generates 10 posts daily at 9 AM UTC covering:
- Coreum blockchain security
- Cosmos ecosystem updates
- Airdrop strategies and opportunities
- Trending crypto topics and security tips

## 🌐 Deployment

This site is designed to be deployed on Vercel:

1. Connect this repository to Vercel
2. Configure custom domain: `shieldnest.org`
3. Deploy automatically on push to `main` branch

### Environment Variables

#### Marketing Site
No environment variables are required for the basic marketing site. All links point to:
- **App**: `https://app.shieldnest.org`
- **Beta**: `https://beta.shieldnest.org`

#### Blog System
For the automated blog system, the following environment variables are required:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Grok API Configuration
GROK_API_KEY=your_grok_api_key

# Cron Job Authentication
CRON_SECRET_TOKEN=your_secure_token_for_cron_jobs
```

See `ENVIRONMENT_SETUP.md` for detailed setup instructions.

## 📁 Project Structure

```
/
├── app/
│   ├── api/
│   │   ├── blog/           # Blog API endpoints
│   │   └── cron/           # Cron job endpoints
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout with metadata
│   └── globals.css         # Global styles and animations
├── components/
│   └── BlogSection.tsx     # Blog display component
├── database/
│   └── schema.sql          # Database schema
├── lib/
│   ├── supabase.ts         # Database client
│   └── blog-generator.ts   # AI content generation
├── public/                 # Static assets
├── scripts/
│   └── setup-blog.js       # Setup automation script
└── ENVIRONMENT_SETUP.md    # Environment configuration guide
```

## 🎨 Sections

1. **Hero Section**: Eye-catching headline with CTA buttons
2. **Features**: Grid layout showcasing key features
3. **Benefits**: Why choose SHIELDNEST
4. **Pricing**: User tier comparison
5. **Blog Section**: Daily AI-generated crypto security content
6. **Final CTA**: Strong call-to-action
7. **Footer**: Navigation and links

### Blog System Features

- **Automated Content**: 10 posts generated daily using Grok AI
- **Diverse Topics**: Coreum, Cosmos, airdrops, security, and trending crypto topics
- **Smart Display**: Shows today's posts first, with "Load More" for history
- **Database Storage**: Persistent storage with Supabase
- **SEO Optimized**: Structured data and meta tags
- **Cost Effective**: Uses efficient AI models and optional image generation

## 🔗 Links

- **Marketing**: [shieldnest.org](https://shieldnest.org)
- **App**: [app.shieldnest.org](https://app.shieldnest.org)
- **Beta**: [beta.shieldnest.org](https://beta.shieldnest.org)

## 📝 License

Copyright © 2025 SHIELDNEST. All rights reserved.
