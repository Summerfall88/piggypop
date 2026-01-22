import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CartButton from './CartButton';

const navItems = [
  { path: '/', label: 'Главная' },
  { path: '/music', label: 'Музыка' },
  { path: '/merch', label: 'Мерч' },
];

interface NavigationProps {
  onCartClick?: () => void;
}

const Navigation = ({ onCartClick }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('/')} 
            className="font-display text-2xl md:text-3xl tracking-wider"
          >
            PIGGY<span className="text-primary">POP</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
            {onCartClick && <CartButton onClick={onCartClick} />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {onCartClick && <CartButton onClick={onCartClick} />}
            <button
              className="text-foreground p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-4 py-6">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    className={`nav-link text-lg text-left ${location.pathname === item.path ? 'nav-link-active' : ''}`}
                    onClick={() => handleNavClick(item.path)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
