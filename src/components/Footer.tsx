import { Link } from "react-router-dom";
import orbithaLogo from "@/assets/orbitha-logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={orbithaLogo} 
                alt="Orbitha Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold">Orbitha.io</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Ajudamos pequenas e médias empresas a integrarem inteligência artificial em seus 
              atendimentos e processos, com foco em performance, simplicidade e resultado.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/5583993095371"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/solucoes" className="text-muted-foreground hover:text-primary transition-colors">
                  Soluções
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>darciog@orbitha.io</li>
              <li>
                <a
                  href="https://wa.me/5583993095371"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Orbitha.io. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;