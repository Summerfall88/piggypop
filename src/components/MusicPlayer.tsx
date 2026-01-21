import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Track, Album } from '@/data/albums';

interface MusicPlayerProps {
  album: Album;
  currentTrack: Track | null;
  onTrackChange: (track: Track) => void;
}

const MusicPlayer = ({ album, currentTrack, onTrackChange }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentIndex = album.tracks.findIndex(t => t.id === currentTrack?.id);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // Demo mode - just toggle state
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onTrackChange(album.tracks[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < album.tracks.length - 1) {
      onTrackChange(album.tracks[currentIndex + 1]);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  // Simulate progress for demo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !currentTrack?.audioUrl) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
  }, [currentTrack]);

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Album Art */}
          <img
            src={album.coverImage}
            alt={album.title}
            className="w-14 h-14 rounded-lg object-cover"
          />

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{currentTrack.title}</h4>
            <p className="text-sm text-muted-foreground truncate">{album.title}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === album.tracks.length - 1}
              className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Progress */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs">
            <span className="text-xs text-muted-foreground w-10">
              {Math.floor(progress * 0.03)}:{String(Math.floor((progress * 1.8) % 60)).padStart(2, '0')}
            </span>
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-10">{currentTrack.duration}</span>
          </div>

          {/* Volume */}
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={toggleMute} className="p-2 text-muted-foreground hover:text-foreground">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-primary"
            />
          </div>
        </div>
      </div>

      {currentTrack.audioUrl && (
        <audio ref={audioRef} src={currentTrack.audioUrl} />
      )}
    </motion.div>
  );
};

export default MusicPlayer;
