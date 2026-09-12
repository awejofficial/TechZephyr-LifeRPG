'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { Sword, Lock, Mail, User, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff, Loader2, Shield, Brain, Clock, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const archetypes = [
  { id: 'discipline', label: 'Vanguard', icon: Clock, desc: 'Daily Focus & Habits' },
  { id: 'intellect', label: 'Scholar', icon: Brain, desc: 'Code, Reading & Study' },
  { id: 'strength', label: 'Titan', icon: Shield, desc: 'Fitness & Physical Power' },
  { id: 'creativity', label: 'Artisan', icon: Palette, desc: 'Design & Creative Work' },
];

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState('discipline');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage('Passphrase must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.trim() || 'Hero',
          archetype: selectedArchetype,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    // If session is immediately established
    if (data.session) {
      router.push('/dashboard');
      router.refresh();
      return;
    }

    // Otherwise attempt immediate sign-in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (!signInError) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setErrorMessage('Account created! Please check your email if confirmation is required.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden selection:bg-primary/30">
      {/* Ambient glow orbs */}
      <div className="absolute -top-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 sm:w-96 sm:h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
              <Sword className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">LIFE RPG</span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-1.5">
            Forge Your Character <Sparkles className="w-4 h-4 text-accent" />
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Begin your journey and turn everyday tasks into RPG levels.
          </p>
        </div>

        {/* Error message */}
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

        {/* Google OAuth Quick Sign Up */}
        <div className="mb-5">
          <GoogleAuthButton
            label="Sign up with Google"
            onError={(msg) => setErrorMessage(msg)}
          />
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-border/80 w-full" />
          <span className="bg-card px-3 text-[11px] uppercase font-bold tracking-wider text-muted-foreground absolute">
            or forge with email
          </span>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Hero Call-Sign
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. ShadowVanguard"
                className="w-full h-11 pl-10 pr-3.5 bg-secondary/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Starting Archetype Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Starting Focus Archetype
            </label>
            <div className="grid grid-cols-2 gap-2">
              {archetypes.map((arch) => {
                const Icon = arch.icon;
                const isSelected = selectedArchetype === arch.id;
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => setSelectedArchetype(arch.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-primary/15 border-primary text-primary font-bold shadow-sm'
                        : 'bg-secondary/30 border-border/70 text-muted-foreground hover:bg-secondary/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate leading-tight">{arch.label}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{arch.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

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
                className="w-full h-11 pl-10 pr-3.5 bg-secondary/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Passphrase <span className="text-[10px] text-muted-foreground font-normal">(min 6 characters)</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 bg-secondary/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-3 disabled:opacity-60 glow-primary active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Forging Character...</span>
              </>
            ) : (
              <>
                <span>Begin Adventure</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 pt-5 border-t border-border/70 text-xs text-muted-foreground">
          Already have a character?{' '}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline hover:text-primary/90 transition-colors"
          >
            Enter Realm →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
