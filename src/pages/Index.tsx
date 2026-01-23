import { motion } from 'framer-motion';
import { ArrowRight, Music, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, MessageCircle } from 'lucide-react';
import Sparkle from '@/components/Sparkle';
import ArtistCarousel from '@/components/ArtistCarousel';
import GradientDivider from '@/components/GradientDivider';
import paperTexture from '@/assets/paper-texture.jpg';
import useSecretClick from '@/hooks/useSecretClick';
const socialLinks = [{
  icon: Instagram,
  href: 'https://instagram.com/piggypop',
  label: 'Instagram'
}, {
  icon: Youtube,
  href: 'https://youtube.com/@piggypop',
  label: 'YouTube'
}, {
  icon: MessageCircle,
  href: 'https://t.me/piggypop',
  label: 'Telegram'
}];
const Index = () => {
  const { handleSecretClick } = useSecretClick();
  
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
      backgroundImage: `url(${paperTexture})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-background/40" />

        {/* Sparkles */}
        <Sparkle className="top-[15%] left-[10%]" size={20} delay={0} />
        <Sparkle className="top-[25%] right-[15%]" size={32} delay={0.3} />
        <Sparkle className="bottom-[30%] left-[20%]" size={24} delay={0.5} />
        <Sparkle className="top-[60%] right-[10%]" size={18} delay={0.7} />
        <Sparkle className="bottom-[20%] right-[25%]" size={28} delay={0.9} />
        <Sparkle className="top-[40%] left-[5%]" size={16} delay={1.1} />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div initial={{
          opacity: 1,
          scale: 1
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.8
        }}>
            {/* Main Title */}
            <h1 className="font-display text-7xl md:text-9xl lg:text-[12rem] leading-none tracking-tight text-center pt-16 md:pt-20 group cursor-pointer">
              <motion.span 
                className="block text-foreground transition-all duration-300 group-hover:tracking-[0.15em]"
                whileHover={{ 
                  x: [0, -3, 3, -3, 0],
                  transition: { duration: 0.3 }
                }}
              >
                {'PIGGY'.split('').map((letter, i) => (
                  <motion.span 
                    key={i} 
                    className="inline-block transition-all duration-300 group-hover:[text-shadow:0_0_40px_hsl(var(--primary)),0_0_80px_hsl(var(--primary)/0.5)]"
                    style={{ 
                      animationDelay: `${i * 0.05}s`,
                    }}
                    whileHover={{
                      y: [0, -5, 3, -2, 0],
                      rotate: [0, -5, 5, -3, 0],
                      transition: { duration: 0.4 }
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.span>
              <motion.span 
                className="block text-primary text-shadow-glow transition-all duration-300 group-hover:tracking-[0.2em] group-hover:[text-shadow:0_0_60px_hsl(var(--primary)),0_0_120px_hsl(var(--primary)/0.6)]"
              >
                {'POP'.split('').map((letter, i) => (
                  <motion.span 
                    key={i} 
                    className="inline-block"
                    whileHover={{
                      y: [0, 5, -3, 2, 0],
                      rotate: [0, 8, -8, 4, 0],
                      scale: [1, 1.1, 0.95, 1.05, 1],
                      transition: { duration: 0.5 }
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.span>
            </h1>

            {/* Slogan Badge */}
            <motion.div initial={{
            scale: 1,
            rotate: -2
          }} animate={{
            scale: 1,
            rotate: -2
          }} whileHover={{
            scale: 1.05
          }} className="inline-block mt-8">
              <button 
                onClick={handleSecretClick}
                className="relative px-6 py-3 cursor-pointer select-none focus:outline-none"
              >
                <span className="text-2xl md:text-3xl lg:text-4xl text-primary relative inline-block" style={{
                fontFamily: "'Caveat', cursive",
                textDecoration: 'line-through',
                textDecorationThickness: '3px',
                textDecorationColor: 'hsl(var(--foreground))',
                letterSpacing: '0.05em'
              }}>
                  GO! GO! PIGGY POP!
                </span>
              </button>
            </motion.div>

            {/* Social Links */}
            <motion.div initial={{
            opacity: 1,
            y: 0
          }} animate={{
            opacity: 1,
            y: 0
          }} className="flex items-center justify-center gap-4 mt-8">
              {socialLinks.map(social => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary/80 hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 hover:scale-110" aria-label={social.label}>
                  <social.icon size={24} />
                </a>)}
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{
          opacity: 1,
          y: 0
        }} animate={{
          opacity: 1,
          y: 0
        }} className="flex-col gap-4 mt-12 sm:flex-col flex items-center justify-start">
            <Link to="/music" className="btn-primary flex items-center gap-2">  ​<Music size={20} />
              ​Слушать музыку
              <ArrowRight size={20} className="opacity-0" />
            </Link>
            <Link to="/merch" className="btn-outline flex items-center gap-2">
              <ShoppingBag size={20} />
              Мерч
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 2,
        duration: 1
      }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{
          y: [0, 10, 0]
        }} transition={{
          duration: 1.5,
          repeat: Infinity
        }} className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2 opacity-5">
            <motion.div className="w-1.5 h-1.5 bg-primary rounded-full opacity-0" />
          </motion.div>
        </motion.div>
      </section>

      {/* Gradient transition: Hero -> Carousel */}
      <div className="h-32 bg-gradient-to-b from-background via-secondary/20 to-secondary/30" />

      {/* Artist Photo Carousel */}
      <ArtistCarousel />

      {/* Gradient transition: Carousel -> About */}
      <div className="h-32 bg-gradient-to-b from-secondary/30 via-card/50 to-card" />

      {/* About Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-6xl mb-6">
              ЧТО ЭТО <span className="text-primary">ТАКОЕ?</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Piggy Pop — это не просто музыка. Это энергия, драйв и безумие в каждом бите. 
              Панк-поп с примесью электроники, который заставляет двигаться и не останавливаться. 
              Go! Go! Piggy Pop!
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.2,
          duration: 0.6
        }} className="grid md:grid-cols-2 gap-6 mt-16 max-w-4xl mx-auto">
            <Link to="/music" className="group p-8 bg-secondary rounded-2xl hover:bg-secondary/80 transition-all duration-300">
              <Music size={40} className="text-primary mb-4" />
              <h3 className="font-display text-2xl mb-2">Музыка</h3>
              <p className="text-muted-foreground">
                Слушай альбомы и треки прямо на сайте
              </p>
              <div className="mt-4 flex items-center gap-2 text-primary font-medium">
                Перейти <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            <Link to="/merch" className="group p-8 bg-secondary rounded-2xl hover:bg-secondary/80 transition-all duration-300">
              <ShoppingBag size={40} className="text-primary mb-4" />
              <h3 className="font-display text-2xl mb-2">Мерч</h3>
              <p className="text-muted-foreground">
                Футболки, худи и аксессуары с уникальным дизайном
              </p>
              <div className="mt-4 flex items-center gap-2 text-primary font-medium">
                Перейти <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Gradient transition: About -> Footer */}
      <div className="h-16 bg-gradient-to-b from-card via-background/80 to-background" />

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p className="font-display text-xl">
            PIGGY<span className="text-primary">POP</span>
          </p>
          <p className="text-sm mt-2">© 2024 All rights reserved. Go! Go! Piggy Pop!</p>
        </div>
      </footer>
    </div>;
};
export default Index;