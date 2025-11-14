import { jamendoApi, convertJamendoTrack, mockTracks, USE_MOCK_DATA } from '@shared/api/jamendo';
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
      const response = await jamendoApi.searchTracks(query, limit);
      return response.results.map(convertJamendoTrack);
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
      const response = await jamendoApi.getPopularTracks(limit);
      return response.results.map(convertJamendoTrack);
    } catch (error) {
      console.error('Error getting popular tracks:', error);
      return [];
    }
  },
};
