import React, { useState } from "react";
import { motion } from "framer-motion";
import ChartContainer from "../components/ChartContainer.tsx";
import FilterPanel, { FilterOption } from "../components/FilterPanel.tsx";
import { useApi } from "../hooks/useApi.ts";
import {
 AreaChart,
 Area,
 LineChart,
 Line,
 BarChart,
 Bar,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 Legend,
 ResponsiveContainer,
 RadarChart,
 Radar,
 PolarGrid,
 PolarAngleAxis,
 PolarRadiusAxis,
 ComposedChart,
} from "recharts";
import { SunIcon, CloudIcon } from "@heroicons/react/24/outline";

// Define interfaces for weather data
interface CurrentWeather {
 coord: {
  lon: number;
  lat: number;
 };
 weather: Array<{
  id: number;
  main: string;
  description: string;
  icon: string;
 }>;
 base: string;
 main: {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
 };
 visibility: number;
 wind: {
  speed: number;
  deg: number;
  gust?: number;
 };
 clouds: {
  all: number;
 };
 dt: number;
 sys: {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
 };
 timezone: number;
 id: number;
 name: string;
 cod: number;
}

interface ForecastData {
 list: Array<{
  dt: number;
  main: {
   temp: number;
   feels_like: number;
   temp_min: number;
   temp_max: number;
   pressure: number;
   sea_level: number;
   grnd_level: number;
   humidity: number;
   temp_kf: number;
  };
  weather: Array<{
   id: number;
   main: string;
   description: string;
   icon: string;
  }>;
  clouds: {
   all: number;
  };
  wind: {
   speed: number;
   deg: number;
   gust: number;
  };
  visibility: number;
  pop: number;
  rain?: {
   "3h": number;
  };
  sys: {
   pod: string;
  };
  dt_txt: string;
 }>;
 city: {
  id: number;
  name: string;
  coord: {
   lat: number;
   lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
 };
}

// Sample city data for dropdown
const CITIES = [
 { value: "london", label: "London", coords: { lat: 51.5074, lon: 0.1278 } },
 { value: "paris", label: "Paris", coords: { lat: 48.8566, lon: 2.3522 } },
 {
  value: "newyork",
  label: "New York",
  coords: { lat: 40.7128, lon: -74.006 },
 },
 { value: "tokyo", label: "Tokyo", coords: { lat: 35.6762, lon: 139.6503 } },
 { value: "sydney", label: "Sydney", coords: { lat: -33.8688, lon: 151.2093 } },
 {
  value: "singapore",
  label: "Singapore",
  coords: { lat: 1.3521, lon: 103.8198 },
 },
 { value: "dubai", label: "Dubai", coords: { lat: 25.2048, lon: 55.2708 } },
 { value: "moscow", label: "Moscow", coords: { lat: 55.7558, lon: 37.6173 } },
 {
  value: "rio",
  label: "Rio de Janeiro",
  coords: { lat: -22.9068, lon: -43.1729 },
 },
 { value: "cairo", label: "Cairo", coords: { lat: 30.0444, lon: 31.2357 } },
];

// API endpoints for weather data
// Note: Replace 'YOUR_API_KEY' with a valid OpenWeather API key
const WEATHER_API_KEY = "bd5e378503939ddaee76f12ad7a97608";
const CURRENT_WEATHER_API = (lat: number, lon: number) =>
 `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
const FORECAST_API = (lat: number, lon: number) =>
 `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;

const WeatherDashboard: React.FC = () => {
 // State for selected city and filters
 const [selectedCity, setSelectedCity] = useState<string>(CITIES[0].value);
 const [filters, setFilters] = useState<Record<string, any>>({
  city: CITIES[0].value,
  unit: "celsius",
  forecastDays: "5",
 });

 // Get coordinates for selected city
 const selectedCityData =
  CITIES.find((city) => city.value === selectedCity) || CITIES[0];
 const { lat, lon } = selectedCityData.coords;

 // Fetch current weather data
 const {
  data: currentWeatherData,
  isLoading: weatherLoading,
  error: weatherError,
 } = useApi<CurrentWeather>(CURRENT_WEATHER_API(lat, lon));

 // Fetch forecast data
 const {
  data: forecastData,
  isLoading: forecastLoading,
  error: forecastError,
 } = useApi<ForecastData>(FORECAST_API(lat, lon));

 // Filter options
 const filterOptions: FilterOption[] = [
  {
   id: "city",
   label: "City",
   type: "select",
   options: CITIES.map((city) => ({ value: city.value, label: city.label })),
   defaultValue: CITIES[0].value,
  },
  {
   id: "unit",
   label: "Temperature Unit",
   type: "select",
   options: [
    { value: "celsius", label: "Celsius (°C)" },
    { value: "fahrenheit", label: "Fahrenheit (°F)" },
   ],
   defaultValue: "celsius",
  },
  {
   id: "forecastDays",
   label: "Forecast Days",
   type: "select",
   options: [
    { value: "1", label: "1 Day" },
    { value: "3", label: "3 Days" },
    { value: "5", label: "5 Days" },
   ],
   defaultValue: "5",
  },
 ];

 // Process weather data for display
 const currentTemp = currentWeatherData?.main?.temp || 0;
 const feelsLike = currentWeatherData?.main?.feels_like || 0;
 const description = currentWeatherData?.weather?.[0]?.description || "";
 const weatherIcon = currentWeatherData?.weather?.[0]?.icon || "";
 const humidity = currentWeatherData?.main?.humidity || 0;
 const windSpeed = currentWeatherData?.wind?.speed || 0;
 const pressure = currentWeatherData?.main?.pressure || 0;
 const sunrise = currentWeatherData?.sys?.sunrise
  ? new Date(currentWeatherData.sys.sunrise * 1000).toLocaleTimeString([], {
     hour: "2-digit",
     minute: "2-digit",
    })
  : "";
 const sunset = currentWeatherData?.sys?.sunset
  ? new Date(currentWeatherData.sys.sunset * 1000).toLocaleTimeString([], {
     hour: "2-digit",
     minute: "2-digit",
    })
  : "";

 // Process forecast data for charts
 const forecastChartData =
  forecastData?.list?.map((item) => {
   const date = new Date(item.dt * 1000);
   return {
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: date.toLocaleDateString(),
    dateTime: `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
     hour: "2-digit",
     minute: "2-digit",
    })}`,
    temp: item.main.temp,
    tempF: (item.main.temp * 9) / 5 + 32, // Convert to Fahrenheit
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    rain: item.rain?.["3h"] || 0,
    description: item.weather[0].description,
    icon: item.weather[0].icon,
   };
  }) || [];

 // Group forecast by days for filtering
 const forecastByDay: Record<string, any[]> = {};
 forecastChartData.forEach((item) => {
  if (!forecastByDay[item.date]) {
   forecastByDay[item.date] = [];
  }
  forecastByDay[item.date].push(item);
 });

 // Filter forecast data based on selected days
 const forecastDays = parseInt(filters.forecastDays);
 const filteredDates = Object.keys(forecastByDay).slice(0, forecastDays);
 const filteredForecast = filteredDates.flatMap((date) => forecastByDay[date]);

 // Temperature conversion function
 const convertTemp = (temp: number): number => {
  return filters.unit === "celsius" ? temp : (temp * 9) / 5 + 32;
 };

 // Format temperature with the correct unit
 const formatTemp = (temp: number): string => {
  const converted = convertTemp(temp);
  return `${converted.toFixed(1)}°${filters.unit === "celsius" ? "C" : "F"}`;
 };

 // Handle filter changes
 const handleFilterChange = (newFilters: Record<string, any>) => {
  setFilters(newFilters);

  if (newFilters.city !== selectedCity) {
   setSelectedCity(newFilters.city);
  }
 };

 // Get average daily temperatures
 const dailyAvgTemp = Object.entries(forecastByDay).map(([date, items]) => {
  const total = items.reduce((sum, item) => sum + item.temp, 0);
  return {
   date,
   avgTemp: total / items.length,
   avgTempF: ((total / items.length) * 9) / 5 + 32,
   count: items.length,
  };
 });

 // Weather conditions data for radar chart
 const weatherConditions = [
  {
   subject: "Temperature",
   A: convertTemp(currentTemp),
   fullMark: filters.unit === "celsius" ? 40 : 104,
  },
  { subject: "Humidity", A: humidity, fullMark: 100 },
  { subject: "Wind Speed", A: windSpeed, fullMark: 20 },
  { subject: "Pressure", A: pressure / 10, fullMark: 105 }, // Convert hPa to approximate percentage
  { subject: "Clouds", A: currentWeatherData?.clouds?.all || 0, fullMark: 100 },
  {
   subject: "Visibility",
   A: (currentWeatherData?.visibility || 0) / 100,
   fullMark: 100,
  }, // Convert meters to percentage
 ];

 // Animation variants
 const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
   opacity: 1,
   transition: {
    staggerChildren: 0.1,
   },
  },
 };

 const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
   y: 0,
   opacity: 1,
   transition: { duration: 0.3 },
  },
 };

 // Error handling
 const error = weatherError || forecastError;
 if (error) {
  return (
   <div className="p-6 text-center">
    <h2 className="text-xl text-red-600 mb-2">Error Loading Weather Data</h2>
    <p className="text-neutral-700">{error.message}</p>
    <button
     onClick={() => window.location.reload()}
     className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
     Retry
    </button>
   </div>
  );
 }

 return (
  <div className="max-w-7xl mx-auto">
   <div className="mb-6">
    <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Weather Dashboard</h1>
    <p className="text-neutral-600 dark:text-dark-text-secondary">Real-time weather data and forecasts</p>
   </div>

   <FilterPanel
    options={filterOptions}
    onFilterChange={handleFilterChange}
    className="mb-6"
   />

   {/* Current Weather Overview */}
   {currentWeatherData && (
    <div className="mb-6">
     <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md dark:shadow-soft-dark overflow-hidden">
      <div className="p-6 border-b border-neutral-200 dark:border-dark-border-subtle">
       <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex items-center mb-4 md:mb-0">
         <div className="flex-shrink-0 relative">
          <div className="h-16 w-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
           {currentWeatherData?.weather[0]?.main === "Clear" ? (
            <SunIcon className="h-10 w-10 text-amber-500 dark:text-amber-400" aria-hidden="true" />
           ) : currentWeatherData?.weather[0]?.main === "Clouds" ? (
            <CloudIcon className="h-10 w-10 text-blue-400 dark:text-blue-300" aria-hidden="true" />
           ) : currentWeatherData?.weather[0]?.main === "Rain" || currentWeatherData?.weather[0]?.main === "Drizzle" ? (
            <CloudIcon className="h-10 w-10 text-indigo-400 dark:text-indigo-300" aria-hidden="true" />
           ) : currentWeatherData?.weather[0]?.main === "Snow" ? (
            <svg className="h-10 w-10 text-sky-400 dark:text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.72 5.72l.7.7m12.16 12.16l-.7-.7m-10.8 0l-.7.7m12.16-12.16l-.7-.7" />
             <circle cx="12" cy="12" r="4" />
            </svg>
           ) : (
            <CloudIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" aria-hidden="true" />
           )}
           <div className="absolute -top-1 -right-1 bg-white dark:bg-dark-bg-tertiary rounded-full p-1 shadow">
            {currentWeatherData?.weather[0]?.main === "Rain" || currentWeatherData?.weather[0]?.main === "Drizzle" ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
             </svg>
            ) : currentWeatherData?.weather[0]?.main === "Snow" ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-500 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.72 5.72l.7.7m12.16 12.16l-.7-.7m-10.8 0l-.7.7m12.16-12.16l-.7-.7" />
             </svg>
            ) : null}
           </div>
          </div>
         </div>
         <div className="ml-4">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">
           {selectedCity ? CITIES.find(option => option.value === selectedCity)?.label : "Select a city"}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">
           {currentWeatherData?.weather[0]?.description ? (
            <>
             {currentWeatherData.weather[0].description.charAt(0).toUpperCase() + 
              currentWeatherData.weather[0].description.slice(1)}{" "}
              • Updated: {new Date(currentWeatherData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </>
           ) : (
            "Loading weather information..."
           )}
          </p>
         </div>
        </div>
        <div className="flex items-end">
         <span className="text-5xl font-light text-neutral-900 dark:text-dark-text-primary">
          {currentWeatherData ? formatTemp(currentWeatherData.main.temp) : "--"}°
         </span>
         <div className="ml-4 flex flex-col items-start">
          <span className="text-sm text-neutral-600 dark:text-dark-text-secondary">
           Feels like: {currentWeatherData ? formatTemp(currentWeatherData.main.feels_like) : "--"}°
          </span>
          <div className="flex items-center mt-1">
           <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
            H: {currentWeatherData ? formatTemp(currentWeatherData.main.temp_max) : "--"}°
           </span>
           <span className="ml-3 text-sm font-medium text-red-600 dark:text-red-400 flex items-center">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            L: {currentWeatherData ? formatTemp(currentWeatherData.main.temp_min) : "--"}°
           </span>
          </div>
         </div>
        </div>
       </div>
      </div>
      <div className="p-4 bg-neutral-50 dark:bg-dark-bg-tertiary">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-neutral-100 dark:border-dark-border-subtle">
         <div className="flex items-center">
          <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span className="text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary">Humidity</span>
         </div>
         <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
          {currentWeatherData ? currentWeatherData.main.humidity : "--"}%
         </p>
        </div>
        <div className="p-3 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-neutral-100 dark:border-dark-border-subtle">
         <div className="flex items-center">
          <svg className="h-5 w-5 text-teal-500 dark:text-teal-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary">Pressure</span>
         </div>
         <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
          {currentWeatherData ? (currentWeatherData.main.pressure / 1013.25).toFixed(2) : "--"} atm
         </p>
        </div>
        <div className="p-3 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-neutral-100 dark:border-dark-border-subtle">
         <div className="flex items-center">
          <svg className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary">Wind</span>
         </div>
         <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
          {currentWeatherData ? (currentWeatherData.wind.speed * 3.6).toFixed(1) : "--"} km/h
         </p>
        </div>
        <div className="p-3 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-neutral-100 dark:border-dark-border-subtle">
         <div className="flex items-center">
          <svg className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary">Visibility</span>
         </div>
         <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
          {currentWeatherData ? (currentWeatherData.visibility / 1000).toFixed(1) : "--"} km
         </p>
        </div>
       </div>
      </div>
     </div>
    </div>
   )}

   <motion.div
    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    variants={containerVariants}
    initial="hidden"
    animate="visible">
    {/* Temperature Forecast */}
    <motion.div variants={itemVariants} className="lg:col-span-2">
     <ChartContainer
      title="Temperature Forecast"
      description={`Next ${forecastDays} days temperature forecast`}
      isLoading={forecastLoading}>
      <ResponsiveContainer width="100%" height={300}>
       <LineChart
        data={filteredForecast}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
         dataKey="dateTime"
         tick={{ fontSize: 10 }}
         interval="preserveStartEnd"
         tickFormatter={(value) => value.split(" ")[1]} // Show only time
        />
        <YAxis
         tickFormatter={(value) =>
          `${value}${filters.unit === "celsius" ? "°C" : "°F"}`
         }
        />
        <Tooltip
         formatter={(value: number) => [
          `${value.toFixed(1)}${filters.unit === "celsius" ? "°C" : "°F"}`,
          "Temperature",
         ]}
         labelFormatter={(label) => label}
        />
        <Legend />
        <Line
         type="monotone"
         dataKey={filters.unit === "celsius" ? "temp" : "tempF"}
         name="Temperature"
         stroke="#FF8042"
         strokeWidth={2}
         dot={{ r: 3 }}
         activeDot={{ r: 8 }}
         isAnimationActive={true}
        />
       </LineChart>
      </ResponsiveContainer>
     </ChartContainer>
    </motion.div>

    {/* Humidity & Wind Speed */}
    <motion.div variants={itemVariants}>
     <ChartContainer
      title="Humidity & Wind Speed"
      description="Forecast comparison of humidity and wind conditions"
      isLoading={forecastLoading}>
      <ResponsiveContainer width="100%" height={300}>
       <ComposedChart
        data={filteredForecast.filter((_, i) => i % 2 === 0)}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
        <YAxis
         yAxisId="left"
         orientation="left"
         tickFormatter={(value) => `${value}%`}
         domain={[0, 100]}
        />
        <YAxis
         yAxisId="right"
         orientation="right"
         tickFormatter={(value) => `${value} m/s`}
         domain={[0, "auto"]}
        />
        <Tooltip
         formatter={(value: number, name: string) => {
          if (name === "Humidity") return [`${value}%`, name];
          return [`${value} m/s`, name];
         }}
        />
        <Legend />
        <Bar
         yAxisId="left"
         dataKey="humidity"
         name="Humidity"
         fill="#8884d8"
         radius={[4, 4, 0, 0]}
         isAnimationActive={true}
        />
        <Line
         yAxisId="right"
         type="monotone"
         dataKey="windSpeed"
         name="Wind Speed"
         stroke="#82ca9d"
         strokeWidth={2}
         isAnimationActive={true}
        />
       </ComposedChart>
      </ResponsiveContainer>
     </ChartContainer>
    </motion.div>

    {/* Weather Conditions Radar */}
    <motion.div variants={itemVariants}>
     <ChartContainer
      title="Current Weather Conditions"
      description="Radar chart of current weather parameters"
      isLoading={weatherLoading}>
      <ResponsiveContainer width="100%" height={300}>
       <RadarChart cx="50%" cy="50%" outerRadius="80%" data={weatherConditions}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
        <Radar
         name="Current Conditions"
         dataKey="A"
         stroke="#8884d8"
         fill="#8884d8"
         fillOpacity={0.6}
         isAnimationActive={true}
        />
        <Tooltip
         formatter={(value: number, name: string, props: any) => {
          const { payload } = props;
          const subject = payload.subject;

          if (subject === "Temperature")
           return [
            `${value.toFixed(1)}${filters.unit === "celsius" ? "°C" : "°F"}`,
            subject,
           ];
          if (subject === "Humidity") return [`${value}%`, subject];
          if (subject === "Wind Speed") return [`${value} m/s`, subject];
          if (subject === "Pressure")
           return [`${(value * 10).toFixed(0)} hPa`, subject];
          if (subject === "Clouds") return [`${value}%`, subject];
          if (subject === "Visibility")
           return [`${(value * 100).toFixed(0)} m`, subject];

          return [value, subject];
         }}
        />
       </RadarChart>
      </ResponsiveContainer>
     </ChartContainer>
    </motion.div>

    {/* Daily Average Temperature */}
    <motion.div variants={itemVariants} className="lg:col-span-2">
     <ChartContainer
      title="Daily Average Temperature"
      description="Average temperature by day"
      isLoading={forecastLoading}>
      <ResponsiveContainer width="100%" height={300}>
       <BarChart
        data={dailyAvgTemp}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis
         tickFormatter={(value) =>
          `${value}${filters.unit === "celsius" ? "°C" : "°F"}`
         }
        />
        <Tooltip
         formatter={(value: number) => [
          `${value.toFixed(1)}${filters.unit === "celsius" ? "°C" : "°F"}`,
          "Avg. Temp",
         ]}
        />
        <Legend />
        <Bar
         dataKey={filters.unit === "celsius" ? "avgTemp" : "avgTempF"}
         name="Average Temperature"
         fill="#8884d8"
         radius={[4, 4, 0, 0]}
         isAnimationActive={true}
        />
       </BarChart>
      </ResponsiveContainer>
     </ChartContainer>
    </motion.div>

    {/* Rain Probability */}
    <motion.div variants={itemVariants} className="lg:col-span-2">
     <ChartContainer
      title="Precipitation Forecast"
      description="Expected rainfall in next 24 hours (mm)"
      isLoading={forecastLoading}>
      <ResponsiveContainer width="100%" height={250}>
       <AreaChart
        data={filteredForecast.slice(0, 8)}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
         <linearGradient id="rainColor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
         </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis tickFormatter={(value) => `${value}mm`} />
        <Tooltip
         formatter={(value: number) => [`${value.toFixed(1)}mm`, "Rainfall"]}
        />
        <Legend />
        <Area
         type="monotone"
         dataKey="rain"
         stroke="#8884d8"
         fillOpacity={1}
         fill="url(#rainColor)"
         name="Rainfall"
         isAnimationActive={true}
        />
       </AreaChart>
      </ResponsiveContainer>
     </ChartContainer>
    </motion.div>
   </motion.div>
  </div>
 );
};

export default WeatherDashboard;
