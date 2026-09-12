'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sword,
  Shield,
  Brain,
  Trophy,
  Flame,
  Coins,
  Sparkles,
  ArrowRight,
  Lock,
  Zap,
  Layers,
  Palette,
  CheckCircle2,
} from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'Server-Authoritative Anti-Cheat',
    description:
      'All XP calculations, level thresholds, and cooldowns are calculated strictly in PostgreSQL transactions. No client stat faking.',
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/20',
  },
  {
    icon: Trophy,
    title: 'Non-Linear 1.2× Level Curve',
    description:
      'Early levels reward rapid momentum, while master levels demand true persistence. Each tier requires exponential experience.',
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/20',
  },
  {
    icon: Flame,
    title: 'Consecutive Daily Streaks',
    description:
      'Stack daily activity to unlock up to +50% XP multipliers. Protect your flame with purchasable Streak Freeze relics.',
    color: 'text-streak',
    bg: 'bg-streak/10 border-streak/20',
  },
  {
    icon: Brain,
    title: 'Multi-Attribute Evolution',
    description:
      'Gym boosts Strength. Coding builds Intellect. Reading grows Discipline. Tailor your real-world character sheet.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Coins,
    title: 'Earn & Spend Virtual Gold',
    description:
      'Every completed quest mints currency. Unlock high-contrast Cyberpunk, Forest Ranger, and Solar Flare visual themes.',
    color: 'text-gold',
    bg: 'bg-gold/10 border-gold/20',
  },
  {
    icon: Zap,
    title: 'Instant Native Game Feel',
    description:
      'Tactile optimistic updates with instant rollback, spring physics, celebratory particle bursts, and zero network lag perception.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shadow-md">
              <Sword className="w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tight">LIFE RPG</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-md hover:bg-primary/90 transition-all glow-primary"
            >
              Start Your Quest
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-28 md:pb-36 px-4 sm:px-6 lg:px-8 text-center">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-gold/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Top Pill */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border text-xs font-bold text-muted-foreground mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Full-Stack Gamified Productivity & Habit Engine</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-foreground"
            >
              Turn Real Life Into An{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-gold">
                RPG Progression
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Complete real-world tasks. Earn verified experience points. Level up your Strength, Intellect, and Discipline.
              Sustain daily streaks and conquer procrastination with immediate feedback loops.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-black text-base shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 glow-primary active:scale-95"
              >
                <span>Embark on Your Quest</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-card border border-border text-foreground font-bold text-base hover:bg-secondary/70 transition-all flex items-center justify-center"
              >
                <span>Continue Save File</span>
              </Link>
            </motion.div>

            {/* Quick Metrics Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-sm"
            >
              <div className="p-2">
                <p className="text-2xl sm:text-3xl font-black text-primary font-mono">1.2×</p>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">Non-Linear Curve</p>
              </div>
              <div className="p-2">
                <p className="text-2xl sm:text-3xl font-black text-accent font-mono">5</p>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">Core Attributes</p>
              </div>
              <div className="p-2">
                <p className="text-2xl sm:text-3xl font-black text-streak font-mono">+50%</p>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">Max Streak Bonus</p>
              </div>
              <div className="p-2">
                <p className="text-2xl sm:text-3xl font-black text-gold font-mono">100%</p>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">Server Authenticated</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-secondary/20 border-y border-border/70 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-primary">The Progression Cycle</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mt-2">
                How Life RPG Works
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-2">
                A closed-loop gamified engine that bridges the delayed gratification gap of real-world productivity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-2xl p-6 relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-black text-lg mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-foreground">Log Real-World Quests</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  Map workouts to Strength, code reviews to Intellect, and habit routines to Discipline across customized difficulty tiers.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 relative">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-black text-lg mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-foreground">Earn Anti-Cheat XP</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  Fulfill quests with tactile click feedback. The server verifies cooldowns, computes streak multipliers, and triggers level-ups.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 relative">
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-black text-lg mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-foreground">Ascend & Customize</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  Spend earned gold on dynamic theme overrides (Cyberpunk, Forest, Solar), streak shields, and prestigious rank titles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-accent">Engine Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mt-2">
              Built for Gaming Immersion & Statistical Integrity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-all shadow-sm"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${feat.bg} ${feat.color} mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 text-center border-t border-border/70 bg-gradient-to-b from-card to-background">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Ready to Level Up Your Life?
            </h2>
            <p className="text-sm text-muted-foreground mt-3 mb-8">
              Join thousands of heroes conquering their goals with verifiable game mechanics.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-black text-base shadow-xl hover:bg-primary/90 transition-all glow-primary"
            >
              <span>Create Free Character</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 px-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Life RPG. Built for Hackathon Excellence with Supabase & Next.js.</p>
      </footer>
    </div>
  );
}
