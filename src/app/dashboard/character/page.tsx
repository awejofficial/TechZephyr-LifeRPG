'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { UserProfile, Task } from '@/types/game';
import { xpForLevel } from '@/lib/xp-engine';
import { getAttributeGuidance } from '@/lib/suggestions';
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
  Compass,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CharacterPage() {
  const { data: profileData } = useQuery<{ profile: UserProfile }>({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character');
      if (!res.ok) throw new Error('Failed to load profile');
      return res.json();
    },
  });

  const { data: tasksData } = useQuery<{ tasks: Task[] }>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to load tasks');
      return res.json();
    },
  });

  const profile = profileData?.profile;
  const username = profile?.username || 'Hero';
  const level = profile?.level ?? 1;
  const currentXp = profile?.current_xp ?? 0;
  const xpNeeded = xpForLevel(level);
  const xpPercent = Math.min(100, Math.max(0, (currentXp / xpNeeded) * 100));
  const totalXp = profile?.total_xp_earned ?? 0;

  const tasks = tasksData?.tasks || [];
  const completedCount = tasks.filter((t) => t.is_completed).length;
  const longestStreak = profile?.longest_streak ?? 0;

  // Real attribute calculations (base 10 + XP bonus)
  const intStat = 10 + Math.floor((profile?.intellect_xp || 0) / 10);
  const strStat = 10 + Math.floor((profile?.strength_xp || 0) / 10);
  const focusStat = 10 + Math.floor((profile?.creativity_xp || 0) / 10);
  const discStat = 10 + Math.floor((profile?.discipline_xp || 0) / 10);

  // Dynamic attribute guidance
  const guidance = getAttributeGuidance({
    intellect: intStat,
    strength: strStat,
    discipline: discStat,
    creativity: focusStat,
    social: 10 + Math.floor((profile?.social_xp || 0) / 10),
  });

  const rankTitle =
    level >= 20
      ? 'Legendary Grandmaster'
      : level >= 15
      ? 'Code Alchemist'
      : level >= 10
      ? 'Elite Vanguard'
      : level >= 5
      ? 'Adept Explorer'
      : 'Novice Adventurer';

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground tracking-tight">
          Character Dossier
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Your journey. Your stats. Your progression.
        </p>
      </div>

      {/* Main Grid: Portrait Card (Left) & Attributes / Stats (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Full Hero Card (5 Cols) */}
        <div className="lg:col-span-5 bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          {/* Portrait frame */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-primary/50 shadow-2xl mb-5 group bg-secondary">
            <Image
              src="/assets/game/avatar-alchemist.jpg"
              alt={username}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <h2 className="text-2xl font-display font-black text-foreground">{username}</h2>
          <p className="text-xs font-mono font-semibold text-primary mt-0.5">{rankTitle}</p>

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
        </div>

        {/* Right Column: Attributes & Stats (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Attributes Card */}
          <div className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-lg text-foreground">
                Core Attributes
              </h3>
              <span className="text-xs font-mono text-muted-foreground">Base 10 + Habit XP</span>
            </div>

            {/* Intelligence */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 font-bold text-cyan-400">
                  <div className="p-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <span>Intelligence</span>
                </div>
                <span className="font-bold text-foreground">{intStat}</span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/40">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (intStat / 50) * 100)}%` }}
                />
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
                <span className="font-bold text-foreground">{strStat}</span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/40">
                <div
                  className="h-full bg-rose-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (strStat / 50) * 100)}%` }}
                />
              </div>
            </div>

            {/* Focus / Creativity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 font-bold text-purple-400">
                  <div className="p-1 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <Crosshair className="w-3.5 h-3.5" />
                  </div>
                  <span>Focus & Creativity</span>
                </div>
                <span className="font-bold text-foreground">{focusStat}</span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/40">
                <div
                  className="h-full bg-purple-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (focusStat / 50) * 100)}%` }}
                />
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
                <span className="font-bold text-foreground">{discStat}</span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/40">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (discStat / 50) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Real Stats Overview Card */}
          <div className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl">
            <h3 className="font-display font-black text-lg text-foreground mb-4">
              Player Records
            </h3>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-background/50 border border-border/50">
                <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                  Total XP Earned
                </span>
                <div className="text-lg font-black font-display text-primary">
                  {totalXp.toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-background/50 border border-border/50">
                <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                  Quests Done
                </span>
                <div className="text-lg font-black font-display text-foreground">
                  {completedCount}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-background/50 border border-border/50">
                <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                  Best Streak
                </span>
                <div className="text-lg font-black font-display text-streak">
                  {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Hero Guidance Card */}
          {guidance && (
            <div className="bg-gradient-to-r from-primary/10 via-card/80 to-card/90 backdrop-blur-xl border border-primary/30 rounded-3xl p-5 shadow-xl flex items-start gap-4">
              <div className="p-2.5 rounded-2xl bg-primary/20 border border-primary/40 text-primary shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-display font-black text-sm text-foreground">
                    Hero Archetype Guidance
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase">
                    {guidance.recommendedCategory}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {guidance.advice}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
