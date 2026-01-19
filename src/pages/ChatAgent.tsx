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
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { StyleSelector, type CommunicationStyle } from "@/components/chat/StyleSelector";
import { ImageUploadButton } from "@/components/chat/ImageUploadButton";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface Conversation {
  id: string;
  title: string | null;
  style: string;
  created_at: string;
  updated_at: string;
}

// Fitness agent URLs that should use chat-fitness endpoint
const FITNESS_AGENT_URLS = ['fitness', 'agente-fitness', 'assistente-fitness'];

const ChatAgent = () => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<CommunicationStyle>('normal');
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Check if this is a fitness agent
  const isFitnessAgent = url ? FITNESS_AGENT_URLS.includes(url.toLowerCase()) : false;

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userId && url) {
      loadAgent();
    }
  }, [userId, url]);

  useEffect(() => {
    if (agent && userId) {
      loadConversations();
    }
  }, [agent, userId]);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages();
      // Update selected style from conversation
      const conv = conversations.find(c => c.id === currentConversationId);
      if (conv && conv.style) {
        setSelectedStyle(conv.style as CommunicationStyle);
      }
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

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

  const loadConversations = async () => {
    if (!userId || !agent) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .eq('agent_id', agent.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);

      // Auto-select the most recent conversation or create new one
      if (data && data.length > 0 && !currentConversationId) {
        setCurrentConversationId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async () => {
    if (!userId || !currentConversationId) return;

    try {
      const { data, error } = await supabase
        .from('agent_messages')
        .select('*')
        .eq('conversation_id', currentConversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      setTimeout(() => scrollToBottom(), 300);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewConversation = async () => {
    if (!userId || !agent) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          agent_id: agent.id,
          style: selectedStyle,
        })
        .select()
        .single();

      if (error) throw error;
      
      setConversations(prev => [data, ...prev]);
      setCurrentConversationId(data.id);
      setMessages([]);
      
      // Close sidebar on mobile after creating
      if (isMobile) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar nova conversa.",
        variant: "destructive",
      });
    }
  };

  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setConversations(prev => prev.filter(c => c.id !== id));
      
      if (currentConversationId === id) {
        const remaining = conversations.filter(c => c.id !== id);
        setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
      }

      toast({
        title: "Conversa excluída",
        description: "A conversa foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conversa.",
        variant: "destructive",
      });
    }
  };

  const handleStyleChange = async (style: CommunicationStyle) => {
    setSelectedStyle(style);
    
    // Update conversation style if one exists
    if (currentConversationId) {
      await supabase
        .from('conversations')
        .update({ style })
        .eq('id', currentConversationId);
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || !agent || !userId || isSending) return;

    const userMessage = input.trim();
    const imageToSend = selectedImage;
    setInput("");
    setSelectedImage(null);
    setIsSending(true);
    setStreamingMessage("");

    // Create conversation if none exists
    let conversationId = currentConversationId;
    if (!conversationId) {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .insert({
            user_id: userId,
            agent_id: agent.id,
            style: selectedStyle,
            title: (userMessage || 'Análise de refeição').substring(0, 50),
          })
          .select()
          .single();

        if (error) throw error;
        conversationId = data.id;
        setCurrentConversationId(data.id);
        setConversations(prev => [data, ...prev]);
      } catch (error) {
        console.error('Error creating conversation:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar a conversa.",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }
    }

    // Add user message optimistically
    const tempUserMessage: Message = {
      id: crypto.randomUUID(),
      message: imageToSend ? (userMessage || '📷 Imagem enviada') : userMessage,
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

      // Choose endpoint based on agent type
      const endpoint = isFitnessAgent ? 'chat-fitness' : 'chat-agent';
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            agentId: agent.id,
            message: userMessage,
            imageBase64: imageToSend,
            conversationId: conversationId,
            style: selectedStyle,
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
                // Remove JSON blocks in real-time to avoid showing code to user
                const cleanMessage = fullMessage.replace(/```json\s*[\s\S]*?```\s*/g, '').trim();
                setStreamingMessage(cleanMessage);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }

      // Reload messages to get the saved response
      await loadMessages();
      // Reload conversations to update the title/updated_at
      await loadConversations();
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
      <div className="flex items-center justify-center min-h-screen-dynamic">
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
    <div className="flex h-screen-dynamic bg-background">
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewConversation={createNewConversation}
          onSelectConversation={selectConversation}
          onDeleteConversation={deleteConversation}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header - Compact on mobile */}
        <div className="border-b border-primary/20 bg-gradient-to-r from-background via-card to-background safe-top">
          <div className="px-3 py-3 sm:px-4 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                {/* Mobile sidebar trigger */}
                {isMobile && (
                  <ConversationSidebar
                    conversations={conversations}
                    currentConversationId={currentConversationId}
                    onNewConversation={createNewConversation}
                    onSelectConversation={selectConversation}
                    onDeleteConversation={deleteConversation}
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
                    isMobile={true}
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/dashboard/agents')}
                  className="shrink-0 h-10 w-10 touch-target"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                {agent.avatar_url && (
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary blur-sm opacity-75"></div>
                    <img
                      src={agent.avatar_url}
                      alt={agent.name}
                      className="relative h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-primary/50"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-lg font-semibold text-foreground truncate">{agent.name}</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">Assistente Financeiro</p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <StyleSelector
                  selectedStyle={selectedStyle}
                  onStyleChange={handleStyleChange}
                  disabled={isSending}
                />
                <div className="hidden sm:flex flex-col items-center px-3 py-1.5 rounded-md border border-primary/30 bg-primary/10">
                  <span className="text-xs font-bold text-primary">100%</span>
                  <span className="text-[10px] text-primary/80">ATIVO</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-3 sm:px-4 mobile-scroll" ref={scrollRef}>
          <div className="max-w-4xl mx-auto py-4 sm:py-6 space-y-3 sm:space-y-4">
            {allMessages.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <h2 className="text-lg sm:text-2xl font-semibold mb-2 text-foreground">
                  Olá! Sou {agent.name}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {agent.description || "Como posso ajudar você hoje?"}
                </p>
              </div>
            ) : (
              allMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 sm:gap-3 ${msg.writer === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.writer === 'assistant' && agent.avatar_url && (
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary blur-sm opacity-60"></div>
                      <img
                        src={agent.avatar_url}
                        alt={agent.name}
                        className="relative h-7 w-7 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-primary/40"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[88%] sm:max-w-[75%] rounded-xl sm:rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 ${
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
                              <h3 {...props} className="text-base sm:text-lg font-bold mt-4 mb-2" />
                            ),
                            hr: ({ node, ...props }) => (
                              <hr {...props} className="my-4 border-border" />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul {...props} className="list-none space-y-1 my-2" />
                            ),
                            p: ({ node, ...props }) => (
                              <p {...props} className="text-[0.9375rem] sm:text-[0.875rem] leading-relaxed mb-2" />
                            ),
                          }}
                        >
                          {msg.message}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap break-words text-[0.9375rem] sm:text-[0.875rem] leading-relaxed">{msg.message}</p>
                    )}
                  </div>
                  {msg.writer === 'user' && (
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent blur-sm opacity-60"></div>
                      <div className="relative h-7 w-7 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/40 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Input - Optimized for mobile */}
        <div className="border-t bg-card safe-bottom">
          <div className="max-w-4xl mx-auto px-3 py-3 sm:px-4 sm:py-4">
            <div className="flex gap-2 items-end">
              {isFitnessAgent && (
                <ImageUploadButton
                  onImageSelect={setSelectedImage}
                  selectedImage={selectedImage}
                  disabled={isSending}
                />
              )}
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isFitnessAgent ? "Digite ou envie foto..." : "Digite sua mensagem..."}
                className="min-h-[48px] max-h-[120px] sm:max-h-[200px] resize-none flex-1 text-base rounded-xl"
                disabled={isSending}
              />
              <Button
                onClick={sendMessage}
                disabled={(!input.trim() && !selectedImage) || isSending}
                className="shrink-0 h-12 w-12 p-0 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 touch-target rounded-xl"
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
    </div>
  );
};

export default ChatAgent;