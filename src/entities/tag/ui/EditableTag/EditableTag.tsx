import React from 'react';

import { useI18n } from '../../lib';

interface EditableTagProps {
  label: string;
  isActive: boolean;
  isEditing: boolean;
  editingValue: string;
  onChangeEditingValue: (v: string) => void;
  onToggleActive: () => void;
  onEditStart: () => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDelete: () => void;
  className: string;
  activeClassName?: string;
  editingClassName?: string;
  inputClassName?: string;
  editBtnClassName?: string;
  deleteBtnClassName?: string;
  saveBtnClassName?: string;
  cancelBtnClassName?: string;
  editIcon?: React.ReactNode;
  deleteIcon?: React.ReactNode;
  saveIcon?: React.ReactNode;
  cancelIcon?: React.ReactNode;
}

export const EditableTag: React.FC<EditableTagProps> = ({
  label,
  isActive,
  isEditing,
  editingValue,
  onChangeEditingValue,
  onToggleActive,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDelete,
  className,
  activeClassName,
  editingClassName,
  inputClassName,
  editBtnClassName,
  deleteBtnClassName,
  saveBtnClassName,
  cancelBtnClassName,
  editIcon,
  deleteIcon,
  saveIcon,
  cancelIcon,
}) => {
  const { t } = useI18n();
  const classes = [className, isActive ? activeClassName : '', isEditing ? editingClassName : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editingValue}
            onChange={(e) => onChangeEditingValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') onEditSave();
              if (e.key === 'Escape') onEditCancel();
            }}
            onClick={(e) => e.stopPropagation()}
            className={inputClassName}
            autoFocus
          />
          <button onClick={onEditSave} title={t('buttons.save')} className={saveBtnClassName}>
            {saveIcon}
          </button>
          <button onClick={onEditCancel} title={t('buttons.cancel')} className={cancelBtnClassName}>
            {cancelIcon}
          </button>
        </>
      ) : (
        <>
          <span onClick={onToggleActive}>{label}</span>
          <button onClick={onEditStart} title={t('buttons.edit')} className={editBtnClassName}>
            {editIcon}
          </button>
          <button onClick={onDelete} title={t('buttons.delete')} className={deleteBtnClassName}>
            {deleteIcon}
          </button>
        </>
      )}
    </div>
  );
};
