-- ============================================
-- Life RPG Database Schema & Functions
-- ============================================

create extension if not exists "uuid-ossp";

-- Enums
create type public.attribute_type as enum ('strength', 'intellect', 'creativity', 'discipline', 'social');
create type public.task_difficulty as enum ('trivial', 'easy', 'medium', 'hard', 'epic');
create type public.task_recurrence as enum ('one_time', 'daily', 'weekly', 'monthly');

-- 1. Users Table (Character State)
create table public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    username text,
    email text,
    level integer not null default 1,
    current_xp integer not null default 0,
    total_xp_earned bigint not null default 0,
    gold integer not null default 0,
    strength_xp integer not null default 0,
    intellect_xp integer not null default 0,
    creativity_xp integer not null default 0,
    discipline_xp integer not null default 0,
    social_xp integer not null default 0,
    current_streak integer not null default 0,
    longest_streak integer not null default 0,
    last_active_date date,
    active_theme text not null default 'default',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Tasks Table
create table public.tasks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    title text not null check (length(trim(title)) > 0 and length(title) <= 200),
    description text,
    attribute public.attribute_type not null default 'discipline',
    difficulty public.task_difficulty not null default 'medium',
    recurrence public.task_recurrence not null default 'one_time',
    due_date date,
    is_completed boolean not null default false,
    completed_at timestamptz,
    times_completed integer not null default 0,
    last_completed_at timestamptz,
    completion_cooldown_until timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 3. XP Events Table (Anti-cheat audit)
create table public.xp_events (
    id bigint primary key generated always as identity,
    user_id uuid not null references public.users(id) on delete cascade,
    task_id uuid references public.tasks(id) on delete set null,
    xp_amount integer not null,
    gold_amount integer not null,
    source text not null,
    created_at timestamptz not null default now()
);

create index idx_xp_events_user_time on public.xp_events(user_id, created_at desc);

-- 4. Task Logs Table
create table public.task_logs (
    id bigint primary key generated always as identity,
    user_id uuid not null references public.users(id) on delete cascade,
    task_id uuid references public.tasks(id) on delete set null,
    action text not null,
    task_snapshot jsonb,
    created_at timestamptz not null default now()
);

-- 5. Streak Events Table
create table public.streak_events (
    id bigint primary key generated always as identity,
    user_id uuid not null references public.users(id) on delete cascade,
    activity_date date not null,
    tasks_completed integer not null default 0,
    xp_earned integer not null default 0,
    created_at timestamptz not null default now(),
    unique(user_id, activity_date)
);

