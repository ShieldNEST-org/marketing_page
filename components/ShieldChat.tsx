'use client';

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { IoArrowForward, IoChevronForward, IoChevronBack, IoLayers, IoCheckmarkCircle, IoGift, IoImages, IoHelpCircle, IoSparkles } from 'react-icons/io5';

// Message interface
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  canExpand?: boolean;
  suggestions?: string[];
}

interface ShieldChatProps {
  forceOpen?: boolean;
}

// Helper function to parse markdown-style text with brand coloration
const parseMarkdown = (text: string, primaryColor: string = '#7a6654', secondaryColor: string = '#06b6d4') => {
  const lines = text.split('\n');
  const elements: React.ReactElement[] = [];
  let currentParagraph: string[] = [];
  let listItems: string[] = [];
  let inList = false;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.join(' ');
      elements.push(
        <p key={elements.length} className="mb-3 leading-relaxed last:mb-0">
          {parseInlineFormatting(content)}
        </p>
      );
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={elements.length} className="mb-4 pl-5 space-y-2 last:mb-0">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed opacity-90">
              <span style={{ color: idx % 2 === 0 ? primaryColor : secondaryColor }} className="mr-2">•</span>
              {parseInlineFormatting(item)}
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
        <strong key={`bold-${key++}`} className="font-semibold" style={{ color: key % 2 === 0 ? primaryColor : secondaryColor }}>
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
    const codeRegex = /`(.+?)`/g;
    let lastIndex = 0;
    let match;
    let key = baseKey;

    while ((match = codeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <code key={`code-${key++}`} className="bg-white/10 px-2 py-0.5 rounded text-sm font-mono" style={{ color: secondaryColor }}>
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

    if (trimmed.startsWith('###')) {
      flushParagraph();
      flushList();
      elements.push(
        <h4 key={elements.length} className="text-base font-semibold mb-3 mt-2" style={{ color: secondaryColor }}>
          {trimmed.substring(3).trim()}
        </h4>
      );
    } else if (trimmed.startsWith('##')) {
      flushParagraph();
      flushList();
      elements.push(
        <h3 key={elements.length} className="text-lg font-semibold mb-3 mt-3" style={{ color: primaryColor }}>
          {trimmed.substring(2).trim()}
        </h3>
      );
    } else if (trimmed.startsWith('#')) {
      flushParagraph();
      flushList();
      elements.push(
        <h2 key={elements.length} className="text-xl font-bold mb-4 mt-2 font-black tracking-tighter" style={{ color: primaryColor }}>
          {trimmed.substring(1).trim()}
        </h2>
      );
    } else if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      inList = true;
      const itemText = trimmed.substring(trimmed.startsWith('•') ? 1 : 2).trim();
      listItems.push(itemText);
    } else if (trimmed === '') {
      inList ? flushList() : flushParagraph();
    } else {
      if (inList) flushList();
      currentParagraph.push(trimmed);
    }
  });

  flushParagraph();
  flushList();

  return elements.length > 0 ? elements : [<p key="0">{text}</p>];
};

