'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sword, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
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
          ? 'Invalid email or password. Please verify credentials or forge a new hero.'
          : error.message
      );
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <AuthLayout activeTab="login">
      {/* Navigation Tabs (shadcn/radix) */}
      <Tabs defaultValue="login" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" className="font-mono text-xs uppercase tracking-wider">
            Sign In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            onClick={() => router.push('/signup')}
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Create Hero
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Header Info */}
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-display font-black tracking-tight text-foreground">
          Welcome Back, Adventurer
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Access your character progression, active mission board, and daily streak.
        </p>
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
        <span className="bg-card px-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground absolute">
          or credentials
        </span>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-mono font-medium text-muted-foreground mb-1.5"
          >
            Hero Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adventurer@realm.com"
              className="pl-10 h-11 bg-background/50 border-border/60 text-sm focus-visible:ring-primary/60"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-mono font-medium text-muted-foreground"
            >
              Secret Passphrase
            </label>
            <span className="text-[11px] text-muted-foreground/60">Min 6 characters</span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 pr-10 h-11 bg-background/50 border-border/60 text-sm focus-visible:ring-primary/60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Enter Realm</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center mt-6 pt-5 border-t border-border/50 text-xs text-muted-foreground">
        Need a new character?{' '}
        <Link
          href="/signup"
          className="font-bold text-primary hover:underline hover:text-primary/90 transition-colors"
        >
          Forge Character →
        </Link>
      </div>
    </AuthLayout>
  );
}
