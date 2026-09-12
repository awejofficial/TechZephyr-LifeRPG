# 🏗️ Life RPG — Complete Technical Architecture & Tech Stack

## 📌 Architecture Summary (TL;DR)

**A monolithic Next.js 14 application (App Router) with Supabase (PostgreSQL + Auth + RLS + Edge Functions) deployed on Vercel free tier.** All XP/currency/streak calculations execute **exclusively server-side** via Next.js API routes and Postgres triggers — the client can only ever send "task completed" events, never raw XP values. The frontend uses React with TanStack Query for optimistic UI, Framer Motion + Lottie for the game-feel layer, and Tailwind for the themed design system.

This gives you **one deployable codebase**, zero infrastructure management, and a fully functional, secure backend in under 48 hours — while concentrating 60% of your effort on the UX layer, which is where the competition is won.

---

## 🧱 1. The Big Picture — Layered Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        👤 USER (Browser)                         │
│              Mobile / Desktop / Tablet (Responsive)              │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼──────────────────────────────────┐
│                     🎨 PRESENTATION LAYER                        │
│  Next.js 14 App Router (React Server Components + Client)       │
│  ├── Framer Motion (spring animations, transitions)             │
│  ├── Lottie React (level-up bursts, particles)                  │
│  ├── TanStack Query (optimistic UI, cache, rollback)            │
│  ├── Zustand (local UI state: modals, theme)                    │
│  └── Tailwind CSS (themed design tokens)                        │
└──────────────────────────────┬──────────────────────────────────┘
                               │ API Routes (/api/*)
┌──────────────────────────────▼──────────────────────────────────┐
│                     ⚙️ APPLICATION LAYER                        │
│  Next.js API Routes (Node.js runtime)                           │
│  ├── /api/auth/*          → Supabase Auth proxy                 │
│  ├── /api/tasks/*         → CRUD + validation                   │
│  ├── /api/tasks/complete  → 🎯 THE XP ENGINE (anti-cheat core)  │
│  ├── /api/shop/*          → Economy / purchase logic            │
│  ├── /api/character/*     → Stats, level, inventory reads       │
│  └── /api/streak/*        → Streak calculation & update         │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Supabase JS Client
┌──────────────────────────────▼──────────────────────────────────┐
│                     💾 DATA LAYER (Supabase)                     │
│  ├── PostgreSQL (RLS enforced)                                  │
│  │   └── Tables, triggers, functions (server-side XP logic)     │
│  ├── Auth (email + OAuth, JWT sessions)                         │
│  ├── Row Level Security (per-user data isolation)               │
│  └── Storage (avatars, item images — if needed)                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                        ☁️ VERCEL + SUPABASE
                        (Free tier, $0 total)
```

---

## ⚙️ 2. Tech Stack — Why Each Choice

| Layer | Technology | Why This Over Alternatives |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Single codebase for frontend + API routes. Vercel-native deployment. React Server Components for fast initial loads. No separate backend server to manage. |
| **Language** | TypeScript | Type-safe DB schema mapping. Catches XP/currency calculation bugs at compile time. Non-negotiable for financial-like logic (XP/Gold). |
| **Styling** | Tailwind CSS + CSS Custom Properties | Design tokens (colors, spacing, typography) as CSS variables → theme swapping (shop-purchased themes) becomes trivial. No runtime CSS-in-JS overhead. |
| **Animation** | Framer Motion | Spring physics (stiffness/damping) for natural game feel. Layout animations for smooth reflows. Declarative, no manual rAF management. |
| **Particle FX** | Lottie + lottie-react | Pre-made level-up animations from LottieFiles. JSON-based, GPU-accelerated, tiny file size. No canvas/WebGL complexity. |
| **Data/Cache** | TanStack Query (React Query) | Built-in optimistic updates with automatic rollback on error. Cache invalidation. Loading/error state management. This is the backbone of "feels like native." |
| **Local UI State** | Zustand | Lightweight store for UI-only state (modals, active theme, sound on/off). Not for server data — TanStack Query owns that. |
| **Database + Auth** | Supabase | PostgreSQL + Auth + RLS + REST/Realtime + Storage in one free tier. The Next.js + Supabase starter template is production-ready on day 1. |
| **ORM/Query** | Supabase JS Client + raw SQL for triggers | For simple CRUD, use the client. For the XP engine, use Postgres functions — they run inside the DB, making them tamper-proof. |
| **Validation** | Zod | Schema validation on both client (form) and server (API). One source of truth for the data shape. |
| **Deployment** | Vercel | Zero-config Next.js deployment. Free tier gives you a `*.vercel.app` URL instantly. Edge network CDN. |
| **Testing** | Vitest + Playwright | Unit tests for XP math. E2E for the critical demo flow. Fast enough to run in CI. |

---

## 🗄️ 3. Database Schema (PostgreSQL)

### Entity-Relationship Overview

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  users   │────<│  tasks   │────<│  task_logs   │
│(character)│    │(quests)  │     │(audit trail) │
└────┬─────┘     └──────────┘     └──────────────┘
     │
     │ 1:N
     │
┌────▼─────────┐     ┌──────────┐
│ xp_events    │     │  items   │
│(anti-cheat)  │     │(shop)    │
└──────────────┘     └────┬─────┘
                          │
                    ┌─────▼──────┐
                    │ inventory  │
                    │(user↔item) │
                    └────────────┘
┌──────────────┐
│streak_events │
│(daily count) │
└──────────────┘
```

### Full SQL Schema

```sql
-- ============================================
-- EXTENSIONS
-- ============================================
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. USERS (Character Data)
-- ============================================
create table public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique not null,
    email text unique not null,
    
    -- RPG Character State
    level integer not null default 1,
    current_xp integer not null default 0,
    total_xp_earned bigint not null default 0,
    gold integer not null default 0,
    
    -- Attributes
    strength_xp integer not null default 0,
    intellect_xp integer not null default 0,
    creativity_xp integer not null default 0,
    discipline_xp integer not null default 0,
    social_xp integer not null default 0,
    
    -- Streak
    current_streak integer not null default 0,
    longest_streak integer not null default 0,
    last_active_date date,
    
    -- Meta
    active_theme text not null default 'default',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ============================================
-- 2. TASKS (Quests)
-- ============================================
create type public.attribute_type as enum (
    'strength', 'intellect', 'creativity', 'discipline', 'social'
);

create type public.task_difficulty as enum (
    'trivial', 'easy', 'medium', 'hard', 'epic'
);

create type public.task_recurrence as enum (
    'one_time', 'daily', 'weekly', 'monthly'
);

create table public.tasks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.users(id) on delete cascade,
    
    -- Core fields
    title text not null check (length(trim(title)) > 0 and length(title) <= 200),
    description text,
    attribute attribute_type not null default 'discipline',
    difficulty task_difficulty not null default 'medium',
    recurrence task_recurrence not null default 'one_time',
    due_date date,
    
    -- State
    is_completed boolean not null default false,
    completed_at timestamptz,
    times_completed integer not null default 0,
    
    -- Anti-cheat: cooldown tracking
    last_completed_at timestamptz,
    completion_cooldown_until timestamptz,
    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ============================================
-- 3. XP EVENTS (Audit Log / Anti-Cheat)
-- ============================================
create table public.xp_events (
    id bigint primary key generated always as identity,
    user_id uuid not null references public.users(id) on delete cascade,
    task_id uuid references public.tasks(id) on delete set null,
    
    xp_amount integer not null,
    gold_amount integer not null,
    source text not null, -- 'task_completion', 'streak_bonus', 'level_bonus', etc.
    created_at timestamptz not null default now()
);

-- Index for anti-cheat queries (rate limiting)
create index idx_xp_events_user_time 
    on public.xp_events(user_id, created_at desc);

-- ============================================
-- 4. TASK LOGS (Historical records)
-- ============================================
create table public.task_logs (
    id bigint primary key generated always as identity,
    user_id uuid not null references public.users(id) on delete cascade,
    task_id uuid references public.tasks(id) on delete set null,
    
    action text not null, -- 'created', 'completed', 'uncompleted', 'updated', 'deleted'
    task_snapshot jsonb,  -- Full task state at time of action
    
    created_at timestamptz not null default now()
);

-- ============================================
-- 5. STREAK EVENTS (Daily activity tracking)
-- ============================================
create table public.streak_events (
    id bigint primary key generated always as identity,
    user_id uuid not null references public.users(id) on delete cascade,
    activity_date date not null,
    tasks_completed integer not null default 0,
    xp_earned integer not null default 0,
    
    created_at timestamptz not null default now(),
    
    unique(user_id, activity_date)
);

-- ============================================
-- 6. ITEMS (Shop Catalog)
-- ============================================
create table public.items (
    id uuid primary key default uuid_generate_v4(),
    
    name text not null,
    description text,
    
    item_type text not null check (item_type in (
        'theme', 'avatar_accessory', 'badge', 'streak_freeze', 'cosmetic'
    )),
    
    price_gold integer not null check (price_gold > 0),
    
    -- For themes: the CSS token overrides
    theme_config jsonb, -- e.g., {"primary": "#ff6b9d", "bg": "#1a1a2e", ...}
    
    -- For badges/avatar items: asset reference
    asset_url text,
    
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

-- ============================================
-- 7. INVENTORY (User ↔ Item purchases)
-- ============================================
create table public.inventory (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.users(id) on delete cascade,
    item_id uuid not null references public.items(id) on delete cascade,
    
    is_equipped boolean not null default false,
    purchased_at timestamptz not null default now(),
    
    unique(user_id, item_id)
);

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS) — CRITICAL
-- ============================================
alter table public.users enable row level security;
alter table public.tasks enable row level security;
alter table public.xp_events enable row level security;
alter table public.task_logs enable row level security;
alter table public.streak_events enable row level security;
alter table public.inventory enable row level security;
alter table public.items enable row level security; -- Read-only for users

-- Policy: Users can only see their own data
create policy "users_select_own" on public.users
    for select using (auth.uid() = id);
create policy "users_update_own" on public.users
    for update using (auth.uid() = id);

create policy "tasks_all_own" on public.tasks
    for all using (auth.uid() = user_id);

create policy "xp_events_select_own" on public.xp_events
    for select using (auth.uid() = user_id);

create policy "streak_events_select_own" on public.streak_events
    for select using (auth.uid() = user_id);

create policy "inventory_all_own" on public.inventory
    for all using (auth.uid() = user_id);

-- Items: all authenticated users can read (shop catalog)
create policy "items_select_all" on public.items
    for select using (auth.role() = 'authenticated');
```

---

## 🎯 4. The XP Engine — Server-Side Game Logic

This is the **most critical component** for anti-cheat and differentiation. All logic runs in PostgreSQL functions and Next.js API routes. The client **never** sends XP values.

### 4.1 Difficulty → XP/Gold Mapping

| Difficulty | XP | Gold | Attribute XP | Cooldown |
|---|---|---|---|---|
| Trivial | 5 | 2 | 1 | 30 min |
| Easy | 10 | 5 | 2 | 2 hours |
| Medium | 20 | 10 | 4 | 4 hours |
| Hard | 50 | 25 | 10 | 12 hours |
| Epic | 100 | 50 | 20 | 24 hours |

### 4.2 Non-Linear Leveling Curve

```typescript
// XP required to go from Level N to Level N+1
// Formula: base * (multiplier ^ (N-1))
// Base: 100 XP for Level 1→2
// Multiplier: 1.2 (feels fast early, slows down naturally)

export function xpForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.2, level - 1));
}

// Cumulative XP required to reach a given level
export function cumulativeXpForLevel(level: number): number {
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += xpForLevel(i);
    }
    return total;
}

// Level progression table (for reference)
// Level 1→2:   100 XP  (Total: 100)
// Level 2→3:   120 XP  (Total: 220)
// Level 3→4:   144 XP  (Total: 364)
// Level 5→6:   207 XP  (Total: 744)
// Level 10→11: 516 XP  (Total: 2,596)
// Level 20→21: 3,183 XP (Total: ~15,000)
```

### 4.3 The Complete Task Completion Flow (Server-Side)

```typescript
// /api/tasks/complete/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Difficulty → reward mapping (server-side only)
const REWARDS = {
    trivial:  { xp: 5,   gold: 2,  attrXp: 1,  cooldown: 0.5 * 3600 * 1000 },
    easy:     { xp: 10,  gold: 5,  attrXp: 2,  cooldown: 2 * 3600 * 1000 },
    medium:   { xp: 20,  gold: 10, attrXp: 4,  cooldown: 4 * 3600 * 1000 },
    hard:     { xp: 50,  gold: 25, attrXp: 10, cooldown: 12 * 3600 * 1000 },
    epic:     { xp: 100, gold: 50, attrXp: 20, cooldown: 24 * 3600 * 1000 },
} as const;

// Anti-cheat: rate limit (max events per hour)
const MAX_EVENTS_PER_HOUR = 15;
const MAX_DAILY_XP = 600;

export async function POST(req: NextRequest) {
    const supabase = createClient(req);
    
    // 1. Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Validate input (client sends ONLY the task ID)
    const body = await req.json();
    const { taskId } = body;
    if (!taskId || typeof taskId !== 'string') {
        return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }
    
    // 3. Fetch the task (verify ownership via RLS)
    const { data: task, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', user.id)
        .single();
    
    if (error || !task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // 4. Check if already completed
    if (task.is_completed) {
        return NextResponse.json({ 
            error: 'Task already completed',
            message: 'This quest has already been fulfilled.'
        }, { status: 409 });
    }
    
    // 5. ANTI-CHEAT: Check cooldown
    if (task.completion_cooldown_until && 
        new Date(task.completion_cooldown_until) > new Date()) {
        return NextResponse.json({ 
            error: 'Cooldown active',
            message: 'This quest is on cooldown. Try again later.',
            retryAt: task.completion_cooldown_until
        }, { status: 429 });
    }
    
    // 6. ANTI-CHEAT: Rate limit check
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentEvents } = await supabase
        .from('xp_events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', oneHourAgo);
    
    if (recentEvents && recentEvents >= MAX_EVENTS_PER_HOUR) {
        return NextResponse.json({ 
            error: 'Rate limit exceeded',
            message: 'Too many quests completed in the last hour. Take a break!'
        }, { status: 429 });
    }
    
    // 7. Calculate rewards (SERVER-SIDE — not client input)
    const reward = REWARDS[task.difficulty];
    const now = new Date();
    const cooldownUntil = new Date(now.getTime() + reward.cooldown);
    
    // 8. Get current user state
    const { data: userData } = await supabase
        .from('users')
        .select('level, current_xp, gold, current_streak, last_active_date')
        .eq('id', user.id)
        .single();
    
    // 9. Streak logic (timezone-aware)
    const today = new Date().toISOString().split('T')[0]; // Simplified; use user's timezone
    let newStreak = userData.current_streak;
    let streakBonus = 0;
    
    if (userData.last_active_date !== today) {
        // Check if yesterday
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (userData.last_active_date === yesterday) {
            newStreak = userData.current_streak + 1;
        } else {
            newStreak = 1; // Streak reset
        }
        // Streak bonus: +5% XP per streak day (max +50%)
        streakBonus = Math.floor(reward.xp * Math.min(0.5, newStreak * 0.05));
    }
    
    const totalXpGain = reward.xp + streakBonus;
    
    // 10. Calculate new level (non-linear curve)
    let newLevel = userData.level;
    let newXp = userData.current_xp + totalXpGain;
    let levelsGained = 0;
    
    while (newXp >= xpForLevel(newLevel)) {
        newXp -= xpForLevel(newLevel);
        newLevel++;
        levelsGained++;
    }
    
    // 11. Execute the update (all in one transaction)
    const { error: updateError } = await supabase.rpc('complete_task_transaction', {
        p_task_id: taskId,
        p_user_id: user.id,
        p_xp_gain: totalXpGain,
        p_gold_gain: reward.gold,
        p_attr_xp: reward.attrXp,
        p_attribute: task.attribute,
        p_new_level: newLevel,
        p_new_xp: newXp,
        p_new_streak: newStreak,
        p_today: today,
        p_cooldown_until: cooldownUntil.toISOString(),
    });
    
    if (updateError) {
        return NextResponse.json({ 
            error: 'Failed to complete task' 
        }, { status: 500 });
    }
    
    // 12. Return the result (client uses this for optimistic UI confirmation)
    return NextResponse.json({
        success: true,
        xpGained: totalXpGain,
        goldGained: reward.gold,
        attributeGained: { type: task.attribute, amount: reward.attrXp },
        levelUp: levelsGained > 0 ? {
            newLevel,
            levelsGained,
            statIncreases: { [task.attribute]: reward.attrXp }
        } : null,
        streakUpdate: { current: newStreak, bonusApplied: streakBonus > 0 },
        cooldownUntil: cooldownUntil.toISOString(),
    });
}
```

### 4.4 The Atomic Transaction (Postgres Function)

```sql
-- Atomic task completion with all stat updates
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
    -- Update task state
    update public.tasks set
        is_completed = true,
        completed_at = now(),
        last_completed_at = now(),
        completion_cooldown_until = p_cooldown_until,
        times_completed = times_completed + 1,
        updated_at = now()
    where id = p_task_id and user_id = p_user_id;
    
    -- Update user character
    update public.users set
        current_xp = p_new_xp,
        level = p_new_level,
        total_xp_earned = total_xp_earned + p_xp_gain,
        gold = gold + p_gold_gain,
        current_streak = p_new_streak,
        longest_streak = greatest(longest_streak, p_new_streak),
        last_active_date = p_today,
        updated_at = now(),
        -- Dynamic attribute update based on parameter
        strength_xp = case when p_attribute = 'strength' 
            then strength_xp + p_attr_xp else strength_xp end,
        intellect_xp = case when p_attribute = 'intellect' 
            then intellect_xp + p_attr_xp else intellect_xp end,
        creativity_xp = case when p_attribute = 'creativity' 
            then creativity_xp + p_attr_xp else creativity_xp end,
        discipline_xp = case when p_attribute = 'discipline' 
            then discipline_xp + p_attr_xp else discipline_xp end,
        social_xp = case when p_attribute = 'social' 
            then social_xp + p_attr_xp else social_xp end
    where id = p_user_id;
    
    -- Log XP event (audit trail for anti-cheat)
    insert into public.xp_events (user_id, task_id, xp_amount, gold_amount, source)
    values (p_user_id, p_task_id, p_xp_gain, p_gold_gain, 'task_completion');
    
    -- Upsert streak event
    insert into public.streak_events (user_id, activity_date, tasks_completed, xp_earned)
    values (p_user_id, p_today, 1, p_xp_gain)
    on conflict (user_id, activity_date)
    do update set 
        tasks_completed = streak_events.tasks_completed + 1,
        xp_earned = streak_events.xp_earned + p_xp_gain;
    
    -- Log task action
    insert into public.task_logs (user_id, task_id, action)
    values (p_user_id, p_task_id, 'completed');
end;
$$ language plpgsql security definer;
```

---

## 🔐 5. Authentication Flow

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Browser   │────>│  Next.js App     │────>│  Supabase   │
│             │     │  (Middleware)    │     │  Auth       │
└─────────────┘     └──────────────────┘     └─────────────┘
                            │
                    ┌───────▼────────┐
                    │ Session Check  │
                    │ (JWT Cookie)   │
                    └───────┬────────┘
                     │           │
              Authenticated   Unauthenticated
                     │           │
           ┌─────────▼──┐   ┌───▼──────────┐
           │ Dashboard  │   │ Login/Signup │
           │ (RSC)      │   │ Page         │
           └────────────┘   └──────────────┘
```

### Implementation

```typescript
// middleware.ts (Next.js middleware — runs on every request)
import { createMiddlewareClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    
    // Refresh session if expired
    const { data: { session } } = await supabase.auth.getSession();
    
    // Protected routes: anything under /dashboard
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Redirect logged-in users away from auth pages
    if (session && (req.nextUrl.pathname === '/login' || 
                    req.nextUrl.pathname === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    return res;
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup']
};
```

```typescript
// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export const createClient = () => {
    return createServerComponentClient<Database>({ cookies });
};
```

---

## ⚡ 6. Frontend Architecture — The "Game Feel" Layer

### 6.1 Component Hierarchy

```
app/
├── layout.tsx              # Root layout (theme provider, fonts)
├── page.tsx                # Landing page (public, SEO)
├── login/page.tsx          # Login
├── signup/page.tsx         # Signup
├── dashboard/              # Protected route
│   ├── layout.tsx          # Dashboard shell (nav, HUD)
│   ├── page.tsx            # Main: task list + character card
│   ├── quests/
│   │   └── [id]/page.tsx   # Task detail (if needed)
│   ├── character/page.tsx  # Full stats view
│   ├── shop/page.tsx       # Item shop
│   └── settings/page.tsx   # User settings
└── api/                    # API routes (backend)
    ├── auth/
    ├── tasks/
    ├── shop/
    └── character/

components/
├── ui/                     # Reusable primitives (Button, Input, Modal)
├── game/                   # Game-specific components
│   ├── XPBar.tsx           # Animated XP progress bar
│   ├── LevelUpOverlay.tsx  # Full-screen level-up celebration
│   ├── StreakFlame.tsx     # Animated streak indicator
│   ├── AttributeCard.tsx   # Individual stat display
│   ├── TaskCard.tsx        # Quest card with checkbox
│   ├── GoldCounter.tsx     # Rolling-number currency display
│   └── ParticleBurst.tsx   # Lottie particle effect wrapper
├── dashboard/              # Layout components
│   ├── Sidebar.tsx
│   ├── MobileNav.tsx
│   └── StatsHUD.tsx        # Always-visible XP/Gold/Streak
└── providers/              # Context providers
    ├── QueryProvider.tsx   # TanStack Query
    └── ThemeProvider.tsx   # Dynamic theme switching
```

### 6.2 The Optimistic UI Pattern (Critical for "Native Feel")

```typescript
// hooks/useCompleteTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCompleteTask() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (taskId: string) => {
            const res = await fetch('/api/tasks/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId }),
            });
            if (!res.ok) throw new Error('Failed to complete task');
            return res.json();
        },
        
        // 🎯 THE OPTIMISTIC UPDATE — this is what makes it feel instant
        onMutate: async (taskId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['tasks'] });
            
            // Snapshot previous state (for rollback)
            const previousTasks = queryClient.getQueryData(['tasks']);
            const previousUser = queryClient.getQueryData(['user']);
            
            // Optimistically update the task
            queryClient.setQueryData(['tasks'], (old: Task[]) =>
                old?.map(task =>
                    task.id === taskId
                        ? { ...task, is_completed: true }
                        : task
                )
            );
            
            // Optimistically bump XP (visual only — server will confirm)
            queryClient.setQueryData(['user'], (old: UserState) => ({
                ...old,
                current_xp: old.current_xp + 20, // Estimated
            }));
            
            return { previousTasks, previousUser };
        },
        
        // On success: replace optimistic data with server truth
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            
            // Trigger level-up animation if leveled
            if (data.levelUp) {
                // Dispatch event for LevelUpOverlay component
                window.dispatchEvent(new CustomEvent('levelup', { 
                    detail: data.levelUp 
                }));
            }
        },
        
        // On error: ROLLBACK (critical for robustness judging)
        onError: (err, taskId, context) => {
            queryClient.setQueryData(['tasks'], context.previousTasks);
            queryClient.setQueryData(['user'], context.previousUser);
            
            // Show friendly toast
            toast.error('Quest could not be completed. Please try again.');
        },
    });
}
```

### 6.3 The Level-Up Experience (The Money Shot)

```tsx
// components/game/LevelUpOverlay.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import levelUpBurst from '@/animations/level-up-burst.json';

interface LevelUpData {
    newLevel: number;
    statIncreases: Record<string, number>;
}

export function LevelUpOverlay() {
    const [levelUp, setLevelUp] = useState<LevelUpData | null>(null);
    
    useEffect(() => {
        const handler = (e: CustomEvent<LevelUpData>) => {
            setLevelUp(e.detail);
            // Auto-dismiss after 2.5 seconds
            setTimeout(() => setLevelUp(null), 2500);
        };
        window.addEventListener('levelup', handler);
        return () => window.removeEventListener('levelup', handler);
    }, []);
    
    return (
        <AnimatePresence>
            {levelUp && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center 
                               bg-black/70 backdrop-blur-sm"
                >
                    {/* Lottie particle burst */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="relative"
                    >
                        <Lottie 
                            animationData={levelUpBurst}
                            loop={false}
                            className="absolute inset-0 -z-10 w-[600px] h-[600px]"
                        />
                        
                        {/* Level number flip animation */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center"
                        >
                            <p className="text-6xl font-black text-transparent 
                                         bg-clip-text bg-gradient-to-r 
                                         from-yellow-400 to-orange-500">
                                LEVEL {levelUp.newLevel}
                            </p>
                            
                            {/* Stat increases */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-4 space-y-1"
                            >
                                {Object.entries(levelUp.statIncreases).map(
                                    ([stat, amount]) => (
                                        <p key={stat} className="text-lg text-white/90">
                                            +{amount} {stat.charAt(0).toUpperCase() + stat.slice(1)}
                                        </p>
                                    )
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
```

### 6.4 The XP Bar (Always-Visible HUD Element)

```tsx
// components/game/XPBar.tsx
'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

export function XPBar() {
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUserState,
    });
    
    const xpForNext = xpForLevel(user?.level ?? 1);
    const progress = ((user?.current_xp ?? 0) / xpForNext) * 100;
    
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground">
                Lv. {user?.level ?? 1}
            </span>
            
            <div 
                className="relative h-3 w-32 overflow-hidden rounded-full bg-muted 
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                role="progressbar"
                aria-valuenow={user?.current_xp ?? 0}
                aria-valuemin={0}
                aria-valuemax={xpForNext}
                aria-label={`Experience points: ${user?.current_xp ?? 0} of ${xpForNext}`}
                tabIndex={0}
            >
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r 
                               from-primary to-accent"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    // Spring animation: feels alive, not mechanical
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
            </div>
            
            <span className="text-xs text-muted-foreground">
                {user?.current_xp ?? 0}/{xpForNext} XP
            </span>
        </div>
    );
}
```

---

## 🎨 7. Theme System (Dynamic via CSS Custom Properties)

```css
/* styles/globals.css — Design tokens as CSS variables */
/* Default theme: "Cozy Lo-Fi" */
:root {
    /* Colors */
    --bg-primary: #faf6f0;      /* Warm cream */
    --bg-secondary: #f0e6d6;    /* Slightly darker */
    --surface: #ffffff;
    --text-primary: #2d2416;
    --text-muted: #8a7d6a;
    --accent: #e8a87c;          /* Warm peach */
    --accent-hover: #d4946a;
    --success: #7fb069;
    --warning: #f2ae54;
    
    /* Typography */
    --font-display: 'Nunito', sans-serif;
    --font-body: 'Nunito', sans-serif;
    
    /* Spacing */
    --radius: 12px;
    --shadow-soft: 0 2px 8px rgba(45, 36, 22, 0.08);
    
    /* Animation */
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Purchased theme: "Neon Cyberpunk" */
[data-theme="cyberpunk"] {
    --bg-primary: #0a0a12;
    --bg-secondary: #12121f;
    --surface: #1a1a2e;
    --text-primary: #e0e0ff;
    --text-muted: #8888aa;
    --accent: #00f0ff;
    --accent-hover: #00c0cc;
    --success: #00ff88;
    --warning: #ff00aa;
    
    --font-display: 'Space Grotesk', sans-serif;
    --font-body: 'Space Grotesk', sans-serif;
    
    --radius: 4px;
    --shadow-soft: 0 2px 12px rgba(0, 240, 255, 0.15);
}
```

```tsx
// providers/ThemeProvider.tsx — Dynamic theme switching
'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUserState,
    });
    
    useEffect(() => {
        const theme = user?.active_theme ?? 'default';
        document.documentElement.setAttribute('data-theme', theme);
    }, [user?.active_theme]);
    
    return <>{children}</>;
}
```

---

## 📁 8. Repository Structure

```
life-rpg/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions: lint + type-check + test
├── .env.example                # Environment variable template
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── README.md                   # Comprehensive setup guide
├── LICENSE
│
├── animations/                 # Lottie JSON files
│   ├── level-up-burst.json
│   ├── task-complete.json
│   └── coin-drop.json
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png           # Open Graph for SEO
│   └── demo-video.mp4         # 90-180s submission video
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx            # Landing (public, SEO-optimized)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Protected shell
│   │   │   ├── page.tsx        # Main dashboard
│   │   │   ├── character/page.tsx
│   │   │   ├── shop/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   └── callback/route.ts
│   │       ├── tasks/
│   │       │   ├── route.ts           # GET (list), POST (create)
│   │       │   ├── [id]/route.ts      # GET, PATCH, DELETE
│   │       │   └── complete/route.ts  # 🎯 THE XP ENGINE
│   │       ├── shop/
│   │       │   ├── route.ts           # GET (catalog)
│   │       │   └── purchase/route.ts  # POST (buy item)
│   │       └── character/
│   │           └── route.ts           # GET (full state)
│   │
│   ├── components/
│   │   ├── ui/                 # Reusable primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── toast.tsx
│   │   ├── game/               # Game-specific
│   │   │   ├── XPBar.tsx
│   │   │   ├── LevelUpOverlay.tsx
│   │   │   ├── StreakFlame.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── GoldCounter.tsx
│   │   │   ├── AttributeCard.tsx
│   │   │   └── ShopItemCard.tsx
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── StatsHUD.tsx
│   │   └── providers/
│   │       ├── QueryProvider.tsx
│   │       └── ThemeProvider.tsx
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useTasks.ts
│   │   ├── useCompleteTask.ts  # The optimistic mutation
│   │   ├── useUserState.ts
│   │   └── useShop.ts
│   │
│   ├── lib/                    # Core business logic
│   │   ├── xp-engine.ts        # XP curve, level calculations
│   │   ├── streak-engine.ts    # Streak logic
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── server.ts       # Server component client
│   │   │   └── admin.ts        # Service role client (migrations only)
│   │   └── validators.ts       # Zod schemas
│   │
│   ├── types/                  # TypeScript types
│   │   ├── database.ts         # Generated from Supabase
│   │   └── game.ts             # Game types (Task, Item, etc.)
│   │
│   └── middleware.ts           # Auth middleware
│
├── supabase/
│   ├── migrations/             # SQL migrations
│   │   ├── 001_create_tables.sql
│   │   ├── 002_rls_policies.sql
│   │   ├── 003_functions.sql
│   │   └── 004_seed_items.sql  # Shop catalog seed data
│   └── config.toml
│
└── tests/
    ├── unit/
    │   ├── xp-engine.test.ts   # XP curve math tests
    │   └── streak-engine.test.ts
    └── e2e/
        └── demo-flow.spec.ts   # Playwright: the exact demo video flow
