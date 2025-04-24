import SearchForm from './components/SearchForm';
import ResultsLayout from './components/ResultsLayout';
import EmptyState from './components/EmptyState';

export default function Home() {  
  return (
    <>
      {/* Left Container - Search Form */}
      <SearchForm />

      {/* Right Container - Empty State */}
      <ResultsLayout>
        <EmptyState />
      </ResultsLayout>
    </>
  );
}
