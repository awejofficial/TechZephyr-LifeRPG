'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ShinyButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        {...props}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative rounded-xl px-7 py-3 font-display font-bold backdrop-blur-xl transition-all duration-300 ease-in-out hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]',
          'bg-gradient-to-r from-primary via-purple-500 to-accent text-white shadow-lg shadow-primary/25',
          className
        )}
      >
        <span
          className="relative block size-full text-sm uppercase tracking-wider font-mono text-white"
          style={{
            maskImage:
              'linear-gradient(-75deg,white calc(var(--x) + 20%),transparent calc(var(--x) + 30%),white calc(var(--x) + 100%))',
          }}
        >
          {children}
        </span>
        <span
          style={{
            mask: 'linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))',
            maskComposite: 'exclude',
          }}
          className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--primary)/10)_calc(var(--x)+20%),hsl(var(--primary)/50)_calc(var(--x)+25%),hsl(var(--primary)/10)_calc(var(--x)+100%))] p-px"
        />
      </motion.button>
    );
  }
);

ShinyButton.displayName = 'ShinyButton';
