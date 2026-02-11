import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music as MusicIcon, Headphones, Radio, Disc, Play, Podcast } from 'lucide-react';
import AlbumCard from '@/components/AlbumCard';
import AlbumDrawer from '@/components/AlbumDrawer';
import MusicPlayer from '@/components/MusicPlayer';
import ArkanoidGame from '@/components/ArkanoidGame';
import { albums, type Track, type Album } from '@/data/albums';
import { useLikes } from '@/hooks/useLikes';
import Footer from '@/components/Footer';

// Streaming service icons - placeholder SVG icons
const streamingServices = [{
  name: 'Яндекс Музыка',
  href: 'https://music.yandex.ru',
  icon: MusicIcon,
  // Placeholder
  color: 'hover:bg-yellow-500'
}, {
  name: 'Spotify',
  href: 'https://spotify.com',
  icon: Disc,
  color: 'hover:bg-green-500'
}, {
  name: 'Apple Music',
  href: 'https://music.apple.com',
  icon: Headphones,
  color: 'hover:bg-pink-500'
}, {
  name: 'YouTube Music',
  href: 'https://music.youtube.com',
  icon: Play,
  color: 'hover:bg-red-500'
}, {
  name: 'VK Музыка',
  href: 'https://vk.com/music',
  icon: Radio,
  color: 'hover:bg-blue-500'
}, {
  name: 'СберЗвук',
  href: 'https://sberzvuk.ru',
  icon: Podcast,
  color: 'hover:bg-emerald-500'
}];
const Music = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    addLike,
    getLikes,
    showArkanoid,
    closeArkanoid
  } = useLikes();

  // Create likes object for drawer
  const likesObject = albums.reduce((acc, album) => {
    album.tracks.forEach(track => {
      acc[track.id] = getLikes(track.id);
    });
    return acc;
  }, {} as {
    [key: string]: number;
  });
  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album);
    setIsDrawerOpen(true);
    if (album.tracks.length > 0) {
      setCurrentTrack(album.tracks[0]);
      setAutoPlay(true);
    }
  };
  const handleTrackClick = (track: Track) => {
    setCurrentTrack(track);
    setAutoPlay(true);
  };
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };
  return <div className="min-h-screen">

    <main className="pt-24 pb-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="mb-12">

          <p className="text-muted-foreground mt-2 text-lg">Listen to your heart when he's calling for Piggy </p>
        </motion.div>

        {/* Albums Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {albums.map((album, index) => <AlbumCard key={album.id} album={album} onClick={() => handleAlbumClick(album)} index={index} />)}
        </div>

        {/* Streaming Services */}
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="mt-16 text-center p-8">
          <h3 className="font-display text-2xl mb-6">Слушайте на стриминговых сервисах</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {streamingServices.map((service, index) => {
              const borderRadii = ['50% 45% 50% 45%', '45% 50% 45% 50%', '48% 52% 48% 52%', '52% 48% 52% 48%', '46% 54% 46% 54%', '54% 46% 54% 46%'];
              return <a key={service.name} href={service.href} target="_blank" rel="noopener noreferrer" className={`w-14 h-14 flex items-center justify-center bg-transparent transition-all duration-300 hover:scale-110 hover:text-white ${service.color}`} style={{
                border: '2px solid hsl(var(--foreground) / 0.5)',
                borderRadius: borderRadii[index % 6]
              }} title={service.name}>
                <service.icon size={26} />
              </a>;
            })}
          </div>
        </motion.div>
      </div>
    </main>

    {/* Album Drawer */}
    <AlbumDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} album={selectedAlbum} currentTrack={currentTrack} onTrackClick={handleTrackClick} likes={likesObject} onLike={addLike} />

    {/* Player */}
    {selectedAlbum && currentTrack && <MusicPlayer album={selectedAlbum} currentTrack={currentTrack} onTrackChange={track => {
      setCurrentTrack(track);
      setAutoPlay(true);
    }} autoPlay={autoPlay} />}

    {/* Secret Arkanoid Game */}
    <ArkanoidGame isOpen={showArkanoid} onClose={closeArkanoid} />

    <Footer />
  </div>;
};
export default Music;