import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Contexts
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { SettingsProvider } from './contexts/SettingsContext.tsx';

// Components
import Layout from './components/Layout.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

// Pages
import Dashboard from './pages/Dashboard.tsx';
import FinancialDashboard from './pages/FinancialDashboard.tsx';
import WeatherDashboard from './pages/WeatherDashboard.tsx';
import SocialDashboard from './pages/SocialDashboard.tsx';
import SettingsPage from './pages/Settings.tsx';
import Login from './pages/Login.tsx';

// Styles
import './styles/App.css';

// Wrapper component to apply layout
const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<LayoutWrapper />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/financial" element={<FinancialDashboard />} />
                    <Route path="/weather" element={<WeatherDashboard />} />
                    <Route path="/social" element={<SocialDashboard />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                </Route>
                
                {/* Redirect unmatched routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </Router>
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App; 