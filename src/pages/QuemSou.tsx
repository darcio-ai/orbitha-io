import { useEffect } from "react";
import { Link } from "react-router-dom";

const QuemSou = () => {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.sr-fade-up, .sr-left, .sr-right, .sr-zoom');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.animation = 'reveal .8s forwards ease-out';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <style>{`
        .sr-fade-up { opacity: 0; transform: translateY(20px); }
        .sr-left { opacity: 0; transform: translateX(-40px); }
        .sr-right { opacity: 0; transform: translateX(40px); }
        .sr-zoom { opacity: 0; transform: scale(0.8); }

        @keyframes reveal {
          to { opacity: 1; transform: translate(0,0) scale(1); }
        }
      `}</style>

      <section className="max-w-5xl mx-auto py-16 px-6">
        {/* Título */}
        <h1 className="text-4xl font-bold text-center mb-14 text-foreground sr-fade-up">
          Quem Sou
        </h1>

        {/* Bloco principal */}
        <div className="bg-card/60 border border-border rounded-xl p-10 mb-14 shadow-xl sr-fade-up">
          {/* Foto */}
          <div className="w-full flex justify-center mb-10">
            <div className="relative group">
              <div className="w-44 h-44 rounded-full bg-muted border border-border overflow-hidden shadow-md flex items-center justify-center text-muted-foreground">
                Foto Aqui
              </div>
              <div className="absolute inset-0 rounded-full blur-xl opacity-30 group-hover:opacity-80 transition-all duration-500 bg-primary"></div>
            </div>
          </div>

          {/* Texto */}
          <p className="text-muted-foreground leading-relaxed mb-6">
            Deixa eu te contar um pouco sobre quem está por trás de tudo isso…
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Eu sou o <strong className="text-primary">Darcio Galaverna</strong> — casado, canceriano, apaixonado por trabalhos manuais,
            viagens, séries (especialmente GOT e Marvel) e filmes de ação.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Comecei cedo: entregando pizza aos 12 anos e, aos 14, trabalhando como office-boy.
            Passei grande parte da minha adolescência mexendo com computadores (alguém lembra do 386 e 486?),
            minha primeira paixão. Mas a vida me levou por outros caminhos e, em 2000, comecei como operador de telemarketing.
            Eu mal sabia falar ao telefone rsrs. Entrei no atendimento receptivo, mas um ano depois descobri a área de vendas —
            minha segunda grande paixão — e dali não saí mais.
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-card/60 border border-border rounded-xl p-10 mb-14 shadow-xl">
          <h2 className="text-2xl font-semibold text-primary mb-8 sr-fade-up">
            Linha do Tempo Profissional
          </h2>

          <div className="space-y-10">
            <div className="flex items-start gap-6 sr-left">
              <div className="w-4 h-4 bg-primary rounded-full mt-1"></div>
              <div>
                <h3 className="text-foreground font-semibold">1996 – 2000</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Primeiro contato com tecnologia: computadores antigos, internet discada e muita curiosidade.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 sr-right">
              <div className="w-4 h-4 bg-primary rounded-full mt-1"></div>
              <div>
                <h3 className="text-foreground font-semibold">2000 – 2001</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Início no telemarketing. Atendimento receptivo e primeiros aprendizados sobre comunicação.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 sr-left">
              <div className="w-4 h-4 bg-primary rounded-full mt-1"></div>
              <div>
                <h3 className="text-foreground font-semibold">2001 – 2015</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Transição para vendas: cartões, títulos, UOL, jornais, serviços e outros segmentos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 sr-right">
              <div className="w-4 h-4 bg-primary rounded-full mt-1"></div>
              <div>
                <h3 className="text-foreground font-semibold">2015 – 2023</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Atuação com startups: SaaS, automação, meios de pagamento e IA.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 sr-left">
              <div className="w-4 h-4 bg-primary rounded-full mt-1"></div>
              <div>
                <h3 className="text-foreground font-semibold">2023 – Atual</h3>
                <p className="text-muted-foreground leading-relaxed">
                  25 anos de vendas + tecnologia = nascimento da Orbitha.io 🚀
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Habilidades */}
        <div className="bg-card/60 border border-border rounded-xl p-10 mb-14 shadow-xl">
          <h2 className="text-2xl font-semibold text-primary mb-8 sr-fade-up">Minhas Habilidades</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-muted/50 border border-border p-6 rounded-xl text-center sr-zoom">
              <p className="text-primary text-xl mb-2">🤝</p>
              <h4 className="text-foreground font-semibold">Vendas & Negociação</h4>
            </div>

            <div className="bg-muted/50 border border-border p-6 rounded-xl text-center sr-zoom">
              <p className="text-primary text-xl mb-2">⚙️</p>
              <h4 className="text-foreground font-semibold">Automação</h4>
            </div>

            <div className="bg-muted/50 border border-border p-6 rounded-xl text-center sr-zoom">
              <p className="text-primary text-xl mb-2">🤖</p>
              <h4 className="text-foreground font-semibold">Inteligência Artificial</h4>
            </div>

            <div className="bg-muted/50 border border-border p-6 rounded-xl text-center sr-zoom">
              <p className="text-primary text-xl mb-2">📈</p>
              <h4 className="text-foreground font-semibold">Performance</h4>
            </div>

            <div className="bg-muted/50 border border-border p-6 rounded-xl text-center sr-zoom">
              <p className="text-primary text-xl mb-2">💡</p>
              <h4 className="text-foreground font-semibold">Inovação</h4>
            </div>

            <div className="bg-muted/50 border border-border p-6 rounded-xl text-center sr-zoom">
              <p className="text-primary text-xl mb-2">🧩</p>
              <h4 className="text-foreground font-semibold">Solução de Problemas</h4>
            </div>
          </div>
        </div>

        {/* Orbitha.io */}
        <div className="bg-card/60 border border-border rounded-xl p-10 shadow-xl sr-fade-up">
          <h2 className="text-2xl font-semibold text-primary mb-4">Orbitha.io</h2>

          <p className="text-muted-foreground leading-relaxed mb-8">
            Atualmente, estou à frente da <strong className="text-primary">Orbitha.io</strong>,
            ajudando empresas a integrarem IA em seus atendimentos e processos, com foco em performance,
            simplicidade e resultado.
          </p>

          {/* CTA Contato */}
          <div className="text-center mt-10">
            <Link 
              to="/contato" 
              className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 transition rounded-lg text-primary-foreground text-lg font-semibold shadow-lg"
            >
              Entrar em Contato
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuemSou;
