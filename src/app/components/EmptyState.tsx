import React, { ReactNode } from 'react';

interface EmptyStateProps {
  message?: ReactNode;
}

export default function EmptyState({ message }: EmptyStateProps) {
  const defaultMessage = (
    <>
      There are zero matches.
      <br />
      Use the form to search for People or Movies.
    </>
  );

  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-[14px] font-[700] tracking-normal leading-normal text-[var(--pinkish-grey)] text-center">
        {message || defaultMessage}
      </p>
    </div>
  );
} 