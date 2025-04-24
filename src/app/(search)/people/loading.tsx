import ResultsLayout from '@/app/components/ResultsLayout';
import EmptyState from '@/app/components/EmptyState';

export default function Loading() {
  return (
    <ResultsLayout>
      <EmptyState message="Searching..." />
    </ResultsLayout>
  );
} 