'use client';

import { useState } from 'react';
import {
  Sword,
  Shield,
  Award,
  Sparkles,
  FlaskConical,
  GraduationCap,
  Trophy,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

const INVENTORY_ITEMS = [
  {
    id: 'code-sword',
    name: 'Code Sword',
    category: 'Equipment',
    type: 'Weapon',
    icon: Sword,
    price: 300,
    equipped: true,
    color: 'from-blue-500/20 to-cyan-500/10 border-cyan-500/40 text-cyan-400',
  },
  {
    id: 'focus-shield',
    name: 'Focus Shield',
    category: 'Equipment',
    type: 'Armor',
    icon: Shield,
    price: 350,
    equipped: false,
    color: 'from-purple-500/20 to-primary/10 border-primary/40 text-primary',
  },
  {
    id: 'scholar-hat',
    name: 'Scholar Hat',
    category: 'Equipment',
    type: 'Headgear',
    icon: GraduationCap,
    price: 200,
    equipped: false,
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400',
  },
  {
    id: 'cyber-theme',
    name: 'Cyber Theme',
    category: 'Themes',
    type: 'Theme',
    icon: Sparkles,
    price: 500,
    equipped: true,
    color: 'from-pink-500/20 to-rose-500/10 border-rose-500/40 text-rose-400',
  },
  {
    id: 'dragon-badge',
    name: 'Dragon Badge',
    category: 'Badges',
    type: 'Badge',
    icon: Award,
    price: 350,
    equipped: false,
    color: 'from-gold/20 to-amber-500/10 border-gold/40 text-gold',
  },
  {
    id: 'xp-potion',
    name: 'XP Potion',
    category: 'Equipment',
    type: 'Consumable x2',
    icon: FlaskConical,
    price: 100,
    equipped: false,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
  },
];

const ACHIEVEMENTS = [
  {
    id: 'a1',
    title: 'First Quest',
    desc: 'Complete your first quest.',
    icon: Trophy,
    unlocked: true,
    progress: '1/1',
  },
  {
    id: 'a2',
    title: '7 Day Streak',
    desc: 'Maintain a 7-day streak.',
    icon: Trophy,
    unlocked: true,
    progress: '7/7',
  },
  {
    id: 'a3',
    title: 'Knowledge Seeker',
    desc: 'Complete 50 learning quests.',
    icon: Shield,
    unlocked: false,
    progress: '37/50',
    percent: 74,
  },
  {
    id: 'a4',
    title: 'Quest Master',
    desc: 'Complete 100 quests.',
    icon: Award,
    unlocked: false,
    progress: '37/100',
    percent: 37,
  },
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Equipment' | 'Themes' | 'Badges'>('All');
  const [items, setItems] = useState(INVENTORY_ITEMS);

  const filteredItems = items.filter((item) => {
    if (activeTab === 'All') return true;
    return item.category === activeTab;
  });

  const toggleEquip = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, equipped: !item.equipped };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header matching Reference */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground tracking-tight">
          Inventory
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Your collection of rewards and unlocks.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        {(['All', 'Equipment', 'Themes', 'Badges'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === tab
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Items Grid matching Reference */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xl flex flex-col justify-between group hover:border-primary/50 transition-all hover:scale-[1.03]"
            >
              {/* Top Item Visual Box */}
              <div
                className={`aspect-square rounded-xl bg-gradient-to-br ${item.color} border flex items-center justify-center mb-3 shadow-inner relative`}
              >
                <Icon className="w-8 h-8 transform group-hover:scale-110 transition-transform duration-300" />
                {item.equipped && (
                  <span className="absolute top-1.5 right-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500 text-black">
                    EQUIPPED
                  </span>
                )}
              </div>

              {/* Item Info */}
              <div>
                <h3 className="font-display font-bold text-xs sm:text-sm text-foreground truncate">
                  {item.name}
                </h3>
                <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                  {item.type}
                </span>

                <button
                  type="button"
                  onClick={() => toggleEquip(item.id)}
                  className={`mt-3 w-full py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                    item.equipped
                      ? 'bg-secondary text-muted-foreground hover:text-foreground'
                      : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30'
                  }`}
                >
                  {item.equipped ? 'Unequip' : 'Equip'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements Section matching Reference */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-lg text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" />
              Achievements
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Milestones of your journey.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-primary hover:underline cursor-pointer flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((ach) => {
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
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${ach.percent || 50}%` }}
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
