import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChartContainer from '../components/ChartContainer.tsx';
import FilterPanel, { FilterOption } from '../components/FilterPanel.tsx';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Treemap
} from 'recharts';

// Social media platform data
const PLATFORMS = {
  facebook: {
    name: 'Facebook',
    color: '#4267B2',
    icon: '📘',
  },
  instagram: {
    name: 'Instagram',
    color: '#E1306C',
    icon: '📸',
  },
  twitter: {
    name: 'Twitter',
    color: '#1DA1F2',
    icon: '🐦',
  },
  tiktok: {
    name: 'TikTok',
    color: '#000000',
    icon: '🎵',
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0077B5',
    icon: '💼',
  },
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    icon: '📹',
  },
  reddit: {
    name: 'Reddit',
    color: '#FF4500',
    icon: '🔍',
  },
  pinterest: {
    name: 'Pinterest',
    color: '#E60023',
    icon: '📌',
  },
};

// Sample social media metrics data
const monthlyActiveUsers = [
  { name: 'Jan', facebook: 2.91, instagram: 1.45, twitter: 0.39, tiktok: 1.05, linkedin: 0.81, youtube: 2.32 },
  { name: 'Feb', facebook: 2.89, instagram: 1.47, twitter: 0.38, tiktok: 1.08, linkedin: 0.82, youtube: 2.33 },
  { name: 'Mar', facebook: 2.87, instagram: 1.48, twitter: 0.37, tiktok: 1.12, linkedin: 0.82, youtube: 2.35 },
  { name: 'Apr', facebook: 2.84, instagram: 1.51, twitter: 0.36, tiktok: 1.17, linkedin: 0.83, youtube: 2.36 },
  { name: 'May', facebook: 2.82, instagram: 1.52, twitter: 0.35, tiktok: 1.21, linkedin: 0.83, youtube: 2.37 },
  { name: 'Jun', facebook: 2.81, instagram: 1.54, twitter: 0.34, tiktok: 1.27, linkedin: 0.84, youtube: 2.39 },
];

const engagementRates = [
  { name: 'Facebook', rate: 0.064, posts: 2.7, avgTime: 19.5 },
  { name: 'Instagram', rate: 0.083, posts: 1.2, avgTime: 29.0 },
  { name: 'Twitter', rate: 0.045, posts: 4.8, avgTime: 10.1 },
  { name: 'TikTok', rate: 0.177, posts: 0.9, avgTime: 45.8 },
  { name: 'LinkedIn', rate: 0.051, posts: 0.7, avgTime: 17.2 },
  { name: 'YouTube', rate: 0.123, posts: 0.3, avgTime: 40.5 },
  { name: 'Reddit', rate: 0.089, posts: 2.1, avgTime: 24.3 },
  { name: 'Pinterest', rate: 0.072, posts: 1.6, avgTime: 14.2 },
];

const demographicData = [
  { name: '13-17', facebook: 5.1, instagram: 8.5, twitter: 3.2, tiktok: 25.8, linkedin: 0.0, youtube: 16.4 },
  { name: '18-24', facebook: 21.8, instagram: 30.2, twitter: 17.1, tiktok: 38.5, linkedin: 20.2, youtube: 20.2 },
  { name: '25-34', facebook: 30.2, instagram: 32.1, twitter: 27.3, tiktok: 20.3, linkedin: 37.6, youtube: 21.7 },
  { name: '35-44', facebook: 18.3, instagram: 16.7, twitter: 23.8, tiktok: 9.4, linkedin: 21.5, youtube: 16.1 },
  { name: '45-54', facebook: 12.8, instagram: 8.2, twitter: 15.7, tiktok: 4.2, linkedin: 14.1, youtube: 12.9 },
  { name: '55+', facebook: 11.8, instagram: 4.3, twitter: 12.9, tiktok: 1.8, linkedin: 6.6, youtube: 12.7 },
];

