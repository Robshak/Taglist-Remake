import { useHistoryStore } from '@entities/history';
import { useThemeStore } from '@entities/theme';
import { Header } from '@widgets/header';
import { Player } from '@widgets/player';
import { SearchBar } from '@widgets/search-bar';
import { Sidebar } from '@widgets/sidebar';
import { TrackList } from '@widgets/track-list';
import { useEffect } from 'react';

import s from './App.module.scss';

function App() {
  const initTheme = useThemeStore((state) => state.initThemeFromStorage);
  const initHistory = useHistoryStore((state) => state.initHistoryFromStorage);

  useEffect(() => {
    initTheme?.();
    initHistory?.();
  }, [initTheme, initHistory]);

  return (
    <div className={s.app}>
      <div className={s.container}>
        <main className={s.main}>
          <Header />
          <div className={s.search}>
            <SearchBar />
          </div>
          <div className={s.content}>
            <TrackList />
          </div>
        </main>
        <aside className={s.sidebar}>
          <Sidebar />
        </aside>
      </div>
      <Player />
    </div>
  );
}

export default App;
