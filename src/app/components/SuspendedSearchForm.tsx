'use client';

import { Suspense } from 'react';
import SearchForm from '@/app/components/SearchForm';

/**
 * SuspendedSearchForm
 * 
 * This component wraps the SearchForm component in a Suspense boundary.
 * This is required when using useSearchParams() in Next.js.
 */
export default function SuspendedSearchForm() {
  return (
    <Suspense 
      fallback={
        <div className="w-[400px] h-[230px] bg-[#ffffff] p-[30px] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)]">
          Loading search form...
        </div>
      }
    >
      <SearchForm />
    </Suspense>
  );
} 