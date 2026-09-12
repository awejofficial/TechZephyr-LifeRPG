import { createClient } from '@/lib/supabase/server';
import { createTaskSchema } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tasks });
}

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
    const validated = createTaskSchema.parse(body);

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: validated.title,
        description: validated.description || null,
        attribute: validated.attribute,
        difficulty: validated.difficulty,
        recurrence: validated.recurrence,
        due_date: validated.due_date || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log task action
    await supabase.from('task_logs').insert({
      user_id: user.id,
      task_id: task.id,
      action: 'created',
      task_snapshot: task,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'name' in err && err.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: err }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
