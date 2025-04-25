/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/**
 * Performance monitoring utility
 * Tracks API response times and other performance metrics
 */
import { createLogger } from '@/app/lib/logger';

// Create a logger for performance monitoring
const logger = createLogger('Performance');

// Track API requests and their timings
const requests: Record<string, {
  startTime: number;
  endTime?: number;
  duration?: number;
  status?: number;
  success?: boolean;
}> = {};

// Performance metrics
let totalRequests = 0;
let successfulRequests = 0;
let failedRequests = 0;
let totalDuration = 0;

/**
 * Start tracking a request
 * @param url The request URL
 * @param requestId Optional ID for the request (defaults to URL + timestamp)
 * @returns The request ID
 */
export function trackRequestStart(url: string, requestId?: string): string {
  const id = requestId || `${url}-${Date.now()}`;
  
  requests[id] = {
    startTime: performance.now()
  };
  
  totalRequests++;
  return id;
}

/**
 * End tracking a request and record metrics
 * @param requestId The request ID returned from trackRequestStart
 * @param status The HTTP status code
 * @param success Whether the request was successful
 */
export function trackRequestEnd(requestId: string, status: number, success: boolean): void {
  const request = requests[requestId];
  if (!request) {
    logger.warn(`No request found with ID ${requestId}`);
    return;
  }
  
  request.endTime = performance.now();
  request.duration = request.endTime - request.startTime;
  request.status = status;
  request.success = success;
  
  if (success) {
    successfulRequests++;
  } else {
    logger.debug('Failed request', requestId);
    failedRequests++;
  }
  
  totalDuration += request.duration;
  
  // Log the request timing
  logger.debug(`Request ${requestId}: ${request.duration.toFixed(2)}ms, status: ${status}, success: ${success}`);
}

/**
 * Track API fetch calls with a wrapper
 * @param fetcher The fetch function to wrap
 * @param context Identifier for the fetch call
 * @returns The wrapped fetch function
 */
export function withPerformanceTracking<T>(
  fetcher: (url: string) => Promise<T>,
  context: string
): (url: string) => Promise<T> {
  return async (url: string) => {
    const requestId = `${context}-${url}-${Date.now()}`;
    trackRequestStart(url, requestId);
    
    try {
      const result = await fetcher(url);
      trackRequestEnd(requestId, 200, true);
      return result;
    } catch (error) {
      trackRequestEnd(requestId, error instanceof Error && 'status' in error ? (error as Error & { status: number }).status : 0, false);
      throw error;
    }
  };
}

/**
 * Get performance metrics
 * @returns Current performance metrics
 */
export function getPerformanceMetrics() {
  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    averageRequestTime: totalRequests > 0 ? totalDuration / totalRequests : 0,
    successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0
  };
}

/**
 * Reset performance metrics
 */
export function resetPerformanceMetrics() {
  totalRequests = 0;
  successfulRequests = 0;
  failedRequests = 0;
  totalDuration = 0;
  Object.keys(requests).forEach(key => delete requests[key]);
}

/**
 * Measures the execution time of a function
 * @param fn The function to measure
 * @param context Name of the operation being measured
 * @returns The wrapped function
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  context: string
): T {
  return function(...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.then((res) => {
          const end = performance.now();
          const duration = end - start;
          logger.debug(`${context} completed in ${duration.toFixed(2)}ms`);
          return res;
        }).catch((err) => {
          const end = performance.now();
          const duration = end - start;
          logger.error(`${context} failed after ${duration.toFixed(2)}ms:`, err);
          throw err;
        }) as ReturnType<T>;
      }
      
      const end = performance.now();
      const duration = end - start;
      logger.debug(`${context} completed in ${duration.toFixed(2)}ms`);
      return result as ReturnType<T>;
    } catch (err) {
      const end = performance.now();
      const duration = end - start;
      logger.error(`${context} failed after ${duration.toFixed(2)}ms:`, err);
      throw err;
    }
  } as T;
} 