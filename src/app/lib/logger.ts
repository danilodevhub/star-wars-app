/**
 * Logger utility for debugging
 * Only logs in development environment to prevent leaking sensitive information in production
 */

/**
 * Log a debug message (only in development)
 */
export const debug = (context: string, message: string, ...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${context}] ${message}`, ...args);
  }
};

/**
 * Log an error (these will show in all environments but can be filtered)
 */
export const error = (context: string, message: string, error?: unknown): void => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [${context}] ${message}`);
  if (error) {
    if (error instanceof Error) {
      console.error(`[${timestamp}] [${context}] Error details:`, {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error(`[${timestamp}] [${context}] Error details:`, error);
    }
  }
};

/**
 * Log a warning (these will show in all environments but can be filtered)
 */
export const warn = (context: string, message: string, ...args: unknown[]): void => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] [${context}] ${message}`, ...args);
};

/**
 * Logger instance for a specific context
 */
export const createLogger = (context: string) => ({
  debug: (message: string, ...args: unknown[]) => debug(context, message, ...args),
  error: (message: string, err?: unknown) => error(context, message, err),
  warn: (message: string, ...args: unknown[]) => warn(context, message, ...args)
}); 