import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import orbithaLogo from "@/assets/orbitha-logo-new.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    });
    navigate("/");
  };

  // Mobile navigation - flat list
  const mobileNavigation = [
    { name: "Home", href: "/" },
    { name: "Quem Sou", href: "/quem-sou" },
    { name: "Mentoria", href: "/mentoria" },
    { name: "Soluções B2B", href: "/solucoes" },
    { name: "Assistentes IA", href: "/assistentes" },
    { name: "Preços", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Contato", href: "/contato" },
  ];

  const isActive = (href: string) => location.pathname === href || location.hash === href;

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-14 px-4 rounded-full backdrop-blur-xl bg-card/10 border border-border/20">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={orbithaLogo} 
                alt="Orbitha Logo" 
                className="h-7 w-auto"
              />
              <span className="text-base font-space font-bold bg-gradient-primary bg-clip-text text-transparent">
                Orbitha
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-9 w-9" 
                    asChild
                  >
                    <Link to="/dashboard">
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-9 w-9" 
                    onClick={handleLogout}
                    title="Sair"
                  >
                    <LogOut className="h-4 w-4 text-primary" />
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" asChild>
                  <Link to="/login">
                    <User className="h-4 w-4 text-primary" />
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mt-2 p-3 rounded-2xl backdrop-blur-xl bg-card/10 border border-border/20">
              <div className="space-y-1">
                {mobileNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      isActive(item.href) 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:bg-card/20"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation - Glass Capsule with Dropdowns */}
        <nav className="hidden md:flex items-center justify-between h-16 px-6 rounded-full backdrop-blur-xl bg-card/10 border border-border/20 shadow-cyber-glow">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={orbithaLogo} 
              alt="Orbitha Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-space font-bold bg-gradient-primary bg-clip-text text-transparent">
              Orbitha
            </span>
          </Link>

          {/* Navigation Links with Dropdowns */}
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {/* Home - Simple Link */}
              <NavigationMenuItem>
                <Link
                  to="/"
                  className={cn(
                    "text-sm font-medium transition-all hover:text-primary px-3 py-2 rounded-md",
                    isActive("/") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Home
                </Link>
              </NavigationMenuItem>

              {/* Sobre - Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-primary hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary">
                  Sobre
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-48 gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/quem-sou"
                          className={cn(
                            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive("/quem-sou") && "bg-accent/50"
                          )}
                        >
                          <div className="text-sm font-medium">Quem Sou</div>
                          <p className="text-xs text-muted-foreground mt-1">Conheça minha história</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/mentoria"
                          className={cn(
                            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive("/mentoria") && "bg-accent/50"
                          )}
                        >
                          <div className="text-sm font-medium">Mentoria</div>
                          <p className="text-xs text-muted-foreground mt-1">Mentoria personalizada</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Soluções de IA - Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-primary hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary">
                  Soluções de IA
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-56 gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/solucoes"
                          className={cn(
                            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive("/solucoes") && "bg-accent/50"
                          )}
                        >
                          <div className="text-sm font-medium">Soluções B2B</div>
                          <p className="text-xs text-muted-foreground mt-1">Automação e agentes para empresas</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/assistentes"
                          className={cn(
                            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive("/assistentes") && "bg-accent/50"
                          )}
                        >
                          <div className="text-sm font-medium">Assistentes IA</div>
                          <p className="text-xs text-muted-foreground mt-1">Teste nossos assistentes com demo</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Preços - Simple Link */}
              <NavigationMenuItem>
                <Link
                  to="/pricing"
                  className={cn(
                    "text-sm font-medium transition-all hover:text-primary px-3 py-2 rounded-md",
                    isActive("/pricing") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Preços
                </Link>
              </NavigationMenuItem>

              {/* Blog - Simple Link */}
              <NavigationMenuItem>
                <Link
                  to="/blog"
                  className={cn(
                    "text-sm font-medium transition-all hover:text-primary px-3 py-2 rounded-md",
                    isActive("/blog") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Blog
                </Link>
              </NavigationMenuItem>

              {/* Contato - Simple Link */}
              <NavigationMenuItem>
                <Link
                  to="/contato"
                  className={cn(
                    "text-sm font-medium transition-all hover:text-primary px-3 py-2 rounded-md",
                    isActive("/contato") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Contato
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Profile Icon / Logout */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full px-4 backdrop-blur-xl bg-card/10 border border-border/20 hover:bg-card/20 hover:shadow-glow transition-all text-primary"
                asChild
              >
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Meus Assistentes
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full w-10 h-10 backdrop-blur-xl bg-card/10 border border-border/20 hover:bg-card/20 hover:shadow-glow transition-all"
                onClick={handleLogout}
                title="Sair"
              >
                <LogOut className="h-5 w-5 text-primary" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-10 h-10 backdrop-blur-xl bg-card/10 border border-border/20 hover:bg-card/20 hover:shadow-glow transition-all"
              asChild
            >
              <Link to="/login">
                <User className="h-5 w-5 text-primary" />
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
