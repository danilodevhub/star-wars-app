interface SearchButtonProps {
  variant: 'disabled' | 'enabled' | 'searching';
  onClick?: () => void;
}

export default function SearchButton({ variant, onClick }: SearchButtonProps) {
  const baseClasses = "h-[34px] min-h-[34px] w-full rounded-[20px] text-[14px] font-[700] tracking-normal leading-normal text-[#ffffff]";
  
  const variantClasses = {
    disabled: "border border-[var(--pinkish-grey)] bg-[var(--pinkish-grey)] cursor-not-allowed",
    enabled: "border border-[var(--green-teal)] bg-[var(--green-teal)] cursor-pointer hover:bg-[var(--emerald)] hover:border-[var(--emerald)] transition-colors",
    searching: "border border-[var(--green-teal)] bg-[var(--green-teal)] cursor-not-allowed"
  };

  return (
    <button
      type="submit"
      disabled={variant === 'disabled' || variant === 'searching'}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {variant === 'searching' ? 'SEARCHING...' : 'SEARCH'}
    </button>
  );
} 