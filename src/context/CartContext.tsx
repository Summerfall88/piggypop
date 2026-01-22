import { createContext, useContext, useState, ReactNode } from 'react';
import type { MerchItem } from '@/data/merch';

export interface CartItem {
  item: MerchItem;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: MerchItem, size: string) => void;
  removeItem: (itemId: string, size: string) => void;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: MerchItem, size: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.item.id === item.id && i.size === size);
      if (existing) {
        return prev.map(i => 
          i.item.id === item.id && i.size === size 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { item, size, quantity: 1 }];
    });
  };

  const removeItem = (itemId: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.item.id === itemId && i.size === size)));
  };

  const updateQuantity = (itemId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId, size);
      return;
    }
    setItems(prev => 
      prev.map(i => 
        i.item.id === itemId && i.size === size 
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.item.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      totalItems, 
      totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