```

---

## 🚀 9. Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│              🔧 DEVELOPMENT                       │
│  Local: `npm run dev` (localhost:3000)           │
│  DB: Local Supabase CLI or Cloud (free tier)     │
│  Git: Feature branches → PR → main               │
└─────────────────────┬───────────────────────────┘
                      │ push to main
                      ▼
┌─────────────────────────────────────────────────┐
│              🤖 CI/CD (GitHub Actions)           │
│  1. Install deps                                 │
│  2. Type-check (tsc --noEmit)                    │
│  3. Lint (eslint)                                │
│  4. Unit tests (vitest)                          │
│  5. E2E tests (playwright) — optional on PR      │
│  6. Build (next build)                           │
│  7. Deploy to Vercel (if main)                   │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│              🌐 PRODUCTION (Vercel)              │
│  URL: https://life-rpg.vercel.app                │
│  Edge network CDN                                │
│  Automatic HTTPS                                 │
│  Preview deployments on PRs                      │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│          💾 SUPABASE (Cloud — Free Tier)         │
│  Region: Closest to team/users                   │
│  PostgreSQL + Auth + RLS + Storage               │
│  URL: https://xxx.supabase.co                    │
└─────────────────────────────────────────────────┘
```

### Environment Variables (.env.example)

```bash
# ==========================================
# NEXT.JS
# ==========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ==========================================
# SUPABASE — Get these from Supabase Dashboard
# Settings → API
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server only, never client

# ==========================================
# OPTIONAL: Analytics (if needed)
# ==========================================
# NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

---

## 🏃‍♂️ 10. 48-Hour Build Sequence

### Phase 1: Foundation (Hours 0–8)

| Hour | Task | Output |
|---|---|---|
| 0–1 | Initialize Next.js + Supabase project. Run `supabase init` + first migration. | Empty app with DB connected. |
| 1–2 | Set up auth (login/signup pages, middleware). Test login works. | Auth flows functional. |
| 2–4 | Create all database tables + RLS policies + seed items. | Full schema deployed to Supabase. |
| 4–6 | Build Task CRUD API routes + Zod validation. Test with curl/Postman. | Backend task CRUD working. |
| 6–8 | Build the XP Engine (complete task endpoint + Postgres transaction function). Test XP calculation. | **The core is done.** |

### Phase 2: The Game Layer (Hours 8–20)

| Hour | Task | Output |
|---|---|---|
| 8–10 | Create basic dashboard layout (sidebar, stats HUD skeleton). | Dashboard shell visible. |
| 10–12 | Build TaskCard component with optimistic completion (TanStack Query). | Clicking a task "feels" instant. |
| 12–14 | Build XPBar, GoldCounter, StreakFlame — all animated with Framer Motion. | Stats HUD alive. |
| 14–16 | Build LevelUpOverlay with Lottie animation. **This is the money shot.** | Level-up moment is magical. |
| 16–18 | Build Shop page + purchase flow (with optimistic gold deduction). | Economy loop complete. |
| 18–20 | Build Character page (full stats view). | All core pages functional. |

### Phase 3: Polish & Robustness (Hours 20–36)

| Hour | Task | Output |
|---|---|---|
| 20–24 | **THEME LOCK.** Apply chosen theme (colors, typography, terminology). **This is where you win.** | App looks cohesive and beautiful. |
| 24–28 | Loading skeletons, error states, empty states, toasts. | No spinners anywhere. |
| 28–30 | Keyboard navigation + ARIA labels + focus traps. | 100% keyboard navigable. |
| 30–32 | Responsive testing (320px → 1920px). Fix breakpoints. | Works on all devices. |
| 32–34 | Edge cases: empty task, network drop, rapid clicking, session expiry. | Robustness criterion satisfied. |
| 34–36 | Performance optimization: code splitting, image optimization, lazy loading. | Lighthouse > 90. |

### Phase 4: Submission (Hours 36–48)

| Hour | Task | Output |
|---|---|---|
| 36–38 | Deploy to Vercel. Configure env vars. Test production URL. | Live URL working. |
| 38–40 | Write comprehensive README + .env.example. Clean commit history. | Repo is submission-ready. |
| 40–42 | Script and record the 90–180s demo video. Multiple takes. | Video under 100MB. |
| 42–44 | Full end-to-end test on production URL. Fix any last bugs. | No bugs in demo flow. |
| 44–46 | Final commit, push, verify all deliverables. | **Everything is submitted.** |
| 46–48 | Buffer for disasters. | 😤 |

---

## 🛡️ 11. Security & Anti-Cheat Summary

| Attack Vector | Defense | Implementation |
|---|---|---|
| Client sends fake XP | Server calculates XP from task difficulty | `REWARDS` map in API route, never accepts client XP |
| Check/uncheck spam | Cooldown per task | `completion_cooldown_until` column |
| API abuse | Rate limit per user | `MAX_EVENTS_PER_HOUR = 15` check on `xp_events` |
| Cross-user data access | Row Level Security (RLS) | Postgres policies on every table |
| SQL injection | Parameterized queries via Supabase client | No raw string interpolation |
| XSS | React escapes by default + strict CSP headers | `next.config.js` headers config |
| Session hijacking | HttpOnly, Secure, SameSite cookies | Supabase Auth handles automatically |
| Token expiry mid-session | Auto-refresh in middleware | `supabase.auth.getSession()` on every request |

---

## 📊 12. Performance Budget

| Metric | Target | Technique |
|---|---|---|
| First Contentful Paint | < 1.5s | React Server Components, edge CDN |
| Time to Interactive | < 2.5s | Code splitting, lazy load heavy components |
| Task completion click → animation | < 50ms (optimistic) | TanStack Query `onMutate` |
| Level-up overlay render | < 100ms | Pre-loaded Lottie JSON |
| Lighthouse Performance | > 90 | Optimized images, minimal JS, edge functions |
| Lighthouse Accessibility | > 95 | ARIA, keyboard nav, color contrast |
| Lighthouse Best Practices | > 90 | HTTPS, no deprecated APIs |
| Lighthouse SEO | > 90 | Meta tags, semantic HTML, sitemap |

---

## 🎯 13. Key Technical Decisions — Rationale

| Decision | Why NOT the alternative |
|---|---|
| **Next.js monolith** (frontend + API in one app) | Separate Express backend = 2 deployments, 2 repos, CORS issues, more setup time. Monolith = 1 repo, 1 deploy, shared types. |
| **Supabase over Firebase** | PostgreSQL (relational) fits the multi-table schema better than Firestore's document model. RLS is built-in. SQL triggers run inside DB (more secure than Cloud Functions). |
| **Postgres functions for XP logic** | Runs inside the database — impossible to bypass even if API is compromised. Atomic transactions guarantee consistency. |
| **TanStack Query over Redux/Zustand for server state** | Built-in optimistic updates, cache invalidation, retry logic. Redux would require writing all of that manually. |
| **CSS Custom Properties for theming** | Runtime theme switching (buy a theme in shop → instant change). No JS re-render needed. Tailwind reads the variables directly. |
| **Framer Motion over CSS animations** | Spring physics (natural game feel), layout animations (smooth reflows), gesture support. CSS can't do springs. |
| **Lottie over canvas/WebGL** | Pre-made animations from LottieFiles. 10KB JSON file vs. custom canvas code. GPU-accelerated. No WebGL shader complexity. |
| **Zod for validation** | One schema, used on both client (form validation) and server (API validation). Type inference generates TypeScript types automatically. |

---

## 🧪 14. Testing Strategy

```typescript
// tests/unit/xp-engine.test.ts
import { xpForLevel, cumulativeXpForLevel } from '@/lib/xp-engine';

