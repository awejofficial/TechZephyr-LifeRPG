'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserProfile } from '@/types/game';
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
} from 'lucide-react';
import { motion } from 'framer-motion';

const WEEKLY_XP = [
  { day: 'Mon', xp: 240, height: '48%' },
  { day: 'Tue', xp: 380, height: '76%' },
  { day: 'Wed', xp: 310, height: '62%' },
  { day: 'Thu', xp: 450, height: '90%' },
  { day: 'Fri', xp: 500, height: '100%' },
  { day: 'Sat', xp: 350, height: '70%' },
  { day: 'Sun', xp: 280, height: '56%' },
];

export default function ProgressPage() {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('7D');

  const { data } = useQuery<{ profile: UserProfile }>({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character');
      if (!res.ok) throw new Error('Failed to load profile');
      return res.json();
    },
  });

  const profile = data?.profile;
  const level = profile?.level ?? 17;
  const currentXp = profile?.current_xp ?? 2840;
  const xpNeeded = 3200;
  const xpPercent = Math.min(100, Math.max(0, (currentXp / xpNeeded) * 100));

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header matching Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground tracking-tight">
            Progress
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track your growth. See how far you've come.
          </p>
        </div>

        {/* Timeframe Toggles */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border/70 shrink-0">
          {(['7D', '30D', '90D'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                timeframe === t
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Level Progress Banner matching Reference */}
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
            <span className="text-xs font-mono text-muted-foreground block">Next Milestone</span>
            <span className="text-sm font-bold font-mono text-cyan-400">
              Level {level + 1} (+{xpNeeded - currentXp} XP)
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

      {/* 3 KPI Cards matching Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card/85 backdrop-blur-xl border border-border/70 shadow-lg text-center">
          <span className="text-xs font-mono text-muted-foreground uppercase block mb-1">
            Total XP
          </span>
          <div className="text-2xl font-display font-black text-primary">18,420</div>
        </div>

        <div className="p-5 rounded-2xl bg-card/85 backdrop-blur-xl border border-border/70 shadow-lg text-center">
          <span className="text-xs font-mono text-muted-foreground uppercase block mb-1">
            Quests Completed
          </span>
          <div className="text-2xl font-display font-black text-foreground">37</div>
        </div>

        <div className="p-5 rounded-2xl bg-card/85 backdrop-blur-xl border border-border/70 shadow-lg text-center">
          <span className="text-xs font-mono text-muted-foreground uppercase block mb-1">
            Current Streak
          </span>
          <div className="text-2xl font-display font-black text-streak">12 days</div>
        </div>
      </div>

      {/* Analytics Deck: Attribute Growth (Left) & Weekly XP Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attribute Growth (6 Cols) */}
        <div className="lg:col-span-6 bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-display font-black text-base text-foreground">
            Attribute Growth
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Brain className="w-3.5 h-3.5" />
                <span>Intelligence</span>
              </div>
              <span className="font-bold text-foreground">42</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full w-[84%]" />
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>Strength</span>
              </div>
              <span className="font-bold text-foreground">28</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-rose-400 rounded-full w-[56%]" />
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Crosshair className="w-3.5 h-3.5" />
                <span>Focus</span>
              </div>
              <span className="font-bold text-foreground">35</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full w-[70%]" />
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Discipline</span>
              </div>
              <span className="font-bold text-foreground">38</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full w-[76%]" />
            </div>
          </div>
        </div>

        {/* Weekly XP Bar Chart (6 Cols) */}
        <div className="lg:col-span-6 bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-black text-base text-foreground">
              Weekly XP
            </h3>
            <span className="text-[11px] font-mono text-primary font-bold">
              2,470 XP Total
            </span>
          </div>

          {/* Bar Chart Visualization matching Reference */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-border/50">
            {WEEKLY_XP.map((bar, i) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  {bar.xp}
                </div>
                <div
                  className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-primary via-purple-500 to-cyan-400 transition-all duration-500 group-hover:brightness-125 shadow-md shadow-primary/20"
                  style={{ height: bar.height }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[11px] font-mono text-muted-foreground pt-2 px-2">
            {WEEKLY_XP.map((bar) => (
              <span key={bar.day} className="flex-1 text-center font-bold">
                {bar.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Inscription matching Reference */}
      <div className="text-center pt-4">
        <p className="text-xs font-mono text-muted-foreground/80 italic">
          "Consistency turns effort into results."
        </p>
      </div>
    </div>
  );
}
