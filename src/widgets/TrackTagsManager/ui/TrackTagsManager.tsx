import { EditableTag } from '@entities/tag';
import CheckIcon from '@shared/svg/Check.svg?react';
import EditIcon from '@shared/svg/Pencil.svg?react';
import DeleteIcon from '@shared/svg/Trash.svg?react';
import CloseIcon from '@shared/svg/X.svg?react';
import type { ITrack } from '@shared/types';
import { Icon } from '@shared/ui';
import { AnimatePresence, motion } from 'motion/react';
import { createPortal } from 'react-dom';

import { useI18n } from '../lib';
import { useTagManager } from '../model';
import { ActiveTagsList } from './ActiveTagsList';
import { CreateTagForm } from './CreateTagForm';
import s from './TrackTagsManager.module.scss';

interface ITrackTagsManagerProps {
  track?: ITrack;
  onClose: () => void;
}

export const TrackTagsManager = ({ track, onClose }: ITrackTagsManagerProps) => {
  const { t } = useI18n();
  const {
    allCustomTags,
    trackCustomTags,
    newTagName,
    setNewTagName,
    showCreateTag,
    tagError,
    editingTagId,
    editingTagName,
    setEditingTagName,
    handleAddTag,
    handleRemoveTag,
    handleCreateTag,
    handleDeleteTag,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    toggleCreateForm,
    clearTagError,
  } = useTagManager(track);

  const onDeleteTagWithConfirm = (tag: string) => {
    if (confirm(t('buttons.delete', { tag }))) {
      handleDeleteTag(tag);
    }
  };

  return createPortal(
    <motion.div
      className={s.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={s.trackTagsManager}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={s.header}>
          <div>
            <h3 className={s.title}>{t('title')}</h3>
            {track && (
              <p className={s.trackName}>
                {track.name} - {track.artist}
              </p>
            )}
          </div>
          <button className={s.close} onClick={onClose}>
            <Icon component={CloseIcon} width={24} height={24} />
          </button>
        </div>

        <div className={s.content}>
          {track && (
            <div className={s.section}>
              <h4>{t('sections.trackTags.title')}</h4>
              <ActiveTagsList
                tags={trackCustomTags}
                onRemoveTag={handleRemoveTag}
                emptyMessage={t('sections.trackTags.empty')}
              />
            </div>
          )}

          <div className={s.section}>
            <div className={s.sectionHeader}>
              <h4>{t('sections.allTags.title')}</h4>
              <button
                className={`${s.createBtn} ${showCreateTag ? s.isOpen : ''}`}
                onClick={toggleCreateForm}
              >
                {showCreateTag ? t('buttons.cancel') : t('buttons.create')}
              </button>
            </div>

            <AnimatePresence>
              {showCreateTag && (
                <CreateTagForm
                  newTagName={newTagName}
                  onNewTagNameChange={setNewTagName}
                  onSubmit={() => handleCreateTag(t('errors.tagExists'))}
                  tagError={tagError}
                  onClearError={clearTagError}
                  placeholder={t('form.placeholder')}
                  submitButtonText={t('form.createButton')}
                />
              )}
            </AnimatePresence>

            <div className={s.tags}>
              {allCustomTags.length === 0 ? (
                <p className={s.empty}>{t('sections.allTags.empty')}</p>
              ) : (
                allCustomTags.map((tag: string) => {
                  const isActive = trackCustomTags.includes(tag);
                  const isEditing = editingTagId === tag;

                  return (
                    <EditableTag
                      key={tag}
                      tagState={{
                        label: tag,
                        isActive,
                        isEditing,
                        editingValue: editingTagName,
                      }}
                      handlers={{
                        onToggleActive: () => (isActive ? handleRemoveTag(tag) : handleAddTag(tag)),
                        onEditStart: () => handleStartEdit(tag),
                        onEditSave: () => handleSaveEdit(tag),
                        onEditCancel: handleCancelEdit,
                        onDelete: () => onDeleteTagWithConfirm(tag),
                        onChangeEditingValue: setEditingTagName,
                      }}
                      classNames={{
                        base: s.tag,
                        active: s.tagActive,
                        editing: s.tagEditing,
                        input: s.tagInput,
                        editBtn: s.editBtn,
                        deleteBtn: s.deleteTag,
                        saveBtn: s.saveBtn,
                        cancelBtn: s.cancelBtn,
                      }}
                      icons={{
                        edit: <Icon component={EditIcon} width={16} height={16} />,
                        delete: <Icon component={DeleteIcon} width={16} height={16} />,
                        save: <Icon component={CheckIcon} width={16} height={16} />,
                        cancel: <Icon component={CloseIcon} width={16} height={16} />,
                      }}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};
