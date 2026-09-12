'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { XPEvent, TaskLog } from '@/types/game';
import { History, Trophy, Coins, Clock, CheckCircle2, FileText, Activity } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<'xp' | 'actions'>('xp');

  const { data, isLoading } = useQuery<{ xpEvents: XPEvent[]; taskLogs: TaskLog[] }>({
    queryKey: ['history'],
    queryFn: async () => {
      const res = await fetch('/api/history');
      if (!res.ok) throw new Error('Failed to load history');
      return res.json();
    },
  });

  const xpEvents = data?.xpEvents || [];
  const taskLogs = data?.taskLogs || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <History className="w-7 h-7 text-primary" />
            Quest Ledger & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Server-persisted history of all XP rewards, quest completions, and anti-cheat event verification.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('xp')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              activeTab === 'xp'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span>XP Events ({xpEvents.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('actions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              activeTab === 'actions'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-accent" />
            <span>Action Logs ({taskLogs.length})</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-card/40 rounded-xl border border-border/50 animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'xp' ? (
        xpEvents.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-border/80 rounded-2xl bg-card/30">
            <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-bold text-base text-foreground">No XP Events Recorded Yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Complete your first quest to generate permanent chronological XP audit events in the ledger.
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border/70 bg-secondary/30 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recent XP & Stat Events ({xpEvents.length})
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Immutable Server Log
              </span>
            </div>

            <div className="divide-y divide-border/60">
              {xpEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground capitalize">
                        {event.source.replace('_', ' ')}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDate(event.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center font-mono text-xs">
                    <span className="font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                      +{event.xp_amount} XP
                    </span>
                    <span className="font-bold text-gold px-2 py-0.5 rounded bg-gold/10 border border-gold/20 flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      +{event.gold_amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : taskLogs.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-border/80 rounded-2xl bg-card/30">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-bold text-base text-foreground">No Action Logs Recorded</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Actions like quest completions and cooldown triggers will be logged here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border/70 bg-secondary/30 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Quest Action Logs ({taskLogs.length})
            </span>
            <span className="text-xs text-accent font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Verified State Mutations
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {taskLogs.map((log) => {
              const taskTitle =
                typeof log.task_snapshot === 'object' && log.task_snapshot !== null
                  ? (log.task_snapshot as { title?: string }).title || 'Quest'
                  : 'Quest';

              return (
                <div
                  key={log.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {taskTitle}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDate(log.created_at)}
                      </p>
                    </div>
                  </div>

                  <span className="self-end sm:self-center text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-secondary border border-border text-foreground font-mono">
                    {log.action.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
