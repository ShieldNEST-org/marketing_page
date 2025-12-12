import { saveBlogPost } from './supabase';
import { 
  generatePromptContext, 
  selectWeightedCategory, 
  getRandomTopic,
  BRAND_VOICE,
  SEO_KEYWORDS 
} from './content-strategy';

interface BlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keywords: string[];
  readingTime: number;
  publishedAt: string;
  author: string;
  imageUrl?: string;
}

class BlogGenerator {
  private apiKey?: string;
  private baseUrl = 'https://api.x.ai/v1';

  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
  }

  private isConfigured(): boolean {
    return !!this.apiKey;
  }

  private async generateWithGrok(prompt: string, maxTokens: number = 4000): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Grok API is not configured. Please set GROK_API_KEY environment variable.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'grok-3-mini-fast',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Grok API:', error);
      throw error;
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async generateImage(title: string): Promise<string | undefined> {
    if (!this.isConfigured()) {
      console.warn('Grok API not configured, using placeholder image');
      return await this.getPlaceholderImage(title);
    }

    try {
      const imagePrompt = `Create a professional illustration for a blog post titled: "${title}". Style: modern tech, blockchain/cryptocurrency theme, clean and minimal design with dark background. Focus on security, innovation, and digital concepts. Colors: green (#25d695), purple (#a855f7), and blue (#4d9cff) accents.`;

      // Use xAI's Aurora image generation model
      const imageResponse = await fetch('https://api.x.ai/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          model: 'grok-2-image-generation',
          n: 1,
          response_format: 'url'
        }),
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.warn('Image generation failed:', imageResponse.status, errorText);
        // Fall back to placeholder on error
        return this.getPlaceholderImage(title);
      }

      const imageData = await imageResponse.json();

      // Handle different response formats from xAI
      if (imageData.data && imageData.data[0]) {
        const imgData = imageData.data[0];
        if (imgData.url) {
          return imgData.url;
        } else if (imgData.b64_json) {
          // Convert base64 to data URL if that's the format returned
          return `data:image/png;base64,${imgData.b64_json}`;
        }
      } else if (imageData.url) {
        return imageData.url;
      }
      
      console.warn('Unexpected image response format:', JSON.stringify(imageData).substring(0, 200));
      return await this.getPlaceholderImage(title);
    } catch (error) {
      console.warn('Image generation error:', error);
      return await this.getPlaceholderImage(title);
    }
  }

  // Generate realistic images using completely free services
  private async getPlaceholderImage(title: string): Promise<string> {
    try {
      // Use Lorem Picsum - completely free and reliable, no API key needed
      // Generate a deterministic seed based on title for consistent images
      const seed = this.generateDeterministicSeed(title);
      return `https://picsum.photos/800/600?random=${seed}`;
    } catch (error) {
      console.warn('Picsum failed:', error);
      // Ultimate fallback - improved placeholder with better colors
      return this.getImprovedPlaceholder(title);
    }
  }

  private generateDeterministicSeed(title: string): number {
    // Create a deterministic number from the title for consistent images
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      const char = title.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 1000; // Keep it reasonable for the random parameter
  }

  private extractCryptoKeywords(title: string): string[] {
    const cryptoTerms = [
      'bitcoin', 'ethereum', 'crypto', 'blockchain', 'defi', 'nft', 'token', 'wallet',
      'coreum', 'cosmos', 'sui', 'solana', 'trading', 'mining', 'staking', 'yield',
      'portfolio', 'security', 'finance', 'investment', 'market', 'exchange'
    ];

    const lowerTitle = title.toLowerCase();
    return cryptoTerms.filter(term => lowerTitle.includes(term));
  }

  private getImprovedPlaceholder(title: string): string {
    // Professional color scheme - modern tech colors
    const techColors = [
      '0f172a', // Dark slate
      '1e293b', // Slate
      '334155', // Light slate
      '0f1419', // Dark
      '1a1a2e', // Dark blue-gray
    ];

    const accentColors = [
      '00d4aa', // SHIELDNEST green
      '8b5cf6', // Purple
      '3b82f6', // Blue
      '06b6d4', // Cyan
      '10b981'  // Emerald
    ];

    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bgColor = techColors[hash % techColors.length];
    const accentColor = accentColors[hash % accentColors.length];

    // Create a modern gradient placeholder
    return `https://via.placeholder.com/800x600/${bgColor}/${accentColor}?text=${encodeURIComponent(title.substring(0, 40))}`;
  }

  async generateBlogPosts(count: number = 10): Promise<BlogPostData[]> {
    const posts: BlogPostData[] = [];

    for (let i = 0; i < count; i++) {
      try {
        // Get dynamic content context from strategy
        const category = selectWeightedCategory();
        const topic = getRandomTopic(category);
        const contentContext = generatePromptContext();

        console.log(`Generating blog post [${i + 1}/${count}] - Category: ${category.name}`);
        console.log(`Topic: ${topic}`);

        const prompt = `You are a crypto thought leader and content strategist writing for SHIELDNEST, a portfolio management and security platform built on the Coreum blockchain.

${contentContext}

TASK: Write an engaging, viral-worthy blog post that:
1. Hooks readers with the trending topic
2. Provides genuine value and insights
3. Naturally weaves in Coreum/SHIELDNEST benefits (don't force it)
4. Ends with a subtle call-to-action

Requirements:
- Title: Clickable, SEO-friendly, creates curiosity (max 70 characters)
- Excerpt: Hook that makes readers want to click (max 160 characters)
- Content: 300-500 words, conversational tone, include data/stats when relevant
- Keywords: 4-6 relevant SEO keywords
- Reading time: Estimate based on content length
- Author: "Shield Nest Team"

IMPORTANT: This is NOT just a security blog. Cover hot crypto topics that bring in traffic from 
Ethereum, Solana, Bitcoin, and SUI communities. Be friendly to other chains while showing why 
Coreum is worth exploring.

Return as valid JSON with this exact structure:
{
  "title": "Blog Post Title",
  "excerpt": "Brief description...",
  "content": "Full blog content with paragraphs separated by newlines...",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "readingTime": 3
}`;

        const grokResponse = await this.generateWithGrok(prompt, 2000);
        const cleanResponse = grokResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');

        let postData;
        try {
          postData = JSON.parse(cleanResponse);
        } catch (parseError) {
          console.error('Failed to parse Grok response:', cleanResponse);
          continue;
        }

        // Generate image based on the blog post title
        console.log(`Generating image for: "${postData.title}"`);
        const imageUrl = await this.generateImage(postData.title);

        if (imageUrl) {
          console.log(`Generated image: ${imageUrl}`);
        } else {
          console.log('Image generation skipped or failed');
        }

        const blogPost: BlogPostData = {
          title: postData.title,
          slug: this.generateSlug(postData.title),
          excerpt: postData.excerpt,
          content: postData.content,
          keywords: postData.keywords || [],
          readingTime: postData.readingTime || 3,
          publishedAt: new Date().toISOString(),
          author: 'Shield Nest Team',
          imageUrl,
        };

        posts.push(blogPost);

        // Small delay to avoid rate limiting (longer for image generation)
        await new Promise(resolve => setTimeout(resolve, 3000));

      } catch (error) {
        console.error(`Error generating post [${i + 1}/${count}]:`, error);
        continue;
      }
    }

    return posts;
  }

  async generateAndSavePosts(count: number = 10): Promise<BlogPostData[]> {
    const posts = await this.generateBlogPosts(count);

    console.log(`Generated ${posts.length} blog posts, saving to database...`);

    for (const post of posts) {
      try {
        await saveBlogPost({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          keywords: post.keywords,
          reading_time: post.readingTime,
          published_at: post.publishedAt,
          author: post.author,
          image_url: post.imageUrl,
        });
        console.log(`Saved post: ${post.title}`);
      } catch (error) {
        console.error(`Error saving post "${post.title}":`, error);
      }
    }

    return posts;
  }
}

export const blogGenerator = new BlogGenerator();