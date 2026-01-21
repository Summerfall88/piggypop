// Album data - add new albums here
// Each album should have a cover image in src/assets/albums/

export interface Track {
  id: string;
  title: string;
  duration: string;
  audioUrl?: string; // URL to audio file (can be left empty for demo)
}

export interface Album {
  id: string;
  title: string;
  year: number;
  coverImage: string;
  description: string;
  tracks: Track[];
}

// Import album covers
import album1Cover from '@/assets/albums/album-1-cover.jpg';

export const albums: Album[] = [
  {
    id: 'go-go-piggy-pop-1',
    title: 'Go! Go! Piggy Pop! #1',
    year: 2024,
    coverImage: album1Cover,
    description: 'Дебютный альбом Piggy Pop с энергичными треками и безумными битами.',
    tracks: [
      { id: '1-1', title: 'Intro (Oink Oink)', duration: '1:32' },
      { id: '1-2', title: 'Go! Go! Go!', duration: '3:45' },
      { id: '1-3', title: 'Piggy Party', duration: '4:12' },
      { id: '1-4', title: 'Night Rider', duration: '3:58' },
      { id: '1-5', title: 'Spark & Shine', duration: '3:21' },
      { id: '1-6', title: 'Outro (Bye Bye)', duration: '2:15' },
    ],
  },
];

export default albums;
