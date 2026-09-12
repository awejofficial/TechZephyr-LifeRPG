import { createClient } from '@/lib/supabase/server';
import { xpForLevel } from '@/lib/xp-engine';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch or ensure character profile exists
  let { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    // If not created by trigger yet, insert initial profile
    const { data: newProfile, error: insertError } = await supabase
      .from('users')
      .upsert(
        {
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'Adventurer',
          email: user.email,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    profile = newProfile;
  }

  const xpNeeded = xpForLevel(profile.level);
  const xpProgressPercent = Math.min(100, Math.round((profile.current_xp / xpNeeded) * 100));

  return NextResponse.json({
    profile: {
      ...profile,
      xp_for_next_level: xpNeeded,
      xp_progress_percent: xpProgressPercent,
    },
  });
}
