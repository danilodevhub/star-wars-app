import { fetchMovieDetails } from '@/app/lib/internalapi-client';
import BackToSearchButton from '@/app/components/BackToSearchButton';
import { ApiError } from '@/app/lib/swapi-client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createLogger } from '@/app/lib/logger';
import { Movie } from '@/app/types/movie';

// Create a logger for this page
const logger = createLogger('MovieDetails');

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const id = (await params).id;

  try {
    logger.debug(`Loading movie details: ${id}`);
    
    const movie = await fetchMovieDetails(id) as Movie;

    return (
      <div className="w-[804px] max-h-[537px] mx-auto p-[30px] bg-[#ffffff] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)] overflow-auto flex flex-col">
        <h1 className="text-[24px] font-[700] mb-[30px]">{movie.title}</h1>
        
        <div className="grid grid-cols-2 gap-[30px] mb-[30px]">
          <div>
            <h2 className="text-[18px] font-[700] mb-[15px] border-b border-[var(--gainsboro)] pb-[5px]">Opening Crawl</h2>
            <p className="text-[14px] whitespace-pre-line leading-relaxed">
              {movie.opening_crawl}
            </p>
          </div>
          
          <div>
            <h2 className="text-[18px] font-[700] mb-[15px] border-b border-[var(--gainsboro)] pb-[5px]">Characters</h2>
            <div className="text-[14px]">
              {movie.characters.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {movie.characters.map((character: { uid: string; name: string }, index: number) => (
                    <span key={character.uid}>
                      <Link
                        href={`/people/${character.uid}`}
                        className="text-[var(--green-teal)] hover:text-[var(--emerald)] transition-colors"
                      >
                        {character.name}
                      </Link>
                      {index < movie.characters.length - 1 && <span>,&nbsp;</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--pinkish-grey)]">No characters found</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <BackToSearchButton />
        </div>
      </div>
    );
  } catch (error) {
    logger.error('Error in MovieDetailsPage:', error);
    
    // For 404 errors, use Next.js notFound()
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    
    // For all other errors, rethrow to be caught by error boundary
    throw error;
  }
} 