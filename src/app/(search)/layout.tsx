import SuspendedSearchForm from '@/app/components/SuspendedSearchForm';
import ApiErrorBoundary from '@/app/components/ApiErrorBoundary';

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {  
  return (
    <>
      {/* Left Container - Search Form */}
      <SuspendedSearchForm />

      {/* Right Container - Results with Error Boundary */}
      <ApiErrorBoundary>
        {children}
      </ApiErrorBoundary>
    </>
  );
} 