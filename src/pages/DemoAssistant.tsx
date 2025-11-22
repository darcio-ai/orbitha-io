import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";
import { ASSISTANT_DEMOS } from "@/config/assistantDemos";

interface Message {
  text: string;
  sender: "user" | "assistant";
}

const DemoAssistant = () => {
  const { assistantId } = useParams();
  const navigate = useNavigate();

  const assistant = assistantId ? ASSISTANT_DEMOS[assistantId] : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ demo real: 5 interações por assistente
  const effectiveLimit = 5;

  // pra autoscroll no chat
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isLoading]);

  useEffect(() => {
    if (!assistant) {
      navigate("/assistentes");
      return;
    }

    // Mensagem inicial do assistente
    setMessages([{ text: assistant.openingMessage, sender: "assistant" }]);

    // Carregar contagem do localStorage
    const storageKey = `demoCount_${assistantId}`;
    const stored = localStorage.getItem(storageKey);
    const count = stored ? parseInt(stored, 10) : 0;

    setMessageCount(count);
    if (count >= effectiveLimit) setIsLimitReached(true);
  }, [assistant, assistantId, navigate]);

  async function callDemoLLM(userText: string, history: Message[]) {
    // manda só um histórico curtinho pra reduzir tokens
    const trimmedHistory = history.slice(-6);

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/demo-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        assistantId,
        userText,
        history: trimmedHistory,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Erro ao gerar resposta");
    }

    const data = await res.json();
    return data.reply as string;
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !assistant || isLimitReached || isLoading) return;

    const storageKey = `demoCount_${assistantId}`;
    const currentCount = messageCount;

    // adiciona msg do usuário
    const userMessage: Message = { text: inputValue, sender: "user" };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue("");

    // incrementa contador
    const newCount = currentCount + 1;
    setMessageCount(newCount);
    localStorage.setItem(storageKey, newCount.toString());

    setIsLoading(true);

    try {
      const replyText = await callDemoLLM(userMessage.text, nextMessages);

      setMessages((prev) => [...prev, { text: replyText, sender: "assistant" }]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Tive um probleminha pra responder agora. Tenta de novo em alguns segundos 🙂",
          sender: "assistant",
        },
      ]);
    } finally {
      setIsLoading(false);
    }

    // check limite
    if (newCount >= effectiveLimit) setIsLimitReached(true);
  };

  if (!assistant) return null;

  const planName = assistant.planFocus === "growth" ? "Growth Pack" : "Orbitha Suite";

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/assistentes")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{assistant.name}</h1>
              <p className="text-muted-foreground">
                Demo gratuita - {Math.max(effectiveLimit - messageCount, 0)} mensagens restantes
              </p>
            </div>
          </div>

          {/* Chat Card */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Chat de Demonstração</CardTitle>
            </CardHeader>
            <CardContent>
              {!isLimitReached && (
                <p className="text-xs text-muted-foreground mb-3">
                  Demo real e limitada. No plano completo, respostas personalizadas e ilimitadas.
                </p>
              )}

              {/* Messages */}
              <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                      }`}
                    >
                      <p className="text-sm ReactMarkdown whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-4 bg-card border border-border">
                      <p className="text-sm text-muted-foreground">digitando…</p>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Paywall */}
              {isLimitReached && (
                <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">Você chegou ao limite da demo</h3>
                    <p className="text-muted-foreground mb-6">
                      Este assistente faz parte do plano <strong>{planName}</strong>. Destrave acesso completo com 7
                      dias de garantia total.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button size="lg" onClick={() => navigate(`/planos?focus=${assistant.planFocus}`)}>
                        Assinar agora
                      </Button>
                      <Button size="lg" variant="outline" onClick={() => navigate("/assistentes")}>
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button onClick={handleSendMessage} size="icon" disabled={isLoading}>
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
