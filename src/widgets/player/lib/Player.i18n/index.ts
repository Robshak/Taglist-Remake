import type { TDotPaths } from '@shared/types/i18n';

import { createLocalNamespace } from '@/i18n/local.ts';

import type en from './en.ts';

type TPlayerKeys = TDotPaths<typeof en>;

const NS = 'widget.Player' as const;

export const useI18n = createLocalNamespace<typeof NS, TPlayerKeys>(NS, {
  en: () => import('./en.ts'),
  ru: () => import('./ru.ts'),
});
