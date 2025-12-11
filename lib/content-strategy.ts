/**
 * SHIELDNEST Content Strategy
 * 
 * This file defines the content themes, topics, and messaging for blog generation.
 * Update this file to change what topics are covered without modifying the generator code.
 */

// Core value propositions for Coreum
export const COREUM_VALUE_PROPS = {
  speed: "Coreum processes 7,000+ TPS with 1-second finality - faster than Ethereum, Solana, and most L1s",
  cost: "Near-zero gas fees make Coreum perfect for everyday transactions and micro-payments",
  rwa: "Built-in Smart Tokens enable compliant real-world asset tokenization without complex smart contracts",
  security: "Enterprise-grade security with deterministic gas and built-in compliance features",
  interoperability: "IBC-enabled for seamless cross-chain transfers across the Cosmos ecosystem",
  enterprise: "Designed for institutional adoption with KYC/AML compliance built into the protocol",
};

// Comparison talking points (friendly, factual, not FUD)
export const CHAIN_COMPARISONS = {
  bitcoin: {
    respect: "Bitcoin pioneered cryptocurrency and remains the gold standard for store of value",
    limitation: "Bitcoin wasn't designed for fast, cheap everyday transactions or smart contracts",
    coreum_solution: "Coreum brings Bitcoin-level security with modern transaction speeds and programmability",
  },
  ethereum: {
    respect: "Ethereum created the smart contract revolution and hosts the largest DeFi ecosystem",
    limitation: "High gas fees and network congestion make Ethereum challenging for everyday users",
    coreum_solution: "Coreum offers Ethereum-like programmability with predictable, near-zero fees",
  },
  solana: {
    respect: "Solana pushed the boundaries of blockchain speed and attracted massive adoption",
    limitation: "Network outages and centralization concerns have raised questions about reliability",
    coreum_solution: "Coreum matches Solana's speed with battle-tested Cosmos SDK reliability",
  },
  sui: {
    respect: "SUI brings innovative object-centric architecture and parallel execution",
    limitation: "New ecosystem still building liquidity and developer tools",
    coreum_solution: "Coreum leverages the mature Cosmos ecosystem with instant IBC liquidity access",
  },
};

// Content categories with weighted probability for selection
export const CONTENT_CATEGORIES = [
  {
    name: "Hot Crypto Topics",
    weight: 25,
    description: "Trending topics to attract mainstream crypto audience",
    topics: [
      "Why crypto veterans are looking beyond Ethereum for the next cycle",
      "The real-world asset revolution: Why RWA tokens are the next big thing",
      "Bitcoin ETF impact: What it means for altcoin season",
      "Memecoin mania vs utility tokens: Where smart money is moving",
      "Layer 1 wars: Which blockchain will dominate 2025",
      "Cross-chain future: Why interoperability matters more than ever",
      "Institutional crypto adoption: The quiet revolution happening now",
      "DeFi 2.0: What the next generation of decentralized finance looks like",
      "NFT utility beyond art: Real use cases emerging in 2025",
      "Crypto regulation clarity: How compliant chains will win",
      "The speed race: Why transaction finality matters for adoption",
      "Gas fee crisis: Chains solving the cost problem",
      "Staking rewards comparison: Where to earn the best yields",
      "Crypto gaming renaissance: Which chains are winning",
      "AI meets blockchain: The convergence everyone's watching",
    ]
  },
  {
    name: "Chain Migration Stories",
    weight: 20,
    description: "Content targeting users from other ecosystems",
    topics: [
      "From Ethereum to Cosmos: A developer's journey to lower fees",
      "Why Solana traders are exploring Cosmos ecosystem alternatives",
      "Bitcoin maxis discovering smart contract capabilities",
      "SUI vs Coreum: An honest comparison for new builders",
      "Ethereum bridge fatigue: Native IBC as the solution",
      "What Solana's outages taught us about blockchain architecture",
      "Moving from high-gas chains: A step-by-step mental framework",
      "The multi-chain future: Why you shouldn't be chain-loyal",
      "Layer 2 exhaustion: When L1 simplicity makes more sense",
      "Cross-chain portfolio strategy for the modern investor",
    ]
  },
  {
    name: "Real World Assets & Enterprise",
    weight: 20,
    description: "RWA tokenization and institutional adoption",
    topics: [
      "Real estate on blockchain: How tokenization is democratizing property investment",
      "Commodity tokenization: Gold, oil, and beyond on Coreum",
      "Why enterprises choose compliant-first blockchains",
      "KYC-ready tokens: The future of regulated crypto",
      "Supply chain transparency: Blockchain's killer enterprise use case",
      "Fractional ownership revolution: Invest in anything with $10",
      "Carbon credits on chain: Environmental assets going digital",
      "Art tokenization: Making museum pieces accessible to everyone",
      "Invoice financing meets DeFi: Real business applications",
      "Smart Tokens explained: Coreum's approach to programmable assets",
    ]
  },
  {
    name: "Cosmos Ecosystem",
    weight: 15,
    description: "IBC, Cosmos Hub, and ecosystem updates",
    topics: [
      "IBC protocol: The internet of blockchains explained",
      "Cosmos airdrops: How to position for the next big drop",
      "Interchain security: Shared security across Cosmos",
      "Top Cosmos chains to watch in 2025",
      "Staking across Cosmos: Maximizing your rewards",
      "Cosmos vs Polkadot vs Avalanche: Interoperability showdown",
      "The Cosmos Hub roadmap: What's coming next",
      "AppChain thesis: Why application-specific blockchains win",
      "Liquid staking in Cosmos: Options and opportunities",
      "Cosmos governance: How decisions get made on-chain",
    ]
  },
  {
    name: "Security & Best Practices",
    weight: 10,
    description: "Wallet security and crypto safety",
    topics: [
      "Crypto security checklist for 2025",
      "Hardware wallet vs software wallet: Making the right choice",
      "Phishing attacks in crypto: How to protect yourself",
      "Smart contract risks: What to check before interacting",
      "Seed phrase security: The ultimate guide",
      "DeFi rug pull red flags every investor should know",
      "Bridge security: Safest ways to move assets cross-chain",
      "Recovery planning: Don't lose access to your crypto",
    ]
  },
  {
    name: "Investment & Trading",
    weight: 10,
    description: "Market analysis and investment strategies",
    topics: [
      "Bull market preparation: Portfolio positioning strategies",
      "Altcoin season indicators: What to watch for",
      "Dollar-cost averaging in crypto: A stress-free approach",
      "Yield farming strategies for risk-adjusted returns",
      "Token unlocks and vesting: Impact on price action",
      "Crypto tax strategies: Minimize your burden legally",
      "Market cycles: Historical patterns and future predictions",
      "Risk management in volatile markets",
    ]
  },
];

