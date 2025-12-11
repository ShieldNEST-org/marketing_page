#!/usr/bin/env node

/**
 * Test script for xAI image generation
 * Run with: npm run test-image
 */

import { blogGenerator } from '../lib/blog-generator.js';

async function testImageGeneration() {
  console.log('🖼️ Testing xAI Image Generation...\n');

  try {
    const testTitles = [
      'Coreum Blockchain Security Best Practices',
      'Cosmos IBC Protocol Vulnerabilities',
      'DeFi Smart Contract Auditing Guide',
      'NFT Marketplace Security Threats'
    ];

    for (const title of testTitles) {
      console.log(`🎨 Generating image for: "${title}"`);

      // Test the image generation directly
      const generator = new blogGenerator.constructor();
      const imageUrl = await generator.generateImage(title);

      if (imageUrl) {
        console.log(`✅ Success: ${imageUrl}\n`);
      } else {
        console.log(`❌ Failed to generate image for: "${title}"\n`);
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('🎉 Image generation test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testImageGeneration();