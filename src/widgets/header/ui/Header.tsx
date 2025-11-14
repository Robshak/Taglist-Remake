import { useThemeStore } from '@entities/theme';
import AppLogo from '@shared/svg/AppLogo.svg?react';
import GlobeIcon from '@shared/svg/Globe.svg?react';
import MenuIcon from '@shared/svg/Menu.svg?react';
import MoonIcon from '@shared/svg/Moon.svg?react';
import SunIcon from '@shared/svg/Sun.svg?react';
import { Modal, Icon } from '@shared/ui';
import { Sidebar } from '@widgets/sidebar/ui';
import { motion } from 'motion/react';
import { useState } from 'react';

import { setLanguage, type TLanguage } from '@/i18n';

import { useI18n } from '../lib';
import s from './Header.module.scss';

export const Header = () => {
  const { t, language } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const toggleLanguage = () => {
    const nextLang: TLanguage = language === 'en' ? 'ru' : 'en';
    setLanguage(nextLang);
  };

  return (
    <motion.header
      className={s.header}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className={s.container}>
        <div className={s.logo}>
          <Icon component={AppLogo} width={32} height={32} aria-hidden />
          <h1 className={s.title}>Taglist</h1>
        </div>
        <div className={s.actions}>
          <button
            className={`${s.actionBtn} ${s.languageToggle}`}
            onClick={toggleLanguage}
            aria-label={t('buttons.language')}
            title={t(`languages.${language === 'en' ? 'ru' : 'en'}`)}
          >
            <Icon component={GlobeIcon} width={24} height={24} />
            <span className={s.langText}>{language.toUpperCase()}</span>
          </button>
          <button
            className={`${s.actionBtn} ${s.themeToggle}`}
            onClick={toggleTheme}
            aria-label={t('buttons.theme')}
          >
            {theme === 'light' ? (
              <Icon component={MoonIcon} width={24} height={24} />
            ) : (
              <Icon component={SunIcon} width={24} height={24} />
            )}
          </button>
          <button
            className={`${s.actionBtn} ${s.menu}`}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label={t('buttons.menu')}
          >
            <Icon component={MenuIcon} width={24} height={24} />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        overlayClassName={s.mobileOverlay}
        contentClassName={s.mobileSheet}
        overlayMotionProps={{
          drag: 'y',
          dragConstraints: { top: 0, bottom: 0 },
          dragElastic: 0.2,
          onDragEnd: (_e, info) => {
            if (info.offset.y > 120 || info.velocity.y > 800) {
              setIsMobileMenuOpen(false);
            }
          },
        }}
        contentMotionProps={{
          drag: 'y',
          dragConstraints: { top: 0, bottom: 0 },
          dragElastic: 0.2,
          onDragEnd: (_e, info) => {
            if (info.offset.y > 120 || info.velocity.y > 800) {
              setIsMobileMenuOpen(false);
            }
          },
        }}
      >
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </Modal>
    </motion.header>
  );
};
