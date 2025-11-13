import type { TDotPaths } from '@shared/types/i18n';

import { createLocalNamespace } from '@/i18n/local.ts';

import type en from './en.ts';

type TSidebarKeys = TDotPaths<typeof en>;

const NS = 'widget.Sidebar' as const;

export const useI18n = createLocalNamespace<typeof NS, TSidebarKeys>(NS, {
  en: () => import('./en.ts'),
  ru: () => import('./ru.ts'),
});
