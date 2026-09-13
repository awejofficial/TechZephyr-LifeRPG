'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, TaskDifficulty, AttributeType } from '@/types/game';
import { CreateTaskDialog } from '@/components/game/CreateTaskDialog';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const SAMPLE_QUESTS = [
  {
    id: 'q1',
    title: 'Build Spring Boot API',
    category: 'Coding',
    difficulty: 'Medium',
    icon: Code,
    xp_reward: 150,
    gold_reward: 40,
    is_completed: false,
    attribute: 'intellect',
    color: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
  },
  {
    id: 'q2',
    title: 'Solve 3 DSA problems',
    category: 'Learning',
    difficulty: 'Medium',
    icon: Layers,
    xp_reward: 100,
    gold_reward: 25,
    is_completed: false,
    attribute: 'intellect',
    color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
  },
  {
    id: 'q3',
    title: 'Workout',
    category: 'Health',
    difficulty: 'Easy',
    icon: Dumbbell,
    xp_reward: 120,
    gold_reward: 30,
    is_completed: false,
    attribute: 'strength',
    color: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
  },
  {
    id: 'q4',
    title: 'Read 20 pages',
    category: 'Knowledge',
    difficulty: 'Easy',
    icon: BookOpen,
    xp_reward: 60,
    gold_reward: 15,
    is_completed: true,
    attribute: 'intellect',
    color: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  },
  {
    id: 'q5',
    title: 'Study Java Collections',
    category: 'Learning',
    difficulty: 'Medium',
    icon: Scroll,
    xp_reward: 90,
    gold_reward: 20,
    is_completed: false,
    attribute: 'intellect',
    color: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
  },
];

export default function QuestsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data } = useQuery<{ tasks: Task[] }>({
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
        colors: ['#00f0ff', '#8b5cf6', '#f59e0b'],
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['character'] });
    },
  });

  const tasks = data?.tasks?.length ? data.tasks : SAMPLE_QUESTS;

  const filteredTasks = tasks.filter((t: any) => {
    if (filter === 'active') return !t.is_completed;
    if (filter === 'completed') return t.is_completed;
    return true;
  });

  const totalCount = tasks.length;
  const activeCount = tasks.filter((t: any) => !t.is_completed).length;
  const completedCount = tasks.filter((t: any) => t.is_completed).length;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header matching Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground tracking-tight">
            Quests
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Turn your goals into epic quests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Quest</span>
        </button>
      </div>

      {/* Filter Tabs matching Reference */}
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
      <div className="space-y-3.5">
        <AnimatePresence>
          {filteredTasks.map((task: any, index: number) => {
            const isCompleted = task.is_completed;
            const Icon = task.icon || Layers;
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
                {/* Left: Checkbox + Isometric Icon + Title + Category Tag */}
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
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${
                      task.color || 'border-primary/30 text-primary bg-primary/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
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
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/40">
                        {task.category || task.attribute || 'Quest'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground">
                        {task.difficulty || 'Medium'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Reward Badges matching Reference */}
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 text-xs font-mono font-bold">
                    <span className="text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      +{task.xp_reward || 100} XP
                    </span>
                    <span className="text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                      +{task.gold_reward || Math.round((task.xp_reward || 100) / 4)} Gold
                    </span>
                  </div>

                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    aria-label="Quest options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal Dialog */}
      <CreateTaskDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
