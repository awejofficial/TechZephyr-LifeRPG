'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface GoogleAuthButtonProps {
  label?: string;
  onError?: (msg: string) => void;
}

export function GoogleAuthButton({
  label = 'Continue with Google',
  onError,
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const redirectUrl = `${window.location.origin}/api/auth/callback?next=/dashboard`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setIsLoading(false);
        onError?.(error.message);
      }
    } catch (err: unknown) {
      setIsLoading(false);
      onError?.(err instanceof Error ? err.message : 'Failed to initialize Google authentication');
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01, backgroundColor: 'hsl(var(--secondary))' }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full h-11 px-4 rounded-xl border border-border/90 bg-secondary/40 text-foreground font-semibold text-sm shadow-sm hover:border-border transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      aria-label={label}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      ) : (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      )}
      <span className="text-sm font-medium tracking-tight">
        {isLoading ? 'Connecting to Google...' : label}
      </span>
    </motion.button>
  );
}
