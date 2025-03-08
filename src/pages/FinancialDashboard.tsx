import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChartContainer from '../components/ChartContainer.tsx';
import FilterPanel, { FilterOption } from '../components/FilterPanel.tsx';
import { useApi } from '../hooks/useApi.ts';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { useSettings } from '../contexts/SettingsContext.tsx';
import { 
  AreaChart, Area, Line, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface AssetData {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

interface HistoricalDataPoint {
  priceUsd: string;
  time: number;
  date: string;
}

// API endpoints for cryptocurrency data
const ASSETS_API_URL = 'https://api.coincap.io/v2/assets?limit=20';
const HISTORICAL_API_URL = (id: string, interval: string = 'd1') => 
  `https://api.coincap.io/v2/assets/${id}/history?interval=${interval}`;

const FinancialDashboard: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>("bitcoin");
  const [timeInterval, setTimeInterval] = useState<string>("d1");
  const [filters, setFilters] = useState<Record<string, string>>({
    timeRange: 'd1',
    assetId: 'bitcoin',
    sortBy: 'rank'
  });
  const { isDark } = useTheme();
  const { settings } = useSettings();

  // Fetch assets data with error handling
  const { data: assetsData, isLoading: assetsLoading, error: assetsError, refetch: refetchAssets } = 
    useApi<{ data: AssetData[] }>(ASSETS_API_URL);

  // Build the historical data URL only when selectedAsset and timeInterval are valid
  const historicalUrl = selectedAsset && timeInterval 
    ? HISTORICAL_API_URL(selectedAsset, timeInterval)
    : '';

  // Fetch historical data for selected asset with error handling
  const { data: historicalData, isLoading: histLoading, error: histError, refetch: refetchHistorical } = 
    useApi<{ data: HistoricalDataPoint[] }>(historicalUrl);

  // Effect to safely handle asset selection
  useEffect(() => {
    // If assets data is loaded, ensure we have a valid selected asset
    if (assetsData?.data && assetsData.data.length > 0) {
      // If current selection is not valid, default to the first asset
      const validAssets = assetsData.data.map(asset => asset.id);
      if (!validAssets.includes(selectedAsset)) {
        setSelectedAsset(validAssets[0] || 'bitcoin');
      }
    }
  }, [assetsData, selectedAsset]);

  // Retry fetching data if there was an error
  const handleRetry = () => {
    refetchAssets();
    if (historicalUrl) {
      refetchHistorical();
    }
  };

  // Safe access to assets data with fallback to empty array
  const assets = assetsData?.data || [];
  
  // Safe access to historical data with fallback to empty array
  const historical = historicalData?.data || [];

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      id: 'timeRange',
      label: 'Time Range',
      type: 'select',
      options: [
        { value: 'd1', label: 'Last 24 Hours' },
        { value: 'h1', label: 'Hourly' },
        { value: 'm1', label: 'Minutes' },
      ],
      defaultValue: 'd1',
    },
    {
      id: 'assetId',
      label: 'Cryptocurrency',
      type: 'select',
      options: assets.map(asset => ({
        value: asset.id,
        label: `${asset.name} (${asset.symbol})`,
      })),
      defaultValue: 'bitcoin',
    },
    {
      id: 'sortBy',
      label: 'Sort By',
      type: 'select',
      options: [
        { value: 'rank', label: 'Rank' },
        { value: 'marketCap', label: 'Market Cap' },
        { value: 'priceChange', label: 'Price Change' },
        { value: 'volume', label: 'Volume' },
      ],
      defaultValue: 'rank',
    },
  ];

  // Format price for display
  const formatPrice = (price: string): string => {
    const num = parseFloat(price);
    if (isNaN(num)) return 'N/A';
    
    if (num > 1000) return `$${num.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    if (num > 1) return `$${num.toFixed(2)}`;
    return `$${num.toFixed(6)}`;
  };

  // Format percent change
  const formatChange = (change: string): string => {
    const num = parseFloat(change);
    if (isNaN(num)) return 'N/A';
    
    return num >= 0 ? `+${num.toFixed(2)}%` : `${num.toFixed(2)}%`;
  };

  // Format market cap
  const formatMarketCap = (marketCap: string): string => {
    const num = parseFloat(marketCap);
    if (isNaN(num)) return 'N/A';
    
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString('en-US')}`;
  };

  // Process historical data for chart display
  const processedHistoricalData = historical.map(point => ({
    date: new Date(point.time).toLocaleDateString(),
    time: new Date(point.time).toLocaleTimeString(),
    price: parseFloat(point.priceUsd),
  }));

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    
    // Update selected asset if changed in filter
    if (newFilters.assetId && newFilters.assetId !== filters.assetId) {
      setSelectedAsset(newFilters.assetId);
    }
    
    // Update time interval if changed in filter
    if (newFilters.timeRange && newFilters.timeRange !== filters.timeRange) {
      setTimeInterval(newFilters.timeRange);
    }
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

  // If there's an error, show error state with retry option
  if (assetsError || histError) {
    return (
      <div className="p-6 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md dark:shadow-soft-dark">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Financial Data</h2>
        <p className="text-neutral-700 dark:text-dark-text-secondary mb-4">
          {assetsError?.message || histError?.message || 'An unexpected error occurred.'}
        </p>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Rest of component with enhanced dark mode styling and safer rendering conditions

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Financial Dashboard</h1>
        <p className="text-neutral-600 dark:text-dark-text-secondary">Cryptocurrency market analytics and trends</p>
      </div>

      <FilterPanel 
        options={filterOptions} 
        onFilterChange={handleFilterChange} 
        className="mb-6"
      />

      {(assetsLoading || histLoading) && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
        </div>
      )}

      {!assetsLoading && assets.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Historical Price Chart */}
          <motion.div variants={itemVariants}>
            <ChartContainer 
              title={`${selectedAsset ? assets.find(a => a.id === selectedAsset)?.name || 'Bitcoin' : 'Bitcoin'} Price History`}
              description={`Historical price data (${timeInterval === 'd1' ? 'Daily' : timeInterval === 'h1' ? 'Hourly' : 'Minutes'})`}
              isLoading={histLoading}
              data={processedHistoricalData}
              dataKeys={['date', 'time', 'price']}
            >
              <ResponsiveContainer width="100%" height={400}>
                {processedHistoricalData.length > 0 ? (
                  <AreaChart data={processedHistoricalData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: isDark ? '#A0AEC0' : '#4A5568' }}
                    />
                    <YAxis 
                      tick={{ fill: isDark ? '#A0AEC0' : '#4A5568' }}
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    {settings.showTooltip && (
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1A202C' : '#FFFFFF',
                          borderColor: isDark ? '#2D3748' : '#E2E8F0',
                          color: isDark ? '#FFFFFF' : '#000000'
                        }}
                        formatter={(value) => [`$${parseFloat(value.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Price']}
                      />
                    )}
                    {settings.showLegend && <Legend />}
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorPrice)"
                      strokeWidth={settings.strokeWidth}
                      dot={{ r: settings.dataPointRadius }}
                      activeDot={{ r: settings.dataPointRadius + 2 }}
                      isAnimationActive={settings.animationSpeed !== 'none'}
                      animationDuration={
                        settings.animationSpeed === 'slow' ? 1500 :
                        settings.animationSpeed === 'medium' ? 750 : 
                        settings.animationSpeed === 'fast' ? 300 : 0
                      }
                    />
                  </AreaChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-neutral-500 dark:text-dark-text-tertiary">No historical data available</p>
                  </div>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>

          {/* Top Cryptocurrencies Table */}
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md dark:shadow-soft-dark overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-dark-border-subtle">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">Top Cryptocurrencies</h2>
                <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">Market capitalization and 24h change</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-dark-border-subtle">
                  <thead className="bg-neutral-50 dark:bg-dark-bg-tertiary">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">Rank</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">Market Cap</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">24h Change</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-bg-secondary divide-y divide-neutral-200 dark:divide-dark-border-subtle">
                    {assets.slice(0, 10).map((asset, index) => (
                      <tr 
                        key={asset.id} 
                        className={`cursor-pointer hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary transition-colors ${
                          selectedAsset === asset.id ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                        }`}
                        onClick={() => {
                          setSelectedAsset(asset.id);
                          setFilters(prev => ({ ...prev, assetId: asset.id }));
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-dark-text-primary">{asset.rank}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900 dark:text-dark-text-primary">{asset.name}</div>
                              <div className="text-sm text-neutral-500 dark:text-dark-text-tertiary">{asset.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-dark-text-primary">{formatPrice(asset.priceUsd)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-dark-text-primary">{formatMarketCap(asset.marketCapUsd)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              parseFloat(asset.changePercent24Hr) >= 0 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                          >
                            {formatChange(asset.changePercent24Hr)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Market Distribution Chart */}
          <motion.div variants={itemVariants}>
            <ChartContainer 
              title="Market Dominance" 
              description="Distribution of market capitalization among top cryptocurrencies"
              data={assets.slice(0, 5).map(asset => ({
                name: asset.symbol,
                value: parseFloat(asset.marketCapUsd)
              }))}
              dataKeys={['name', 'value']}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={assets.slice(0, 5).map(asset => ({
                      name: asset.symbol,
                      value: parseFloat(asset.marketCapUsd) / 1e9 // Convert to billions
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={settings.animationSpeed !== 'none'}
                    animationDuration={
                      settings.animationSpeed === 'slow' ? 1500 :
                      settings.animationSpeed === 'medium' ? 750 : 
                      settings.animationSpeed === 'fast' ? 300 : 0
                    }
                  >
                    {assets.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[
                        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'
                      ][index % 5]} />
                    ))}
                  </Pie>
                  {settings.showTooltip && (
                    <Tooltip 
                      formatter={(value) => [`$${(parseFloat(value.toString()) / 1e9).toFixed(2)}B`, 'Market Cap']}
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1A202C' : '#FFFFFF',
                        borderColor: isDark ? '#2D3748' : '#E2E8F0',
                        color: isDark ? '#FFFFFF' : '#000000'
                      }}
                    />
                  )}
                  {settings.showLegend && <Legend />}
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>

          {/* Volume vs Price Change Chart */}
          <motion.div variants={itemVariants}>
            <ChartContainer 
              title="Volume vs Price Change" 
              description="24h trading volume compared to price change percentage"
              data={assets.slice(0, 10).map(asset => ({
                name: asset.symbol,
                volume: parseFloat(asset.volumeUsd24Hr) / 1e9, // Convert to billions
                change: parseFloat(asset.changePercent24Hr),
                price: parseFloat(asset.priceUsd)
              }))}
              dataKeys={['name', 'volume', 'change', 'price']}
            >
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={assets.slice(0, 10).map(asset => ({
                  name: asset.symbol,
                  volume: parseFloat(asset.volumeUsd24Hr) / 1e9,
                  change: parseFloat(asset.changePercent24Hr)
                }))}>
                  {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: isDark ? '#A0AEC0' : '#4A5568' }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    label={{ 
                      value: 'Volume ($B)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: isDark ? '#A0AEC0' : '#4A5568' }
                    }}
                    tick={{ fill: isDark ? '#A0AEC0' : '#4A5568' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ 
                      value: 'Change (%)', 
                      angle: 90, 
                      position: 'insideRight',
                      style: { fill: isDark ? '#A0AEC0' : '#4A5568' }
                    }}
                    tick={{ fill: isDark ? '#A0AEC0' : '#4A5568' }}
                  />
                  {settings.showTooltip && (
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1A202C' : '#FFFFFF',
                        borderColor: isDark ? '#2D3748' : '#E2E8F0',
                        color: isDark ? '#FFFFFF' : '#000000'
                      }}
                      formatter={(value, name) => {
                        if (name === 'volume') return [`$${value.toFixed(2)}B`, 'Volume'];
                        if (name === 'change') return [`${value.toFixed(2)}%`, 'Change'];
                        return [value, name];
                      }}
                    />
                  )}
                  {settings.showLegend && <Legend />}
                  <Bar 
                    yAxisId="left" 
                    dataKey="volume" 
                    fill="#8884d8" 
                    isAnimationActive={settings.animationSpeed !== 'none'}
                    animationDuration={
                      settings.animationSpeed === 'slow' ? 1500 :
                      settings.animationSpeed === 'medium' ? 750 : 
                      settings.animationSpeed === 'fast' ? 300 : 0
                    }
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="change" 
                    stroke="#ff7300" 
                    strokeWidth={settings.strokeWidth}
                    dot={{ r: settings.dataPointRadius }}
                    activeDot={{ r: settings.dataPointRadius + 2 }}
                    isAnimationActive={settings.animationSpeed !== 'none'}
                    animationDuration={
                      settings.animationSpeed === 'slow' ? 1500 :
                      settings.animationSpeed === 'medium' ? 750 : 
                      settings.animationSpeed === 'fast' ? 300 : 0
                    }
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FinancialDashboard; 