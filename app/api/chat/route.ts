import { NextRequest, NextResponse } from 'next/server';

/**
 * ShieldChat API Route - Marketing Site
 * 
 * Proxies chat requests to the main app (v1.shieldnest.org) 
 * to leverage the unified knowledge base and LLM gateway.
 */

const MAIN_APP_URL = process.env.MAIN_APP_URL || 'https://v1.shieldnest.org';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log(`[ShieldChat Marketing] Proxying message for session ${sessionId} to ${MAIN_APP_URL}`);

    // Proxy the request to the main app
    const response = await fetch(`${MAIN_APP_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
        project: 'shieldnest-marketing', // Identify source
        expand: false
      }),
      // Set a reasonable timeout
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ShieldChat Marketing] Proxy error (${response.status}):`, errorText);
      throw new Error(`Main app chat API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('[ShieldChat Marketing] Error:', error);
    
    // Fallback response if the main app is unreachable
    return NextResponse.json({
      response: `## ShieldNest Assistant 🛡️

I'm currently having trouble connecting to my central knowledge base. In the meantime:

• Visit [v1.shieldnest.org](https://v1.shieldnest.org) for the full app experience
• Learn about our enterprise-grade validator infrastructure
• Explore Shield NFT benefits

Please try again in a few moments!`,
      suggestions: ['Visit the app', 'Tell me about staking', 'What is ShieldNest?'],
      canExpand: false
    });
  }
}

// OPTIONS for CORS support
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  });
}
