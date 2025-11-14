import { useI18n as useTagsLineI18n } from '@entities/tag/lib/TagsLine.i18n';
import { useI18n as useTagFilterI18n } from '@features/filter/lib/TagFilter.i18n';
import { useI18n as useHeaderI18n } from '@widgets/header/lib/Header.i18n';
import { useI18n as usePlayerI18n } from '@widgets/player/lib/Player.i18n';
import { useI18n as useSearchBarI18n } from '@widgets/search-bar/lib/SearchBar.i18n';
import { useI18n as useSidebarI18n } from '@widgets/sidebar/lib/Sidebar.i18n';
import { useI18n as useTrackListI18n } from '@widgets/track-list/lib/TrackList.i18n';
import { useI18n as useTrackTagsManagerI18n } from '@widgets/TrackTagsManager/lib/TrackTagsManager.i18n';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const LANGUAGES = {
  en: 'English',
  ru: 'Русский',
} as const;

export type TLanguage = keyof typeof LANGUAGES;

const getBrowserLanguage = (): TLanguage => {
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' || browserLang === 'ru' ? browserLang : 'ru';
};

const getSavedLanguage = (): TLanguage => {
  const saved = localStorage.getItem('language');
  if (saved === 'en' || saved === 'ru') {
    return saved;
  }
  return getBrowserLanguage();
};

i18n.use(initReactI18next).init({
  resources: {},
  lng: getSavedLanguage(),
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const preloadTranslations = async () => {
  await Promise.all([
    useHeaderI18n.preload(),
    useSidebarI18n.preload(),
    useSearchBarI18n.preload(),
    usePlayerI18n.preload(),
    useTrackListI18n.preload(),
    useTagFilterI18n.preload(),
    useTrackTagsManagerI18n.preload(),
    useTagsLineI18n.preload(),
  ]);
};

export const setLanguage = (lang: TLanguage) => {
  localStorage.setItem('language', lang);
  i18n.changeLanguage(lang);
};

export default i18n;
