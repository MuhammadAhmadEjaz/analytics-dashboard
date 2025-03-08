import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-10 w-20 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary transition-colors duration-500 ${
        isDark ? 'bg-dark-bg-tertiary' : 'bg-primary-100'
      } ${className}`}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="sr-only">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>
      
      {/* Track background */}
      <span
        className={`absolute inset-0.5 mx-0.5 rounded-full transition duration-300 ${
          isDark ? 'bg-dark-bg-secondary' : 'bg-white'
        }`}
      />
      
      {/* Sun Icon */}
      <span
        className={`absolute left-1 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500 ${
          isDark ? 'translate-x-0 opacity-50' : 'translate-x-10 opacity-100'
        }`}
      >
        <motion.span
          initial={false}
          animate={{ 
            rotate: isDark ? 0 : 360,
            scale: isDark ? 0.7 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <SunIcon 
            className={`h-6 w-6 transition-colors duration-300 ${
              isDark ? 'text-neutral-500' : 'text-yellow-500'
            }`} 
          />
        </motion.span>
      </span>
      
      {/* Moon Icon */}
      <span
        className={`absolute left-1 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500 ${
          isDark ? 'translate-x-10 opacity-100' : 'translate-x-0 opacity-50'
        }`}
      >
        <motion.span
          initial={false}
          animate={{ 
            rotate: isDark ? 360 : 0,
            scale: isDark ? 1 : 0.7
          }}
          transition={{ duration: 0.5 }}
        >
          <MoonIcon 
            className={`h-6 w-6 transition-colors duration-300 ${
              isDark ? 'text-primary-300' : 'text-neutral-500'
            }`} 
          />
        </motion.span>
      </span>
    </button>
  );
};

export default ThemeToggle; 