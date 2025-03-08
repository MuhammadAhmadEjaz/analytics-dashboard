import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ChartContainer from '../components/ChartContainer.tsx';
import FilterPanel, { FilterOption } from '../components/FilterPanel.tsx';
import { useApi } from '../hooks/useApi.ts';
import { useSettings } from '../contexts/SettingsContext.tsx';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ChartDataItem } from '../components/ChartModal';

// Define types for chart data
interface FinancialData extends ChartDataItem {
  value: string;
  price: string;
  marketCap: string;
}

interface WeatherData extends ChartDataItem {
  temperature: number;
}

interface SocialData extends ChartDataItem {
  users: number;
}

// Union type for all chart data
type ChartData = FinancialData | WeatherData | SocialData;

// API response type
interface AssetsApiResponse {
  data: Array<{
    symbol: string;
    changePercent24Hr: string;
    priceUsd: string;
    marketCapUsd: string;
    [key: string]: string;
  }>;
}

// Sample overview data
const OVERVIEW_API_URL = 'https://api.coincap.io/v2/assets?limit=10';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string>>({
    timeRange: 'week',
    dataType: 'all'
  });
  const { data: assetsData, isLoading, error } = useApi<AssetsApiResponse>(OVERVIEW_API_URL);
  const { settings, getColorPalette } = useSettings();

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      id: 'timeRange',
      label: 'Time Range',
      type: 'select',
      options: [
        { value: 'today', label: 'Today' },
        { value: 'week', label: '7 Days' },
        { value: 'month', label: '30 Days' },
        { value: 'year', label: '1 Year' },
      ],
      defaultValue: 'week',
    },
    {
      id: 'dataType',
      label: 'Data Type',
      type: 'select',
      options: [
        { value: 'all', label: 'All Data' },
        { value: 'financial', label: 'Financial' },
        { value: 'weather', label: 'Weather' },
        { value: 'social', label: 'Social Media' },
      ],
      defaultValue: 'all',
    },
  ];

  // Processed data for dashboard
  const financialData: FinancialData[] = assetsData?.data?.map((asset) => ({
    name: asset.symbol,
    value: parseFloat(asset.changePercent24Hr).toFixed(2),
    price: parseFloat(asset.priceUsd).toFixed(2),
    marketCap: (parseFloat(asset.marketCapUsd) / 1e9).toFixed(2), // Convert to billions
  })) || [];

  // Sample weather data
  const weatherData = [
    { name: 'Mon', temperature: 65 },
    { name: 'Tue', temperature: 59 },
    { name: 'Wed', temperature: 80 },
    { name: 'Thu', temperature: 81 },
    { name: 'Fri', temperature: 76 },
    { name: 'Sat', temperature: 55 },
    { name: 'Sun', temperature: 40 },
  ];

  // Sample social data
  const socialData = [
    { name: 'Facebook', users: 2.9 },
    { name: 'YouTube', users: 2.3 },
    { name: 'WhatsApp', users: 2.0 },
    { name: 'Instagram', users: 1.5 },
    { name: 'TikTok', users: 1.0 },
  ];

  // Get color palette from settings
  const COLORS = getColorPalette();

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters as Record<string, string>);
    console.log('Filters changed:', newFilters);
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

  // Determine chart types based on settings
  const getChartComponent = (dashboardType: string, data: ChartData[], defaultType: string): React.ReactElement => {
    // Safety check - if data is empty, return a placeholder chart
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-neutral-500 dark:text-dark-text-tertiary">No data available</p>
        </div>
      );
    }
    
    const chartType = settings.preferredChartTypes[dashboardType] || defaultType;
    const strokeWidth = settings.strokeWidth;
    const pointRadius = settings.dataPointRadius;
    
    // Common chart props
    const commonProps = {
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
      data: data,
    };

    // Apply animation speed setting
    const animationDuration = {
      none: 0,
      slow: 1500,
      medium: 750,
      fast: 300
    }[settings.animationSpeed];

    // Conditionally show grid based on settings
    const gridComponent = settings.showGrid ? <CartesianGrid strokeDasharray="3 3" /> : null;
    
    // Conditionally show tooltip based on settings
    const tooltipComponent = settings.showTooltip ? <Tooltip /> : null;
    
    // Conditionally show legend based on settings
    const legendComponent = settings.showLegend ? <Legend /> : null;

    // Return different chart types based on preference
    switch (chartType) {
      case 'bar':
        if (dashboardType === 'financial') {
          return (
            <BarChart {...commonProps}>
              {gridComponent}
              <XAxis dataKey="name" />
              <YAxis />
              {tooltipComponent}
              {legendComponent}
              <Bar 
                dataKey="value" 
                name="24h Change (%)" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
                isAnimationActive={animationDuration > 0}
                animationDuration={animationDuration}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={parseFloat((entry as FinancialData).value) >= 0 ? '#00C49F' : '#FF6B6B'} 
                  />
                ))}
              </Bar>
            </BarChart>
          );
        } 
        if (dashboardType === 'weather') {
          return (
            <BarChart {...commonProps}>
              {gridComponent}
              <XAxis dataKey="name" />
              <YAxis />
              {tooltipComponent}
              {legendComponent}
              <Bar 
                dataKey="temperature" 
                name="Temperature (°F)" 
                fill="#0088FE" 
                radius={[4, 4, 0, 0]}
                isAnimationActive={animationDuration > 0}
                animationDuration={animationDuration}
              />
            </BarChart>
          );
        } 
        if (dashboardType === 'social') {
          return (
            <BarChart {...commonProps}>
              {gridComponent}
              <XAxis dataKey="name" />
              <YAxis />
              {tooltipComponent}
              {legendComponent}
              <Bar 
                dataKey="users" 
                name="Users (billions)" 
                isAnimationActive={animationDuration > 0}
                animationDuration={animationDuration}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          );
        }
        // Fallback to a basic bar chart if dashboard type is unknown
        return (
          <BarChart {...commonProps}>
            {gridComponent}
            <XAxis dataKey="name" />
            <YAxis />
            {tooltipComponent}
            {legendComponent}
            <Bar 
              dataKey={Object.keys(data[0]).find(key => key !== 'name') || ''} 
              fill="#8884d8" 
              isAnimationActive={animationDuration > 0}
              animationDuration={animationDuration}
            />
          </BarChart>
        );

      case 'line':
        if (dashboardType === 'financial') {
          return (
            <LineChart {...commonProps}>
              {gridComponent}
              <XAxis dataKey="name" />
              <YAxis />
              {tooltipComponent}
              {legendComponent}
              <Line 
                type="monotone" 
                dataKey="value" 
                name="24h Change (%)" 
                stroke="#8884d8"
                strokeWidth={strokeWidth}
                dot={{ r: pointRadius }}
                activeDot={{ r: pointRadius + 4 }}
                isAnimationActive={animationDuration > 0}
                animationDuration={animationDuration}
              />
            </LineChart>
          );
        } 
        if (dashboardType === 'weather') {
          return (
            <LineChart {...commonProps}>
              {gridComponent}
              <XAxis dataKey="name" />
              <YAxis />
              {tooltipComponent}
              {legendComponent}
              <Line 
                type="monotone" 
                dataKey="temperature" 
                name="Temperature (°F)" 
                stroke="#0088FE"
                strokeWidth={strokeWidth}
                dot={{ r: pointRadius }}
                activeDot={{ r: pointRadius + 4 }}
                isAnimationActive={animationDuration > 0}
                animationDuration={animationDuration}
              />
            </LineChart>
          );
        } 
        if (dashboardType === 'social') {
          return (
            <LineChart {...commonProps}>
              {gridComponent}
              <XAxis dataKey="name" />
              <YAxis />
              {tooltipComponent}
              {legendComponent}
              <Line 
                type="monotone" 
                dataKey="users" 
                name="Users (billions)" 
                stroke="#8884d8"
                strokeWidth={strokeWidth}
                dot={{ r: pointRadius }}
                activeDot={{ r: pointRadius + 4 }}
                isAnimationActive={animationDuration > 0}
                animationDuration={animationDuration}
              />
            </LineChart>
          );
        }
        // Fallback to a basic line chart if dashboard type is unknown
        return (
          <LineChart {...commonProps}>
            {gridComponent}
            <XAxis dataKey="name" />
            <YAxis />
            {tooltipComponent}
            {legendComponent}
            <Line 
              type="monotone" 
              dataKey={Object.keys(data[0]).find(key => key !== 'name') || ''} 
              stroke="#8884d8"
              strokeWidth={strokeWidth}
              dot={{ r: pointRadius }}
              isAnimationActive={animationDuration > 0}
              animationDuration={animationDuration}
            />
          </LineChart>
        );

      case 'area':
        if (dashboardType === 'financial') {
          return (
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              {gridComponent}
              <XAxis dataKey="name" />
              <YAxis />
              {tooltipComponent}
              {legendComponent}
              <Area 
                type="monotone" 
                dataKey="value" 
                name="24h Change (%)" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorValue)"
                isAnimationActive={animationDuration > 0}
                animationDuration={animationDuration}
              />
            </AreaChart>
          );
        } 
        if (dashboardType === 'weather') {
          return (
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                </linearGradient>
              </defs>
              {gridComponent}
              <XAxis dataKey="name" />
              <YAxis />
              {tooltipComponent}
              {legendComponent}
              <Area 
                type="monotone" 
                dataKey="temperature" 
                name="Temperature (°F)" 
                stroke="#0088FE" 
                fillOpacity={1} 
                fill="url(#colorTemp)"
                isAnimationActive={animationDuration > 0}
                animationDuration={animationDuration}
              />
            </AreaChart>
          );
        } 
        if (dashboardType === 'social') {
          return (
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              {gridComponent}
              <XAxis dataKey="name" />
              <YAxis />
              {tooltipComponent}
              {legendComponent}
              <Area 
                type="monotone" 
                dataKey="users" 
                name="Users (billions)" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorUsers)"
                isAnimationActive={animationDuration > 0}
                animationDuration={animationDuration}
              />
            </AreaChart>
          );
        }
        // Fallback to a basic area chart if dashboard type is unknown
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorDefault" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            {gridComponent}
            <XAxis dataKey="name" />
            <YAxis />
            {tooltipComponent}
            {legendComponent}
            <Area 
              type="monotone" 
              dataKey={Object.keys(data[0]).find(key => key !== 'name') || ''} 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorDefault)"
              isAnimationActive={animationDuration > 0}
              animationDuration={animationDuration}
            />
          </AreaChart>
        );

      case 'pie':
        if (dashboardType === 'financial') {
          return (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="marketCap"
                nameKey="name"
                isAnimationActive={animationDuration > 0}
                animationDuration={animationDuration}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {tooltipComponent}
              {legendComponent}
            </PieChart>
          );
        } 
        if (dashboardType === 'weather') {
          // Transform data for pie chart
          const weatherPieData = data.map(item => ({
            name: item.name,
            value: (item as WeatherData).temperature
          }));
          return (
            <PieChart>
              <Pie
                data={weatherPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                isAnimationActive={animationDuration > 0}
                animationDuration={animationDuration}
              >
                {weatherPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {tooltipComponent}
              {legendComponent}
            </PieChart>
          );
        } 
        if (dashboardType === 'social') {
          return (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="users"
                nameKey="name"
                isAnimationActive={animationDuration > 0}
                animationDuration={animationDuration}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {tooltipComponent}
              {legendComponent}
            </PieChart>
          );
        }
        // Fallback to a basic pie chart if dashboard type is unknown
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={Object.keys(data[0]).find(key => key !== 'name') || ''}
              nameKey="name"
              isAnimationActive={animationDuration > 0}
              animationDuration={animationDuration}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            {tooltipComponent}
            {legendComponent}
          </PieChart>
        );

      default:
        // Default fallback chart if none of the above matches
        return (
          <BarChart {...commonProps}>
            {gridComponent}
            <XAxis dataKey="name" />
            <YAxis />
            {tooltipComponent}
            {legendComponent}
            <Bar 
              dataKey={Object.keys(data[0]).find(key => key !== 'name') || ''} 
              fill="#8884d8" 
              isAnimationActive={animationDuration > 0}
              animationDuration={animationDuration}
            />
          </BarChart>
        );
    }
  };

  // Inside the getChartComponent function's pie chart case
  // Look for where we format values in tooltips:
  const formatValue = (value: string | number): string => {
    if (typeof value === 'string') {
      return value;
    }
    return value.toFixed(2);
  };

  // Ensure we prevent null children in ResponsiveContainer
  const renderChartSafely = (dashboardType: string, data: ChartData[], defaultType: string) => {
    if (isLoading || !data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-neutral-500 dark:text-dark-text-tertiary">
            {isLoading ? 'Loading...' : 'No data available'}
          </p>
        </div>
      );
    }
    
    return getChartComponent(dashboardType, data, defaultType);
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl text-red-600 mb-2">Error Loading Dashboard</h2>
        <p className="text-neutral-700 dark:text-dark-text-secondary">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Analytics Dashboard</h1>
        <p className="text-neutral-600 dark:text-dark-text-secondary">Comprehensive overview of your data insights</p>
      </div>

      <FilterPanel 
        options={filterOptions} 
        onFilterChange={handleFilterChange} 
        className="mb-6"
      />

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Financial Overview */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <ChartContainer 
            title="Financial Markets - 24h Change (%)" 
            description="Top 10 cryptocurrencies by market cap"
            isLoading={isLoading}
            data={financialData}
            dataKeys={['name', 'value', 'price', 'marketCap']}
          >
            <ResponsiveContainer width="100%" height={300}>
              {renderChartSafely('financial', financialData, 'bar')}
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        {/* Weather Chart */}
        <motion.div variants={itemVariants}>
          <ChartContainer 
            title="Weather Trends" 
            description="Weekly temperature (°F)"
            data={weatherData}
            dataKeys={['name', 'temperature']}
          >
            <ResponsiveContainer width="100%" height={250}>
              {renderChartSafely('weather', weatherData, 'line')}
            </ResponsiveContainer>
            <div className="text-right mt-2">
              <Link 
                to="/weather" 
                className="text-primary-600 hover:text-primary-800 text-sm font-medium dark:text-primary-400 dark:hover:text-primary-300"
                aria-label="View detailed weather data"
              >
                View details →
              </Link>
            </div>
          </ChartContainer>
        </motion.div>

        {/* Social Chart */}
        <motion.div variants={itemVariants}>
          <ChartContainer 
            title="Social Media" 
            description="Monthly active users (billions)"
            data={socialData}
            dataKeys={['name', 'users']}
          >
            <ResponsiveContainer width="100%" height={250}>
              {renderChartSafely('social', socialData, 'pie')}
            </ResponsiveContainer>
            <div className="text-right mt-2">
              <Link 
                to="/social" 
                className="text-primary-600 hover:text-primary-800 text-sm font-medium dark:text-primary-400 dark:hover:text-primary-300"
                aria-label="View detailed social media data"
              >
                View details →
              </Link>
            </div>
          </ChartContainer>
        </motion.div>

        {/* Market Trends */}
        <motion.div variants={itemVariants}>
          <ChartContainer 
            title="Market Trends" 
            description="Market capitalization in billions USD"
            isLoading={isLoading}
            data={financialData}
            dataKeys={['name', 'marketCap']}
          >
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="marketColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                <XAxis dataKey="name" />
                <YAxis />
                {settings.showTooltip && (
                  <Tooltip 
                    formatter={(value: any) => [`$${value}B`, 'Market Cap']}
                  />
                )}
                {settings.showLegend && <Legend />}
                <Area 
                  type="monotone" 
                  dataKey="marketCap" 
                  stroke={COLORS[0]}
                  strokeWidth={settings.strokeWidth}
                  fillOpacity={1} 
                  fill="url(#marketColor)"
                  isAnimationActive={settings.animationSpeed !== 'none'}
                  animationDuration={{
                    none: 0,
                    slow: 1500,
                    medium: 750,
                    fast: 300
                  }[settings.animationSpeed]}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="text-right mt-2">
              <Link 
                to="/financial" 
                className="text-primary-600 hover:text-primary-800 text-sm font-medium dark:text-primary-400 dark:hover:text-primary-300"
                aria-label="View detailed financial data"
              >
                View details →
              </Link>
            </div>
          </ChartContainer>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 