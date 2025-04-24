import SuspendedSearchForm from './components/SuspendedSearchForm';
import ResultsLayout from './components/ResultsLayout';
import EmptyState from './components/EmptyState';

export default function Home() {  
  return (
    <>
      {/* Left Container - Search Form */}
      <SuspendedSearchForm />

      {/* Right Container - Empty State */}
      <ResultsLayout>
        <EmptyState />
      </ResultsLayout>
    </>
  );
}
