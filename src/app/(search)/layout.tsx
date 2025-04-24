import SuspendedSearchForm from '@/app/components/SuspendedSearchForm';

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {  
  return (
    <>
      {/* Left Container - Search Form */}
      <SuspendedSearchForm />

      {/* Right Container - Results */}
      {children}
    </>
  );
} 