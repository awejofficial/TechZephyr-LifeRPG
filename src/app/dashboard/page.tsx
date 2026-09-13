'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, UserProfile } from '@/types/game';
import { CreateTaskDialog } from '@/components/game/CreateTaskDialog';
import {
  Flame,
  Coins,
  Brain,
  Shield,
  Clock,
  Sparkles,
  Plus,
  Check,
  CheckCircle2,
  Crosshair,
  ArrowRight,
  Gift,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { REWARDS } from '@/lib/xp-engine';

export default function DashboardLobby() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [claimedChest, setClaimedChest] = useState(false);

  // Fetch character profile
  const { data: profileData } = useQuery<{ profile: UserProfile }>({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character');
      if (!res.ok) throw new Error('Failed to load profile');
      return res.json();
    },
  });

  // Fetch tasks
  const { data: tasksData, isLoading } = useQuery<{ tasks: Task[] }>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to load quests');
      return res.json();
    },
  });

  const profile = profileData?.profile;
  const username = profile?.username || 'Awej';
  const level = profile?.level ?? 17;
  const currentXp = profile?.current_xp ?? 2840;
  const xpNeeded = 3200;
  const xpPercent = Math.min(100, Math.max(0, (currentXp / xpNeeded) * 100));

  const allTasks = tasksData?.tasks || [];
  const completedToday = allTasks.filter((t) => t.is_completed).length;
  const totalToday = Math.max(allTasks.length, 6);

  // Complete quest mutation
  const completeMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      if (!res.ok) throw new Error('Failed to complete task');
      return res.json();
    },
    onSuccess: () => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00f0ff', '#8b5cf6', '#f59e0b'],
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['character'] });
    },
  });

  const handleClaimChest = () => {
    if (completedToday >= 3 && !claimedChest) {
      setClaimedChest(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff', '#00f0ff'],
      });
    }
  };

  // Demo fallback quests matching reference if no tasks exist
  const displayTasks =
    allTasks.length > 0
      ? allTasks.slice(0, 5)
      : [
          { id: '1', title: 'Read 20 pages', xp_reward: 60, is_completed: true },
          { id: '2', title: 'Solve 3 DSA problems', xp_reward: 100, is_completed: false },
          { id: '3', title: 'Workout', xp_reward: 120, is_completed: false },
          { id: '4', title: 'Build Spring Boot API', xp_reward: 150, is_completed: false },
        ];

  return (
    <div className="space-y-7 pb-12">
      {/* 1. Greeting Header matching reference */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black tracking-tight text-foreground">
          Good Morning, <span className="text-primary">{username}</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Another day, another quest. Keep building your best self.
        </p>
      </div>

      {/* 2. Hero Scenic Vista Card matching reference */}
      <div className="relative rounded-3xl overflow-hidden border border-border/70 shadow-2xl bg-card min-h-[340px] flex flex-col justify-between p-6 sm:p-8 group">
        {/* Scenic Fantasy Background with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/game/lobby-vista.jpg"
            alt="Fantasy Vista"
            fill
            priority
            className="object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        </div>

        {/* Top Vista Content: Character HUD Card + Inscription */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Character Card (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary shadow-lg shrink-0">
                <Image
                  src="/assets/game/avatar-alchemist.jpg"
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-display font-black text-lg text-foreground truncate">
                    Code Alchemist
                  </h2>
                  <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/30">
                    Lv. {level}
                  </span>
                </div>

                {/* XP Meter */}
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                    <span>PROGRESSION</span>
                    <span className="text-foreground font-bold">
                      {currentXp.toLocaleString()} / {xpNeeded.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary via-accent to-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPercent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Core Attributes Quadrant matching reference */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border/50 text-center">
              <div className="p-2 rounded-xl bg-background/50 border border-border/40">
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-cyan-400 font-bold mb-0.5">
                  <Brain className="w-3 h-3" />
                  <span>INT</span>
                </div>
                <div className="text-sm font-black font-display text-foreground">42</div>
              </div>

              <div className="p-2 rounded-xl bg-background/50 border border-border/40">
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-rose-400 font-bold mb-0.5">
                  <Shield className="w-3 h-3" />
                  <span>STR</span>
                </div>
                <div className="text-sm font-black font-display text-foreground">28</div>
              </div>

              <div className="p-2 rounded-xl bg-background/50 border border-border/40">
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-purple-400 font-bold mb-0.5">
                  <Crosshair className="w-3 h-3" />
                  <span>FOCUS</span>
                </div>
                <div className="text-sm font-black font-display text-foreground">35</div>
              </div>

              <div className="p-2 rounded-xl bg-background/50 border border-border/40">
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-amber-400 font-bold mb-0.5">
                  <Clock className="w-3 h-3" />
                  <span>DISC</span>
                </div>
                <div className="text-sm font-black font-display text-foreground">38</div>
              </div>
            </div>
          </div>

          {/* Inspirational Inscription (Right 5 Cols) */}
          <div className="lg:col-span-5 hidden lg:flex flex-col justify-end items-end h-full pt-4">
            <div className="p-4 rounded-2xl bg-background/70 backdrop-blur-xl border border-border/60 max-w-xs shadow-xl text-right">
              <span className="text-[10px] font-mono text-gold uppercase tracking-widest block mb-1">
                GUILD MOTTO
              </span>
              <p className="text-xs text-foreground/90 font-sans italic leading-relaxed">
                "Discipline today builds the freedom you want tomorrow."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lower Grid: Today's Quests (Left) & Today's Progress (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Quests Deck (7 Cols) */}
        <div className="lg:col-span-7 bg-card/85 backdrop-blur-xl border border-border/70 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-black text-lg text-foreground flex items-center gap-2">
                Today's Quests
              </h3>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-secondary border border-border/60 text-muted-foreground">
                {completedToday} / {totalToday}
              </span>
            </div>

            {/* Quest list */}
            <div className="space-y-3">
              {displayTasks.map((task, idx) => {
                const isCompleted = task.is_completed;
                return (
                  <div
                    key={task.id || idx}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                      isCompleted
                        ? 'bg-secondary/30 border-border/40 opacity-70'
                        : 'bg-card border-border/70 hover:border-primary/50 shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (!isCompleted && task.id) {
                            completeMutation.mutate(task.id);
                          }
                        }}
                        disabled={isCompleted || completeMutation.isPending}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 text-black shadow-sm'
                            : 'border-2 border-border/80 hover:border-primary hover:bg-primary/10'
                        }`}
                        aria-label={isCompleted ? 'Completed' : 'Mark quest complete'}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <span
                        className={`text-sm font-semibold tracking-tight ${
                          isCompleted
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                      +{('difficulty' in task && task.difficulty && REWARDS[task.difficulty] ? REWARDS[task.difficulty].xp : ((task as any).xp_reward || 50))} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Golden Action Button matching reference */}
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="w-full mt-6 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-display font-black text-sm tracking-wide shadow-lg shadow-amber-400/20 hover:shadow-amber-400/35 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Quest</span>
          </button>
        </div>

        {/* Right Column: Today's Progress & Daily Adventure (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today's Progress Card matching reference */}
          <div className="bg-card/85 backdrop-blur-xl border border-border/70 rounded-3xl p-6 shadow-xl">
            <h3 className="font-display font-black text-base text-foreground mb-4">
              Today's Progress
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {/* Streak */}
              <div className="p-3.5 rounded-2xl bg-background/50 border border-border/50 text-center">
                <div className="w-7 h-7 mx-auto mb-1 rounded-full bg-streak/15 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-streak fill-streak" />
                </div>
                <div className="font-display font-black text-lg text-foreground">12</div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Streak</span>
              </div>

              {/* Stat Gain */}
              <div className="p-3.5 rounded-2xl bg-background/50 border border-border/50 text-center">
                <div className="w-7 h-7 mx-auto mb-1 rounded-full bg-cyan-500/15 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="font-display font-black text-lg text-cyan-400">+8</div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">INT Gain</span>
              </div>

              {/* Gold Gain */}
              <div className="p-3.5 rounded-2xl bg-background/50 border border-border/50 text-center">
                <div className="w-7 h-7 mx-auto mb-1 rounded-full bg-gold/15 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-gold" />
                </div>
                <div className="font-display font-black text-lg text-gold">+180</div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Gold</span>
              </div>
            </div>
          </div>

          {/* Daily Adventure Loot Chest Card matching reference */}
          <div className="bg-card/85 backdrop-blur-xl border border-border/70 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-black text-base text-foreground">
                Daily Adventure
              </h3>
              <span className="text-[10px] font-mono font-bold text-gold uppercase bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">
                Bonus Loot
              </span>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Complete 3 quests today to claim the mystery treasure chest.
            </p>

            <div className="flex items-center gap-4 bg-background/60 p-4 rounded-2xl border border-border/50">
              <div className="relative w-16 h-16 shrink-0 group cursor-pointer" onClick={handleClaimChest}>
                <Image
                  src="/assets/game/treasure-chest.jpg"
                  alt="Treasure Chest"
                  fill
                  className={`object-cover rounded-xl transition-transform duration-300 ${
                    completedToday >= 3 ? 'animate-bounce' : 'opacity-90'
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-muted-foreground">Chest Progress</span>
                  <span className="font-bold text-foreground">
                    {Math.min(completedToday, 3)} / 3
                  </span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/50">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-amber-300 transition-all duration-500"
                    style={{ width: `${Math.min(100, (completedToday / 3) * 100)}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleClaimChest}
                  disabled={completedToday < 3 || claimedChest}
                  className={`mt-2.5 w-full py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all ${
                    claimedChest
                      ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                      : completedToday >= 3
                      ? 'bg-gold text-black hover:bg-gold/90 shadow-md shadow-gold/25'
                      : 'bg-secondary text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {claimedChest
                    ? '✓ Claimed (+50 Gold)'
                    : completedToday >= 3
                    ? 'Claim Mystery Loot! 🎁'
                    : 'Locked (Complete 3 Quests)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Quest Modal Dialog */}
      <CreateTaskDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
