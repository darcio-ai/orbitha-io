
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Recursos", href: "/recursos" },
    { name: "Soluções", href: "/solucoes" },
    { name: "Sobre Nós", href: "/quem-sou" },
    { name: "Contato", href: "/contato" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-background/10 backdrop-blur-md border border-white/20 rounded-full z-50 shadow-cyber-glow">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/3a01f0ad-7d48-4819-9887-c0f0d70eb3ee.png" 
              alt="Orbitha Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-bold text-white">Orbitha</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-cyber-cyan ${
                  isActive(item.href) ? "text-cyber-cyan" : "text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Profile Icon */}
          <div className="hidden md:flex">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10" asChild>
              <Link to="/login">
                <User className="h-5 w-5 text-gray-300" />
              </Link>
            </Button>
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10" asChild>
              <Link to="/login">
                <User className="h-5 w-5 text-gray-300" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-gray-300" /> : <Menu className="h-6 w-6 text-gray-300" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors rounded-lg ${
                    isActive(item.href) ? "text-cyber-cyan bg-white/10" : "text-gray-300 hover:bg-white/5"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
