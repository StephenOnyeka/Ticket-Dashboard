import React, { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes } from 'react';

// ─────────────────────────────────────────────
//  Input Component
// ─────────────────────────────────────────────

const inputBase =
  'w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150';

const inputError = 'border-rose-500 dark:border-rose-500 focus:ring-rose-500';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              inputBase,
              leftIcon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5',
              error ? inputError : '',
              className,
            ].join(' ')}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

// ─────────────────────────────────────────────
//  Textarea Component
// ─────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || `textarea-${Math.random().toString(36).slice(2)}`;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={[
            inputBase,
            'px-4 py-2.5 resize-none',
            error ? inputError : '',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

// ─────────────────────────────────────────────
//  Select Component
// ─────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const inputId = id || `select-${Math.random().toString(36).slice(2)}`;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={[
          inputBase,
          'px-4 py-2.5 cursor-pointer',
          error ? inputError : '',
          className,
        ].join(' ')}
        {...props}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}
