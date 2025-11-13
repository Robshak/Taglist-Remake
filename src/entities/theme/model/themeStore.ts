import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  initThemeFromStorage?: () => void;
}

const applyThemeDom = (mode: ThemeMode) => {
  const resolved =
    mode === 'system'
      ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : mode;
  document.documentElement.setAttribute('data-theme', resolved);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (mode) => {
        set({ theme: mode });
        applyThemeDom(mode);
      },
      toggleTheme: () => {
        const current = get().theme;
        const next = current === 'light' ? 'dark' : 'light';
        set({ theme: next });
        applyThemeDom(next);
      },
      initThemeFromStorage: () => {
        applyThemeDom(get().theme);
      },
    }),
    {
      name: 'theme-store',
      partialize: (s) => ({ theme: s.theme }),
    }
  )
);
