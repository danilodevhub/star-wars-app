import { fetchMovies } from '@/app/lib/api';
import ResultsLayout from '@/app/components/ResultsLayout';
import EmptyState from '@/app/components/EmptyState';
import ListItem from '@/app/components/ListItem';
interface SearchParams {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function MoviesPage({ searchParams }: SearchParams) {
  const params = await searchParams;
  const query = params?.q || '';
  const movies = await fetchMovies(query);
  
  if (movies.length === 0) {
    return (
      <ResultsLayout>
        <EmptyState />
      </ResultsLayout>
    );
  }

  return (
    <ResultsLayout>
      <div className="divide-y divide-[var(--gainsboro)]">
        {movies.map((movie) => (
          <ListItem key={movie.title} text={movie.title} />
        ))}
      </div>
    </ResultsLayout>
  );
} 