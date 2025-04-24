interface EmptyStateProps {
  message?: string | React.ReactNode;
}

export default function EmptyState({ message = <>
    There are zero matches.
    <br />
    Use the form to search for People or Movies.
  </> }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-[14px] font-[700] tracking-normal leading-normal text-[var(--pinkish-grey)] text-center">
        {message}
      </p>
    </div>
  );
} 