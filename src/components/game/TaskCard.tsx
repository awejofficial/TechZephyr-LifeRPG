'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Task, AttributeType, TaskDifficulty } from '@/types/game';
import { Shield, Brain, Palette, Clock, Users, Check, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const attributeConfig: Record<AttributeType, { label: string; icon: typeof Shield; textColor: string; borderLeft: string }> = {
  strength: { label: 'Strength', icon: Shield, textColor: 'text-rose-400', borderLeft: 'border-l-rose-500' },
  intellect: { label: 'Intellect', icon: Brain, textColor: 'text-blue-400', borderLeft: 'border-l-blue-500' },
  creativity: { label: 'Creativity', icon: Palette, textColor: 'text-purple-400', borderLeft: 'border-l-purple-500' },
  discipline: { label: 'Discipline', icon: Clock, textColor: 'text-amber-400', borderLeft: 'border-l-amber-500' },
  social: { label: 'Social', icon: Users, textColor: 'text-emerald-400', borderLeft: 'border-l-emerald-500' },
};

const difficultyConfig: Record<TaskDifficulty, { label: string; xp: number; textColor: string }> = {
  trivial: { label: 'Trivial', xp: 5, textColor: 'text-muted-foreground' },
  easy: { label: 'Easy', xp: 10, textColor: 'text-emerald-400' },
  medium: { label: 'Medium', xp: 20, textColor: 'text-blue-400' },
  hard: { label: 'Hard', xp: 50, textColor: 'text-amber-400 font-semibold' },
  epic: { label: 'Epic', xp: 100, textColor: 'text-rose-400 font-bold' },
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`group relative rounded-xl border border-l-4 transition-all duration-150 bg-card p-4 sm:p-4.5 shadow-sm hover:border-border hover:bg-card/90 ${
        task.is_completed
          ? 'opacity-55 bg-secondary/30 border-border/60 border-l-muted-foreground/40'
          : `border-border ${attr.borderLeft}`
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-3.5">
        {/* Crisp Checkbox Button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={task.is_completed || completeMutation.isPending}
          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
            task.is_completed
              ? 'bg-primary border-primary text-primary-foreground shadow-sm'
              : 'border-muted-foreground/50 hover:border-primary hover:bg-primary/10'
          }`}
          aria-label={`Mark quest "${task.title}" as ${task.is_completed ? 'completed' : 'complete'}`}
        >
          {task.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Quest Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`font-semibold text-sm sm:text-base leading-snug tracking-tight truncate ${
                task.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}
            >
              {task.title}
            </h3>

            {/* XP Reward */}
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-secondary border border-border shrink-0">
              <span>+{diff.xp}</span>
              <span className="text-[10px] text-muted-foreground">XP</span>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Clean Simplified Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs">
            {/* Attribute text with icon */}
            <span className={`inline-flex items-center gap-1 font-semibold ${attr.textColor}`}>
              <AttrIcon className="w-3.5 h-3.5" />
              {attr.label}
            </span>

            <span className="text-border">•</span>

            {/* Difficulty */}
            <span className={`text-xs ${diff.textColor}`}>
              {diff.label}
            </span>

            {/* Due date if available */}
            {task.due_date && (
              <>
                <span className="text-border">•</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground text-[11px]">
                  <Calendar className="w-3 h-3" />
                  {task.due_date}
                </span>
              </>
            )}

            {/* Recurrence if repeating */}
            {task.recurrence !== 'one_time' && (
              <>
                <span className="text-border">•</span>
                <span className="text-[11px] font-medium text-muted-foreground capitalize">
                  {task.recurrence.replace('_', ' ')}
                </span>
              </>
            )}
          </div>

          {/* Error / Cooldown alert */}
          {(errorMessage || isCooldown) && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage || 'Quest is on recovery cooldown.'}</span>
            </div>
          )}
        </div>

        {/* Delete Quest Button - hidden until hover/focus */}
        <button
          type="button"
          onClick={() => deleteMutation.mutate(task.id)}
          disabled={deleteMutation.isPending}
          className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-destructive focus-visible:outline-none"
          aria-label={`Delete quest "${task.title}"`}
          title="Delete quest"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
