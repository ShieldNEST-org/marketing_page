import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the ShieldNest assistant
const SYSTEM_PROMPT = `You are the ShieldNest Assistant, a friendly and knowledgeable DeFi guide for the ShieldNest platform built on the Coreum blockchain.

## Your Personality
- Friendly, approachable, and helpful
- Use emojis sparingly but effectively (🛡️ 💰 ⛓️ 💜)
- Keep responses concise but informative
- Break up text with headers and bullet points for readability

## Key Information About ShieldNest

### Platform Features
- **Portfolio Tracking**: Real-time monitoring of Coreum assets
- **Staking**: Enterprise-grade validator with 12-core processors, 96GB RAM, dual NVMe, 3Gbps network
- **Shield NFT**: Premium membership NFT that unlocks private tier features
- **Security**: Bank-level protection, never access private keys, read-only wallet connections

### Validator Infrastructure
- 12-core processors @ 3.7GHz
- 96GB RAM for high-throughput
- Dual NVMe storage
- 3Gbps network connectivity
- 24/7 monitoring with automated failover
- Multiple sentry nodes for DDoS protection
- 3-of-5 multisig wallet protection
- Geographically distributed servers

### Shield NFT Benefits
- Private Tier access with enhanced privacy
- Priority support
- Governance voting rights
- Advanced analytics
- Early access to new features
- Bonus staking rewards

### Coreum Blockchain
- Enterprise-grade Layer 1 blockchain
- Smart Tokens (programmable without smart contracts)
- ISO 20022 compliant
- Fast transaction finality
- Low fees

### Supported Wallets
- Keplr
- Leap
- Cosmostation

### Important Links
- Main App: https://v1.shieldnest.org
- Staking: https://v1.shieldnest.org/dashboard?action=stake
- Marketplace: https://v1.shieldnest.org/marketplace
- Re-delegate: https://v1.shieldnest.org/dashboard?action=redelegate

## Response Formatting
- Use markdown headers (##, ###) for sections
- Use **bold** for emphasis
- Use bullet points for lists
- Keep paragraphs short (2-3 sentences max)
- Add line breaks between sections for readability
- Include relevant links when appropriate

## Guidelines
- Always be helpful and encouraging
- If you don't know something specific, be honest but offer to help with related topics
- Focus on ShieldNest, Coreum, DeFi, staking, and crypto security topics

## IMPORTANT: Offering App Actions
When users ask about taking actions (staking, swapping, connecting wallet, etc.), explain the feature AND actively offer to take them to the app:

- For staking questions: "Ready to start staking? I can take you right to our [staking page](https://v1.shieldnest.org/dashboard?action=stake) to get started!"
- For wallet questions: "Want to connect your wallet? Head over to [our app](https://v1.shieldnest.org) and click Connect Wallet in the top right!"
- For NFT questions: "Interested in Shield NFTs? Check out [our marketplace](https://v1.shieldnest.org/marketplace) to browse available NFTs!"
- For re-delegation: "Need to re-delegate? We've got you covered - [click here to re-delegate](https://v1.shieldnest.org/dashboard?action=redelegate) and start earning with ShieldNest!"
- For swapping: "Ready to swap some tokens? Open [our app](https://v1.shieldnest.org) to access the swap feature!"

Always make the user feel welcome to take action, and provide the direct link to help them get started quickly.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('[Chat API] OPENAI_API_KEY not configured');
      return NextResponse.json({
        response: `## Welcome to ShieldNest! 🛡️

I'm your DeFi assistant. While I'm being configured, here's what you can do:

• Visit [v1.shieldnest.org](https://v1.shieldnest.org) to access the full app
• Learn about staking with our enterprise-grade validator
• Explore Shield NFT benefits for premium features

Feel free to ask me anything about Coreum, DeFi, or crypto security!`,
        suggestions: ['Tell me about staking', 'What is Shield NFT?', 'How secure is ShieldNest?'],
        canExpand: false
      });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const assistantResponse = completion.choices[0]?.message?.content || 
      'I apologize, but I couldn\'t generate a response. Please try again.';

    // Generate contextual suggestions based on the response
    const suggestions = generateSuggestions(message, assistantResponse);

    return NextResponse.json({
      response: assistantResponse,
      suggestions,
      canExpand: false
    });
  } catch (error) {
    console.error('[Chat API] Error:', error);
    
    // Return a friendly fallback response on error
    return NextResponse.json({
      response: `## Oops! Something went wrong 😅

I'm having trouble connecting right now. In the meantime:

• Visit [v1.shieldnest.org](https://v1.shieldnest.org) to explore the app
• Check out our staking features
• Learn about Shield NFT benefits

Please try again in a moment!`,
      suggestions: ['Tell me about staking', 'What is Shield NFT?', 'How does Coreum work?'],
      canExpand: false
    });
  }
}

// Generate contextual follow-up suggestions
function generateSuggestions(userMessage: string, response: string): string[] {
  const lowerMessage = userMessage.toLowerCase();
  const lowerResponse = response.toLowerCase();
  
  // Default suggestions
  const allSuggestions = [
    'Tell me about staking',
    'What is Shield NFT?',
    'How secure is ShieldNest?',
    'What is Coreum?',
    'How do I connect my wallet?',
    'What are the staking rewards?',
    'Tell me about Private Tier',
    'How to re-delegate?'
  ];
  
  // Filter out suggestions that are similar to what was just asked
  const filtered = allSuggestions.filter(s => {
    const lowerSuggestion = s.toLowerCase();
    // Don't suggest if it's too similar to the user's message
    if (lowerMessage.includes(lowerSuggestion.slice(0, 10))) return false;
    // Don't suggest if it was already covered in the response
    if (lowerResponse.includes(lowerSuggestion.slice(0, 10))) return false;
    return true;
  });
  
  // Return 3 random suggestions
  return filtered.sort(() => Math.random() - 0.5).slice(0, 3);
}
