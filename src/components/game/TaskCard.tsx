'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Task, AttributeType, TaskDifficulty } from '@/types/game';
import { Shield, Brain, Palette, Clock, Users, Check, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const attributeConfig: Record<AttributeType, { label: string; icon: typeof Shield; color: string }> = {
  strength: { label: 'Strength', icon: Shield, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  intellect: { label: 'Intellect', icon: Brain, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  creativity: { label: 'Creativity', icon: Palette, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  discipline: { label: 'Discipline', icon: Clock, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  social: { label: 'Social', icon: Users, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
};

const difficultyConfig: Record<TaskDifficulty, { label: string; xp: number; color: string }> = {
  trivial: { label: 'Trivial', xp: 5, color: 'text-muted-foreground bg-muted border-border' },
  easy: { label: 'Easy', xp: 10, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  medium: { label: 'Medium', xp: 20, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  hard: { label: 'Hard', xp: 50, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  epic: { label: 'Epic', xp: 100, color: 'text-red-400 bg-red-500/10 border-red-500/30' },
};

export function TaskCard({ task }: { task: Task }) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const attr = attributeConfig[task.attribute] || attributeConfig.discipline;
  const AttrIcon = attr.icon;
  const diff = difficultyConfig[task.difficulty] || difficultyConfig.medium;

  // Complete task mutation with optimistic update
  const completeMutation = useMutation({
    mutationFn: async (taskId: string) => {
      setErrorMessage(null);
      const res = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to complete quest');
      }
      return data;
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['character'] });

      const prevTasks = queryClient.getQueryData<{ tasks: Task[] }>(['tasks']);

      // Optimistically mark task as completed
      if (prevTasks) {
        queryClient.setQueryData(['tasks'], {
          tasks: prevTasks.tasks.map((t) =>
            t.id === taskId ? { ...t, is_completed: true, times_completed: t.times_completed + 1 } : t
          ),
        });
      }

      return { prevTasks };
    },
    onSuccess: (data) => {
      // Invalidate queries to sync authoritative server state
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['character'] });

      // Trigger level-up celebration if leveled up
      if (data.levelUp) {
        window.dispatchEvent(
          new CustomEvent('life-rpg-levelup', {
            detail: data.levelUp,
          })
        );
      }
    },
    onError: (err: Error, _taskId, context) => {
      // Rollback on error
      if (context?.prevTasks) {
        queryClient.setQueryData(['tasks'], context.prevTasks);
      }
      setErrorMessage(err.message);
    },
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete quest');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleToggle = () => {
    if (task.is_completed || completeMutation.isPending) return;
    completeMutation.mutate(task.id);
  };

  const isCooldown =
    task.completion_cooldown_until && new Date(task.completion_cooldown_until) > new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`group relative rounded-xl border transition-all duration-200 bg-card p-4 sm:p-5 shadow-sm hover:border-primary/40 ${
        task.is_completed ? 'opacity-60 bg-muted/40 border-border/50' : 'border-border'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Satisfying Quest Completion Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleToggle}
          disabled={task.is_completed || completeMutation.isPending}
          className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            task.is_completed
              ? 'bg-primary border-primary text-primary-foreground shadow-sm'
              : 'border-muted-foreground/40 hover:border-primary hover:bg-primary/10'
          }`}
          aria-label={`Mark quest "${task.title}" as ${task.is_completed ? 'completed' : 'complete'}`}
        >
          {task.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </motion.button>

        {/* Quest Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`font-semibold text-base leading-snug tracking-tight truncate ${
                task.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}
            >
              {task.title}
            </h3>

            {/* XP Reward Pill */}
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 shrink-0">
              <span>+{diff.xp}</span>
              <span className="text-[10px] text-muted-foreground">XP</span>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            {/* Attribute Badge */}
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${attr.color}`}>
              <AttrIcon className="w-3 h-3" />
              <span>{attr.label}</span>
            </div>

            {/* Difficulty Badge */}
            <div className={`px-2 py-0.5 rounded-md border font-semibold uppercase tracking-wider text-[10px] ${diff.color}`}>
              {diff.label}
            </div>

            {/* Due date if available */}
            {task.due_date && (
              <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                <Calendar className="w-3 h-3" />
                <span>{task.due_date}</span>
              </div>
            )}

            {/* Recurrence */}
            {task.recurrence !== 'one_time' && (
              <span className="text-[10px] uppercase font-semibold text-muted-foreground/80 px-1.5 py-0.5 rounded bg-secondary">
                {task.recurrence}
              </span>
            )}

            {/* Completed badge */}
            {task.is_completed && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Fulfilled
              </span>
            )}
          </div>

          {/* Error / Cooldown alert */}
          {(errorMessage || isCooldown) && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-destructive font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage || 'Quest is on recovery cooldown.'}</span>
            </div>
          )}
        </div>

        {/* Delete Quest Button */}
        <button
          type="button"
          onClick={() => deleteMutation.mutate(task.id)}
          disabled={deleteMutation.isPending}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          aria-label="Delete quest"
          title="Delete quest"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
