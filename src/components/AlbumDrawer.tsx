import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Clock, Disc, Heart } from 'lucide-react';
import type { Album, Track } from '@/data/albums';
import SvgSequenceAnimation from './SvgSequenceAnimation';

interface AlbumDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  album: Album | null;
  currentTrack: Track | null;
  onTrackClick: (track: Track) => void;
  likes: { [trackId: string]: number };
  onLike: (trackId: string) => void;
}

const AlbumDrawer = ({
  isOpen,
  onClose,
  album,
  currentTrack,
  onTrackClick,
  likes,
  onLike,
}: AlbumDrawerProps) => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowWarning(true);
      const timer = setTimeout(() => {
        setShowWarning(false);
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      setShowWarning(false);
    }
  }, [isOpen]);

  if (!album) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Volume Warning Overlay */}
          <AnimatePresence>
            {showWarning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none"
              >
                <div className="bg-transparent backdrop-blur-md p-4 flex flex-col items-center justify-center">
                  <SvgSequenceAnimation interval={60} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drawer - slides from LEFT */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full max-w-md bg-card border-r border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-2xl flex items-center gap-2">
                <Disc size={24} className="text-primary" />
                Плейлист
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Album Info */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start gap-4">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-display text-xl">{album.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{album.year}</p>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                    {album.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracks - with bottom padding for player */}
            <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-1">
              {album.tracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left group
                    ${currentTrack?.id === track.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-secondary'
                    }`}
                >
                  <button
                    onClick={() => onTrackClick(track)}
                    className="flex items-center gap-4 flex-1"
                  >
                    <span className="w-8 text-center text-muted-foreground group-hover:hidden">
                      {index + 1}
                    </span>
                    <Play
                      size={18}
                      className="hidden group-hover:block w-8 text-center text-primary"
                    />
                    <span className="flex-1 font-medium text-left">{track.title}</span>
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Clock size={14} />
                      {track.duration}
                    </span>
                  </button>

                  {/* Like button and counter */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(track.id);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <Heart
                      size={18}
                      className={`transition-colors ${(likes[track.id] || 0) > 0
                        ? 'text-red-500 fill-red-500'
                        : 'text-muted-foreground hover:text-red-500'
                        }`}
                    />
                    <span className="text-sm text-muted-foreground min-w-[20px]">
                      {likes[track.id] || 0}
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlbumDrawer;
