import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings, ChartType, ColorScheme, AnimationSpeed } from '../contexts/SettingsContext.tsx';
import { Cog6ToothIcon, ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext.tsx';

// Chart type options
const chartTypeOptions: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'area', label: 'Area Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'radar', label: 'Radar Chart' },
  { value: 'scatter', label: 'Scatter Chart' },
  { value: 'composed', label: 'Composed Chart' },
];

// Color scheme options
const colorSchemeOptions: { value: ColorScheme; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'monochrome', label: 'Monochrome' },
  { value: 'cool', label: 'Cool' },
  { value: 'warm', label: 'Warm' },
  { value: 'neon', label: 'Neon' },
  { value: 'pastel', label: 'Pastel' },
];

// Animation speed options
const animationSpeedOptions: { value: AnimationSpeed; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'slow', label: 'Slow' },
  { value: 'medium', label: 'Medium' },
  { value: 'fast', label: 'Fast' },
];

// Dashboard types for preferred chart selection
const dashboardTypes = [
  { id: 'financial', label: 'Financial Dashboard' },
  { id: 'weather', label: 'Weather Dashboard' },
  { id: 'social', label: 'Social Media Dashboard' },
];

const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings, getColorPalette } = useSettings();
  const { isDark } = useTheme();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Clone all the settings to local state to avoid direct modification
  const [localSettings, setLocalSettings] = useState({
    preferredChartTypes: { ...settings.preferredChartTypes },
    colorScheme: settings.colorScheme,
    animationSpeed: settings.animationSpeed,
    showLegend: settings.showLegend,
    showGrid: settings.showGrid,
    showTooltip: settings.showTooltip,
    enableZoom: settings.enableZoom,
    dataPointRadius: settings.dataPointRadius,
    strokeWidth: settings.strokeWidth,
    visibleDataSeries: { ...settings.visibleDataSeries },
  });

  // Update local settings when global settings change
  useEffect(() => {
    setLocalSettings({
      preferredChartTypes: { ...settings.preferredChartTypes },
      colorScheme: settings.colorScheme,
      animationSpeed: settings.animationSpeed,
      showLegend: settings.showLegend,
      showGrid: settings.showGrid,
      showTooltip: settings.showTooltip,
      enableZoom: settings.enableZoom,
      dataPointRadius: settings.dataPointRadius,
      strokeWidth: settings.strokeWidth,
      visibleDataSeries: { ...settings.visibleDataSeries },
    });
  }, [settings]);

  // Handle chart type change for a specific dashboard
  const handleChartTypeChange = (dashboardId: string, chartType: ChartType) => {
    setLocalSettings(prev => ({
      ...prev,
      preferredChartTypes: {
        ...prev.preferredChartTypes,
        [dashboardId]: chartType,
      },
    }));
  };
  
  // Handle general setting changes
  const handleSettingChange = (setting: keyof typeof localSettings, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  // Handle toggle switch settings
  const handleToggleSetting = (setting: keyof typeof localSettings) => {
    setLocalSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  // Handle numeric setting changes
  const handleNumericSettingChange = (setting: keyof typeof localSettings, value: number) => {
    setLocalSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  // Save all settings
  const handleSaveSettings = () => {
    // Update all settings at once to prevent multiple re-renders
    updateSettings(localSettings);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reset all settings
  const handleResetSettings = () => {
    resetSettings();
    // Local state will be updated via the useEffect when settings change
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  // Get current color palette
  const colorPalette = getColorPalette();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Dashboard Settings</h1>
        <p className="text-neutral-600 dark:text-dark-text-secondary">Customize your charts appearance and behavior</p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Chart Type Preferences */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md dark:shadow-soft-dark p-6"
        >
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4 flex items-center">
            <Cog6ToothIcon className="h-5 w-5 mr-2 text-primary-500" aria-hidden="true" />
            Chart Type Preferences
          </h2>
          <p className="text-neutral-600 dark:text-dark-text-secondary mb-6">
            Choose your preferred chart type for each dashboard
          </p>

          <div className="space-y-6">
            {dashboardTypes.map((dashboard) => (
              <div key={dashboard.id} className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary">
                  {dashboard.label}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {chartTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`py-2 px-3 rounded-md text-sm font-medium transition-colors
                        ${localSettings.preferredChartTypes[dashboard.id] === option.value
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-white dark:bg-dark-bg-tertiary text-neutral-700 dark:text-dark-text-secondary border border-neutral-300 dark:border-dark-border-subtle hover:bg-neutral-50 dark:hover:bg-dark-bg-primary'
                        }`}
                      onClick={() => handleChartTypeChange(dashboard.id, option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md dark:shadow-soft-dark p-6"
        >
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4 flex items-center">
            <Cog6ToothIcon className="h-5 w-5 mr-2 text-primary-500" aria-hidden="true" />
            Appearance Settings
          </h2>
          <p className="text-neutral-600 dark:text-dark-text-secondary mb-6">
            Customize the visual appearance of your charts
          </p>

          <div className="space-y-6">
            {/* Color Scheme */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary">
                Color Scheme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {colorSchemeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors
                      ${localSettings.colorScheme === option.value
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'bg-white dark:bg-dark-bg-tertiary text-neutral-700 dark:text-dark-text-secondary border border-neutral-300 dark:border-dark-border-subtle hover:bg-neutral-50 dark:hover:bg-dark-bg-primary'
                      }`}
                    onClick={() => handleSettingChange('colorScheme', option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex space-x-2">
                {COLOR_PALETTES[localSettings.colorScheme].slice(0, 8).map((color, index) => (
                  <div
                    key={index}
                    className="h-6 w-6 rounded-full"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>

            {/* Animation Speed */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary">
                Animation Speed
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {animationSpeedOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors
                      ${localSettings.animationSpeed === option.value
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'bg-white dark:bg-dark-bg-tertiary text-neutral-700 dark:text-dark-text-secondary border border-neutral-300 dark:border-dark-border-subtle hover:bg-neutral-50 dark:hover:bg-dark-bg-primary'
                      }`}
                    onClick={() => handleSettingChange('animationSpeed', option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Elements */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-dark-text-secondary">
                Chart Elements
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'showLegend', label: 'Show Legend' },
                  { id: 'showGrid', label: 'Show Grid' },
                  { id: 'showTooltip', label: 'Show Tooltips' },
                  { id: 'enableZoom', label: 'Enable Zoom' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center">
                    <button
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        localSettings[item.id as keyof typeof localSettings] ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-dark-bg-tertiary'
                      }`}
                      role="switch"
                      aria-checked={localSettings[item.id as keyof typeof localSettings]}
                      onClick={() => handleToggleSetting(item.id as keyof typeof localSettings)}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200 ${
                          localSettings[item.id as keyof typeof localSettings] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="ml-3 text-sm text-neutral-700 dark:text-dark-text-secondary">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Controls */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-dark-text-secondary">
                Size Settings
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-neutral-700 dark:text-dark-text-secondary">
                      Data Point Radius: {localSettings.dataPointRadius}px
                    </label>
                    <span className="text-xs text-neutral-500 dark:text-dark-text-tertiary">
                      {localSettings.dataPointRadius}/8
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={localSettings.dataPointRadius}
                    onChange={(e) => handleNumericSettingChange('dataPointRadius', parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-neutral-700 dark:text-dark-text-secondary">
                      Stroke Width: {localSettings.strokeWidth}px
                    </label>
                    <span className="text-xs text-neutral-500 dark:text-dark-text-tertiary">
                      {localSettings.strokeWidth}/5
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={localSettings.strokeWidth}
                    onChange={(e) => handleNumericSettingChange('strokeWidth', parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleResetSettings}
          className="flex items-center px-4 py-2 border border-neutral-300 dark:border-dark-border-subtle rounded-md shadow-sm text-sm font-medium text-neutral-700 dark:text-dark-text-secondary bg-white dark:bg-dark-bg-tertiary hover:bg-neutral-50 dark:hover:bg-dark-bg-primary transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" aria-hidden="true" />
          Reset to Defaults
        </button>
        <button
          type="button"
          onClick={handleSaveSettings}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          {saveSuccess ? (
            <>
              <CheckIcon className="h-4 w-4 mr-2" aria-hidden="true" />
              Saved!
            </>
          ) : (
            <>Save Settings</>
          )}
        </button>
      </div>
    </div>
  );
};

// Import constant directly from SettingsContext to avoid circular import
const COLOR_PALETTES: Record<ColorScheme, string[]> = {
  default: ['#1890FF', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#13C2C2', '#fa8c16', '#a0d911'],
  monochrome: ['#000000', '#252525', '#525252', '#737373', '#969696', '#bdbdbd', '#d9d9d9', '#f0f0f0'],
  cool: ['#00BFFF', '#1E90FF', '#4169E1', '#0000FF', '#8A2BE2', '#9370DB', '#BA55D3', '#FF00FF'],
  warm: ['#FF0000', '#FF4500', '#FF8C00', '#FFA500', '#FFD700', '#FFFF00', '#ADFF2F', '#7FFF00'],
  neon: ['#FF00FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000', '#FF00FF', '#7F00FF', '#0000FF'],
  pastel: ['#FFB6C1', '#FFD700', '#FFDEAD', '#98FB98', '#AFEEEE', '#D8BFD8', '#DDA0DD', '#B0E0E6'],
};

export default Settings; 