import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Music from "./pages/Music";
import Merch from "./pages/Merch";
import SecretMusic from "./pages/SecretMusic";
import Radar from "./pages/Radar";
import RadarAdmin from "./pages/RadarAdmin";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";

const queryClient = new QueryClient();

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          {/* Grain texture overlay */}
          <div className="grain-overlay" />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Navigation onCartClick={() => setIsCartOpen(true)} />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/music" element={<Music />} />
               <Route path="/radar" element={<Radar />} />
              <Route path="/merch" element={<Merch />} />
              <Route path="/secret" element={<SecretMusic />} />
              <Route path="/radar-admin" element={<RadarAdmin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App;
