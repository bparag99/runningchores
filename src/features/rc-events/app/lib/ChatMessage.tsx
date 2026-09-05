import { Sparkles } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  isAI: boolean;
}

export function ChatMessage({ content, isAI }: ChatMessageProps) {
  if (isAI) {
    return (
      <div className="flex items-start gap-3 max-w-[80%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ai-primary flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div className="bg-ai-background border border-ai-border rounded-2xl rounded-bl-sm px-4 py-3">
          <p className="text-base text-foreground">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="bg-brand-primary text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%]">
        <p className="text-base">{content}</p>
      </div>
    </div>
  );
}
