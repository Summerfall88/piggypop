 import { motion } from "framer-motion";
 import RadarPlayer from "@/components/radar/RadarPlayer";
 import SubmitForm from "@/components/radar/SubmitForm";
 import Disclaimer from "@/components/radar/Disclaimer";
 
 const Radar = () => {
   return (
     <main className="min-h-screen pt-24 pb-12">
       <div className="container mx-auto px-6">
         {/* Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="text-center mb-12"
         >
           <h1 className="font-display text-5xl md:text-7xl tracking-wider mb-4">
             MUSIC <span className="text-primary">RADAR</span>
           </h1>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
             24/7 радио с андеграунд музыкой. Слушай вместе со всеми в реальном времени.
           </p>
         </motion.div>
 
         {/* Player Section */}
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="max-w-2xl mx-auto mb-16"
         >
           <RadarPlayer />
         </motion.div>
 
         {/* Submit Section */}
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.4 }}
           className="max-w-xl mx-auto mb-12"
         >
           <h2 className="font-display text-2xl md:text-3xl tracking-wider text-center mb-6">
             ПРЕДЛОЖИ СВОЙ ТРЕК
           </h2>
           <SubmitForm />
         </motion.div>
 
         {/* Disclaimer */}
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.6, delay: 0.6 }}
         >
           <Disclaimer />
         </motion.div>
       </div>
     </main>
   );
 };
 
 export default Radar;