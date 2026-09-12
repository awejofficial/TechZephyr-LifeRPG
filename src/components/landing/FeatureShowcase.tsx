'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Badge } from '@/components/ui/badge';
import { BorderBeam } from '@/components/magicui/border-beam';

const FEATURES = [
  {
    icon: '📈',
    title: 'Non-Linear Progression',
    description:
      'Each level demands more XP than the last. Early wins come fast to hook you. Mastery takes dedication to keep you.',
    accent: 'primary',
    code: 'xpForLevel(N) = 100 × 1.2^(N-1)',
    badge: 'EXPONENTIAL CURVE',
  },
  {
    icon: '💪',
    title: 'Five Attributes',
    description:
      'Gym builds Strength. Coding builds Intellect. Creative work builds Creativity. Your character reflects your real life.',
    accent: 'accent',
    code: 'Gym → STR+10 | Code → INT+4',
    badge: 'MULTI-CLASS STATS',
  },
  {
    icon: '🔥',
    title: 'Streak Protection',
    description:
      'Consecutive days earn XP multipliers. Miss a day? We understand. Streak freezes exist. Built for humans, not robots.',
    accent: 'warning',
    code: '30-day streak = +50% XP',
    badge: 'MOMENTUM ENGINE',
  },
  {
    icon: '💰',
    title: 'Virtual Economy',
    description:
      'Earn Gold from every quest. Spend it on themes, avatar accessories, and profile badges. Make the journey yours.',
    accent: 'gold',
    code: 'Epic Quest = 50 Gold',
    badge: 'SHOP REWARDS',
  },
  {
    icon: '🛡️',
    title: 'Anti-Cheat Engine',
    description:
      'All XP calculations run server-side. Rate limiting, task cooldowns, anomaly detection. Your stats are YOURS — earned, not faked.',
    accent: 'destructive',
    code: 'Client sends ID, server decides XP',
    badge: 'AUTHORITATIVE BACKEND',
  },
];

export function FeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const mm = gsap.matchMedia();

      // Desktop pinned horizontal scroll
      mm.add('(min-width: 768px)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('.feature-panel');

        const tween = gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            snap: 1 / (panels.length - 1),
            end: () => `+=${container.offsetWidth * (panels.length - 0.5)}`,
            anticipatePin: 1,
          },
        });

        panels.forEach((panel) => {
          gsap.from(panel.querySelectorAll('.panel-content > *'), {
            y: 45,
            opacity: 0,
            stagger: 0.1,
            duration: 0.7,
            scrollTrigger: {
              trigger: panel,
              start: 'left 65%',
              containerAnimation: tween,
            },
          });
        });
      });

      // Mobile: standard viewport fade
      mm.add('(max-width: 767px)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('.feature-panel');
        panels.forEach((panel) => {
          gsap.from(panel.querySelectorAll('.panel-content > *'), {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: {
              trigger: panel,
              start: 'top 80%',
            },
          });
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="systems"
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-background via-card/40 to-background border-t border-border/30"
    >
      {/* Section header (desktop sticky / mobile top) */}
      <div className="pt-16 pb-6 text-center z-10">
        <Badge variant="outline" className="mb-3 text-accent border-accent/30 font-mono">
          ⚙️ RPG MECHANICS
        </Badge>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-foreground">
          The Systems
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mt-2">
          Engineered for intrinsic motivation and lasting habits.
        </p>
      </div>

      {/* Horizontal panels container */}
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row md:h-[80vh] md:w-[500%] min-w-full"
      >
        {FEATURES.map((feature, i) => (
          <div
            key={i}
            className="feature-panel w-full md:w-screen md:h-full flex items-center justify-center py-16 px-4"
          >
            <div className="panel-content max-w-xl w-full mx-auto px-6 py-10 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-2xl shadow-black/40 text-center relative overflow-hidden group hover:border-primary/40 transition-colors">
              <BorderBeam size={220} duration={10} delay={i * 2} colorFrom="hsl(var(--primary))" colorTo="hsl(var(--accent))" />

              {/* Subtle top indicator */}
              <div className="inline-block mb-3 px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                {feature.badge}
              </div>

              {/* Big emoji */}
              <div className="text-6xl sm:text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-foreground">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-base sm:text-lg text-muted-foreground text-center leading-relaxed mb-8">
                {feature.description}
              </p>

              {/* "Code" snippet for tech credibility */}
              <div className="inline-block mx-auto px-4 sm:px-6 py-2.5 rounded-lg bg-background/80 border border-border font-mono text-xs sm:text-sm text-primary shadow-inner">
                {feature.code}
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-8">
                {FEATURES.map((_, j) => (
                  <div
                    key={j}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      j === i ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
