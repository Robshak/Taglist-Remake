import { usePlaylistStore } from '@entities/playlist';
import { useTrackStore } from '@entities/track';
import { useFilterStore } from '@features/filter';
import type { ITrack } from '@shared/types';
import { useState } from 'react';

export const useTagManager = (track?: ITrack) => {
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

  const handleCreateTag = (errorMessage: string) => {
    const trimmedTag = newTagName.trim();
    if (!trimmedTag) return;

    if (allCustomTags.includes(trimmedTag)) {
      setTagError(errorMessage);
      return;
    }

    createCustomTag(trimmedTag);
    if (track) addTrackCustomTag(track.id, trimmedTag);
    setNewTagName('');
    setShowCreateTag(false);
    setTagError(null);
  };

  const handleDeleteTag = (tag: string) => {
    deleteCustomTag(tag);
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

  const toggleCreateForm = () => {
    setShowCreateTag(!showCreateTag);
    if (showCreateTag) {
      setNewTagName('');
      setTagError(null);
    }
  };

  const clearTagError = () => {
    setTagError(null);
  };

  return {
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
  };
};
