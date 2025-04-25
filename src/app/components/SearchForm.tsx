'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import SearchButton from '@/app/components/SearchButton';

export default function SearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [searchType, setSearchType] = useState<'people' | 'movies'>(
    pathname.includes('/movies') ? 'movies' : 'people'
  );
  const [inputText, setInputText] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setInputText(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    setSearchType(pathname.includes('/movies') ? 'movies' : 'people');
  }, [pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedText = inputText.trim();
    if (!trimmedText) return;

    // Construct the search path
    const path = searchType === 'people' ? '/people' : '/movies';
    
    // Safely encode the query parameter
    const encodedQuery = encodeURIComponent(trimmedText);
    const url = `${path}?q=${encodedQuery}`;
        
    startTransition(() => {
      router.push(url);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-[400px] h-[230px] bg-[#ffffff] p-[30px] gap-[20px] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)]">
      <label className="text-[14px] h-[20px] font-bold tracking-normal leading-normal text-[#383838]">What are you searching for?</label>
      
      <div className="flex gap-[30px]">
        <label className="flex items-center">
          <input 
            type="radio" 
            name="searchType" 
            value="people" 
            checked={searchType === 'people'}
            onChange={(e) => setSearchType(e.target.value as 'people' | 'movies')}
            className="mr-[1px]" 
          />
          <span className="text-[14px] font-bold tracking-normal leading-normal text-black">People</span>
        </label>
        <label className="flex items-center">
          <input 
            type="radio" 
            name="searchType" 
            value="movies" 
            checked={searchType === 'movies'}
            onChange={(e) => setSearchType(e.target.value as 'people' | 'movies')}
            className="mr-[1px]" 
          />
          <span className="text-[14px] font-bold tracking-normal leading-normal text-black">Movies</span>
        </label>
      </div>

      <input
        type="text"
        name="searchText"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={searchType === 'people' 
          ? "e.g. Chewbacca, Yoda, Boba Fett"
          : "e.g. A New Hope, Empire Strikes Back, Return of the Jedi"}
        className="h-[40px] min-h-[40px] px-[10px] rounded-[4px] shadow-[inset_0_1px_3px_0_var(--warm-grey-75)] border border-[var(--pinkish-grey)] bg-white text-[14px] font-[700] tracking-normal leading-normal focus:border-[#383838] focus:outline-none focus:shadow-[inset_0_1px_3px_0_var(--warm-grey-75)] placeholder:text-[var(--pinkish-grey)]"
      />

      <SearchButton 
        variant={inputText.trim().length > 1 ? (isPending ? 'searching' : 'enabled') : 'disabled'} 
      />
    </form>
  );
} 