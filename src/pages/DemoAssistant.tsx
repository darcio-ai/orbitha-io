import { useEffect, useState } from "react";
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

/**
 * Mini-fluxos de demo por assistente.
 * Cada item do array é uma função que gera resposta para aquele "passo" (step).
 * Temos 5 passos (0 a 4).
 */
const DEMO_SCRIPTS: Record<string, Array<(input: string) => string>> = {
  financeiro: [
    (input) =>
      `Show. Pelo que você disse, o primeiro passo é mapear renda e gastos. Você sabe hoje quanto sobra no mês (mesmo que aproximado)?`,
    (input) =>
      `Boa. Com isso já dá pra montar um orçamento simples e definir prioridades. Sua maior dor agora é: dívidas, reserva de emergência ou investir?`,
    (input) =>
      `Perfeito. Dependendo disso, a estratégia muda bastante. Você tem alguma dívida com juros altos (cartão/cheque especial)?`,
    (input) =>
      `Entendi. No plano completo eu monto um diagnóstico com score patrimonial, metas e plano de ação. Quer destravar para eu puxar isso com você?`,
    (input) =>
      `Top. Se você me passar renda média e gastos fixos, eu monto a primeira versão do seu plano financeiro. Quer continuar no Orbitha Suite?`,
  ],

  business: [
    (input) => `Entendi. Pra clarear o cenário, me diz: qual sua receita média mensal e seus principais custos hoje?`,
    (input) =>
      `Boa. Com isso a gente calcula margem e ponto de equilíbrio. Hoje você sabe sua margem bruta aproximada?`,
    (input) =>
      `Perfeito. Outro ponto chave é o fluxo de caixa. Você costuma ter “sobra” no fim do mês ou aperta antes de receber?`,
    (input) =>
      `No plano completo eu te entrego uma planilha/rotina simples + plano de ação de caixa, precificação e obrigações. Quer destravar?`,
    (input) =>
      `Se você quiser, posso montar seu checklist de obrigações mensais e calendário financeiro. Quer continuar na Suite?`,
  ],

  vendas: [
    (input) => `Legal. Pra melhorar vendas rápido: qual seu produto/serviço e ticket médio?`,
    (input) => `Boa. Hoje seu maior gargalo é gerar leads, qualificar ou fechar?`,
    (input) => `Entendi. A partir disso, dá pra ajustar seu funil e script. Você usa CRM? Se sim, qual?`,
    (input) =>
      `No Growth Pack eu monto rotina comercial, scripts e KPIs semanais. Quer destravar pra eu te entregar um plano?`,
    (input) =>
      `Me diga seu ciclo de vendas (quantos dias do primeiro contato até fechar) e eu sugiro ajustes no funil. Quer seguir no Growth?`,
  ],

  marketing: [
    (input) =>
      `Show. Seu negócio vende mais pra PF ou PJ? E qual canal você usa hoje (Instagram, tráfego pago, WhatsApp etc.)?`,
    (input) => `Boa. Hoje sua maior dor é atrair mais gente ou converter melhor o que já chega?`,
    (input) => `Entendi. Você já tem um ICP definido (cliente ideal)? Se tiver, descreve em 1 frase.`,
    (input) =>
      `No Growth Pack eu monto seu funil, calendário de conteúdo e copies iniciais. Quer destravar o acesso completo?`,
    (input) =>
      `Se você me disser seu principal produto e diferencial, eu te devolvo 3 ângulos de campanha. Quer continuar no Growth?`,
  ],

  suporte: [
    (input) =>
      `Entendi. Qual tipo de atendimento é mais comum hoje? (dúvidas, suporte técnico, vendas, agendamentos...)`,
    (input) => `Boa. Em média, quantas conversas por dia vocês lidam no WhatsApp?`,
    (input) =>
      `Perfeito. No plano completo eu crio fluxos, respostas prontas e métricas. Quer destravar o Support Assistant?`,
    (input) => `Se você me mandar 5 perguntas frequentes, eu já monto um fluxo inicial. Quer seguir no Growth Pack?`,
    (input) => `Com acesso completo, dá pra integrar com seu WhatsApp/CRM. Quer continuar?`,
  ],

  viagens: [
    (input) => `Top. Me fala destino, datas aproximadas e estilo de viagem (econômica, confortável, luxo).`,
    (input) => `Boa. Quantos dias no total e quantas pessoas vão viajar?`,
    (input) => `Entendi. Prefere base fixa com bate-voltas ou trocar de cidade?`,
    (input) => `No plano completo eu monto roteiro dia a dia com custos e logística. Quer destravar?`,
    (input) => `Se você me disser orçamento aproximado, eu ajusto o roteiro pro seu bolso. Quer seguir na Suite?`,
  ],

  fitness: [
    (input) =>
      `Beleza. Qual seu objetivo principal (emagrecer, ganhar massa, condicionamento) e quantos dias por semana você treina?`,
    (input) => `Boa. Você treina em academia, casa ou ao ar livre?`,
    (input) => `Entendi. Tem alguma limitação física ou dor recorrente que eu preciso considerar?`,
    (input) => `No plano completo eu monto treino + nutrição + rotina semanal. Quer destravar o acesso completo?`,
    (input) =>
      `Se você me disser seu peso/altura e rotina, eu te devolvo um plano inicial personalizado. Quer continuar na Suite?`,
  ],
};

function getDemoReply(assistantId: string, userMessage: string, step: number) {
  const script = DEMO_SCRIPTS[assistantId] || [];
  const fn = script[step];
  return fn ? fn(userMessage) : "No plano completo eu continuo com você daqui. Quer destravar?";
}

const DemoAssistant = () => {
  const { assistantId } = useParams();
  const navigate = useNavigate();

  const assistant = assistantId ? ASSISTANT_DEMOS[assistantId] : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // ✅ força 5 interações por assistente
  const effectiveLimit = 5;

  useEffect(() => {
    if (!assistant) {
      navigate("/assistentes");
      return;
    }

    setMessages([{ text: assistant.openingMessage, sender: "assistant" }]);

    const storageKey = `demoCount_${assistantId}`;
    const stored = localStorage.getItem(storageKey);
    const count = stored ? parseInt(stored, 10) : 0;

    setMessageCount(count);
    if (count >= effectiveLimit) setIsLimitReached(true);
  }, [assistant, assistantId, navigate]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !assistant || isLimitReached) return;

    const storageKey = `demoCount_${assistantId}`;
    const currentCount = messageCount;

    // adiciona mensagem do usuário
    const userMessage: Message = { text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // calcula resposta variável pelo passo atual
    const replyText = getDemoReply(assistantId!, userMessage.text, currentCount);

    // incrementa contador
    const newCount = currentCount + 1;
    setMessageCount(newCount);
    localStorage.setItem(storageKey, newCount.toString());

    // resposta do assistente (simulada, mas diferente)
    setTimeout(() => {
      const assistantMessage: Message = {
        text: replyText,
        sender: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 600);

    // check limite
    if (newCount >= effectiveLimit) {
      setIsLimitReached(true);
    }
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
              {/* aviso fixo da demo */}
              {!isLimitReached && (
                <p className="text-xs text-muted-foreground mb-3">
                  Demo limitada. No plano completo, respostas personalizadas e ilimitadas.
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
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
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
