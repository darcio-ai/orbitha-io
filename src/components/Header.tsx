import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Quem Sou", href: "/quem-sou" },
    { name: "Mentoria", href: "/mentoria" },
    { name: "Soluções", href: "/solucoes" },
    { name: "Assistentes de IA", href: "#assistentes" },
    { name: "Planos", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Contato", href: "/contato" },
  ];

  const isActive = (href: string) => location.pathname === href || location.hash === href;

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Desktop Navigation - Glass Capsule */}
        <nav className="hidden md:flex items-center justify-between h-16 px-6 rounded-full backdrop-blur-xl bg-card/10 border border-border/20 shadow-cyber-glow">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-primary-foreground"/>
            </div>
            <span className="text-xl font-space font-bold bg-gradient-primary bg-clip-text text-transparent">
              Orbitha
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-all hover:text-primary relative group ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"/>
              </a>
            ))}
          </div>

          {/* Profile Icon */}
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
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-14 px-4 rounded-full backdrop-blur-xl bg-card/10 border border-border/20">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center">
                <div className="w-3 h-3 rounded-full border-2 border-primary-foreground"/>
              </div>
              <span className="text-lg font-space font-bold bg-gradient-primary bg-clip-text text-transparent">
                Orbitha
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link to="/login">
                  <User className="h-5 w-5 text-primary" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mt-2 p-4 rounded-2xl backdrop-blur-xl bg-card/10 border border-border/20">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-2 text-sm font-medium rounded-lg transition-all ${
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
      </div>
    </header>
  );
};

export default Header;
