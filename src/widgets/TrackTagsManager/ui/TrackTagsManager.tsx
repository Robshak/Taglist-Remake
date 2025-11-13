import { usePlaylistStore } from '@entities/playlist';
import { EditableTag } from '@entities/tag';
import { useTrackStore } from '@entities/track';
import { useFilterStore } from '@features/filter';
import CheckIcon from '@shared/svg/Check.svg?react';
import EditIcon from '@shared/svg/Pencil.svg?react';
import DeleteIcon from '@shared/svg/Trash.svg?react';
import CloseIcon from '@shared/svg/X.svg?react';
import type { ITrack } from '@shared/types';
import { Icon } from '@shared/ui';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import s from './TrackTagsManager.module.scss';
import { useI18n } from '../lib';

interface ITrackTagsManagerProps {
  track?: ITrack;
  onClose: () => void;
}

export const TrackTagsManager = ({ track, onClose }: ITrackTagsManagerProps) => {
  const { t } = useI18n();
  const {
    allCustomTags,
    addTrackCustomTag,
    removeTrackCustomTag,
    createCustomTag,
    deleteCustomTag,
    renameCustomTag,
  } = useTrackStore();
  const { renameTagInFilter } = useFilterStore();
  const { renameTagInPlaylists } = usePlaylistStore();
  const [newTagName, setNewTagName] = useState('');
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');

  const trackCustomTags = track?.customTags || [];

  const handleAddTag = (tag: string) => {
    if (!track) return;
    addTrackCustomTag(track.id, tag);
  };

  const handleRemoveTag = (tag: string) => {
    if (!track) return;
    removeTrackCustomTag(track.id, tag);
  };

  const handleCreateTag = () => {
    const trimmedTag = newTagName.trim();
    if (!trimmedTag) return;
    if (allCustomTags.includes(trimmedTag)) {
      setTagError(t('errors.tagExists'));
      return;
    }
    createCustomTag(trimmedTag);
    if (track) addTrackCustomTag(track.id, trimmedTag);
    setNewTagName('');
    setShowCreateTag(false);
    setTagError(null);
  };

  const handleDeleteTag = (tag: string) => {
    if (confirm(t('buttons.delete', { tag }))) {
      deleteCustomTag(tag);
    }
  };

  const handleStartEdit = (tag: string) => {
    setEditingTagId(tag);
    setEditingTagName(tag);
  };

  const handleSaveEdit = (oldTag: string) => {
    const trimmedNewName = editingTagName.trim();
    if (trimmedNewName && trimmedNewName !== oldTag) {
      if (allCustomTags.includes(trimmedNewName)) {
        setEditingTagId(null);
        setEditingTagName('');
        return;
      }
      renameCustomTag(oldTag, trimmedNewName);
      renameTagInFilter(oldTag, trimmedNewName);
      renameTagInPlaylists(oldTag, trimmedNewName);
    }
    setEditingTagId(null);
    setEditingTagName('');
  };

  const handleCancelEdit = () => {
    setEditingTagId(null);
    setEditingTagName('');
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
              <div className={s.tags}>
                {trackCustomTags.length === 0 ? (
                  <p className={s.empty}>{t('sections.trackTags.empty')}</p>
                ) : (
                  trackCustomTags.map((tag: string) => (
                    <div key={tag} className={`${s.tag} ${s.tagActive}`}>
                      <span>{tag}</span>
                      <button onClick={() => handleRemoveTag(tag)}>
                        <Icon component={CloseIcon} width={16} height={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className={s.section}>
            <div className={s.sectionHeader}>
              <h4>{t('sections.allTags.title')}</h4>
              <button
                className={`${s.createBtn} ${showCreateTag ? s.isOpen : ''}`}
                onClick={() => setShowCreateTag(!showCreateTag)}
              >
                {showCreateTag ? t('buttons.cancel') : t('buttons.create')}
              </button>
            </div>

            <AnimatePresence>
              {showCreateTag && (
                <motion.div
                  className={s.createForm}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className={s.createFields}>
                    <input
                      type="text"
                      placeholder={t('form.placeholder')}
                      value={newTagName}
                      onChange={(e) => {
                        setNewTagName(e.target.value);
                        if (tagError) setTagError(null);
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                      autoFocus
                      className={tagError ? s.hasError : ''}
                    />
                    <button onClick={handleCreateTag} disabled={!newTagName.trim()}>
                      {t('form.createButton')}
                    </button>
                  </div>
                  <AnimatePresence>
                    {tagError && (
                      <motion.div
                        className={s.error}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                      >
                        {tagError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
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
                      label={tag}
                      isActive={isActive}
                      isEditing={isEditing}
                      editingValue={editingTagName}
                      onChangeEditingValue={setEditingTagName}
                      onToggleActive={() => (isActive ? handleRemoveTag(tag) : handleAddTag(tag))}
                      onEditStart={() => handleStartEdit(tag)}
                      onEditSave={() => handleSaveEdit(tag)}
                      onEditCancel={handleCancelEdit}
                      onDelete={() => handleDeleteTag(tag)}
                      className={s.tag}
                      activeClassName={s.tagActive}
                      editingClassName={s.tagEditing}
                      inputClassName={s.tagInput}
                      editBtnClassName={s.editBtn}
                      deleteBtnClassName={s.deleteTag}
                      saveBtnClassName={s.saveBtn}
                      cancelBtnClassName={s.cancelBtn}
                      editIcon={<Icon component={EditIcon} width={16} height={16} />}
                      deleteIcon={<Icon component={DeleteIcon} width={16} height={16} />}
                      saveIcon={<Icon component={CheckIcon} width={16} height={16} />}
                      cancelIcon={<Icon component={CloseIcon} width={16} height={16} />}
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
