import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Calendar, Users, DollarSign, ThumbsUp, Phone } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAppData } from '../context/AppDataContext';
import { ChatMessage } from '../app/lib/ChatMessage';
import { QuickActionChip } from '../app/lib/QuickActionChip';
import { ActionButton } from '../app/lib/ActionButton';
import type { ChatMessage as ChatMessageType } from '../types';

const aiResponses: Record<string, string> = {
  'readiness': "The Mehndi event is 72% ready. \n\n✅ Completed: 7/10 tasks\n⏳ Pending: 3 approvals (Catering Menu, Budget Increase)\n👥 Vendors: 5 assigned, 4 confirmed\n\nBlockers:\n• Catering menu approval pending\n• DJ confirmation awaited (3 days overdue)\n\nRecommendations:\n1. Approve catering menu immediately\n2. Contact DJ urgently (event in 2 days)\n3. Approve budget increase for additional decorations",
  'vendors': "Vendor Status for Mehndi:\n\n✅ Confirmed (4):\n• Sharma Decorators (Confirmed May 16)\n• ABC Caterers (Confirmed May 15)\n• Smile Photography (Confirmed May 17)\n• Glam Makeup (Confirmed May 16)\n\n⏳ Pending (1):\n• XYZ DJ Services (Assigned May 10) - ❌ OVERDUE 3 days\n\nAction Needed: Contact DJ immediately, event is in 2 days",
  'approvals': "Pending Approvals for Mehndi (3):\n\n1. 🍽 Catering Menu Approval\n   Requested by: Coordinator (May 18)\n   Due: May 20 ⚠ DUE TODAY\n   \n2. 💰 Budget Increase Request\n   Requested by: Coordinator (May 19)\n   Amount: ₹50,000 (for additional decorations)\n   Due: May 25\n   \n3. 👨 DJ Vendor Confirmation\n   Requested by: Coordinator (May 10)\n   Due: May 18 ❌ OVERDUE 2 days\n\nImmediate Action: Approve catering menu today",
  'risks': "Risks & Recommendations:\n\n🔴 CRITICAL:\n• DJ not confirmed (4 days overdue - Mehndi in 2 days)\n\n🟡 WARNING:\n• Budget overrun risk (Catering 90% spent)\n• Decoration approval pending\n\nRecommended Actions:\n1. Contact DJ vendor immediately (urgent)\n2. Approve Decoration theme (to unblock vendor)\n3. Review catering budget",
  'general': "I'm your AI Event Copilot. I can help you with:\n\n• Event readiness status\n• Vendor coordination\n• Pending approvals\n• Budget tracking\n• Risk assessment\n\nTry asking:\n\"How is the event prep?\"\n\"Which vendors are delayed?\"\n\"What approvals are pending?\"",
};

function getIntent(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('prep') || m.includes('ready') || m.includes('readiness') || m.includes('status')) return 'readiness';
  if (m.includes('vendor') || m.includes('vendors') || m.includes('delayed') || m.includes('confirm')) return 'vendors';
  if (m.includes('approval') || m.includes('approvals') || m.includes('approve') || m.includes('pending')) return 'approvals';
  if (m.includes('risk') || m.includes('blocker') || m.includes('overdue') || m.includes('alert')) return 'risks';
  return 'general';
}

export function ChatPage() {
  const { activeEvent } = useEvents();
  const { addChatMessage, chatMessages } = useAppData();
  const [messages, setMessages] = useState<ChatMessageType[]>(chatMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const intent = getIntent(input);
    const aiResponse = aiResponses[intent] || aiResponses.general;

    const newMsg: ChatMessageType = {
      id: `msg_${Date.now()}`,
      event_id: activeEvent?.id || 'evt_001',
      organization_id: 'org_001',
      user_id: 'user_current',
      message_text: input,
      ai_response: aiResponse,
      intent,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    addChatMessage(newMsg);
    setInput('');
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        <div className="bg-gradient-to-r from-ai-background to-ai-background/50 border border-ai-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-ai-primary flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Event Copilot</h3>
              {activeEvent && <p className="text-xs text-muted-foreground">{activeEvent.event_name}</p>}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Ask me anything about your event operations.
          </p>
        </div>

        {messages.map((msg) => (
          <div key={msg.id}>
            <ChatMessage isAI={false} content={msg.message_text} />
            <div className="mt-2">
              <ChatMessage isAI={true} content={msg.ai_response} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-ai-primary flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="bg-ai-background border border-ai-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-ai-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-ai-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-ai-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="pt-3 border-t border-border space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <QuickActionChip onClick={() => handleQuickAction('How is the event preparation going?')} icon={<Sparkles size={14} />}>
            Event Status
          </QuickActionChip>
          <QuickActionChip onClick={() => handleQuickAction('Which vendors are delayed?')} icon={<Users size={14} />}>
            Vendor Status
          </QuickActionChip>
          <QuickActionChip onClick={() => handleQuickAction('What approvals are pending?')} icon={<ThumbsUp size={14} />}>
            Approvals
          </QuickActionChip>
          <QuickActionChip onClick={() => handleQuickAction('What are the blockers and risks?')} icon={<DollarSign size={14} />}>
            Risks
          </QuickActionChip>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your events..."
            className="flex-1 px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <ActionButton variant="primary" onClick={handleSend} icon={<Send size={16} />}>
            Send
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
