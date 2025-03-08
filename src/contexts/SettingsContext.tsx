import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available chart types
export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'radar' | 'scatter' | 'composed';

// Define color schemes
export type ColorScheme = 'default' | 'monochrome' | 'cool' | 'warm' | 'neon' | 'pastel';

// Define animation speeds
export type AnimationSpeed = 'none' | 'slow' | 'medium' | 'fast';

// Settings interface
export interface ChartSettings {
  preferredChartTypes: Record<string, ChartType>;
  colorScheme: ColorScheme;
  animationSpeed: AnimationSpeed;
  showLegend: boolean;
  showGrid: boolean;
  showTooltip: boolean;
  enableZoom: boolean;
  dataPointRadius: number;
  strokeWidth: number;
  visibleDataSeries: Record<string, boolean>;
}

interface SettingsContextType {
  settings: ChartSettings;
  updateSettings: (newSettings: Partial<ChartSettings>) => void;
  resetSettings: () => void;
  getColorPalette: () => string[];
}

// Default settings
const DEFAULT_SETTINGS: ChartSettings = {
  preferredChartTypes: {
    financial: 'line',
    weather: 'area',
    social: 'bar',
  },
  colorScheme: 'default',
  animationSpeed: 'medium',
  showLegend: true,
  showGrid: true,
  showTooltip: true,
  enableZoom: false,
  dataPointRadius: 4,
  strokeWidth: 2,
  visibleDataSeries: {},
};

// Color palettes for different schemes
const COLOR_PALETTES: Record<ColorScheme, string[]> = {
  default: ['#1890FF', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#13C2C2', '#fa8c16', '#a0d911'],
  monochrome: ['#000000', '#252525', '#525252', '#737373', '#969696', '#bdbdbd', '#d9d9d9', '#f0f0f0'],
  cool: ['#00BFFF', '#1E90FF', '#4169E1', '#0000FF', '#8A2BE2', '#9370DB', '#BA55D3', '#FF00FF'],
  warm: ['#FF0000', '#FF4500', '#FF8C00', '#FFA500', '#FFD700', '#FFFF00', '#ADFF2F', '#7FFF00'],
  neon: ['#FF00FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000', '#FF00FF', '#7F00FF', '#0000FF'],
  pastel: ['#FFB6C1', '#FFD700', '#FFDEAD', '#98FB98', '#AFEEEE', '#D8BFD8', '#DDA0DD', '#B0E0E6'],
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState<ChartSettings>(() => {
    const savedSettings = localStorage.getItem('chartSettings');
    if (savedSettings) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      } catch (e) {
        console.error('Failed to parse saved settings', e);
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('chartSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<ChartSettings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const getColorPalette = () => {
    return COLOR_PALETTES[settings.colorScheme] || COLOR_PALETTES.default;
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
    getColorPalette,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 