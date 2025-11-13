import {
  apiClient,
  convertJamendoTrack,
  mockTracks,
  USE_MOCK_DATA,
  type JamendoResponse,
} from '@shared/api/jamendo';
import type { ITrack } from '@shared/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const trackApi = {
  async searchTracks(query: string, limit = 20): Promise<ITrack[]> {
    if (USE_MOCK_DATA) {
      await delay(500);

      const filtered = mockTracks.filter(
        (track) =>
          track.name.toLowerCase().includes(query.toLowerCase()) ||
          track.artist.toLowerCase().includes(query.toLowerCase()) ||
          track.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
      );

      return filtered.slice(0, limit);
    }

    try {
      const response = await apiClient.get<JamendoResponse>('/tracks', {
        params: {
          search: query,
          limit,
          audioformat: 'mp32',
          include: 'musicinfo',
          imagesize: '300',
        },
      });

      return response.data.results.map(convertJamendoTrack);
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  },

  async getPopularTracks(limit = 20): Promise<ITrack[]> {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockTracks.slice(0, limit);
    }

    try {
      const response = await apiClient.get<JamendoResponse>('/tracks', {
        params: {
          order: 'popularity_total',
          limit,
          audioformat: 'mp32',
          include: 'musicinfo',
          imagesize: '300',
        },
      });

      return response.data.results.map(convertJamendoTrack);
    } catch (error) {
      console.error('Error getting popular tracks:', error);
      return [];
    }
  },
};
