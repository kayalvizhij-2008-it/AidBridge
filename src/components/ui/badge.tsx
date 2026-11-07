import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[#176B67]/20 bg-[#E8F3F0] text-[#176B67]',
        teal: 'border-transparent bg-[#176B67] text-white',
        navy: 'border-transparent bg-[#101D32] text-white',
        champagne: 'border-[#D8B77A]/40 bg-[#D8B77A]/15 text-[#96722C]',
        secondary: 'border-[#E4E8E5] bg-[#F5F3EC] text-[#101D32]',
        outline: 'border-[#E4E8E5] bg-white text-[#182536]',
        success: 'border-[#21845A]/30 bg-[#21845A]/10 text-[#21845A]',
        warning: 'border-[#D49A35]/30 bg-[#D49A35]/10 text-[#B87D1E]',
        destructive: 'border-[#C94C4C]/30 bg-[#C94C4C]/10 text-[#C94C4C]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
