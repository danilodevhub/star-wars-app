import React from 'react';
import { fetchPersonDetails } from '@/app/lib/internalapi-client';
import BackToSearchButton from '@/app/components/BackToSearchButton';
import { ApiError } from '@/app/lib/swapi-client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createLogger } from '@/app/lib/logger';
import { Person } from '@/app/types/person';

// Create a logger for this page
const logger = createLogger('PersonDetails');

// Preserving the original params approach with Promise
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonDetailsPage({ params }: PageProps) {
  // Using await to resolve params as per your preference
  const id = (await params).id;

  try {
    logger.debug(`Loading person details: ${id}`);
    
    const person = await fetchPersonDetails(id) as Person;

    return (
      <div className="w-[804px] max-h-[537px] mx-auto p-[30px] bg-[#ffffff] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)] overflow-auto flex flex-col">
        <h1 className="text-[24px] font-[700] mb-[30px]">{person.name}</h1>
        
        <div className="grid grid-cols-2 gap-[30px] mb-[30px]">
          <div>
            <h2 className="text-[18px] font-[700] mb-[15px] border-b border-[var(--gainsboro)] pb-[5px]">Details</h2>
            <p className="text-[16px]">Birth Year: {person.birth_year}</p>
            <p className="text-[16px]">Gender: {person.gender}</p>
            <p className="text-[16px]">Eye Color: {person.eye_color}</p>
            <p className="text-[16px]">Hair Color: {person.hair_color}</p>
            <p className="text-[16px]">Height: {person.height}</p>
            <p className="text-[16px]">Mass: {person.mass}</p>
          </div>
          
          <div>
            <h2 className="text-[18px] font-[700] mb-[15px] border-b border-[var(--gainsboro)] pb-[5px]">Movies</h2>
            {person.films && person.films.length > 0 ? (
              <div>
                {person.films.map((film: { uid: string; title: string }) => (
                  <Link 
                    key={film.uid}
                    href={`/movies/${film.uid}`}
                    className="block text-[16px] text-[var(--green-teal)] hover:text-[var(--emerald)] transition-colors"
                  >
                    {film.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[16px] text-[#999999]">No films available</p>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <BackToSearchButton />
        </div>
      </div>
    );
  } catch (error) {
    logger.error('Error in PersonDetailsPage:', error);
    
    // For 404 errors, use Next.js notFound()
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    
    // For all other errors, rethrow to be caught by error boundary
    throw error;
  }
} 