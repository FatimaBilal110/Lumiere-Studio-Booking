import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ui/ScrollToTop";

import Index from "./pages/Index.tsx";
import Packages from "./pages/Packages.tsx";
import Booking from "./pages/Booking.tsx";
import Checkout from "./pages/Checkout.tsx";
import Gallery from "./pages/Gallery.tsx";
import Studio from "./pages/Studio.tsx";
import AdminAuth from "./pages/AdminAuth.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/booking/:packageId" element={<Booking />} />
          <Route path="/checkout/:packageId" element={<Checkout />} />
          <Route path="/admin/login" element={<AdminAuth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
