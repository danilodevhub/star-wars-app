'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import EmptyState from '@/app/components/EmptyState';
import ResultsContainer from '@/app/components/ResultsContainer';

export default function MoviesSearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Movies search error:', error);
  }, [error]);

  return (
    <ResultsContainer>
      <div className="flex flex-col items-center justify-center h-full">
        <EmptyState message={
          <>
            Unable to load search results.
            <br />
            The Star Wars API might be temporarily unavailable.
          </>
        } />
        
        <button
          onClick={reset}
          className="mt-[20px] h-[34px] min-h-[34px] px-[20px] rounded-[20px] text-[14px] font-[700] tracking-normal leading-normal text-[#ffffff] border border-[var(--green-teal)] bg-[var(--green-teal)] cursor-pointer hover:bg-[var(--emerald)] hover:border-[var(--emerald)] transition-colors"
        >
          Try Again
        </button>
      </div>
    </ResultsContainer>
  );
} 