// Brand voice and messaging guidelines
export const BRAND_VOICE = {
  tone: "Friendly, knowledgeable, and helpful - never aggressive or FUD-spreading",
  approach: "Educate and inform rather than hard-sell",
  cta: "Subtle mentions of SHIELDNEST and Coreum benefits without being pushy",
  competitor_mentions: "Respectful of other chains while highlighting Coreum advantages",
};

// SEO keywords to incorporate
export const SEO_KEYWORDS = [
  "Coreum blockchain",
  "SHIELDNEST",
  "real world assets",
  "RWA tokenization",
  "Cosmos ecosystem",
  "IBC protocol",
  "low gas fees",
  "fast transactions",
  "enterprise blockchain",
  "compliant crypto",
  "smart tokens",
  "cross-chain",
  "crypto security",
  "DeFi",
  "staking rewards",
  "blockchain interoperability",
];

// Helper function to select a weighted random category
export function selectWeightedCategory(): typeof CONTENT_CATEGORIES[0] {
  const totalWeight = CONTENT_CATEGORIES.reduce((sum, cat) => sum + cat.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const category of CONTENT_CATEGORIES) {
    random -= category.weight;
    if (random <= 0) {
      return category;
    }
  }
  
  return CONTENT_CATEGORIES[0];
}

// Helper function to get a random topic from a category
export function getRandomTopic(category: typeof CONTENT_CATEGORIES[0]): string {
  const index = Math.floor(Math.random() * category.topics.length);
  return category.topics[index];
}

// Helper function to get random value props
export function getRandomValueProps(count: number = 2): string[] {
  const props = Object.values(COREUM_VALUE_PROPS);
  const shuffled = props.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to get a random chain comparison
export function getRandomComparison(): { chain: string; data: typeof CHAIN_COMPARISONS.bitcoin } {
  const chains = Object.keys(CHAIN_COMPARISONS) as (keyof typeof CHAIN_COMPARISONS)[];
  const randomChain = chains[Math.floor(Math.random() * chains.length)];
  return {
    chain: randomChain,
    data: CHAIN_COMPARISONS[randomChain],
  };
}

// Generate a comprehensive prompt context for blog generation
export function generatePromptContext(): string {
  const category = selectWeightedCategory();
  const topic = getRandomTopic(category);
  const valueProps = getRandomValueProps(2);
  const comparison = getRandomComparison();
  const keywords = SEO_KEYWORDS.sort(() => 0.5 - Math.random()).slice(0, 5);

  return `
CONTENT CATEGORY: ${category.name}
TOPIC: ${topic}

COREUM VALUE PROPOSITIONS TO WEAVE IN:
${valueProps.map(p => `- ${p}`).join('\n')}

CHAIN COMPARISON CONTEXT (if relevant):
- Respect for ${comparison.chain}: ${comparison.data.respect}
- Their limitation: ${comparison.data.limitation}  
- Coreum solution: ${comparison.data.coreum_solution}

BRAND VOICE GUIDELINES:
- Tone: ${BRAND_VOICE.tone}
- Approach: ${BRAND_VOICE.approach}
- CTAs: ${BRAND_VOICE.cta}
- Competitor mentions: ${BRAND_VOICE.competitor_mentions}

SEO KEYWORDS TO INCLUDE: ${keywords.join(', ')}

IMPORTANT: Create engaging content that naturally brings readers to discover Coreum and SHIELDNEST. 
Don't just talk about security - cover the hot topic in a way that positions Coreum as the solution.
`;
}