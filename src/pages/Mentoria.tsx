import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Target, MessageSquare, FileText, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
    // Redireciona para WhatsApp
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
    },
    {
      icon: MessageSquare,
      title: "Qualificação (Sessão 2)",
      description: "Perguntas que descobrem dor em 10 min, decisores, urgência e orçamento.",
    },
    {
      icon: Sparkles,
      title: "Pitch & Objeções (Sessão 3)",
      description: "Pitch em 45–60s, respostas curtas a preço/tempo/\"tô vendo\" e ancoragem de valor.",
    },
    {
      icon: FileText,
      title: "Proposta & Follow-up (Sessão 4)",
      description: "Proposta simples com CTA claro, cadência de follow-up e plano de 30 dias.",
    },
  ];

  const benefits = [
    "4 encontros x 60min",
    "2 plantões extras de 30min",
    "Feedback direto por WhatsApp (seg–sex)",
    "Templates e checklists",
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
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Mentoria Direto ao Ponto
            </h1>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              De "falo demais e não vendo" para{" "}
              <span className="text-primary">"pergunto certo e fecho"</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-4">
              em 4 encontros — sem teoria, só prática
            </p>
            
            <p className="text-lg text-muted-foreground mb-8">
              por <span className="font-semibold text-foreground">Darcio Galaverna</span>
            </p>
            
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              25+ anos de chão de vendas. Zero teoria infinita — só o que fecha. 
              1ª sessão é diagnóstico cirúrgico.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Garanta sua vaga agora</CardTitle>
              <CardDescription>
                Preencha e agende seu horário. Vagas limitadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="voce@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">WhatsApp (com DDD)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 9 9999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  Quero a mentoria
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open("https://calendly.com/darciog-orbitha-io/nova-reuniao", "_blank")}
                >
                  Agendar agora
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Ao enviar, você concorda com nossa política de privacidade.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mentor Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Mentor com 25+ anos em vendas</h2>
          <p className="text-lg text-muted-foreground">
            Aprendido na rua, não no livro. O que fecha fica, o resto sai. 
            Sessões sem enrolação: cada encontro com objetivo e call to action claro.
          </p>
        </div>
      </section>

      {/* Sessions Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            {sessions.map((session, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <session.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{session.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{session.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Plano e Investimento</h2>
          </div>
          
          <Card className="border-primary">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Individual Intensivo 1:1</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 997</span>
                <p className="text-muted-foreground mt-2">à vista (Pix/Cartão)</p>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => window.open("https://wa.me/5513991497873?text=Quero participar da Mentoria Direto ao Ponto", "_blank")}
              >
                Garantir minha vaga
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas rápidas</h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mentoria;
