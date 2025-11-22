import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";
import { ASSISTANT_DEMOS } from "@/config/assistantDemos";

interface Message {
  text: string;
  sender: 'user' | 'assistant';
}

const DemoAssistant = () => {
  const { assistantId } = useParams();
  const navigate = useNavigate();
  
  const assistant = assistantId ? ASSISTANT_DEMOS[assistantId] : null;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  useEffect(() => {
    // Redirecionar se assistente não existe
    if (!assistant) {
      navigate("/assistentes");
      return;
    }

    // Carregar mensagem de abertura
    setMessages([
      { text: assistant.openingMessage, sender: 'assistant' }
    ]);

    // Carregar contagem do localStorage
    const storageKey = `demoCount_${assistantId}`;
    const stored = localStorage.getItem(storageKey);
    const count = stored ? parseInt(stored, 10) : 0;
    setMessageCount(count);
    
    if (count >= assistant.demoLimit) {
      setIsLimitReached(true);
    }
  }, [assistant, assistantId, navigate]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !assistant || isLimitReached) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Incrementar contador
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    const storageKey = `demoCount_${assistantId}`;
    localStorage.setItem(storageKey, newCount.toString());

    // Simular resposta do assistente
    setTimeout(() => {
      const assistantMessage: Message = {
        text: "Esta é uma demo simulada. No plano completo, você terá respostas personalizadas e ilimitadas com IA avançada.",
        sender: 'assistant'
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 800);

    // Verificar se atingiu limite
    if (newCount >= assistant.demoLimit) {
      setIsLimitReached(true);
    }
  };

  if (!assistant) return null;

  const planName = assistant.planFocus === 'growth' ? 'Growth Pack' : 'Orbitha Suite';

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/assistentes")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{assistant.name}</h1>
              <p className="text-muted-foreground">
                Demo gratuita - {assistant.demoLimit - messageCount} mensagens restantes
              </p>
            </div>
          </div>

          {/* Chat Card */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Chat de Demonstração</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Messages */}
              <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paywall */}
              {isLimitReached && (
                <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">
                      Você chegou ao limite da demo
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Este assistente faz parte do plano <strong>{planName}</strong>.
                      Destrave acesso completo com 7 dias de garantia total.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        size="lg"
                        onClick={() => navigate(`/planos?focus=${assistant.planFocus}`)}
                      >
                        Assinar agora
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate("/assistentes")}
                      >
                        Voltar aos assistentes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Input */}
              {!isLimitReached && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemoAssistant;
