import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import MerchCard from '@/components/MerchCard';
import { merchItems } from '@/data/merch';

const Merch = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
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

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center bg-card rounded-2xl p-8"
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
