import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Shop items are visible to all users (even unauthenticated for previews)
  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('*')
    .eq('is_active', true)
    .order('price_gold', { ascending: true });

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ items: items.map((i) => ({ ...i, is_owned: false, is_equipped: false })) });
  }

  // Fetch user inventory
  const { data: inventory, error: invError } = await supabase
    .from('inventory')
    .select('item_id, is_equipped')
    .eq('user_id', user.id);

  if (invError) {
    return NextResponse.json({ error: invError.message }, { status: 500 });
  }

  const ownedMap = new Map(inventory.map((inv) => [inv.item_id, inv.is_equipped]));

  const enrichedItems = items.map((item) => ({
    ...item,
    is_owned: ownedMap.has(item.id),
    is_equipped: ownedMap.get(item.id) || false,
  }));

  return NextResponse.json({ items: enrichedItems });
}
