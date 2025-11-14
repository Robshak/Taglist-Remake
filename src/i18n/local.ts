import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import i18n from './index';

type TLoaderMap = {
  en: () => Promise<{ default: unknown }>;
  ru: () => Promise<{ default: unknown }>;
};

const loadedNamespaces = new Set<string>();
const loadingPromises = new Map<string, Promise<void>>();

export function createLocalNamespace<NS extends string, Keys extends string>(
  namespace: NS,
  loaders: TLoaderMap
) {
  const loadResources = async () => {
    if (loadedNamespaces.has(namespace)) {
      return;
    }

    if (loadingPromises.has(namespace)) {
      return loadingPromises.get(namespace);
    }

    const promise = (async () => {
      try {
        const [enModule, ruModule] = await Promise.all([loaders.en(), loaders.ru()]);

        i18n.addResourceBundle('en', namespace, enModule.default, true, true);
        i18n.addResourceBundle('ru', namespace, ruModule.default, true, true);

        loadedNamespaces.add(namespace);
      } catch (error) {
        console.error(`Failed to load translations for namespace: ${namespace}`, error);
      } finally {
        loadingPromises.delete(namespace);
      }
    })();

    loadingPromises.set(namespace, promise);
    return promise;
  };

  const useI18n = function () {
    const { t, i18n: i18nInstance, ready } = useTranslation(namespace);
    const [isLoaded, setIsLoaded] = useState(loadedNamespaces.has(namespace));

    useEffect(() => {
      if (!loadedNamespaces.has(namespace)) {
        loadResources().then(() => setIsLoaded(true));
      }
    }, []);

    return {
      t: (key: Keys, params?: Record<string, string | number>) => {
        return ready && isLoaded ? t(key, params) : key;
      },
      language: i18nInstance.language,
      changeLanguage: i18nInstance.changeLanguage,
      isLoaded,
    };
  };

  useI18n.preload = loadResources;

  return useI18n;
}
