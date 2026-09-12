export type AttributeType = 'strength' | 'intellect' | 'creativity' | 'discipline' | 'social';

export type TaskDifficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'epic';

export type TaskRecurrence = 'one_time' | 'daily' | 'weekly' | 'monthly';

export interface UserProfile {
  id: string;
  username: string | null;
  email: string | null;
  level: number;
  current_xp: number;
  total_xp_earned: number;
  gold: number;
  strength_xp: number;
  intellect_xp: number;
  creativity_xp: number;
  discipline_xp: number;
  social_xp: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  active_theme: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  attribute: AttributeType;
  difficulty: TaskDifficulty;
  recurrence: TaskRecurrence;
  due_date: string | null;
  is_completed: boolean;
  completed_at: string | null;
  times_completed: number;
  last_completed_at: string | null;
  completion_cooldown_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  item_type: 'theme' | 'avatar_accessory' | 'badge' | 'streak_freeze' | 'cosmetic';
  price_gold: number;
  theme_config: {
    slug: string;
    primary: string;
    secondary: string;
    bg: string;
    surface: string;
  } | null;
  asset_url: string | null;
  is_active: boolean;
  created_at: string;
  is_owned?: boolean;
  is_equipped?: boolean;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  item_id: string;
  is_equipped: boolean;
  purchased_at: string;
  item?: ShopItem;
}

export interface XPEvent {
  id: number;
  user_id: string;
  task_id: string | null;
  xp_amount: number;
  gold_amount: number;
  source: string;
  created_at: string;
}

export interface TaskLog {
  id: number;
  user_id: string;
  task_id: string | null;
  action: string;
  task_snapshot: Record<string, unknown> | null;
  created_at: string;
}

export interface LevelUpEventDetail {
  newLevel: number;
  levelsGained: number;
  xpGained: number;
  goldGained: number;
  attribute: AttributeType;
  attrXp: number;
}
