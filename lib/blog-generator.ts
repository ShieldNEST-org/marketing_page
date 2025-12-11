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
          model: 'grok-beta',
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
      console.warn('Grok API not configured, skipping image generation');
      return undefined;
    }

    try {
      const imagePrompt = `Create a professional illustration for a blog post titled: "${title}". Style: modern tech, blockchain/cryptocurrency theme, clean and minimal design. Focus on security, innovation, and digital concepts. Make it suitable for a tech blog about crypto security.`;

      // Use xAI's image generation API
      const imageResponse = await fetch('https://api.x.ai/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          model: 'grok-2-image',
          n: 1,
          size: '512x512',
          response_format: 'url'
        }),
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.warn('Image generation failed:', imageResponse.status, errorText);
        return undefined;
      }

      const imageData = await imageResponse.json();

      // Handle different response formats
      if (imageData.data && imageData.data[0] && imageData.data[0].url) {
        return imageData.data[0].url;
      } else if (imageData.url) {
        return imageData.url;
      } else {
        console.warn('Unexpected image response format:', imageData);
        return undefined;
      }
    } catch (error) {
      console.warn('Image generation error:', error);
      return undefined;
    }
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