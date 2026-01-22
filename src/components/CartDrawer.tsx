import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const handleCheckout = () => {
    toast.success('Заказ оформлен! Мы свяжемся с вами в ближайшее время.');
    clearCart();
    onClose();
  };

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

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-2xl flex items-center gap-2">
                <ShoppingBag size={24} className="text-primary" />
                Корзина
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Корзина пуста</p>
                </div>
              ) : (
                items.map((cartItem) => (
                  <motion.div
                    key={`${cartItem.item.id}-${cartItem.size}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex gap-4 bg-secondary/50 rounded-xl p-4"
                  >
                    <img
                      src={cartItem.item.images[0]}
                      alt={cartItem.item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{cartItem.item.name}</h4>
                      <p className="text-sm text-muted-foreground">Размер: {cartItem.size}</p>
                      <p className="text-primary font-bold mt-1">
                        {formatPrice(cartItem.item.price * cartItem.quantity)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(cartItem.item.id, cartItem.size)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.size, cartItem.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{cartItem.quantity}</span>
                        <button
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.size, cartItem.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span>Итого:</span>
                  <span className="font-bold text-primary text-xl">{formatPrice(totalPrice)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full"
                >
                  Оформить заказ
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
