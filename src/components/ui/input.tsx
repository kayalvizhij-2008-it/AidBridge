import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-[#E4E8E5] bg-white px-3.5 py-2 text-sm text-[#182536] shadow-sm transition-all',
        'placeholder:text-[#64748B]/70 focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-[#176B67] focus-visible:border-[#176B67]',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F5F3EC]',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
