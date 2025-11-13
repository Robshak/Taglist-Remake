import type { TDotPaths } from '@shared/types/i18n';

import { createLocalNamespace } from '@/i18n/local.ts';

import type en from './en.ts';

type TTrackTagsManagerKeys = TDotPaths<typeof en>;

const NS = 'shared.TrackTagsManager' as const;

export const useI18n = createLocalNamespace<typeof NS, TTrackTagsManagerKeys>(NS, {
  en: () => import('./en.ts'),
  ru: () => import('./ru.ts'),
});
