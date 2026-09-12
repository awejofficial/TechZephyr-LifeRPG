'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Task, AttributeType } from '@/types/game';
import { TaskCard } from '@/components/game/TaskCard';
import { CreateTaskDialog } from '@/components/game/CreateTaskDialog';
import { Plus, Filter, Search, Sparkles, CheckCircle2, Circle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery<{ tasks: Task[] }>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to load quests');
      return res.json();
    },
  });

  const tasks = data?.tasks || [];

  // Filter tasks based on status, attribute, and search
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === 'active' && task.is_completed) return false;
    if (statusFilter === 'completed' && !task.is_completed) return false;
    if (selectedAttribute !== 'all' && task.attribute !== selectedAttribute) return false;
    if (searchQuery.trim() && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const activeCount = tasks.filter((t) => !t.is_completed).length;
  const completedCount = tasks.filter((t) => t.is_completed).length;

  return (
    <div className="space-y-6">
      {/* Top Header: Title + Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            Quest Board
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary font-bold">
              {activeCount} Active
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Conquer everyday challenges to level up your character and build real habits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg hover:bg-primary/90 transition-all active:scale-95 shrink-0 glow-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <Plus className="w-4 h-4" />
          <span>New Quest</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card/60 border border-border/80 rounded-2xl p-3 shadow-sm">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              statusFilter === 'active'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Circle className="w-3 h-3 text-primary" />
            <span>Active ({activeCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              statusFilter === 'completed'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Fulfilled ({completedCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              statusFilter === 'all'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({tasks.length})
          </button>
        </div>

        {/* Attribute & Search */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md justify-end">
          {/* Attribute filter */}
          <div className="relative">
            <select
              value={selectedAttribute}
              onChange={(e) => setSelectedAttribute(e.target.value as AttributeType | 'all')}
              className="px-3 py-1.5 bg-secondary/50 border border-border rounded-xl text-xs text-foreground font-semibold focus:border-primary focus-visible:ring-2 focus-visible:ring-primary outline-none"
              aria-label="Filter by attribute"
            >
              <option value="all">All Attributes</option>
              <option value="discipline">Discipline ⏰</option>
              <option value="intellect">Intellect 🧠</option>
              <option value="strength">Strength 💪</option>
              <option value="creativity">Creativity 🎨</option>
              <option value="social">Social 🤝</option>
            </select>
          </div>

          {/* Search input with clear button */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests..."
              className="w-full pl-8 pr-7 py-1.5 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-primary outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task List or Empty State */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-card/40 border border-border/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/30 text-center">
          <p className="text-sm font-semibold text-destructive">Failed to load quests. Please refresh.</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-border/80 rounded-2xl bg-card/30">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center text-primary mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-foreground">No Quests Found</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
            {tasks.length === 0
              ? 'Your adventure begins with a single step! Add your first real-world task to earn XP.'
              : 'No quests match your active filter criteria.'}
          </p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Forge First Quest</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Dialog */}
      <CreateTaskDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
