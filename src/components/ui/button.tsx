import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gold';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variantStyles = {
      default:
        'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20',
      outline:
        'border border-border/60 bg-transparent hover:bg-card/80 hover:text-foreground text-foreground/90',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40',
      ghost:
        'hover:bg-card/60 hover:text-foreground text-muted-foreground',
      link:
        'text-primary underline-offset-4 hover:underline p-0 h-auto',
      gold:
        'bg-gold text-black font-semibold hover:bg-gold/90 shadow-lg shadow-gold/25',
    };

    const sizeStyles = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-8 px-3 text-xs rounded-md',
      lg: 'h-12 px-8 text-base rounded-xl',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
