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
import album2Cover from '@/assets/albums/album-2-cover.jpg';
import album3Cover from '@/assets/albums/album-3-cover.jpg';

// Import audio files
import bredAudio from '/audio/bred.wav';
import bootSequenceAudio from '/audio/Boot-Sequence.mp3';
import pss126Audio from '/audio/pss-126.wav';

export const albums: Album[] = [
  {
    id: 'go-go-piggy-pop-1',
    title: 'Go! Go! Piggy Pop! #1',
    year: 2024,
    coverImage: album1Cover,
    description: 'Дебютный альбом Piggy Pop с энергичными треками и безумными битами.',
    tracks: [
      { id: '1-1', title: 'GO! GO! PIGGY POP!', duration: '1:32', audioUrl: bredAudio },
      { id: '1-2', title: 'NEWREBORN', duration: '3:45', audioUrl: bootSequenceAudio },
      { id: '1-3', title: 'STAY SHARP', duration: '4:12', audioUrl: pss126Audio },
    ],
  },
  {
    id: 'electronic-storm',
    title: 'Electronic Storm',
    year: 2025,
    coverImage: album2Cover,
    description: 'Второй альбом с агрессивными электронными битами и неоновым звучанием.',
    tracks: [
      { id: '2-1', title: 'Storm Warning', duration: '2:08', audioUrl: bootSequenceAudio },
      { id: '2-2', title: 'Neon Rage', duration: '3:52', audioUrl: bredAudio },
      { id: '2-3', title: 'Electric Heart', duration: '4:01', audioUrl: pss126Audio },
      { id: '2-4', title: 'Voltage Drop', duration: '3:33', audioUrl: bootSequenceAudio },
      { id: '2-5', title: 'Thunder Kiss', duration: '3:45', audioUrl: bredAudio },
      { id: '2-6', title: 'Static Dream', duration: '4:20', audioUrl: pss126Audio },
    ],
  },
  {
    id: 'cyberpig',
    title: 'CYBERPIG',
    year: 2026,
    coverImage: album3Cover,
    description: 'Футуристический альбом на стыке синтвейва и кибер-панка.',
    tracks: [
      { id: '3-1', title: 'Boot Sequence', duration: '1:45', audioUrl: bootSequenceAudio },
      { id: '3-2', title: 'Digital Oink', duration: '3:28', audioUrl: bredAudio },
      { id: '3-3', title: 'Neon Tokyo', duration: '4:15', audioUrl: pss126Audio },
      { id: '3-4', title: 'Glitch in the System', duration: '3:56', audioUrl: bootSequenceAudio },
      { id: '3-5', title: 'Cyber Love', duration: '4:02', audioUrl: bredAudio },
      { id: '3-6', title: 'Shutdown', duration: '2:30', audioUrl: pss126Audio },
    ],
  },
];

export default albums;
