'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';

// ─────────────────────────────────────────────
//  Button Component
// ─────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md shadow-indigo-600/25 border border-indigo-600 hover:border-indigo-700',
  secondary:
    'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700',
  ghost:
    'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-transparent dark:hover:bg-slate-800 dark:text-slate-300',
  danger:
    'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-md shadow-rose-600/25 border border-rose-600 hover:border-rose-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={[
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
          variantClasses[variant],
          sizeClasses[size],
          isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
          className,
        ].join(' ')}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <span
            className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
            aria-hidden="true"
          />
        ) : leftIcon ? (
          <span className="inline-flex items-center shrink-0">{leftIcon}</span>
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
