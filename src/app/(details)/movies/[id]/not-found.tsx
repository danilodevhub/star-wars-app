import Link from 'next/link';

export default function MovieNotFound() {
  return (
    <div className="max-w-[800px] mx-auto p-[30px] bg-[#ffffff] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)] flex flex-col items-center">
      <h1 className="text-[24px] font-[700] mb-[15px] text-center">Movie Not Found</h1>
      
      <p className="text-[16px] mb-[30px] text-center">
        The Star Wars movie you're looking for could not be found.
        <br />
        It might be in a galaxy far, far away...
      </p>
      
      <Link 
        href="/movies"
        className="h-[34px] min-h-[34px] px-[20px] rounded-[20px] text-[14px] font-[700] tracking-normal leading-normal text-[#ffffff] border border-[var(--green-teal)] bg-[var(--green-teal)] cursor-pointer hover:bg-[var(--emerald)] hover:border-[var(--emerald)] transition-colors flex items-center justify-center"
      >
        Back to Search
      </Link>
    </div>
  );
} 