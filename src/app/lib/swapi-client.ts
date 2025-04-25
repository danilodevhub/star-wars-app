/**
 * API client for interacting with SWAPI (Star Wars API)
 */
import { API_CONFIG } from '@/app/config/env';
import { createLogger } from '@/app/lib/logger';
import { trackRequestStart, trackRequestEnd } from '@/app/lib/performance';

// Create logger instance for this module
const logger = createLogger('SWAPI');

/**
 * Error class for API errors with status code
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Common SWAPI API response interfaces
 */
export interface SwapiResponse<T> {
  message?: string;
  result?: T | T[];
  results?: T[];
  description?: string;
  total_records?: number;
  total_pages?: number;
  previous?: string | null;
  next?: string | null;
}

export interface SwapiPersonProperties {
  name?: string;
  birth_year?: string;
  gender?: string;
  eye_color?: string;
  hair_color?: string;
  height?: string;
  mass?: string;
  films?: string[];
  [key: string]: any;
}

export interface SwapiPerson {
  uid?: string;
  name?: string;
  url?: string;
  properties?: SwapiPersonProperties;
  description?: string;
}

export interface SwapiMovieProperties {
  title?: string;
  release_date?: string;
  director?: string;
  opening_crawl?: string;
  characters?: string[];
  [key: string]: any;
}

export interface SwapiMovie {
  uid?: string;
  title?: string;
  url?: string;
  properties?: SwapiMovieProperties;
  description?: string;
}

// Cache object to store API responses with timestamps
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetches data from the SWAPI API with error handling
 */
async function fetchWithErrorHandling<T>(
  endpoint: string,
  resourceType: string
): Promise<T> {
  const url = `${API_CONFIG.swapiUrl}/${endpoint}`;
  const requestId = trackRequestStart(url, `swapi-${resourceType}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      trackRequestEnd(requestId, response.status, false);
      throw new Error(`Failed to fetch ${resourceType}: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as T;
    trackRequestEnd(requestId, response.status, true);
    
    return data;
  } catch (error) {
    logger.error(`Error fetching ${resourceType}:`, error);
    // Ensure we track failed requests with status 0 if not tracked yet
    trackRequestEnd(requestId, 0, false);
    throw error;
  }
}

/**
 * Fetch directly from a full URL (for RESTful API links)
 */
async function fetchFromUrl<T>(url: string, resourceType: string): Promise<T> {
  // Handle caching
  const cacheKey = url;
  const now = Date.now();
  const cachedItem = cache[cacheKey];
  
  // Return cached data if it exists and is not expired
  if (cachedItem && now - cachedItem.timestamp < CACHE_DURATION) {
    logger.debug(`Using cached data for: ${url}`);
    return cachedItem.data;
  }
  
  const requestId = trackRequestStart(url, `swapi-url-${resourceType}`);
  const start = performance.now();
  
  try {
    if (API_CONFIG.isDev) {
      logger.debug(`Fetching from URL: ${url}`);
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      trackRequestEnd(requestId, response.status, false);
      throw new ApiError(`Failed to fetch ${resourceType} from URL: ${url}`, response.status);
    }

    const data = await response.json() as T;
    
    // Track performance
    const end = performance.now();
    logger.debug(`${resourceType} from ${url} completed in ${(end - start).toFixed(2)}ms`);
    trackRequestEnd(requestId, response.status, true);
    
    if (API_CONFIG.isDev) {
      logger.debug(`Response from URL: ${JSON.stringify(data).slice(0, 200)}...`);
    }
    
    // Cache the response
    cache[cacheKey] = { data, timestamp: now };
    
    return data;
  } catch (error) {
    const end = performance.now();
    logger.error(`${resourceType} from ${url} failed after ${(end - start).toFixed(2)}ms:`, error);
    
    // Ensure we track failed requests
    trackRequestEnd(requestId, error instanceof ApiError ? error.status : 0, false);
    
    // If it's not already an ApiError, convert it
    if (!(error instanceof ApiError)) {
      throw new ApiError(
        error instanceof Error ? error.message : String(error),
        0 // Unknown status
      );
    }
    
    // Rethrow ApiErrors
    throw error;
  }
}

/**
 * SWAPI client with methods for accessing Star Wars data
 */
export const swapiClient = {
  // Base URL for the SWAPI API from environment config
  baseUrl: API_CONFIG.swapiUrl,
  
  // Get a list of people matching a search term
  async searchPeople(query: string): Promise<SwapiResponse<SwapiPerson>> {
    const start = performance.now();
    try {
      const result = await fetchWithErrorHandling<SwapiResponse<SwapiPerson>>(
        `people/?name=${encodeURIComponent(query)}`, 
        'people search'
      );
      const end = performance.now();
      logger.debug(`searchPeople completed in ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      logger.error(`searchPeople failed after ${(end - start).toFixed(2)}ms:`, error);
      throw error;
    }
  },
  
  // Get details for a specific person by ID
  async getPerson(id: string): Promise<SwapiResponse<SwapiPerson>> {
    const start = performance.now();
    try {
      const result = await fetchWithErrorHandling<SwapiResponse<SwapiPerson>>(
        `people/${id}`, 
        'person'
      );
      const end = performance.now();
      logger.debug(`getPerson completed in ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      logger.error(`getPerson failed after ${(end - start).toFixed(2)}ms:`, error);
      throw error;
    }
  },
  
  // Search movies (films) by title
  async searchMovies(query: string): Promise<SwapiResponse<SwapiMovie>> {
    const start = performance.now();
    try {
      const result = await fetchWithErrorHandling<SwapiResponse<SwapiMovie>>(
        `films/?title=${encodeURIComponent(query)}`, 
        'movies search'
      );
      const end = performance.now();
      logger.debug(`searchMovies completed in ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      logger.error(`searchMovies failed after ${(end - start).toFixed(2)}ms:`, error);
      throw error;
    }
  },
  
  // Get details for a specific movie by ID
  async getMovie(id: string): Promise<SwapiResponse<SwapiMovie>> {
    const start = performance.now();
    try {
      const result = await fetchWithErrorHandling<SwapiResponse<SwapiMovie>>(
        `films/${id}`, 
        'movie'
      );
      const end = performance.now();
      logger.debug(`getMovie completed in ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      logger.error(`getMovie failed after ${(end - start).toFixed(2)}ms:`, error);
      throw error;
    }
  },
  
  // Fetch from a direct URL (RESTful API link)
  async fetchFromUrl<T>(url: string, resourceType: string): Promise<T> {
    const start = performance.now();
    try {
      const result = await fetchFromUrl<T>(url, resourceType);
      const end = performance.now();
      logger.debug(`fetchFromUrl completed in ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      logger.error(`fetchFromUrl failed after ${(end - start).toFixed(2)}ms:`, error);
      throw error;
    }
  },
};

export default swapiClient; 