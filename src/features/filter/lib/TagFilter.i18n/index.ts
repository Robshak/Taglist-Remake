import type { TDotPaths } from '@shared/types/i18n';

import { createLocalNamespace } from '@/i18n/local.ts';

import type en from './en.ts';

type TTagFilterKeys = TDotPaths<typeof en>;

export const useI18n = createLocalNamespace<'tagsLine', TTagFilterKeys>('tagsLine', {
  en: () => import('./en.ts'),
  ru: () => import('./ru.ts'),
});
