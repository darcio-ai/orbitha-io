import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Termos = () => {
  return (
    <main className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-border/50">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl md:text-4xl font-bold text-foreground">
              Termos de Uso
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Data de vigência: Dezembro de 2024
            </p>
          </CardHeader>

          <CardContent className="space-y-8 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                1. Aceitação dos Termos
              </h2>
              <p className="leading-relaxed">
                Ao criar uma conta na plataforma Orbitha, você concorda integralmente com estes Termos de Uso. 
                Se você não concorda com algum termo, não utilize nossos serviços. O uso continuado da 
                plataforma constitui aceitação de quaisquer alterações feitas a estes termos.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                2. Descrição do Serviço
              </h2>
              <p className="leading-relaxed mb-3">
                A Orbitha oferece assistentes de inteligência artificial especializados em diversas áreas, incluindo:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Assistente Financeiro - orientações sobre finanças pessoais</li>
                <li>Assistente de Negócios - suporte para empreendedores</li>
                <li>Assistente de Fitness - dicas de exercícios e bem-estar</li>
                <li>Assistente de Viagens - planejamento de viagens</li>
                <li>Assistente de Marketing - estratégias de marketing digital</li>
                <li>Assistente de Vendas - técnicas de vendas</li>
                <li>Assistente de Suporte - atendimento ao cliente</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                3. Conta de Usuário
              </h2>
              <p className="leading-relaxed">
                Você é responsável por manter a confidencialidade de suas credenciais de acesso (email e senha). 
                Todas as atividades realizadas em sua conta são de sua responsabilidade. Notifique-nos 
                imediatamente caso suspeite de uso não autorizado de sua conta.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                4. Uso da Plataforma
              </h2>
              <p className="leading-relaxed mb-3">
                Ao utilizar nossos serviços, você concorda em:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Não utilizar a plataforma para fins ilegais ou não autorizados</li>
                <li>Não tentar acessar áreas restritas do sistema</li>
                <li>Não compartilhar sua conta com terceiros</li>
                <li>Respeitar outros usuários e a equipe Orbitha</li>
              </ul>
              <p className="leading-relaxed">
                Reservamo-nos o direito de suspender ou encerrar contas que violem estas regras.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                5. Limitações de Responsabilidade
              </h2>
              <p className="leading-relaxed mb-3">
                <strong>Importante:</strong> Os assistentes de IA da Orbitha fornecem informações de caráter 
                educativo e orientativo. Eles <strong>não substituem</strong> profissionais qualificados como:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li>Consultores financeiros certificados (CPA, CFP)</li>
                <li>Advogados e contadores</li>
                <li>Médicos e profissionais de saúde</li>
                <li>Personal trainers e nutricionistas</li>
              </ul>
              <p className="leading-relaxed">
                As decisões tomadas com base nas orientações dos assistentes são de inteira responsabilidade 
                do usuário. A Orbitha não se responsabiliza por perdas financeiras, danos à saúde ou 
                quaisquer outros prejuízos decorrentes do uso das informações fornecidas.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                6. Planos e Pagamentos
              </h2>
              <p className="leading-relaxed mb-3">
                A Orbitha oferece diferentes planos de assinatura:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li><strong>Plano Gratuito:</strong> Acesso limitado aos assistentes para experimentação</li>
                <li><strong>Plano Premium:</strong> Acesso completo a todos os assistentes e funcionalidades</li>
              </ul>
              <p className="leading-relaxed">
                Os pagamentos são processados de forma segura através de nossos parceiros de pagamento. 
                Ao assinar um plano pago, você autoriza a cobrança recorrente conforme o ciclo escolhido 
                (mensal ou anual).
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                7. Cancelamento
              </h2>
              <p className="leading-relaxed">
                Você pode cancelar sua assinatura a qualquer momento através do painel do usuário ou 
                entrando em contato conosco. O cancelamento será efetivado ao final do período já pago, 
                e você continuará tendo acesso aos serviços até essa data. Não há reembolso proporcional 
                para o período não utilizado.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                8. Propriedade Intelectual
              </h2>
              <p className="leading-relaxed">
                Todo o conteúdo da plataforma Orbitha, incluindo mas não limitado a textos, gráficos, 
                logos, ícones, imagens, código-fonte e software, é de propriedade exclusiva da Orbitha 
                ou de seus licenciadores. É proibida a reprodução, distribuição ou modificação sem 
                autorização prévia por escrito.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                9. Privacidade e Dados
              </h2>
              <p className="leading-relaxed">
                Respeitamos sua privacidade e protegemos seus dados pessoais de acordo com a Lei Geral 
                de Proteção de Dados (LGPD). As conversas com os assistentes podem ser armazenadas para 
                melhorar a experiência do usuário e o funcionamento do serviço. Não compartilhamos seus 
                dados pessoais com terceiros, exceto quando necessário para a prestação do serviço ou 
                por exigência legal.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                10. Modificações nos Termos
              </h2>
              <p className="leading-relaxed">
                A Orbitha reserva-se o direito de modificar estes Termos de Uso a qualquer momento. 
                Alterações significativas serão comunicadas por email ou através de aviso na plataforma. 
                O uso continuado após as modificações constitui aceitação dos novos termos.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                11. Contato
              </h2>
              <p className="leading-relaxed mb-3">
                Para dúvidas, sugestões ou reclamações sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <ul className="space-y-2 ml-4">
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:darcio@orbitha.io" className="text-primary hover:underline">
                    darcio@orbitha.io
                  </a>
                </li>
                <li>
                  <strong>WhatsApp:</strong>{" "}
                  <a 
                    href="https://wa.me/5513991497873" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    (13) 99149-7873
                  </a>
                </li>
              </ul>
            </section>

            <Separator />

            <section className="text-center pt-4">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} Orbitha. Todos os direitos reservados.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Termos;
