import React, { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes } from 'react';

// ─────────────────────────────────────────────
//  Input Component
// ─────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
    return (
      <div className="form-field">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <div className="form-input-wrapper">
          {leftIcon && <span className="form-input-icon">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`form-input ${leftIcon ? 'form-input-with-icon' : ''} ${error ? 'form-input-error' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
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
      <div className="form-field">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`form-input form-textarea ${error ? 'form-input-error' : ''} ${className}`}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
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
    <div className="form-field">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`form-input form-select ${error ? 'form-input-error' : ''} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