const contentTypeData = [
  { name: 'Photos', value: 40, description: 'Static image posts' },
  { name: 'Videos', value: 35, description: 'Video content (short and long form)' },
  { name: 'Text', value: 15, description: 'Text-only posts and updates' },
  { name: 'Links', value: 10, description: 'Shared links and articles' },
];

const trendsData = [
  { name: 'Jan', organic: 67, paid: 33 },
  { name: 'Feb', organic: 65, paid: 35 },
  { name: 'Mar', organic: 60, paid: 40 },
  { name: 'Apr', organic: 58, paid: 42 },
  { name: 'May', organic: 55, paid: 45 },
  { name: 'Jun', organic: 52, paid: 48 },
];

// Hashtag treemap data
const hashtagData = [
  {
    name: 'Entertainment',
    children: [
      { name: '#music', size: 5800 },
      { name: '#movies', size: 4300 },
      { name: '#netflix', size: 3200 },
      { name: '#gaming', size: 2900 },
      { name: '#anime', size: 2100 },
    ],
  },
  {
    name: 'Lifestyle',
    children: [
      { name: '#fitness', size: 4800 },
      { name: '#travel', size: 4200 },
      { name: '#food', size: 3900 },
      { name: '#fashion', size: 3600 },
      { name: '#photography', size: 3100 },
    ],
  },
  {
    name: 'Business',
    children: [
      { name: '#marketing', size: 3500 },
      { name: '#success', size: 2700 },
      { name: '#business', size: 2500 },
      { name: '#entrepreneur', size: 2300 },
      { name: '#innovation', size: 1800 },
    ],
  },
  {
    name: 'Technology',
    children: [
      { name: '#tech', size: 3800 },
      { name: '#programming', size: 3200 },
      { name: '#ai', size: 3000 },
      { name: '#blockchain', size: 2600 },
      { name: '#iot', size: 1900 },
    ],
  },
];

