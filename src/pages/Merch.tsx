import { motion } from 'framer-motion';
import { ShoppingCart, Store, Package, Truck } from 'lucide-react';
import MerchCard from '@/components/MerchCard';
import { merchItems } from '@/data/merch';

// Marketplace icons - placeholders
const marketplaces = [
  { 
    name: 'Kaspi', 
    href: 'https://kaspi.kz',
    icon: Store,
    color: 'hover:bg-red-500',
  },
  { 
    name: 'Ozon', 
    href: 'https://ozon.ru',
    icon: Package,
    color: 'hover:bg-blue-500',
  },
  { 
    name: 'Wildberries', 
    href: 'https://wildberries.ru',
    icon: ShoppingCart,
    color: 'hover:bg-purple-500',
  },
  { 
    name: 'Flip.kz', 
    href: 'https://flip.kz',
    icon: Truck,
    color: 'hover:bg-orange-500',
  },
];

const Merch = () => {
  return (
    <div className="min-h-screen">
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-display text-5xl md:text-7xl">
              МЕРЧ <span className="text-primary">✦</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Официальный мерч Piggy Pop
            </p>
          </motion.div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {merchItems.map((item, index) => (
              <MerchCard key={item.id} item={item} index={index} />
            ))}
          </div>

          {/* Marketplaces */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center bg-card rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl mb-6">Покупайте на маркетплейсах</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {marketplaces.map((marketplace) => (
                <a 
                  key={marketplace.name}
                  href={marketplace.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-14 h-14 flex items-center justify-center bg-secondary rounded-xl transition-all duration-300 hover:scale-110 hover:text-white ${marketplace.color}`}
                  title={marketplace.name}
                >
                  <marketplace.icon size={28} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center bg-card rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl mb-4">Есть вопросы по заказу?</h3>
            <p className="text-muted-foreground">
              Напишите нам на почту: <span className="text-primary">merch@piggypop.com</span>
            </p>
            <p className="text-muted-foreground mt-2">
              Доставка по всей России. Отправка в течение 3-5 рабочих дней.
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p className="font-display text-xl">
            PIGGY<span className="text-primary">POP</span>
          </p>
          <p className="text-sm mt-2">© 2024 All rights reserved. Go! Go! Piggy Pop!</p>
        </div>
      </footer>
    </div>
  );
};

export default Merch;
