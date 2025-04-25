import ApiErrorBoundary from '@/app/components/ApiErrorBoundary';

export default function DetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center w-full px-4">
      <ApiErrorBoundary>
        {children}
      </ApiErrorBoundary>
    </div>
  );
} 