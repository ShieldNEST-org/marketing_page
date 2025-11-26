'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  IoGlobeOutline,
  IoCloseOutline,
  IoServerOutline,
  IoHardwareChipOutline,
  IoSwapHorizontalOutline,
  IoWarningOutline,
  IoRefreshOutline
} from 'react-icons/io5';

// Simplified wallet connection hook for re-delegate page
function useRedelegateWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);

  const connectWallet = useCallback(async (walletType: 'keplr' | 'leap' | 'cosmostation') => {
    setConnecting(true);
    try {
      let walletAddress: string;

      switch (walletType) {
        case 'keplr':
          if (!window.keplr) {
            window.open('https://www.keplr.app/download', '_blank');
            throw new Error('Keplr not installed');
          }

          // Enable Coreum chain
          await window.keplr.enable('coreum-mainnet-1');

          // Get address
          const key = await window.keplr.getKey('coreum-mainnet-1');
          walletAddress = key.bech32Address;
          setProvider('Keplr');
          break;

        case 'leap':
          if (!window.leap) {
            window.open('https://www.leapwallet.io/download', '_blank');
            throw new Error('Leap not installed');
          }

          await window.leap.enable('coreum-mainnet-1');
          const leapKey = await window.leap.getKey('coreum-mainnet-1');
          walletAddress = leapKey.bech32Address;
          setProvider('Leap');
          break;

        case 'cosmostation':
          if (!window.cosmostation) {
            window.open('https://www.cosmostation.io/wallet', '_blank');
            throw new Error('Cosmostation not installed');
          }

          await window.cosmostation.enable('coreum-mainnet-1');
          const cosmostationKey = await window.cosmostation.getKey('coreum-mainnet-1');
          walletAddress = cosmostationKey.bech32Address;
          setProvider('Cosmostation');
          break;

        default:
          throw new Error('Unsupported wallet');
      }

      setAddress(walletAddress);
      return walletAddress;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setProvider(null);
  }, []);

  return {
    address,
    connecting,
    provider,
    isConnected: !!address,
    connectWallet,
    disconnect,
  };
}

