'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TickCircle, CloseCircle, InfoCircle } from 'iconsax-react';
import type { ToastMessage } from '@/lib/types';

// ─────────────────────────────────────────────
//  Toast Context
// ─────────────────────────────────────────────

interface ToastContextValue {
  showToast: (type: ToastMessage['type'], message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastConfig = {
  success: {
    container: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
    icon: <TickCircle size={18} variant="Bold" color="currentColor" />,
  },
  error: {
    container: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400',
    icon: <CloseCircle size={18} variant="Bold" color="currentColor" />,
  },
  info: {
    container: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-400',
    icon: <InfoCircle size={18} variant="Bold" color="currentColor" />,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const config = toastConfig[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                role="alert"
                className={[
                  'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-md text-sm font-semibold',
                  config.container,
                ].join(' ')}
              >
                <span className="shrink-0">{config.icon}</span>
                <span className="flex-1 text-xs">{toast.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
