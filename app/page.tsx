'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  IoWalletOutline, 
  IoPieChartOutline, 
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoSpeedometerOutline,
  IoLockOpenOutline,
  IoCheckmarkCircleOutline,
  IoGlobeOutline
} from 'react-icons/io5';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-900">
        <div className="container flex h-16 py-2 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[88rem] mx-auto">
          {/* Logo & Brand with Social Icons */}
          <div className="flex items-center gap-1.5">
            {/* Logo */}
            <a href="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
              <Image
                src="/shld_dark.svg"
                alt="ShieldNest Logo"
                width={33}
                height={33}
                className="object-contain w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-12 lg:h-12"
                priority
              />
            </a>
            
            {/* Brand Name & Social Icons */}
            <div className="flex flex-col">
              <a href="/" className="hover:opacity-80 transition-opacity">
                <h1 className="font-bold text-lg text-white">
                  ShieldNEST
                </h1>
              </a>
              
              {/* Social Icons underneath the text */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <a
                  href="https://github.com/ShieldNEST-org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity group"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4 text-[#A855F7] group-hover:text-[#25d695] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/shieldnest_org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity group"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-4 h-4 text-[#A855F7] group-hover:text-[#25d695] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-gray-300">
            <a href="#features" className="hover:text-[#25d695] transition-colors">Features</a>
            <a href="#benefits" className="hover:text-[#25d695] transition-colors">Benefits</a>
            <a href="#pricing" className="hover:text-[#25d695] transition-colors">Pricing</a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <a 
              href="https://app.shieldnest.org"
              className="btn-coreum-green px-6 py-2 text-sm"
            >
              Launch App →
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 min-h-screen flex items-center py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs - Smoother rendering */}
          <div className="absolute top-20 left-10 w-[32rem] h-[32rem] bg-gradient-to-br from-[#25d695]/30 via-[#25d695]/10 to-transparent rounded-full blur-[120px] animate-pulse-slow opacity-60" style={{ willChange: 'transform, opacity' }}></div>
          <div className="absolute top-40 right-20 w-[36rem] h-[36rem] bg-gradient-to-br from-purple-500/30 via-purple-500/10 to-transparent rounded-full blur-[120px] animate-pulse-slow opacity-60" style={{ animationDelay: '1s', willChange: 'transform, opacity' }}></div>
          <div className="absolute bottom-20 left-1/3 w-[28rem] h-[28rem] bg-gradient-to-br from-blue-500/25 via-blue-500/8 to-transparent rounded-full blur-[100px] animate-pulse-slow opacity-60" style={{ animationDelay: '2s', willChange: 'transform, opacity' }}></div>
          
          {/* Animated Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>
          
          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#25d695] rounded-full animate-float opacity-60 shadow-[0_0_8px_rgba(37,214,149,0.6)]"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-500 rounded-full animate-float-delayed opacity-60 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-blue-500 rounded-full animate-float-slow opacity-60 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
          <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-[#25d695] rounded-full animate-float opacity-60 shadow-[0_0_8px_rgba(37,214,149,0.6)]" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-500 rounded-full animate-float-delayed opacity-60 shadow-[0_0_8px_rgba(168,85,247,0.6)]" style={{ animationDelay: '2.5s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-10 leading-tight"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                Secure Your
              </span>
              <br />
              <span className="text-gradient-coreum">
                Crypto Portfolio
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                on Coreum
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-400 mb-16 max-w-4xl mx-auto leading-relaxed">
              Track, analyze, and protect your digital assets with enterprise-grade security and real-time insights
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-32">
              <a 
                href="https://app.shieldnest.org"
                className="btn-coreum-green px-10 py-5 text-lg sm:text-xl"
              >
                Get Started Free
              </a>
              
              <a 
                href="#features"
                className="px-10 py-5 bg-[#101216] text-white rounded-xl font-bold text-lg sm:text-xl border border-[rgba(37,214,149,0.3)] hover:border-[#25d695] transition-all duration-300 w-full sm:w-auto"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Floating Cards Animation - Enhanced with depth */}
          <div className="relative h-[28rem] hidden lg:block">
            <div className="absolute top-0 left-1/4 animate-float" style={{ transform: 'translateZ(50px)' }}>
              <div className="neo-float-green p-6 shadow-[0_0_30px_rgba(20,184,166,0.3),0_0_60px_rgba(20,184,166,0.1)] hover:shadow-[0_0_40px_rgba(20,184,166,0.4)] transition-shadow duration-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-600/20 border border-teal-500/30 flex items-center justify-center mb-3 shadow-[0_0_10px_rgba(20,184,166,0.15)] transition-all duration-300">
                  <IoPieChartOutline className="w-7 h-7 text-teal-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                </div>
                <div className="text-white font-semibold">Real-time Analytics</div>
              </div>
            </div>
            
            <div className="absolute top-10 right-1/4 animate-float-delayed" style={{ transform: 'translateZ(30px)' }}>
              <div className="neo-float-blue p-6 shadow-[0_0_30px_rgba(59,130,246,0.3),0_0_60px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-shadow duration-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-3 shadow-[0_0_10px_rgba(59,130,246,0.15)] transition-all duration-300">
                  <IoLockClosedOutline className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                </div>
                <div className="text-white font-semibold">Bank-level Security</div>
              </div>
            </div>
            
            <div className="absolute bottom-10 left-1/3 animate-float-slow" style={{ transform: 'translateZ(40px)' }}>
              <div className="neo-float-purple p-6 shadow-[0_0_30px_rgba(168,85,247,0.3),0_0_60px_rgba(168,85,247,0.1)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-shadow duration-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-3 shadow-[0_0_10px_rgba(168,85,247,0.15)] transition-all duration-300">
                  <IoSpeedometerOutline className="w-7 h-7 text-purple-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                </div>
                <div className="text-white font-semibold">Lightning Fast</div>
              </div>
            </div>

            {/* New Multi-Chain Card */}
            <div className="absolute bottom-0 right-1/4 animate-float" style={{ transform: 'translateZ(45px)', animationDelay: '0.5s' }}>
              <div className="p-6 bg-[#101216] border-2 border-orange-500/30 rounded-2xl shadow-[0_0_30px_rgba(255,140,66,0.3),0_0_60px_rgba(255,140,66,0.1)] hover:shadow-[0_0_40px_rgba(255,140,66,0.4)] transition-shadow duration-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center mb-3 shadow-[0_0_10px_rgba(255,140,66,0.15)] transition-all duration-300">
                  <IoGlobeOutline className="w-7 h-7 text-orange-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(255,140,66,0.6)]" />
                </div>
                <div className="text-white font-semibold text-sm">Multi-Chain</div>
                <div className="text-gray-400 text-xs mt-1">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-[#101216]">
        <div className="container mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center mb-16 leading-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
            Everything You Need to <span className="text-[#25d695]">Manage Your Assets</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <IoWalletOutline className="w-7 h-7" />,
                title: "Portfolio Tracking",
                description: "Track all your Coreum assets in one secure dashboard with real-time price updates",
                bgColor: "from-teal-500/20 to-teal-600/20",
                borderColor: "border-teal-500/30",
                iconColor: "text-teal-400",
                cardColor: "neo-float-green",
                glowColor: "shadow-[0_0_15px_rgba(20,184,166,0.08)]",
                iconGlow: "shadow-[0_0_10px_rgba(20,184,166,0.15)]",
                iconDropShadow: "drop-shadow-[0_0_4px_rgba(20,184,166,0.3)]"
              },
              {
                icon: <IoPieChartOutline className="w-7 h-7" />,
                title: "Advanced Analytics",
                description: "Gain insights with detailed charts, profit/loss tracking, and performance metrics",
                bgColor: "from-cyan-500/20 to-cyan-600/20",
                borderColor: "border-cyan-500/30",
                iconColor: "text-cyan-400",
                cardColor: "neo-float-blue",
                glowColor: "shadow-[0_0_15px_rgba(6,182,212,0.08)]",
                iconGlow: "shadow-[0_0_10px_rgba(6,182,212,0.15)]",
                iconDropShadow: "drop-shadow-[0_0_4px_rgba(6,182,212,0.3)]"
              },
              {
                icon: <IoShieldCheckmarkOutline className="w-7 h-7" />,
                title: "Shield NFT Benefits",
                description: "Exclusive features and rewards for Shield NFT holders with premium access",
                bgColor: "from-purple-500/20 to-purple-600/20",
                borderColor: "border-purple-500/30",
                iconColor: "text-purple-400",
                cardColor: "neo-float-purple",
                glowColor: "shadow-[0_0_15px_rgba(168,85,247,0.08)]",
                iconGlow: "shadow-[0_0_10px_rgba(168,85,247,0.15)]",
                iconDropShadow: "drop-shadow-[0_0_4px_rgba(168,85,247,0.3)]"
              },
              {
                icon: <IoLockClosedOutline className="w-7 h-7" />,
                title: "Secure Wallet Integration",
                description: "Connect seamlessly with Keplr, Leap, and other popular Coreum wallets",
                bgColor: "from-green-500/20 to-green-600/20",
                borderColor: "border-green-500/30",
                iconColor: "text-green-400",
                cardColor: "neo-float-teal",
                glowColor: "shadow-[0_0_15px_rgba(34,197,94,0.08)]",
                iconGlow: "shadow-[0_0_10px_rgba(34,197,94,0.15)]",
                iconDropShadow: "drop-shadow-[0_0_4px_rgba(34,197,94,0.3)]"
              },
              {
                icon: <IoPeopleOutline className="w-7 h-7" />,
                title: "User Tiers",
                description: "From visitor to private member - choose the level that fits your needs",
                bgColor: "from-orange-500/20 to-orange-600/20",
                borderColor: "border-orange-500/30",
                iconColor: "text-orange-400",
                cardColor: "neo-float-orange",
                glowColor: "shadow-[0_0_15px_rgba(249,115,22,0.08)]",
                iconGlow: "shadow-[0_0_10px_rgba(249,115,22,0.15)]",
                iconDropShadow: "drop-shadow-[0_0_4px_rgba(249,115,22,0.3)]"
              },
              {
                icon: <IoSettingsOutline className="w-7 h-7" />,
                title: "Smart Automation",
                description: "Automated portfolio rebalancing and smart notifications for price changes",
                bgColor: "from-blue-500/20 to-blue-600/20",
                borderColor: "border-blue-500/30",
                iconColor: "text-blue-400",
                cardColor: "neo-float-blue",
                glowColor: "shadow-[0_0_15px_rgba(59,130,246,0.08)]",
                iconGlow: "shadow-[0_0_10px_rgba(59,130,246,0.15)]",
                iconDropShadow: "drop-shadow-[0_0_4px_rgba(59,130,246,0.3)]"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group ${feature.cardColor} p-6 neo-transition ${feature.glowColor} transition-all duration-500`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bgColor} border ${feature.borderColor} flex items-center justify-center mb-4 ${feature.iconGlow} transition-all duration-300`}>
                  <div className={`${feature.iconColor} ${feature.iconDropShadow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6 neo-gradient-bg">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                Why Choose <span className="text-[#25d695]">ShieldNest?</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Built for Coreum",
                    description: "Native integration with the Coreum blockchain for seamless performance"
                  },
                  {
                    title: "Privacy First",
                    description: "Your data stays yours. We never access your private keys or sell your information"
                  },
                  {
                    title: "Community Driven",
                    description: "Join a growing community of crypto enthusiasts and Shield NFT holders"
                  },
                  {
                    title: "Always Improving",
                    description: "Regular updates with new features based on community feedback"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.15)] transition-all duration-300">
                      <IoCheckmarkCircleOutline className="w-6 h-6 text-green-400 drop-shadow-[0_0_4px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-[#101216] border border-gray-800 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="h-12 bg-gradient-to-r from-[rgba(37,214,149,0.3)] to-transparent rounded-lg animate-pulse"></div>
                  <div className="h-24 bg-gradient-to-r from-[rgba(124,58,237,0.3)] to-transparent rounded-lg animate-pulse delay-100"></div>
                  <div className="h-16 bg-gradient-to-r from-[rgba(59,130,246,0.3)] to-transparent rounded-lg animate-pulse delay-200"></div>
                  <div className="h-20 bg-gradient-to-r from-[rgba(37,214,149,0.3)] to-transparent rounded-lg animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-[#101216] overflow-visible">
        <div className="container mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center mb-16 leading-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
            Choose Your <span className="text-[#25d695]">Tier</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-12 pb-4">
            {[
              {
                name: "Visitor",
                price: "Free",
                features: [
                  "Session-only access",
                  "Basic portfolio view",
                  "Price tracking",
                  "No account required"
                ],
                cta: "Try Now",
                popular: false,
                cardClass: "stat-card-dash-cyan"
              },
              {
                name: "Public",
                price: "Free",
                features: [
                  "Email/Wallet auth",
                  "Persistent data",
                  "Full portfolio features",
                  "Price alerts",
                  "Analytics dashboard"
                ],
                cta: "Sign Up Free",
                popular: true,
                cardClass: "stat-card-dash-green"
              },
              {
                name: "Private",
                price: "Shield NFT",
                features: [
                  "All Public features",
                  "Premium analytics",
                  "Exclusive content",
                  "Priority support",
                  "Governance access"
                ],
                cta: "Get Shield NFT",
                popular: false,
                cardClass: "stat-card-dash-purple"
              }
            ].map((tier, index) => (
              <div 
                key={index}
                className={`relative stat-card-dash ${tier.cardClass} p-8 ${tier.popular ? 'pt-14' : ''} overflow-visible`}
              >
                {tier.popular && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-6 py-2.5 bg-gradient-to-r from-[#25d695] to-[#179b69] text-white text-xs sm:text-sm font-bold rounded-full z-50 shadow-2xl whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold text-[#25d695] mb-6">
                  {tier.price}
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <IoCheckmarkCircleOutline className="mr-2 text-[#25d695] w-5 h-5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://app.shieldnest.org"
                  className={`block w-full py-3 text-center rounded-lg font-bold transition-all duration-300 ${
                    tier.popular
                      ? 'btn-coreum-green'
                      : 'bg-[#101216] border border-[rgba(37,214,149,0.3)] text-white hover:border-[#25d695]'
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 neo-gradient-bg">
        <div className="container mx-auto">
          <div className="bg-[#101216] border border-[rgba(37,214,149,0.3)] rounded-2xl p-12 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-center" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
              Ready to Secure Your Portfolio?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users managing their Coreum assets with ShieldNest
            </p>
            <a
              href="https://app.shieldnest.org"
              className="btn-coreum-green px-10 py-4 text-lg inline-block"
            >
              Launch App Now →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-6">
            {/* Logo & Brand */}
            <div className="flex items-center gap-1.5">
              <a href="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
                <Image 
                  src="/shld_dark.svg" 
                  alt="ShieldNest Logo" 
                  width={46} 
                  height={46}
                  className="object-contain w-[46px] h-[46px]"
                />
              </a>
              
              <div className="flex flex-col">
                <a href="/" className="hover:opacity-80 transition-opacity">
                  <span className="text-lg font-bold text-white">ShieldNEST</span>
                </a>
                
                {/* Social Icons underneath */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <a
                    href="https://github.com/ShieldNEST-org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity group"
                    aria-label="GitHub"
                  >
                    <svg className="w-4 h-4 text-[#A855F7] group-hover:text-[#25d695] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a
                    href="https://x.com/shieldnest_org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity group"
                    aria-label="X (Twitter)"
                  >
                    <svg className="w-4 h-4 text-[#A855F7] group-hover:text-[#25d695] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Product Links - Horizontal on desktop */}
            <div className="flex items-center gap-6 text-sm">
              <a href="#features" className="text-gray-400 hover:text-[#25d695] transition-colors">Features</a>
              <a href="#benefits" className="text-gray-400 hover:text-[#25d695] transition-colors">Benefits</a>
              <a href="#pricing" className="text-gray-400 hover:text-[#25d695] transition-colors">Pricing</a>
              <a href="https://app.shieldnest.org" className="text-[#A855F7] hover:text-[#25d695] transition-colors font-semibold">Launch App</a>
              
              {/* Multi-Chain Badge */}
              <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-[#25d695]/10 to-[#A855F7]/10 border border-[#25d695]/30 rounded-full ml-2">
                <span className="text-xs font-semibold text-[#25d695]">Multi-Chain</span>
                <span className="ml-1.5 text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-xs">
            <p>&copy; 2025 ShieldNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
