import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
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
import AuthCallback from "./pages/AuthCallback";
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
import DashboardRedirect from "./pages/DashboardRedirect";
import ScrollToTop from "./components/ScrollToTop";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import AdminGenerateDora from "./pages/AdminGenerateDora";
import DashboardAppointments from "./pages/DashboardAppointments";
import DashboardAnalytics from "./pages/DashboardAnalytics";
import DashboardAIUsage from "./pages/DashboardAIUsage";
import DashboardCoupons from "./pages/DashboardCoupons";
import DashboardBetaUsers from "./pages/DashboardBetaUsers";
import CompleteProfile from "./pages/CompleteProfile";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  // Persist dashboard routes for navigation within dashboard
  useEffect(() => {
    if (location.pathname.startsWith('/dashboard')) {
      localStorage.setItem("last-dashboard-path", location.pathname);
    }
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public routes with Header/Footer */}
      <Route path="/" element={<><Header /><Home /><Footer /><WhatsAppFloat /></>} />
      <Route path="/quem-sou" element={<><Header /><QuemSou /><Footer /><WhatsAppFloat /></>} />
      <Route path="/mentoria" element={<><Header /><Mentoria /><Footer /><WhatsAppFloat /></>} />
      <Route path="/solucoes" element={<><Header /><Solucoes /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes" element={<><Header /><Produtos /><Footer /><WhatsAppFloat /></>} />
      {/* New short Portuguese URLs */}
      <Route path="/assistentes/financeiro" element={<><Header /><FinancialAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/business" element={<><Header /><BusinessAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/vendas" element={<><Header /><SalesAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/marketing" element={<><Header /><MarketingAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/suporte" element={<><Header /><SupportAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/viagens" element={<><Header /><TravelAssistant /><Footer /><WhatsAppFloat /></>} />
      <Route path="/assistentes/fitness" element={<><Header /><FitnessAssistant /><Footer /><WhatsAppFloat /></>} />
      
      {/* Redirects from old URLs to new */}
      <Route path="/assistentes/financial-assistant" element={<Navigate to="/assistentes/financeiro" replace />} />
      <Route path="/assistente-financeiro" element={<Navigate to="/assistentes/financeiro" replace />} />
      <Route path="/assistentes/business-assistant" element={<Navigate to="/assistentes/business" replace />} />
      <Route path="/assistentes/travel-assistant" element={<Navigate to="/assistentes/viagens" replace />} />
      <Route path="/assistentes/fitness-assistant" element={<Navigate to="/assistentes/fitness" replace />} />
      <Route path="/assistentes/sales-assistant" element={<Navigate to="/assistentes/vendas" replace />} />
      <Route path="/assistentes/marketing-assistant" element={<Navigate to="/assistentes/marketing" replace />} />
      <Route path="/assistentes/support-assistant" element={<Navigate to="/assistentes/suporte" replace />} />
      <Route path="/demo/:assistantId" element={<DemoAssistant />} />
      <Route path="/blog" element={<><Header /><Blog /><Footer /><WhatsAppFloat /></>} />
      <Route path="/blog/:slug" element={<><Header /><BlogPost /><Footer /><WhatsAppFloat /></>} />
      <Route path="/contato" element={<><Header /><Contato /><Footer /><WhatsAppFloat /></>} />
      <Route path="/pricing" element={<><Header /><Pricing /><Footer /><WhatsAppFloat /></>} />
      <Route path="/planos" element={<><Header /><Pricing /><Footer /><WhatsAppFloat /></>} />
      <Route path="/termos" element={<><Header /><Termos /><Footer /><WhatsAppFloat /></>} />
      <Route path="/privacidade" element={<><Header /><Privacidade /><Footer /><WhatsAppFloat /></>} />
      
      {/* Redirect old route to new */}
      <Route path="/agentes-ia" element={<Navigate to="/solucoes" replace />} />
      
      {/* Auth routes without Header/Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/cadastro-gratuito" element={<SignupFree />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/tools/generate-dora" element={<AdminGenerateDora />} />
      
      {/* Dashboard routes with sidebar */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardRedirect />} />
        <Route path="panel" element={<Dashboard />} />
        <Route path="analytics" element={<DashboardAnalytics />} />
        <Route path="ai-usage" element={<DashboardAIUsage />} />
        <Route path="users" element={<DashboardUsers />} />
        <Route path="users/:userId/agents" element={<ManageUserAgents />} />
        <Route path="agents" element={<DashboardAgents />} />
        <Route path="coupons" element={<DashboardCoupons />} />
        <Route path="beta-users" element={<DashboardBetaUsers />} />
        <Route path="agents-for-user" element={<DashboardAgentsForUser />} />
        <Route path="profile" element={<Profile />} />
        <Route path="appointments" element={<DashboardAppointments />} />
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
