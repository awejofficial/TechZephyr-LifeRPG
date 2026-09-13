'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Home,
  CheckSquare,
  User,
  Backpack,
  ShoppingBag,
  TrendingUp,
  History,
  LogOut,
  Shield,
  Award,
} from 'lucide-react';

const navigationItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Quests', href: '/dashboard/quests', icon: CheckSquare },
  { name: 'Character', href: '/dashboard/character', icon: User },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Backpack },
  { name: 'Shop', href: '/dashboard/shop', icon: ShoppingBag },
  { name: 'Progress', href: '/dashboard/progress', icon: TrendingUp },
  { name: 'History', href: '/dashboard/history', icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 min-h-screen bg-card/90 backdrop-blur-xl border-r border-border/70 flex-col justify-between p-4 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Brand Emblem matching Reference */}
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-4 mb-5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 via-accent/20 to-gold/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:scale-105 transition-all">
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-foreground flex items-center gap-1">
                Life <span className="text-primary">RPG</span>
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-muted-foreground">
                Season 1: Awakening
              </span>
            </div>
          </Link>

          {/* Navigation items */}
          <nav className="space-y-1.5" aria-label="Dashboard navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-bold scale-[1.02]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Sign Out */}
        <div className="pt-4 border-t border-border/60 mt-6">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:ring-2 focus-visible:ring-destructive focus-visible:outline-none"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar matching Reference */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/70 px-2 pb-safe shadow-2xl"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-0.5 py-2 px-2.5 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={item.name}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                <span className="text-[10px] font-semibold tracking-tight">{item.name}</span>
                {isActive && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
