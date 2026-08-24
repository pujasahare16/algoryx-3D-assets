import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-950/30 border border-red-800/30 mb-4">
        <AlertCircle className="h-5 w-5 text-red-400" />
      </div>
      <h3 className="text-[15px] font-medium text-neutral-300">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[13px] text-neutral-500 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-md border border-neutral-700 bg-neutral-800 px-3.5 py-1.5 text-[13px] font-medium text-neutral-300 transition-colors hover:text-white hover:bg-neutral-750"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
