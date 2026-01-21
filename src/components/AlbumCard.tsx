import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { Album } from '@/data/albums';

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
  index: number;
}

const AlbumCard = ({ album, onClick, index }: AlbumCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="album-card group"
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <img
          src={album.coverImage}
          alt={album.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center"
          >
            <Play size={28} className="text-primary-foreground ml-1" />
          </motion.div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl md:text-2xl">{album.title}</h3>
        <p className="text-muted-foreground text-sm">{album.year} · {album.tracks.length} треков</p>
      </div>
    </motion.div>
  );
};

export default AlbumCard;