export default function ReDelegatePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedelegating, setIsRedelegating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simplified wallet connection
  const { address, connecting, provider, isConnected, connectWallet, disconnect } = useRedelegateWallet();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null); // Clear any errors when closing modal
  };

  // Wallet connection handler - opens wallet selection modal
  const handleConnectWallet = async (walletType: 'keplr' | 'leap' | 'cosmostation') => {
    setError(null);
    try {
      await connectWallet(walletType);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setError(error instanceof Error ? error.message : 'Connection failed');
    }
  };

  // Re-delegate handler
  const handleRedelegate = async () => {
    setIsRedelegating(true);
    try {
      // TODO: Implement actual re-delegation transaction
      // This will use CosmJS to execute the re-delegate transaction
      // For now, redirect to the ShieldNest staking app
      window.open('https://app.shieldnest.org/stake', '_blank');
      // Show success state by closing modal after a delay
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Re-delegation failed:', error);
    } finally {
      setIsRedelegating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-900">
        <div className="container flex h-16 py-2 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[88rem] mx-auto">
          {/* Logo & Brand with Social Icons */}
          <div className="flex items-center gap-1.5">
            {/* Logo */}
            <Link href="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
              <Image
                src="/shld_dark.svg"
                alt="ShieldNest Logo"
                width={33}
                height={33}
                className="object-contain w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-12 lg:h-12"
                priority
              />
            </Link>

            {/* Brand Name & Social Icons */}
            <div className="flex flex-col">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <h1 className="font-bold text-lg text-white">
                  ShieldNEST
                </h1>
              </Link>

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
            <Link href="/" className="hover:text-[#25d695] transition-colors">Home</Link>
            <a href="#benefits" className="hover:text-[#25d695] transition-colors">Benefits</a>
            <a href="#validator" className="hover:text-[#25d695] transition-colors">Validator</a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-6 py-2 bg-[#101216] text-white rounded-xl font-bold text-sm border border-[rgba(37,214,149,0.3)] hover:border-[#25d695] transition-all duration-300"
            >
              ← Back Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>

          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-float opacity-60 shadow-[0_0_8px_rgba(216,29,60,0.6)]"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-float-delayed opacity-60 shadow-[0_0_8px_rgba(255,140,66,0.6)]"></div>
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-[#25d695] rounded-full animate-float-slow opacity-60 shadow-[0_0_8px_rgba(37,214,149,0.6)]"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
          <div className="transition-all duration-1000">
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-10 leading-tight"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              <span className="bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
                Re-delegate to
              </span>
              <br />
              <span className="text-gradient-coreum">
                ShieldNest
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
                Today
              </span>
            </h1>

            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-400 mb-16 max-w-4xl mx-auto leading-relaxed">
              Your current validator might be jailed or missing rewards. Switch to ShieldNest's enterprise-grade infrastructure and never miss another reward.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-32">
              <button
                onClick={handleOpenModal}
                className="btn-redelegate px-10 py-5 text-lg sm:text-xl"
              >
                <IoSwapHorizontalOutline className="w-6 h-6" />
                Re-delegate Now
              </button>

              <a
                href="#benefits"
                className="px-10 py-5 bg-[#101216] text-white rounded-xl font-bold text-lg sm:text-xl border border-[rgba(37,214,149,0.3)] hover:border-[#25d695] transition-all duration-300 w-full sm:w-auto"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6 neo-gradient-bg">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Why Re-delegate to <span className="text-[#25d695]">ShieldNest?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don't let your staking rewards slip away. Here's why ShieldNest is the superior choice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Problem Cards */}
            <div className="neo-float-orange p-8 shadow-[0_0_30px_rgba(216,29,60,0.2)]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 flex items-center justify-center mb-6 shadow-[0_0_10px_rgba(216,29,60,0.15)]">
                <IoWarningOutline className="w-8 h-8 text-red-400 drop-shadow-[0_0_8px_rgba(216,29,60,0.6)]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Jailed Validator Problem</h3>
              <p className="text-gray-300 mb-6">
                When your validator gets jailed, you stop earning staking rewards completely. This can happen due to:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-300">
                  <IoCloseOutline className="mr-3 text-red-400 w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>Double signing penalties</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <IoCloseOutline className="mr-3 text-red-400 w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>Extended downtime</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <IoCloseOutline className="mr-3 text-red-400 w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>Configuration errors</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <IoCloseOutline className="mr-3 text-red-400 w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>Maintenance issues</span>
                </li>
              </ul>
            </div>

            {/* Solution Card */}
            <div className="neo-float-green p-8 shadow-[0_0_30px_rgba(37,214,149,0.2)]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex items-center justify-center mb-6 shadow-[0_0_10px_rgba(37,214,149,0.15)]">
                <IoShieldCheckmarkOutline className="w-8 h-8 text-green-400 drop-shadow-[0_0_8px_rgba(37,214,149,0.6)]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">ShieldNest Solution</h3>
              <p className="text-gray-300 mb-6">
                Our enterprise-grade infrastructure ensures you never miss rewards:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-300">
                  <IoCheckmarkCircleOutline className="mr-3 text-[#25d695] w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">99.9% uptime</strong> with redundant systems</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <IoCheckmarkCircleOutline className="mr-3 text-[#25d695] w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Military-grade security</strong> protection</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <IoCheckmarkCircleOutline className="mr-3 text-[#25d695] w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">24/7 monitoring</strong> and automated failover</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <IoCheckmarkCircleOutline className="mr-3 text-[#25d695] w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Geographically distributed</strong> servers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={handleOpenModal}
              className="btn-redelegate px-12 py-5 text-lg sm:text-xl inline-flex items-center gap-3"
            >
              <IoSwapHorizontalOutline className="w-6 h-6" />
              Start Re-delegation Process
            </button>
          </div>
        </div>
      </section>

      {/* Payback Program Section */}
      <section className="py-20 px-6 bg-[#101216]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Lost Rewards? <span className="text-[#25d695]">2:1 Payback Program</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              If you've previously lost rewards due to validator issues and spoke with us about re-staking, you may be eligible for our 2:1 payback program.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-[#25d695]/10 rounded-2xl border border-purple-500/20 p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#25d695]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#25d695] font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="text-gray-300">Re-delegate your stake to ShieldNest using the button above</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#25d695]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#25d695] font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="text-gray-300">Share your wallet address with us on X (Twitter)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#25d695]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#25d695] font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="text-gray-300">We'll verify your claim and process your 2:1 payback</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/30 to-[#25d695]/30 flex items-center justify-center">
                  <IoShieldCheckmarkOutline className="w-16 h-16 text-purple-400" />
                </div>
                <a
                  href="mailto:info@shieldnest.org"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-[#25d695] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                >
                  info@shieldnest.org →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Re-delegate Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
          onClick={handleCloseModal}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>

          {/* Modal Content */}
          <div
            className="bg-[#0e0e0e] rounded-3xl max-w-md w-full relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'scaleIn 0.3s ease-out',
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.6), -8px -8px 24px rgba(40, 40, 40, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(124, 58, 237, 0.2)'
            }}
          >
            <div className="p-8">
            {/* Animated gradient border effect */}
            <div
              className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(37, 214, 149, 0.1) 50%, rgba(77, 156, 255, 0.1) 100%)',
                filter: 'blur(20px)'
              }}
            />

            {/* Close Button with neomorphic styling */}
            <button
              onClick={handleCloseModal}
              disabled={connecting}
              type="button"
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#1a1f2e] border border-gray-800/50
                hover:border-purple-500/30 hover:bg-[#22283a] transition-all duration-300
                shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.05)]
                hover:shadow-[0_4px_12px_rgba(124,58,237,0.2),inset_0_1px_2px_rgba(255,255,255,0.1)]
                disabled:opacity-50 disabled:cursor-not-allowed z-10"
            >
              <IoCloseOutline className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
            </button>

            {/* Header */}
            <div className="mb-6 relative z-10">
              <h2 className="text-3xl font-bold mb-3 text-white bg-gradient-to-r from-purple-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                Re-delegate to ShieldNest
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Choose your preferred wallet to connect
              </p>
              {!isConnected && (
                <div
                  className="mt-4 p-4 rounded-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(37, 214, 149, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                    border: '1px solid rgba(37, 214, 149, 0.2)',
                    boxShadow: '0_4px_12px_rgba(37,214,149,0.1),inset_0_1px_2px_rgba(255,255,255,0.05)'
                  }}
                >
                  <p className="text-green-300 text-xs leading-relaxed relative z-10">
                    <strong className="text-green-200">Easy Setup:</strong> Connect your wallet instantly to view your portfolio.
                    No sign-up required! You can optionally create an account later to save your wallets permanently.
                  </p>
                  <div
                    className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20"
                    style={{
                      background: 'radial-gradient(circle, rgba(37, 214, 149, 0.4), transparent)'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Error Display with neomorphic styling */}
            {error && (
              <div
                className="mb-4 p-4 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  boxShadow: '0_4px_12px_rgba(239,68,68,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)'
                }}
              >
                <p className="text-red-300 text-sm relative z-10">{error}</p>
              </div>
            )}

            {/* Wallet Connection Section */}
            <div className="mb-8">
              {!isConnected && (
                <div className="text-center">
                  <p className="text-gray-400 mb-6">Choose your wallet to begin re-delegation</p>
                  <div className="space-y-5 relative z-10" data-tutorial="wallet-providers">
                    {/* Keplr Wallet Button */}
                    <div className="relative group/keplr">
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover/keplr:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                        style={{
                          background: `radial-gradient(circle at center, rgba(124, 58, 237, 0.3), transparent 70%)`
                        }}
                      />

                      <button
                        onClick={() => handleConnectWallet('keplr')}
                        disabled={connecting || provider !== 'keplr' && connecting}
                        className={`
                          relative w-full
                          bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-purple-700/5
                          bg-[#1a1f2e]
                          border-2 border-purple-400/30 hover:border-purple-400/60
                          shadow-[0_4px_10px_rgba(124,58,237,0.20),inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-2px_6px_rgba(0,0,0,0.2)]
                          hover:shadow-[0_12px_24px_rgba(0,0,0,0.3),0_0_0_1px_rgba(124,58,237,0.3),0_0_30px_rgba(124,58,237,0.25),inset_0_1px_3px_rgba(255,255,255,0.15)]
                          hover:translate-y-[-4px] hover:scale-[1.02]
                          active:translate-y-[0px] active:scale-[0.98]
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100
                          text-white font-bold
                          px-6 py-5 rounded-2xl
                          transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                          flex items-center justify-start gap-4
                          overflow-hidden
                        `}
                      >
                        <div className={`
                          inline-flex items-center justify-center flex-shrink-0
                          w-12 h-12 rounded-xl
                          bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-purple-700/5
                          border-2 border-purple-400/30
                          shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)]
                          overflow-hidden
                        `}>
                          <Image
                            src="/keplr-logo.svg"
                            alt="Keplr logo"
                            width={40}
                            height={40}
                            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] object-contain"
                            priority
                          />
                        </div>

                        <span className="text-lg tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex-1 text-left">
                          Keplr
                        </span>

                        {connecting && provider === 'keplr' && (
                          <IoRefreshOutline className="w-5 h-5 animate-spin drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex-shrink-0" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/keplr:translate-x-full transition-transform duration-1000" />
                      </button>
                    </div>

                    {/* Leap Wallet Button */}
                    <div className="relative group/leap">
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover/leap:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                        style={{
                          background: `radial-gradient(circle at center, rgba(37, 214, 149, 0.3), transparent 70%)`
                        }}
                      />

                      <button
                        onClick={() => handleConnectWallet('leap')}
                        disabled={connecting || provider !== 'leap' && connecting}
                        className={`
                          relative w-full
                          bg-gradient-to-br from-green-500/20 via-green-600/10 to-green-700/5
                          bg-[#1a1f2e]
                          border-2 border-green-400/30 hover:border-green-400/60
                          shadow-[0_4px_10px_rgba(34,197,94,0.20),inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-2px_6px_rgba(0,0,0,0.2)]
                          hover:shadow-[0_12px_24px_rgba(0,0,0,0.3),0_0_0_1px_rgba(37,214,149,0.3),0_0_30px_rgba(37,214,149,0.25),inset_0_1px_3px_rgba(255,255,255,0.15)]
                          hover:translate-y-[-4px] hover:scale-[1.02]
                          active:translate-y-[0px] active:scale-[0.98]
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100
                          text-white font-bold
                          px-6 py-5 rounded-2xl
                          transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                          flex items-center justify-start gap-4
                          overflow-hidden
                        `}
                      >
                        <div className={`
                          inline-flex items-center justify-center flex-shrink-0
                          w-12 h-12 rounded-xl
                          bg-gradient-to-br from-green-500/20 via-green-600/10 to-green-700/5
                          border-2 border-green-400/30
                          shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)]
                          overflow-hidden
                        `}>
                          <Image
                            src="/leap-logo.svg"
                            alt="Leap logo"
                            width={40}
                            height={40}
                            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] object-contain"
                            priority
                          />
                        </div>

                        <span className="text-lg tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex-1 text-left">
                          Leap
                        </span>

                        {connecting && provider === 'leap' && (
                          <IoRefreshOutline className="w-5 h-5 animate-spin drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex-shrink-0" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/leap:translate-x-full transition-transform duration-1000" />
                      </button>
                    </div>

                    {/* Cosmostation Wallet Button */}
                    <div className="relative group/cosmostation">
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover/cosmostation:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                        style={{
                          background: `radial-gradient(circle at center, rgba(77, 156, 255, 0.3), transparent 70%)`
                        }}
                      />

                      <button
                        onClick={() => handleConnectWallet('cosmostation')}
                        disabled={connecting || provider !== 'cosmostation' && connecting}
                        className={`
                          relative w-full
                          bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-blue-700/5
                          bg-[#1a1f2e]
                          border-2 border-blue-400/30 hover:border-blue-400/60
                          shadow-[0_4px_10px_rgba(59,130,246,0.20),inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-2px_6px_rgba(0,0,0,0.2)]
                          hover:shadow-[0_12px_24px_rgba(0,0,0,0.3),0_0_0_1px_rgba(77,156,255,0.3),0_0_30px_rgba(77,156,255,0.25),inset_0_1px_3px_rgba(255,255,255,0.15)]
                          hover:translate-y-[-4px] hover:scale-[1.02]
                          active:translate-y-[0px] active:scale-[0.98]
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100
                          text-white font-bold
                          px-6 py-5 rounded-2xl
                          transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                          flex items-center justify-start gap-4
                          overflow-hidden
                        `}
                      >
                        <div className={`
                          inline-flex items-center justify-center flex-shrink-0
                          w-12 h-12 rounded-xl
                          bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-blue-700/5
                          border-2 border-blue-400/30
                          shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)]
                          overflow-hidden
                        `}>
                          <Image
                            src="/cosmostation-logo.svg"
                            alt="Cosmostation logo"
                            width={40}
                            height={40}
                            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] object-contain"
                            priority
                          />
                        </div>

                        <span className="text-lg tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex-1 text-left">
                          Cosmostation
                        </span>

                        {connecting && provider === 'cosmostation' && (
                          <IoRefreshOutline className="w-5 h-5 animate-spin drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex-shrink-0" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/cosmostation:translate-x-full transition-transform duration-1000" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Don't have a wallet? <a href="https://www.keplr.app/download" target="_blank" rel="noopener noreferrer" className="text-[#25d695] hover:underline">Get Keplr</a></p>
                </div>
              )}

              {isConnected && (
                <div className="text-center relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl">
                    <IoCheckmarkCircleOutline className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium text-sm">
                      {provider} Connected
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6 font-mono bg-[#1a1f2e] px-3 py-2 rounded-lg border border-gray-700/50 truncate">
                    {address}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={disconnect}
                      className="flex-1 px-6 py-4 bg-[#1a1f2e] border-2 border-gray-700/50 hover:border-gray-600/60 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_3px_rgba(255,255,255,0.1)]"
                    >
                      Disconnect
                    </button>
                    <button
                      onClick={handleRedelegate}
                      disabled={isRedelegating}
                      className="flex-1 px-6 py-4 bg-gradient-to-br from-green-500/20 via-green-600/10 to-green-700/5 border-2 border-green-400/30 hover:border-green-400/60 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_4px_10px_rgba(34,197,94,0.20),inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3),0_0_0_1px_rgba(37,214,149,0.3),0_0_30px_rgba(37,214,149,0.25),inset_0_1px_3px_rgba(255,255,255,0.15)] hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRedelegating ? 'Processing...' : 'Re-delegate'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payback Program Section in Modal */}
            <div className="border-t border-gray-700/50 pt-6 relative z-10">
              <div className="p-6 bg-gradient-to-br from-purple-500/10 to-green-500/10 rounded-2xl border border-purple-500/20 relative overflow-hidden">
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-green-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                    <IoShieldCheckmarkOutline className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 text-lg">
                      Lost Rewards? <span className="text-[#25d695]">2:1 Payback Program</span>
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      If you previously spoke with us about lost rewards and re-staked with ShieldNest, you may be eligible for our <strong className="text-white">2-to-1 payback program</strong>.
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      Share your wallet address with us after re-delegating, and we'll begin the verification process.
                    </p>
                    <a
                      href="mailto:info@shieldnest.org"
                      className="inline-flex items-center gap-2 text-[#25d695] hover:text-purple-400 transition-colors text-sm font-semibold"
                    >
                      info@shieldnest.org →
                    </a>
                  </div>
                </div>
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                  style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent)'
                  }}
                />
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