describe('XP Engine', () => {
    test('Level 1→2 requires 100 XP', () => {
        expect(xpForLevel(1)).toBe(100);
    });
    
    test('XP requirement increases monotonically', () => {
        for (let i = 1; i < 50; i++) {
            expect(xpForLevel(i + 1)).toBeGreaterThan(xpForLevel(i));
        }
    });
    
    test('Cumulative XP is correct for Level 5', () => {
        // 100 + 120 + 144 + 172 = 536
        expect(cumulativeXpForLevel(5)).toBe(536);
    });
    
    test('XP curve is non-linear (accelerating)', () => {
        const delta1 = xpForLevel(10) - xpForLevel(9);
        const delta2 = xpForLevel(20) - xpForLevel(19);
        expect(delta2).toBeGreaterThan(delta1);
    });
});
```

```typescript
// tests/e2e/demo-flow.spec.ts — Mirrors the required demo video
import { test, expect } from '@playwright/test';

test('complete demo flow: signup → task → level up → refresh', async ({ page }) => {
    // 1. Signup
    await page.goto('/signup');
    await page.fill('[data-testid="email"]', `test-${Date.now()}@example.com`);
    await page.fill('[data-testid="password"]', 'TestPass123!');
    await page.click('[data-testid="signup-button"]');
    
    // 2. Add a task
    await page.waitForURL('/dashboard');
    await page.click('[data-testid="add-task-button"]');
    await page.fill('[data-testid="task-title"]', 'Read 10 pages');
    await page.selectOption('[data-testid="task-attribute"]', 'intellect');
    await page.selectOption('[data-testid="task-difficulty"]', 'medium');
    await page.click('[data-testid="save-task-button"]');
    
    // 3. Complete the task (multiple times to trigger level up)
    for (let i = 0; i < 6; i++) {
        await page.click('[data-testid="complete-task"]');
        await page.waitForTimeout(500); // Let animation play
    }
    
    // 4. Verify level up occurred
    await expect(page.locator('[data-testid="level-display"]')).toContainText('Lv. 2');
    
    // 5. Refresh page — data must persist
    await page.reload();
    await expect(page.locator('[data-testid="level-display"]')).toContainText('Lv. 2');
    await expect(page.locator('[data-testid="xp-bar"]')).toBeVisible();
    await expect(page.locator('[data-testid="gold-counter"]')).not.toContainText('0');
});
```

---

## 🔧 15. SEO Implementation (Public Pages Only)

```tsx
// app/layout.tsx — Global metadata
export const metadata: Metadata = {
    metadataBase: new URL('https://life-rpg.vercel.app'),
    title: {
        default: 'Life RPG — Level Up Your Life',
        template: '%s | Life RPG'
    },
    description: 'Turn your to-do list into an RPG. Complete real tasks, earn XP, level up your character.',
    openGraph: {
        title: 'Life RPG — Level Up Your Life',
        description: 'Gamified productivity that actually feels rewarding.',
        images: ['/og-image.png'],
        type: 'website',
    },
    robots: { index: true, follow: true },
};

