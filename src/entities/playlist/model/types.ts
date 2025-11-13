import type { TTagOperation } from '@shared/types';

export interface ITagFilter {
  id: string;
  name: string;
  tags: string[];
  operation: TTagOperation;
  createdAt: number;
}

export interface IPlaylistSettings extends ITagFilter {
  isFavorite: boolean;
  trackIds?: string[];
  tagBlocks?: string[][];
}
