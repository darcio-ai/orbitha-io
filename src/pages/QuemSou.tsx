const QuemSou = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Quem Sou
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section className="bg-card rounded-lg p-8 shadow-sm border border-border">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Deixa eu te contar um pouco sobre quem está por trás de tudo isso…
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Eu sou o <strong>Darcio Galaverna</strong> — casado, canceriano, apaixonado por trabalhos manuais, viagens, séries (especialmente GOT e Marvel) e filmes de ação.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Comecei cedo: entregando pizza aos 12 anos e, aos 14, trabalhando como office-boy. Passei grande parte da minha adolescência mexendo com computadores (alguém lembra do 386 e 486?), minha primeira paixão. Mas a vida me levou por outros caminhos e, em 2000, comecei como operador de telemarketing. Eu mal sabia falar ao telefone rsrs. Entrei no atendimento receptivo, mas um ano depois descobri a área de vendas — minha segunda grande paixão — e dali não saí mais.
              </p>
            </section>

            <section className="bg-card rounded-lg p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Trajetória Profissional
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Passei por diversos segmentos: cartão de crédito, título de capitalização, provedor de internet (UOL?), jornais de economia, jardim vertical, entre outros. Nos últimos anos, tive a oportunidade de atuar diretamente com startups — SaaS, pagamentos, automação e IA.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Hoje, com mais de 25 anos de experiência em vendas, continuo completamente apaixonado por tecnologia e inovação. Decidi unir minha bagagem comercial à automação e à inteligência artificial para criar soluções que facilitam a vida de quem empreende, atende e vende. 🚀
              </p>
            </section>

            <section className="bg-card rounded-lg p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Orbitha.io
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Atualmente, estou à frente da <strong>Orbitha.io</strong>, ajudando empresas a integrarem IA em seus atendimentos e processos, sempre com foco em performance, simplicidade e resultado.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuemSou;
