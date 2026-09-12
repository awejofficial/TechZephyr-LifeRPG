'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { UserProfile } from '@/types/game';
import { Trophy, Flame, Coins, Shield } from 'lucide-react';
import { xpForLevel } from '@/lib/xp-engine';

export function StatsHUD({ initialProfile }: { initialProfile?: UserProfile }) {
  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character');
      if (!res.ok) throw new Error('Failed to fetch character profile');
      const data = await res.json();
      return data.profile;
    },
    initialData: initialProfile,
    refetchInterval: 10000,
  });

  const level = profile?.level ?? 1;
  const currentXp = profile?.current_xp ?? 0;
  const xpNeeded = xpForLevel(level);
  const xpPercent = Math.min(100, Math.max(0, (currentXp / xpNeeded) * 100));
  const gold = profile?.gold ?? 0;
  const streak = profile?.current_streak ?? 0;

  return (
    <header className="sticky top-0 z-30 w-full bg-card/85 backdrop-blur-md border-b border-border/70 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Level and Character Name (Links to Character Sheet) */}
        <Link
          href="/dashboard/character"
          className="flex items-center gap-2.5 group rounded-xl p-1 -m-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-transform hover:scale-[1.02]"
          title="View Character Profile"
          aria-label={`Character Profile: ${profile?.username || 'Hero'}, Level ${level}`}
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-black text-primary-foreground shadow-md group-hover:shadow-primary/30 transition-shadow">
              <span className="text-sm font-black">L{level}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-border">
              <Shield className="w-3.5 h-3.5 text-accent" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-foreground truncate max-w-[130px] sm:max-w-[180px] group-hover:text-primary transition-colors">
                {profile?.username || 'Hero'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">
                Tier {Math.floor((level - 1) / 5) + 1}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Total XP: {profile?.total_xp_earned?.toLocaleString() ?? 0}
            </p>
          </div>
        </Link>

        {/* Center: Animated XP Bar */}
        <div className="flex-1 max-w-md min-w-[200px] order-3 sm:order-2">
          <div className="flex justify-between items-center text-xs mb-1 font-mono">
            <span className="text-muted-foreground font-semibold flex items-center gap-1">
              <Trophy className="w-3 h-3 text-primary" /> XP Progress
            </span>
            <span className="text-foreground font-bold">
              {currentXp} <span className="text-muted-foreground font-normal">/ {xpNeeded}</span>
            </span>
          </div>
          <div
            className="relative h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/50 shadow-inner"
            role="progressbar"
            aria-valuenow={currentXp}
            aria-valuemin={0}
            aria-valuemax={xpNeeded}
            aria-label={`XP Progress: ${currentXp} out of ${xpNeeded}`}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ type: 'spring', stiffness: 90, damping: 15 }}
            />
          </div>
        </div>

        {/* Right side: Gold & Streak Badges */}
        <div className="flex items-center gap-2 order-2 sm:order-3 shrink-0">
          {/* Streak Flame */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-streak/10 border border-streak/30 text-streak font-bold text-sm shadow-sm shrink-0"
            title={`${streak} Day Streak!`}
            aria-label={`${streak} Day Streak`}
          >
            <motion.div
              animate={{ scale: [1, 1.18, 1], rotate: [0, 4, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            >
              <Flame className="w-4 h-4 fill-streak text-streak" />
            </motion.div>
            <span className="font-mono">{streak}d</span>
          </div>

          {/* Gold Balance (Links to Shop) */}
          <Link
            href="/dashboard/shop"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 border border-gold/30 text-gold font-bold text-sm shadow-sm shrink-0 hover:bg-gold/20 transition-all focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            title={`${gold} Gold Coins - Visit Shop`}
            aria-label={`${gold} Gold Coins - Visit Shop`}
          >
            <Coins className="w-4 h-4 text-gold fill-gold/30" />
            <motion.span
              key={gold}
              initial={{ scale: 1.3, color: '#fef08a' }}
              animate={{ scale: 1, color: 'hsl(var(--gold))' }}
              className="font-mono"
            >
              {gold.toLocaleString()}
            </motion.span>
          </Link>
        </div>
      </div>
    </header>
  );
}
