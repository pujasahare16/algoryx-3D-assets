import { CheckCircle2, Clock, Circle } from 'lucide-react';
import type { SubmissionTimelineEntry } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SubmissionTimelineProps {
  entries: SubmissionTimelineEntry[];
}

export default function SubmissionTimeline({ entries }: SubmissionTimelineProps) {
  return (
    <div className="relative" role="list" aria-label="Submission timeline">
      {entries.map((entry, i) => {
        const isLast = i === entries.length - 1;
        const isCompleted = !!entry.completedAt;

        return (
          <div key={entry.step} className="relative flex gap-4" role="listitem">
            {/* Line */}
            {!isLast && (
              <div
                className={cn(
                  'absolute left-[11px] top-6 w-px h-[calc(100%-8px)]',
                  isCompleted ? 'bg-teal-700/50' : 'bg-neutral-800'
                )}
              />
            )}

            {/* Icon */}
            <div className="relative z-10 shrink-0 mt-0.5">
              {isCompleted ? (
                <CheckCircle2 className="h-[22px] w-[22px] text-teal-500" />
              ) : entry.active ? (
                <Clock className="h-[22px] w-[22px] text-amber-500" />
              ) : (
                <Circle className="h-[22px] w-[22px] text-neutral-700" />
              )}
            </div>

            {/* Content */}
            <div className={cn('pb-8', isLast && 'pb-0')}>
              <p className={cn(
                'text-[14px] font-medium',
                isCompleted ? 'text-neutral-200' :
                entry.active ? 'text-amber-400' :
                'text-neutral-600'
              )}>
                {entry.label}
              </p>
              {entry.completedAt && (
                <p className="text-[12px] text-neutral-500 mt-0.5">
                  {new Date(entry.completedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
              {entry.active && !entry.completedAt && (
                <p className="text-[12px] text-amber-500/70 mt-0.5">In progress</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
