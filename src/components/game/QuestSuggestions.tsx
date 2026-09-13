'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  STARTER_QUEST_SUGGESTIONS,
  SuggestedQuest,
  getIconComponent,
} from '@/lib/suggestions';
import { REWARDS } from '@/lib/xp-engine';
import { AttributeType } from '@/types/game';
import { Sparkles, Plus, Check, Zap, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestSuggestionsProps {
  onQuestAdded?: () => void;
  compact?: boolean;
  title?: string;
  subtitle?: string;
  currentTaskTitles?: string[];
}

export function QuestSuggestions({
  onQuestAdded,
  compact = false,
  title = 'Suggested Starter Quests',
  subtitle = 'Pick a quest to instantly add it to your active log and begin leveling up.',
  currentTaskTitles = [],
}: QuestSuggestionsProps) {
  const queryClient = useQueryClient();
  const [selectedAttribute, setSelectedAttribute] = useState<string>('all');
  const [acceptedIds, setAcceptedIds] = useState<Record<string, boolean>>({});

  const addQuestMutation = useMutation({
    mutationFn: async (quest: SuggestedQuest) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quest.title,
          description: quest.description,
          attribute: quest.attribute,
          difficulty: quest.difficulty,
          recurrence: quest.recurrence,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to accept quest');
      }

      return { quest, result: await res.json() };
    },
    onSuccess: ({ quest }) => {
      setAcceptedIds((prev) => ({ ...prev, [quest.id]: true }));
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00f0ff', '#8b5cf6', '#f59e0b', '#10b981'],
      });

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['character'] });

      if (onQuestAdded) {
        onQuestAdded();
      }
    },
  });

  const filtered = STARTER_QUEST_SUGGESTIONS.filter((sug) => {
    if (selectedAttribute !== 'all' && sug.attribute !== selectedAttribute) {
      return false;
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'All Quests' },
    { id: 'intellect', label: '🧠 Intellect' },
    { id: 'strength', label: '⚡ Strength' },
    { id: 'discipline', label: '🎯 Discipline' },
    { id: 'creativity', label: '🎨 Creativity' },
    { id: 'social', label: '🤝 Social' },
  ];

  return (
    <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-primary/15 text-primary border border-primary/25">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-display font-black text-base sm:text-lg text-foreground">
              {title}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>

        {/* Attribute Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedAttribute(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                selectedAttribute === cat.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Quests Grid */}
      <div
        className={`grid gap-3 ${
          compact
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        <AnimatePresence>
          {filtered.map((quest) => {
            const Icon = getIconComponent(quest.iconName);
            const reward = REWARDS[quest.difficulty];
            const isAccepted =
              acceptedIds[quest.id] ||
              currentTaskTitles.some(
                (t) => t.toLowerCase() === quest.title.toLowerCase()
              );

            return (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
                  isAccepted
                    ? 'bg-secondary/30 border-border/50 opacity-75'
                    : 'bg-background/60 border-border/70 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${quest.badgeColor}`}
                    >
                      {quest.category}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      {quest.difficulty}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 my-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${quest.badgeColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display font-bold text-xs sm:text-sm text-foreground leading-snug">
                        {quest.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {quest.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-bold">
                    <span className="text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      +{reward.xp} XP
                    </span>
                    <span className="text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                      +{reward.gold} G
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isAccepted && !addQuestMutation.isPending) {
                        addQuestMutation.mutate(quest);
                      }
                    }}
                    disabled={isAccepted || addQuestMutation.isPending}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      isAccepted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isAccepted ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Accepted</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Accept Quest</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
