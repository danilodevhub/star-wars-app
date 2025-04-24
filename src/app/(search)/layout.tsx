import SearchForm from '@/app/components/SearchForm';

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {  
  return (
    <>
      {/* Left Container - Search Form */}
      <SearchForm />

      {/* Right Container - Results */}
      {children}
    </>
  );
} 