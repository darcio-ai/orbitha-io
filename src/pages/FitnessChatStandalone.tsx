import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ImageUploadButton } from "@/components/chat/ImageUploadButton";
import { StyleSelector, CommunicationStyle } from "@/components/chat/StyleSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, Send, Loader2, BarChart3, Dumbbell, Flame } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  message: string;
  writer: "user" | "assistant";
  created_at: string;
}

interface Conversation {
  id: string;
  title: string | null;
  style: string;
  created_at: string;
  updated_at: string;
}

interface DailySummary {
  total_calories: number;
  meal_count: number;
  calorie_goal: number | null;
}

const FITNESS_AGENT_URL = "fitness";

// Function to clean JSON from messages - more robust patterns
const cleanJsonFromMessage = (text: string): string => {
  let cleaned = text;
  
  // Remove ```json ... ``` blocks (complete)
  cleaned = cleaned.replace(/```json[\s\S]*?```/g, '');
  
  // Remove incomplete ```json blocks
  cleaned = cleaned.replace(/```json[\s\S]*/g, '');
  
  // Remove JSON objects with meal_name/items/total_calories (multiline, more flexible)
  cleaned = cleaned.replace(/\{\s*"(?:action|meal_name)"[^{}]*"items"\s*:\s*\[[\s\S]*?\][^{}]*"total_calories"\s*:\s*\d+[^{}]*\}/g, '');
  
  // Remove JSON objects with "action": "save_meal" pattern (nested)
  cleaned = cleaned.replace(/\{\s*"action"\s*:\s*"save_meal"[\s\S]*?\]\s*,?\s*"total_calories"\s*:\s*\d+\s*\}/g, '');
  
  // Remove JSON with action: save_profile (can be multiline)
  cleaned = cleaned.replace(/\{\s*"action"\s*:\s*"save_profile"[\s\S]*?\}/g, '');
  
  // Remove JSON with action: save_weight
  cleaned = cleaned.replace(/\{\s*"action"\s*:\s*"save_weight"[\s\S]*?\}/g, '');
  
  // Remove any remaining standalone JSON objects that look like actions
  cleaned = cleaned.replace(/^\s*\{[^{}]*"action"[^{}]*\}\s*$/gm, '');
  
  // Remove lines that are only JSON fragments (brackets, commas, numbers)
  cleaned = cleaned.replace(/^\s*[\[\]{},"\d:]+\s*$/gm, '');
  
  // Clean up multiple newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned.trim();
};

const FitnessChatStandalone = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [agent, setAgent] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<CommunicationStyle>("normal");
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          localStorage.setItem('fitness-redirect', '/fitness/chat');
          navigate("/login");
          return;
        }
        setUserId(session.user.id);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        localStorage.setItem('fitness-redirect', '/fitness/chat');
        navigate("/login");
        return;
      }
      setUserId(session.user.id);
      loadAgent();
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (agent && userId) {
      loadConversations();
      loadDailySummary();
    }
  }, [agent, userId]);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleInputFocus = () => {
    // Scroll input into view when keyboard opens on mobile
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 300);
  };

  const loadDailySummary = async () => {
    if (!userId) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get daily summary
      const { data: summary } = await supabase.rpc('get_daily_summary', { 
        _date: today, 
        _user_id: userId 
      });
      
      // Get calorie goal from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('calorie_goal')
        .eq('id', userId)
        .single();
      
      if (summary && summary[0]) {
        setDailySummary({
          total_calories: summary[0].total_calories || 0,
          meal_count: summary[0].meal_count || 0,
          calorie_goal: profile?.calorie_goal || null
        });
      } else {
        setDailySummary({
          total_calories: 0,
          meal_count: 0,
          calorie_goal: profile?.calorie_goal || null
        });
      }
    } catch (error) {
      console.error('Error loading daily summary:', error);
    }
  };

  const loadAgent = async () => {
    try {
      const { data, error } = await supabase
        .from("agent_public_info")
        .select("*")
        .ilike("url", FITNESS_AGENT_URL)
        .single();

      if (error) throw error;
      setAgent(data);
    } catch (error) {
      console.error("Error loading agent:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o assistente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversations = async () => {
    if (!agent || !userId) return;

    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", userId)
        .eq("agent_id", agent.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);

      // Always create new conversation on access
      if (!currentConversationId) {
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            user_id: userId,
            agent_id: agent.id,
            style: currentStyle,
          })
          .select()
          .single();

        if (!createError && newConv) {
          const formattedConv = { ...newConv, style: newConv.style || 'normal' };
          setConversations([formattedConv, ...(data?.map(c => ({ ...c, style: c.style || 'normal' })) || [])]);
          setCurrentConversationId(formattedConv.id);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("agent_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Load conversation style
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation?.style && ['normal', 'aprendizado', 'conciso', 'explicativo', 'formal'].includes(conversation.style)) {
        setCurrentStyle(conversation.style as CommunicationStyle);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const createNewConversation = async () => {
    if (!agent || !userId) return;

    try {
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: userId,
          agent_id: agent.id,
          style: currentStyle,
        })
        .select()
        .single();

      if (error) throw error;
      
      const formattedConv = { ...data, style: data.style || 'normal' };
      setConversations([formattedConv, ...conversations]);
      setCurrentConversationId(formattedConv.id);
      setMessages([]);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await supabase.from("agent_messages").delete().eq("conversation_id", conversationId);
      await supabase.from("conversations").delete().eq("id", conversationId);
      
      setConversations(conversations.filter(c => c.id !== conversationId));
      
      if (currentConversationId === conversationId) {
        const remaining = conversations.filter(c => c.id !== conversationId);
        if (remaining.length > 0) {
          setCurrentConversationId(remaining[0].id);
        } else {
          createNewConversation();
        }
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleStyleChange = async (style: CommunicationStyle) => {
    setCurrentStyle(style);
    if (currentConversationId) {
      await supabase
        .from("conversations")
        .update({ style })
        .eq("id", currentConversationId);
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || !agent || !userId) return;

    const userMessage = input.trim();
    setInput("");
    setSelectedImage(null);
    setIsSending(true);
    setIsThinking(true);
    setStreamingMessage("");

    // Create conversation if none exists
    let convId = currentConversationId;
    if (!convId) {
      const { data: newConv, error: convError } = await supabase
        .from("conversations")
        .insert({
          user_id: userId,
          agent_id: agent.id,
          style: currentStyle,
        })
        .select()
        .single();

      if (convError) {
        toast({ title: "Erro", description: "Falha ao criar conversa.", variant: "destructive" });
        setIsSending(false);
        setIsThinking(false);
        return;
      }
      
      convId = newConv.id;
      setCurrentConversationId(convId);
      setConversations([newConv, ...conversations]);
    }

    // Save user message
    const { data: savedMessage, error: msgError } = await supabase
      .from("agent_messages")
      .insert({
        user_id: userId,
        agent_id: agent.id,
        conversation_id: convId,
        message: userMessage,
        writer: "user",
      })
      .select()
      .single();

    if (msgError) {
      toast({ title: "Erro", description: "Falha ao enviar mensagem.", variant: "destructive" });
      setIsSending(false);
      setIsThinking(false);
      return;
    }

    setMessages((prev) => [...prev, savedMessage]);

    // Update conversation title if first message
    if (messages.length === 0) {
      const title = userMessage.slice(0, 50) + (userMessage.length > 50 ? "..." : "");
      await supabase.from("conversations").update({ title }).eq("id", convId);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, title } : c))
      );
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-fitness`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            message: userMessage,
            agentId: agent.id,
            conversationId: convId,
            style: currentStyle,
            image: selectedImage,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullMessage = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setIsThinking(false);
                fullMessage += parsed.content;
                
                // Clean JSON from streaming message
                const displayMessage = cleanJsonFromMessage(fullMessage);
                setStreamingMessage(displayMessage);
              }
            } catch {}
          }
        }
      }

      // Clean final message
      const cleanMessage = cleanJsonFromMessage(fullMessage);

      // Save assistant message
      const { data: assistantMessage } = await supabase
        .from("agent_messages")
        .insert({
          user_id: userId,
          agent_id: agent.id,
          conversation_id: convId,
          message: cleanMessage,
          writer: "assistant",
        })
        .select()
        .single();

      if (assistantMessage) {
        setMessages((prev) => [...prev, assistantMessage]);
      }

      setStreamingMessage("");
      
      // Reload daily summary after message (might have logged a meal)
      loadDailySummary();
      
      // Update conversation timestamp
      await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erro",
        description: "Falha na comunicação com o assistente.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const ThinkingIndicator = () => (
    <div className="flex gap-2 sm:gap-3 justify-start">
      {agent?.avatar_url && (
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary blur-sm opacity-60 animate-pulse"></div>
          <img
            src={agent.avatar_url}
            alt={agent?.name}
            className="relative h-7 w-7 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-primary/40"
          />
        </div>
      )}
      <div className="max-w-[88%] sm:max-w-[75%] rounded-xl sm:rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-br from-muted to-secondary border border-border/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
          <span className="text-sm text-muted-foreground">Pensando...</span>
        </div>
      </div>
    </div>
  );

  // Calorie Progress Component
  const CalorieProgress = () => {
    if (!dailySummary) return null;
    
    const { total_calories, meal_count, calorie_goal } = dailySummary;
    const percentage = calorie_goal ? Math.min((total_calories / calorie_goal) * 100, 100) : 0;
    const remaining = calorie_goal ? Math.max(calorie_goal - total_calories, 0) : null;
    
    return (
      <div className="px-4 py-2 bg-primary/5 border-b border-border/30">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium">{total_calories} kcal</span>
              <span className="text-muted-foreground text-xs">({meal_count} refeições)</span>
            </div>
            {calorie_goal && (
              <span className="text-muted-foreground text-xs">
                {remaining && remaining > 0 ? `Faltam ${remaining} kcal` : 'Meta atingida! 🎉'}
              </span>
            )}
          </div>
          {calorie_goal && (
            <Progress 
              value={percentage} 
              className="h-2"
            />
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/fitness")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Dumbbell className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm sm:text-base">Fitness Coach</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StyleSelector selectedStyle={currentStyle} onStyleChange={handleStyleChange} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/fitness/dashboard")}
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Calorie Progress Bar */}
      <CalorieProgress />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={setCurrentConversationId}
          onNewConversation={createNewConversation}
          onDeleteConversation={deleteConversation}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.length === 0 && !streamingMessage && (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                    <Dumbbell className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Olá! Sou seu Fitness Coach</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Posso ajudar com treinos personalizados, análise de refeições (envie fotos!) e dicas de nutrição.
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 sm:gap-3 ${
                    message.writer === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.writer === "assistant" && agent?.avatar_url && (
                    <img
                      src={agent.avatar_url}
                      alt={agent?.name}
                      className="h-7 w-7 sm:h-10 sm:w-10 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-[88%] sm:max-w-[75%] rounded-xl sm:rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 ${
                      message.writer === "user"
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.writer === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.message}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base whitespace-pre-wrap">{message.message}</p>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && !streamingMessage && <ThinkingIndicator />}

              {streamingMessage && (
                <div className="flex gap-2 sm:gap-3 justify-start">
                  {agent?.avatar_url && (
                    <img
                      src={agent.avatar_url}
                      alt={agent?.name}
                      className="h-7 w-7 sm:h-10 sm:w-10 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div className="max-w-[88%] sm:max-w-[75%] rounded-xl sm:rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-muted">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {streamingMessage}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area - Sticky */}
          <div className="sticky bottom-0 border-t border-border/50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
            <div className="max-w-3xl mx-auto">
              {selectedImage && (
                <div className="mb-2 p-2 bg-muted rounded-lg flex items-center gap-2">
                  <img src={selectedImage} alt="Preview" className="h-12 w-12 object-cover rounded" />
                  <span className="text-sm text-muted-foreground">Imagem selecionada</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                  >
                    ✕
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <ImageUploadButton
                  onImageSelect={(base64) => setSelectedImage(base64)}
                  selectedImage={selectedImage}
                  disabled={isSending}
                />
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={handleInputFocus}
                  placeholder="Digite sua mensagem ou envie uma foto de refeição..."
                  disabled={isSending}
                  className="min-h-[44px] max-h-32 resize-none"
                  rows={1}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isSending || (!input.trim() && !selectedImage)}
                  size="icon"
                  className="shrink-0 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/30 py-2 text-center">
        <a 
          href="https://orbitha.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          por Orbitha.io
        </a>
      </footer>
    </div>
  );
};

export default FitnessChatStandalone;