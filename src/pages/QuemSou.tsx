import { useEffect } from "react";
import { Link } from "react-router-dom";

const QuemSou = () => {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.sr-fade-up');

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
        @keyframes reveal {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="max-w-5xl mx-auto py-16 px-6">
        {/* Título */}
        <h1 className="text-4xl font-bold text-center mb-14 text-foreground sr-fade-up">
          Quem Sou
        </h1>

        {/* Bloco principal com foto + texto */}
        <div className="bg-card/60 border border-border rounded-xl p-10 mb-14 shadow-xl sr-fade-up">
          {/* FOTO LIMPA, SEM EFEITO */}
          <div className="w-full flex justify-center mb-10">
            <img 
              src="/img/darcio.jpg"
              alt="Foto de Darcio Galaverna"
              className="w-44 h-44 rounded-full object-cover border border-border shadow-lg"
            />
          </div>

          {/* Texto discursivo original */}
          <p className="text-muted-foreground leading-relaxed mb-6">
            Deixa eu te contar um pouco sobre quem está por trás de tudo isso…
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Eu sou o <strong className="text-primary">Darcio Galaverna</strong> — casado, canceriano, apaixonado por trabalhos manuais, viagens,
            séries (especialmente GOT e Marvel) e filmes de ação.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Comecei cedo: entregando pizza aos 12 anos e, aos 14, trabalhando como office-boy. Passei grande parte da minha
            adolescência mexendo com computadores (alguém lembra do 386 e 486?), minha primeira paixão. Mas a vida me levou por
            outros caminhos e, em 2000, comecei como operador de telemarketing. Eu mal sabia falar ao telefone rsrs.
            Entrei no atendimento receptivo, mas um ano depois descobri a área de vendas — minha segunda grande paixão — e dali
            não saí mais.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Passei por diversos segmentos: cartão de crédito, título de capitalização, provedor de internet (UOL?),
            jornais de economia, jardim vertical, entre outros. Nos últimos anos, tive a oportunidade de atuar diretamente com
            startups — SaaS, pagamentos, automação e IA.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            Hoje, com mais de 25 anos de experiência em vendas, continuo completamente apaixonado por tecnologia e inovação.
            Decidi unir minha bagagem comercial à automação e à inteligência artificial para criar soluções que facilitam a vida
            de quem empreende, atende e vende. 🚀
          </p>
        </div>

        {/* Bloco Orbitha.io */}
        <div className="bg-card/60 border border-border rounded-xl p-10 shadow-xl sr-fade-up">
          <h2 className="text-2xl font-semibold text-primary mb-4">Orbitha.io</h2>

          <p className="text-muted-foreground leading-relaxed mb-8">
            Atualmente, estou à frente da <strong className="text-primary">Orbitha.io</strong>, ajudando empresas a integrarem IA em seus
            atendimentos e processos, sempre com foco em performance, simplicidade e resultado.
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
