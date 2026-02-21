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

// Brand Icons as SVG components
const YandexMusicIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
  </svg>
);

const SpotifyIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const AppleMusicIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.5 16.5c0 1.933-2.015 3.5-4.5 3.5S6.5 18.433 6.5 16.5s2.015-3.5 4.5-3.5 4.5 1.567 4.5 3.5zm0-9.5v8.324c-.657-.522-1.528-.824-2.5-.824-1.933 0-3.5 1.254-3.5 2.8s1.567 2.8 3.5 2.8c1.784 0 3.253-1.066 3.472-2.434l.028-.166V7h4v-2h-5z" />
  </svg>
);

const VKMusicIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.162 18.994c-6.098 0-9.57-4.172-9.715-11.106H6.52c.102 5.088 2.344 7.24 4.12 7.687V7.888h3.078v4.39c1.882-.204 3.73-2.212 4.398-4.39h3.078c-.512 2.651-2.52 4.66-3.954 5.49 1.434.666 3.784 2.41 4.706 5.616h-3.35c-.718-2.245-2.52-3.954-4.226-4.125v4.125h-.1z" />
  </svg>
);

const ZvukIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3h-2v-3H8v-2h3V8h2v3h3v2z" />
  </svg>
);

const streamingServices = [{
  name: 'Яндекс Музыка',
  href: 'https://music.yandex.ru',
  icon: YandexMusicIcon,
  color: 'hover:bg-[#FFCC00] hover:text-black'
}, {
  name: 'Spotify',
  href: 'https://spotify.com',
  icon: SpotifyIcon,
  color: 'hover:bg-[#1DB954]'
}, {
  name: 'Apple Music',
  href: 'https://music.apple.com',
  icon: AppleMusicIcon,
  color: 'hover:bg-[#FA243C]'
}, {
  name: 'VK Музыка',
  href: 'https://vk.com/music',
  icon: VKMusicIcon,
  color: 'hover:bg-[#0077FF]'
}, {
  name: 'СберЗвук',
  href: 'https://zvuk.com',
  icon: ZvukIcon,
  color: 'hover:bg-[#7FFF00] hover:text-black'
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
    closeArkanoid,
    showZachem,
    closeZachem,
    showPsix,
    closePsix,
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
              return <a key={service.name} href={service.href} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 flex items-center justify-center bg-transparent transition-all duration-300 hover:scale-110 hover:text-white ${service.color}`} style={{
                border: '2px solid hsl(var(--foreground) / 0.5)',
                borderRadius: borderRadii[index % 6]
              }} title={service.name}>
                <service.icon size={18} />
              </a>;
            })}
          </div>
        </motion.div>
      </div>
    </main>

    {/* Album Drawer */}
    <AlbumDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} album={selectedAlbum} currentTrack={currentTrack} onTrackClick={handleTrackClick} likes={likesObject} onLike={addLike} showZachem={showZachem} closeZachem={closeZachem} showPsix={showPsix} closePsix={closePsix} />

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