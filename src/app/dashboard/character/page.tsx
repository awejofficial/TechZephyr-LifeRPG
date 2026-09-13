'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { UserProfile } from '@/types/game';
import {
  Brain,
  Shield,
  Crosshair,
  Clock,
  Sword,
  Award,
  Sparkles,
  Trophy,
  Flame,
  Camera,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CharacterPage() {
  const { data } = useQuery<{ profile: UserProfile }>({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character');
      if (!res.ok) throw new Error('Failed to load profile');
      return res.json();
    },
  });

  const profile = data?.profile;
  const username = profile?.username || 'Awej';
  const level = profile?.level ?? 17;
  const currentXp = profile?.current_xp ?? 2840;
  const xpNeeded = 3200;
  const xpPercent = Math.min(100, Math.max(0, (currentXp / xpNeeded) * 100));
  const totalXp = profile?.total_xp_earned ?? 18420;

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header matching Reference */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground tracking-tight">
          Character
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Your journey. Your build.
        </p>
      </div>

      {/* Main Grid: Portrait Card (Left) & Attributes / Stats (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Full Hero Card (5 Cols) */}
        <div className="lg:col-span-5 bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          {/* Portrait frame */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-primary/50 shadow-2xl mb-5 group">
            <Image
              src="/assets/game/avatar-alchemist.jpg"
              alt="Character Portrait"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <h2 className="text-2xl font-display font-black text-foreground">{username}</h2>
          <p className="text-xs font-mono font-semibold text-primary mt-0.5">Code Alchemist</p>

          {/* Level & XP Meter */}
          <div className="w-full mt-4 p-3 rounded-2xl bg-background/50 border border-border/50">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-muted-foreground">Level {level}</span>
              <span className="font-bold text-foreground">
                {currentXp.toLocaleString()} / {xpNeeded.toLocaleString()} XP
              </span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border/40">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-cyan-400 to-primary"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Change Avatar Button */}
          <button
            type="button"
            className="mt-5 w-full py-2 px-4 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-xs font-mono font-bold border border-border/60 transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-3.5 h-3.5 text-primary" />
            <span>Change Avatar</span>
          </button>
        </div>

        {/* Right Column: Attributes & Stats (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Attributes Card matching Reference */}
          <div className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="font-display font-black text-lg text-foreground">Attributes</h3>

            {/* Intelligence */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 font-bold text-cyan-400">
                  <div className="p-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <span>Intelligence</span>
                </div>
                <span className="font-bold text-foreground">42</span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/40">
                <div className="h-full bg-cyan-400 rounded-full w-[84%]" />
              </div>
            </div>

            {/* Strength */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <div className="p-1 rounded-lg bg-rose-500/10 border border-rose-500/30">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span>Strength</span>
                </div>
                <span className="font-bold text-foreground">28</span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/40">
                <div className="h-full bg-rose-400 rounded-full w-[56%]" />
              </div>
            </div>

            {/* Focus */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 font-bold text-purple-400">
                  <div className="p-1 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <Crosshair className="w-3.5 h-3.5" />
                  </div>
                  <span>Focus</span>
                </div>
                <span className="font-bold text-foreground">35</span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/40">
                <div className="h-full bg-purple-400 rounded-full w-[70%]" />
              </div>
            </div>

            {/* Discipline */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <div className="p-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span>Discipline</span>
                </div>
                <span className="font-bold text-foreground">38</span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/40">
                <div className="h-full bg-amber-400 rounded-full w-[76%]" />
              </div>
            </div>
          </div>

          {/* Stats Overview Card matching Reference */}
          <div className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl">
            <h3 className="font-display font-black text-lg text-foreground mb-4">Stats</h3>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-background/50 border border-border/50">
                <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                  Total XP
                </span>
                <div className="text-lg font-black font-display text-primary">
                  {totalXp.toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-background/50 border border-border/50">
                <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                  Quests Done
                </span>
                <div className="text-lg font-black font-display text-foreground">37</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-background/50 border border-border/50">
                <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                  Best Streak
                </span>
                <div className="text-lg font-black font-display text-streak">28 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipped Loadout Bar matching Reference */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl">
        <h3 className="font-display font-black text-lg text-foreground mb-4">Equipped Loadout</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-background/50 border border-border/60">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Theme</span>
              <p className="text-xs font-bold text-foreground font-display">Cyber Theme</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-background/50 border border-border/60">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sword className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Weapon</span>
              <p className="text-xs font-bold text-foreground font-display">Code Sword</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-background/50 border border-border/60">
            <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Badge</span>
              <p className="text-xs font-bold text-foreground font-display">Early Builder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
