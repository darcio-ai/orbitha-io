
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
    { name: "Assistentes de IA", href: "/assistentes" },
    { name: "Planos", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Contato", href: "/contato" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border z-50">
      <div className="container mx-auto px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/3a01f0ad-7d48-4819-9887-c0f0d70eb3ee.png" 
              alt="Orbitha Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold">Orbitha.io</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="default" asChild>
              <a
                href="https://wa.me/5513991497873?text=Oi! Quero conhecer as soluções da Orbitha"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fale com a Dora
              </a>
            </Button>
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" className="w-full" asChild>
                  <a
                    href="https://wa.me/5513991497873?text=Oi! Quero conhecer as soluções da Orbitha"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Fale com a Dora
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
