const QuemSou = () => {
  return (
    <div className="min-h-screen pt-20">
      <section className="max-w-5xl mx-auto py-16 px-6">
        {/* Título principal */}
        <h1 className="text-4xl font-bold text-center mb-14 text-foreground animate-fade-in">
          Quem Sou
        </h1>

        {/* Bloco principal com foto + texto */}
        <div className="bg-card/60 border border-border rounded-xl p-10 mb-14 shadow-xl animate-fade-in">
          {/* Foto com borda neon */}
          <div className="w-full flex justify-center mb-10">
            <div className="relative group">
              {/* FOTO – substituir depois */}
              <div className="w-44 h-44 rounded-full bg-muted border border-border overflow-hidden shadow-md flex items-center justify-center text-muted-foreground">
                Foto Aqui
              </div>

              {/* Glow neon */}
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
        <div className="bg-card/60 border border-border rounded-xl p-10 mb-14 shadow-xl animate-fade-in">
          <h2 className="text-2xl font-semibold text-primary mb-8">Linha do Tempo Profissional</h2>

          <div className="space-y-10">
            <div className="flex items-start gap-6">
              <div className="w-4 h-4 bg-primary rounded-full mt-1"></div>
              <div>
                <h3 className="text-foreground font-semibold">1996 – 2000</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Primeiro contato com tecnologia: computadores antigos, internet discada e muita curiosidade.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-4 h-4 bg-primary rounded-full mt-1"></div>
              <div>
                <h3 className="text-foreground font-semibold">2000 – 2001</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Início no telemarketing. Atendimento receptivo e primeiros aprendizados sobre comunicação.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-4 h-4 bg-primary rounded-full mt-1"></div>
              <div>
                <h3 className="text-foreground font-semibold">2001 – 2015</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Transição para vendas: cartões de crédito, títulos, UOL, jornais, serviços e outros segmentos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-4 h-4 bg-primary rounded-full mt-1"></div>
              <div>
                <h3 className="text-foreground font-semibold">2015 – 2023</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Atuação direta com startups: SaaS, automação, meios de pagamento e inteligência artificial.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-4 h-4 bg-primary rounded-full mt-1"></div>
              <div>
                <h3 className="text-foreground font-semibold">2023 – Atual</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mais de 25 anos de vendas + tecnologia e inovação = surgimento da Orbitha.io 🚀
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Habilidades */}
        <div className="bg-card/60 border border-border rounded-xl p-10 mb-14 shadow-xl animate-fade-in">
          <h2 className="text-2xl font-semibold text-primary mb-8">Minhas Habilidades</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-muted/50 border border-border p-6 rounded-xl text-center hover-scale">
              <p className="text-primary text-xl mb-2">🤝</p>
              <h4 className="text-foreground font-semibold">Vendas & Negociação</h4>
            </div>

            <div className="bg-muted/50 border border-border p-6 rounded-xl text-center hover-scale">
              <p className="text-primary text-xl mb-2">⚙️</p>
              <h4 className="text-foreground font-semibold">Automação</h4>
            </div>

            <div className="bg-muted/50 border border-border p-6 rounded-xl text-center hover-scale">
              <p className="text-primary text-xl mb-2">🤖</p>
              <h4 className="text-foreground font-semibold">Inteligência Artificial</h4>
            </div>

            <div className="bg-muted/50 border border-border p-6 rounded-xl text-center hover-scale">
              <p className="text-primary text-xl mb-2">📈</p>
              <h4 className="text-foreground font-semibold">Crescimento & Performance</h4>
            </div>

            <div className="bg-muted/50 border border-border p-6 rounded-xl text-center hover-scale">
              <p className="text-primary text-xl mb-2">💡</p>
              <h4 className="text-foreground font-semibold">Inovação</h4>
            </div>

            <div className="bg-muted/50 border border-border p-6 rounded-xl text-center hover-scale">
              <p className="text-primary text-xl mb-2">🧩</p>
              <h4 className="text-foreground font-semibold">Solução de Problemas</h4>
            </div>
          </div>
        </div>

        {/* Orbitha.io */}
        <div className="bg-card/60 border border-border rounded-xl p-10 shadow-xl animate-fade-in">
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
