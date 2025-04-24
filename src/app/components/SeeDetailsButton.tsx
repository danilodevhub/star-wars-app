'use client';

interface SeeDetailsButtonProps {
  onClick: () => void;
}

export default function SeeDetailsButton({ onClick }: SeeDetailsButtonProps) {
  const baseClasses = "h-[34px] min-h-[34px] px-[20px] rounded-[20px] text-[14px] font-[700] tracking-normal leading-normal text-[#ffffff]";
  const buttonClasses = "border border-[var(--green-teal)] bg-[var(--green-teal)] cursor-pointer hover:bg-[var(--emerald)] hover:border-[var(--emerald)] transition-colors";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${buttonClasses}`}
    >
      SEE DETAILS
    </button>
  );
} 