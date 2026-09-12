'use client';

import Link from 'next/link';
import { Sword, Flame, Shield, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <Sword className="w-5 h-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-xl tracking-tight text-foreground">
              LIFE<span className="text-primary">RPG</span>
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              Season 1 Live
            </span>
          </div>
        </Link>

        {/* Center: Tactical HUD Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <a
            href="#how-it-works"
            className="transition-colors hover:text-foreground hover:text-primary flex items-center gap-1.5"
          >
            How It Works
          </a>
          <a
            href="#systems"
            className="transition-colors hover:text-foreground hover:text-primary flex items-center gap-1.5"
          >
            The Systems
          </a>
          <a
            href="#stats"
            className="transition-colors hover:text-foreground hover:text-primary flex items-center gap-1.5"
          >
            Stats & Proof
          </a>
          <a
            href="#themes"
            className="transition-colors hover:text-foreground hover:text-primary flex items-center gap-1.5"
          >
            Themes
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-foreground">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all"
            >
              Start Questing ⚔️
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
