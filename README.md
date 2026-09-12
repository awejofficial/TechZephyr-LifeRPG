# ⚔️ Life RPG — Gamified Productivity Web Application

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **Level up in real life with every quest completed.** A full-stack gamified productivity engine that bridges the delayed gratification gap by transforming everyday tasks into an immersive RPG progression loop.

---

## 🌟 Core Differentiators & Highlights

1. **Server-Authoritative Anti-Cheat**: All XP rewards, leveling math, and currency generation execute strictly inside PostgreSQL stored procedures (`complete_task_transaction`) and server routes. Clients can never forge XP values.
2. **Exponential 1.2× Non-Linear Leveling**: Early tiers reward rapid momentum; advanced levels require sustained dedication.
3. **Multi-Attribute Evolution**: Quests map to distinct RPG stats:
   - ⏰ **Discipline**: Habit building & focus routines
   - 🧠 **Intellect**: Coding, reading & studying
   - 💪 **Strength**: Fitness, workouts & conditioning
   - 🎨 **Creativity**: Design, writing & crafts
   - 🤝 **Social**: Networking, leadership & collaboration
4. **Dynamic Visual Themes**: Earn gold from quests and purchase themes (Default Dark Knight, Cyberpunk Neon, Forest Ranger, Solar Flare) that rewrite the application's CSS design tokens at runtime.
5. **Instant Tactile "Game Feel"**: Optimistic UI with automatic rollback on error, celebratory particle bursts, spring physics, and Web Audio victory fanfares.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   👤 BROWSER CLIENT                     │
│  Next.js 14 App Router (RSC + Client Components)        │
│  ├── Framer Motion (spring animations & layout FLIP)    │
│  ├── TanStack React Query (optimistic UI + cache)       │
│  └── Dynamic ThemeProvider (CSS Custom Properties)      │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTPS / API Routes
┌───────────────────────────▼─────────────────────────────┐
│                 ⚙️ NEXT.JS SERVER API                   │
│  ├── /api/auth/callback       → Supabase Auth session   │
│  ├── /api/tasks               → Zod validated CRUD      │
│  ├── /api/tasks/complete      → 🎯 XP Anti-Cheat Engine │
│  ├── /api/character           → Profile & level stats   │
│  ├── /api/shop/purchase       → Atomic economy handler  │
│  └── /api/shop/equip          → Dynamic theme switcher  │
└───────────────────────────┬─────────────────────────────┘
                            │ Supabase SSR Client
┌───────────────────────────▼─────────────────────────────┐
│               💾 SUPABASE DATA LAYER                    │
│  ├── PostgreSQL with Row Level Security (RLS)           │
│  ├── Atomic Stored Procedures (`SECURITY DEFINER`)      │
│  ├── Immutable Audit Trail (`xp_events`, `task_logs`)   │
│  └── Auth Triggers (automatic character initialization) │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js 18.x or 20.x+
- A Supabase Project (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/your-org/team-hacky.git
cd team-hacky
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Database Schema Provisioning
Run the SQL DDL and transaction functions against your Supabase project (via Supabase SQL Editor or Supabase CLI):
- Enums & Tables: `users`, `tasks`, `xp_events`, `task_logs`, `streak_events`, `items`, `inventory`.
- Stored Procedures: `complete_task_transaction`, `purchase_item_transaction`, `equip_theme_transaction`.
- RLS Policies: Strict row ownership isolation with `(select auth.uid()) = user_id`.

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the automated mathematical verification test for the XP engine and streak multiplier:
```bash
npx tsx scripts/verify-engine.ts
```

Run TypeScript compiler check:
```bash
npx tsc --noEmit
```

Build for production:
```bash
npm run build
```

---

## 🛡️ Anti-Cheat & Robustness Safeguards

| Attack Vector | Countermeasure | Implementation |
|---|---|---|
| **Client-Side Stat Forging** | Server-Authoritative Math | Client only submits `{ taskId }`; server calculates all XP and gold. |
| **Check / Uncheck Farming** | Completion Cooldowns | `completion_cooldown_until` field enforces a cooldown period per task. |
| **Rapid Automation / Botting** | Rate Limiting | Max 15 quest completion events allowed per hour per user. |
| **Cross-User Data Leaks** | Row Level Security (RLS) | Strictly enabled on all tables using `(select auth.uid()) = user_id`. |
| **Network Interruption** | Offline Banner & Rollback | Automatic optimistic rollback + persistent offline alerts. |

---

## 📄 License
This project is open-source and licensed under the MIT License.
