
import React, { useState, useRef, useEffect } from 'react';
import { BloodSugarEntry, Translations, Language } from '../types';
import { askAssistant } from '../geminiService';

interface AIAssistantProps {
  entries: BloodSugarEntry[];
  lang: Language;
  t: Translations;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ entries, lang, t }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const answer = await askAssistant(userMessage, entries, lang);
    
    setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[800px] bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-full">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">{t.assistant}</h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 py-10 px-6">
            <p className="mb-4">{t.aiPrompt}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Hvordan ser mit gennemsnit ud?', 'Giv mig råd til højt blodsukker', 'Har jeg gode tendenser?'].map(q => (
                <button 
                  key={q} 
                  onClick={() => setInput(q)}
                  className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-sm hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
              m.role === 'user' 
              ? 'bg-blue-600 text-white rounded-br-none' 
              : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 px-4 py-3 rounded-2xl flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
        <input 
          type="text"
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t.aiPlaceholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          disabled={isLoading}
          className="bg-blue-600 text-white p-3 rounded-2xl shadow-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;
