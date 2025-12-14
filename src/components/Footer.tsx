import { Link } from "react-router-dom";
import orbithaLogo from "@/assets/orbitha-logo-new.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2 text-center md:text-left">
            <div className="flex items-center space-x-3 mb-4 justify-center md:justify-start">
              <img 
                src={orbithaLogo} 
                alt="Orbitha Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-space font-bold bg-gradient-primary bg-clip-text text-transparent">
                Orbitha
              </span>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-md mx-auto md:mx-0">
              Ajudamos pequenas e médias empresas a integrarem inteligência artificial em seus 
              atendimentos e processos, com foco em performance, simplicidade e resultado.
            </p>
          </div>

          {/* Navegação */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/quem-sou" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Quem Sou
                </Link>
              </li>
              <li>
                <Link to="/mentoria" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Mentoria
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Preços
                </Link>
              </li>
            </ul>
          </div>

          {/* Soluções */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-semibold mb-4">Soluções</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/solucoes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Soluções B2B
                </Link>
              </li>
              <li>
                <Link to="/assistentes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Assistentes IA
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:contato@orbitha.io"
                  className="hover:text-primary transition-colors"
                >
                  contato@orbitha.io
                </a>
              </li>
              <li>
              <a
                  href="https://wa.me/5513991497873?text=Oi! Quero falar com a Orbitha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp: (13) 99149-7873
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-muted-foreground">
          <p>&copy; 2024 Orbitha. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
