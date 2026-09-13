'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserProfile, Task } from '@/types/game';
import { xpForLevel } from '@/lib/xp-engine';
import {
  TrendingUp,
  Brain,
  Shield,
  Crosshair,
  Clock,
  Flame,
  CheckCircle2,
  Trophy,
  Calendar,
  Zap,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgressPage() {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('7D');

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
  const level = profile?.level ?? 1;
  const currentXp = profile?.current_xp ?? 0;
  const xpNeeded = xpForLevel(level);
  const xpPercent = Math.min(100, Math.max(0, (currentXp / xpNeeded) * 100));
  const totalXp = profile?.total_xp_earned ?? 0;
  const streak = profile?.current_streak ?? 0;

  const tasks = tasksData?.tasks || [];
  const completedTasks = tasks.filter((t) => t.is_completed);
  const completedCount = completedTasks.length;

  const intStat = 10 + Math.floor((profile?.intellect_xp || 0) / 10);
  const strStat = 10 + Math.floor((profile?.strength_xp || 0) / 10);
  const focusStat = 10 + Math.floor((profile?.creativity_xp || 0) / 10);
  const discStat = 10 + Math.floor((profile?.discipline_xp || 0) / 10);

  const streakMultiplier = (1 + Math.min(0.5, streak * 0.05)).toFixed(2);

  // Dynamic days calculation
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground tracking-tight">
            Progression Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track your real-time level progress, habit momentum, and stat scaling.
          </p>
        </div>

        {/* Streak Multiplier Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-streak/10 border border-streak/30 text-streak font-mono font-bold text-xs shadow-sm">
          <Flame className="w-4 h-4 fill-streak" />
          <span>{streakMultiplier}x XP Multiplier Active</span>
        </div>
      </div>

      {/* Main Level Progress Banner */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <h2 className="text-3xl font-display font-black text-foreground">
              Level {level}
            </h2>
            <p className="text-xs font-mono text-primary mt-0.5">
              {currentXp.toLocaleString()} / {xpNeeded.toLocaleString()} XP
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-muted-foreground block">Next Tier Target</span>
            <span className="text-sm font-bold font-mono text-cyan-400">
              Level {level + 1} ({Math.max(0, xpNeeded - currentXp)} XP Remaining)
            </span>
          </div>
        </div>

        <div className="h-3 w-full bg-secondary rounded-full overflow-hidden border border-border/50 mt-4">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 0.9 }}
          />
        </div>
      </div>

      {/* 3 Real KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card/85 backdrop-blur-xl border border-border/70 shadow-lg text-center">
          <span className="text-xs font-mono text-muted-foreground uppercase block mb-1">
            Total XP Earned
          </span>
          <div className="text-2xl font-display font-black text-primary">
            {totalXp.toLocaleString()}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card/85 backdrop-blur-xl border border-border/70 shadow-lg text-center">
          <span className="text-xs font-mono text-muted-foreground uppercase block mb-1">
            Quests Completed
          </span>
          <div className="text-2xl font-display font-black text-foreground">
            {completedCount}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card/85 backdrop-blur-xl border border-border/70 shadow-lg text-center">
          <span className="text-xs font-mono text-muted-foreground uppercase block mb-1">
            Current Streak
          </span>
          <div className="text-2xl font-display font-black text-streak">
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {/* Analytics Deck: Attribute Growth (Left) & Streak Guidance (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attribute Growth (6 Cols) */}
        <div className="lg:col-span-6 bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-base text-foreground">
              Attribute Ratings
            </h3>
            <span className="text-xs font-mono text-muted-foreground">Level 1 Base: 10</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Brain className="w-3.5 h-3.5" />
                <span>Intelligence</span>
              </div>
              <span className="font-bold text-foreground">{intStat}</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (intStat / 50) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>Strength</span>
              </div>
              <span className="font-bold text-foreground">{strStat}</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (strStat / 50) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Crosshair className="w-3.5 h-3.5" />
                <span>Focus</span>
              </div>
              <span className="font-bold text-foreground">{focusStat}</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (focusStat / 50) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Discipline</span>
              </div>
              <span className="font-bold text-foreground">{discStat}</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (discStat / 50) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Motivational Streak & Level Calculator (6 Cols) */}
        <div className="lg:col-span-6 bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-black text-base text-foreground">
                Level Catalyst & Streak Mechanics
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every day you complete at least one active quest, your daily streak increases by 1 and grants a +5% cumulative XP boost on all future quest completions (capped at +50%).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-background/60 border border-border/60 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Streak Bonus</span>
              <span className="text-streak font-bold">+{Math.round((parseFloat(streakMultiplier) - 1) * 100)}% XP</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Milestone Status</span>
              <span className="text-cyan-400 font-bold">
                {currentXp >= xpNeeded ? 'Ready to Level Up!' : `${xpNeeded - currentXp} XP to Level ${level + 1}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Daily Loot Chest</span>
              <span className="text-gold font-bold">
                {completedCount >= 3 ? 'Unlocked 🎁' : `${Math.min(completedCount, 3)}/3 completed today`}
              </span>
            </div>
          </div>

          <p className="text-xs font-mono text-muted-foreground text-center italic">
            "Small habits repeated daily compound into monumental power."
          </p>
        </div>
      </div>
    </div>
  );
}
