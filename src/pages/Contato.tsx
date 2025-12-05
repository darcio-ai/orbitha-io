import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  MessageSquare, 
  Mail, 
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

  const validateForm = (): string | null => {
    if (!formData.name.trim() || formData.name.length > 100) {
      return "Nome é obrigatório (máximo 100 caracteres)";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email) || formData.email.length > 255) {
      return "Email inválido";
    }
    if (formData.company && formData.company.length > 100) {
      return "Nome da empresa muito longo (máximo 100 caracteres)";
    }
    if (formData.phone && formData.phone.length > 20) {
      return "Telefone muito longo (máximo 20 caracteres)";
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      return "Mensagem muito curta (mínimo 10 caracteres)";
    }
    if (formData.message.length > 1000) {
      return "Mensagem muito longa (máximo 1000 caracteres)";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Erro de validação",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim() || null,
          phone: formData.phone.trim() || null,
          message: formData.message.trim()
        }
      });

      if (error) {
        throw error;
      }

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
    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      description: "contato@orbitha.io",
      action: "Enviar email",
      link: "mailto:contato@orbitha.io"
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
    "Proposta personalizada",
    "Suporte especializado"
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30 mb-6">
              <MessageSquare className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                Entre em Contato
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-left">
              Vamos <span className="bg-gradient-primary bg-clip-text text-transparent">conversar?</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl text-left">
              Me conta: o que tá tirando o seu sono ou te dando dor de cabeça aí no dia a dia? 
              Vamos descobrir juntos como a automação pode te ajudar a resolver isso.
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
                        maxLength={100}
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
                        maxLength={255}
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
                        maxLength={100}
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
                        maxLength={20}
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
                      minLength={10}
                      maxLength={1000}
                      placeholder="Conte sobre o seu desafio ou dúvida..."
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {formData.message.length}/1000
                    </p>
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
            {/* WhatsApp CTA with Dora */}
            <Card className="bg-gradient-primary text-primary-foreground overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <CardTitle className="text-2xl flex items-center mb-4">
                    <MessageSquare className="mr-3 h-8 w-8" />
                    Fale com a Dora agora
                  </CardTitle>
                  <p className="text-primary-foreground/80 mb-6">
                    Converse diretamente com nossa IA especialista
                  </p>
                  <Button variant="secondary" size="lg" className="w-full" asChild>
                    <a
                      href="https://wa.me/5513991497873?text=Oi! Quero conhecer as soluções da Orbitha"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Iniciar conversa no WhatsApp
                    </a>
                  </Button>
                </div>
                <div className="hidden md:flex items-center justify-center p-4">
                  <img 
                    src="/img/dora-avatar.png" 
                    alt="Dora - IA Especialista da Orbitha"
                    className="w-48 h-48 object-cover rounded-full border-4 border-primary-foreground/20 shadow-lg"
                  />
                </div>
              </div>
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
