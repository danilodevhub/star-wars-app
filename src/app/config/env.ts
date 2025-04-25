/**
 * Environment configuration
 * Centralizes access to environment variables with type safety and defaults
 */

// API configurations with defaults
export const API_CONFIG = {
  // Base URL for calling our own API endpoints
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  
  // Base URL for SWAPI (used by our backend)
  swapiUrl: process.env.SWAPI_BASE_URL || 'https://swapi.tech/api',
  
  // Whether we're in development mode
  isDev: process.env.NODE_ENV === 'development',
  
  // Get full URL for our API
  getFullUrl: (path: string): string => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Build the URL based on environment
    if (typeof window === 'undefined') {
      // Server-side rendering
      return `${API_CONFIG.baseUrl}/${cleanPath}`;
    }
    
    // Client-side with specified base URL
    if (API_CONFIG.baseUrl) {
      return `${API_CONFIG.baseUrl}/${cleanPath}`;
    }
    
    // Client-side with implicit origin
    return `${window.location.origin}/${cleanPath}`;
  }
}; 