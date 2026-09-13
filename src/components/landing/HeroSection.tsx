'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Meteors } from '@/components/magicui/meteors';

export function HeroSection() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
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
      const container = containerRef.current;
      if (!container) return;

      // Split title characters and subtitle lines
      let titleSplit: any = null;
      let subtitleSplit: any = null;

      try {
        titleSplit = new SplitText('.hero-title', { type: 'chars' });
        subtitleSplit = new SplitText('.hero-subtitle', { type: 'lines' });

        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        // Title chars cascade in
        if (titleSplit.chars?.length) {
          tl.from(titleSplit.chars, {
            y: 120,
            opacity: 0,
            rotateX: -90,
            stagger: 0.03,
            duration: 1.2,
          });
        }

        // Subtitle lines slide up
        if (subtitleSplit.lines?.length) {
          tl.from(
            subtitleSplit.lines,
            {
              y: 30,
              opacity: 0,
              stagger: 0.2,
              duration: 0.8,
            },
            '-=0.6'
          );
        }

        // Signup form pops in
        tl.from(
          '.hero-signup',
          {
            y: 40,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            ease: 'back.out(1.4)',
          },
          '-=0.4'
        )
          // Trust indicators fade in
          .from(
            '.hero-trust',
            {
              opacity: 0,
              y: 20,
              stagger: 0.1,
              duration: 0.6,
            },
            '-=0.3'
          );
      } catch (err) {
        console.warn('SplitText animation fallback:', err);
      }

      // === SCROLL PARALLAX: Content moves up on scroll ===
      gsap.to('.hero-content', {
        y: -150,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom 20%',
          scrub: 0.5,
        },
      });

      // === FLOATING XP ORBS (ambient, infinite) ===
      gsap.to('.xp-orb', {
        y: 'random(-40, 40)',
        x: 'random(-30, 30)',
        duration: 'random(3, 6)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.3, from: 'random' },
      });

      // === XP ORBS REACT TO MOUSE ===
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        gsap.to('.xp-orb', {
          x: (clientX - window.innerWidth / 2) * 0.02,
          y: (clientY - window.innerHeight / 2) * 0.02,
          duration: 0.5,
          ease: 'power2.out',
        });
      };

      container.addEventListener('mousemove', handleMouseMove);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        if (titleSplit?.revert) titleSplit.revert();
        if (subtitleSplit?.revert) subtitleSplit.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-24"
    >
      {/* === BACKGROUND LAYERS === */}

      {/* Animated grid (gives "game world" feel) */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
        }}
      />

      {/* Radial ambient glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Ambient Meteors */}
      <Meteors number={16} />

      {/* Floating XP orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="xp-orb absolute rounded-full shadow-[0_0_12px_rgba(139,92,246,0.6)]"
            style={{
              width: `${4 + (i % 4) * 3}px`,
              height: `${4 + (i % 4) * 3}px`,
              left: `${(i * 73 + 11) % 96}%`,
              top: `${(i * 59 + 17) % 88}%`,
              background:
                i % 3 === 0
                  ? 'hsl(var(--primary))'
                  : i % 3 === 1
                  ? 'hsl(var(--accent))'
                  : 'hsl(var(--gold))',
              opacity: 0.35 + (i % 3) * 0.25,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
      </div>

      {/* Vignette (focuses attention on center) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background pointer-events-none" />

      {/* === CONTENT === */}
      <div className="hero-content relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge above title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <span>⚔️</span> The Habit Tracker That Doesn't Suck
        </motion.div>

        {/* Main title */}
        <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black leading-[0.95] tracking-tight text-foreground">
          Your Life
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient">
            is a Game
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Every task you complete earns XP. Every habit builds your stats. Stop surviving your
          to-do list — start leveling up your life.
        </p>

        {/* === SIGNUP FORM WITH BORDER BEAM === */}
        <div className="hero-signup relative mt-10 max-w-lg mx-auto p-1 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/60 shadow-2xl">
          <BorderBeam size={180} duration={8} colorFrom="hsl(var(--primary))" colorTo="hsl(var(--accent))" />
          <form
            className="flex flex-col sm:flex-row gap-2.5 p-2"
            onSubmit={handleSubmit}
          >
            <Input
              type="email"
              placeholder="Enter your hero email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 flex-1 bg-background/70 border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/60 text-sm sm:text-base rounded-xl"
              aria-label="Email address"
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 px-7 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] rounded-xl whitespace-nowrap"
            >
              Start Questing →
            </Button>
          </form>
        </div>

        {/* Trust indicators */}
        <div className="hero-trust mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-base">🆓</span> Free forever
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-base">⚡</span> No credit card
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-base">🔒</span> Your data stays yours
          </span>
        </div>
      </div>

      {/* === SCROLL INDICATOR === */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-1.5 text-muted-foreground/70">
          <span className="text-[11px] uppercase font-mono tracking-widest text-muted-foreground">
            Scroll to explore
          </span>
          <div className="w-5 h-9 rounded-full border-2 border-border/80 flex justify-center pt-2 bg-card/40 backdrop-blur-sm">
            <div className="w-1 h-2.5 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
