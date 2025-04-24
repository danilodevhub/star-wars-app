import { fetchMovieDetails } from '@/app/lib/api';
import BackToSearchButton from '@/app/components/BackToSearchButton';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const movie = await fetchMovieDetails(id);

  return (
    <div className="max-w-[800px] mx-auto p-[30px] bg-[#ffffff] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)]">
      <h1 className="text-[24px] font-[700] mb-[30px]">{movie.title}</h1>
      
      <div className="grid grid-cols-2 gap-[30px] mb-[30px]">
        <div>
          <h2 className="text-[18px] font-[700] mb-[15px]">Opening Crawl</h2>
          <div className="space-y-[10px] text-[14px] whitespace-pre-line">
            {movie.opening_crawl}
          </div>
        </div>
        
        <div>
          <h2 className="text-[18px] font-[700] mb-[15px]">Characters</h2>
          <div className="space-y-[10px]">
            {movie.characters.map((character, index) => (
              <a
                key={index}
                href="#"
                className="block text-[14px] text-[var(--green-teal)] hover:text-[var(--emerald)] transition-colors"
              >
                {character}
              </a>
            ))}
          </div>
        </div>
      </div>

      <BackToSearchButton />
    </div>
  );
} 