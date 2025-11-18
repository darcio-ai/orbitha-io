import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send, ArrowLeft, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  message: string;
  writer: 'user' | 'assistant';
  created_at: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  prompt: string;
  avatar_url: string;
  model: string;
  temperature: number;
}

const ChatAgent = () => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [streamingMessage, setStreamingMessage] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userId && url) {
      loadAgent();
      loadMessages();
    }
  }, [userId, url]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setUserId(session.user.id);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  const loadAgent = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('url', url)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      if (!data) {
        toast({
          title: "Agente não encontrado",
          description: "Este agente não existe ou está inativo.",
          variant: "destructive",
        });
        navigate('/dashboard/agents');
        return;
      }

      setAgent(data);
    } catch (error) {
      console.error('Error loading agent:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o agente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!userId) return;

    try {
      const { data: agentData } = await supabase
        .from('agents')
        .select('id')
        .eq('url', url)
        .single();

      if (!agentData) return;

      // Check if this is a fresh login by checking sessionStorage
      const isNewSession = !sessionStorage.getItem(`chat_session_${agentData.id}`);
      
      if (isNewSession) {
        // Clear old messages from database on fresh login
        await supabase
          .from('agent_messages')
          .delete()
          .eq('user_id', userId)
          .eq('agent_id', agentData.id);
        
        // Mark this session as active
        sessionStorage.setItem(`chat_session_${agentData.id}`, 'active');
        
        // No messages to load since we cleared them
        setMessages([]);
        setTimeout(() => scrollToBottom(), 300);
        return;
      }

      // Load existing messages from current session
      const { data, error } = await supabase
        .from('agent_messages')
        .select('*')
        .eq('user_id', userId)
        .eq('agent_id', agentData.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      
      // Scroll to bottom after messages load
      setTimeout(() => scrollToBottom(), 300);

      // Check if should send continuation message
      if (data && data.length > 0) {
        const lastMessage = data[data.length - 1];
        if (lastMessage.writer === 'user') {
          // Last message was from user, send continuation
          setTimeout(() => {
            sendContinuationMessage(agentData.id);
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendContinuationMessage = async (agentId: string) => {
    if (!userId) return;
    
    setIsSending(true);
    setStreamingMessage("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-agent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            agentId: agentId,
            message: "Vamos continuar de onde paramos?",
            userId: userId,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      let fullMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullMessage += parsed.content;
                setStreamingMessage(fullMessage);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }

      // Reload messages to get the saved response
      await loadMessages();
      setStreamingMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !agent || !userId || isSending) return;

    const userMessage = input.trim();
    setInput("");
    setIsSending(true);
    setStreamingMessage("");

    // Add user message optimistically
    const tempUserMessage: Message = {
      id: crypto.randomUUID(),
      message: userMessage,
      writer: 'user',
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-agent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            agentId: agent.id,
            message: userMessage,
            userId: userId,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      let fullMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullMessage += parsed.content;
                setStreamingMessage(fullMessage);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }

      // Reload messages to get the saved response
      await loadMessages();
      setStreamingMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!agent) return null;

  const allMessages = [...messages];
  if (streamingMessage) {
    allMessages.push({
      id: 'streaming',
      message: streamingMessage,
      writer: 'assistant',
      created_at: new Date().toISOString(),
    });
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-primary/20 bg-gradient-to-r from-background via-card to-background">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard/agents')}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {agent.avatar_url && (
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary blur-sm opacity-75"></div>
                  <img
                    src={agent.avatar_url}
                    alt={agent.name}
                    className="relative h-12 w-12 rounded-full object-cover border-2 border-primary/50"
                  />
                </div>
              )}
              <div>
                <h1 className="text-lg font-semibold text-foreground">{agent.name}</h1>
                <p className="text-sm text-muted-foreground">Assistente Financeiro</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col items-center px-3 py-1.5 rounded-md border border-primary/30 bg-primary/10">
                <span className="text-xs font-bold text-primary">100%</span>
                <span className="text-[10px] text-primary/80">ATIVO</span>
              </div>
              <div className="flex flex-col items-center px-3 py-1.5 rounded-md border border-accent/30 bg-accent/10">
                <span className="text-xs font-bold text-accent">24/7</span>
                <span className="text-[10px] text-accent/80">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 container max-w-4xl mx-auto px-4" ref={scrollRef}>
        <div className="py-6 space-y-4">
          {allMessages.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2 text-foreground">
                Olá! Sou {agent.name}
              </h2>
              <p className="text-muted-foreground">
                {agent.description || "Como posso ajudar você hoje?"}
              </p>
            </div>
          ) : (
            allMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.writer === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.writer === 'assistant' && agent.avatar_url && (
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary blur-sm opacity-60"></div>
                    <img
                      src={agent.avatar_url}
                      alt={agent.name}
                      className="relative h-10 w-10 rounded-full object-cover border-2 border-primary/40"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-3 ${
                    msg.writer === 'user'
                      ? 'bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 text-foreground'
                      : 'bg-gradient-to-br from-muted to-secondary border border-border/50 text-foreground'
                  }`}
                >
                  {msg.writer === 'assistant' ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              className="text-primary hover:text-primary/80 underline font-semibold"
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 {...props} className="text-lg font-bold mt-4 mb-2" />
                          ),
                          hr: ({ node, ...props }) => (
                            <hr {...props} className="my-4 border-border" />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul {...props} className="list-none space-y-1 my-2" />
                          ),
                          p: ({ node, ...props }) => (
                            <p {...props} className="text-[0.875rem] leading-relaxed mb-2" />
                          ),
                        }}
                      >
                        {msg.message}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words text-[0.875rem] leading-relaxed">{msg.message}</p>
                  )}
                </div>
                {msg.writer === 'user' && (
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent blur-sm opacity-60"></div>
                    <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/40 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="min-h-[60px] max-h-[200px] resize-none"
              disabled={isSending}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isSending}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAgent;