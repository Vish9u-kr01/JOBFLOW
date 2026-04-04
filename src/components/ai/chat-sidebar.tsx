"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Sparkles, RotateCcw, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/store/app-context';
import { controlUIFilters } from '@/ai/flows/control-ui-filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/lib/types';

export function ChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([
    { role: 'model', content: 'JobFlow Agent online. I can help you filter jobs or analyze your resume match. What are we looking for today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { profile, filters, setFilters } = useApp();
  const viewportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (viewportRef.current) {
      const scrollElement = viewportRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    const previousHistory = [...history];
    
    // Optimistic UI update
    setHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await controlUIFilters({
        query: userMessage,
        history: previousHistory.map(m => ({ role: m.role as any, content: m.content })),
        resumeText: profile?.resumeText || '',
        currentFilters: {
          role: filters.role || '',
          skills: filters.skills || [],
          datePosted: filters.datePosted || 'anytime',
          jobType: filters.jobType || [],
          workMode: filters.workMode || [],
          minMatchScore: filters.minMatchScore || 0
        } as any
      });

      // Apply UI filter updates if dictated by the agent
      if (response.updatedFilters && Object.keys(response.updatedFilters).length > 0) {
        setFilters(prev => ({
          ...prev,
          ...response.updatedFilters
        }));
      }

      // Update chat history with full sequence from server, ensuring we don't lose previous turns
      if (response.history && Array.isArray(response.history) && response.history.length > 0) {
        setHistory(response.history as ChatMessage[]);
      } else {
        // Fallback: append model response if history sync failed
        setHistory(prev => [...prev, { role: 'model', content: response.answer }]);
      }
    } catch (error: any) {
      console.error("Agentic Flow UI Error:", error);
      setHistory(prev => [...prev, { role: 'model', content: `Sorry, I encountered an error: ${error.message || "Unknown error"}.` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = () => {
    setHistory([{ role: 'model', content: 'Conversation reset. How else can I assist your job search?' }]);
  };

  return (
    <>
      <div className={cn(
        "fixed right-0 top-16 bottom-0 z-40 w-80 glass-card border-l border-white/5 transition-transform duration-300 ease-in-out shadow-2xl",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full bg-background/95 backdrop-blur-xl">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <span className="font-black text-white text-sm uppercase tracking-tighter">JobFlow Agent</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={clearHistory} className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10" title="Reset Chat">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white hover:bg-white/10">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4" viewportRef={viewportRef}>
            <div className="space-y-4">
              {history.map((msg, i) => (
                <div key={i} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed whitespace-pre-wrap",
                    msg.role === 'user' 
                      ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10" 
                      : "bg-white/5 text-white border border-white/10 rounded-tl-none shadow-xl"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start">
                  <div className="bg-white/5 text-white/50 rounded-2xl rounded-tl-none px-4 py-3 text-[10px] font-black tracking-widest animate-pulse border border-white/5 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    AGENT ROUTING ACTIONS...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-white/5 bg-white/5">
            <div className="flex gap-2">
              <Input 
                placeholder="Ask to filter jobs..." 
                value={input}
                className="bg-black/50 border-white/10 text-white rounded-xl h-12 text-xs focus:ring-primary"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button size="icon" onClick={handleSend} disabled={isTyping || !input.trim()} className="h-12 w-12 bg-white text-black hover:bg-white/90 rounded-xl shrink-0 transition-transform active:scale-95">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 rounded-full shadow-2xl transition-all h-14 px-8 flex items-center gap-3 bg-white text-black hover:bg-white/90 font-black tracking-tighter uppercase",
          isOpen && "translate-x-[-340px] opacity-0 pointer-events-none"
        )}
      >
        <Sparkles className="w-5 h-5 animate-pulse text-primary" />
        Career Agent
      </Button>
    </>
  );
}
