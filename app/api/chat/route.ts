import { NextRequest, NextResponse } from 'next/server';

// Simple knowledge base for the marketing chatbot
const knowledgeBase: Record<string, { response: string; suggestions?: string[] }> = {
  default: {
    response: `## Welcome to ShieldNest! 🛡️

I'm here to help you learn about our platform. Here's what I can tell you about:

### Our Core Features
• **Portfolio Tracking** - Real-time monitoring of your Coreum assets
• **Staking** - Earn rewards with our enterprise-grade validator
• **Shield NFT** - Premium membership with exclusive benefits
• **Security** - Bank-level protection for your assets

### Quick Links
Visit [v1.shieldnest.org](https://v1.shieldnest.org) to access the full app!

What would you like to know more about?`,
    suggestions: ['Tell me about staking', 'What is Shield NFT?', 'How secure is ShieldNest?']
  },
  staking: {
    response: `## Staking with ShieldNest 💰

Our enterprise-grade validator infrastructure is built for **reliability and security**.

### Why Stake with Us?

• **12-core processors** @ 3.7GHz for maximum performance
• **96GB RAM** for high-throughput operations
• **Dual NVMe storage** for ultra-fast I/O
• **3Gbps network** for low-latency connectivity
• **24/7 monitoring** with automated failover

### Security Features

• Multiple sentry nodes protecting against DDoS
• 3-of-5 multisig wallet protection
• Air-gapped devices for key management
• Geographically distributed servers

Ready to start earning? Visit our [staking dashboard](https://v1.shieldnest.org/dashboard?action=stake)!`,
    suggestions: ['What are the rewards?', 'How to re-delegate?', 'Tell me about security']
  },
  'shield nft': {
    response: `## Shield NFT Membership 💜

The **Shield NFT** is your key to premium features in the ShieldNest ecosystem.

### Exclusive Benefits

• **Private Tier Access** - Enhanced privacy features
• **Priority Support** - Get help faster from our team
• **Governance Rights** - Vote on platform proposals
• **Advanced Analytics** - Deeper insights into your portfolio
• **Early Access** - Be first to try new features
• **Special Rewards** - Bonus staking incentives

### How to Get One

Shield NFTs are available through our marketplace. Hold one in your wallet to automatically unlock all premium features!

Check out [our marketplace](https://v1.shieldnest.org/marketplace) to explore available NFTs.`,
    suggestions: ['How much does it cost?', 'What is Private Tier?', 'Tell me about governance']
  },
  security: {
    response: `## Bank-Level Security 🔐

ShieldNest takes your security **seriously**. Here's how we protect you:

### Your Keys, Your Crypto

• We **never** access your private keys
• All wallet connections use secure protocols
• Read-only access for portfolio tracking

### Infrastructure Security

• Enterprise-grade bare-metal servers
• Multiple backup systems for redundancy
• DDoS protection via sentry nodes
• 3-of-5 multisig for validator operations

### Privacy First

• No selling of user data
• Minimal data collection
• Optional privacy features for Shield NFT holders

Your security is our top priority. Have more questions? Feel free to ask!`,
    suggestions: ['How do I connect my wallet?', 'Tell me about staking', 'What is Shield NFT?']
  },
  coreum: {
    response: `## Coreum Blockchain ⛓️

**Coreum** is an enterprise-grade Layer 1 blockchain designed for real-world adoption.

### Key Features

• **High Performance** - Fast transaction finality
• **Smart Tokens** - Programmable assets without smart contracts
• **ISO 20022** - Compliant with global financial messaging standards
• **Low Fees** - Cost-effective for all transaction sizes

### Why Build on Coreum?

• Enterprise-ready infrastructure
• Developer-friendly environment
• Growing ecosystem of dApps
• Strong validator network (including ShieldNest!)

ShieldNest is built natively on Coreum to give you the best experience possible.

Want to learn more? Check out the [Coreum documentation](https://docs.coreum.dev).`,
    suggestions: ['Tell me about staking', 'What wallets are supported?', 'How to get started?']
  },
  wallet: {
    response: `## Wallet Support 👛

ShieldNest integrates seamlessly with popular **Coreum-compatible wallets**.

### Supported Wallets

• **Keplr** - The most popular Cosmos wallet
• **Leap** - Modern, user-friendly interface
• **Cosmostation** - Feature-rich mobile option

### How to Connect

1. Visit [v1.shieldnest.org](https://v1.shieldnest.org)
2. Click "Connect Wallet" in the top right
3. Choose your preferred wallet
4. Approve the connection request

That's it! Your portfolio will be automatically tracked.

Need help? Our assistant is always here to guide you.`,
    suggestions: ['Is it safe to connect?', 'Tell me about staking', 'What is Shield NFT?']
  }
};

// Find the best matching response based on user input
function findResponse(message: string): { response: string; suggestions?: string[] } {
  const lowerMessage = message.toLowerCase();
  
  // Check for keyword matches
  if (lowerMessage.includes('stak') || lowerMessage.includes('delegate') || lowerMessage.includes('validator') || lowerMessage.includes('earn')) {
    return knowledgeBase.staking;
  }
  if (lowerMessage.includes('shield nft') || lowerMessage.includes('nft') || lowerMessage.includes('private') || lowerMessage.includes('member')) {
    return knowledgeBase['shield nft'];
  }
  if (lowerMessage.includes('secur') || lowerMessage.includes('safe') || lowerMessage.includes('protect') || lowerMessage.includes('key')) {
    return knowledgeBase.security;
  }
  if (lowerMessage.includes('coreum') || lowerMessage.includes('blockchain') || lowerMessage.includes('chain')) {
    return knowledgeBase.coreum;
  }
  if (lowerMessage.includes('wallet') || lowerMessage.includes('keplr') || lowerMessage.includes('leap') || lowerMessage.includes('connect')) {
    return knowledgeBase.wallet;
  }
  
  // Default response
  return knowledgeBase.default;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Find the appropriate response
    const result = findResponse(message);

    return NextResponse.json({
      response: result.response,
      suggestions: result.suggestions,
      canExpand: false
    });
  } catch (error) {
    console.error('[Chat API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
