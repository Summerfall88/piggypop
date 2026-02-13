// Secret albums - only accessible via the hidden page

import type { Album } from './index';
import secretAlbum1Cover from '@/assets/albums/secret-album-1-cover.jpg';
import secretAlbum2Cover from '@/assets/albums/secret-album-2-cover.jpg';

// Import audio files
import bredAudio from '/audio/bred.wav';
import bootSequenceAudio from '/audio/Boot-Sequence.mp3';
import pss126Audio from '/audio/pss-126.wav';

export const secretAlbums: Album[] = [
  {
    id: 'the-dark-portal',
    title: 'The Dark Portal',
    year: 2023,
    coverImage: secretAlbum1Cover,
    description: 'Секретный альбом, записанный в подземелье. Только для избранных.',
    tracks: [
      { id: 's1-1', title: 'Portal Opens', duration: '2:13', audioUrl: bootSequenceAudio },
      { id: 's1-2', title: 'Dungeon Crawl', duration: '3:47', audioUrl: bredAudio },
      { id: 's1-3', title: 'Pixel Memories', duration: '4:05', audioUrl: pss126Audio },
      { id: 's1-4', title: '8-Bit Nightmare', duration: '3:22', audioUrl: bootSequenceAudio },
      { id: 's1-5', title: 'Boss Fight', duration: '5:01', audioUrl: bredAudio },
      { id: 's1-6', title: 'Game Over', duration: '1:58', audioUrl: pss126Audio },
    ],
  },
  {
    id: 'arcade-ghosts',
    title: 'Arcade Ghosts',
    year: 2022,
    coverImage: secretAlbum2Cover,
    description: 'Потерянный альбом из заброшенного аркадного автомата.',
    tracks: [
      { id: 's2-1', title: 'Insert Coin', duration: '0:45', audioUrl: bootSequenceAudio },
      { id: 's2-2', title: 'High Score', duration: '3:33', audioUrl: bredAudio },
      { id: 's2-3', title: 'Ghost Mode', duration: '4:12', audioUrl: pss126Audio },
      { id: 's2-4', title: 'Retro Fever', duration: '3:28', audioUrl: bootSequenceAudio },
      { id: 's2-5', title: 'Chiptune Dreams', duration: '4:45', audioUrl: bredAudio },
      { id: 's2-6', title: 'Credits Roll', duration: '2:20', audioUrl: pss126Audio },
    ],
  },
];

export default secretAlbums;
