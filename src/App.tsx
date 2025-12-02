import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import Home from "./pages/Home";
import QuemSou from "./pages/QuemSou";
import Mentoria from "./pages/Mentoria";
import Solucoes from "./pages/Solucoes";
import Produtos from "./pages/Produtos";
import Blog from "./pages/Blog";
import Contato from "./pages/Contato";
import AgentesIA from "./pages/AgentesIA";
import FinancialAssistant from "./pages/FinancialAssistant";
import BusinessAssistant from "./pages/BusinessAssistant";
import TravelAssistant from "./pages/TravelAssistant";
import FitnessAssistant from "./pages/FitnessAssistant";
import SalesAssistant from "./pages/SalesAssistant";
import MarketingAssistant from "./pages/MarketingAssistant";
import SupportAssistant from "./pages/SupportAssistant";
import DemoAssistant from "./pages/DemoAssistant";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import Pricing from "./pages/Pricing";
import SignupFree from "./pages/SignupFree";
import Dashboard from "./pages/Dashboard";
import DashboardUsers from "./pages/DashboardUsers";
import DashboardAgents from "./pages/DashboardAgents";
import Profile from "./pages/Profile";
import DashboardAgentsForUser from "./pages/DashboardAgentsForUser";
import ManageUserAgents from "./pages/ManageUserAgents";
import DashboardLayout from "./components/DashboardLayout";
import ChatAgent from "./pages/ChatAgent";
import NotFound from "./pages/NotFound";
import AdminSetup from "./pages/AdminSetup";
import DashboardRedirect from "./pages/DashboardRedirect";
import ScrollToTop from "./components/ScrollToTop";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  // Simplified: only persist and restore dashboard routes
  useEffect(() => {
    if (location.pathname.startsWith('/dashboard')) {
      localStorage.setItem("last-dashboard-path", location.pathname);
    }
  }, [location.pathname]);

  // Restore only if user lands on root and had a dashboard session
  useEffect(() => {
    const restoreDashboard = async () => {
      if (location.pathname !== "/") return;
      
      const saved = localStorage.getItem("last-dashboard-path");
      if (!saved) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session && saved.startsWith("/dashboard")) {
        navigate(saved, { replace: true });
      }
    };
    restoreDashboard();
  }, [location.pathname, navigate]);

  return (
    <Routes>
      {/* Public routes with Header/Footer */}
      <Route path="/" element={<><Header /><Home /><Footer /><WhatsAppFloat /></>} />
      <Route path="/quem-sou" element={<><Header /><QuemSou /><Footer /><WhatsAppFloat /></>} />
      <Route path="/mentoria" element={<><Header /><Mentoria /><Footer /><WhatsAppFloat /></>} />
      <Route path="/solucoes" element={<><Header /><Solucoes /><Footer /><WhatsAppFloat /></>} />
      <Route path="/agentes-ia" element={<><Header /><AgentesIA /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes" element={<><Header /><Produtos /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/financial-assistant" element={<><Header /><FinancialAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistente-financeiro" element={<><Header /><FinancialAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/business-assistant" element={<><Header /><BusinessAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/travel-assistant" element={<><Header /><TravelAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/fitness-assistant" element={<><Header /><FitnessAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/sales-assistant" element={<><Header /><SalesAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/marketing-assistant" element={<><Header /><MarketingAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/support-assistant" element={<><Header /><SupportAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/demo/:assistantId" element={<DemoAssistant />} />
      <Route path="/blog" element={<><Header /><Blog /><Footer /><WhatsAppFloat /></>} />
      <Route path="/blog/:slug" element={<><Header /><BlogPost /><Footer /><WhatsAppFloat /></>} />
      <Route path="/contato" element={<><Header /><Contato /><Footer /><WhatsAppFloat /></>} />
      <Route path="/pricing" element={<><Header /><Pricing /><Footer /><WhatsAppFloat /></>} />
      <Route path="/planos" element={<><Header /><Pricing /><Footer /><WhatsAppFloat /></>} />
      
      {/* Auth routes without Header/Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/cadastro-gratuito" element={<SignupFree />} />
      <Route path="/admin/setup" element={<AdminSetup />} />
      
      {/* Dashboard routes with sidebar */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardRedirect />} />
        <Route path="panel" element={<Dashboard />} />
        <Route path="users" element={<DashboardUsers />} />
        <Route path="users/:userId/agents" element={<ManageUserAgents />} />
        <Route path="agents" element={<DashboardAgents />} />
        <Route path="agents-for-user" element={<DashboardAgentsForUser />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Chat route */}
      <Route path="/chat/:url" element={<ChatAgent />} />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<><Header /><NotFound /><Footer /></>} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
