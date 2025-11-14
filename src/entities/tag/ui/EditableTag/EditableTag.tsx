import React from 'react';

import { useI18n } from '../../lib';

interface ITagState {
  label: string;
  isActive: boolean;
  isEditing: boolean;
  editingValue: string;
}

interface ITagHandlers {
  onToggleActive: () => void;
  onEditStart: () => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDelete: () => void;
  onChangeEditingValue: (v: string) => void;
}

interface ITagClassNames {
  base: string;
  active?: string;
  editing?: string;
  input?: string;
  editBtn?: string;
  deleteBtn?: string;
  saveBtn?: string;
  cancelBtn?: string;
}

interface ITagIcons {
  edit?: React.ReactNode;
  delete?: React.ReactNode;
  save?: React.ReactNode;
  cancel?: React.ReactNode;
}

interface IEditableTagProps {
  tagState: ITagState;
  handlers: ITagHandlers;
  classNames: ITagClassNames;
  icons: ITagIcons;
}

const EditableTagComponent: React.FC<IEditableTagProps> = ({
  tagState,
  handlers,
  classNames,
  icons,
}) => {
  const { t } = useI18n();
  const { label, isActive, isEditing, editingValue } = tagState;
  const { onToggleActive, onEditStart, onEditSave, onEditCancel, onDelete, onChangeEditingValue } =
    handlers;
  const classes = [
    classNames.base,
    isActive ? classNames.active : '',
    isEditing ? classNames.editing : '',
  ]
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
            className={classNames.input}
            autoFocus
          />
          <button onClick={onEditSave} title={t('buttons.save')} className={classNames.saveBtn}>
            {icons.save}
          </button>
          <button
            onClick={onEditCancel}
            title={t('buttons.cancel')}
            className={classNames.cancelBtn}
          >
            {icons.cancel}
          </button>
        </>
      ) : (
        <>
          <span onClick={onToggleActive}>{label}</span>
          <button onClick={onEditStart} title={t('buttons.edit')} className={classNames.editBtn}>
            {icons.edit}
          </button>
          <button onClick={onDelete} title={t('buttons.delete')} className={classNames.deleteBtn}>
            {icons.delete}
          </button>
        </>
      )}
    </div>
  );
};

export const EditableTag = React.memo(EditableTagComponent);
