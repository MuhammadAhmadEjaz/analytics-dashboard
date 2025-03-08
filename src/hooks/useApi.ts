import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

interface ApiResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheItem<any>> = {};
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook for making API calls with caching and error handling
 * @param url The URL to make the request to
 * @param options Request options including method, headers, etc.
 * @param cacheTtl Cache time-to-live in milliseconds
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useApi<T>(
  url: string,
  options: AxiosRequestConfig = {},
  cacheTtl: number = DEFAULT_CACHE_TIME
): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = `${url}-${JSON.stringify(options)}`;

  const fetchData = useCallback(async (): Promise<void> => {
    const now = Date.now();
    const cachedData = cache[cacheKey];

    // If we have cached data and it's still valid
    if (cachedData && now - cachedData.timestamp < cacheTtl) {
      setData(cachedData.data);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios(url, options);
      const newData = response.data;
      
      // Cache the data
      cache[cacheKey] = {
        data: newData,
        timestamp: now,
      };

      setData(newData);
    } catch (err) {
      const error = err as AxiosError;
      setError(new Error(`Failed to fetch data: ${error.message}`));
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [url, cacheKey, cacheTtl, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async (): Promise<void> => {
    // Clear the cache for this request before refetching
    delete cache[cacheKey];
    await fetchData();
  }, [cacheKey, fetchData]);

  return { data, isLoading, error, refetch };
}

/**
 * Function to perform a simple API request without React hooks
 * @param url The URL to make the request to
 * @param options Request options including method, headers, etc.
 * @returns Promise containing the response data
 */
export async function fetchApi<T>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await axios(url, options);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error('API Error:', error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
} 