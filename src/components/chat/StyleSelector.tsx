import { Check, Settings2, BookOpen, Zap, Lightbulb, Briefcase, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type CommunicationStyle = 'normal' | 'aprendizado' | 'conciso' | 'explicativo' | 'formal';

interface StyleOption {
  value: CommunicationStyle;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const styleOptions: StyleOption[] = [
  {
    value: 'normal',
    label: 'Normal',
    description: 'Respostas balanceadas',
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    value: 'aprendizado',
    label: 'Aprendizado',
    description: 'Didático, passo a passo',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    value: 'conciso',
    label: 'Conciso',
    description: 'Direto ao ponto',
    icon: <Zap className="h-4 w-4" />,
  },
  {
    value: 'explicativo',
    label: 'Explicativo',
    description: 'Detalhado com contexto',
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    value: 'formal',
    label: 'Formal',
    description: 'Tom profissional',
    icon: <Briefcase className="h-4 w-4" />,
  },
];

interface StyleSelectorProps {
  selectedStyle: CommunicationStyle;
  onStyleChange: (style: CommunicationStyle) => void;
  disabled?: boolean;
}

export function StyleSelector({ selectedStyle, onStyleChange, disabled }: StyleSelectorProps) {
  const currentStyle = styleOptions.find(s => s.value === selectedStyle) || styleOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2 bg-primary/10 border-primary/30 hover:bg-primary/20 hover:border-primary/50 text-foreground"
        >
          <Settings2 className="h-4 w-4 text-zinc-400" />
          <span className="hidden sm:inline">{currentStyle.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[220px] bg-popover border-border"
      >
        {styleOptions.map((style) => (
          <DropdownMenuItem
            key={style.value}
            onClick={() => onStyleChange(style.value)}
            className={cn(
              "flex items-center gap-3 py-3 cursor-pointer",
              "hover:bg-accent focus:bg-accent",
              selectedStyle === style.value && "bg-accent"
            )}
          >
            <div className="text-muted-foreground">{style.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{style.label}</p>
              <p className="text-xs text-muted-foreground">{style.description}</p>
            </div>
            {selectedStyle === style.value && (
              <Check className="h-4 w-4 text-blue-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
