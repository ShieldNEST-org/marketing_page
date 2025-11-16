'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 backdrop-blur-md bg-slate-900/70 border-b border-purple-500/20">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🛡️</span>
            </div>
            <span className="text-2xl font-bold text-white">ShieldNest</span>
          </div>
          
          <div className="hidden md:flex space-x-8 text-gray-300">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#benefits" className="hover:text-purple-400 transition-colors">Benefits</a>
            <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
          </div>

          <a 
            href="https://app.shieldnest.org"
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Launch App →
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Crypto Portfolio</span>
              <br />on Coreum
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Track, analyze, and protect your digital assets with enterprise-grade security and real-time insights
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://app.shieldnest.org"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                Get Started Free
              </a>
              
              <a 
                href="#features"
                className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm text-white rounded-xl font-bold text-lg border border-purple-500/30 hover:border-purple-500 transition-all duration-300 w-full sm:w-auto"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Floating Cards Animation */}
          <div className="mt-20 relative h-96 hidden lg:block">
            <div className="absolute top-0 left-1/4 animate-float">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg p-6 rounded-2xl border border-purple-500/30 shadow-xl">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-white font-semibold">Real-time Analytics</div>
              </div>
            </div>
            
            <div className="absolute top-20 right-1/4 animate-float-delayed">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg p-6 rounded-2xl border border-blue-500/30 shadow-xl">
                <div className="text-4xl mb-2">🔒</div>
                <div className="text-white font-semibold">Bank-level Security</div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-1/3 animate-float-slow">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg p-6 rounded-2xl border border-green-500/30 shadow-xl">
                <div className="text-4xl mb-2">⚡</div>
                <div className="text-white font-semibold">Lightning Fast</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-900/50">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Manage Your Assets</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "💼",
                title: "Portfolio Tracking",
                description: "Track all your Coreum assets in one secure dashboard with real-time price updates"
              },
              {
                icon: "📈",
                title: "Advanced Analytics",
                description: "Gain insights with detailed charts, profit/loss tracking, and performance metrics"
              },
              {
                icon: "🛡️",
                title: "Shield NFT Benefits",
                description: "Exclusive features and rewards for Shield NFT holders with premium access"
              },
              {
                icon: "🔐",
                title: "Secure Wallet Integration",
                description: "Connect seamlessly with Keplr, Leap, and other popular Coreum wallets"
              },
              {
                icon: "🎯",
                title: "User Tiers",
                description: "From visitor to private member - choose the level that fits your needs"
              },
              {
                icon: "⚙️",
                title: "Smart Automation",
                description: "Automated portfolio rebalancing and smart notifications for price changes"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">ShieldNest?</span>
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
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
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
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg p-8 rounded-3xl border border-purple-500/30">
                <div className="space-y-4">
                  <div className="h-12 bg-gradient-to-r from-purple-500/30 to-transparent rounded-lg animate-pulse"></div>
                  <div className="h-24 bg-gradient-to-r from-pink-500/30 to-transparent rounded-lg animate-pulse delay-100"></div>
                  <div className="h-16 bg-gradient-to-r from-blue-500/30 to-transparent rounded-lg animate-pulse delay-200"></div>
                  <div className="h-20 bg-gradient-to-r from-purple-500/30 to-transparent rounded-lg animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-slate-900/50">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Tier</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                popular: false
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
                popular: true
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
                popular: false
              }
            ].map((tier, index) => (
              <div 
                key={index}
                className={`relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl border ${
                  tier.popular ? 'border-purple-500 shadow-2xl shadow-purple-500/20' : 'border-purple-500/20'
                } hover:border-purple-500/50 transition-all duration-300`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                  {tier.price}
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <span className="mr-2 text-purple-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://app.shieldnest.org"
                  className={`block w-full py-3 text-center rounded-lg font-bold transition-all duration-300 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
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
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-12 border border-purple-500/30 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Secure Your Portfolio?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users managing their Coreum assets with ShieldNest
            </p>
            <a
              href="https://app.shieldnest.org"
              className="inline-block px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Launch App Now →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-purple-500/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🛡️</span>
                </div>
                <span className="text-xl font-bold text-white">ShieldNest</span>
              </div>
              <p className="text-gray-400 text-sm">
                Secure portfolio management for the Coreum blockchain
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-purple-400">Features</a></li>
                <li><a href="#benefits" className="hover:text-purple-400">Benefits</a></li>
                <li><a href="#pricing" className="hover:text-purple-400">Pricing</a></li>
                <li><a href="https://app.shieldnest.org" className="hover:text-purple-400">Launch App</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://app.shieldnest.org/education" className="hover:text-purple-400">Education</a></li>
                <li><a href="https://app.shieldnest.org" className="hover:text-purple-400">Documentation</a></li>
                <li><a href="https://app.shieldnest.org" className="hover:text-purple-400">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://app.shieldnest.org/privacy" className="hover:text-purple-400">Privacy Policy</a></li>
                <li><a href="https://app.shieldnest.org/terms" className="hover:text-purple-400">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-500/20 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 ShieldNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
