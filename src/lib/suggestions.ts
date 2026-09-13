import { AttributeType, TaskDifficulty, TaskRecurrence } from '@/types/game';
import {
  Brain,
  Shield,
  Clock,
  Sparkles,
  Users,
  Dumbbell,
  BookOpen,
  Target,
  PenTool,
  MessageCircle,
} from 'lucide-react';

export interface SuggestedQuest {
  id: string;
  title: string;
  description: string;
  attribute: AttributeType;
  difficulty: TaskDifficulty;
  recurrence: TaskRecurrence;
  category: string;
  iconName: 'Brain' | 'Shield' | 'Clock' | 'Sparkles' | 'Users' | 'Dumbbell' | 'BookOpen' | 'Target' | 'PenTool' | 'MessageCircle';
  badgeColor: string;
}

export const STARTER_QUEST_SUGGESTIONS: SuggestedQuest[] = [
  // Intellect
  {
    id: 'sug-int-1',
    title: 'Read 10 pages of a non-fiction book',
    description: 'Expand your mental schema and gain real-world wisdom.',
    attribute: 'intellect',
    difficulty: 'easy',
    recurrence: 'daily',
    category: 'Knowledge',
    iconName: 'BookOpen',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
  },
  {
    id: 'sug-int-2',
    title: 'Learn 1 new programming or technical concept',
    description: 'Deep dive into an architecture pattern, data structure, or library.',
    attribute: 'intellect',
    difficulty: 'medium',
    recurrence: 'one_time',
    category: 'Engineering',
    iconName: 'Brain',
    badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
  },

  // Strength / Health
  {
    id: 'sug-str-1',
    title: '20 pushups and 5-minute morning stretch',
    description: 'Awaken your physical vessel and kickstart dopamine circulation.',
    attribute: 'strength',
    difficulty: 'easy',
    recurrence: 'daily',
    category: 'Fitness',
    iconName: 'Dumbbell',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
  },
  {
    id: 'sug-str-2',
    title: 'Brisk 20-minute power walk outdoors',
    description: 'Clear your mind, absorb sunlight, and recharge physical stamina.',
    attribute: 'strength',
    difficulty: 'easy',
    recurrence: 'daily',
    category: 'Health',
    iconName: 'Shield',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  },

  // Discipline / Focus
  {
    id: 'sug-disc-1',
    title: 'Define top 3 priorities for today',
    description: 'Cut through noise and establish total clarity on your main objectives.',
    attribute: 'discipline',
    difficulty: 'easy',
    recurrence: 'daily',
    category: 'Focus',
    iconName: 'Target',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  },
  {
    id: 'sug-disc-2',
    title: '25-minute Pomodoro deep work block',
    description: 'Pure, uninterrupted focus with phone muted and tabs closed.',
    attribute: 'discipline',
    difficulty: 'medium',
    recurrence: 'daily',
    category: 'Productivity',
    iconName: 'Clock',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
  },
  {
    id: 'sug-disc-3',
    title: 'Drink 1 liter of fresh water before noon',
    description: 'Essential biological fuel to sustain mental clarity and focus.',
    attribute: 'discipline',
    difficulty: 'easy',
    recurrence: 'daily',
    category: 'Vitality',
    iconName: 'Sparkles',
    badgeColor: 'border-teal-500/30 text-teal-400 bg-teal-500/10',
  },

  // Creativity
  {
    id: 'sug-cre-1',
    title: 'Write 1 journal entry or creative idea',
    description: 'Document thoughts, design insights, or brainstorming notes.',
    attribute: 'creativity',
    difficulty: 'easy',
    recurrence: 'daily',
    category: 'Ideation',
    iconName: 'PenTool',
    badgeColor: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
  },

  // Social
  {
    id: 'sug-soc-1',
    title: 'Send a genuine check-in message to a friend',
    description: 'Cultivate meaningful bonds and strengthen your party alliance.',
    attribute: 'social',
    difficulty: 'easy',
    recurrence: 'daily',
    category: 'Allies',
    iconName: 'MessageCircle',
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
  },
];

export function getIconComponent(iconName: SuggestedQuest['iconName']) {
  switch (iconName) {
    case 'Brain': return Brain;
    case 'Shield': return Shield;
    case 'Clock': return Clock;
    case 'Sparkles': return Sparkles;
    case 'Users': return Users;
    case 'Dumbbell': return Dumbbell;
    case 'BookOpen': return BookOpen;
    case 'Target': return Target;
    case 'PenTool': return PenTool;
    case 'MessageCircle': return MessageCircle;
    default: return Sparkles;
  }
}

/**
 * Dynamic motivational prompts based on player state
 */
export function getDailyMotivation(tasksCompletedToday: number, streak: number) {
  if (tasksCompletedToday === 0) {
    if (streak === 0) {
      return {
        title: 'Begin Your Heroic Journey',
        text: 'Every master started as a novice. Pick a starter quest below to earn your first XP and set your legend in motion.',
        badge: 'Day 1 Awakening',
      };
    }
    return {
      title: 'Keep Your Flame Burning',
      text: `Your ${streak}-day streak is active! Complete any quest today before midnight to maintain your XP multiplier.`,
      badge: `${streak} Day Streak Active`,
    };
  }

  if (tasksCompletedToday < 3) {
    const remaining = 3 - tasksCompletedToday;
    return {
      title: 'Momentum is Surging',
      text: `Outstanding effort! Complete ${remaining} more quest${remaining > 1 ? 's' : ''} to unlock today's Mystery Adventure Loot Chest.`,
      badge: `${tasksCompletedToday}/3 Daily Milestone`,
    };
  }

  return {
    title: 'Daily Conquest Complete!',
    text: 'You have conquered today’s daily trials! Claim your Mystery Loot Chest and forge ahead for bonus glory.',
    badge: 'Daily Chest Ready',
  };
}

/**
 * Advice based on lowest attribute
 */
export function getAttributeGuidance(attrScores: {
  intellect: number;
  strength: number;
  discipline: number;
  creativity: number;
  social: number;
}) {
  const entries = Object.entries(attrScores) as [AttributeType, number][];
  entries.sort((a, b) => a[1] - b[1]);
  const lowest = entries[0];

  switch (lowest[0]) {
    case 'strength':
      return {
        attribute: 'strength',
        advice: 'Your Strength is your lowest stat. Adding a physical workout or movement quest will balance your hero build and boost stamina.',
        recommendedCategory: 'Fitness',
      };
    case 'intellect':
      return {
        attribute: 'intellect',
        advice: 'Sharpen your mental blade! Complete a reading or study quest to amplify your Intellect attribute.',
        recommendedCategory: 'Knowledge',
      };
    case 'discipline':
      return {
        attribute: 'discipline',
        advice: 'Discipline forges champions. Commit to structured deep work blocks and habit streaks to raise your core focus.',
        recommendedCategory: 'Focus',
      };
    case 'creativity':
      return {
        attribute: 'creativity',
        advice: 'Unlock new perspectives! Add a creative writing, brainstorming, or design challenge to broaden your repertoire.',
        recommendedCategory: 'Ideation',
      };
    case 'social':
      return {
        attribute: 'social',
        advice: 'Solo quests are great, but alliances win wars. Reconnect with a peer, friend, or collaborator to boost your Social stat.',
        recommendedCategory: 'Allies',
      };
  }
}
