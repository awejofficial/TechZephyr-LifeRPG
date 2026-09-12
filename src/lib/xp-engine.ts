import { TaskDifficulty } from '@/types/game';

export interface RewardConfig {
  xp: number;
  gold: number;
  attrXp: number;
  cooldownMs: number;
}

export const REWARDS: Record<TaskDifficulty, RewardConfig> = {
  trivial: { xp: 5, gold: 2, attrXp: 1, cooldownMs: 30 * 60 * 1000 },
  easy: { xp: 10, gold: 5, attrXp: 2, cooldownMs: 2 * 60 * 60 * 1000 },
  medium: { xp: 20, gold: 10, attrXp: 4, cooldownMs: 4 * 60 * 60 * 1000 },
  hard: { xp: 50, gold: 25, attrXp: 10, cooldownMs: 12 * 60 * 60 * 1000 },
  epic: { xp: 100, gold: 50, attrXp: 20, cooldownMs: 24 * 60 * 60 * 1000 },
};

/**
 * Calculates XP required to advance from `level` to `level + 1`.
 * Uses a non-linear exponential curve with a 1.2 multiplier:
 * Lv 1→2: 100 XP
 * Lv 2→3: 120 XP
 * Lv 3→4: 144 XP
 * Lv 4→5: 172 XP
 * Lv 5→6: 207 XP
 * Lv 10→11: 515 XP
 */
export function xpForLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  return Math.floor(100 * Math.pow(1.2, safeLevel - 1));
}

/**
 * Cumulative XP required to reach `level` starting from level 1.
 */
export function cumulativeXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return total;
}

/**
 * Calculate streak update and bonus multiplier.
 * Streak adds +5% XP per streak day, capped at +50% (10-day streak).
 */
export function calculateStreakBonus(currentStreak: number, lastActiveDate: string | null, todayStr: string): {
  newStreak: number;
  streakBonus: number;
  isStreakActive: boolean;
} {
  let newStreak = currentStreak;
  let streakBonusPercent = 0;

  if (!lastActiveDate) {
    newStreak = 1;
  } else if (lastActiveDate === todayStr) {
    // Already active today
    newStreak = currentStreak;
  } else {
    // Check if consecutive
    const lastDate = new Date(lastActiveDate + 'T00:00:00Z');
    const today = new Date(todayStr + 'T00:00:00Z');
    const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      newStreak = currentStreak + 1;
    } else {
      newStreak = 1; // Streak reset
    }
  }

  streakBonusPercent = Math.min(0.5, newStreak * 0.05);

  return {
    newStreak,
    streakBonus: streakBonusPercent,
    isStreakActive: newStreak > 0,
  };
}
