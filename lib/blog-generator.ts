import { saveBlogPost } from './supabase';

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

// Expanded topics for crypto/blockchain content
const BLOG_TOPICS = [
  // Coreum specific
  'Coreum blockchain security',
  'Coreum smart contracts',
  'Coreum DeFi protocols',
  'Coreum NFT marketplace',
  'Coreum governance',
  'Coreum staking rewards',

  // Cosmos ecosystem
  'Cosmos Hub updates',
  'IBC protocol security',
  'Cosmos SDK development',
  'Interchain security',
  'Cosmos airdrops',
  'Cosmos validator operations',

  // Airdrops and incentives
  'Crypto airdrop strategies',
  'DeFi airdrop hunting',
  'Layer 2 airdrops',
  'NFT project airdrops',
  'Blockchain testnet rewards',
  'Community airdrop participation',

  // Security topics
  'Wallet security best practices',
  'Smart contract auditing',
  'DeFi security risks',
  'NFT security threats',
  'Cross-chain bridge security',
  'Crypto scam prevention',

  // Trending topics
  'Layer 2 scaling solutions',
  'Web3 gaming security',
  'DAO security frameworks',
  'Cryptocurrency regulation updates',
  'Zero-knowledge proofs',
  'Blockchain interoperability',

  // Technical deep dives
  'Consensus mechanism analysis',
  'Token economics design',
  'Blockchain oracle security',
  'Decentralized identity solutions',
  'Privacy-preserving technologies',
  'Sustainable blockchain mining'
];

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
    try {
      const imagePrompt = `Create a professional, cost-effective illustration for a blog post titled: "${title}". Style: modern tech, blockchain/cryptocurrency theme, clean and minimal design. Focus on security and innovation concepts.`;

      const imageResponse = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          n: 1,
          size: '512x512',
        }),
      });

      if (!imageResponse.ok) {
        console.warn('Image generation failed, continuing without image');
        return undefined;
      }

      const imageData = await imageResponse.json();
      return imageData.data[0].url;
    } catch (error) {
      console.warn('Image generation error:', error);
      return undefined;
    }
  }

  async generateBlogPosts(count: number = 10): Promise<BlogPostData[]> {
    const posts: BlogPostData[] = [];
    const selectedTopics = BLOG_TOPICS.sort(() => 0.5 - Math.random()).slice(0, count);

    for (const topic of selectedTopics) {
      try {
        console.log(`Generating blog post for topic: ${topic}`);

        const prompt = `You are a crypto security expert writing for SHIELDNEST, a Coreum blockchain security platform.

Generate ONE high-quality, SEO-optimized blog post about: "${topic}".

Requirements:
- Title: Compelling and SEO-friendly (max 70 characters)
- Excerpt: 1-2 sentences, engaging summary (max 160 characters)
- Content: 200-400 words, informative, practical advice, include SHIELDNEST benefits
- Keywords: 3-5 relevant SEO keywords
- Reading time: Estimate based on content length
- Author: "Shield Nest Team"

Return as valid JSON with this exact structure:
{
  "title": "Blog Post Title",
  "excerpt": "Brief description...",
  "content": "Full blog content...",
  "keywords": ["keyword1", "keyword2", "keyword3"],
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

        // Generate image (optional, cost-effective)
        const imageUrl = await this.generateImage(postData.title);

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

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error generating post for topic "${topic}":`, error);
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