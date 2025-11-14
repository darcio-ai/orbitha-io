import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, Bot, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DashboardLayout = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      // Get user role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleData) {
        setUserRole(roleData.role);
      }
      
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso.",
    });
    navigate("/login");
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const menuItems = [
    {
      name: "Painel",
      icon: LayoutDashboard,
      path: "/dashboard",
      adminOnly: false,
    },
    {
      name: "Usuários",
      icon: Users,
      path: "/dashboard/users",
      adminOnly: true,
    },
    {
      name: "Agentes",
      icon: Bot,
      path: "/dashboard/agents",
      adminOnly: true,
    },
  ];

  const visibleMenuItems = menuItems.filter(
    (item) => !item.adminOnly || userRole === "admin"
  );

  return (
    <div className="flex min-h-screen bg-muted/10">
      {/* Sidebar */}
      <aside className={`bg-card border-r border-border flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link to="/" className={`flex items-center space-x-3 ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"} transition-opacity duration-300`}>
            <img 
              src="/lovable-uploads/3a01f0ad-7d48-4819-9887-c0f0d70eb3ee.png" 
              alt="Orbitha Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold">Orbitha.io</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="shrink-0"
            title={sidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center py-3 rounded-lg transition-colors ${
                  sidebarCollapsed ? "justify-center px-0" : "space-x-3 px-4"
                } ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
                title={item.name}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className={`w-full transition-all ${sidebarCollapsed ? "justify-center px-0" : "justify-start"}`}
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && <span className="ml-3">Sair</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
