import { createClient } from '@/lib/supabase/server';
import { completeTaskSchema } from '@/lib/validators';
import { calculateStreakBonus, REWARDS, xpForLevel } from '@/lib/xp-engine';
import { NextRequest, NextResponse } from 'next/server';

const MAX_EVENTS_PER_HOUR = 15;

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { taskId } = completeTaskSchema.parse(body);

    // 1. Fetch task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', user.id)
      .single();

    if (taskError || !task) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    // 2. Anti-cheat: Check if completed and cooldown
    const now = new Date();

    if (task.is_completed) {
      return NextResponse.json(
        { error: 'Quest already completed', message: 'This quest has already been fulfilled.' },
        { status: 409 }
      );
    }

    if (task.completion_cooldown_until && new Date(task.completion_cooldown_until) > now) {
      return NextResponse.json(
        {
          error: 'Cooldown active',
          message: 'This quest is on cooldown. Rest and recover!',
          retryAt: task.completion_cooldown_until,
        },
        { status: 429 }
      );
    }

    // 3. Anti-cheat: Rate limit check (max 15 completions/hour)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const { count: recentEvents } = await supabase
      .from('xp_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', oneHourAgo);

    if (recentEvents && recentEvents >= MAX_EVENTS_PER_HOUR) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many quests completed in the last hour. Pacing is key to mastery!',
        },
        { status: 429 }
      );
    }

    // 4. Server-side reward calculation
    const rewardConfig = REWARDS[task.difficulty as keyof typeof REWARDS] || REWARDS.medium;
    const cooldownUntil = new Date(now.getTime() + rewardConfig.cooldownMs);

    // 5. Fetch current user character stats
    const { data: profile, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const todayStr = now.toISOString().split('T')[0];
    const { newStreak, streakBonus } = calculateStreakBonus(
      profile.current_streak,
      profile.last_active_date,
      todayStr
    );

    const bonusXp = Math.floor(rewardConfig.xp * streakBonus);
    const totalXpGain = rewardConfig.xp + bonusXp;

    // 6. Calculate non-linear level progression
    let currentLevel = profile.level;
    let currentXp = profile.current_xp + totalXpGain;
    let levelsGained = 0;

    while (currentXp >= xpForLevel(currentLevel)) {
      currentXp -= xpForLevel(currentLevel);
      currentLevel += 1;
      levelsGained += 1;
    }

    // 7. Atomic database transaction
    const { error: rpcError } = await supabase.rpc('complete_task_transaction', {
      p_task_id: taskId,
      p_user_id: user.id,
      p_xp_gain: totalXpGain,
      p_gold_gain: rewardConfig.gold,
      p_attr_xp: rewardConfig.attrXp,
      p_attribute: task.attribute,
      p_new_level: currentLevel,
      p_new_xp: currentXp,
      p_new_streak: newStreak,
      p_today: todayStr,
      p_cooldown_until: cooldownUntil.toISOString(),
    });

    if (rpcError) {
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      xpGained: totalXpGain,
      baseXp: rewardConfig.xp,
      bonusXp,
      goldGained: rewardConfig.gold,
      attributeGained: {
        attribute: task.attribute,
        amount: rewardConfig.attrXp,
      },
      streak: {
        current: newStreak,
        streakBonusApplied: bonusXp > 0,
      },
      levelUp:
        levelsGained > 0
          ? {
              newLevel: currentLevel,
              levelsGained,
              xpGained: totalXpGain,
              goldGained: rewardConfig.gold,
              attribute: task.attribute,
              attrXp: rewardConfig.attrXp,
            }
          : null,
      cooldownUntil: cooldownUntil.toISOString(),
    });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'name' in err && err.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: err }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
