'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { LevelUpEventDetail } from '@/types/game';
import { Sparkles, Trophy, Shield, Brain, Palette, Clock, Users, ArrowRight } from 'lucide-react';

const attributeIcons = {
  strength: Shield,
  intellect: Brain,
  creativity: Palette,
  discipline: Clock,
  social: Users,
};

function playVictoryChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.4);
    });
  } catch {
    // Audio context may be restricted by browser policy before interaction
  }
}

export function LevelUpOverlay() {
  const [levelUpData, setLevelUpData] = useState<LevelUpEventDetail | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<LevelUpEventDetail>;
      setLevelUpData(customEvent.detail);

      playVictoryChime();

      // Fire celebratory confetti bursts
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#f59e0b', '#10b981', '#06b6d4', '#ec4899'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#8b5cf6', '#f59e0b'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#06b6d4', '#ec4899'],
        });
      }, 250);
    };

    window.addEventListener('life-rpg-levelup', handler);
    return () => window.removeEventListener('life-rpg-levelup', handler);
  }, []);

  const handleClose = () => {
    setLevelUpData(null);
  };

  if (!levelUpData) return null;

  const AttrIcon = attributeIcons[levelUpData.attribute] || Trophy;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.7, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280 }}
          className="relative max-w-md w-full bg-card border-2 border-primary/50 rounded-2xl p-6 md:p-8 shadow-2xl text-center glow-primary overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gold/20 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', damping: 15 }}
            className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg mb-4"
          >
            <Trophy className="w-10 h-10 text-primary-foreground" />
          </motion.div>

          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs uppercase tracking-widest font-bold text-accent mb-1 flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Advancement Achieved <Sparkles className="w-3.5 h-3.5" />
          </motion.p>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-gold mb-2"
          >
            LEVEL {levelUpData.newLevel}
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground mb-6"
          >
            Your persistence has yielded great power. Your character has evolved!
          </motion.p>

          {/* Stat increases box */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="bg-secondary/40 border border-border/80 rounded-xl p-4 mb-6 space-y-2 text-left"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <AttrIcon className="w-4 h-4 text-primary" />
                <span className="capitalize">{levelUpData.attribute} Stat</span>
              </span>
              <span className="font-bold text-accent">+{levelUpData.attrXp} XP</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <span className="text-base">🪙</span> Gold Earned
              </span>
              <span className="font-bold text-gold">+{levelUpData.goldGained} Gold</span>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClose}
            className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <span>Claim Glory</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
