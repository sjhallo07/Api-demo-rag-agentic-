import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, Sparkles, AlertCircle, FileUp, X, FileText, File } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../lib/utils';
import { chatWithGemini } from '../lib/gemini';
import { ChatMessage, AttachmentMetadata } from '../types';

export default function ChatTerminal() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to BITA Command. To construct your optimized investment universe, I need to understand your profile. Which **sectors** are you currently monitoring, and what is your **investment horizon** (Short-term vs. Long-term)?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stagedAttachments, setStagedAttachments] = useState<AttachmentMetadata[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() && stagedAttachments.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      attachments: stagedAttachments.length > 0 ? [...stagedAttachments] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setStagedAttachments([]);
    setIsLoading(true);

    try {
      const base64Docs = userMessage.attachments?.map(at => at.data) || [];

      // Step 1: Intent Extraction (Temp 0 - for strict JSON)
      const extraction = await chatWithGemini(input, 'extract', base64Docs);
      try {
        const filters = JSON.parse(extraction);
        if (filters && Object.keys(filters).length > 0) {
          window.dispatchEvent(new CustomEvent('bit_query_universe', { detail: { query: input, filters } }));
        }
      } catch (e) {
        console.warn("Intent extraction skipped for general query");
      }

      // Step 2: RAG Pipeline in Frontend
      // 2a: Get Universe context
      let universeContext = [];
      try {
        let filters = {};
        try { filters = JSON.parse(extraction); } catch (e) {}

        const universeResp = await fetch('/api/universe/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: input, filters })
        });
        const universeData = await universeResp.json();
        universeContext = universeData.results || [];
      } catch (e) {
        console.error("Universe retrieval failed", e);
      }

      // 2b: Call Gemini directly from Frontend
      const agentContent = await chatWithGemini(input, 'chat', base64Docs, universeContext);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: agentContent,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStagedAttachments(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          data: reader.result as string,
          name: file.name,
          type: file.type
        }]);
      };
      reader.readAsDataURL(file);
    });
    // Reset input so the same file can be uploaded again if removed
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-[#1F1F23]"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.role === 'user' ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex flex-col gap-2 max-w-[90%]",
                message.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-[#52525B]">
                  {message.role.toUpperCase()} @ {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className={cn(
                "p-3 rounded-lg text-sm leading-relaxed border shadow-sm",
                message.role === 'user' 
                  ? "bg-[#1F1F23] border-[#2A2A30] text-[#E4E4E7]" 
                  : "bg-[#0A0A0B] border-[#1F1F23] text-[#A1A1AA]"
              )}>
                {message.attachments && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {message.attachments.map((at, i) => (
                      <div key={at.id || i} className="max-w-[200px] bg-[#16161A] border border-[#2A2A30] rounded overflow-hidden hover:border-[#52525B] transition-colors group">
                        {at.type.startsWith('image/') ? (
                          <div className="relative">
                            <img src={at.data} alt={at.name} className="w-full max-h-48 object-contain" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <p className="text-[8px] font-mono text-white truncate">{at.name}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 flex items-center gap-3">
                             <div className="p-2.5 bg-[#00FF41]/10 rounded-md border border-[#00FF41]/20">
                                <FileText size={20} className="text-[#00FF41]" />
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-mono text-[#E4E4E7] truncate font-bold">{at.name}</p>
                                <p className="text-[8px] text-[#52525B] uppercase tracking-wider font-mono">ATTACHMENT // {at.type.split('/')[1]?.toUpperCase() || 'DOCUMENT'}</p>
                             </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="markdown-body prose-sm prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex flex-col gap-2 mr-auto items-start max-w-[85%]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#52525B]">ASSISTANT PROCESSING...</span>
            </div>
            <div className="bg-[#0A0A0B] border border-[#1F1F23] p-4 rounded-lg flex items-center gap-3">
              <Loader2 className="animate-spin text-[#00FF41]" size={16} />
              <span className="text-xs font-mono text-[#00FF41]">EXECUTING_GEMINI_MODALITY_CALL</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0D0D0F] border-t border-[#1F1F23]">
        <AnimatePresence>
          {stagedAttachments.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-3"
            >
              <Reorder.Group 
                axis="x" 
                values={stagedAttachments} 
                onReorder={setStagedAttachments}
                className="flex gap-2 overflow-x-auto py-2 scrollbar-none"
              >
                {stagedAttachments.map((at) => (
                  <Reorder.Item 
                    key={at.id} 
                    value={at}
                    className="relative shrink-0 group cursor-grab active:cursor-grabbing"
                  >
                    {at.type.startsWith('image/') ? (
                      <div className="h-16 w-16 relative">
                        <img src={at.data} alt={at.name} className="h-16 w-16 object-cover rounded border border-[#00FF41]/30" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                          <p className="text-[8px] text-white font-mono text-center px-1 truncate">{at.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-16 w-28 bg-[#16161A] rounded p-2 border border-[#00FF41]/30 flex flex-col justify-between">
                         <div className="flex items-center justify-between">
                            <FileText size={14} className="text-[#00FF41]" />
                            <span className="text-[7px] font-mono text-[#52525B] uppercase">PDF</span>
                         </div>
                         <p className="text-[9px] font-mono text-[#A1A1AA] truncate">{at.name}</p>
                      </div>
                    )}
                    <button 
                      onClick={() => setStagedAttachments(prev => prev.filter((item) => item.id !== at.id))}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X size={10} />
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              <p className="text-[10px] text-[#52525B] italic mt-1 font-mono">DRAG_TO_REORDER_PRIORITY</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Query universe or upload documents..."
            className="w-full bg-[#16161A] border border-[#1F1F23] focus:border-[#00FF41]/50 rounded-lg pl-4 pr-32 py-3 text-sm font-sans focus:outline-none transition-all resize-none min-h-[50px] max-h-[150px] scrollbar-none"
            rows={1}
          />
          
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-[#52525B] hover:text-[#00FF41] hover:bg-[#1F1F23] rounded-md transition-all"
              title="Upload data (PDF, Images, MD)"
            >
              <FileUp size={18} />
            </button>
            <button 
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && stagedAttachments.length === 0)}
              className="p-2 bg-[#00FF41] text-black rounded-md hover:bg-[#00E53B] disabled:opacity-50 disabled:grayscale transition-all"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            multiple 
            accept="image/*,.pdf,.md,.txt"
          />
        </div>
        
        <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-[#3F3F46]">
           <span>READY for MULTIMODAL INF</span>
           <span className="flex items-center gap-1">
              <Sparkles size={10} />
              AGENT_RAG_ENABLED
           </span>
        </div>
      </div>
    </div>
  );
}
