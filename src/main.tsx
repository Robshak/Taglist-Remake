import App from '@app/App.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@shared/styles/globals.scss';
import { preloadTranslations } from './i18n';

preloadTranslations().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
