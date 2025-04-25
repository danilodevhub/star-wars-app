/**
 * Logger utility for debugging
 * Only logs in development environment to prevent leaking sensitive information in production
 */

/**
 * Log a debug message (only in development)
 */
export const debug = (context: string, message: string, ...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${context}] ${message}`, ...args);
  }
};

/**
 * Log an error (these will show in all environments but can be filtered)
 */
export const error = (context: string, message: string, error?: any): void => {
  console.error(`[${context}] ${message}`, error || '');
};

/**
 * Log a warning (these will show in all environments but can be filtered)
 */
export const warn = (context: string, message: string, ...args: any[]): void => {
  console.warn(`[${context}] ${message}`, ...args);
};

/**
 * Logger instance for a specific context
 */
export const createLogger = (context: string) => ({
  debug: (message: string, ...args: any[]) => debug(context, message, ...args),
  error: (message: string, err?: any) => error(context, message, err),
  warn: (message: string, ...args: any[]) => warn(context, message, ...args)
}); 