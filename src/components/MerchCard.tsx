import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import type { MerchItem } from '@/data/merch';
import { toast } from 'sonner';

interface MerchCardProps {
  item: MerchItem;
  index: number;
}

const MerchCard = ({ item, index }: MerchCardProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const handleOrder = () => {
    if (!selectedSize) {
      toast.error('Выберите размер');
      return;
    }
    toast.success(`${item.name} (${selectedSize}) добавлен в корзину!`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="card-merch"
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        {!item.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-lg font-bold uppercase tracking-wider">Нет в наличии</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-display text-2xl">{item.name}</h3>
          <p className="text-primary font-bold text-xl mt-1">{formatPrice(item.price)}</p>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {item.description}
        </p>

        {/* Size Selection */}
        {item.inStock && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Размер:</p>
            <div className="flex flex-wrap gap-2">
              {item.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-btn ${selectedSize === size ? 'size-btn-active' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Chart Toggle */}
        <button
          onClick={() => setShowSizeChart(!showSizeChart)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Размерная сетка
          {showSizeChart ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Size Chart */}
        {showSizeChart && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left font-medium">Размер</th>
                  <th className="py-2 text-left font-medium">Грудь (см)</th>
                  <th className="py-2 text-left font-medium">Длина (см)</th>
                </tr>
              </thead>
              <tbody>
                {item.sizeChart.map((row) => (
                  <tr key={row.size} className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">{row.size}</td>
                    <td className="py-2 text-muted-foreground">{row.chest}</td>
                    <td className="py-2 text-muted-foreground">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Order Button */}
        {item.inStock && (
          <button onClick={handleOrder} className="btn-primary w-full flex items-center justify-center gap-2">
            <ShoppingBag size={20} />
            Заказать
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MerchCard;
