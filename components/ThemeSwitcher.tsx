'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * ThemeSwitcher (Cosmic Orbital Switcher)
 * File: components/ThemeSwitcher.tsx
 * 
 * Upgraded to match the main app's orbital animations using framer-motion.
 */

interface ThemeSwitcherProps {
  theme: 'focused' | 'creative';
  toggleTheme: () => void;
}

export default function ThemeSwitcher({ theme, toggleTheme }: ThemeSwitcherProps) {
  const isCreative = theme === 'creative';
  
  // Color mappings
  const purple = '#7a5195';
  const teal = '#06b6d4';
  const orange = '#ffb380';
  
  return (
    <button
      onClick={toggleTheme}
      className="relative w-[53px] h-[53px] flex items-center justify-center bg-transparent border-none cursor-pointer transition-transform duration-300 hover:scale-110"
      aria-label="Switch World Perspective"
      type="button"
    >
      {/* Orbiting path decoration */}
      <motion.div
        className="absolute w-[35px] h-[35px] rounded-full"
        style={{
          border: isCreative 
            ? `1px solid ${purple}` 
            : `1px dashed rgba(255, 255, 255, 0.2)`,
          opacity: isCreative ? 0.2 : 0.5,
        }}
        animate={{
          rotate: isCreative ? 45 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Planet (center circle) */}
      <motion.div
        className="w-[20px] h-[20px] rounded-full relative z-10 transition-colors duration-600"
        style={{
          background: isCreative ? purple : '#e2d2b8',
          boxShadow: isCreative 
            ? `0 0 15px rgba(122, 81, 149, 0.4)` 
            : `0 0 0 4px rgba(122, 102, 84, 0.2)`,
        }}
      />

      {/* Moon (smaller orbiting circle) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        initial={false}
        animate={{
          rotate: isCreative ? 150 : -30,
        }}
        transition={{
          duration: 0.8,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        <motion.div 
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: isCreative ? teal : orange,
            x: 18,
          }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </button>
  );
}
