'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'pill-primary' | 'pill-secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

    const sizeClasses = {
      sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5',
      md: 'text-sm px-5 py-2.5 rounded-full gap-2',
      lg: 'text-base px-6 py-3.5 rounded-full gap-2.5',
    };

    const variantClasses = {
      primary: 'bg-brand-teal text-white hover:bg-brand-teal-hover shadow-sm hover:shadow',
      'pill-primary': 'bg-brand-teal text-white hover:bg-brand-teal-hover shadow-sm rounded-full',
      secondary: 'bg-brand-surface text-brand-navy hover:bg-brand-surface-alt border border-brand-border',
      'pill-secondary': 'bg-white text-brand-navy hover:bg-slate-50 border border-slate-200 rounded-full shadow-xs',
      outline: 'bg-transparent text-brand-navy border border-slate-300 hover:bg-slate-50',
      ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
