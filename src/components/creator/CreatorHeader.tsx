import type { ReactNode } from 'react';

interface CreatorHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function CreatorHeader({ title, description, action }: CreatorHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-neutral-800">
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-[13px] text-neutral-400 leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
