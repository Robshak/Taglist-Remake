import { Modal } from '@shared/ui';
import React from 'react';

import s from './SaveFilterDialog.module.scss';
import { useI18n } from '../../lib';

interface SaveFilterDialogProps {
  isOpen: boolean;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export const SaveFilterDialog: React.FC<SaveFilterDialogProps> = ({
  isOpen,
  value,
  onChange,
  onCancel,
  onSubmit,
}) => {
  const { t } = useI18n();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      overlayClassName={s.overlay}
      contentClassName={s.dialog}
    >
      <h4>{t('saveSettingsTitle')}</h4>
      <input
        type="text"
        placeholder={t('placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
        autoFocus
      />
      <div className={s.buttons}>
        <button onClick={onCancel}>{t('buttons.cancel')}</button>
        <button onClick={onSubmit} disabled={!value.trim()}>
          {t('buttons.save')}
        </button>
      </div>
    </Modal>
  );
};
