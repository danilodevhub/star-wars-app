interface ResultsLayoutProps {
  children: React.ReactNode;
}

export default function ResultsLayout({ children }: ResultsLayoutProps) {
  return (
    <div className="w-[582px] h-[582px] bg-[#ffffff] p-[30px] rounded-[4px] shadow-[0_1px_2px_0_var(--warm-grey-75)] border border-[var(--gainsboro)]">
      <div className="h-full flex flex-col">
        <h2 className="text-[18px] font-[700] tracking-normal leading-normal text-black pb-[10px] border-b border-[var(--gainsboro)]">Results</h2>
        {children}
      </div>
    </div>
  );
} 