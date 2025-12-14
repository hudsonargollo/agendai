import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { generateChatResponse } from '../services/geminiService';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: 'Olá! Posso ajudar você a encontrar o serviço certo ou tirar dúvidas. O que você precisa?', timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    // Prepare history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await generateChatResponse(userMsg.text, history);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-12 h-12 bg-zinc-900 dark:bg-zinc-800 rounded-full shadow-xl flex items-center justify-center border border-zinc-700 hover:scale-105 active:scale-95 transition-all z-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="bg-white dark:bg-zinc-900 w-full max-w-md h-[600px] max-h-[80vh] rounded-2xl flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400">
                <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
                <path d="M12 22v-4"></path>
                <path d="M9.6 15a5.5 5.5 0 0 0 4.8 0"></path>
                <path d="M16 8a4 4 0 0 1 4 4v3a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-3"></path>
                <path d="M8 8a4 4 0 0 0-4 4v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">Recepcionista Virtual</h3>
              <p className="text-xs text-zinc-500">Sempre online</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-zinc-900/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-red-600 text-white rounded-br-none' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-2xl rounded-bl-none px-4 py-2 text-xs flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce delay-100"></span>
                 <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce delay-200"></span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte sobre horários..."
              className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 border border-zinc-200 dark:border-transparent"
            />
            <button 
              onClick={handleSend}
              disabled={!inputText.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};