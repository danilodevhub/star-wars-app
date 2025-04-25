import { Movie } from '@/app/types/movie';
import { Person } from '@/app/types/person';
import { API_CONFIG } from '@/app/config/env';
import { ApiError } from '@/app/lib/swapi-client';
import { createLogger } from '@/app/lib/logger';
import { measurePerformance } from '@/app/lib/performance';

// Create logger for this module
const logger = createLogger('API');

const BATH_PATH = '/api/v1';
// For debugging URL issues
const logApiRequest = (url: string, context: string) => {
  if (API_CONFIG.isDev) {
    logger.debug(`API Request [${context}]: ${url}`);
  }
};

/**
 * Helper function to make API requests with error handling
 */
async function fetchWithErrorHandling<T>(path: string, context = 'unknown'): Promise<T> {
  // Build the full URL using centralized config
  const url = API_CONFIG.getFullUrl(path);
  
  // Log all API calls in development
  logApiRequest(url, context);
  
  const start = performance.now();
  
  try {
    // Perform the fetch with explicit cache settings
    const response = await fetch(url, {
      cache: 'no-cache', // Ensure we always get fresh data
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      // Check if the response is HTML (indicating a 404 page or other error page)
      if (errorText.includes('<!DOCTYPE html>') || errorText.includes('<html')) {
        throw new ApiError(`API request failed with status ${response.status}: Not Found`, response.status);
      }
      throw new ApiError(`API request failed with status ${response.status}: ${errorText}`, response.status);
    }
    
    const data = await response.json() as T;
    
    // Track performance
    const end = performance.now();
    logger.debug(`${context} completed in ${(end - start).toFixed(2)}ms`);
    
    return data;
  } catch (error) {
    // Track performance for errors too
    const end = performance.now();
    logger.error(`${context} failed after ${(end - start).toFixed(2)}ms:`, error);
    
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
 * Fetch movies from our API based on search text
 */
export const fetchMovies = measurePerformance(
  async function(searchText: string): Promise<Movie[]> {
    try {
      if (!searchText) return [];
      
      // Call our local API instead of SWAPI directly
      const encodedQuery = encodeURIComponent(searchText);
      const path = `${BATH_PATH}/movies?q=${encodedQuery}`;
      
      const movies = await fetchWithErrorHandling<Movie[]>(path, 'fetchMovies');
      return movies;
    } catch (error) {
      logger.error('Error fetching movies:', error);
      // Return empty array on error to prevent UI from breaking
      return [];
    }
  },
  'fetchMovies'
);

/**
 * Fetch movie details from our API by ID
 */
export const fetchMovieDetails = measurePerformance(
  async function(id: string): Promise<Movie> {
    if (!id) {
      throw new ApiError('Movie ID is required', 400);
    }
    
    // Ensure ID is properly encoded
    const safeId = encodeURIComponent(id);
    const path = `${BATH_PATH}/movies/${safeId}`;
    
    try {
      const movie = await fetchWithErrorHandling<Movie>(path, 'fetchMovieDetails');
      return movie;
    } catch (error) {
      logger.error(`Error fetching movie details for ID ${id}:`, error);
      
      // Rethrow ApiErrors directly
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Wrap other errors
      throw new ApiError(
        `Failed to fetch movie details: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  },
  'fetchMovieDetails'
);

/**
 * Fetch people from our API based on search text
 */
export const fetchPeople = measurePerformance(
  async function(searchText: string): Promise<Person[]> {
    try {
      if (!searchText) return [];
      
      // Call our local API instead of SWAPI directly
      const encodedQuery = encodeURIComponent(searchText);
      const path = `${BATH_PATH}/people?q=${encodedQuery}`;
      
      const people = await fetchWithErrorHandling<Person[]>(path, 'fetchPeople');
      return people;
    } catch (error) {
      logger.error('Error fetching people:', error);
      // Return empty array on error to prevent UI from breaking
      return [];
    }
  },
  'fetchPeople'
);

/**
 * Fetch person details from our API by ID
 */
export const fetchPersonDetails = measurePerformance(
  async function(id: string): Promise<Person> {
    if (!id) {
      throw new ApiError('Person ID is required', 400);
    }
    
    // Ensure ID is properly encoded
    const safeId = encodeURIComponent(id);
    const path = `${BATH_PATH}/people/${safeId}`;
    
    try {
      const person = await fetchWithErrorHandling<Person>(path, 'fetchPersonDetails');
      return person;
    } catch (error) {
      logger.error(`Error fetching person details for ID ${id}:`, error);
      
      // Rethrow ApiErrors directly
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Wrap other errors
      throw new ApiError(
        `Failed to fetch person details: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  },
  'fetchPersonDetails'
); 