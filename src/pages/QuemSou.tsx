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
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Apresentação Pessoal
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Olá! Sou um profissional apaixonado por tecnologia e inovação, especializado em 
                soluções de inteligência artificial e automação de processos. Com anos de experiência 
                no mercado, dedico-me a ajudar empresas e profissionais a transformarem seus negócios 
                através da tecnologia.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Minha jornada começou com a curiosidade de entender como a tecnologia poderia 
                simplificar tarefas complexas e melhorar a eficiência operacional. Ao longo dos anos, 
                desenvolvi expertise em diversas áreas, incluindo desenvolvimento de sistemas, 
                inteligência artificial, e consultoria estratégica.
              </p>
            </section>

            <section className="bg-card rounded-lg p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Experiência Profissional
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Durante minha carreira, tive o privilégio de trabalhar com diversos clientes de 
                diferentes setores, desde startups até grandes corporações. Essa diversidade me 
                proporcionou uma visão ampla sobre os desafios únicos que cada negócio enfrenta.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Especializei-me em criar soluções personalizadas que combinam tecnologia de ponta 
                com estratégias práticas, sempre focando em resultados mensuráveis e sustentáveis 
                para os negócios dos meus clientes.
              </p>
            </section>

            <section className="bg-card rounded-lg p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Missão e Valores
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Minha missão é democratizar o acesso à tecnologia de ponta, tornando soluções 
                avançadas de IA acessíveis a todos. Acredito que toda empresa, independentemente 
                do seu tamanho, merece ter acesso às melhores ferramentas para crescer e prosperar.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Trabalho com transparência, ética e comprometimento total com o sucesso dos meus 
                clientes. Cada projeto é uma oportunidade de fazer a diferença e contribuir para 
                um futuro mais eficiente e inovador.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuemSou;
