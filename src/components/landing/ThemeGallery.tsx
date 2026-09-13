'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Badge } from '@/components/ui/badge';

const THEMES = [
  {
    name: 'Neon Default',
    description: 'Dark mode with radiant violet & cyan accents',
    colors: ['#08080c', '#8b5cf6', '#2dd4bf'],
    tag: 'Free',
    icon: '⚡',
  },
  {
    name: 'Cyberpunk',
    description: 'Hot pink & electric cyan on deep obsidian black',
    colors: ['#0a0004', '#f43f5e', '#06b6d4'],
    tag: '500 Gold',
    icon: '🌆',
  },
  {
    name: 'Forest Elf',
    description: 'Verdant greens, deep canopy & moss highlights',
    colors: ['#050805', '#22c55e', '#a3e635'],
    tag: '750 Gold',
    icon: '🌿',
  },
  {
    name: 'Retro Pixel',
    description: 'Warm 16-bit nostalgic console golden palette',
    colors: ['#1a1408', '#f2ae54', '#7fb069'],
    tag: '1000 Gold',
    icon: '🎮',
  },
];

export function ThemeGallery() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Theme cards stagger in from below
      gsap.from('.theme-card', {
        y: 60,
        opacity: 0,
        scale: 0.92,
        stagger: 0.12,
        duration: 0.8,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.themes-grid',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });

      // Section title reveal
      gsap.from('.gallery-title', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
        },
      });
    },
    { scope: ref }
  );

  return (
    <section id="themes" ref={ref} className="py-32 bg-card/20 border-t border-border/30 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-20 gallery-title">
          <Badge variant="outline" className="mb-4 text-gold border-gold/30 font-mono tracking-wider">
            🎨 AESTHETICS & COSMETICS
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-display font-black text-foreground">
            Earn Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-warning">
              Aesthetic
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Every theme is unlocked with Gold earned strictly from real-world questing. Your launcher
            style is verifiable proof of your effort.
          </p>
        </div>

        <div className="themes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {THEMES.map((theme, i) => (
            <div
              key={i}
              className="theme-card group relative rounded-2xl overflow-hidden border border-border/60 hover:border-primary/50 transition-all duration-300 hover:scale-[1.03] cursor-pointer shadow-xl shadow-black/40 bg-card/60 backdrop-blur-md"
            >
              {/* Theme preview with subtle animated gradient */}
              <div
                className="aspect-video relative overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]}44 60%, ${theme.colors[2]}33 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
                <div className="text-5xl transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                  {theme.icon}
                </div>
              </div>

              {/* Theme info */}
              <div className="p-5 bg-card/90">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {theme.name}
                  </h3>
                  <Badge
                    variant={theme.tag === 'Free' ? 'default' : 'secondary'}
                    className={`text-[11px] font-mono ${
                      theme.tag !== 'Free' ? 'text-gold border-gold/30 bg-gold/10' : ''
                    }`}
                  >
                    {theme.tag}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {theme.description}
                </p>

                {/* Color swatch dots */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/30">
                  <span className="text-[10px] font-mono text-muted-foreground/70 uppercase">
                    Palette:
                  </span>
                  <div className="flex gap-1.5">
                    {theme.colors.map((color, j) => (
                      <div
                        key={j}
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
