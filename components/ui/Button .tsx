'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center transition-colors ' +
    'focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed rounded-xl';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm',
    secondary:
      'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500 shadow-sm',
    danger:
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm',
    outline:
      'border-2 border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 bg-white',
    ghost:
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm font-medium',
    md: 'px-4 py-2 text-base font-medium',
    lg: 'px-6 py-3 text-lg font-medium',
    xl: 'px-8 py-4 text-xl font-bold',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={[
        baseStyles,
        variants[variant],
        sizes[size],
        widthClass,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
};
