'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface PebbleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  asymmetric?: 'left' | 'right' | 'uniform';
}

export const PebbleCard: React.FC<PebbleCardProps> = ({
  icon,
  title,
  description,
  asymmetric = 'left',
  className,
  children,
  ...props
}) => {
  const curveClasses = {
    left: 'rounded-[36px_14px_36px_14px]',
    right: 'rounded-[14px_36px_14px_36px]',
    uniform: 'rounded-[32px]',
  };

  return (
    <div
      className={cn(
        'bg-brand-surface border border-slate-100/80 p-8 sm:p-10 transition-all duration-300 hover:shadow-subtle hover:bg-brand-surface-alt/70 flex flex-col',
        curveClasses[asymmetric],
        className
      )}
      {...props}
    >
      {icon && (
        <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-brand-navy mb-6 shrink-0 border border-slate-100">
          {icon}
        </div>
      )}
      {title && <h3 className="text-xl font-bold text-brand-navy mb-2 tracking-tight">{title}</h3>}
      {description && <p className="text-sm text-slate-600 leading-relaxed">{description}</p>}
      {children}
    </div>
  );
};
