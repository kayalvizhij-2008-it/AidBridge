'use client';

import React from 'react';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'navy' | 'glass' | 'outline' | 'ivory' | 'champagne' | 'ghost' | 'coral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  isLoading?: boolean;
  withArrow?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  isLoading = false,
  withArrow = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 rounded-lg gap-1.5 font-medium',
    md: 'text-sm px-5 py-2.5 rounded-xl gap-2 font-medium',
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 font-semibold',
    xl: 'text-lg px-8 py-4 rounded-2xl gap-3 font-semibold tracking-wide',
  }[size];

  const variantClasses = {
    primary:
      'relative overflow-hidden bg-[#176B67] hover:bg-[#135855] text-white shadow-sm hover:shadow-md border border-[#35A99A]/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200',
    navy:
      'relative overflow-hidden bg-[#101D32] hover:bg-[#1A2E4E] text-white shadow-sm hover:shadow-md border border-white/10 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200',
    glass:
      'bg-white/10 hover:bg-white/15 text-white backdrop-blur-md border border-white/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200',
    outline:
      'bg-transparent hover:bg-[#E8F3F0] text-[#101D32] border border-[#101D32]/30 hover:border-[#176B67] hover:text-[#176B67] active:scale-[0.98] transition-all duration-200',
    ivory:
      'bg-[#F5F3EC] hover:bg-[#E8F3F0] text-[#101D32] border border-[#E4E8E5] hover:border-[#176B67]/30 shadow-sm transition-all duration-200',
    champagne:
      'bg-[#D8B77A] hover:bg-[#CDA661] text-[#101D32] border border-[#D8B77A] shadow-sm transition-all duration-200 font-semibold',
    ghost:
      'bg-transparent hover:bg-[#E8F3F0] text-[#182536] hover:text-[#176B67] transition-all duration-200',
    coral:
      'bg-[#C94C4C] hover:bg-[#B33E3E] text-white shadow-sm transition-all duration-200',
  }[variant as string] || 'bg-[#176B67] text-white';

  const content = (
    <>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0">{icon}</span>
      ) : null}

      <span className="relative z-10">{children}</span>

      {!isLoading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}

      {!isLoading && withArrow && (
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}

      {/* Subtle shine sweep for primary and coral */}
      {(variant === 'primary' || variant === 'coral') && (
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      )}
    </>
  );

  const combinedClasses = cn(
    'group inline-flex items-center justify-center select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    sizeClasses,
    variantClasses,
    className
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
};

export default PremiumButton;
