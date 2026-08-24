'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
}

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
}: ConfirmationModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      confirmRef.current?.focus();
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = '';
      };
    }
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-900 p-6 shadow-xl mx-4"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-300 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex gap-3">
              {variant === 'danger' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-950/50 border border-red-800/50">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>
              )}
              <div>
                <h3 className="text-[15px] font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-[13px] text-neutral-400 leading-relaxed">{description}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-md border border-neutral-700 bg-neutral-800 px-3.5 py-1.5 text-[13px] font-medium text-neutral-300 transition-colors hover:bg-neutral-750 hover:text-white"
              >
                {cancelLabel}
              </button>
              <button
                ref={confirmRef}
                onClick={() => { onConfirm(); onClose(); }}
                className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors ${
                  variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-teal-600 hover:bg-teal-500'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
