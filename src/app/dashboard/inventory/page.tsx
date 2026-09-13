'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShopItem, UserProfile, Task } from '@/types/game';
import {
  Sword,
  Shield,
  Award,
  Sparkles,
  Flame,
  Palette,
  Trophy,
  CheckCircle2,
  Lock,
  ArrowRight,
  Backpack,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'All' | 'theme' | 'badge' | 'streak_freeze'>('All');

  // Fetch real owned items from shop endpoint
  const { data: shopData, isLoading: isShopLoading } = useQuery<{ items: ShopItem[] }>({
    queryKey: ['shop'],
    queryFn: async () => {
      const res = await fetch('/api/shop');
      if (!res.ok) throw new Error('Failed to load inventory');
      return res.json();
    },
  });

  // Fetch character profile for level & streak
  const { data: profileData } = useQuery<{ profile: UserProfile }>({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character');
      if (!res.ok) throw new Error('Failed to load profile');
      return res.json();
    },
  });

  // Fetch tasks for quest count
  const { data: tasksData } = useQuery<{ tasks: Task[] }>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to load tasks');
      return res.json();
    },
  });

  const profile = profileData?.profile;
  const level = profile?.level ?? 1;
  const streak = profile?.current_streak ?? 0;
  const completedCount = (tasksData?.tasks || []).filter((t) => t.is_completed).length;

  const allItems = shopData?.items || [];
  const ownedItems = allItems.filter((i) => i.is_owned);

  const filteredItems = ownedItems.filter((item) => {
    if (activeTab === 'All') return true;
    return item.item_type === activeTab;
  });

  // Equip mutation
  const equipMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch('/api/shop/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to equip item');
      }
      return json;
    },
    onSuccess: () => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#8b5cf6', '#f59e0b'],
      });
      queryClient.invalidateQueries({ queryKey: ['shop'] });
      queryClient.invalidateQueries({ queryKey: ['character'] });
    },
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'theme':
        return Palette;
      case 'streak_freeze':
        return Flame;
      case 'badge':
        return Award;
      default:
        return Sparkles;
    }
  };

  // Real milestones tracking based on actual user progression
  const REAL_ACHIEVEMENTS = [
    {
      id: 'ach-first',
      title: 'First Awakening',
      desc: 'Complete your first real-world quest.',
      icon: Trophy,
      unlocked: completedCount >= 1,
      progress: `${Math.min(completedCount, 1)}/1`,
      percent: Math.min(100, completedCount * 100),
    },
    {
      id: 'ach-streak-3',
      title: 'Spark of Habit',
      desc: 'Maintain a 3-day active streak.',
      icon: Flame,
      unlocked: streak >= 3,
      progress: `${Math.min(streak, 3)}/3`,
      percent: Math.min(100, Math.round((streak / 3) * 100)),
    },
    {
      id: 'ach-quests-10',
      title: 'Tenfold Disciplined',
      desc: 'Conquer 10 quests across your journey.',
      icon: Shield,
      unlocked: completedCount >= 10,
      progress: `${Math.min(completedCount, 10)}/10`,
      percent: Math.min(100, Math.round((completedCount / 10) * 100)),
    },
    {
      id: 'ach-level-5',
      title: 'Ascendant Hero',
      desc: 'Reach Character Level 5.',
      icon: Award,
      unlocked: level >= 5,
      progress: `Lv. ${level}/5`,
      percent: Math.min(100, Math.round((level / 5) * 100)),
    },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground tracking-tight">
            Hero Inventory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your earned badges, cosmetic themes, and consumables.
          </p>
        </div>

        <Link
          href="/dashboard/shop"
          className="px-4 py-2 rounded-xl bg-card border border-gold/40 text-gold hover:border-gold font-mono text-xs font-bold flex items-center gap-2 shadow-sm transition-all shrink-0"
        >
          <span>Visit Shop</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        {[
          { id: 'All', label: 'All Unlocks' },
          { id: 'theme', label: '🎨 Themes' },
          { id: 'badge', label: '🏅 Badges' },
          { id: 'streak_freeze', label: '❄️ Relics' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {isShopLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-card/60 rounded-2xl border border-border/50 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-border/70 bg-card/40">
          <Backpack className="w-12 h-12 text-primary mx-auto mb-3 opacity-80" />
          <h3 className="font-display font-bold text-base text-foreground">
            No owned items yet
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Complete quests to earn gold, then visit the Realm Shop to purchase custom themes, badges, and streak protections!
          </p>
          <Link href="/dashboard/shop">
            <button
              type="button"
              className="mt-4 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-bold text-xs shadow-md shadow-primary/20 transition-all"
            >
              Explore the Realm Shop →
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const Icon = getItemIcon(item.item_type);
            const isEquipped = item.is_equipped;

            return (
              <div
                key={item.id}
                className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xl flex flex-col justify-between group hover:border-primary/50 transition-all hover:scale-[1.02]"
              >
                <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-secondary/30 border border-border/60 flex items-center justify-center mb-3 relative">
                  <Icon className="w-8 h-8 text-foreground transform group-hover:scale-110 transition-transform duration-300" />
                  {isEquipped && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500 text-black">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display font-bold text-xs sm:text-sm text-foreground truncate">
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground block mt-0.5 uppercase">
                    {item.item_type}
                  </span>

                  {item.item_type === 'theme' && (
                    <button
                      type="button"
                      onClick={() => equipMutation.mutate(item.id)}
                      disabled={isEquipped || equipMutation.isPending}
                      className={`mt-3 w-full py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                        isEquipped
                          ? 'bg-secondary text-muted-foreground cursor-default'
                          : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30'
                      }`}
                    >
                      {isEquipped ? 'Equipped' : 'Equip Theme'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Real Achievements Section */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl space-y-5">
        <div>
          <h3 className="font-display font-black text-lg text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold" />
            Milestones & Achievements
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Permanent accolades unlocked through real-world habit mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REAL_ACHIEVEMENTS.map((ach) => {
            const Icon = ach.icon;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all ${
                  ach.unlocked
                    ? 'bg-background/60 border-gold/40 shadow-lg shadow-gold/5'
                    : 'bg-background/30 border-border/40 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                      ach.unlocked
                        ? 'bg-gold/15 border-gold/40 text-gold'
                        : 'bg-secondary border-border text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-foreground truncate">
                      {ach.title}
                    </h4>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {ach.progress}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-snug">
                  {ach.desc}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  {ach.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <div className="w-full space-y-1">
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${ach.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
