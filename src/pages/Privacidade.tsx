import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Privacidade = () => {
  return (
    <main className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-border/50">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl md:text-4xl font-bold text-foreground">
              Política de Privacidade
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Última atualização: 06 de janeiro de 2026
            </p>
          </CardHeader>

          <CardContent className="space-y-8 text-foreground/90">
            {/* Seção 1 */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                1. Informações que coletamos
              </h2>
              <p className="leading-relaxed">
                A Orbitha coleta informações fornecidas voluntariamente por você, como nome, 
                email e telefone, para prestação de nossos serviços de automação e integração.
              </p>
            </section>

            <Separator />

            {/* Seção 2 */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                2. Uso das informações
              </h2>
              <p className="leading-relaxed">
                Utilizamos suas informações para: fornecer nossos serviços, entrar em contato 
                quando necessário, e melhorar nossa plataforma.
              </p>
            </section>

            <Separator />

            {/* Seção 3 */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                3. Compartilhamento
              </h2>
              <p className="leading-relaxed">
                Não vendemos suas informações. Podemos compartilhar dados com serviços terceiros 
                (como Google) apenas para funcionamento das integrações solicitadas por você.
              </p>
            </section>

            <Separator />

            {/* Seção 4 */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                4. Segurança
              </h2>
              <p className="leading-relaxed">
                Adotamos medidas de segurança para proteger suas informações contra acesso não autorizado.
              </p>
            </section>

            <Separator />

            {/* Seção 5 */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                5. Contato
              </h2>
              <p className="leading-relaxed">
                Dúvidas sobre esta política? Entre em contato:{" "}
                <a 
                  href="mailto:contato@orbitha.io" 
                  className="text-primary hover:underline"
                >
                  contato@orbitha.io
                </a>
              </p>
            </section>

            <Separator />

            {/* Copyright */}
            <div className="text-center text-sm text-muted-foreground pt-4">
              <p>&copy; {new Date().getFullYear()} Orbitha. Todos os direitos reservados.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Privacidade;
