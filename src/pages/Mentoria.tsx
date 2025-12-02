import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Target, MessageSquare, FileText, Check, TrendingUp, Users, Award } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import darcioImg from "/public/img/darcio.jpg";

const Mentoria = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
    });
    window.open(
      `https://wa.me/5513991497873?text=Olá! Me chamo ${formData.name}, quero participar da Mentoria Direto ao Ponto`,
      "_blank"
    );
  };

  const sessions = [
    {
      icon: Target,
      title: "Diagnóstico (Sessão 1)",
      description: "Mapa de travas, ICP/persona e oferta, raio-X do funil e plano imediato.",
      color: "from-cyber-cyan/20 to-cyber-blue/20"
    },
    {
      icon: MessageSquare,
      title: "Qualificação (Sessão 2)",
      description: "Perguntas que descobrem dor em 10 min, decisores, urgência e orçamento.",
      color: "from-cyber-blue/20 to-cyber-purple/20"
    },
    {
      icon: Sparkles,
      title: "Pitch & Objeções (Sessão 3)",
      description: "Pitch em 45–60s, respostas curtas a preço/tempo/\"tô vendo\" e ancoragem de valor.",
      color: "from-cyber-purple/20 to-primary/20"
    },
    {
      icon: FileText,
      title: "Proposta & Follow-up (Sessão 4)",
      description: "Proposta simples com CTA claro, cadência de follow-up e plano de 30 dias.",
      color: "from-primary/20 to-secondary/20"
    },
  ];

  const benefits = [
    "4 encontros x 60min",
    "2 plantões extras de 30min",
    "Feedback direto por WhatsApp (seg–sex)",
    "Templates e checklists",
  ];

  const results = [
    { icon: TrendingUp, label: "Taxa de conversão", value: "+150%" },
    { icon: Users, label: "Clientes atendidos", value: "500+" },
    { icon: Award, label: "Anos de experiência", value: "25+" },
  ];

  const faqs = [
    {
      question: "É para quem?",
      answer: "Donos de negócio, autônomos e vendedores com boa oferta, mas baixa conversão.",
    },
    {
      question: "Quanto tempo?",
      answer: "4 encontros × 60min, com tarefas curtas entre sessões.",
    },
    {
      question: "Funciona para meu nicho?",
      answer: "Sim. Adaptamos perguntas, pitch e objeções ao seu mercado já na 1ª sessão.",
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section - Upgraded */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30 mb-8">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                  Mentoria Direto ao Ponto
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                De "falo demais e não vendo" para{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">"pergunto certo e fecho"</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                em 4 encontros — sem teoria, só prática
              </p>
            </div>

            {/* Mentor Card */}
            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-primary rounded-2xl blur opacity-25"></div>
                <img 
                  src={darcioImg}
                  alt="Darcio Galaverna"
                  className="relative rounded-2xl w-full h-auto shadow-2xl"
                />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold mb-2">Darcio Galaverna</h3>
                  <p className="text-xl text-primary font-semibold">Mentor de Vendas</p>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  25+ anos de chão de vendas. Zero teoria infinita — só o que fecha. 
                  1ª sessão é diagnóstico cirúrgico.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  {results.map((result, idx) => (
                    <div key={idx} className="text-center p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50">
                      <result.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{result.value}</div>
                      <div className="text-xs text-muted-foreground">{result.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section - Enhanced */}
      <section className="py-12 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-xl">
          <Card className="border-primary/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl mb-2">Garanta sua vaga agora</CardTitle>
              <CardDescription className="text-base">
                Preencha e agende seu horário. <span className="text-primary font-semibold">Vagas limitadas.</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-base">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-base">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="voce@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-base">WhatsApp (com DDD)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 9 9999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
                
                <Button type="submit" className="w-full h-12 text-lg" size="lg">
                  Quero a mentoria
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => window.open("https://calendly.com/darciog-orbitha-io/nova-reuniao", "_blank")}
                >
                  Agendar agora
                </Button>
                
                <p className="text-xs text-center text-muted-foreground pt-2">
                  Ao enviar, você concorda com nossa política de privacidade.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sessions Section - Premium Design */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            O que você vai <span className="text-primary">dominar</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {sessions.map((session, index) => (
              <Card key={index} className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-border/50 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${session.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardHeader className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <session.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{session.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">{session.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Premium */}
      <section className="py-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Plano e Investimento</h2>
            <p className="text-lg text-muted-foreground">Transforme seu jeito de vender em 30 dias</p>
          </div>
          
          <Card className="border-2 border-primary shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-3xl" />
            
            <CardHeader className="text-center relative">
              <div className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-4">
                MAIS POPULAR
              </div>
              <CardTitle className="text-3xl mb-4">Individual Intensivo 1:1</CardTitle>
              <div className="mb-4">
                <span className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">R$ 997</span>
                <p className="text-muted-foreground mt-2">à vista (Pix/Cartão)</p>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className="w-full h-14 text-lg"
                size="lg"
                onClick={() => window.open("https://wa.me/5513991497873?text=Quero participar da Mentoria Direto ao Ponto", "_blank")}
              >
                Garantir minha vaga
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                ✅ Garantia de 7 dias • ✅ Suporte total durante a mentoria
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas rápidas</h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fixed Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-40">
        <Button 
          className="w-full h-14 text-lg shadow-2xl"
          size="lg"
          onClick={() => window.open("https://wa.me/5513991497873?text=Quero participar da Mentoria Direto ao Ponto", "_blank")}
        >
          Garantir minha vaga
        </Button>
      </div>
    </div>
  );
};

export default Mentoria;
