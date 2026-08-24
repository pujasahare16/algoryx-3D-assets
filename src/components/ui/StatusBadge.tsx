import { cn } from '@/lib/utils';
import type { AssetStatus, ApplicationStatus } from '@/lib/types';

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-neutral-800 text-neutral-300 border-neutral-700' },
  ready: { label: 'Ready', className: 'bg-teal-950/50 text-teal-400 border-teal-800/50' },
  submitted: { label: 'Submitted', className: 'bg-blue-950/50 text-blue-400 border-blue-800/50' },
  under_review: { label: 'Under Review', className: 'bg-amber-950/50 text-amber-400 border-amber-800/50' },
  approved: { label: 'Approved', className: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50' },
  published: { label: 'Published', className: 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50' },
  rejected: { label: 'Rejected', className: 'bg-red-950/50 text-red-400 border-red-800/50' },
  not_applied: { label: 'Not Applied', className: 'bg-neutral-800 text-neutral-400 border-neutral-700' },
};

interface StatusBadgeProps {
  status: AssetStatus | ApplicationStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium border leading-none',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
