'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckSquare, User, ShoppingBag, History, LogOut, Sword } from 'lucide-react';

const navigationItems = [
  { name: 'Quests', href: '/dashboard', icon: CheckSquare },
  { name: 'Character', href: '/dashboard/character', icon: User },
  { name: 'Shop & Themes', href: '/dashboard/shop', icon: ShoppingBag },
  { name: 'Audit History', href: '/dashboard/history', icon: History },
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
    <aside className="w-full md:w-64 md:min-h-screen bg-card border-r border-border/70 flex flex-col justify-between p-4">
      <div>
        {/* Brand / Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-4 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shadow-md">
            <Sword className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-foreground">LIFE RPG</span>
            <span className="block text-[10px] uppercase tracking-widest text-primary font-bold">Quest Console</span>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="space-y-1.5" aria-label="Dashboard navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md font-bold'
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
      <div className="pt-4 border-t border-border/70 mt-6">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
