'use client';

import React from 'react';
import Link from 'next/link';
import { Sword, Shield, Brain, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Meteors } from '@/components/magicui/meteors';

interface AuthLayoutProps {
  children: React.ReactNode;
  activeTab: 'login' | 'signup';
}

export function AuthLayout({ children, activeTab }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden selection:bg-primary/30">
      {/* Left Column: Tactical Game Portal & Lore Hero (Hidden on small mobile, visible on lg) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-card/80 via-background to-card/40 border-r border-border/50 overflow-hidden">
        {/* Ambient Game Particles & Meteors */}
        <Meteors number={18} />

        {/* Ambient Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          }}
        />

        {/* Top: Brand Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center text-primary shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
              <Sword className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-black text-2xl tracking-tight text-foreground">
                LIFE<span className="text-primary">RPG</span>
              </span>
              <span className="ml-2 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Season 1: Awakening
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Tactical Game World Lore & Active Classes Preview */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NON-LINEAR EXPONENTIAL PROGRESSION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground leading-tight">
              Turn Daily Routines Into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-gold">
                Legendary Attributes
              </span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every completed quest grants cryptographic, server-verified XP. Level up your real
              character across Strength, Intellect, Discipline, and Creativity.
            </p>
          </div>

          {/* Mini Class Perk Matrix */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-card/60 border border-border/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>VANGUARD (Discipline)</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Morning focus protocols, habit streaks & deep work multipliers.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-card/60 border border-border/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-accent font-bold text-xs mb-1 font-mono">
                <Brain className="w-3.5 h-3.5" />
                <span>SCHOLAR (Intellect)</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Coding sprints, reading logs & cognitive skill masteries.
              </p>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="p-4 rounded-xl bg-background/50 border border-border/40 text-xs italic text-foreground/80 leading-relaxed font-sans">
            "The dopamine loop of video games, finally harnessed for real life. Level 24 Scholar and
            I haven't broken my streak in 45 days."
            <div className="mt-2 not-italic font-mono text-[10px] text-primary font-semibold">
              — Marcus T. • Software Engineer
            </div>
          </div>
        </div>

        {/* Bottom: Realm Telemetry HUD */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-border/40 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Realm Server: 99.9% Up</span>
          </div>
          <div className="text-right">
            <span>42K+ Quests Verified</span>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-12 relative overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Sword className="w-4 h-4" />
            </div>
            <span className="text-xl font-black tracking-tight text-foreground font-display">
              LIFE<span className="text-primary">RPG</span>
            </span>
          </Link>
          <p className="text-xs text-muted-foreground">Season 1: Awakening</p>
        </div>

        {/* Tactical Auth Card with BorderBeam */}
        <div className="w-full max-w-md relative">
          <div className="relative rounded-2xl bg-card/90 border border-border/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <BorderBeam size={220} duration={8} colorFrom="hsl(var(--primary))" colorTo="hsl(var(--accent))" />

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
