import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:mt-0.5 hover:opacity-90 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-[#176B67] text-white hover:bg-[#135855] shadow-sm',
        secondary: 'bg-[#F5F3EC] text-[#101D32] border border-[#101D32]/20 hover:bg-[#E8F3F0] hover:border-[#101D32]/40',
        navy: 'bg-[#101D32] text-white hover:bg-[#101D32]/90 shadow-sm',
        ghost: 'text-[#182536] hover:bg-[#E8F3F0] hover:text-[#176B67]',
        outline: 'border border-[#E4E8E5] bg-white text-[#182536] hover:bg-[#F5F3EC] hover:border-[#176B67]',
        destructive: 'bg-[#C94C4C] text-white hover:bg-[#b53f3f] shadow-sm',
        link: 'text-[#176B67] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 px-3.5 text-xs',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
