import type { ITrack } from '@shared/types';
import axios from 'axios';

const BASE_URL = 'https://api.jamendo.com/v3.0';

const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID;

if (!CLIENT_ID) {
  console.warn('[Jamendo] VITE_JAMENDO_CLIENT_ID is empty. API calls will probably fail.');
}

export const USE_MOCK_DATA = false;

export interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  audio: string;
  audiodownload: string;
  duration: number;
  image?: string;
  musicinfo?: {
    tags?: {
      genres?: string[];
      instruments?: string[];
      vartags?: string[];
    };
  };
}

export interface JamendoResponse {
  headers: {
    status: string;
    code: number;
    results_count: number;
  };
  results: JamendoTrack[];
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    client_id: CLIENT_ID,
    format: 'json',
  },
});

export const convertJamendoTrack = (jamendoTrack: JamendoTrack): ITrack => {
  const tags: string[] = [];

  if (jamendoTrack.musicinfo?.tags) {
    const { genres, instruments, vartags } = jamendoTrack.musicinfo.tags;
    if (genres) tags.push(...genres);
    if (instruments) tags.push(...instruments);
    if (vartags) tags.push(...vartags);
  }

  return {
    id: jamendoTrack.id,
    name: jamendoTrack.name,
    artist: jamendoTrack.artist_name,
    imageUrl: jamendoTrack.image || jamendoTrack.album_image,
    audioUrl: jamendoTrack.audio || jamendoTrack.audiodownload,
    duration: jamendoTrack.duration,
    tags: tags.length > 0 ? tags : [],
    customTags: [],
  };
};

export const mockTracks: ITrack[] = [
  {
    id: '1',
    name: 'Summer Vibes',
    artist: 'Electronic Dreams',
    imageUrl: 'https://picsum.photos/seed/track1/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 240,
    tags: [],
    customTags: ['chill', 'electronic'],
  },
  {
    id: '2',
    name: 'Night Drive',
    artist: 'Synthwave Collective',
    imageUrl: 'https://picsum.photos/seed/track2/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 195,
    tags: [],
    customTags: ['synthwave', 'energy'],
  },
  {
    id: '3',
    name: 'Cosmic Journey',
    artist: 'Space Explorers',
    imageUrl: 'https://picsum.photos/seed/track3/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 280,
    tags: [],
    customTags: ['ambient', 'space'],
  },
  {
    id: '4',
    name: 'Urban Beats',
    artist: 'City Sounds',
    imageUrl: 'https://picsum.photos/seed/track4/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 210,
    tags: [],
    customTags: ['hip-hop', 'urban', 'energy'],
  },
  {
    id: '5',
    name: 'Ocean Waves',
    artist: 'Ambient Masters',
    imageUrl: 'https://picsum.photos/seed/track5/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 320,
    tags: [],
    customTags: ['ambient', 'chill', 'relax'],
  },
  {
    id: '6',
    name: 'Mountain Echo',
    artist: 'Nature Sounds',
    imageUrl: 'https://picsum.photos/seed/track6/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 265,
    tags: [],
    customTags: ['nature', 'ambient'],
  },
  {
    id: '7',
    name: 'Digital Dreams',
    artist: 'Tech House',
    imageUrl: 'https://picsum.photos/seed/track7/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: 225,
    tags: [],
    customTags: ['electronic', 'house'],
  },
  {
    id: '8',
    name: 'Retro Funk',
    artist: 'Groove Machine',
    imageUrl: 'https://picsum.photos/seed/track8/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: 190,
    tags: [],
    customTags: ['funk', 'retro', 'groovy'],
  },
  {
    id: '9',
    name: 'Jazz Café',
    artist: 'Smooth Jazz Band',
    imageUrl: 'https://picsum.photos/seed/track9/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    duration: 245,
    tags: [],
    customTags: ['jazz', 'smooth', 'chill'],
  },
  {
    id: '10',
    name: 'Electronic Pulse',
    artist: 'EDM Collective',
    imageUrl: 'https://picsum.photos/seed/track10/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    duration: 215,
    tags: [],
    customTags: ['edm', 'electronic', 'energy'],
  },
];

export const jamendoApi = {
  searchTracks: async (query: string, limit = 20): Promise<JamendoResponse> => {
    const response = await apiClient.get<JamendoResponse>('/tracks', {
      params: {
        limit,
        search: query,
        audioformat: 'mp32',
      },
    });
    return response.data;
  },

  getPopularTracks: async (limit = 20): Promise<JamendoResponse> => {
    const response = await apiClient.get<JamendoResponse>('/tracks', {
      params: {
        limit,
        order: 'popularity_total',
        audioformat: 'mp32',
      },
    });
    return response.data;
  },

  getTracksByTags: async (tags: string[], limit = 50): Promise<JamendoResponse> => {
    const response = await apiClient.get<JamendoResponse>('/tracks', {
      params: {
        limit,
        tags: tags.join(','),
        audioformat: 'mp32',
      },
    });
    return response.data;
  },
};
