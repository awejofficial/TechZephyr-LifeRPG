'use client';

import { Marquee } from '@/components/magicui/marquee';
import { Sparkles, Trophy, Flame, Shield, Sword, Award } from 'lucide-react';

const LIVE_EVENTS = [
  {
    icon: Trophy,
    player: 'Sarah K.',
    action: 'leveled up to Scholar Lv 19',
    badge: '+300 XP',
    time: '4m ago',
    color: 'text-primary border-primary/30 bg-primary/10',
  },
  {
    icon: Flame,
    player: 'Marcus T.',
    action: 'achieved 45-day Iron Streak',
    badge: '1.5x MULTIPLIER',
    time: '9m ago',
    color: 'text-streak border-streak/30 bg-streak/10',
  },
  {
    icon: Sparkles,
    player: 'Elena R.',
    action: 'unlocked Cyberpunk Neon Theme',
    badge: '500 GOLD',
    time: '14m ago',
    color: 'text-accent border-accent/30 bg-accent/10',
  },
  {
    icon: Sword,
    player: 'David M.',
    action: 'vanquished Epic Quest: "Ship Production Release"',
    badge: '+100 XP',
    time: '21m ago',
    color: 'text-gold border-gold/30 bg-gold/10',
  },
  {
    icon: Shield,
    player: 'Aiden C.',
    action: 'forged character as Titan Archetype',
    badge: 'NEW HERO',
    time: '27m ago',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    icon: Award,
    player: 'Core Engine',
    action: 'verified 42,000 server-side quest logs',
    badge: 'ANTI-CHEAT OK',
    time: '35m ago',
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  },
];

export function GuildMarquee() {
  return (
    <div className="relative w-full py-5 overflow-hidden border-y border-border/40 bg-card/40 backdrop-blur-md">
      <div className="flex items-center">
        <div className="hidden lg:flex items-center gap-2 pl-6 pr-4 shrink-0 border-r border-border/40 text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>REALM DISPATCH:</span>
        </div>

        <Marquee pauseOnHover className="[--duration:35s]">
          {LIVE_EVENTS.map((event, idx) => {
            const Icon = event.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-1.5 mx-2 rounded-full bg-background/60 border border-border/50 text-xs text-foreground/90 backdrop-blur-sm"
              >
                <div className={`p-1 rounded-full border ${event.color}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-foreground font-display">{event.player}</span>
                  <span className="text-muted-foreground">{event.action}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${event.color}`}>
                  {event.badge}
                </span>
                <span className="text-[10px] text-muted-foreground/60 font-mono">{event.time}</span>
              </div>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
}
