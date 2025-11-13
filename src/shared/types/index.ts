export interface ITrack {
  id: string;
  name: string;
  artist: string;
  duration: number;
  tags: string[];
  customTags?: string[];
  audioUrl?: string;
  imageUrl?: string;
}

export type TTagOperation = 'union' | 'intersection' | 'union_of_intersections';
