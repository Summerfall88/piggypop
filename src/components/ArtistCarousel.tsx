import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import photo1 from '@/assets/artist/photo-1.jpg';
import photo2 from '@/assets/artist/photo-2.jpg';
import photo3 from '@/assets/artist/photo-3.jpg';
import photo4 from '@/assets/artist/photo-4.jpg';
import photo5 from '@/assets/artist/photo-5.jpg';
import photo6 from '@/assets/artist/photo-6.jpg';
import photo7 from '@/assets/artist/photo-7.jpg';
import photo8 from '@/assets/artist/photo-8.jpg';
import photo9 from '@/assets/artist/photo-9.jpg';
import photo10 from '@/assets/artist/photo-10.jpg';

const artistPhotos = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10];

// Helper to get random duration
const getRandomDuration = () => Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds

// Individual photo cell with random timing
const PhotoCell = ({ initialIndex }: { initialIndex: number }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const changePhoto = () => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => {
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * artistPhotos.length);
          } while (newIndex === prev);
          return newIndex;
        });
        setIsAnimating(false);
      }, 300);
    };

    // Initial random delay + random interval
    const initialDelay = Math.random() * 2000;
    const timeoutId = setTimeout(() => {
      changePhoto();
      
      const intervalId = setInterval(changePhoto, getRandomDuration());
      return () => clearInterval(intervalId);
    }, initialDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex-shrink-0 h-full w-1/3 md:w-1/4 lg:w-1/5 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={artistPhotos[currentIndex]}
          alt="Piggy Pop"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: isAnimating ? 0 : 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
};

const ArtistCarousel = () => {
  // Create cells with different initial photos
  const cells = Array.from({ length: 10 }, (_, i) => i % artistPhotos.length);

  return (
    <section className="h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <div className="flex h-full">
        {cells.map((initialIndex, i) => (
          <PhotoCell key={i} initialIndex={initialIndex} />
        ))}
      </div>
    </section>
  );
};

export default ArtistCarousel;
