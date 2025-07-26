import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle
} from "lucide-react";

const Contato = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio do formulário
    setTimeout(() => {
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve. Obrigado!"
      });
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "WhatsApp",
      description: "Fale diretamente com a Dora",
      action: "Iniciar conversa",
      link: "https://wa.me/5583993095371?text=Oi! Quero conhecer as soluções da Orbitha"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      description: "darciog@orbitha.io",
      action: "Enviar email",
      link: "mailto:darciog@orbitha.io"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Horário de Atendimento",
      description: "Segunda a Sexta: 9h às 18h",
      action: "",
      link: ""
    }
  ];

  const benefits = [
    "Resposta em até 2 horas úteis",
    "Análise gratuita do seu processo",
    "Proposta personalizada",
    "Suporte especializado"
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <MessageSquare className="h-4 w-4 mr-2" />
              Entre em Contato
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Vamos <span className="bg-gradient-primary bg-clip-text text-transparent">conversar?</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Me conta: o que tá tirando o seu sono ou te dando dor de cabeça aí no dia a dia? 
              Vamos descobrir juntos como a automação pode te ajudar a resolver isso. 💡
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Envie sua mensagem</CardTitle>
                <p className="text-muted-foreground">
                  Preencha o formulário e entraremos em contato rapidamente
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Nome da sua empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">WhatsApp</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Conte sobre o seu desafio ou dúvida..."
                      rows={6}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar mensagem
                      </>
                    )}
                  </Button>
                </form>

                {/* Benefits */}
                <div className="mt-8 p-6 bg-secondary/30 rounded-lg">
                  <h4 className="font-semibold mb-4">O que você recebe:</h4>
                  <div className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & CTA */}
          <div className="space-y-8">
            {/* WhatsApp CTA */}
            <Card className="bg-gradient-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <MessageSquare className="mr-3 h-8 w-8" />
                  Fale com a Dora agora
                </CardTitle>
                <p className="text-primary-foreground/80">
                  Precisa de uma resposta rápida? Converse diretamente com nossa IA especialista
                </p>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" size="lg" className="w-full" asChild>
                  <a
                    href="https://wa.me/5583993095371?text=Oi! Quero conhecer as soluções da Orbitha"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Iniciar conversa no WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Contact Methods */}
            <div className="space-y-4">
              {contactInfo.map((contact, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <div className="text-primary-foreground">
                          {contact.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{contact.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {contact.description}
                        </p>
                        {contact.action && contact.link && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={contact.link}
                              target={contact.link.startsWith('http') ? '_blank' : undefined}
                              rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              {contact.action}
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Quick Links */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Dúvidas frequentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <p className="font-medium text-sm">Quanto tempo leva para implementar?</p>
                    <p className="text-xs text-muted-foreground mt-1">Entre 1-3 semanas dependendo da complexidade</p>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <p className="font-medium text-sm">Vocês oferecem suporte?</p>
                    <p className="text-xs text-muted-foreground mt-1">Sim, suporte completo durante e após a implementação</p>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <p className="font-medium text-sm">Como funciona o investimento?</p>
                    <p className="text-xs text-muted-foreground mt-1">Valores personalizados baseados nas suas necessidades</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;