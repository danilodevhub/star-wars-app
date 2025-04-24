import { fetchPersonDetails } from '@/app/lib/api';
import BackToSearchButton from '@/app/components/BackToSearchButton';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const person = await fetchPersonDetails(id);

  return (
    <div className="max-w-[800px] mx-auto p-[30px] bg-[#ffffff] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)]">
      <h1 className="text-[24px] font-[700] mb-[30px]">{person.name}</h1>
      
      <div className="grid grid-cols-2 gap-[30px] mb-[30px]">
        <div>
          <h2 className="text-[18px] font-[700] mb-[15px]">Details</h2>
          <div className="space-y-[10px] text-[14px]">
            <p>Birth Year: {person.birth_year}</p>
            <p>Gender: {person.gender}</p>
            <p>Eye Color: {person.eye_color}</p>
            <p>Hair Color: {person.hair_color}</p>
            <p>Height: {person.height}</p>
            <p>Mass: {person.mass}</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-[18px] font-[700] mb-[15px]">Movies</h2>
          <div className="space-y-[10px]">
            {person.films.map((film, index) => (
              <a
                key={index}
                href="#"
                className="block text-[14px] text-[var(--green-teal)] hover:text-[var(--emerald)] transition-colors"
              >
                {film}
              </a>
            ))}
          </div>
        </div>
      </div>

      <BackToSearchButton />
    </div>
  );
} 