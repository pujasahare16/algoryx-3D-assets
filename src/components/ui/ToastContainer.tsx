'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useToast, type ToastMessage } from '@/lib/hooks/useToast';
import { cn } from '@/lib/utils';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'border-emerald-800/50 bg-emerald-950/30',
  error: 'border-red-800/50 bg-red-950/30',
  info: 'border-blue-800/50 bg-blue-950/30',
};

const iconStyles = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-blue-400',
};

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={cn('flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg', styles[toast.type])}
    >
      <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', iconStyles[toast.type])} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-white">{toast.title}</p>
        {toast.description && (
          <p className="text-[12px] text-neutral-400 mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="shrink-0 text-neutral-500 hover:text-neutral-300 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
