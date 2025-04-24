import { fetchPeople } from '@/app/lib/api';
import ResultsLayout from '@/app/components/ResultsLayout';
import EmptyState from '@/app/components/EmptyState';
import ListItem from '@/app/components/ListItem';

interface Person {
  name: string;
  height: string;
  mass: string;
  gender: string;
}

interface SearchParams {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function PeoplePage({ searchParams }: SearchParams) {
  const params = await searchParams;
  const query = params?.q || '';
  const people = await fetchPeople(query) as Person[];
  
  if (people.length === 0) {
    return (
      <ResultsLayout>
        <EmptyState />
      </ResultsLayout>
    );
  }

  return (
    <ResultsLayout>
      <div className="divide-y divide-[var(--gainsboro)]">
        {people.map((person) => (
          <ListItem key={person.name} text={person.name} />
        ))}
      </div>
    </ResultsLayout>
  );
} 