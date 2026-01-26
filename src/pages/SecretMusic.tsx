import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Skull, Ghost, X, Disc } from 'lucide-react';
import AlbumCard from '@/components/AlbumCard';
import MusicPlayer from '@/components/MusicPlayer';
import { secretAlbums } from '@/data/albums/secret';
import type { Track, Album } from '@/data/albums';

const SecretMusic = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [glitchText, setGlitchText] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen pb-24 bg-black relative overflow-hidden">
      {/* Scanlines overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        }}
      />
      
      {/* CRT flicker effect - ADJUST OPACITY HERE (currently 0.01 = 1% brightness) */}
      <div className="fixed inset-0 pointer-events-none z-10 animate-pulse opacity-[0.99] bg-primary" />

      <main className="pt-24 relative z-0">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <Ghost className="text-primary animate-bounce" size={32} />
              <Skull className="text-primary" size={28} />
              <Ghost className="text-primary animate-bounce" style={{ animationDelay: '0.5s' }} size={32} />
            </div>
            
            <h1 
              className={`font-display text-5xl md:text-7xl text-primary transition-all duration-100 ${
                glitchText ? 'translate-x-1 skew-x-3' : ''
              }`}
              style={{
                textShadow: glitchText 
                  ? '3px 0 hsl(var(--primary)), -3px 0 cyan'
                  : '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary) / 0.5)',
                fontFamily: "'Press Start 2P', monospace, var(--font-display)",
                letterSpacing: '0.1em',
              }}
            >
              {glitchText ? 'S3CR3T Z0N3' : 'SECRET ZONE'}
            </h1>
            
            <p 
              className="text-primary/70 mt-4 text-sm md:text-base tracking-widest uppercase"
              style={{ fontFamily: "monospace" }}
            >
              &gt;&gt; Добро пожаловать в изнанку... &lt;&lt;
            </p>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mt-6 max-w-md mx-auto"
            />
          </motion.div>

          {/* Secret Albums Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {secretAlbums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                {/* Pixel border effect */}
                <div 
                  className="absolute -inset-1 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    clipPath: 'polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))',
                  }}
                />
                <AlbumCard
                  album={album}
                  onClick={() => handleAlbumClick(album)}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Secret Album Drawer - LEFT SIDE */}
      <AnimatePresence>
        {isDrawerOpen && selectedAlbum && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-full max-w-md bg-black border-r-2 border-primary/50 z-50 flex flex-col"
              style={{
                boxShadow: '0 0 30px hsl(var(--primary) / 0.3)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-primary/30">
                <h2 
                  className="text-xl flex items-center gap-2 text-primary"
                  style={{ fontFamily: "monospace" }}
                >
                  <Disc size={24} />
                  [ ПЛЕЙЛИСТ ]
                </h2>
                <button
                  onClick={handleCloseDrawer}
                  className="p-2 hover:bg-primary/20 transition-colors border border-primary/50"
                >
                  <X size={24} className="text-primary" />
                </button>
              </div>

              {/* Album Info */}
              <div className="p-6 border-b border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={selectedAlbum.coverImage}
                      alt={selectedAlbum.title}
                      className="w-24 h-24 object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className="absolute inset-0 border-2 border-primary/30" />
                  </div>
                  <div>
                    <h3 
                      className="text-lg text-primary"
                      style={{ fontFamily: "monospace" }}
                    >
                      {selectedAlbum.title}
                    </h3>
                    <p className="text-primary/60 text-sm font-mono mt-1">{selectedAlbum.year}</p>
                    <p className="text-primary/70 text-sm mt-2 line-clamp-2 font-mono">
                      {selectedAlbum.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracks */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {selectedAlbum.tracks.map((track, index) => (
                  <motion.button
                    key={track.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleTrackClick(track)}
                    className={`w-full flex items-center gap-4 p-3 transition-all duration-200 text-left group border-l-2
                      ${currentTrack?.id === track.id 
                        ? 'bg-primary/20 text-primary border-primary' 
                        : 'hover:bg-primary/10 text-primary/70 border-transparent hover:border-primary/50'
                      }`}
                    style={{ fontFamily: "monospace" }}
                  >
                    <span className="w-8 text-center text-xs group-hover:hidden">
                      [{String(index + 1).padStart(2, '0')}]
                    </span>
                    <Play 
                      size={14} 
                      className="hidden group-hover:block w-8 text-center" 
                    />
                    <span className="flex-1 text-sm">{track.title}</span>
                    <span className="flex items-center gap-1 text-xs opacity-60">
                      <Clock size={12} />
                      {track.duration}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

export default SecretMusic;
