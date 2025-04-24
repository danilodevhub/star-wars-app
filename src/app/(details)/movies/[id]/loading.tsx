export default function MovieDetailsLoading() {
  return (
    <div className="max-w-[800px] mx-auto p-[30px] bg-[#ffffff] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)]">
      {/* Title skeleton */}
      <div className="h-[28px] w-[200px] bg-[#e5e7eb] rounded animate-pulse mb-[30px]" />
      
      <div className="grid grid-cols-2 gap-[30px] mb-[30px]">
        <div>
          {/* Opening Crawl section */}
          <div className="h-[24px] w-[150px] bg-[#e5e7eb] rounded animate-pulse mb-[15px]" />
          <div className="space-y-[10px]">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="h-[14px] bg-[#e5e7eb] rounded animate-pulse"
                style={{ width: `${Math.random() * 30 + 70}%` }}
              />
            ))}
          </div>
        </div>
        
        <div>
          {/* Characters section */}
          <div className="h-[24px] w-[120px] bg-[#e5e7eb] rounded animate-pulse mb-[15px]" />
          <div className="space-y-[10px]">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="h-[14px] w-[140px] bg-[#e5e7eb] rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Back button skeleton */}
      <div className="h-[34px] w-[120px] bg-[#e5e7eb] rounded animate-pulse" />
    </div>
  );
} 