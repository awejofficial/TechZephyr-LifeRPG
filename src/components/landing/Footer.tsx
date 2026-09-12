'use client';

import Link from 'next/link';
import { Sword, Shield, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/90 text-muted-foreground text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                <Sword className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display font-black text-xl tracking-tight text-foreground">
                LIFE<span className="text-primary">RPG</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-sm leading-relaxed">
              The next-generation gamified habit operating system. Forge iron discipline, master your
              attributes, and transform daily routines into epic adventures.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border/50 text-[11px] font-mono text-foreground/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Core Game Server: Online</span>
            </div>
          </div>

          {/* Col 1 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-foreground">
              Systems
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  Quest Engine
                </a>
              </li>
              <li>
                <a href="#systems" className="hover:text-primary transition-colors">
                  Attributes & XP
                </a>
              </li>
              <li>
                <a href="#systems" className="hover:text-primary transition-colors">
                  Anti-Cheat Protection
                </a>
              </li>
              <li>
                <a href="#themes" className="hover:text-primary transition-colors">
                  Theme Marketplace
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-foreground">
              Guild & App
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Live Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-primary transition-colors">
                  Create Hero Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-foreground">
              Protocol
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-muted-foreground/60">Privacy Policy</span>
              </li>
              <li>
                <span className="text-muted-foreground/60">Terms of Questing</span>
              </li>
              <li>
                <span className="text-muted-foreground/60">Security Disclosures</span>
              </li>
              <li className="pt-2 font-mono text-[10px] text-muted-foreground/50">
                LIFE_RPG // BUILD 2025.1
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Life RPG. Level up your reality.</p>
          <p className="font-mono text-muted-foreground/60">
            Season 1: The Awakening • Non-linear progression enabled
          </p>
        </div>
      </div>
    </footer>
  );
}
