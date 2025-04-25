import { fetchPeople } from '@/app/lib/internalapi-client';
import ResultsContainer from '@/app/components/ResultsContainer';
import EmptyState from '@/app/components/EmptyState';
import ListItem from '@/app/components/ListItem';
import { Person } from '@/app/types/person';
import { createLogger } from '@/app/lib/logger';
const logger = createLogger('PeoplePage');

interface SearchParams {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function PeoplePage({ searchParams }: SearchParams) {
  const params = await searchParams;
  const query = params?.q || '';
  
  // Fetch people data with error handling
  let people: Person[] = [];
  try {
    people = await fetchPeople(query) as Person[];
  } catch (fetchError) {
    logger.error('Failed to fetch people', fetchError);
    return (
      <ResultsContainer>
        <EmptyState message="Error loading data. Please try again." />
      </ResultsContainer>
    );
  }
  
  // Handle empty results
  if (people.length === 0) {
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
        {people.map((person) => (
          <ListItem 
            key={person.uid} 
            text={person.name} 
            id={person.uid} 
          />
        ))}
      </div>      
    </ResultsContainer>
  );
} 