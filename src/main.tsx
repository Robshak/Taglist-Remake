import App from '@app/App.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@shared/styles/globals.scss';
import { preloadTranslations } from './i18n';

preloadTranslations().then(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  createRoot(rootElement).render(
    import.meta.env.DEV ? (
      <StrictMode>
        <App />
      </StrictMode>
    ) : (
      <App />
    )
  );
});
