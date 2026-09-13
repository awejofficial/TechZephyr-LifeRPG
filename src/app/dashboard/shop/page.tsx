'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '@/types/game';
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
  Eye,
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const SHOP_ITEMS = [
  {
    id: 'forest-realm',
    title: 'Forest Realm Theme',
    category: 'Themes',
    price: 800,
    badge: 'Popular',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: Palette,
    gradient: 'from-emerald-600/30 via-teal-900/40 to-card',
    desc: 'Verdant nature theme with organic glowing emerald accents.',
  },
  {
    id: 'cyberpunk-neon',
    title: 'Cyberpunk Theme',
    category: 'Themes',
    price: 800,
    badge: 'New',
    badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    icon: Sparkles,
    gradient: 'from-pink-600/30 via-purple-900/40 to-card',
    desc: 'High-contrast obsidian theme with hot pink and electric cyan lasers.',
  },
  {
    id: 'dragon-avatar',
    title: 'Dragon Avatar',
    category: 'Avatars',
    price: 600,
    badge: 'Hot',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    icon: Flame,
    gradient: 'from-orange-600/30 via-red-900/40 to-card',
    desc: 'Fierce draconic avatar frame with fiery particle aura.',
  },
  {
    id: 'xp-aura',
    title: 'XP Aura Effect',
    category: 'Effects',
    price: 400,
    badge: null,
    badgeColor: '',
    icon: Zap,
    gradient: 'from-cyan-600/30 via-blue-900/40 to-card',
    desc: 'Cosmic glowing aura pulsing around your profile card.',
  },
  {
    id: 'pixel-sword',
    title: 'Pixel Sword',
    category: 'Featured',
    price: 300,
    badge: null,
    badgeColor: '',
    icon: Sword,
    gradient: 'from-purple-600/30 via-indigo-900/40 to-card',
    desc: '16-bit enchanted blade for completing high-difficulty quests.',
  },
  {
    id: 'golden-badge',
    title: 'Golden Badge',
    category: 'Badges',
    price: 500,
    badge: null,
    badgeColor: '',
    icon: Award,
    gradient: 'from-amber-600/30 via-yellow-900/40 to-card',
    desc: 'Prestige crest displayed next to your player alias on leaderboards.',
  },
];

export default function ShopPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'Featured' | 'Themes' | 'Avatars' | 'Effects' | 'Badges'>('Featured');
  const [ownedItems, setOwnedItems] = useState<string[]>(['pixel-sword']);

  const { data } = useQuery<{ profile: UserProfile }>({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character');
      if (!res.ok) throw new Error('Failed to load character');
      return res.json();
    },
  });

  const gold = data?.profile?.gold ?? 1240;

  const handlePurchase = (item: (typeof SHOP_ITEMS)[0]) => {
    if (ownedItems.includes(item.id)) return;
    if (gold < item.price) {
      alert('Insufficient Gold coins! Complete more quests to earn gold.');
      return;
    }

    setOwnedItems((prev) => [...prev, item.id]);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#ffffff'],
    });
  };

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (activeTab === 'Featured') return true;
    return item.category === activeTab;
  });

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header matching Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground tracking-tight">
            Shop
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Spend your gold. Upgrade your journey.
          </p>
        </div>

        {/* Vault Gold Counter matching Reference */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card border border-gold/40 shadow-lg text-gold font-mono font-bold text-sm shrink-0">
          <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center border border-gold">
            <Coins className="w-3.5 h-3.5 text-gold" />
          </div>
          <span className="text-foreground text-base font-black">
            {gold.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
        {(['Featured', 'Themes', 'Avatars', 'Effects', 'Badges'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
              activeTab === tab
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Store Cards Grid matching Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isOwned = ownedItems.includes(item.id);
          return (
            <div
              key={item.id}
              className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-3xl p-5 shadow-2xl flex flex-col justify-between group hover:border-primary/50 transition-all hover:scale-[1.02]"
            >
              {/* Visual Box */}
              <div
                className={`relative aspect-[16/10] rounded-2xl bg-gradient-to-br ${item.gradient} border border-white/10 flex items-center justify-center mb-4 overflow-hidden`}
              >
                <Icon className="w-12 h-12 text-foreground transform group-hover:scale-125 transition-transform duration-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" />

                {item.badge && (
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Item Info */}
              <div>
                <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>

                {/* Purchase Bar */}
                <div className="mt-5 flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-gold font-mono font-black text-sm">
                    <Coins className="w-4 h-4 text-gold" />
                    <span>{item.price}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePurchase(item)}
                    disabled={isOwned}
                    className={`py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                      isOwned
                        ? 'bg-secondary text-muted-foreground cursor-default'
                        : 'bg-gold text-black hover:bg-gold/90 shadow-md shadow-gold/20 active:scale-95'
                    }`}
                  >
                    {isOwned ? 'Owned' : 'Buy Now'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