const SocialDashboard: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>({
    platform: 'all',
    dateRange: '6m',
    metric: 'users',
  });

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      id: 'platform',
      label: 'Platform',
      type: 'select',
      options: [
        { value: 'all', label: 'All Platforms' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'twitter', label: 'Twitter' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'youtube', label: 'YouTube' },
      ],
      defaultValue: 'all',
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'select',
      options: [
        { value: '1m', label: '1 Month' },
        { value: '3m', label: '3 Months' },
        { value: '6m', label: '6 Months' },
        { value: '1y', label: '1 Year' },
      ],
      defaultValue: '6m',
    },
    {
      id: 'metric',
      label: 'Primary Metric',
      type: 'select',
      options: [
        { value: 'users', label: 'Monthly Active Users' },
        { value: 'engagement', label: 'Engagement Rate' },
        { value: 'demographics', label: 'Demographics' },
      ],
      defaultValue: 'users',
    },
  ];

  // Filter data based on selected platform
  const filterDataByPlatform = (data: any[]) => {
    if (filters.platform === 'all') return data;
    
    return data.map(item => {
      const filtered: Record<string, any> = { name: item.name };
      filtered[filters.platform] = item[filters.platform];
      return filtered;
    });
  };

  // Filter data based on date range
  const filterDataByDateRange = (data: any[]) => {
    const months = {
      '1m': 1,
      '3m': 3,
      '6m': 6,
      '1y': 12,
    };
    
    const limit = months[filters.dateRange as keyof typeof months] || 6;
    return data.slice(-limit);
  };

  // Get platforms to display in charts
  const getDisplayPlatforms = () => {
    if (filters.platform === 'all') {
      return Object.keys(PLATFORMS);
    }
    return [filters.platform];
  };

  // Get platform colors for charts
  const getPlatformColors = () => {
    return getDisplayPlatforms().map(platform => 
      PLATFORMS[platform as keyof typeof PLATFORMS]?.color || '#000000'
    );
  };

  // Filter demographics data
  const filteredDemographics = filterDataByPlatform(demographicData);
  
  // Filter monthly active users data
  const filteredMAU = filterDataByDateRange(filterDataByPlatform(monthlyActiveUsers));

  // Handle filter changes
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  // COLORS for charts
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#FF6B6B', '#6B66FF', '#82CA9D'
  ];

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

  // Custom TreeMap data formatter
  const CustomTreemapContent = (props: any) => {
    const { root, depth, x, y, width, height, index, colors, name, value } = props;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: depth < 2 ? colors[Math.floor(index / 5) % colors.length] : 'none',
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {depth === 1 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              fill: '#fff',
              pointerEvents: 'none',
            }}
          >
            {name}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Social Media Dashboard</h1>
        <p className="text-neutral-600">Social media trends and audience insights</p>
      </div>

      <FilterPanel 
        options={filterOptions} 
        onFilterChange={handleFilterChange} 
        className="mb-6"
      />

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Monthly Active Users */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <ChartContainer 
            title="Monthly Active Users" 
            description="Monthly active users in billions by platform"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredMAU} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}B`} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}B`, 'Users']}
                />
                <Legend />
                {getDisplayPlatforms().map((platform, index) => (
                  <Line 
                    key={platform}
                    type="monotone" 
                    dataKey={platform} 
                    name={PLATFORMS[platform as keyof typeof PLATFORMS]?.name || platform} 
                    stroke={PLATFORMS[platform as keyof typeof PLATFORMS]?.color || COLORS[index % COLORS.length]} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                    isAnimationActive={true}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        {/* Engagement Rates */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartContainer 
            title="Engagement Rates" 
            description="Average engagement rate per platform"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={engagementRates.filter(item => 
                  filters.platform === 'all' || 
                  item.name.toLowerCase() === filters.platform
                )} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} />
                <Tooltip 
                  formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'Engagement Rate']}
                />
                <Legend />
                <Bar 
                  dataKey="rate" 
                  name="Engagement Rate" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={true}
                >
                  {engagementRates.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PLATFORMS[entry.name.toLowerCase() as keyof typeof PLATFORMS]?.color || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        {/* Content Type Breakdown */}
        <motion.div variants={itemVariants}>
          <ChartContainer 
            title="Content Type Distribution" 
            description="Breakdown of content types by popularity"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                  isAnimationActive={true}
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => {
                    const { payload } = props;
                    return [`${value}% - ${payload.description}`, payload.name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        {/* Demographics */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartContainer 
            title="Age Demographics" 
            description="User age distribution by platform"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={filteredDemographics} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="name" width={50} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']}
                />
                <Legend />
                {getDisplayPlatforms().map((platform, index) => (
                  <Bar 
                    key={platform}
                    dataKey={platform} 
                    name={PLATFORMS[platform as keyof typeof PLATFORMS]?.name || platform} 
                    fill={PLATFORMS[platform as keyof typeof PLATFORMS]?.color || COLORS[index % COLORS.length]} 
                    isAnimationActive={true}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        {/* Organic vs Paid Trends */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <ChartContainer 
            title="Organic vs Paid Reach" 
            description="Trends in content reach types"
          >
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart 
                data={filterDataByDateRange(trendsData)} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="organic" 
                  name="Organic Reach" 
                  stroke="#82ca9d" 
                  fillOpacity={1} 
                  fill="url(#colorOrganic)" 
                  stackId="1"
                  isAnimationActive={true}
                />
                <Area 
                  type="monotone" 
                  dataKey="paid" 
                  name="Paid Reach" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorPaid)" 
                  stackId="1"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        {/* Popular Hashtag Categories */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <ChartContainer 
            title="Popular Hashtag Categories" 
            description="Most used hashtags by category and popularity"
          >
            <ResponsiveContainer width="100%" height={400}>
              <Treemap
                data={hashtagData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomTreemapContent colors={COLORS} />}
              >
                <Tooltip 
                  formatter={(value: number, name: string) => [`${name}: ${value} posts`, 'Popularity']}
                />
              </Treemap>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SocialDashboard; 