'use client';

import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps {
  name: string;
  className: string;
  background?: ReactNode;
  Icon: React.ElementType;
  description: string;
  href?: string;
  cta?: string;
  badge?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-5',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta = 'Explore System',
  badge,
}: BentoCardProps) {
  return (
    <div
      key={name}
      className={cn(
        'group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl',
        'bg-card/70 [box-shadow:0_0_0_1px_rgba(255,255,255,.05),0_2px_4px_rgba(0,0,0,.3),0_12px_24px_rgba(0,0,0,.4)]',
        'border border-border/60 hover:border-primary/50 transition-all duration-300 backdrop-blur-md',
        className
      )}
    >
      {/* Background visual or interactive graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-500">
        {background}
      </div>

      {/* Top content */}
      <div className="relative z-10 p-6 flex items-start justify-between">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 shadow-md">
          <Icon className="size-6" />
        </div>
        {badge && (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-background/80 border border-border/60 text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors">
            {badge}
          </span>
        )}
      </div>

      {/* Bottom info & description */}
      <div className="relative z-10 p-6 flex flex-col gap-2 bg-gradient-to-t from-background/95 via-background/80 to-transparent pt-10">
        <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
        {cta && (
          <div className="mt-2 flex items-center gap-1 text-xs font-mono font-semibold text-primary transition-all duration-200 group-hover:translate-x-1">
            <span>{cta}</span>
            <ArrowRight className="size-3.5" />
          </div>
        )}
      </div>

      {/* Ambient gradient overlay */}
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-primary/[0.03]" />
    </div>
  );
}
