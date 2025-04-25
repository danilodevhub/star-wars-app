import SuspendedSearchForm from '@/app/components/SuspendedSearchForm';
import ResultsContainer from '@/app/components/ResultsContainer';
import EmptyState from '@/app/components/EmptyState';

export default function Home() {  
  return (
    <>
      {/* Left Container - Search Form */}
      <SuspendedSearchForm />

      {/* Right Container - Empty State */}
      <ResultsContainer>
        <EmptyState />
      </ResultsContainer>
    </>
  );
}
