'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { Sword, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(
        error.message === 'Invalid login credentials'
          ? 'Invalid email or password. Please verify your credentials or create a new character.'
          : error.message
      );
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden selection:bg-primary/30">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Header with RPG branding */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
              <Sword className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">LIFE RPG</span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Resume Your Quest</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Log in to sync your character level, attributes, and daily streak.
          </p>

          {/* Value perks badges */}
          <div className="flex items-center justify-center gap-2 mt-3.5 text-[11px] font-semibold text-muted-foreground">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/80 border border-border/70">
              <Sparkles className="w-3 h-3 text-primary" /> Anti-Cheat XP
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/80 border border-border/70">
              🔥 Streak Sync
            </span>
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold flex items-start gap-2.5"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </motion.div>
        )}

        {/* Google OAuth Quick Sign In */}
        <div className="mb-5">
          <GoogleAuthButton
            label="Continue with Google"
            onError={(msg) => setErrorMessage(msg)}
          />
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-border/80 w-full" />
          <span className="bg-card px-3 text-[11px] uppercase font-bold tracking-wider text-muted-foreground absolute">
            or sign in with email
          </span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hero@kingdom.com"
                className="w-full h-11 pl-10 pr-3.5 bg-secondary/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 bg-secondary/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 glow-primary active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Entering Realm...</span>
              </>
            ) : (
              <>
                <span>Enter Realm</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-5 border-t border-border/70 text-xs text-muted-foreground">
          New adventurer?{' '}
          <Link
            href="/signup"
            className="font-bold text-primary hover:underline hover:text-primary/90 transition-colors"
          >
            Create Character →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
