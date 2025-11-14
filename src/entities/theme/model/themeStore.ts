import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TThemeMode = 'light' | 'dark' | 'system';

interface IThemeState {
  theme: TThemeMode;
  setTheme: (mode: TThemeMode) => void;
  toggleTheme: () => void;
  initThemeFromStorage?: () => void;
}

const applyThemeDom = (mode: TThemeMode) => {
  const resolved =
    mode === 'system'
      ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : mode;
  document.documentElement.setAttribute('data-theme', resolved);
};

export const useThemeStore = create<IThemeState>()(
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
