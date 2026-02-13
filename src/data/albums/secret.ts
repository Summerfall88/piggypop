// Secret albums - only accessible via the hidden page

import type { Album } from './index';
import secretAlbum1Cover from '@/assets/albums/secret-album-1-cover.jpg';
import secretAlbum2Cover from '@/assets/albums/secret-album-2-cover.jpg';

export const secretAlbums: Album[] = [
  {
    id: 'the-dark-portal',
    title: 'The Dark Portal',
    year: 2023,
    coverImage: secretAlbum1Cover,
    description: 'Секретный альбом, записанный в подземелье. Только для избранных.',
    tracks: [
      { id: 's1-1', title: 'Portal Opens', duration: '2:13', audioUrl: '/audio/Boot-Sequence.mp3' },
      { id: 's1-2', title: 'Dungeon Crawl', duration: '3:47', audioUrl: '/audio/bred.wav' },
      { id: 's1-3', title: 'Pixel Memories', duration: '4:05', audioUrl: '/audio/pss-126.wav' },
      { id: 's1-4', title: '8-Bit Nightmare', duration: '3:22', audioUrl: '/audio/Boot-Sequence.mp3' },
      { id: 's1-5', title: 'Boss Fight', duration: '5:01', audioUrl: '/audio/bred.wav' },
      { id: 's1-6', title: 'Game Over', duration: '1:58', audioUrl: '/audio/pss-126.wav' },
    ],
  },
  {
    id: 'arcade-ghosts',
    title: 'Arcade Ghosts',
    year: 2022,
    coverImage: secretAlbum2Cover,
    description: 'Потерянный альбом из заброшенного аркадного автомата.',
    tracks: [
      { id: 's2-1', title: 'Insert Coin', duration: '0:45', audioUrl: '/audio/Boot-Sequence.mp3' },
      { id: 's2-2', title: 'High Score', duration: '3:33', audioUrl: '/audio/bred.wav' },
      { id: 's2-3', title: 'Ghost Mode', duration: '4:12', audioUrl: '/audio/pss-126.wav' },
      { id: 's2-4', title: 'Retro Fever', duration: '3:28', audioUrl: '/audio/Boot-Sequence.mp3' },
      { id: 's2-5', title: 'Chiptune Dreams', duration: '4:45', audioUrl: '/audio/bred.wav' },
      { id: 's2-6', title: 'Credits Roll', duration: '2:20', audioUrl: '/audio/pss-126.wav' },
    ],
  },
];

export default secretAlbums;
