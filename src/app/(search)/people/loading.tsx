import ResultsContainer from '@/app/components/ResultsContainer';
import EmptyState from '@/app/components/EmptyState';

export default function Loading() {
  return (
    <ResultsContainer>
      <EmptyState message="Searching..." />
    </ResultsContainer>
  );
} 