import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

interface CartButtonProps {
  onClick: () => void;
}

const CartButton = ({ onClick }: CartButtonProps) => {
  const { totalItems } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Открыть корзину"
    >
      <ShoppingBag size={22} />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center"
          >
            {totalItems > 9 ? '9+' : totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default CartButton;
