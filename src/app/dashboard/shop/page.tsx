'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserProfile, ShopItem } from '@/types/game';
import {
  Coins,
  Sparkles,
  Sword,
  Shield,
  Award,
  Zap,
  Check,
  Flame,
  Palette,
  ShoppingBag,
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function ShopPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'All' | 'theme' | 'streak_freeze' | 'badge'>('All');

  // Fetch character profile for real gold balance
  const { data: profileData } = useQuery<{ profile: UserProfile }>({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character');
      if (!res.ok) throw new Error('Failed to load character');
      return res.json();
    },
  });

  // Fetch real shop items from Supabase
  const { data: shopData, isLoading: isShopLoading } = useQuery<{ items: ShopItem[] }>({
    queryKey: ['shop'],
    queryFn: async () => {
      const res = await fetch('/api/shop');
      if (!res.ok) throw new Error('Failed to load shop items');
      return res.json();
    },
  });

  const gold = profileData?.profile?.gold ?? 0;
  const items = shopData?.items || [];

  // Purchase mutation calling real Supabase RPC
  const purchaseMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to purchase item');
      }
      return json;
    },
    onSuccess: () => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff', '#00f0ff'],
      });
      queryClient.invalidateQueries({ queryKey: ['shop'] });
      queryClient.invalidateQueries({ queryKey: ['character'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Could not complete purchase.');
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

  const getItemGradient = (type: string) => {
    switch (type) {
      case 'theme':
        return 'from-pink-600/30 via-purple-900/40 to-card border-pink-500/30';
      case 'streak_freeze':
        return 'from-cyan-600/30 via-blue-900/40 to-card border-cyan-500/30';
      case 'badge':
        return 'from-amber-600/30 via-yellow-900/40 to-card border-amber-500/30';
      default:
        return 'from-primary/30 via-accent/20 to-card border-primary/30';
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === 'All') return true;
    return item.item_type === activeTab;
  });

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground tracking-tight">
            Realm Shop & Vault
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Spend gold earned from real-life habits on themes, titles, and streak relics.
          </p>
        </div>

        {/* Vault Gold Counter */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card border border-gold/40 shadow-lg text-gold font-mono font-bold text-sm shrink-0">
          <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center border border-gold">
            <Coins className="w-3.5 h-3.5 text-gold" />
          </div>
          <span className="text-foreground text-base font-black">
            {gold.toLocaleString()} Gold
          </span>
        </div>
      </div>

      {/* Low Gold Motivation Banner */}
      {gold < 30 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
          <Coins className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-200">
            <strong>Need more gold?</strong> Complete daily quests in your Quest Log to earn gold rewards and unlock exclusive themes and badges!
          </p>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
        {[
          { id: 'All', label: 'All Items' },
          { id: 'theme', label: '🎨 Themes' },
          { id: 'streak_freeze', label: '❄️ Streak Freezes' },
          { id: 'badge', label: '🏅 Badges' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Store Cards Grid */}
      {isShopLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-card/60 rounded-3xl border border-border/50 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-border/70 bg-card/40">
          <ShoppingBag className="w-12 h-12 text-primary mx-auto mb-3 opacity-80" />
          <h3 className="font-display font-bold text-base text-foreground">
            No items in this category
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const Icon = getItemIcon(item.item_type);
            const gradient = getItemGradient(item.item_type);
            const isOwned = item.is_owned;
            const canAfford = gold >= item.price_gold;

            return (
              <div
                key={item.id}
                className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-3xl p-5 shadow-2xl flex flex-col justify-between group hover:border-primary/50 transition-all hover:scale-[1.02]"
              >
                {/* Visual Box */}
                <div
                  className={`relative aspect-[16/10] rounded-2xl bg-gradient-to-br ${gradient} border flex items-center justify-center mb-4 overflow-hidden`}
                >
                  <Icon className="w-12 h-12 text-foreground transform group-hover:scale-125 transition-transform duration-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" />

                  {isOwned && (
                    <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      OWNED
                    </span>
                  )}
                </div>

                {/* Item Info */}
                <div>
                  <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {item.description || 'Special cosmetic or relic for your hero profile.'}
                  </p>

                  {/* Purchase Bar */}
                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-gold font-mono font-black text-sm">
                      <Coins className="w-4 h-4 text-gold" />
                      <span>{item.price_gold} Gold</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!isOwned && canAfford && !purchaseMutation.isPending) {
                          purchaseMutation.mutate(item.id);
                        }
                      }}
                      disabled={isOwned || !canAfford || purchaseMutation.isPending}
                      className={`py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                        isOwned
                          ? 'bg-secondary text-muted-foreground cursor-default'
                          : canAfford
                          ? 'bg-gold text-black hover:bg-gold/90 shadow-md shadow-gold/20 active:scale-95'
                          : 'bg-secondary/60 text-muted-foreground cursor-not-allowed border border-border/40'
                      }`}
                    >
                      {isOwned
                        ? 'Owned'
                        : canAfford
                        ? 'Purchase'
                        : 'Need More Gold'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
