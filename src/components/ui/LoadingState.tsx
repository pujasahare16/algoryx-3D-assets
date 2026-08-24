import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16', className)}>
      <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
      <p className="mt-3 text-[13px] text-neutral-500">{message}</p>
    </div>
  );
}

export function InlineLoader({ className }: { className?: string }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin text-neutral-400', className)} />;
}
