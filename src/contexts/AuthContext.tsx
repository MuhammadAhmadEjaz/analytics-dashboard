import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Valid credentials for demo
const VALID_EMAIL = 'analytics@demo.com';
const VALID_PASSWORD = '12345678';

// Demo user profile
const DEMO_USER: User = {
  email: VALID_EMAIL,
  name: 'Demo User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=analytics',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user data', e);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    // Add a small delay to simulate network request
    setTimeout(checkAuth, 1000);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    // Simulate API request
    return new Promise(resolve => {
      setTimeout(() => {
        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
          setUser(DEMO_USER);
          localStorage.setItem('user', JSON.stringify(DEMO_USER));
          setIsLoading(false);
          resolve(true);
        } else {
          setError('Invalid email or password');
          setIsLoading(false);
          resolve(false);
        }
      }, 1500); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 