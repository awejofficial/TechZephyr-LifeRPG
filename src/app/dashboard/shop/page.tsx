'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShopItem, UserProfile } from '@/types/game';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ShoppingBag, Coins, Sparkles, Check, Palette, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShopPage() {
  const queryClient = useQueryClient();
  const { setTheme } = useTheme();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch shop items
  const { data: shopData, isLoading: isShopLoading } = useQuery<{ items: ShopItem[] }>({
    queryKey: ['shop'],
    queryFn: async () => {
      const res = await fetch('/api/shop');
      if (!res.ok) throw new Error('Failed to load shop items');
      return res.json();
    },
  });

  // Fetch character profile for gold balance
  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['character'],
    queryFn: async () => {
      const res = await fetch('/api/character');
      if (!res.ok) throw new Error('Failed to load profile');
      const json = await res.json();
      return json.profile;
    },
  });

  const gold = profile?.gold ?? 0;
  const items = shopData?.items || [];

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (itemId: string) => {
      setErrorMessage(null);
      setSuccessMessage(null);
      const res = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to purchase item');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop'] });
      queryClient.invalidateQueries({ queryKey: ['character'] });
      setSuccessMessage('Purchase successful! Item added to your inventory.');
    },
    onError: (err: Error) => {
      setErrorMessage(err.message);
    },
  });

  // Equip mutation
  const equipMutation = useMutation({
    mutationFn: async (item: ShopItem) => {
      setErrorMessage(null);
      setSuccessMessage(null);
      const res = await fetch('/api/shop/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to equip theme');
      }
      return { data, slug: item.theme_config?.slug || 'default' };
    },
    onSuccess: ({ slug }) => {
      queryClient.invalidateQueries({ queryKey: ['shop'] });
      queryClient.invalidateQueries({ queryKey: ['character'] });
      setTheme(slug);
      setSuccessMessage(`Theme equipped! Visual tokens updated.`);
    },
    onError: (err: Error) => {
      setErrorMessage(err.message);
    },
  });

  return (
    <div className="space-y-6">
      {/* Shop Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-card via-card to-secondary/60 border border-border/80 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-primary" />
            Adventurer's Bazaar
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Exchange your hard-earned quest gold for visual themes, relics, and status titles.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold/15 border border-gold/40 text-gold font-bold text-base shadow-sm shrink-0">
          <Coins className="w-5 h-5 text-gold fill-gold/30" />
          <span className="font-mono text-lg">{gold.toLocaleString()} Gold</span>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Catalog Grid */}
      {isShopLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-card/40 rounded-2xl border border-border/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const isTheme = item.item_type === 'theme';
            const canAfford = gold >= item.price_gold;

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', damping: 20 }}
                className={`flex flex-col justify-between bg-card border rounded-2xl p-5 shadow-sm transition-colors ${
                  item.is_equipped ? 'border-primary shadow-md glow-primary' : 'border-border hover:border-primary/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-lg">
                        {isTheme ? <Palette className="w-5 h-5 text-primary" /> : item.asset_url || <Shield className="w-5 h-5 text-gold" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-foreground leading-snug">{item.name}</h3>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                          {item.item_type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {item.is_equipped ? (
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider">
                        Equipped
                      </span>
                    ) : item.is_owned ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        Owned
                      </span>
                    ) : (
                      <span className="font-mono font-bold text-sm text-gold flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        {item.price_gold}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Visual theme palette swatches */}
                  {isTheme && item.theme_config && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary/50 border border-border/70 mb-4">
                      <span className="text-[10px] text-muted-foreground font-semibold">Palette:</span>
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: item.theme_config.primary }}
                        title="Primary"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: item.theme_config.secondary }}
                        title="Secondary"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: item.theme_config.bg }}
                        title="Background"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-border/70">
                  {item.is_equipped ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 px-3 rounded-xl bg-primary/20 text-primary font-bold text-xs cursor-default flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Active Theme</span>
                    </button>
                  ) : item.is_owned && isTheme ? (
                    <button
                      type="button"
                      onClick={() => equipMutation.mutate(item)}
                      disabled={equipMutation.isPending}
                      className="w-full py-2 px-3 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground font-bold text-xs transition-colors border border-border shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Equip Theme</span>
                    </button>
                  ) : item.is_owned ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 px-3 rounded-xl bg-secondary text-muted-foreground font-semibold text-xs cursor-default"
                    >
                      In Inventory
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => purchaseMutation.mutate(item.id)}
                      disabled={!canAfford || purchaseMutation.isPending}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${
                        canAfford
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{canAfford ? `Purchase for ${item.price_gold} Gold` : 'Insufficient Gold'}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
