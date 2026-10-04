import { useCallback, useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

let currentTheme: Theme | undefined;
const listeners = new Set<() => void>();

function isStorageAccessError(error: unknown): error is DOMException {
  return (
    error instanceof DOMException &&
    (error.name === 'SecurityError' || error.name === 'QuotaExceededError')
  );
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  let stored: string | null;
  try {
    stored = localStorage.getItem('theme');
  } catch (error) {
    if (!isStorageAccessError(error)) throw error;
    console.warn('Theme preference could not be read from local storage.', error);
    stored = null;
  }
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function storeTheme(theme: Theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    if (!isStorageAccessError(error)) throw error;
    console.warn('Theme preference could not be saved to local storage.', error);
  }
}

function getThemeSnapshot(): Theme {
  currentTheme ??= getInitialTheme();
  return currentTheme;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function toggleSharedTheme() {
  currentTheme = getThemeSnapshot() === 'light' ? 'dark' : 'light';
  listeners.forEach((listener) => listener());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, (): Theme => 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storeTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(toggleSharedTheme, []);

  return { theme, toggleTheme };
}
