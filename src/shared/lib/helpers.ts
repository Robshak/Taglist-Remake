import type { TTagOperation, ITrack } from '@shared/types';

export { useDebounce, debounce } from './hooks/useDebounce';
export { useReducedMotion } from './hooks/useReducedMotion';
export { useDevicePerformance } from './hooks/useDevicePerformance';
export {
  useOptimizedImage,
  generateImageSrcSet,
  getOptimalImageSize,
} from './hooks/useOptimizedImage';

export const filterTracksByTags = (
  tracks: ITrack[],
  tags: string[],
  operation: TTagOperation
): ITrack[] => {
  if (tags.length === 0) return tracks;

  switch (operation) {
    case 'union':
      return tracks.filter((track) => {
        const customTags = track.customTags || [];
        return tags.some((tag) => customTags.includes(tag));
      });
    case 'intersection':
      return tracks.filter((track) => {
        const customTags = track.customTags || [];
        return tags.every((tag) => customTags.includes(tag));
      });
    case 'union_of_intersections':
      return tracks.filter((track) => {
        const customTags = new Set(track.customTags || []);
        return tags.some((tag) => customTags.has(tag));
      });
    default:
      return tracks;
  }
};

export const getAllTags = (tracks: ITrack[], includeCustom: boolean = true): string[] => {
  const tagSet = new Set<string>();
  tracks.forEach((track) => {
    if (includeCustom && track.customTags) {
      track.customTags.forEach((tag: string) => tagSet.add(tag));
    }
  });
  return Array.from(tagSet).sort();
};

export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) {
    return '0:00';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const filterTracksByTagBlocks = (tracks: ITrack[], blocks: string[][]): ITrack[] => {
  const nonEmptyBlocks = blocks.filter((b) => b.length > 0);
  if (nonEmptyBlocks.length === 0) return tracks;

  return tracks.filter((track) => {
    const customTags = new Set(track.customTags || []);
    return nonEmptyBlocks.some((block) => block.every((tag) => customTags.has(tag)));
  });
};
