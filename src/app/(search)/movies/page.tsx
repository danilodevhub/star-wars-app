import { fetchMovies } from '@/app/lib/internalapi-client';
import ResultsContainer from '@/app/components/ResultsContainer';
import EmptyState from '@/app/components/EmptyState';
import ListItem from '@/app/components/ListItem';
import { Movie } from '@/app/types/movie';
import { createLogger } from '@/app/lib/logger';

const logger = createLogger('MoviesPage');

interface SearchParams {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function MoviesPage({ searchParams }: SearchParams) {
  const params = await searchParams;
  const query = params?.q || '';
  
  // Fetch movies data with error handling
  let movies: Movie[] = [];
  try {
    movies = await fetchMovies(query) as Movie[];
  } catch (fetchError) {
    logger.error('Failed to fetch movies', fetchError);
    return (
      <ResultsContainer>
        <EmptyState message="Error loading data. Please try again." />
      </ResultsContainer>
    );
  }
  
  // Handle empty results
  if (movies.length === 0) {
    return (
      <ResultsContainer>
        <EmptyState />
      </ResultsContainer>
    );
  }
  
  // Render results
  return (
    <ResultsContainer>
      <div className="divide-y divide-[var(--gainsboro)]">
        {movies.map((movie) => (
          <ListItem 
            key={movie.uid} 
            text={movie.title} 
            id={movie.uid} 
          />
        ))}
      </div>
    </ResultsContainer>
  );
} 