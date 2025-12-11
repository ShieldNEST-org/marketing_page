#!/usr/bin/env node

/**
 * Blog System Setup Script
 *
 * This script helps set up the blog system by:
 * 1. Checking environment variables
 * 2. Testing database connection
 * 3. Running initial database migrations
 * 4. Generating sample blog posts (optional)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function setupBlogSystem() {
  console.log('🚀 Setting up Shield Nest Blog System...\n');

  // Check environment variables
  console.log('📋 Checking environment variables...');
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GROK_API_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.log('\nPlease check ENVIRONMENT_SETUP.md for setup instructions.');
    process.exit(1);
  }
  console.log('✅ All required environment variables are set.\n');

  // Test database connection
  console.log('🔗 Testing database connection...');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data, error } = await supabase.from('blog_posts').select('count').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows" error, which is expected
      throw error;
    }
    console.log('✅ Database connection successful.\n');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('Please check your Supabase configuration.');
    process.exit(1);
  }

  // Run database schema
  console.log('📄 Setting up database schema...');
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSQL });
    if (error) {
      // Try executing statements individually
      const statements = schemaSQL.split(';').filter(stmt => stmt.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement });
          if (stmtError && !stmtError.message.includes('already exists')) {
            throw stmtError;
          }
        }
      }
    }
    console.log('✅ Database schema setup complete.\n');
  } catch (error) {
    console.error('❌ Database schema setup failed:', error.message);
    console.log('You may need to run the schema manually in your Supabase dashboard.');
  }

  // Optional: Generate sample posts
  const generateSample = process.argv.includes('--generate-sample');
  if (generateSample) {
    console.log('📝 Generating sample blog posts...');
    try {
      // Import the blog generator (this assumes we're in a Node environment that can handle ES modules)
      const { blogGenerator } = await import('../lib/blog-generator.js');

      const posts = await blogGenerator.generateAndSavePosts(5);
      console.log(`✅ Generated and saved ${posts.length} sample blog posts.\n`);
    } catch (error) {
      console.error('❌ Sample post generation failed:', error.message);
      console.log('You can generate posts manually or wait for the daily cron job.');
    }
  }

  console.log('🎉 Blog system setup complete!');
  console.log('\nNext steps:');
  console.log('1. Deploy to Vercel');
  console.log('2. Set up environment variables in Vercel dashboard');
  console.log('3. The daily cron job will run at 9 AM UTC');
  console.log('4. Check your blog section to see the posts');

  if (!generateSample) {
    console.log('\nTo generate sample posts now, run: npm run setup-blog -- --generate-sample');
  }
}

setupBlogSystem().catch(console.error);