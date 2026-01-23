import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import photo1 from '@/assets/artist/photo-1.jpg';
import photo2 from '@/assets/artist/photo-2.jpg';
import photo3 from '@/assets/artist/photo-3.jpg';
import photo4 from '@/assets/artist/photo-4.jpg';
import photo5 from '@/assets/artist/photo-5.jpg';

const artistPhotos = [photo1, photo2, photo3, photo4, photo5];

const ArtistCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % artistPhotos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-5xl text-center mb-10"
        >
          PIGGY <span className="text-primary">В ДЕЙСТВИИ</span>
        </motion.h2>
        
        <div className="relative max-w-4xl mx-auto aspect-square md:aspect-video overflow-hidden rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={artistPhotos[currentIndex]}
              alt={`Piggy Pop photo ${currentIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7 }}
            />
          </AnimatePresence>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          
          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {artistPhotos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary w-6' 
                    : 'bg-foreground/40 hover:bg-foreground/60'
                }`}
                aria-label={`Перейти к фото ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistCarousel;
