const QuemSou = () => {
  return (
    <div className="min-h-screen pt-20">
      <section className="max-w-4xl mx-auto py-16 px-6">
        {/* Título principal */}
        <h1 className="text-4xl font-bold text-center mb-12 text-foreground">
          Quem Sou
        </h1>

        {/* Card principal */}
        <div className="bg-card/60 border border-border rounded-xl p-8 mb-10 shadow-lg">
          {/* Foto futura */}
          <div className="w-full flex justify-center mb-8">
            <div className="w-40 h-40 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground text-sm">
              Foto Aqui
            </div>
          </div>

          {/* Apresentação */}
          <p className="text-muted-foreground leading-relaxed mb-6">
            Deixa eu te contar um pouco sobre quem está por trás de tudo isso…
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Eu sou o <strong className="text-primary">Darcio Galaverna</strong> — casado, canceriano, apaixonado por trabalhos manuais, viagens,
            séries (especialmente GOT e Marvel) e filmes de ação.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Comecei cedo: entregando pizza aos 12 anos e, aos 14, trabalhando como office-boy.
            Passei grande parte da minha adolescência mexendo com computadores (alguém lembra do 386 e 486?),
            minha primeira paixão. Mas a vida me levou por outros caminhos e, em 2000, comecei como operador de telemarketing.
            Eu mal sabia falar ao telefone rsrs. Entrei no atendimento receptivo, mas um ano depois descobri a área de vendas —
            minha segunda grande paixão — e dali não saí mais.
          </p>
        </div>

        {/* Trajetória Profissional */}
        <div className="bg-card/60 border border-border rounded-xl p-8 mb-10 shadow-lg">
          <h2 className="text-2xl font-semibold text-primary mb-4">Trajetória Profissional</h2>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Passei por diversos segmentos: cartão de crédito, título de capitalização, provedor de internet (UOL?),
            jornais de economia, jardim vertical, entre outros. Nos últimos anos, tive a oportunidade de atuar diretamente
            com startups — SaaS, pagamentos, automação e IA.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-2">
            Hoje, com mais de 25 anos de experiência em vendas, continuo completamente apaixonado por tecnologia e inovação.
            Decidi unir minha bagagem comercial à automação e à inteligência artificial para criar soluções que facilitam
            a vida de quem empreende, atende e vende. 🚀
          </p>
        </div>

        {/* Orbitha.io */}
        <div className="bg-card/60 border border-border rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-primary mb-4">Orbitha.io</h2>

          <p className="text-muted-foreground leading-relaxed">
            Atualmente, estou à frente da <strong className="text-primary">Orbitha.io</strong>,
            ajudando empresas a integrarem IA em seus atendimentos e processos,
            sempre com foco em performance, simplicidade e resultado.
          </p>
        </div>
      </section>
    </div>
  );
};

export default QuemSou;
