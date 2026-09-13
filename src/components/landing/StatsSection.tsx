'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Badge } from '@/components/ui/badge';

const STATS = [
  { value: 42, suffix: 'K', label: 'Quests Completed', emoji: '⚔️' },
  { value: 8300, suffix: '+', label: 'Levels Gained', emoji: '🏆' },
  { value: 15400, suffix: '', label: 'Streak Days', emoji: '🔥' },
  { value: 99, suffix: '%', label: 'Would Recommend', emoji: '💜' },
];

const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    role: 'CS Student',
    quote:
      "I went from 'I'll study tomorrow' to a 45-day streak. The XP system makes me WANT to open my textbook.",
    stat: 'Level 18 • 45-day streak',
  },
  {
    name: 'Marcus T.',
    role: 'Software Engineer',
    quote:
      'The anti-cheat is what sold me. My stats are earned, not faked. It actually means something.',
    stat: 'Level 24 • Intellect 340',
  },
  {
    name: 'Elena R.',
    role: 'Fitness Enthusiast',
    quote:
      'My gym stats leveling up is more motivating than any fitness app I have tried. Strength 89 and climbing!',
    stat: 'Level 15 • Strength 89',
  },
];

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animated counters
      const counters = ref.current?.querySelectorAll<HTMLElement>('.stat-number');

      counters?.forEach((counter) => {
        const target = parseInt(counter.dataset.value || '0', 10);
        const suffix = counter.dataset.suffix || '';
        const obj = { value: 0 };

        gsap.to(obj, {
          value: target,
          duration: 2.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            counter.textContent = Math.floor(obj.value).toLocaleString() + suffix;
          },
        });
      });

      // Testimonial cards slide in
      gsap.from('.testimonial-card', {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.testimonials-grid',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: ref }
  );

  return (
    <section id="stats" ref={ref} className="py-32 bg-background border-t border-border/30 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-28">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-sm shadow-lg hover:border-primary/30 transition-colors"
            >
              <div className="text-3xl sm:text-4xl mb-3">{stat.emoji}</div>
              <div
                className="stat-number text-4xl sm:text-5xl lg:text-6xl font-display font-black text-primary font-mono"
                data-value={stat.value}
                data-suffix={stat.suffix}
              >
                0{stat.suffix}
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground uppercase tracking-widest font-mono">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials heading */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-3 text-gold border-gold/30 font-mono">
            ⭐ GUILD DISPATCHES
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-foreground">
            Players Are{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
              Winning
            </span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Real individuals conquering real life, one verified quest at a time.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="testimonial-card p-6 sm:p-7 rounded-2xl bg-card/60 border border-border/60 hover:border-primary/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/30 group hover:-translate-y-1"
            >
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-4 text-gold text-sm">
                  {'★★★★★'.split('').map((star, j) => (
                    <span key={j}>{star}</span>
                  ))}
                </div>

                <p className="text-foreground/90 leading-relaxed mb-6 text-sm sm:text-base italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div>
                  <p className="font-display font-bold text-sm sm:text-base text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-primary font-bold bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                    {t.stat}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
