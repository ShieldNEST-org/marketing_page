'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { IoArrowForward, IoChevronForward, IoLayers, IoCheckmarkCircle, IoGift, IoImages, IoHelpCircle, IoSparkles } from 'react-icons/io5';

// Message interface
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  canExpand?: boolean;
  suggestions?: string[];
}

// Quick card type for action buttons vs question prompts
interface QuickCard {
  type: 'action' | 'question';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
}

// Helper function to parse markdown-style text with ENHANCED styling
const parseMarkdown = (text: string) => {
  const lines = text.split('\n');
  const elements: React.ReactElement[] = [];
  let currentParagraph: string[] = [];
  let listItems: string[] = [];
  let inList = false;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.join(' ');
      elements.push(
        <p key={elements.length} className="mb-5 leading-[1.85] text-[rgba(255,255,255,0.88)] last:mb-0">
          {parseInlineFormatting(content)}
        </p>
      );
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={elements.length} className="mb-6 pl-1 space-y-3 last:mb-0">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-[rgba(255,255,255,0.88)] leading-[1.8] flex items-start gap-3">
              <span className="text-[#25d695] mt-1.5 text-lg flex-shrink-0">•</span>
              <span>{parseInlineFormatting(item)}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const parseInlineFormatting = (text: string): (string | React.ReactElement)[] => {
    const parts: (string | React.ReactElement)[] = [];
    const remaining = text;
    let key = 0;

    // Parse bold **text**
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        const before = remaining.substring(lastIndex, match.index);
        parts.push(...parseItalicAndCode(before, key));
        key += 100;
      }
      parts.push(
        <strong key={`bold-${key++}`} className="font-bold text-[#c4b5fd]">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < remaining.length) {
      parts.push(...parseItalicAndCode(remaining.substring(lastIndex), key));
    }

    return parts;
  };

  const parseItalicAndCode = (text: string, baseKey: number): (string | React.ReactElement)[] => {
    const parts: (string | React.ReactElement)[] = [];
    
    // Parse code `text`
    const codeRegex = /`(.+?)`/g;
    let lastIndex = 0;
    let match;
    let key = baseKey;

    while ((match = codeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <code key={`code-${key++}`} className="bg-[rgba(37,214,149,0.18)] text-[#5ff5bc] px-2.5 py-1 rounded-md text-sm font-mono border border-[rgba(37,214,149,0.25)]">
          {match[1]}
        </code>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Headers - ENHANCED with better colors and spacing
    if (trimmed.startsWith('###')) {
      flushParagraph();
      flushList();
      elements.push(
        <h4 key={elements.length} className="text-base font-bold text-[#60a5fa] mb-4 mt-5 tracking-wide">
          {trimmed.substring(3).trim()}
        </h4>
      );
    } else if (trimmed.startsWith('##')) {
      flushParagraph();
      flushList();
      elements.push(
        <h3 key={elements.length} className="text-lg font-bold text-[#a78bfa] mb-4 mt-6 tracking-wide">
          {trimmed.substring(2).trim()}
        </h3>
      );
    } else if (trimmed.startsWith('#')) {
      flushParagraph();
      flushList();
      elements.push(
        <h2 key={elements.length} className="text-xl font-bold bg-gradient-to-r from-[#25d695] via-[#5ff5bc] to-[#a78bfa] bg-clip-text text-transparent mb-5 mt-4 tracking-tight">
          {trimmed.substring(1).trim()}
        </h2>
      );
    }
    // List items
    else if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      inList = true;
      const itemText = trimmed.startsWith('•') 
        ? trimmed.substring(1).trim() 
        : trimmed.substring(2).trim();
      listItems.push(itemText);
    }
    // Numbered list items
    else if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      inList = true;
      const itemText = trimmed.replace(/^\d+\.\s/, '').trim();
      listItems.push(itemText);
    }
    // Empty lines
    else if (trimmed === '') {
      if (inList) {
        flushList();
      } else {
        flushParagraph();
      }
    }
    // Regular text
    else {
      if (inList) {
        flushList();
      }
      currentParagraph.push(trimmed);
    }
  });

  // Flush any remaining content
  flushParagraph();
  flushList();

  return elements.length > 0 ? elements : [<p key="0" className="leading-[1.85] text-[rgba(255,255,255,0.88)]">{text}</p>];
};

const WiseOwlChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTucked, setIsTucked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '🛡️ Hey! Welcome to **ShieldNest**.\n\nI\'m your friendly DeFi assistant - I can help you learn about:\n\n• **Coreum blockchain** and its features\n• **Shield NFT** benefits and staking\n• **Token swaps** and DeFi basics\n• **Security** best practices\n\nWhat would you like to know? 😊',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [rotation, setRotation] = useState(0);
  const [chatHeight, setChatHeight] = useState(700);
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track mouse position and calculate rotation (desktop only)
  useEffect(() => {
    if (isMobile) {
      setRotation(0);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const deltaX = mouseX - buttonCenterX;
      const deltaY = mouseY - buttonCenterY;
      
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 180;
      
      setRotation(angle);
    };

    window.addEventListener('mousemove', handleMouseMove, { capture: true, passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove, true);
  }, [isMobile]);

  useEffect(() => {
    if (lastUserMessageRef.current) {
      lastUserMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle resize drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !chatContainerRef.current) return;
      
      const containerRect = chatContainerRef.current.getBoundingClientRect();
      const newHeight = containerRect.bottom - e.clientY;
      
      const clampedHeight = Math.max(300, Math.min(900, newHeight));
      setChatHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // For the marketing site, we'll use a simpler response system
      // In production, this would call the actual chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          sessionId,
          project: 'shieldnest-marketing'
        })
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'I\'m here to help! Feel free to ask about ShieldNest, Coreum, staking, or anything else.',
        timestamp: new Date(),
        canExpand: data.canExpand,
        suggestions: data.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback response for when API isn't available
      const fallbackMessage: Message = {
        role: 'assistant',
        content: `## Thanks for your question!\n\nI'm the ShieldNest assistant. While I'm still being set up for the marketing site, you can:\n\n• **Visit the app** at [v1.shieldnest.org](https://v1.shieldnest.org) for the full experience\n• **Learn about staking** with our enterprise-grade validator\n• **Explore Shield NFT** benefits for premium features\n\nFeel free to ask me anything about Coreum, DeFi, or crypto security! 🛡️`,
        timestamp: new Date(),
        suggestions: ['Tell me about staking', 'What is Shield NFT?', 'How does Coreum work?']
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick cards for initial view
  const quickCards: QuickCard[] = [
    { type: 'action', label: 'Staking', icon: IoLayers, path: 'https://v1.shieldnest.org/dashboard?action=stake' },
    { type: 'action', label: 'Validator', icon: IoCheckmarkCircle, path: 'https://v1.shieldnest.org' },
    { type: 'action', label: 'Rewards', icon: IoGift, path: 'https://v1.shieldnest.org/rewards' },
    { type: 'action', label: 'NFTs', icon: IoImages, path: 'https://v1.shieldnest.org/marketplace' },
    { type: 'question', label: 'What is Coreum?', icon: IoHelpCircle },
    { type: 'question', label: 'How to stake?', icon: IoSparkles }
  ];

  // Color scheme
  const colors = {
    primary: '#a78bfa',
    primaryLight: 'rgba(167, 139, 250, 0.15)',
    primaryBorder: 'rgba(167, 139, 250, 0.3)',
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    glow: 'rgba(167, 139, 250, 0.4)',
  };

  const buttonSize = isMobile ? 40 : 56;
  const logoSize = isMobile ? 24 : 38;

  return (
    <>
      {/* Chat Button */}
      <motion.div 
        className="fixed z-[9999]" 
        ref={buttonRef}
        style={{ pointerEvents: 'auto' }}
        animate={{
          bottom: isMobile ? 16 : 32,
          right: isTucked ? -(buttonSize * 0.65) : (isMobile ? 16 : 32),
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <div 
          className="relative"
          style={{ 
            width: buttonSize, 
            height: buttonSize 
          }}
        >
          {/* Animated rings */}
          {!isOpen && !isTucked && (
            <>
              <motion.span 
                className="absolute top-0 left-0 w-full h-full rounded-full border-2 pointer-events-none"
                style={{ borderColor: '#a78bfa' }}
                animate={{
                  scale: [1, 1.2, 1.4],
                  opacity: [0.5, 0.25, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              <motion.span 
                className="absolute top-0 left-0 w-full h-full rounded-full border pointer-events-none"
                style={{ borderColor: '#a78bfa' }}
                animate={{
                  scale: [1, 1.15],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </>
          )}
          
          {/* Main button */}
          <motion.button
            onClick={() => {
              if (isTucked) {
                setIsTucked(false);
              } else {
                setIsOpen(!isOpen);
              }
            }}
            className="relative w-full h-full rounded-full border cursor-pointer flex items-center justify-center overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              background: 'rgba(167, 139, 250, 0.08)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderColor: 'rgba(167, 139, 250, 0.2)',
              boxShadow: `
                0 6px 20px rgba(167, 139, 250, 0.25),
                0 3px 10px rgba(0,0,0,0.4),
                inset 0 2px 6px rgba(255,255,255,0.3),
                inset 0 -6px 16px rgba(0,0,0,0.4)
              `,
              pointerEvents: 'auto'
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: isMobile ? 0 : rotation,
            }}
            transition={{
              rotate: isMobile ? { duration: 0 } : { 
                type: "spring", 
                stiffness: 100, 
                damping: 15 
              },
            }}
            whileHover={{ 
              scale: 1.1, 
              y: -4,
            }}
            whileTap={{ 
              scale: 0.95, 
              y: -2
            }}
            initial={{ opacity: 0, scale: 0 }}
          >
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.25) 0%, transparent 70%)',
                mixBlendMode: 'overlay'
              }}
            />
            
            <Image
              src="/shld_dark.svg"
              alt="Shield Nest"
              width={logoSize}
              height={logoSize}
              className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            className={`fixed bg-[rgba(20,20,20,0.95)] border rounded-2xl backdrop-blur-[20px] z-[9998] flex flex-col overflow-hidden ${
              isMobile 
                ? 'bottom-16 right-2 left-2 w-auto' 
                : 'bottom-24 right-8 w-[420px] max-w-[calc(100vw-4rem)]'
            }`}
            style={{
              height: isMobile ? 'calc(100vh - 5rem)' : `${chatHeight}px`,
              maxHeight: isMobile ? 'calc(100vh - 5rem)' : 'calc(100vh - 10rem)',
              borderColor: 'rgba(167,139,250,0.3)',
              background: 'linear-gradient(145deg, rgba(25,25,35,0.98), rgba(15,15,25,0.98))',
              boxShadow: `
                -12px -12px 24px rgba(40,40,50,0.4),
                12px 12px 24px rgba(0,0,0,0.8),
                inset 2px 2px 6px rgba(255,255,255,0.03),
                inset -2px -2px 6px rgba(0,0,0,0.5),
                0 0 0 1px rgba(167,139,250,0.2)
              `
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Resize Handle */}
            {!isMobile && (
              <div
                className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-[rgba(167,139,250,0.3)] transition-colors z-10"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizing(true);
                }}
                style={{
                  borderTopLeftRadius: '1rem',
                  borderTopRightRadius: '1rem',
                }}
              >
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[rgba(167,139,250,0.4)] rounded-full" />
              </div>
            )}

            {/* Header */}
            <div 
              className="p-5 border-b flex justify-between items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(109,40,217,0.2) 100%)',
                borderBottomColor: 'rgba(167,139,250,0.4)'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} flex items-center justify-center rounded-full relative overflow-hidden`}
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                    boxShadow: '0 2px 6px rgba(167,139,250,0.2), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  <Image
                    src="/shld_dark.svg"
                    alt="Shield Nest"
                    width={isMobile ? 24 : 29}
                    height={isMobile ? 24 : 29}
                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  />
                </div>
                <div>
                  <h3 
                    className={`m-0 ${isMobile ? 'text-sm' : 'text-base'} font-semibold bg-clip-text text-transparent`}
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)'
                    }}
                  >
                    ShieldNest Assistant
                  </h3>
                  <p className={`m-0 ${isMobile ? 'text-[10px]' : 'text-xs'} text-[rgba(255,255,255,0.6)]`}>
                    Your DeFi Guide
                  </p>
                </div>
              </div>
              
              {/* Close/Tuck button */}
              {isMobile ? (
                <button
                  className="bg-transparent border border-[rgba(255,255,255,0.2)] cursor-pointer w-8 h-8 flex items-center justify-center transition-all rounded-lg hover:bg-[rgba(255,255,255,0.1)]"
                  style={{ color: '#a78bfa' }}
                  onClick={() => {
                    setIsOpen(false);
                    setIsTucked(true);
                  }}
                  title="Tuck away"
                >
                  <IoChevronForward className="w-4 h-4" />
                  <IoChevronForward className="w-4 h-4 -ml-2" />
                </button>
              ) : (
                <button
                  className="bg-transparent border-none text-[rgba(255,255,255,0.6)] text-[32px] cursor-pointer w-8 h-8 flex items-center justify-center transition-all rounded-lg hover:bg-[rgba(255,255,255,0.1)]"
                  style={{ color: '#a78bfa' }}
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </button>
              )}
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 scrollbar-thin scrollbar-track-[rgba(255,255,255,0.05)]"
              style={{
                scrollbarColor: `${colors.primaryBorder} rgba(255,255,255,0.05)`
              }}
            >
              {messages.map((msg, idx) => {
                const isLastUserMessage = msg.role === 'user' && 
                  !messages.slice(idx + 1).some(m => m.role === 'user');
                
                return (
                <motion.div
                  key={idx}
                  ref={isLastUserMessage ? lastUserMessageRef : null}
                  className={`max-w-[88%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`${
                      msg.role === 'user'
                        ? 'text-[#4a1d96] font-medium rounded-[16px_16px_4px_16px]'
                        : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.9)] rounded-[16px_16px_16px_4px]'
                    } p-5 px-6 leading-relaxed`}
                    style={{
                      background: msg.role === 'user' ? colors.gradient : undefined,
                      boxShadow: msg.role === 'user' ? `0 2px 8px ${colors.glow}` : undefined
                    }}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="space-y-1">
                        {parseMarkdown(msg.content)}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          className="border py-2.5 px-4 rounded-lg text-sm cursor-pointer transition-all"
                          style={{
                            background: colors.primaryLight,
                            borderColor: colors.primaryBorder,
                            color: colors.primary
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(167,139,250,0.2)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = colors.primaryLight;
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                          onClick={() => sendMessage(sug)}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
                );
              })}

              {isLoading && (
                <motion.div
                  className="self-start max-w-[85%]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[16px_16px_16px_4px] p-4 flex gap-2">
                    <span 
                      className="w-2 h-2 rounded-full animate-[typingDot_1.4s_infinite]"
                      style={{ backgroundColor: colors.primary }}
                    ></span>
                    <span 
                      className="w-2 h-2 rounded-full animate-[typingDot_1.4s_0.2s_infinite]"
                      style={{ backgroundColor: colors.primary }}
                    ></span>
                    <span 
                      className="w-2 h-2 rounded-full animate-[typingDot_1.4s_0.4s_infinite]"
                      style={{ backgroundColor: colors.primary }}
                    ></span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Cards */}
            {messages.length === 1 && (
              <div className={`p-0 pb-3 grid grid-cols-3 gap-1.5 ${isMobile ? 'px-3' : 'px-4'}`}>
                {quickCards.map((card, idx) => {
                  const IconComponent = card.icon;
                  const isAction = card.type === 'action';
                  
                  return (
                    <button
                      key={idx}
                      className={`border rounded-lg text-[11px] cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                        isMobile ? 'py-2 px-1.5' : 'py-2.5 px-2'
                      }`}
                      style={{
                        background: isAction 
                          ? 'rgba(167, 139, 250, 0.12)' 
                          : 'rgba(37, 214, 149, 0.12)',
                        borderColor: isAction 
                          ? 'rgba(167, 139, 250, 0.25)' 
                          : 'rgba(37, 214, 149, 0.25)',
                        color: isAction ? '#a78bfa' : '#25d695'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isAction 
                          ? 'rgba(167,139,250,0.22)' 
                          : 'rgba(37,214,149,0.22)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isAction 
                          ? 'rgba(167, 139, 250, 0.12)' 
                          : 'rgba(37, 214, 149, 0.12)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      onClick={() => {
                        if (isAction && card.path) {
                          window.open(card.path, '_blank');
                        } else {
                          sendMessage(card.label);
                        }
                      }}
                    >
                      <IconComponent className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                      <span className="leading-tight text-center">{card.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Input */}
            <div 
              className="p-4 px-5 border-t bg-[rgba(10,10,10,0.5)] flex gap-3"
              style={{
                borderTopColor: colors.primaryBorder
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask ShieldNest Assistant..."
                disabled={isLoading}
                className="flex-1 border rounded-xl py-3 px-4 text-white text-[0.95rem] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[rgba(255,255,255,0.4)]"
                style={{
                  borderColor: 'rgba(167,139,250,0.2)',
                  background: 'linear-gradient(145deg, rgba(18,18,28,0.9), rgba(12,12,22,0.9))',
                  boxShadow: `
                    inset 4px 4px 8px rgba(0,0,0,0.5),
                    inset -2px -2px 6px rgba(40,40,50,0.3)
                  `
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#a78bfa';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)';
                }}
              />
              <button
                className="border rounded-xl w-11 h-11 flex items-center justify-center cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(145deg, rgba(25,25,35,0.95), rgba(15,15,25,0.95))',
                  borderColor: 'rgba(167,139,250,0.3)',
                  boxShadow: `
                    -6px -6px 12px rgba(40,40,50,0.5),
                    6px 6px 12px rgba(0,0,0,0.9),
                    inset 2px 2px 4px rgba(255,255,255,0.05),
                    inset -2px -2px 4px rgba(0,0,0,0.5)
                  `,
                  color: '#a78bfa'
                }}
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="rotate-45">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes typingDot {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
};

export default WiseOwlChat;
