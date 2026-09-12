import { createClient } from '@/lib/supabase/server';
import { updateTaskSchema } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: task, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json({ task });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = updateTaskSchema.parse(body);

    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !task) {
      return NextResponse.json({ error: 'Task not found or update failed' }, { status: 400 });
    }

    await supabase.from('task_logs').insert({
      user_id: user.id,
      task_id: task.id,
      action: 'updated',
      task_snapshot: task,
    });

    return NextResponse.json({ task });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'name' in err && err.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: err }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch before delete for audit logging
  const { data: existingTask } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (existingTask) {
    await supabase.from('task_logs').insert({
      user_id: user.id,
      task_id: existingTask.id,
      action: 'deleted',
      task_snapshot: existingTask,
    });
  }

  return NextResponse.json({ success: true });
}
