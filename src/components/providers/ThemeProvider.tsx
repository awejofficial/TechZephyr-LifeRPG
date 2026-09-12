'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'default',
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  initialTheme = 'default',
}: {
  children: React.ReactNode;
  initialTheme?: string;
}) {
  const [theme, setThemeState] = useState<string>(initialTheme);

  useEffect(() => {
    // Check localStorage fallback if not set
    const saved = localStorage.getItem('life-rpg-theme');
    if (saved && !initialTheme) {
      setThemeState(saved);
    }
  }, [initialTheme]);

  useEffect(() => {
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('life-rpg-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
