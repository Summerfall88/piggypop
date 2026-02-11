import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronDown, ChevronUp, ZoomIn } from 'lucide-react';
import type { MerchItem } from '@/data/merch';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import ImageLightbox from '@/components/ImageLightbox';

interface MerchCardProps {
  item: MerchItem;
  index: number;
}

const MerchCard = ({ item, index }: MerchCardProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { addItem } = useCart();

  const handleOrder = () => {
    if (!selectedSize) {
      toast.error('Выберите размер');
      return;
    }
    addItem(item, selectedSize);
    toast.success(`${item.name} (${selectedSize}) добавлен в корзину!`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15, duration: 0.5 }}
        className="card-merch flex flex-col"
      >
        {/* Image */}
        <div className="aspect-square relative overflow-hidden cursor-pointer group" onClick={() => setLightboxOpen(true)}>
          <img
            src={item.images[currentImageIndex]}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Zoom overlay */}
          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300 flex items-center justify-center">
            <ZoomIn size={32} className="text-foreground opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
          </div>
          {!item.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-lg font-bold uppercase tracking-wider">Нет в наличии</span>
            </div>
          )}
        </div>

        {/* Image thumbnails */}
        {item.images.length > 1 && (
          <div className="flex gap-2 p-3 pb-0">
            {item.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-colors ${
                  i === currentImageIndex ? 'border-primary' : 'border-border hover:border-foreground/50'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4 flex flex-col flex-1">
          <div>
            <h3 className="font-display text-2xl">{item.name}</h3>
            <p className="text-primary font-bold text-xl mt-1">{formatPrice(item.price)}</p>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {item.description}
          </p>

          {/* Spacer to push size selection + button to bottom */}
          <div className="flex-1" />

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
            <button onClick={handleOrder} className="btn-primary w-full flex items-center justify-center gap-2" style={{ transform: 'rotate(0deg)' }}>
              <ShoppingBag size={20} />
              Заказать
            </button>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      <ImageLightbox
        images={item.images}
        isOpen={lightboxOpen}
        initialIndex={currentImageIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};

export default MerchCard;
