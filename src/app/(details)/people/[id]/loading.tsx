export default function PersonDetailsLoading() {
  return (
    <div className="w-[804px] max-h-[537px] mx-auto p-[30px] bg-[#ffffff] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)] overflow-auto flex flex-col">
      {/* Name skeleton */}
      <div className="h-[24px] w-[240px] bg-[#e5e7eb] rounded animate-pulse mb-[30px]" />
      
      <div className="grid grid-cols-2 gap-[30px] mb-[30px]">
        <div>
          {/* Details section */}
          <div className="text-[18px] font-[700] mb-[15px] border-b border-[var(--gainsboro)] pb-[5px] h-[24px] w-[80px] bg-[#e5e7eb] rounded animate-pulse" />
          <div className="space-y-[10px]">
            {/* Details skeletons */}
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="h-[16px] w-[80px] bg-[#e5e7eb] rounded animate-pulse mr-2" />
                <div className="h-[16px] w-[100px] bg-[#e5e7eb] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          {/* Movies section */}
          <div className="text-[18px] font-[700] mb-[15px] border-b border-[var(--gainsboro)] pb-[5px] h-[24px] w-[80px] bg-[#e5e7eb] rounded animate-pulse" />
          <div className="space-y-[10px]">
            {/* Movie links skeletons */}
            {Array.from({ length: 6 }).map((_, index) => (
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