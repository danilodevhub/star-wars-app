'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MovieDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Movie details error:', error);
  }, [error]);

  return (
    <div className="max-w-[800px] mx-auto p-[30px] bg-[#ffffff] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)] flex flex-col items-center">
      <h1 className="text-[24px] font-[700] mb-[15px] text-center">Error Loading Movie Details</h1>
      
      <p className="text-[16px] mb-[30px] text-center">
        We couldn&apos;t fetch the details for this movie from the Star Wars API.
        <br />
        This might be because the movie doesn&apos;t exist or the API is temporarily unavailable.
      </p>
      
      <div className="flex gap-[20px] mb-[30px]">
        <button
          onClick={reset}
          className="h-[34px] min-h-[34px] px-[20px] rounded-[20px] text-[14px] font-[700] tracking-normal leading-normal text-[#ffffff] border border-[var(--green-teal)] bg-[var(--green-teal)] cursor-pointer hover:bg-[var(--emerald)] hover:border-[var(--emerald)] transition-colors"
        >
          Try Again
        </button>
        
        <button
          onClick={() => router.push('/movies')}
          className="h-[34px] min-h-[34px] px-[20px] rounded-[20px] text-[14px] font-[700] tracking-normal leading-normal border border-[var(--pinkish-grey)] text-[var(--pinkish-grey)] bg-white cursor-pointer hover:bg-gray-50 transition-colors"
        >
          Back to Search
        </button>
      </div>
      
      <div className="w-full pt-[20px] border-t border-[var(--gainsboro)]">
        <details className="text-[14px] text-[#666]">
          <summary className="cursor-pointer mb-[10px]">Error Details</summary>
          <p className="whitespace-pre-wrap font-mono p-[10px] bg-[#f5f5f5] rounded-[4px] overflow-auto">
            {error.message}
          </p>
        </details>
      </div>
    </div>
  );
} 