// app/page.tsx — Landing page with semantic HTML
export default function LandingPage() {
    return (
        <main>
            <h1>Level Up Your Life</h1>
            <p>Every task you complete makes you stronger.</p>
            {/* Public marketing content for SEO crawlers */}
        </main>
    );
}
```

---

## 📝 16. README Template Structure

```markdown
# 🎮 Life RPG — Level Up Your Life

A gamified productivity web app that turns real-world tasks into an RPG progression system.

## 🚀 Live Demo
[https://life-rpg.vercel.app](https://life-rpg.vercel.app)

## 📹 Demo Video
[Watch the 90-second demo](./public/demo-video.mp4)

## 🛠️ Tech Stack
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion, Lottie
- **Backend:** Next.js API Routes, Supabase (PostgreSQL + Auth + RLS)
- **Deployment:** Vercel

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- A Supabase account (free tier)

### Steps
1. Clone the repo
   \`\`\`bash
   git clone https://github.com/your-username/life-rpg.git
   cd life-rpg
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

3. Set up Supabase
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings → API
   - Copy your URL and anon key

4. Configure environment
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   \`\`\`

5. Run database migrations
   \`\`\`bash
   npx supabase db push
   \`\`\`

6. Start the dev server
   \`\`\`bash
   npm run dev
   \`\`\`

7. Open [http://localhost:3000](http://localhost:3000)

## 🎯 Features
- ✅ User authentication (email + OAuth)
- ✅ Task CRUD with attributes and difficulty
- ✅ Non-linear XP leveling system
- ✅ Server-side anti-cheat engine
- ✅ Streak tracking with timezone support
- ✅ Virtual economy (Gold + Shop)
- ✅ Animated level-up celebrations
- ✅ Responsive (mobile → desktop)
- ✅ Fully keyboard navigable
- ✅ Screen reader accessible

## 🔒 Security
- All XP calculations run server-side
- Row Level Security (RLS) on all tables
- Task completion cooldown prevents XP farming
- Rate limiting on XP events
```

---

## 🏁 Summary: The Architecture in One Sentence

**A single Next.js application deployed on Vercel, backed by Supabase (PostgreSQL with RLS), where all game logic (XP, levels, streaks, economy) executes in server-side API routes and atomic database functions — the client only sends intents ("I completed this task") and renders the animated, optimistic results.**

The architecture is boring. The UI is what wins.

"# 🎨 Life RPG — Enhanced Frontend Architecture with shadcn/ui + GSAP

## 📌 The Updated Strategy

You're making a **powerful decision**. Here's the two-layer animation strategy that will make your hackathon submission look like a top-tier product studio built it:

| Layer | Library | Why |
|---|---|---|
| **🏠 Landing Page** (public, scroll-driven) | **GSAP + ScrollTrigger + SplitText** | Complex timelines, scroll-pinned sections, cinematic text reveals, parallax. This is what motionsites.ai-style sites use. |
| **🎮 Dashboard App** (authenticated, interactive) | **shadcn/ui + Framer Motion** | Spring physics for optimistic UI, layout animations for task reordering, accessible Radix primitives. |
| **🧱 Base Component System** | **shadcn/ui** | Both layers share the same component primitives. You own the code. Radix handles accessibility. Tailwind handles styling. |

**Why not just GSAP everywhere?** GSAP is a timeline engine — it's *perfect* for choreographed, scroll-driven sequences but awkward for React component state changes. Framer Motion is a React-native motion library — it's *perfect* for "this component changed, animate it" but can't do complex scroll timelines. You need both【turn0search13】【turn2search0】.

**Why not just Framer Motion everywhere?** You lose the cinematic scroll experience that makes award-winning landing pages. GSAP's ScrollTrigger can pin sections, scrub timelines to scroll position, and create effects Framer Motion simply cannot【turn0search4】【turn1search3】.

> ✅ **Good news:** GSAP is now **completely free** — including all premium plugins like SplitText, ScrollTrigger, DrawSVG, MorphSVG, etc. No licensing cost, no watermark【turn3search3】【turn3search5】.

---

## 🧱 1. shadcn/ui — Setup & Component Selection

### 1.1 Installation

```bash
# Initialize shadcn/ui in your Next.js project
npx shadcn@latest init

# Choose:
# - TypeScript: Yes
# - Style: Default (we'll heavily customize)
# - Base color: Slate (best for dark gaming themes)
# - CSS variables: Yes
```

### 1.2 Components You'll Actually Use

Don't install everything. Install only what your app needs:

```bash
# Core interactive components
npx shadcn@latest add button card badge dialog
npx shadcn@latest add dropdown-menu select separator
npx shadcn@latest add tabs toast tooltip
npx shadcn@latest add input label textarea
npx shadcn@latest add progress avatar

# Optional (nice for polish)
npx shadcn@latest add sheet skeleton scroll-area
npx shadcn@latest add popover command
```

This gives you **~18 components** that cover your entire app. Each one is Radix UI underneath — meaning full keyboard navigation, ARIA compliance, and screen reader support come for free【turn0search2】【turn0search8】.

### 1.3 The Dark Gaming Theme (CSS Variables)

shadcn/ui uses CSS variables for theming — this is perfect for your RPG theme system【turn1search4】【turn1search5】. Here's a custom dark gaming palette:

```css
/* globals.css — Your custom "Neon RPG" dark theme */
:root {
    /* === 60-30-10 Color Rule === */
    /* 60%: Background (dominant) */
    --background: 240 10% 3%;        /* #08080c — near black */
    --foreground: 0 0% 98%;           /* #fafafa — off-white text */
    
    /* 30%: Surface (secondary) — cards, nav */
    --card: 240 8% 6%;                /* #0e0e14 */
    --card-foreground: 0 0% 98%;
    --popover: 240 8% 8%;
    --popover-foreground: 0 0% 98%;
    
    /* 10%: Primary (accent) — CTAs, highlights */
    --primary: 262 83% 58%;           /* #8b5cf6 — violet/purple */
    --primary-foreground: 0 0% 100%;
    
    --secondary: 240 5% 12%;
    --secondary-foreground: 0 0% 98%;
    
    --muted: 240 5% 10%;
    --muted-foreground: 240 5% 65%;
    
    /* Semantic colors */
    --accent: 173 80% 40%;            /* #2dd4bf — teal for success */
    --accent-foreground: 0 0% 100%;
    
    --destructive: 0 72% 51%;         /* #ef4444 */
    --destructive-foreground: 0 0% 100%;
    
    --success: 142 71% 45%;           /* #22c55e */
    --warning: 38 92% 50%;            /* #f59e0b — gold for currency */
    
    /* RPG-specific tokens */
    --xp-fill: 262 83% 58%;           /* XP bar color */
    --gold: 45 93% 47%;               /* Gold counter color */
    --streak: 15 100% 50%;            /* Streak flame color */
    
    /* Borders & rings */
    --border: 240 6% 14%;
    --input: 240 6% 14%;
    --ring: 262 83% 58%;
    
    --radius: 0.5rem; /* Slightly sharper = more "game UI" */
}

/* Purchased theme override example: "Cyberpunk Red" */
[data-theme="cyberpunk"] {
    --primary: 348 89% 60%;           /* #f43f5e — hot pink/red */
    --accent: 190 95% 50%;            /* #06b6d4 — cyan */
    --background: 240 10% 2%;
    --card: 240 8% 5%;
    --xp-fill: 348 89% 60%;
}

/* Purchased theme: "Forest Elf" */
[data-theme="forest"] {
    --primary: 142 71% 45%;           /* #22c55e */
    --accent: 84 81% 44%;             /* #a3e635 */
    --background: 150 15% 4%;
    --card: 150 10% 7%;
    --xp-fill: 142 71% 45%;
}
```

```typescript
// tailwind.config.ts — Map the CSS variables
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // RPG-specific
                gold: "hsl(var(--gold))",
                xp: "hsl(var(--xp-fill))",
                streak: "hsl(var(--streak))",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["var(--font-body)"],
                display: ["var(--font-display)"],
            },
        },
    },
};
```

---

## ⚡ 2. GSAP Integration — The Landing Page Experience

### 2.1 Setup

```bash
npm install gsap @gsap/react
```

```typescript
// lib/gsap.ts — Register plugins once, globally
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
```

### 2.2 The `useGSAP` Hook — React-Native GSAP

The `@gsap/react` package provides a `useGSAP` hook that handles cleanup automatically — no more manual `useEffect` + `return () => { tl.kill() }` boilerplate【turn0search1】【turn2search1】:

```tsx
// components/landing/HeroSection.tsx
'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, SplitText } from '@/lib/gsap';

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    
    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;
        
        // === TEXT REVEAL ANIMATION ===
        // SplitText breaks text into chars/words for individual animation
        const split = new SplitText('.hero-title', { type: 'chars,words' });
        const splitSub = new SplitText('.hero-subtitle', { type: 'lines' });
        
        // Master timeline
        const tl = gsap.timeline({
            defaults: { ease: 'power4.out' },
        });
        
        // 1. Title chars fly in from below with stagger
        tl.from(split.chars, {
            y: 100,
            opacity: 0,
            rotateX: -90,
            stagger: 0.02,           // 20ms between each character
            duration: 1,
        })
        // 2. Subtitle lines reveal
        .from(splitSub.lines, {
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
        }, '-=0.5')
        // 3. CTA buttons pop in
        .from('.hero-cta', {
            y: 20,
            opacity: 0,
            scale: 0.9,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.7)',
        }, '-=0.3')
        // 4. Background particles fade in
        .from('.hero-particles', {
            opacity: 0,
            duration: 1.5,
            ease: 'power2.inOut',
        }, '-=1');
        
        // === SCROLL-TRIGGERED PARALLAX ===
        // As user scrolls, the hero content moves up and fades
        gsap.to('.hero-content', {
            y: -150,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,  // Smooth 1-second lag
            },
        });
        
        // === FLOATING XP ORBS (ambient animation) ===
        gsap.to('.xp-orb', {
            y: 'random(-30, 30)',
            x: 'random(-20, 20)',
            duration: 'random(2, 4)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: 0.5,
        });
        
    }, { scope: containerRef }); // Scoped to this component only
    
    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden">
            {/* Animated background grid */}
            <div className="hero-particles absolute inset-0">
                <div className="xp-orb absolute left-20 top-30 w-2 h-2 rounded-full bg-primary/40 blur-sm" />
                <div className="xp-orb absolute right-40 top-20 w-3 h-3 rounded-full bg-accent/30 blur-sm" />
                <div className="xp-orb absolute left-1/2 top-60 w-1.5 h-1.5 rounded-full bg-gold/40 blur-sm" />
                <div className="xp-orb absolute right-20 bottom-40 w-2 h-2 rounded-full bg-primary/30 blur-sm" />
                {/* Add more orbs... */}
            </div>
            
            <div className="hero-content relative z-10 flex flex-col items-center 
                            justify-center min-h-screen px-4">
                <h1 className="hero-title text-5xl md:text-7xl font-black text-center 
                               leading-tight tracking-tight">
                    Your Life is a{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r 
                                     from-primary via-accent to-primary">
                        Game
                    </span>
                </h1>
                
                <p className="hero-subtitle mt-6 text-lg md:text-xl text-muted-foreground 
                             text-center max-w-2xl">
                    Every task you complete earns XP. Every habit you build levels you up.
                    Stop chasing to-do lists. Start questing.
                </p>
                
                <div className="hero-cta mt-10 flex flex-col sm:flex-row gap-4">
                    <button className="px-8 py-4 rounded-lg bg-primary text-primary-foreground 
                                      font-bold text-lg hover:scale-105 transition-transform
                                      shadow-lg shadow-primary/25">
                        Start Your Quest →
                    </button>
                    <button className="px-8 py-4 rounded-lg border border-border 
                                      text-foreground font-medium text-lg hover:bg-card
                                      transition-colors">
                        Watch Demo
                    </button>
                </div>
            </div>
        </div>
    );
}
```

### 2.3 The Scroll-Driven Feature Showcase

This is where GSAP's ScrollTrigger *really* shines — pinning sections and scrubbing animations to scroll position【turn0search4】【turn1search3】:

```tsx
// components/landing/FeatureShowcase.tsx
'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';

const FEATURES = [
    {
        title: 'Non-Linear Progression',
        description: 'Each level takes more XP than the last. Early wins come fast, mastery takes dedication.',
        emoji: '📈',
    },
    {
        title: 'Attribute System',
        description: 'Gym builds Strength. Coding builds Intellect. Every task matters.',
        emoji: '💪',
    },
    {
        title: 'Streak Protection',
        description: 'Consecutive day bonuses with forgiveness. Built for humans, not robots.',
        emoji: '🔥',
    },
    {
        title: 'Virtual Economy',
        description: 'Earn Gold, spend it on themes and cosmetics. Make your journey yours.',
        emoji: '💰',
    },
];

export function FeatureShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    
    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;
        
        // === HORIZONTAL SCROLL SECTION ===
        // Pins the section and scrolls horizontally as user scrolls vertically
        const sections = gsap.utils.toArray('.feature-panel');
        
        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                pin: true,                    // Pin the entire section
                scrub: 1,                     // 1-second lag = smooth
                snap: 1 / (sections.length - 1), // Snap to each panel
                end: () => '+=' + (container.offsetWidth * sections.length),
            },
        });
        
        // Each panel's content animates in as it enters viewport
        sections.forEach((section, i) => {
            gsap.from(section.querySelectorAll('.feature-content'), {
                y: 80,
                opacity: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: section,
                    start: 'left center',
                    containerAnimation: gsap.getTweens(sections)[0],
                },
            });
        });
        
    }, { scope: containerRef });
    
    return (
        <div ref={containerRef} className="relative h-screen overflow-hidden">
            <div className="flex h-full w-[400%]"> {/* 4 panels × 100vw */}
                {FEATURES.map((feature, i) => (
                    <div key={i} className="feature-panel w-screen h-full 
                                            flex items-center justify-center">
                        <div className="feature-content max-w-md mx-auto text-center">
                            <div className="text-6xl mb-6">{feature.emoji}</div>
                            <h3 className="text-3xl font-bold mb-4">
                                {feature.title}
                            </h3>
                            <p className="text-lg text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

### 2.4 The Stats Counter Animation

```tsx
// components/landing/StatsSection.tsx
'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';

export function StatsSection() {
    const ref = useRef<HTMLDivElement>(null);
    
    useGSAP(() => {
        // Number counter animation when scrolled into view
        const counters = ref.current?.querySelectorAll('.stat-number');
        
        counters?.forEach((counter) => {
            const target = { value: parseInt(counter.dataset.value || '0') };
            const suffix = counter.dataset.suffix || '';
            
            gsap.to(target, {
                value: target.value,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
                onUpdate: () => {
                    counter.textContent = Math.floor(target.value).toLocaleString() + suffix;
                },
            });
        });
    }, { scope: ref });
    
    const stats = [
        { value: 42, suffix: 'K', label: 'Quests Completed' },
        { value: 8300, suffix: '+', label: 'Levels Gained' },
        { value: 15, suffix: 'K', label: 'Streak Days' },
        { value: 99, suffix: '%', label: 'Would Recommend' },
    ];
    
    return (
        <div ref={ref} className="py-24 bg-card/50">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                        <div 
                            className="stat-number text-5xl font-black text-primary"
                            data-value={stat.value}
                            data-suffix={stat.suffix}
                        >
                            0{stat.suffix}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground uppercase tracking-wider">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

---

## 🏠 3. The Landing Page — Full Section Structure

Inspired by motionsites.ai's design philosophy — cinematic, scroll-driven, immersive【turn1search0】. Here's your complete landing page architecture:

```
app/page.tsx (Landing Page — Public, SEO)
│
├── 🎬 Preloader (GSAP timeline: logo → progress bar → reveal)
├── 🌟 HeroSection (SplitText title + floating XP orbs + parallax)
├── 📖 HowItWorks (3-step scroll-pinned explanation)
├── 🎮 FeatureShowcase (Horizontal scroll panels — 4 features)
├── 📊 StatsSection (Animated counters)
├── 🖼️ ThemeGallery (Scroll-revealed theme previews)
├── 💬 Testimonials (Auto-scrolling marquee)
├── 🚀 CTASection (Final conversion with animated gradient)
└── 📄 Footer
```

### 3.1 The Preloader (First Impression)

```tsx
// components/landing/Preloader.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export function Preloader({ onComplete }: { onComplete: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 100);
        
        return () => clearInterval(interval);
    }, []);
    
    useGSAP(() => {
        if (progress >= 100) {
            const tl = gsap.timeline({ onComplete });
            
            // Logo scales up
            tl.to('.preloader-logo', {
                scale: 1.2,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in',
            })
            // Overlay slides away (curtain effect)
            .to('.preloader-overlay', {
                yPercent: -100,
                duration: 0.8,
                ease: 'power4.inOut',
            })
            // Content reveals
            .from('.hero-content > *', {
                y: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
            });
        }
    }, [progress >= 100]);
    
    return (
        <div ref={ref} className="fixed inset-0 z-[100] preloader-overlay bg-background">
            <div className="flex flex-col items-center justify-center h-full">
                <div className="preloader-logo text-4xl font-black text-primary mb-8">
                    ⚔️ Life RPG
                </div>
                <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                    Loading your adventure...
                </p>
            </div>
        </div>
    );
}
```

### 3.2 The Landing Page Layout

```tsx
// app/page.tsx — The Landing Page
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { StatsSection } from '@/components/landing/StatsSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { CTASection } from '@/components/landing/CTASection';

export default function LandingPage() {
    return (
        <main className="bg-background text-foreground">
            {/* Each section handles its own GSAP animations */}
            <HeroSection />
            <HowItWorks />
            <FeatureShowcase />
            <StatsSection />
            <CTASection />
        </main>
    );
}
```

---

## 🎯 4. The Dashboard — shadcn/ui + Framer Motion

The dashboard uses the **same shadcn/ui components** but with Framer Motion for the interactive layer (optimistic UI, spring animations):

### 4.1 The Task Card (shadcn Card + Framer Motion)

```tsx
// components/game/TaskCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
    task: Task;
    onComplete: (taskId: string) => void;
    isPending: boolean;
}

const difficultyColors = {
    trivial: 'bg-muted text-muted-foreground',
    easy: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    hard: 'bg-orange-500/20 text-orange-400',
    epic: 'bg-red-500/20 text-red-400',
};

const attributeIcons = {
    strength: '💪',
    intellect: '🧠',
    creativity: '🎨',
    discipline: '⏰',
    social: '🤝',
};

export function TaskCard({ task, onComplete, isPending }: TaskCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            <Card className="group relative overflow-hidden hover:border-primary/50 
                             transition-colors duration-300">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 
                                to-transparent opacity-0 group-hover:opacity-100 
                                transition-opacity duration-500" />
                
                <CardContent className="flex items-center gap-4 p-4 relative">
                    {/* Complete button — the satisfying click */}
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onComplete(task.id)}
                        disabled={task.is_completed || isPending}
                        className={`w-6 h-6 rounded-full border-2 flex items-center 
                                   justify-center transition-all duration-300
                                   ${task.is_completed 
                                     ? 'bg-primary border-primary' 
                                     : 'border-muted-foreground/30 hover:border-primary'}`}
                        aria-label={`Mark "${task.title}" as ${task.is_completed ? 'incomplete' : 'complete'}`}
                    >
                        {task.is_completed && (
                            <motion.svg
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="w-4 h-4 text-primary-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </motion.svg>
                        )}
                    </motion.button>
                    
                    {/* Task content */}
                    <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate
                                     ${task.is_completed 
                                       ? 'text-muted-foreground line-through' 
                                       : 'text-foreground'}`}>
                            {task.title}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                                {attributeIcons[task.attribute]} {task.attribute}
                            </Badge>
                            <Badge className={`text-xs ${difficultyColors[task.difficulty]}`}>
                                {task.difficulty}
                            </Badge>
                        </div>
                    </div>
                    
                    {/* XP reward indicator */}
                    <div className="text-right">
                        <p className="text-sm font-bold text-primary">
                            +{task.xp_value}
                        </p>
                        <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
```

### 4.2 The Stats HUD (Always-Visible)

```tsx
// components/dashboard/StatsHUD.tsx
'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';

export function StatsHUD() {
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUserState,
    });
    
    // Animated XP bar with spring physics
    const xpProgress = useSpring(0, { stiffness: 100, damping: 20 });
    const xpPercent = useTransform(xpProgress, (value) => `${value}%`);
    
    useEffect(() => {
        const target = ((user?.current_xp ?? 0) / xpForLevel(user?.level ?? 1)) * 100;
        xpProgress.set(target);
    }, [user?.current_xp, user?.level]);
    
    return (
        <div className="fixed top-4 right-4 z-40 flex items-center gap-4 
                       bg-card/80 backdrop-blur-lg border border-border 
                       rounded-xl px-4 py-2 shadow-lg">
            {/* Level badge */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center 
                               justify-center text-primary font-bold text-sm">
                    {user?.level ?? 1}
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">Level</p>
                    <motion.p 
                        key={user?.level}
                        initial={{ scale: 1.5, color: 'var(--primary)' }}
                        animate={{ scale: 1, color: 'var(--foreground)' }}
                        className="text-sm font-bold"
                    >
                        {user?.level ?? 1}
                    </motion.p>
                </div>
            </div>
            
            {/* XP Progress */}
            <div className="w-32">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">XP</span>
                    <span className="font-mono">{user?.current_xp ?? 0}/{xpForLevel(user?.level ?? 1)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{ width: xpPercent }}
                    />
                </div>
            </div>
            
            {/* Gold counter */}
            <div className="flex items-center gap-1">
                <span className="text-gold text-lg">🪙</span>
                <motion.span 
                    key={user?.gold}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="font-mono font-bold text-gold"
                >
                    {user?.gold ?? 0}
                </motion.span>
            </div>
            
            {/* Streak */}
            <div className="flex items-center gap-1">
                <motion.span 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 2, -2, 0] 
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-streak text-lg"
                >
                    🔥
                </motion.span>
                <span className="font-mono font-bold text-streak">
                    {user?.current_streak ?? 0}
                </span>
            </div>
        </div>
    );
}
```

---

## 📦 5. Updated Package.json Dependencies

```json
{
  "dependencies": {
    "@gsap/react": "^2.1.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-tooltip": "^1.1.0",
    "@supabase/ssr": "^0.5.0",
    "@supabase/supabase-js": "^2.45.0",
    "@tanstack/react-query": "^5.50.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "framer-motion": "^11.0.0",
    "gsap": "^3.12.0",
    "lottie-react": "^2.4.0",
    "lucide-react": "^0.400.0",
    "next": "^14.2.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "tailwind-merge": "^2.4.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5"
  }
}
```

---

## 📁 6. Updated Repository Structure

```
life-rpg/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # 🏠 Landing (GSAP animations)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── dashboard/                  # 🎮 App (Framer Motion)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── character/page.tsx
│   │   │   ├── shop/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── tasks/complete/route.ts
│   │       └── ...
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn primitives (CLI-generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── landing/                    # 🏠 GSAP-powered components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeatureShowcase.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── Preloader.tsx
│   │   │
│   │   ├── game/                       # 🎮 Framer Motion components
│   │   │   ├── TaskCard.tsx
│   │   │   ├── XPBar.tsx
│   │   │   ├── LevelUpOverlay.tsx
│   │   │   ├── StreakFlame.tsx

│   │   │   ├── GoldCounter.tsx
│   │   │   └── ShopItemCard.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatsHUD.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   │
│   │   └── providers/
│   │       ├── ThemeProvider.tsx
│   │       └── QueryProvider.tsx
│   │
│   ├── lib/
│   │   ├── gsap.ts                     # GSAP setup & registration
│   │   ├── xp-engine.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   └── utils.ts                    # shadcn's cn() helper
│   │
│   └── hooks/
│       ├── useCompleteTask.ts
│       ├── useUserState.ts
│       └── useTasks.ts
│
├── animations/                         # Lottie JSON files
│   ├── level-up-burst.json
│   └── coin-drop.json
│
├── supabase/
│   └── migrations/
│
└── public/
    └── demo-video.mp4
```

---

## 🎨 7. Typography & Font Selection

For a gaming/RPG aesthetic with modern readability:

```tsx
// app/layout.tsx — Font setup
import { Space_Grotesk, JetBrains_Mono, Nunito } from 'next/font/google';

const displayFont = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-display',
    weight: ['500', '700'],
});

