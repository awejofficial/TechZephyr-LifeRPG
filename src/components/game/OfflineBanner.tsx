'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 text-sm font-semibold shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>Connection lost. Your actions will resume once connectivity is restored.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
