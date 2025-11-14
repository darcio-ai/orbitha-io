import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import Home from "./pages/Home";
import Mentoria from "./pages/Mentoria";
import Solucoes from "./pages/Solucoes";
import Produtos from "./pages/Produtos";
import Blog from "./pages/Blog";
import Contato from "./pages/Contato";
import FinancialAssistant from "./pages/FinancialAssistant";
import TravelAssistant from "./pages/TravelAssistant";
import FitnessAssistant from "./pages/FitnessAssistant";
import SalesAssistant from "./pages/SalesAssistant";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardUsers from "./pages/DashboardUsers";
import DashboardAgents from "./pages/DashboardAgents";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with Header/Footer */}
          <Route path="/" element={<><Header /><Home /><Footer /><WhatsAppFloat /></>} />
          <Route path="/mentoria" element={<><Header /><Mentoria /><Footer /><WhatsAppFloat /></>} />
          <Route path="/solucoes" element={<><Header /><Solucoes /><Footer /><WhatsAppFloat /></>} />
          <Route path="/assistentes" element={<><Header /><Produtos /><Footer /><WhatsAppFloat /></>} />
          <Route path="/assistentes/financial-assistant" element={<><Header /><FinancialAssistant /><Footer /><WhatsAppFloat /></>} />
          <Route path="/assistentes/travel-assistant" element={<><Header /><TravelAssistant /><Footer /><WhatsAppFloat /></>} />
          <Route path="/assistentes/fitness-assistant" element={<><Header /><FitnessAssistant /><Footer /><WhatsAppFloat /></>} />
          <Route path="/assistentes/sales-assistant" element={<><Header /><SalesAssistant /><Footer /><WhatsAppFloat /></>} />
          <Route path="/blog" element={<><Header /><Blog /><Footer /><WhatsAppFloat /></>} />
          <Route path="/contato" element={<><Header /><Contato /><Footer /><WhatsAppFloat /></>} />
          
          {/* Auth routes without Header/Footer */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard routes with sidebar */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<DashboardUsers />} />
            <Route path="agents" element={<DashboardAgents />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<><Header /><NotFound /><Footer /></>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
