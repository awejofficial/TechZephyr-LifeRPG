'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, TaskDifficulty, AttributeType } from '@/types/game';
import { CreateTaskDialog } from '@/components/game/CreateTaskDialog';
import { QuestSuggestions } from '@/components/game/QuestSuggestions';
import { REWARDS } from '@/lib/xp-engine';
import {
  Plus,
  Check,
  Code,
  Dumbbell,
  BookOpen,
  Scroll,
  Layers,
  Sparkles,
  Coins,
  MoreVertical,
  Trash2,
  Compass,
  Target,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function QuestsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data, isLoading } = useQuery<{ tasks: Task[] }>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },
  });

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
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#00f0ff', '#8b5cf6', '#f59e0b', '#10b981'],
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['character'] });
    },
  });

  const tasks = data?.tasks || [];

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.is_completed;
    if (filter === 'completed') return t.is_completed;
    return true;
  });

  const totalCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.is_completed).length;
  const completedCount = tasks.filter((t) => t.is_completed).length;

  const getAttributeBadge = (attr: AttributeType) => {
    switch (attr) {
      case 'intellect':
        return { label: 'Intellect', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' };
      case 'strength':
        return { label: 'Strength', color: 'border-rose-500/30 text-rose-400 bg-rose-500/10' };
      case 'discipline':
        return { label: 'Discipline', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' };
      case 'creativity':
        return { label: 'Creativity', color: 'border-pink-500/30 text-pink-400 bg-pink-500/10' };
      case 'social':
        return { label: 'Social', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10' };
      default:
        return { label: 'General', color: 'border-primary/30 text-primary bg-primary/10' };
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground tracking-tight">
            Quest Log
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Convert your goals and habits into actionable XP progression.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-primary/30 hover:border-primary text-xs font-mono font-bold text-primary shadow-sm transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>{showSuggestions ? 'Hide Suggestions' : '💡 Suggestions'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Quest</span>
          </button>
        </div>
      </div>

      {/* Suggested Quests Shelf */}
      <AnimatePresence>
        {(showSuggestions || tasks.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <QuestSuggestions
              title={
                tasks.length === 0
                  ? '⚡ Recommended Starter Quests'
                  : '💡 Recommended Quests For You'
              }
              subtitle={
                tasks.length === 0
                  ? 'Your quest log is clear! Select any starter quest below with 1 click to activate it.'
                  : 'Pick from curated challenges to boost your lowest attributes and earn XP.'
              }
              currentTaskTitles={tasks.map((t) => t.title)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            filter === 'all'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('active')}
          className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            filter === 'active'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            filter === 'completed'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Quest Cards Deck */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-card/60 rounded-2xl border border-border/50 animate-pulse" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-border/70 bg-card/40">
          <Target className="w-12 h-12 text-primary mx-auto mb-3 opacity-80" />
          <h3 className="font-display font-bold text-base text-foreground">
            {filter === 'completed'
              ? 'No completed quests yet'
              : filter === 'active'
              ? 'No active quests in progress'
              : 'Your quest log is empty'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {filter === 'completed'
              ? 'Mark active quests as completed to log your accomplishments.'
              : 'Accept a suggested quest above or create your own custom challenge!'}
          </p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            Create Custom Quest ⚔️
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          <AnimatePresence>
            {filteredTasks.map((task, index) => {
              const isCompleted = task.is_completed;
              const reward = REWARDS[task.difficulty] || { xp: 50, gold: 10 };
              const badge = getAttributeBadge(task.attribute);

              return (
                <motion.div
                  key={task.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                    isCompleted
                      ? 'bg-card/40 border-border/40 opacity-60'
                      : 'bg-card/90 border-border/70 hover:border-primary/50 shadow-xl shadow-black/20'
                  }`}
                >
                  {/* Left: Checkbox + Icon + Title + Category Tag */}
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isCompleted && task.id) {
                          completeMutation.mutate(task.id);
                        }
                      }}
                      disabled={isCompleted || completeMutation.isPending}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-black shadow-sm'
                          : 'border-2 border-border/80 hover:border-cyan-400 hover:bg-cyan-500/10'
                      }`}
                      aria-label={isCompleted ? 'Quest completed' : 'Complete quest'}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${badge.color}`}
                    >
                      <Layers className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <h3
                        className={`text-sm sm:text-base font-bold font-display tracking-tight truncate ${
                          isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}
                      >
                        {task.title}
                      </h3>

                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground uppercase">
                          {task.difficulty}
                        </span>
                        {task.recurrence && task.recurrence !== 'one_time' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground capitalize">
                            {task.recurrence}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Reward Badges */}
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 text-xs font-mono font-bold">
                      <span className="text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        +{reward.xp} XP
                      </span>
                      <span className="text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                        +{reward.gold} Gold
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal Dialog */}
      <CreateTaskDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
