import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keywords: string[];
  reading_time: number;
  published_at: string;
  author: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

class ImageUpdater {
  private apiKey?: string;
  private baseUrl = 'https://api.x.ai/v1';

  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
  }

  private isConfigured(): boolean {
    return !!this.apiKey;
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
  public async getPlaceholderImage(title: string): Promise<string> {
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

  async updatePostsWithoutImages(): Promise<void> {
    console.log('Fetching all posts to update images...');

    // Get all posts (including those with old placeholder images)
    const { data: posts, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('No posts found.');
      return;
    }

    console.log(`Found ${posts.length} posts. Updating images...`);

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      console.log(`[${i + 1}/${posts.length}] Generating image for: "${post.title}"`);

      try {
        // Generate image for this post
        const imageUrl = await this.generateImage(post.title);

        if (imageUrl) {
          console.log(`Generated image: ${imageUrl}`);

          // Update the post with the new image URL
          const { error: updateError } = await supabaseAdmin
            .from('blog_posts')
            .update({ image_url: imageUrl })
            .eq('id', post.id);

          if (updateError) {
            console.error(`Error updating post "${post.title}":`, updateError);
          } else {
            console.log(`✓ Updated post: "${post.title}"`);
          }
        } else {
          console.warn(`Failed to generate image for post: "${post.title}"`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Error processing post "${post.title}":`, error);
        continue;
      }
    }

    console.log('Image update process completed.');
  }
}

// Export for use in scripts
export const imageUpdater = new ImageUpdater();

// If run directly
if (require.main === module) {
  imageUpdater.updatePostsWithoutImages()
    .then(() => {
      console.log('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}