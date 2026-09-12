'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Brain, Clock, ArrowRight, Loader2, Plus, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { AttributeType, TaskDifficulty, TaskRecurrence } from '@/types/game';

interface ProtocolQuest {
  title: string;
  description: string;
  attribute: AttributeType;
  difficulty: TaskDifficulty;
  recurrence: TaskRecurrence;
}

interface Protocol {
  id: string;
  name: string;
  tagline: string;
  attributeFocus: string;
  icon: typeof Clock;
  accentColor: string;
  borderColor: string;
  quests: ProtocolQuest[];
}

const STARTER_PROTOCOLS: Protocol[] = [
  {
    id: 'morning_routine',
    name: 'The Morning Vanguard',
    tagline: 'High-discipline morning routine to win the day before 9 AM',
    attributeFocus: 'Discipline & Health',
    icon: Clock,
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/40 hover:border-amber-500',
    quests: [
      {
        title: 'Hydrate with 500ml water',
        description: 'Drink a tall glass of water immediately upon waking up to jumpstart metabolism.',
        attribute: 'discipline',
        difficulty: 'trivial',
        recurrence: 'daily',
      },
      {
        title: '15-minute sunlight walk',
        description: 'Get natural sunlight exposure and light movement to set circadian rhythm.',
        attribute: 'strength',
        difficulty: 'easy',
        recurrence: 'daily',
      },
      {
        title: 'Define top 3 mission priorities',
        description: 'Write down the three essential goals that must be fulfilled today.',
        attribute: 'intellect',
        difficulty: 'easy',
        recurrence: 'daily',
      },
    ],
  },
  {
    id: 'deep_work',
    name: 'Deep Work Sprint',
    tagline: 'Eliminate cognitive noise and push intellectual output to peak levels',
    attributeFocus: 'Intellect & Focus',
    icon: Brain,
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/40 hover:border-blue-500',
    quests: [
      {
        title: '45-minute distraction-free focus block',
        description: 'Zero tabs, phone in airplane mode, focused entirely on a single complex problem.',
        attribute: 'intellect',
        difficulty: 'medium',
        recurrence: 'daily',
      },
      {
        title: 'Clear inbox and tidy workspace',
        description: 'Process pending messages to zero and clean physical workspace.',
        attribute: 'discipline',
        difficulty: 'easy',
        recurrence: 'daily',
      },
      {
        title: 'Study 1 technical chapter or paper',
        description: 'Read and take notes on relevant documentation, book, or architecture.',
        attribute: 'intellect',
        difficulty: 'easy',
        recurrence: 'daily',
      },
    ],
  },
  {
    id: 'physical_power',
    name: 'Physical Resilience',
    tagline: 'Build stamina, athletic power, and physical conditioning',
    attributeFocus: 'Strength & Vitality',
    icon: Shield,
    accentColor: 'text-rose-400',
    borderColor: 'border-rose-500/40 hover:border-rose-500',
    quests: [
      {
        title: '30-minute training session',
        description: 'Complete resistance training, bodyweight session, or cardiovascular run.',
        attribute: 'strength',
        difficulty: 'hard',
        recurrence: 'daily',
      },
      {
        title: 'Clean post-workout nutrition & hydration',
        description: 'Refuel with wholesome protein and minerals after exertion.',
        attribute: 'discipline',
        difficulty: 'easy',
        recurrence: 'daily',
      },
      {
        title: '10-minute mobility & recovery stretch',
        description: 'Cool down joints, hamstrings, and shoulders for longevity.',
        attribute: 'strength',
        difficulty: 'easy',
        recurrence: 'daily',
      },
    ],
  },
];

export function StarterQuestProtocols({ onCustomQuest }: { onCustomQuest: () => void }) {
  const queryClient = useQueryClient();
  const [loadingProtocolId, setLoadingProtocolId] = useState<string | null>(null);

  const loadProtocolMutation = useMutation({
    mutationFn: async (protocol: Protocol) => {
      setLoadingProtocolId(protocol.id);
      for (const quest of protocol.quests) {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quest),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setLoadingProtocolId(null);
    },
    onError: () => {
      setLoadingProtocolId(null);
    },
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary mx-auto mb-3">
          <Zap className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          Choose Your Starter Protocol
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
          Skip the blank-page fatigue. Select a starter protocol to populate your quest board with 3 actionable habits immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {STARTER_PROTOCOLS.map((proto) => {
          const Icon = proto.icon;
          const isLoadingThis = loadingProtocolId === proto.id;

          return (
            <motion.div
              key={proto.id}
              whileHover={{ y: -2 }}
              className={`flex flex-col justify-between rounded-xl border bg-secondary/30 p-5 transition-all ${proto.borderColor}`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg bg-secondary ${proto.accentColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {proto.attributeFocus}
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground mb-1">{proto.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {proto.tagline}
                </p>

                {/* Quests preview */}
                <div className="space-y-1.5 mb-4 border-t border-border/60 pt-3">
                  {proto.quests.map((q, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="truncate">{q.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => loadProtocolMutation.mutate(proto)}
                disabled={Boolean(loadingProtocolId)}
                className="w-full py-2.5 px-3 rounded-lg bg-card border border-border hover:bg-secondary text-xs font-bold text-foreground transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 shadow-sm"
              >
                {isLoadingThis ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deploying Quests...</span>
                  </>
                ) : (
                  <>
                    <span>Load This Protocol</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Alternative option to create from scratch */}
      <div className="text-center pt-4 border-t border-border/60">
        <span className="text-xs text-muted-foreground mr-2">Prefer creating your own custom habit?</span>
        <button
          type="button"
          onClick={onCustomQuest}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Forge Custom Quest</span>
        </button>
      </div>
    </div>
  );
}
