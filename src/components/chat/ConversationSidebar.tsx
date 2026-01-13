import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  PanelLeftClose, 
  PanelLeft, 
  Plus, 
  MessageSquare, 
  Trash2,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string | null;
  style: string;
  created_at: string;
  updated_at: string;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

export function ConversationSidebar({
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  isOpen,
  onToggle,
  isMobile = false,
}: ConversationSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Hoje";
    if (diffDays === 2) return "Ontem";
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const getConversationTitle = (conv: Conversation) => {
    if (conv.title) {
      return conv.title.length > 28 ? conv.title.substring(0, 28) + '...' : conv.title;
    }
    return "Nova conversa";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-900">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <Button
          onClick={onNewConversation}
          className="w-full bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#FF6B35]/90 hover:to-[#F7931E]/90 text-white font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Conversa
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              Nenhuma conversa ainda
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all",
                  currentConversationId === conv.id
                    ? "bg-zinc-800 border-l-2 border-orange-500"
                    : "hover:bg-zinc-800/50"
                )}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectConversation(conv.id)}
              >
                <MessageSquare className="h-4 w-4 text-zinc-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">
                    {getConversationTitle(conv)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatDate(conv.updated_at)}
                  </p>
                </div>
                {(hoveredId === conv.id || currentConversationId === conv.id) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 text-center">
          {conversations.length} conversa{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );

  // Mobile: Use Sheet component
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onToggle}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 border-zinc-800">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Collapsible sidebar
  return (
    <div
      className={cn(
        "relative border-r border-zinc-800 transition-all duration-300",
        isOpen ? "w-[280px]" : "w-0"
      )}
    >
      {isOpen && <SidebarContent />}
      
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={cn(
          "absolute top-4 z-10 h-8 w-8 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800",
          isOpen ? "-right-4" : "left-2"
        )}
      >
        {isOpen ? (
          <PanelLeftClose className="h-4 w-4 text-zinc-400" />
        ) : (
          <PanelLeft className="h-4 w-4 text-zinc-400" />
        )}
      </Button>
    </div>
  );
}
