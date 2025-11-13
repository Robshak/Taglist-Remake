import type { TDotPaths } from '@shared/types/i18n';

import { createLocalNamespace } from '@/i18n/local.ts';

import type en from './en.ts';

type THeaderKeys = TDotPaths<typeof en>;

const NS = 'widget.Header' as const;

export const useI18n = createLocalNamespace<typeof NS, THeaderKeys>(NS, {
  en: () => import('./en.ts'),
  ru: () => import('./ru.ts'),
});
