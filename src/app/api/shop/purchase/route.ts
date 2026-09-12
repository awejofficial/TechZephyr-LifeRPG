import { createClient } from '@/lib/supabase/server';
import { purchaseItemSchema } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';

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
    const { itemId } = purchaseItemSchema.parse(body);

    const { data: result, error } = await supabase.rpc('purchase_item_transaction', {
      p_user_id: user.id,
      p_item_id: itemId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (result && result.success === false) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'name' in err && err.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: err }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
