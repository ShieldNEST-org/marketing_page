'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import BlogSection from '@/components/BlogSection';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import {
  IoShieldCheckmarkOutline,
  IoChevronForward,
  IoCodeSlashOutline,
  IoGlobeOutline,
  IoStatsChartOutline,
  IoLockClosedOutline,
  IoMailOutline,
  IoArrowForwardOutline,
  IoServerOutline,
  IoHardwareChipOutline,
  IoCubeOutline,
  IoRadioOutline,
  IoEye,
  IoLocation
} from 'react-icons/io5';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'focused' | 'creative'>('focused');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [inquiryType, setInquiryType] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const savedTheme = localStorage.getItem('shieldnest-theme') as 'focused' | 'creative';
    if (savedTheme) {
      console.log('Restoring theme from storage:', savedTheme);
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      console.log('Setting theme attribute:', theme);
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('shieldnest-theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'focused' ? 'creative' : 'focused');
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          message,
          inquiryType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setSubmitStatus('success');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background" suppressHydrationWarning />
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-white">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/shld_dark.svg" alt="ShieldNest" width={40} height={40} className="w-10 h-10" />
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-tighter">SHIELDNEST</span>
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Development Team</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-sm font-semibold uppercase tracking-wider">
            <a href="#products" className="hover:text-accent transition-colors">Products</a>
            <a href="#validator" className="hover:text-accent transition-colors">Validator</a>
            <a href="#about" className="hover:text-accent transition-colors">About</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-6">
            <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
            <a 
              href="#contact" 
              className="hidden sm:block px-6 py-2 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Hire Us
            </a>
          </div>
        </div>
      </header>

      <main>
      {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <div className="accent-line-left mb-8">
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Global Safety Stewards</span>
          </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 text-balance">
                SECURE<br />
                INFRA<br />
                <span className="text-primary">BUILDERS</span>
            </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mb-12 leading-relaxed">
                A self-funded team dedicated to building secure products on Coreum and Cosmos for over 3.5 years. We believe in decentralized truth and robust engineering.
              </p>
              <div className="flex flex-wrap gap-6">
                <a href="#products" className="px-8 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest hover:translate-y-[-2px] transition-transform">
                  Explore Suite
                </a>
                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Part of House of Exegesis (PMCO)</span>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              {/* Asymmetric Design Element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-accent/5 via-transparent to-accent-secondary/5 rounded-full blur-3xl" />
              <div className="card-open-right p-12 relative z-10 border-l-4 border-accent">
                <div className="flex flex-col gap-8">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center rounded-lg">
                      <IoCodeSlashOutline className="w-6 h-6 text-accent" />
                </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Custom Development</h3>
                      <p className="text-sm text-muted-foreground">High-security treasury and infrastructure solutions.</p>
              </div>
            </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-accent-secondary/10 flex items-center justify-center rounded-lg">
                      <IoLockClosedOutline className="w-6 h-6 text-accent-secondary" />
                </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Security Audits</h3>
                      <p className="text-sm text-muted-foreground">End-to-end verification of smart contracts and nodes.</p>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Products Section */}
        <section id="products" className="py-32 bg-background relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="mb-20">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Our Suite</h2>
              <div className="w-20 h-2 bg-accent" />
                  </div>

            <div className="grid md:grid-cols-3 gap-12">
              {/* TOKNS.FI */}
              <div className="card-open-bottom p-10 group hover:border-accent transition-all cursor-pointer">
                <span className="text-accent text-xs font-black uppercase tracking-widest mb-4 block">V1 Live</span>
                <h3 className="text-3xl font-black mb-4">TOKNS.FI</h3>
                <p className="text-muted-foreground mb-8">Comprehensive tokenization platform for the Coreum and Cosmos ecosystems.</p>
                <a href="#showcase" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest group-hover:text-accent transition-colors">
                  View Interface <IoArrowForwardOutline />
                </a>
              </div>

              {/* CLIQS.IO */}
              <div className="card-open-bottom p-10 group hover:border-accent-secondary transition-all cursor-pointer">
                <span className="text-accent-secondary text-xs font-black uppercase tracking-widest mb-4 block">V1 Releasing</span>
                <h3 className="text-3xl font-black mb-4">CLIQS.IO</h3>
                <p className="text-muted-foreground mb-8">Institutional-grade treasury management webapp with focus on high security.</p>
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest group-hover:text-accent-secondary transition-colors">
                  Early Access <IoArrowForwardOutline />
              </div>
            </div>

              {/* RIVO */}
              <div className="card-open-right p-10 bg-accent/5 border-l-4 border-accent">
                <span className="text-accent text-xs font-black uppercase tracking-widest mb-4 block">In Stealth</span>
                <h3 className="text-3xl font-black mb-4">RIVO</h3>
                <p className="text-muted-foreground mb-8">Our secret sauce project.</p>
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent">
                  Stay Tuned <IoGlobeOutline />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-24 bg-card/10 border-y border-border/50 overflow-hidden relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative z-10">
              <div className="accent-line-left mb-8">
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Ecosystem Hub</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.85] text-balance">
                THE NEW<br />
                COMMAND<br />
                <span className="text-primary">CENTER</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-lg leading-relaxed">
                Track assets across 10+ chains in one unified view. From real-time rewards to deep portfolio analytics, TOKNS.FI is built for the professional steward.
              </p>
              
              <div className="flex flex-wrap gap-10">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-accent-secondary">75K+</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Portfolio Tracking</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-accent">LVL 3</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Rewards Tiers</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Desktop Preview */}
              <div className="relative z-10 rounded-2xl overflow-hidden border border-border shadow-2xl shadow-black/20 bg-[#1a1816] transform lg:rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                <div className="h-8 bg-muted/80 border-b border-border flex items-center px-4 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                  <div className="mx-auto text-[10px] text-muted-foreground font-mono tracking-tighter opacity-50">app.tokns.fi</div>
                </div>
                <div className="aspect-[16/10] relative bg-[#1a1816] overflow-hidden">
                  <img 
                    src="/tokns-v2-desktop.png" 
                    alt="TOKNS Desktop Interface" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Mobile Preview Overlay */}
              <div className="absolute -bottom-12 -left-12 z-20 w-[240px] hidden xl:block rounded-[3rem] overflow-hidden border-[12px] border-[#0f0e0d] shadow-2xl shadow-black/30 transform rotate-[4deg] hover:rotate-0 hover:scale-105 transition-all duration-500">
                 {/* Notch/Dynamic Island effect */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#0f0e0d] rounded-b-2xl z-30" />
                 <div className="aspect-[9/19.5] relative bg-[#1a1816] overflow-hidden">
                  <img 
                    src="/tokns-v2-mobile.png" 
                    alt="TOKNS Mobile Interface" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Background accent */}
              <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Validator Section */}
        <section id="validator" className="py-32 bg-[var(--validator-bg)] relative overflow-hidden transition-colors duration-300">
          <div className="container mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-20">
              <IoShieldCheckmarkOutline className="text-accent w-20 h-20 mb-8 mx-auto" />
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 text-balance">
                Supporting Decentralized <span className="text-accent">Truth</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                We run a hardened validator for Coreum with enterprise-grade sentry node infrastructure. Our proposal for a Native Burn feature was successfully merged with the Coreum Foundation, proving our commitment to the network's health.
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-16">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black">99.9%</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Uptime</span>
                </div>
                <div className="w-px h-12 bg-border hidden sm:block" />
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black">0%</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Slashes</span>
                </div>
                <div className="w-px h-12 bg-border hidden sm:block" />
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black">24/7</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Monitoring</span>
                </div>
              </div>
            </div>

            {/* Sentry Node Features Grid */}
            <div className="mb-16">
              <div className="accent-line-left mb-8 inline-block">
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Enterprise Infrastructure</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-12">
                Sentry Node <span className="text-accent">Features</span>
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* High-Performance Processors */}
                <div className="card-open-bottom p-8 group hover:border-accent transition-all">
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center rounded-lg mb-4 group-hover:bg-accent/20 transition-colors">
                    <IoHardwareChipOutline className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="text-xl font-black mb-2">12-Core Processors</h4>
                  <p className="text-sm text-muted-foreground">3.7GHz processing power for maximum throughput</p>
                </div>

                {/* High Memory */}
                <div className="card-open-bottom p-8 group hover:border-accent-secondary transition-all">
                  <div className="w-12 h-12 bg-accent-secondary/10 flex items-center justify-center rounded-lg mb-4 group-hover:bg-accent-secondary/20 transition-colors">
                    <IoServerOutline className="w-6 h-6 text-accent-secondary" />
                  </div>
                  <h4 className="text-xl font-black mb-2">96GB RAM</h4>
                  <p className="text-sm text-muted-foreground">High-throughput memory for optimal performance</p>
                </div>

                {/* Dual NVMe Storage */}
                <div className="card-open-bottom p-8 group hover:border-accent transition-all">
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center rounded-lg mb-4 group-hover:bg-accent/20 transition-colors">
                    <IoCubeOutline className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="text-xl font-black mb-2">Dual NVMe Storage</h4>
                  <p className="text-sm text-muted-foreground">Ultra-fast storage for rapid data access</p>
                </div>

                {/* Network Connectivity */}
                <div className="card-open-bottom p-8 group hover:border-accent-secondary transition-all">
                  <div className="w-12 h-12 bg-accent-secondary/10 flex items-center justify-center rounded-lg mb-4 group-hover:bg-accent-secondary/20 transition-colors">
                    <IoRadioOutline className="w-6 h-6 text-accent-secondary" />
                  </div>
                  <h4 className="text-xl font-black mb-2">3Gbps Network</h4>
                  <p className="text-sm text-muted-foreground">High-speed connectivity for low-latency operations</p>
                </div>

                {/* 24/7 Monitoring */}
                <div className="card-open-bottom p-8 group hover:border-accent transition-all">
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center rounded-lg mb-4 group-hover:bg-accent/20 transition-colors">
                    <IoEye className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="text-xl font-black mb-2">24/7 Monitoring</h4>
                  <p className="text-sm text-muted-foreground">Automated failover and continuous oversight</p>
                </div>

                {/* Sentry Nodes */}
                <div className="card-open-bottom p-8 group hover:border-accent-secondary transition-all">
                  <div className="w-12 h-12 bg-accent-secondary/10 flex items-center justify-center rounded-lg mb-4 group-hover:bg-accent-secondary/20 transition-colors">
                    <IoShieldCheckmarkOutline className="w-6 h-6 text-accent-secondary" />
                  </div>
                  <h4 className="text-xl font-black mb-2">Multiple Sentry Nodes</h4>
                  <p className="text-sm text-muted-foreground">DDoS protection and enhanced security layers</p>
                </div>

                {/* Multisig Protection */}
                <div className="card-open-bottom p-8 group hover:border-accent transition-all">
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center rounded-lg mb-4 group-hover:bg-accent/20 transition-colors">
                    <IoLockClosedOutline className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="text-xl font-black mb-2">3-of-5 Multisig</h4>
                  <p className="text-sm text-muted-foreground">Military-grade wallet protection for your assets</p>
                </div>

                {/* Geographic Distribution */}
                <div className="card-open-bottom p-8 group hover:border-accent-secondary transition-all">
                  <div className="w-12 h-12 bg-accent-secondary/10 flex items-center justify-center rounded-lg mb-4 group-hover:bg-accent-secondary/20 transition-colors">
                    <IoLocation className="w-6 h-6 text-accent-secondary" />
                  </div>
                  <h4 className="text-xl font-black mb-2">Geographically Distributed</h4>
                  <p className="text-sm text-muted-foreground">Servers across multiple regions for redundancy</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <a href="https://v1.shieldnest.org/dashboard?action=redelegate" target="_blank" className="inline-block px-10 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest hover:bg-accent transition-colors">
                Re-delegate Now
              </a>
            </div>
        </div>
      </section>

        {/* Inquiry Form */}
        <section id="contact" className="py-32 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-start">
              <div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">Build Secure <br />Infrastructure</h2>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                  Looking for funding, grants, or a technical partner? Inquire about our services or larger delegations.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <IoMailOutline className="text-accent w-6 h-6" />
                    <span className="font-bold">security@shieldnest.org</span>
          </div>
                  <div className="flex items-center gap-4">
                    <IoGlobeOutline className="text-accent w-6 h-6" />
                    <span className="font-bold">shieldnest.org</span>
        </div>
                </div>
              </div>

              <div className="card-open-left p-10 bg-card border-r-4 border-primary">
                {submitStatus === 'success' ? (
                  <div className="text-center py-10">
                    <IoShieldCheckmarkOutline className="w-16 h-16 text-accent mx-auto mb-6" />
                    <h3 className="text-2xl font-black mb-2">Message Sent</h3>
                    <p className="text-muted-foreground">We'll get back to you shortly.</p>
                    <button onClick={() => setSubmitStatus('idle')} className="mt-8 text-accent font-bold uppercase text-sm tracking-widest">Send another</button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-background border border-border p-4 focus:border-accent outline-none transition-colors"
                        placeholder="team@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-2">Inquiry Type</label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full bg-background border border-border p-4 focus:border-accent outline-none appearance-none cursor-pointer"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="hire">Hire the Dev Team</option>
                        <option value="partnership">Partnership</option>
                        <option value="delegation">Large Delegation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest mb-2">Message</label>
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full bg-background border border-border p-4 focus:border-accent outline-none transition-colors resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                    </button>
                    {submitStatus === 'error' && (
                      <p className="text-red-500 text-sm text-center">Failed to send inquiry. Please try again.</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <BlogSection />
      </main>

      {/* Footer */}
      <footer className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/shld_dark.svg" alt="ShieldNest" width={32} height={32} />
              <span className="font-black tracking-tighter">SHIELDNEST</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs mb-8">
              Global safety stewards protecting the Coreum and Cosmos ecosystems since 2022. Ran under House of Exegesis (PMCO).
            </p>
            <div className="flex gap-6">
              <a href="https://github.com/ShieldNEST-org" target="_blank" className="hover:text-accent transition-colors"><IoCodeSlashOutline className="w-6 h-6" /></a>
              <a href="https://x.com/shieldnest_org" target="_blank" className="hover:text-accent transition-colors"><IoGlobeOutline className="w-6 h-6" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-black uppercase text-xs tracking-widest mb-6">Explore</h4>
            <nav className="flex flex-col gap-4 text-sm text-muted-foreground">
              <a href="#products" className="hover:text-foreground">Products</a>
              <a href="#validator" className="hover:text-foreground">Validator</a>
              <a href="#about" className="hover:text-foreground">About Us</a>
              <a href="https://v1.shieldnest.org" className="hover:text-foreground">Launch App</a>
            </nav>
              </div>
              
          <div>
            <h4 className="font-black uppercase text-xs tracking-widest mb-6">Contact</h4>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">security@shieldnest.org</p>
              <p>House of Exegesis - PMCO</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-20 pt-8 border-t border-border text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
          © 2025 Shieldnest Development Team. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
