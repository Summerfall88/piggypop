import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import AlbumCard from '@/components/AlbumCard';
import MusicPlayer from '@/components/MusicPlayer';
import { albums, type Track, type Album } from '@/data/albums';

const Music = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album);
    if (album.tracks.length > 0) {
      setCurrentTrack(album.tracks[0]);
      setAutoPlay(false);
    }
  };

  const handleTrackClick = (track: Track) => {
    setCurrentTrack(track);
    setAutoPlay(true);
  };

  return (
    <div className="min-h-screen pb-24">
      <Navigation />
      
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

          {/* Selected Album Tracklist */}
          {selectedAlbum && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-start gap-6 mb-8">
                <img
                  src={selectedAlbum.coverImage}
                  alt={selectedAlbum.title}
                  className="w-32 h-32 md:w-48 md:h-48 rounded-xl object-cover"
                />
                <div>
                  <h2 className="font-display text-3xl md:text-4xl">{selectedAlbum.title}</h2>
                  <p className="text-muted-foreground mt-1">{selectedAlbum.year}</p>
                  <p className="text-muted-foreground mt-4 max-w-xl">{selectedAlbum.description}</p>
                </div>
              </div>

              {/* Tracks */}
              <div className="space-y-2">
                {selectedAlbum.tracks.map((track, index) => (
                  <motion.button
                    key={track.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleTrackClick(track)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left group
                      ${currentTrack?.id === track.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-secondary'
                      }`}
                  >
                    <span className="w-8 text-center text-muted-foreground group-hover:hidden">
                      {index + 1}
                    </span>
                    <Play 
                      size={18} 
                      className="hidden group-hover:block w-8 text-center text-primary" 
                    />
                    <span className="flex-1 font-medium">{track.title}</span>
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Clock size={14} />
                      {track.duration}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!selectedAlbum && albums.length > 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Выберите альбом, чтобы увидеть треки</p>
            </div>
          )}
        </div>
      </main>

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
