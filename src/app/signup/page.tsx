'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sword,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Brain,
  Clock,
  Palette,
} from 'lucide-react';
import { motion } from 'framer-motion';

const archetypes = [
  { id: 'discipline', label: 'Vanguard', icon: Clock, desc: 'Daily Focus & Habits' },
  { id: 'intellect', label: 'Scholar', icon: Brain, desc: 'Code, Reading & Study' },
  { id: 'strength', label: 'Titan', icon: Shield, desc: 'Fitness & Physical Power' },
  { id: 'creativity', label: 'Artisan', icon: Palette, desc: 'Design & Creative Work' },
];

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState('discipline');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const queryEmail = searchParams.get('email');
    if (queryEmail) {
      setEmail(queryEmail);
    }
  }, [searchParams]);

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
    <AuthLayout activeTab="signup">
      {/* Navigation Tabs (shadcn/radix) */}
      <Tabs defaultValue="signup" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="login"
            onClick={() => router.push('/login')}
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger value="signup" className="font-mono text-xs uppercase tracking-wider">
            Create Hero
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Header Info */}
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-display font-black tracking-tight text-foreground">
          Forge Your Character
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Select your class archetype and begin earning cryptographic XP today.
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
        <span className="bg-card px-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground absolute">
          or forge with email
        </span>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSignup} className="space-y-4">
        {/* Archetype Selector */}
        <div>
          <label className="block text-xs font-mono font-medium text-muted-foreground mb-2">
            Starting Archetype
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
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/15 shadow-sm shadow-primary/20 text-foreground'
                      : 'border-border/50 bg-background/40 hover:border-border text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-bold font-display">{arch.label}</span>
                  </div>
                  <span className="text-[10px] leading-tight text-muted-foreground">
                    {arch.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-xs font-mono font-medium text-muted-foreground mb-1.5"
          >
            Hero Alias
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. ShadowWalker"
              className="pl-10 h-11 bg-background/50 border-border/60 text-sm focus-visible:ring-primary/60"
            />
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
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
              <span>Forging Character...</span>
            </>
          ) : (
            <>
              <span>Begin Adventure</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center mt-6 pt-5 border-t border-border/50 text-xs text-muted-foreground">
        Already have a character?{' '}
        <Link
          href="/login"
          className="font-bold text-primary hover:underline hover:text-primary/90 transition-colors"
        >
          Enter Realm →
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