const bodyFont = Nunito({
    subsets: ['latin'],
    variable: '--font-body',
    weight: ['400', '600'],
});

const monoFont = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    weight: ['400', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${displayFont.variable} ${bodyFont.variable} 
                             ${monoFont.variable} font-body antialiased`}>
                {children}
            </body>
        </html>
    );
}
```

| Font | Usage | Why |
|---|---|---|
| **Space Grotesk** | Headings, display, hero | Geometric, futuristic — perfect for gaming UI |
| **Nunito** | Body, descriptions | Rounded, friendly — balances the sharp display font |
| **JetBrains Mono** | Numbers, XP counters, stats | Monospace = stable number width during animations |

---

## 🔄 8. When to Use GSAP vs Framer Motion — Decision Matrix

| Scenario | Use | Why |
|---|---|---|
| Landing page hero text reveal | **GSAP SplitText** | Character-by-character stagger with rotation |
| Scroll-triggered section pin | **GSAP ScrollTrigger** | Pin + scrub is ScrollTrigger's killer feature |
| Horizontal scroll panels | **GSAP ScrollTrigger** | Container animation with snap points |
| Task completion checkmark | **Framer Motion** | Spring physics on `whileTap` |
| XP bar filling | **Framer Motion `useSpring`** | Smooth spring that reacts to state change |
| Task list reordering | **Framer Motion `layout`** | Automatic FLIP animations |
| Modal open/close | **shadcn Dialog (Radix)** | Built-in focus trap, ARIA, exit animation |
| Level-up overlay | **Framer Motion + Lottie** | Component state change + pre-made particle effect |
| Background floating particles | **GSAP** | Infinite loop with random positions |
| Number counter on scroll | **GSAP ScrollTrigger** | Trigger when in viewport |
| Button hover glow | **CSS/Tailwind** | Simple transition, no JS needed |

---

## 🚀 9. Quick Start Commands

```bash
# 1. Create Next.js project
npx create-next-app@latest life-rpg --typescript --tailwind --eslint --app

# 2. Install shadcn/ui
npx shadcn@latest init

# 3. Add components
npx shadcn@latest add button card badge dialog dropdown-menu \
  select tabs toast tooltip input label textarea progress \
  avatar sheet skeleton scroll-area popover

# 4. Install GSAP
npm install gsap @gsap/react

# 5. Install Framer Motion (for dashboard animations)
npm install framer-motion

# 6. Install TanStack Query
npm install @tanstack/react-query

# 7. Install Supabase
npm install @supabase/ssr @supabase/supabase-js

# 8. Install Lottie
npm install lottie-react

# 9. Run dev server
npm run dev
```

---

## 🏆 Final Stack Summary

```
┌─────────────────────────────────────────────────────────┐
│                    LANDING PAGE                         │
│  GSAP + ScrollTrigger + SplitText                       │
│  → Cinematic scroll experience                          │
│  → SplitText character reveals                          │
│  → Pinned horizontal scroll sections                    │
│  → Scroll-driven parallax                               │
├─────────────────────────────────────────────────────────┤
│                    DASHBOARD APP                        │
│  shadcn/ui + Framer Motion + Lottie                     │
│  → Radix UI primitives (accessible)                     │
│  → Spring animations for interactions                   │
│  → Optimistic UI with TanStack Query                    │
│  → Level-up particle bursts                             │
├─────────────────────────────────────────────────────────┤
│                    BASE SYSTEM                          │
│  Tailwind CSS + CSS Variables + Next.js 14              │
│  → Custom RPG theme (dark, gaming)                      │
│  → Theme switching via [data-theme] attribute           │
│  → shadcn components shared across both layers          │
├─────────────────────────────────────────────────────────┤
│                    BACKEND                              │
│  Supabase + PostgreSQL + RLS                            │
│  → Server-side XP engine (anti-cheat)                   │
│  → Auth, data persistence, cross-device sync            │
└─────────────────────────────────────────────────────────┘
```

This architecture gives you:
- **A landing page that looks like a AAA game website** (GSAP)
- **A dashboard that feels like a native game UI** (shadcn + Framer Motion)
- **Full accessibility compliance** (Radix primitives)
- **Anti-cheat security** (server-side XP)
- **Theme purchasability** (CSS variables)
- **$0 infrastructure cost** (Vercel + Supabase free tier)"