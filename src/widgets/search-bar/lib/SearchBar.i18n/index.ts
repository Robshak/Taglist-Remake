import type { TDotPaths } from '@shared/types/i18n';

import { createLocalNamespace } from '@/i18n/local.ts';

import type en from './en.ts';

type TSearchBarKeys = TDotPaths<typeof en>;

const NS = 'widget.SearchBar' as const;

export const useI18n = createLocalNamespace<typeof NS, TSearchBarKeys>(NS, {
  en: () => import('./en.ts'),
  ru: () => import('./ru.ts'),
});
