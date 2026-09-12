'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CTASection() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      router.push(`/signup?email=${encodeURIComponent(email.trim())}`);
    } else {
      router.push('/signup');
    }
  };

  useGSAP(
    () => {
      let split: any = null;

      try {
        split = new SplitText('.cta-title', { type: 'chars' });

        if (split.chars?.length) {
          gsap.from(split.chars, {
            y: 60,
            opacity: 0,
            stagger: 0.02,
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      } catch (err) {
        console.warn('CTA SplitText fallback:', err);
      }

      // Form slides up
      gsap.from('.cta-form', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
        },
      });

      return () => {
        if (split?.revert) split.revert();
      };
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="relative py-40 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background border-t border-border/30"
    >
      {/* Animated gradient blob */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--accent)) 60%, transparent 80%)',
        }}
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h2 className="cta-title text-4xl sm:text-5xl md:text-6xl font-display font-black mb-6 text-foreground tracking-tight">
          Your Journey{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            Starts Now
          </span>
        </h2>

        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
          The first quest is always the hardest. Let's make it the most rewarding.
        </p>

        <form
          className="cta-form flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={handleSubmit}
        >
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 flex-1 bg-card/60 backdrop-blur-md border-border/70 text-foreground placeholder:text-muted-foreground text-base focus-visible:ring-primary/60"
            aria-label="Email address"
          />
          <Button
            type="submit"
            size="lg"
            className="h-12 px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
          >
            Begin Your Quest ⚔️
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs sm:text-sm text-muted-foreground">
          <span>Free forever</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span>No credit card required</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span>Your data stays yours</span>
        </div>
      </div>
    </section>
  );
}
