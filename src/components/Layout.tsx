import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  CurrencyDollarIcon, 
  CloudIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useTheme } from '../contexts/ThemeContext.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  // Enhanced nav items with colorful icons
  const navItems = [
    { 
      name: 'Overview', 
      path: '/', 
      icon: HomeIcon, 
      color: isDark ? '#4FD1C5' : '#38B2AC', 
      activeColor: '#2DD4BF',
      description: 'Dashboard overview'
    },
    { 
      name: 'Financial', 
      path: '/financial', 
      icon: CurrencyDollarIcon, 
      color: isDark ? '#F6AD55' : '#ED8936', 
      activeColor: '#F97316',
      description: 'Financial analytics'
    },
    { 
      name: 'Weather', 
      path: '/weather', 
      icon: CloudIcon, 
      color: isDark ? '#63B3ED' : '#4299E1', 
      activeColor: '#3B82F6',
      description: 'Weather data'
    },
    { 
      name: 'Social', 
      path: '/social', 
      icon: UserGroupIcon, 
      color: isDark ? '#B794F4' : '#9F7AEA', 
      activeColor: '#8B5CF6',
      description: 'Social media analytics'
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: Cog6ToothIcon, 
      color: isDark ? '#A0AEC0' : '#718096', 
      activeColor: '#94A3B8',
      description: 'Dashboard settings'
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Animation variants
  const sidebarVariants = {
    open: { width: 280, transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { width: 80, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const navItemVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  // Create a hexagonal background pattern for the sidebar
  const hexagonalPattern = {
    backgroundColor: isDark ? 'rgb(15, 23, 42)' : 'rgb(248, 250, 252)',
    backgroundImage: isDark
      ? `radial-gradient(circle at 0% 0%, rgba(46, 144, 255, 0.03) 0%, transparent 20%), 
         radial-gradient(circle at 100% 0%, rgba(174, 47, 233, 0.04) 0%, transparent 20%), 
         radial-gradient(circle at 100% 100%, rgba(255, 97, 225, 0.03) 0%, transparent 20%), 
         radial-gradient(circle at 0% 100%, rgba(56, 178, 172, 0.03) 0%, transparent 20%)`
      : `radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.05) 0%, transparent 20%), 
         radial-gradient(circle at 100% 0%, rgba(232, 121, 249, 0.05) 0%, transparent 20%), 
         radial-gradient(circle at 100% 100%, rgba(245, 158, 11, 0.05) 0%, transparent 20%), 
         radial-gradient(circle at 0% 100%, rgba(16, 185, 129, 0.05) 0%, transparent 20%)`
  };

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-dark-bg-primary transition-colors duration-300">
      {/* Sidebar for desktop */}
      <motion.aside
        className="hidden md:flex flex-col border-r border-neutral-200 dark:border-dark-border-subtle shadow-sm fixed h-full z-10"
        style={hexagonalPattern}
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        initial="open"
      >
        {/* Logo and toggle */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-200 dark:border-dark-border-subtle">
          {sidebarOpen ? (
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-primary-600 dark:text-primary-500" />
              <span className="ml-3 text-lg font-bold text-neutral-900 dark:text-dark-text-primary">Analytics</span>
            </div>
          ) : (
            <ChartBarIcon className="h-8 w-8 text-primary-600 dark:text-primary-500 mx-auto" />
          )}
          <button
            onClick={toggleSidebar}
            className="h-8 w-8 flex items-center justify-center text-neutral-500 dark:text-dark-text-tertiary hover:text-neutral-700 dark:hover:text-dark-text-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-200
                ${sidebarOpen ? 'justify-start' : 'justify-center'}
                ${isActive 
                  ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400' 
                  : 'text-neutral-700 dark:text-dark-text-secondary hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary'
                }
              `}
              title={!sidebarOpen ? item.name : undefined}
            >
              <div className={`relative group ${!sidebarOpen ? 'flex justify-center' : ''}`}>
                <item.icon 
                  className={`h-6 w-6 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'mr-3' : ''}`} 
                  style={{ color: location.pathname === item.path ? item.activeColor : item.color }}
                  aria-hidden="true" 
                />
                {!sidebarOpen && (
                  <span className="absolute left-full ml-2 w-max opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-neutral-800 dark:bg-dark-bg-tertiary text-white dark:text-dark-text-primary text-xs rounded pointer-events-none z-50">
                    {item.name}
                  </span>
                )}
              </div>
              {sidebarOpen && (
                <motion.div 
                  variants={navItemVariants}
                  className="flex flex-col" 
                  animate={sidebarOpen ? "open" : "closed"}
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-neutral-500 dark:text-dark-text-tertiary">{item.description}</span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer with user info and logout */}
        <div className="p-4 border-t border-neutral-200 dark:border-dark-border-subtle">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-neutral-900 dark:text-dark-text-primary">{user?.name || 'User'}</p>
                  <p className="text-xs text-neutral-500 dark:text-dark-text-tertiary">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-500 dark:text-dark-text-tertiary hover:text-neutral-700 dark:hover:text-dark-text-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                aria-label="Log out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold mb-2">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button
                onClick={handleLogout}
                className="p-1 text-neutral-500 dark:text-dark-text-tertiary hover:text-neutral-700 dark:hover:text-dark-text-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                aria-label="Log out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          {mobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-neutral-600 bg-opacity-75 dark:bg-black dark:bg-opacity-80 transition-opacity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />
          )}

          {/* Sidebar */}
          <motion.aside
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-dark-bg-secondary shadow-xl"
            style={hexagonalPattern}
            initial={{ x: "-100%" }}
            animate={{ x: mobileMenuOpen ? 0 : "-100%" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* Close button */}
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={toggleMobileMenu}
                className="h-8 w-8 flex items-center justify-center text-neutral-500 dark:text-dark-text-tertiary hover:text-neutral-700 dark:hover:text-dark-text-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                aria-label="Close sidebar"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Logo */}
            <div className="h-16 px-4 flex items-center border-b border-neutral-200 dark:border-dark-border-subtle">
              <ChartBarIcon className="h-8 w-8 text-primary-600 dark:text-primary-500" />
              <span className="ml-3 text-lg font-bold text-neutral-900 dark:text-dark-text-primary">Analytics</span>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg text-sm
                    ${isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400' 
                      : 'text-neutral-700 dark:text-dark-text-secondary hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary'
                    }
                  `}
                  onClick={toggleMobileMenu}
                >
                  <item.icon 
                    className="h-6 w-6 flex-shrink-0 mr-3" 
                    style={{ color: location.pathname === item.path ? item.activeColor : item.color }}
                    aria-hidden="true" 
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-neutral-500 dark:text-dark-text-tertiary">{item.description}</span>
                  </div>
                </NavLink>
              ))}
            </nav>

            {/* Footer with user info and logout */}
            <div className="p-4 border-t border-neutral-200 dark:border-dark-border-subtle">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-dark-text-primary">{user?.name || 'User'}</p>
                    <p className="text-xs text-neutral-500 dark:text-dark-text-tertiary">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-neutral-500 dark:text-dark-text-tertiary hover:text-neutral-700 dark:hover:text-dark-text-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                  aria-label="Log out"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ${!sidebarOpen ? 'md:ml-20' : 'md:ml-[280px]'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-dark-bg-secondary border-b border-neutral-200 dark:border-dark-border-subtle shadow-sm h-16 flex items-center sticky top-0 z-10">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <button
              className="md:hidden p-2 text-neutral-500 dark:text-dark-text-tertiary hover:text-neutral-700 dark:hover:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 rounded-md"
              onClick={toggleMobileMenu}
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="text-xl font-semibold text-neutral-900 dark:text-dark-text-primary md:hidden">
              Analytics
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 