-- 6. Items Table (Shop Catalog)
create table public.items (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    item_type text not null check (item_type in ('theme', 'avatar_accessory', 'badge', 'streak_freeze', 'cosmetic')),
    price_gold integer not null check (price_gold > 0),
    theme_config jsonb,
    asset_url text,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

-- 7. Inventory Table
create table public.inventory (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    item_id uuid not null references public.items(id) on delete cascade,
    is_equipped boolean not null default false,
    purchased_at timestamptz not null default now(),
    unique(user_id, item_id)
);

-- RLS
alter table public.users enable row level security;
alter table public.tasks enable row level security;
alter table public.xp_events enable row level security;
alter table public.task_logs enable row level security;
alter table public.streak_events enable row level security;
alter table public.inventory enable row level security;
alter table public.items enable row level security;

-- Policies
create policy "users_select_own" on public.users for select to authenticated using ((select auth.uid()) = id);
create policy "users_update_own" on public.users for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "users_insert_own" on public.users for insert to authenticated with check ((select auth.uid()) = id);

create policy "tasks_select_own" on public.tasks for select to authenticated using ((select auth.uid()) = user_id);
create policy "tasks_insert_own" on public.tasks for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "tasks_update_own" on public.tasks for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "tasks_delete_own" on public.tasks for delete to authenticated using ((select auth.uid()) = user_id);

create policy "xp_events_select_own" on public.xp_events for select to authenticated using ((select auth.uid()) = user_id);
create policy "task_logs_select_own" on public.task_logs for select to authenticated using ((select auth.uid()) = user_id);
create policy "streak_events_select_own" on public.streak_events for select to authenticated using ((select auth.uid()) = user_id);

create policy "inventory_select_own" on public.inventory for select to authenticated using ((select auth.uid()) = user_id);
create policy "inventory_insert_own" on public.inventory for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "inventory_update_own" on public.inventory for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "items_select_active" on public.items for select to anon, authenticated using (is_active = true);

-- Stored Procedures
create or replace function public.complete_task_transaction(
    p_task_id uuid,
    p_user_id uuid,
    p_xp_gain integer,
    p_gold_gain integer,
    p_attr_xp integer,
    p_attribute attribute_type,
    p_new_level integer,
    p_new_xp integer,
    p_new_streak integer,
    p_today date,
    p_cooldown_until timestamptz
)
returns void as $$
begin
    if auth.uid() is distinct from p_user_id then
        raise exception 'Unauthorized: caller does not match target user';
    end if;

    update public.tasks set
        is_completed = true,
        completed_at = now(),
        last_completed_at = now(),
        completion_cooldown_until = p_cooldown_until,
        times_completed = times_completed + 1,
        updated_at = now()
    where id = p_task_id and user_id = p_user_id;
    
    update public.users set
        current_xp = p_new_xp,
        level = p_new_level,
        total_xp_earned = total_xp_earned + p_xp_gain,
        gold = gold + p_gold_gain,
        current_streak = p_new_streak,
        longest_streak = greatest(longest_streak, p_new_streak),
        last_active_date = p_today,
        updated_at = now(),
        strength_xp = case when p_attribute = 'strength' then strength_xp + p_attr_xp else strength_xp end,
        intellect_xp = case when p_attribute = 'intellect' then intellect_xp + p_attr_xp else intellect_xp end,
        creativity_xp = case when p_attribute = 'creativity' then creativity_xp + p_attr_xp else creativity_xp end,
        discipline_xp = case when p_attribute = 'discipline' then discipline_xp + p_attr_xp else discipline_xp end,
        social_xp = case when p_attribute = 'social' then social_xp + p_attr_xp else social_xp end
    where id = p_user_id;
    
    insert into public.xp_events (user_id, task_id, xp_amount, gold_amount, source)
    values (p_user_id, p_task_id, p_xp_gain, p_gold_gain, 'task_completion');
    
    insert into public.streak_events (user_id, activity_date, tasks_completed, xp_earned)
    values (p_user_id, p_today, 1, p_xp_gain)
    on conflict (user_id, activity_date)
    do update set 
        tasks_completed = streak_events.tasks_completed + 1,
        xp_earned = streak_events.xp_earned + p_xp_gain;
    
    insert into public.task_logs (user_id, task_id, action)
    values (p_user_id, p_task_id, 'completed');
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.purchase_item_transaction(
    p_user_id uuid,
    p_item_id uuid
)
returns jsonb as $$
declare
    v_item record;
    v_user_gold integer;
    v_inventory_id uuid;
begin
    if auth.uid() is distinct from p_user_id then
        raise exception 'Unauthorized: caller does not match target user';
    end if;

    select * into v_item from public.items where id = p_item_id and is_active = true;
    if not found then
        return jsonb_build_object('success', false, 'error', 'Item not found');
    end if;

    if exists (select 1 from public.inventory where user_id = p_user_id and item_id = p_item_id) then
        return jsonb_build_object('success', false, 'error', 'Item already owned');
    end if;

    select gold into v_user_gold from public.users where id = p_user_id for update;
    if v_user_gold < v_item.price_gold then
        return jsonb_build_object('success', false, 'error', 'Insufficient gold');
    end if;

    update public.users set
        gold = gold - v_item.price_gold,
        updated_at = now()
    where id = p_user_id;

    insert into public.inventory (user_id, item_id, is_equipped)
    values (p_user_id, p_item_id, false)
    returning id into v_inventory_id;

    return jsonb_build_object(
        'success', true,
        'item_id', p_item_id,
        'remaining_gold', v_user_gold - v_item.price_gold,
        'inventory_id', v_inventory_id
    );
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.equip_theme_transaction(
    p_user_id uuid,
    p_item_id uuid
)
returns jsonb as $$
declare
    v_item record;
begin
    if auth.uid() is distinct from p_user_id then
        raise exception 'Unauthorized: caller does not match target user';
    end if;

    if not exists (select 1 from public.inventory where user_id = p_user_id and item_id = p_item_id) then
        return jsonb_build_object('success', false, 'error', 'Item not owned');
    end if;

    select * into v_item from public.items where id = p_item_id;
    if not found or v_item.item_type != 'theme' then
        return jsonb_build_object('success', false, 'error', 'Item is not a theme');
    end if;

    update public.inventory inv
    set is_equipped = (inv.item_id = p_item_id)
    from public.items it
    where inv.item_id = it.id and inv.user_id = p_user_id and it.item_type = 'theme';

    update public.users set
        active_theme = coalesce(v_item.theme_config->>'slug', 'default'),
        updated_at = now()
    where id = p_user_id;

    return jsonb_build_object(
        'success', true,
        'theme_slug', coalesce(v_item.theme_config->>'slug', 'default')
    );
end;
$$ language plpgsql security definer set search_path = public;
