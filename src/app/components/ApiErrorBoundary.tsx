'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createLogger } from '@/app/lib/logger';

// Create a logger instance
const logger = createLogger('ApiErrorBoundary');

interface ApiErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | (({ onRetry, onGoHome }: { onRetry?: () => void; onGoHome?: () => void }) => ReactNode);
  resetKey?: string | number;
}

export default function ApiErrorBoundary({ 
  children, 
  fallback = <DefaultErrorFallback />,
  resetKey
}: ApiErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  // Reset error state when resetKey changes
  useEffect(() => {
    setHasError(false);
  }, [resetKey]);

  // Add global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logger.error('Caught in ApiErrorBoundary:', event.error);
      
      // Only handle API-related errors
      if (event.error?.message?.includes('API') || 
          event.error?.message?.includes('fetch') ||
          event.error?.message?.includes('network')) {
        event.preventDefault();
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Handle button retry action
  const handleRetry = () => {
    setHasError(false);
  };

  // Handle button go home action
  const handleGoHome = () => {
    router.push('/');
    setHasError(false);
  };

  if (hasError) {
    return typeof fallback === 'function' 
      ? fallback({ onRetry: handleRetry, onGoHome: handleGoHome })
      : fallback;
  }

  return <>{children}</>;
}

function DefaultErrorFallback({ 
  onRetry, 
  onGoHome 
}: { 
  onRetry?: () => void; 
  onGoHome?: () => void;
}) {
  return (
    <div className="w-full max-w-[800px] h-[400px] bg-[#ffffff] p-[30px] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)] flex flex-col items-center justify-center">
      <h2 className="text-[24px] font-[700] mb-[20px] text-[#383838]">Something went wrong</h2>
      <p className="text-[16px] mb-[30px] text-center">
        We couldn&apos;t fetch the data from the Star Wars API.
        <br />
        Please try again or go back to the home page.
      </p>
      <div className="flex gap-[20px]">
        {onRetry && (
          <button 
            onClick={onRetry}
            className="h-[34px] min-h-[34px] px-[20px] rounded-[20px] text-[14px] font-[700] tracking-normal leading-normal text-[#ffffff] border border-[var(--green-teal)] bg-[var(--green-teal)] cursor-pointer hover:bg-[var(--emerald)] hover:border-[var(--emerald)] transition-colors"
          >
            Try Again
          </button>
        )}
        {onGoHome && (
          <button 
            onClick={onGoHome}
            className="h-[34px] min-h-[34px] px-[20px] rounded-[20px] text-[14px] font-[700] tracking-normal leading-normal border border-[var(--pinkish-grey)] text-[var(--pinkish-grey)] bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Go Home
          </button>
        )}
      </div>
    </div>
  );
} 