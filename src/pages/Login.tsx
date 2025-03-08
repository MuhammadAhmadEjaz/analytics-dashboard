import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { ChartBarIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const { login, isAuthenticated, isLoading, error } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Autofill demo credentials
  const fillDemoCredentials = () => {
    setEmail('analytics@demo.com');
    setPassword('12345678');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Floating particles for background
  const generateParticles = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 3,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
  };

  const particles = generateParticles(15);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-100 dark:bg-dark-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      {/* Animated background */}
      <div className="login-bg"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white dark:bg-primary-500 opacity-20 dark:opacity-10"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() > 0.5 ? 15 : -15, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Theme toggle button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white dark:bg-dark-bg-tertiary shadow-soft-light dark:shadow-soft-dark transition-all duration-300"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-primary-600" />
          )}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Logo and Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <ChartBarIcon className="h-16 w-16 text-primary-600 dark:text-primary-500" />
              </motion.div>
            </div>
            <motion.h1 
              className="text-3xl font-future font-bold gradient-text"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
              }}
              transition={{ 
                duration: 15, 
                ease: "easeInOut", 
                repeat: Infinity 
              }}
              style={{
                backgroundSize: '200% auto'
              }}
            >
              Analytics Dashboard
            </motion.h1>
            <p className="mt-2 text-neutral-600 dark:text-dark-text-secondary">
              Cutting-edge data visualization platform
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div 
            variants={itemVariants}
            className="glass-panel overflow-hidden"
            whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-radial from-primary-300/20 to-transparent dark:from-primary-900/20 -z-10"></div>
            
            {/* Login Form */}
            <div className="p-8">
              <h2 className="text-xl font-tech mb-6 text-neutral-800 dark:text-dark-text-primary">
                Sign in to your account
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {(error || loginError) && (
                  <div className="mb-4 p-3 bg-danger-100 text-danger-700 rounded-md dark:bg-danger-900/30 dark:text-danger-300">
                    {error || loginError}
                  </div>
                )}

                <div className="flex flex-col space-y-4">
                  <motion.button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      'Sign in'
                    )}
                  </motion.button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-300 dark:border-dark-border-subtle"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-sm text-neutral-500 dark:bg-dark-bg-tertiary dark:text-dark-text-tertiary">or</span>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                    className="btn btn-outline"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {showDemoCredentials ? 'Hide demo credentials' : 'Show demo credentials'}
                  </motion.button>
                </div>
              </form>

              {showDemoCredentials && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 p-4 bg-info-100 text-info-800 rounded-md dark:bg-info-900/20 dark:text-info-300"
                >
                  <h3 className="font-semibold mb-2">Demo Credentials</h3>
                  <p className="mb-1">Email: <code className="code-text bg-info-200/50 dark:bg-info-800/30 px-1 rounded">analytics@demo.com</code></p>
                  <p className="mb-3">Password: <code className="code-text bg-info-200/50 dark:bg-info-800/30 px-1 rounded">12345678</code></p>
                  <motion.button
                    onClick={fillDemoCredentials}
                    className="text-sm btn btn-outline border-info-300 text-info-700 hover:bg-info-50 dark:border-info-700 dark:text-info-400 dark:hover:bg-info-900/30 py-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Auto-fill credentials
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-neutral-600 dark:text-dark-text-tertiary">
            <p>© 2023 Analytics Dashboard. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 