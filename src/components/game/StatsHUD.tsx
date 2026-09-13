'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { UserProfile } from '@/types/game';
import { Flame, Coins, Bell, Shield, Sparkles } from 'lucide-react';
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

  const level = profile?.level ?? 17;
  const currentXp = profile?.current_xp ?? 2840;
  const xpNeeded = xpForLevel(level);
  const gold = profile?.gold ?? 1240;
  const streak = profile?.current_streak ?? 12;
  const username = profile?.username || 'Awej';

  return (
    <header className="sticky top-0 z-30 w-full bg-card/90 backdrop-blur-xl border-b border-border/70 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Player Profile Chip matching Reference */}
        <Link
          href="/dashboard/character"
          className="flex items-center gap-3 group rounded-xl p-1 -m-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-transform hover:scale-[1.02]"
          title="View Character Profile"
          aria-label={`Character Profile: ${username}, Level ${level}`}
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary/50 shadow-md group-hover:border-primary transition-colors bg-secondary">
              <Image
                src="/assets/game/avatar-alchemist.jpg"
                alt={username}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-[10px] font-mono font-black text-white px-1.5 py-0.2 rounded-full border border-card shadow-sm">
              {level}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-foreground font-display group-hover:text-primary transition-colors">
                {username}
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                Lv. {level}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              Code Alchemist
            </span>
          </div>
        </Link>

        {/* Right side: Streak, Gold Coin Counter & Notification Bell */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Streak Flame Badge */}
          <div
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-card border border-streak/30 text-streak font-mono font-bold text-sm shadow-sm"
            title={`${streak} Day Streak!`}
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <Flame className="w-4 h-4 fill-streak text-streak" />
            </motion.div>
            <span className="text-foreground font-bold">{streak}</span>
          </div>

          {/* Gold Coin Badge */}
          <Link
            href="/dashboard/shop"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-card border border-gold/40 text-gold font-mono font-bold text-sm shadow-sm hover:border-gold transition-colors"
            title="Gold Vault"
          >
            <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center border border-gold">
              <Coins className="w-3 h-3 text-gold" />
            </div>
            <span className="text-foreground font-bold">{gold.toLocaleString()}</span>
          </Link>

          {/* Notification Bell */}
          <button
            type="button"
            className="p-2 rounded-xl bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
}