const FloatingChatButton = memo(({ 
  isOpen, 
  setIsOpen, 
  isTucked, 
  setIsTucked, 
  primaryColor,
  logoBg
}: any) => {
  const [rotation, setRotation] = useState(0);
  const buttonRef = useRef<HTMLDivElement>(null);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const buttonWidth = isMobile ? 40 : 160; // Match main app update
  const buttonHeight = isMobile ? 40 : 44;
  const logoSize = isMobile ? 24 : 26;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + (isMobile ? rect.width / 2 : logoSize / 2 + 16);
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 180;
      setRotation(angle);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, logoSize]);

  return (
    <motion.div
      className="fixed z-[9999]"
      ref={buttonRef}
      style={{ pointerEvents: 'auto' }}
      animate={{
        bottom: 32,
        right: isTucked ? -(buttonWidth * 0.7) : 32,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div style={{ width: buttonWidth, height: buttonHeight }}>
        <motion.button
          onClick={() => isTucked ? setIsTucked(false) : setIsOpen(!isOpen)}
          className="relative w-full h-full cursor-pointer flex items-center overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            background: logoBg,
            backdropFilter: 'blur(10px)',
            borderColor: `${primaryColor}4D`,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: isMobile ? '50%' : '12px',
            boxShadow: `0 3px 10px rgba(0,0,0,0.4), inset 0 2px 6px rgba(255,255,255,0.1), inset 0 -6px 16px rgba(0,0,0,0.4)`,
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 px-3 w-full h-full">
            {/* Tucked indicator (Desktop Only) */}
            {isTucked && !isMobile && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center"
              >
                <IoChevronBack className="text-white/80" size={16} />
              </motion.div>
            )}

            <motion.div 
              className="flex-shrink-0"
              animate={{ rotate: isMobile ? 0 : rotation }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Image
                src="/shield_bronze.png"
                alt="ShieldChat"
                width={logoSize}
                height={logoSize}
                className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
            
            {!isMobile && !isTucked && (
              <>
                <span className="text-white font-bold text-sm tracking-tight whitespace-nowrap opacity-90">
                  ShieldChat
                </span>
                
                {/* Tuck Action Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-auto"
                >
                  <div
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTucked(true);
                    }}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                    title="Tuck away"
                  >
                    <IoChevronForward className="text-white/60" size={18} />
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
});

const ShieldChat = ({ forceOpen = false }: ShieldChatProps) => {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [isTucked, setIsTucked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '🛡️ Hey! Welcome to ShieldNest. I\'m ShieldChat - your friendly DeFi assistant. I can help with Coreum blockchain, Shield NFT, and more. What\'s on your mind? 😊',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [colors, setColors] = useState({
    primary: '#7a6654',
    secondary: '#06b6d4',
    purple: '#7a5195',
    teal: '#06b6d4',
    primaryBorder: 'rgba(122, 102, 84, 0.3)',
    logoBg: 'linear-gradient(135deg, #1f1d1b 0%, #2a2724 100%)',
    windowBg: 'linear-gradient(145deg, rgba(31, 29, 27, 0.98), rgba(24, 22, 20, 0.98))'
  });

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const theme = root.getAttribute('data-theme') || 'focused';
      const isCreative = theme === 'creative';
      
      const purple = '#7a5195';
      const teal = '#06b6d4';
      const primary = isCreative ? purple : '#7a6654';
      const secondary = isCreative ? teal : purple;

      setColors({
        primary,
        secondary,
        purple,
        teal,
        primaryBorder: `${primary}4D`,
        logoBg: isCreative 
          ? 'linear-gradient(135deg, #ebeae6 0%, #ffffff 100%)' 
          : 'linear-gradient(135deg, #1f1d1b 0%, #2a2724 100%)',
        windowBg: isCreative
          ? 'linear-gradient(145deg, rgba(235, 234, 230, 0.98), rgba(255, 255, 255, 0.98))'
          : 'linear-gradient(145deg, rgba(31, 29, 27, 0.98), rgba(24, 22, 20, 0.98))'
      });
    };

    updateColors();
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content, timestamp: new Date() }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, sessionId })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || 'Sorry, I couldn\'t process that.', 
        timestamp: new Date(),
        suggestions: data.suggestions 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '🛡️ Oops! Connection error. Please try again.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FloatingChatButton 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        isTucked={isTucked} 
        setIsTucked={setIsTucked} 
        primaryColor={colors.primary}
        logoBg={colors.logoBg}
      />

      {isOpen && (
        <div
          id="shield-chat-window"
          className="fixed bottom-24 right-8 w-[400px] max-w-[calc(100vw-4rem)] h-[600px] max-h-[calc(100vh-10rem)] border rounded-2xl backdrop-blur-[20px] z-[9998] flex flex-col overflow-hidden"
          style={{
            borderColor: colors.primaryBorder,
            background: colors.windowBg,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div 
            className="p-5 border-b flex justify-between items-center"
            style={{
              background: `${colors.primary}1A`,
              borderBottomColor: colors.primaryBorder
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full relative overflow-hidden" style={{ background: colors.logoBg, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1)' }}>
                <Image src="/shield_bronze.png" alt="Logo" width={29} height={29} />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">ShieldChat Assistant</h3>
                <p className="text-[10px] opacity-60 uppercase tracking-widest">Marketing & Support</p>
              </div>
            </div>
            <button
              className="text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => { setIsOpen(false); setIsTucked(true); }}
            >
              <IoChevronForward className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                <div
                  className={`p-4 px-5 leading-relaxed rounded-2xl border ${msg.role === 'user' ? 'bg-primary text-primary-foreground border-transparent' : 'bg-card text-foreground border-border'}`}
                >
                  {msg.role === 'assistant' ? parseMarkdown(msg.content, colors.primary, colors.secondary) : msg.content}
                </div>
                {msg.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        className="border py-1.5 px-3 rounded-lg text-xs hover:bg-white/5 transition-all"
                        style={{ borderColor: colors.primaryBorder, color: colors.primary, background: `${colors.primary}0D` }}
                        onClick={() => sendMessage(sug)}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className="text-xs opacity-50 animate-pulse">ShieldChat is typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 px-5 border-t border-border flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask ShieldChat..."
              disabled={isLoading}
              className="flex-1 bg-background border border-border rounded-xl py-3 px-4 text-foreground outline-none focus:border-primary transition-all"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-primary text-primary-foreground rounded-xl w-11 h-11 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <IoArrowForward />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShieldChat;
