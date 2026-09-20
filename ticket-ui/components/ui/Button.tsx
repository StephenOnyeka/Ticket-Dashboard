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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, leftIcon, children, className = '', disabled, ...props }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={`btn btn-${variant} btn-${size} ${isDisabled ? 'btn-disabled' : ''} ${className}`}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <span className="btn-spinner" aria-hidden="true" />
        ) : leftIcon ? (
          <span className="btn-icon">{leftIcon}</span>
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
