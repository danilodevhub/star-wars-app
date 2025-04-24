export default function PersonDetailsLoading() {
  return (
    <div className="max-w-[800px] mx-auto p-[30px] bg-[#ffffff] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)]">
      {/* Name skeleton */}
      <div className="h-[24px] w-[200px] bg-[#e5e7eb] rounded animate-pulse mb-[30px]" />
      
      <div className="grid grid-cols-2 gap-[30px] mb-[30px]">
        <div>
          <h2 className="text-[18px] font-[700] mb-[15px]">Details</h2>
          <div className="space-y-[10px]">
            {/* Details skeletons */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[14px] w-[120px] bg-[#e5e7eb] rounded animate-pulse" />
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-[18px] font-[700] mb-[15px]">Movies</h2>
          <div className="space-y-[10px]">
            {/* Movie links skeletons */}
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[14px] w-[180px] bg-[#e5e7eb] rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Back button skeleton */}
      <div className="h-[34px] w-[120px] bg-[#e5e7eb] rounded animate-pulse" />
    </div>
  );
} 