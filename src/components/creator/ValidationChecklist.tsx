'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { ValidationResult } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ValidationChecklistProps {
  results: ValidationResult[];
}

export default function ValidationChecklist({ results }: ValidationChecklistProps) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 divide-y divide-neutral-800">
      {results.map((result, i) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.1 }}
          className="flex items-center gap-3 px-4 py-3"
        >
          <div className="shrink-0">
            {result.status === 'pass' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            {result.status === 'fail' && <XCircle className="h-4 w-4 text-red-400" />}
            {result.status === 'pending' && <Loader2 className="h-4 w-4 text-neutral-500 animate-spin" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-[13px] font-medium',
              result.status === 'pass' ? 'text-neutral-200' :
              result.status === 'fail' ? 'text-red-300' :
              'text-neutral-400'
            )}>
              {result.label}
            </p>
            {result.detail && (
              <p className={cn(
                'text-[12px] mt-0.5',
                result.status === 'fail' ? 'text-red-400/80' : 'text-neutral-500'
              )}>
                {result.detail}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
