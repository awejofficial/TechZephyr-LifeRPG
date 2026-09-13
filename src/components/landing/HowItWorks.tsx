'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Badge } from '@/components/ui/badge';

const STEPS = [
  {
    number: '01',
    title: 'Add Your Quests',
    description:
      'Your gym session, that coding tutorial, calling your mom — every real task becomes a quest with XP, difficulty, and stat rewards.',
    emoji: '📝',
    stat: 'Discipline +4',
    example: 'Read 20 pages → 🧠 Intellect +2',
    accentColor: 'hsl(var(--primary))',
  },
  {
    number: '02',
    title: 'Complete. Get Rewarded.',
    description:
      'The instant you check it off, the celebration begins. XP bar fills, gold drops, stats tick up. The dopamine games perfected, now working for YOU.',
    emoji: '⚡',
    stat: '+20 XP',
    example: "The checkmark isn't just gray — it EXPLODES",
    accentColor: 'hsl(var(--gold))',
  },
  {
    number: '03',
    title: 'Level Up Your Life',
    description:
      'Watch your character grow. Strength from workouts. Intellect from study sessions. Every day of consistency builds your streak.',
    emoji: '🏆',
    stat: 'Level 12',
    example: '30-day streak = +50% XP multiplier',
    accentColor: 'hsl(var(--accent))',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Each step card animates in as it enters viewport
      STEPS.forEach((_, i) => {
        const step = `.step-card-${i}`;
        const visual = `.step-visual-${i}`;

        // Card slides in from left/right
        gsap.from(step, {
          x: i % 2 === 0 ? -60 : 60,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        });

        // Visual element scales in with a bounce
        gsap.from(visual, {
          scale: 0.8,
          opacity: 0,
          rotate: i % 2 === 0 ? -6 : 6,
          duration: 0.8,
          delay: 0.15,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: step,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Connector line draws between steps
      gsap.fromTo(
        '.connector-line',
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: '.steps-container',
            start: 'top 70%',
            end: 'bottom 75%',
            scrub: 1,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="relative py-32 bg-gradient-to-b from-background via-card/25 to-background overflow-hidden border-t border-border/30"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <div className="text-center mb-24">
          <Badge variant="outline" className="mb-4 text-primary border-primary/30 font-mono tracking-wider">
            ⚔️ HOW IT WORKS
          </Badge>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-center text-foreground tracking-tight">
            Three Steps to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
              Victory
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            A frictionless loop designed to turn executive dysfunction into habitual momentum.
          </p>
        </div>

        {/* Steps with connector line */}
        <div className="steps-container relative">
          {/* Vertical connector line */}
          <div className="connector-line absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary via-accent to-primary hidden md:block opacity-60 pointer-events-none" />

          <div className="space-y-24">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={`step-card-${i} relative flex flex-col ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center gap-10 lg:gap-16`}
              >
                {/* Step Visual Mockup */}
                <div className={`step-visual-${i} w-full md:w-1/2`}>
                  <div className="relative aspect-[16/10] rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl overflow-hidden p-6 shadow-2xl shadow-black/40 group hover:border-primary/40 transition-colors">
                    {/* Glowing highlight in corner */}
                    <div
                      className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
                      style={{ backgroundColor: step.accentColor }}
                    />

                    {/* Window header */}
                    <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-6">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                        MISSION_PROTOCOL_0{i + 1}
                      </span>
                    </div>

                    {/* Mockup content */}
                    <div className="flex flex-col items-center justify-center text-center py-4">
                      <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {step.emoji}
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold border border-primary/20 shadow-sm">
                        <span>✨</span>
                        {step.stat}
                      </div>
                      <p className="mt-4 text-xs font-mono text-muted-foreground/90 max-w-[260px] bg-background/50 px-3 py-1.5 rounded border border-border/30">
                        {step.example}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step content */}
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-6xl lg:text-7xl font-display font-black text-primary/15 font-mono select-none">
                      {step.number}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg max-w-md">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
