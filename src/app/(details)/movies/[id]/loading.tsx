export default function MovieDetailsLoading() {
  return (
    <div className="w-[804px] max-h-[537px] mx-auto p-[30px] bg-[#ffffff] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)] overflow-auto flex flex-col">
      {/* Title skeleton */}
      <div className="h-[24px] w-[280px] bg-[#e5e7eb] rounded animate-pulse mb-[30px]" />
      
      <div className="grid grid-cols-2 gap-[30px] mb-[30px]">
        <div>
          {/* Opening Crawl section */}
          <div className="text-[18px] font-[700] mb-[15px] border-b border-[var(--gainsboro)] pb-[5px] h-[24px] w-[150px] bg-[#e5e7eb] rounded animate-pulse" />
          <div className="space-y-[15px]">
            {/* Opening crawl skeleton paragraphs */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-[16px] bg-[#e5e7eb] rounded animate-pulse w-full" />
            ))}
          </div>
        </div>
        
        <div>
          {/* Characters section */}
          <div className="text-[18px] font-[700] mb-[15px] border-b border-[var(--gainsboro)] pb-[5px] h-[24px] w-[120px] bg-[#e5e7eb] rounded animate-pulse" />
          <div className="space-y-[10px]">
            {/* Character links skeletons */}
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="h-[16px] w-[180px] bg-[#e5e7eb] rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Back button skeleton */}
      <div className="mt-auto">
        <div className="h-[34px] w-[120px] bg-[#e5e7eb] rounded animate-pulse" />
      </div>
    </div>
  );
} 