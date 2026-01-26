import { useState } from 'react';
import { motion } from 'framer-motion';
import AlbumCard from '@/components/AlbumCard';
import AlbumDrawer from '@/components/AlbumDrawer';
import MusicPlayer from '@/components/MusicPlayer';
import { albums, type Track, type Album } from '@/data/albums';

const Music = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album);
    setIsDrawerOpen(true);
    if (album.tracks.length > 0) {
      setCurrentTrack(album.tracks[0]);
      setAutoPlay(true); // Auto-play first track
    }
  };

  const handleTrackClick = (track: Track) => {
    setCurrentTrack(track);
    setAutoPlay(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen pb-24">
      
      <main className="pt-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-display text-5xl md:text-7xl">
              МУЗЫКА <span className="text-primary">✦</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Все альбомы и треки Piggy Pop
            </p>
          </motion.div>

          {/* Albums Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {albums.map((album, index) => (
              <AlbumCard
                key={album.id}
                album={album}
                onClick={() => handleAlbumClick(album)}
                index={index}
              />
            ))}
          </div>

          {/* Streaming Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center bg-card rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl mb-6">Слушайте на стриминговых сервисах</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://music.yandex.ru" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 font-medium"
              >
                Яндекс Музыка
              </a>
              <a 
                href="https://spotify.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 font-medium"
              >
                Spotify
              </a>
              <a 
                href="https://music.apple.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 font-medium"
              >
                Apple Music
              </a>
              <a 
                href="https://music.youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 font-medium"
              >
                YouTube Music
              </a>
              <a 
                href="https://vk.com/music" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 font-medium"
              >
                VK Музыка
              </a>
              <a 
                href="https://sberzvuk.ru" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 font-medium"
              >
                СберЗвук
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Album Drawer */}
      <AlbumDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        album={selectedAlbum}
        currentTrack={currentTrack}
        onTrackClick={handleTrackClick}
      />

      {/* Player */}
      {selectedAlbum && currentTrack && (
        <MusicPlayer
          album={selectedAlbum}
          currentTrack={currentTrack}
          onTrackChange={(track) => {
            setCurrentTrack(track);
            setAutoPlay(true);
          }}
          autoPlay={autoPlay}
        />
      )}
    </div>
  );
};

export default Music;
