'use client';

import { useQuery } from '@tanstack/react-query';
import { UserProfile } from '@/types/game';
import { xpForLevel } from '@/lib/xp-engine';
import { Shield, Brain, Palette, Clock, Users, Trophy, Flame, Coins, Sparkles, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const attributesMeta = [
  {
    key: 'discipline_xp' as const,
    name: 'Discipline',
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    textColor: 'text-amber-400',
    desc: 'Focus, consistency, and daily habits fulfilled',
  },
  {
    key: 'intellect_xp' as const,
    name: 'Intellect',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-400',
    desc: 'Coding, studying, literature, and knowledge gained',
  },
  {
    key: 'strength_xp' as const,
    name: 'Strength',
    icon: Shield,
    color: 'from-red-500 to-rose-500',
    textColor: 'text-red-400',
    desc: 'Athleticism, stamina, physical conditioning, and health',
  },
  {
    key: 'creativity_xp' as const,
    name: 'Creativity',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    textColor: 'text-purple-400',
    desc: 'Art, design, storytelling, and novel invention',
  },
  {
    key: 'social_xp' as const,
    name: 'Social',
    icon: Users,
    color: 'from-emerald-500 to-teal-500',
    textColor: 'text-emerald-400',
    desc: 'Networking, friendship, empathy, and leadership',
  },
];

export default function CharacterPage() {
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character');
      if (!res.ok) throw new Error('Failed to load character');
      const json = await res.json();
      return json.profile;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-card/40 rounded-2xl border border-border/50" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-card/40 rounded-2xl border border-border/50" />
          ))}
        </div>
      </div>
    );
  }

  const level = profile?.level ?? 1;
  const currentXp = profile?.current_xp ?? 0;
  const xpNeeded = xpForLevel(level);
  const progressPercent = Math.min(100, Math.round((currentXp / xpNeeded) * 100));

  // Determine character title based on level
  const titles = [
    'Apprentice Adventurer',
    'Novice Pathfinder',
    'Steadfast Quester',
    'Discipline Vanguard',
    'Master of Will',
    'Ascended Legend',
  ];
  const titleIndex = Math.min(titles.length - 1, Math.floor((level - 1) / 3));
  const characterTitle = titles[titleIndex];

  return (
    <div className="space-y-8">
      {/* Top Banner: Character Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-secondary border border-border/80 p-6 md:p-8 shadow-lg">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-primary via-accent to-primary p-1 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  L{level}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  {profile?.username || 'Hero'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold">
                  {characterTitle}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Active Theme: <span className="font-semibold capitalize text-foreground">{profile?.active_theme || 'default'}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="bg-secondary/40 border border-border/60 rounded-xl p-3 text-center">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Streak</p>
              <p className="text-lg font-black text-streak font-mono mt-0.5 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-streak text-streak" />
                {profile?.current_streak ?? 0}d
              </p>
            </div>
            <div className="bg-secondary/40 border border-border/60 rounded-xl p-3 text-center">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Gold</p>
              <p className="text-lg font-black text-gold font-mono mt-0.5 flex items-center justify-center gap-1">
                <Coins className="w-4 h-4 text-gold" />
                {profile?.gold ?? 0}
              </p>
            </div>
            <div className="bg-secondary/40 border border-border/60 rounded-xl p-3 text-center">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Total XP</p>
              <p className="text-lg font-black text-primary font-mono mt-0.5 flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4 text-primary" />
                {profile?.total_xp_earned?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-8 pt-6 border-t border-border/70 relative z-10">
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Level {level} → Level {level + 1}
            </span>
            <span className="font-bold text-foreground">
              {currentXp} / {xpNeeded} XP ({progressPercent}%)
            </span>
          </div>
          <div className="h-3 w-full bg-secondary rounded-full overflow-hidden border border-border/60">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Each level threshold increases exponentially (multiplier 1.2×). Earn {xpNeeded - currentXp} more XP to reach Level {level + 1}.
          </p>
        </div>
      </div>

      {/* Attributes Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Character Attributes
          </h2>
          <p className="text-xs text-muted-foreground">
            Complete category-specific quests to build distinct real-world stats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {attributesMeta.map((attr) => {
            const Icon = attr.icon;
            const xpValue = profile ? (profile[attr.key] as number) || 0 : 0;
            // Attribute tier / rank calculation
            const attrTier = Math.floor(xpValue / 25) + 1;

            return (
              <div
                key={attr.key}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${attr.color} flex items-center justify-center text-white shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{attr.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-semibold">Tier {attrTier}</p>
                    </div>
                  </div>
                  <span className={`font-mono text-sm font-bold ${attr.textColor}`}>
                    {xpValue} XP
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {attr.desc}
                </p>

                {/* Progress bar inside attribute */}
                <div
                  className="h-1.5 w-full bg-secondary rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={xpValue}
                  aria-label={`${attr.name} attribute progress`}
                >
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${attr.color} transition-all duration-500`}
                    style={{ width: `${Math.min(100, (xpValue % 25) * 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
