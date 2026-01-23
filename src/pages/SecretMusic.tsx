import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Skull, Ghost } from 'lucide-react';
import AlbumCard from '@/components/AlbumCard';
import MusicPlayer from '@/components/MusicPlayer';
import { secretAlbums } from '@/data/albums/secret';
import type { Track, Album } from '@/data/albums';

const SecretMusic = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [glitchText, setGlitchText] = useState(false);

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
    <div className="min-h-screen pb-24 bg-black relative overflow-hidden">
      {/* Scanlines overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        }}
      />
      
      {/* CRT flicker effect */}
      <div className="fixed inset-0 pointer-events-none z-10 animate-pulse opacity-5 bg-primary" />

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

          {/* Selected Album Tracklist */}
          {selectedAlbum && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/80 border-2 border-primary/50 rounded-none p-6 md:p-8"
              style={{
                boxShadow: '0 0 30px hsl(var(--primary) / 0.2), inset 0 0 30px hsl(var(--primary) / 0.05)',
              }}
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="relative">
                  <img
                    src={selectedAlbum.coverImage}
                    alt={selectedAlbum.title}
                    className="w-32 h-32 md:w-48 md:h-48 object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="absolute inset-0 border-2 border-primary/30" />
                </div>
                <div>
                  <h2 
                    className="font-display text-2xl md:text-3xl text-primary"
                    style={{ fontFamily: "monospace" }}
                  >
                    {selectedAlbum.title}
                  </h2>
                  <p className="text-primary/60 mt-1 font-mono">{selectedAlbum.year}</p>
                  <p className="text-primary/70 mt-4 max-w-xl font-mono text-sm">
                    {selectedAlbum.description}
                  </p>
                </div>
              </div>

              {/* Tracks */}
              <div className="space-y-1">
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
          )}

          {/* Empty State */}
          {!selectedAlbum && secretAlbums.length > 0 && (
            <div className="text-center py-12">
              <p 
                className="text-primary/50 font-mono text-sm animate-pulse"
              >
                [ Выбери альбом, чтобы начать... ]
              </p>
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

export default SecretMusic;
