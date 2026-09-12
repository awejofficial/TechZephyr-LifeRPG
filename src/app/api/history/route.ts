import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: xpEvents, error: xpError } = await supabase
    .from('xp_events')
    .select('*, tasks(title, attribute, difficulty)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (xpError) {
    return NextResponse.json({ error: xpError.message }, { status: 500 });
  }

  const { data: taskLogs, error: logError } = await supabase
    .from('task_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 });
  }

  return NextResponse.json({ xpEvents, taskLogs });
}
