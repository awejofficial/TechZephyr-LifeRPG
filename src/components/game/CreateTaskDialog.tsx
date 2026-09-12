'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AttributeType, TaskDifficulty, TaskRecurrence } from '@/types/game';
import { Plus, X, Shield, Brain, Palette, Clock, Users, Sparkles } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const attributes: { id: AttributeType; label: string; icon: typeof Shield; desc: string }[] = [
  { id: 'discipline', label: 'Discipline', icon: Clock, desc: 'Focus, habits, consistency' },
  { id: 'intellect', label: 'Intellect', icon: Brain, desc: 'Studying, coding, reading' },
  { id: 'strength', label: 'Strength', icon: Shield, desc: 'Fitness, gym, endurance' },
  { id: 'creativity', label: 'Creativity', icon: Palette, desc: 'Design, writing, art' },
  { id: 'social', label: 'Social', icon: Users, desc: 'Networking, family, team' },
];

const difficulties: { id: TaskDifficulty; label: string; xp: number; gold: number }[] = [
  { id: 'trivial', label: 'Trivial', xp: 5, gold: 2 },
  { id: 'easy', label: 'Easy', xp: 10, gold: 5 },
  { id: 'medium', label: 'Medium', xp: 20, gold: 10 },
  { id: 'hard', label: 'Hard', xp: 50, gold: 25 },
  { id: 'epic', label: 'Epic', xp: 100, gold: 50 },
];

export function CreateTaskDialog({ isOpen, onClose }: CreateTaskDialogProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attribute, setAttribute] = useState<AttributeType>('discipline');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium');
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('one_time');
  const [dueDate, setDueDate] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      // Empty task validation edge case check
      if (!title.trim()) {
        throw new Error('Quest title is required. You cannot embark on a nameless quest!');
      }

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          attribute,
          difficulty,
          recurrence,
          due_date: dueDate || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create quest');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      resetForm();
      onClose();
    },
    onError: (err: Error) => {
      setValidationError(err.message);
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAttribute('discipline');
    setDifficulty('medium');
    setRecurrence('one_time');
    setDueDate('');
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Quest title cannot be empty.');
      return;
    }
    setValidationError(null);
    createMutation.mutate();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-quest-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="create-quest-title" className="text-lg font-bold tracking-tight text-foreground">
                    Forge New Quest
                  </h2>
                  <p className="text-xs text-muted-foreground">Define your real-world challenge</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Title input */}
              <div>
                <label htmlFor="quest-title" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Quest Title <span className="text-destructive">*</span>
                </label>
                <input
                  id="quest-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="e.g. Read 20 pages of clean code"
                  className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="quest-desc" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Description <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  id="quest-desc"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details, victory conditions, or notes..."
                  className="w-full px-3.5 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              {/* Attribute Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Character Attribute
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {attributes.map((attr) => {
                    const Icon = attr.icon;
                    const isSelected = attribute === attr.id;
                    return (
                      <button
                        key={attr.id}
                        type="button"
                        onClick={() => setAttribute(attr.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-primary/15 border-primary text-primary font-bold shadow-sm'
                            : 'bg-secondary/30 border-border/80 hover:bg-secondary text-muted-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs truncate">{attr.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty & XP Reward */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Difficulty & Reward
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {difficulties.map((diff) => {
                    const isSelected = difficulty === diff.id;
                    return (
                      <button
                        key={diff.id}
                        type="button"
                        onClick={() => setDifficulty(diff.id)}
                        className={`py-2 px-1 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-primary border-primary text-primary-foreground font-bold shadow-md'
                            : 'bg-secondary/30 border-border/80 hover:bg-secondary text-muted-foreground'
                        }`}
                      >
                        <p className="text-[11px] capitalize truncate">{diff.label}</p>
                        <p className="text-[10px] opacity-80">+{diff.xp}XP</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recurrence & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="quest-recurrence" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Recurrence
                  </label>
                  <select
                    id="quest-recurrence"
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as TaskRecurrence)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:border-primary outline-none"
                  >
                    <option value="one_time">One-Time Quest</option>
                    <option value="daily">Daily Habit</option>
                    <option value="weekly">Weekly Objective</option>
                    <option value="monthly">Monthly Milestone</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quest-due" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Target Date
                  </label>
                  <input
                    id="quest-due"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:border-primary outline-none"
                  >
                  </input>
                </div>
              </div>

              {/* Validation error display */}
              {validationError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium">
                  {validationError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-border/70">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{createMutation.isPending ? 'Forging...' : 'Add Quest'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
