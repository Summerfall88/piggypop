import { motion } from 'framer-motion';
import { ArrowRight, Music, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sparkle from '@/components/Sparkle';
import ArtistCarousel from '@/components/ArtistCarousel';
import paperTexture from '@/assets/paper-texture.jpg';
import useSecretClick from '@/hooks/useSecretClick';

// Custom VK icon component
const VkIcon = ({
  size = 24
}: {
  size?: number;
}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.657 4 8.174c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.745-.576.745z" />
  </svg>;

// Custom TikTok icon component
const TikTokIcon = ({
  size = 24
}: {
  size?: number;
}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>;

// Custom Instagram icon component
const InstagramIcon = ({
  size = 24
}: {
  size?: number;
}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>;

// Custom YouTube icon component
const YoutubeIcon = ({
  size = 24
}: {
  size?: number;
}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>;

// Custom Telegram icon component
const TelegramIcon = ({
  size = 24
}: {
  size?: number;
}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>;
const socialLinks = [{
  icon: InstagramIcon,
  href: 'https://instagram.com/piggypop',
  label: 'Instagram'
}, {
  icon: YoutubeIcon,
  href: 'https://youtube.com/@piggypop',
  label: 'YouTube'
}, {
  icon: TelegramIcon,
  href: 'https://t.me/piggypop',
  label: 'Telegram'
}, {
  icon: TikTokIcon,
  href: 'https://tiktok.com/@piggypop',
  label: 'TikTok'
}, {
  icon: VkIcon,
  href: 'https://vk.com/piggypop',
  label: 'VK'
}];
const Index = () => {
  const {
    handleSecretClick
  } = useSecretClick();
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
            <motion.span className="block text-foreground transition-all duration-300 group-hover:tracking-[0.15em]" whileHover={{
              x: [0, -3, 3, -3, 0],
              transition: {
                duration: 0.3
              }
            }}>
              {'PIGGY'.split('').map((letter, i) => {
                const initialStates = [{
                  y: -3,
                  rotate: -4
                }, {
                  y: 2,
                  rotate: 3
                }, {
                  y: -1,
                  rotate: -2
                }, {
                  y: 4,
                  rotate: 5
                }, {
                  y: -2,
                  rotate: -3
                }];
                return <motion.span key={i} className="inline-block transition-all duration-300 group-hover:[text-shadow:0_0_40px_hsl(var(--primary)),0_0_80px_hsl(var(--primary)/0.5)]" initial={initialStates[i]} animate={initialStates[i]} whileHover={{
                  y: [initialStates[i].y, initialStates[i].y - 5, initialStates[i].y + 3, initialStates[i].y - 2, initialStates[i].y],
                  rotate: [initialStates[i].rotate, initialStates[i].rotate - 5, initialStates[i].rotate + 5, initialStates[i].rotate - 3, initialStates[i].rotate],
                  transition: {
                    duration: 0.4
                  }
                }}>
                  {letter}
                </motion.span>;
              })}
            </motion.span>
            <motion.span className="block text-primary text-shadow-glow transition-all duration-300 group-hover:tracking-[0.2em] group-hover:[text-shadow:0_0_60px_hsl(var(--primary)),0_0_120px_hsl(var(--primary)/0.6)]">
              {'POP'.split('').map((letter, i) => {
                const initialStates = [{
                  y: 3,
                  rotate: 6
                }, {
                  y: -2,
                  rotate: -4
                }, {
                  y: 4,
                  rotate: 3
                }];
                return <motion.span key={i} className="inline-block" initial={initialStates[i]} animate={initialStates[i]} whileHover={{
                  y: [initialStates[i].y, initialStates[i].y + 5, initialStates[i].y - 3, initialStates[i].y + 2, initialStates[i].y],
                  rotate: [initialStates[i].rotate, initialStates[i].rotate + 8, initialStates[i].rotate - 8, initialStates[i].rotate + 4, initialStates[i].rotate],
                  scale: [1, 1.1, 0.95, 1.05, 1],
                  transition: {
                    duration: 0.5
                  }
                }}>
                  {letter}
                </motion.span>;
              })}
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
            <button onClick={handleSecretClick} className="relative px-6 py-3 cursor-pointer select-none focus:outline-none">
              <span className="text-2xl md:text-3xl lg:text-4xl text-primary relative inline-block font-sue-ellen" style={{
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
          }} className="flex items-center justify-center gap-3 mt-8">
            {socialLinks.map((social, index) => {
              const borderRadii = ['50% 45% 50% 45%', '45% 50% 45% 50%', '48% 52% 48% 52%', '52% 48% 52% 48%', '46% 54% 46% 54%'];
              return <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-transparent hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110" style={{
                border: '2px solid hsl(var(--foreground) / 0.5)',
                borderRadius: borderRadii[index % 5]
              }} aria-label={social.label}>
                <social.icon size={18} />
              </a>;
            })}
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div initial={{
          opacity: 1,
          y: 0
        }} animate={{
          opacity: 1,
          y: 0
        }} className="flex-col gap-3 mt-12 sm:flex-col flex items-center justify-start opacity-100">
          <Link to="/music" className="btn-primary flex items-center gap-2">
            <Music size={18} />
            Музыка
          </Link>
          <Link to="/merch" className="btn-outline flex items-center gap-2">
            <ShoppingBag size={18} />
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

      </motion.div>
    </section>

    {/* Artist Photo Carousel */}
    <ArtistCarousel />

    {/* About Section */}


    {/* Footer */}
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6 text-center text-muted-foreground">
        <p className="font-display text-xl">
          PIGGY<span className="text-primary">POP</span>
        </p>
        <p className="text-sm mt-2">© 2026 All rights reserved. Go! Go! Piggy Pop!</p>
      </div>
    </footer>
  </div>;
};
export default Index;