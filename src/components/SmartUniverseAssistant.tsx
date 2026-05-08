import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Send, 
  X, 
  Terminal, 
  Sparkles,
  Command,
  ArrowRight,
  Loader2,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';
import { chatWithGemini } from '../lib/gemini';

interface SmartUniverseAssistantProps {
  onApplyFilters: (filters: any) => void;
  isOpen: boolean;
  onClose: () => void;
  results?: any[];
}

export default function SmartUniverseAssistant({ onApplyFilters, isOpen, onClose, results = [] }: SmartUniverseAssistantProps) {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<{role: 'user' | 'agent', content: string, parsed?: any}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!query.trim() || isProcessing) return;

    const userMsg = query;
    setQuery('');
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessing(true);

    try {
      // Use 'extract' type to get structured data back from Gemini
      const response = await chatWithGemini(userMsg, 'extract');
      let parsedResponse: any = {};
      
      try {
        // Clean up common LLM code block artifacts
        const cleanJson = response.replace(/```json|```/gi, '').trim();
        parsedResponse = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Failed to parse Gemini response as JSON", e);
        // Fallback to unstructured if parsing fails
        parsedResponse = { explanation: "I interpreted your request, but couldn't generate strict parameters. Please try again." };
      }

      setHistory(prev => [...prev, { 
        role: 'agent', 
        content: parsedResponse.explanation || "Analyzed requested universe parameters.",
        parsed: parsedResponse
      }]);

      if (parsedResponse.sector || parsedResponse.geography || parsedResponse.themes || parsedResponse.minEsg || parsedResponse.query) {
        // Automatically apply filters
        onApplyFilters(parsedResponse);
      }
    } catch (error) {
      setHistory(prev => [...prev, { role: 'agent', content: "SYSTEM_ERROR: Neural interface timeout." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-8 right-8 w-full max-w-md h-[600px] bg-[#0D0D0F] border border-[#00FF41]/20 rounded-xl shadow-2xl z-[101] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#1F1F23] flex items-center justify-between bg-[#16161A]/50">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#00FF41]/10 flex items-center justify-center border border-[#00FF41]/20">
                    <BrainCircuit className="text-[#00FF41]" size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white tracking-widest uppercase">Universe_Orchestrator</h3>
                    <p className="text-[8px] text-[#52525B] font-mono">v4.1.0-STABLE [NEURAL_LLM]</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-1 hover:bg-white/5 rounded transition-colors text-[#52525B] hover:text-white">
                 <X size={16} />
               </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-[#1F1F23]">
               {history.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <Sparkles className="text-[#00FF41]/20" size={48} />
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-[#52525B]">SYSTEM_WAITING_FOR_INPUT</p>
                      <p className="text-[9px] text-[#71717A] max-w-[200px]">Query me about sectors, ESG thresholds, themes, or geographies.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 pt-4">
                       {["Show me tech in Europe", "High ESG AI stocks", "Luxury in Asia"].map(tip => (
                         <button 
                           key={tip}
                           onClick={() => setQuery(tip)}
                           className="px-3 py-1.5 rounded-full bg-[#1F1F23] border border-[#1F1F23] text-[9px] font-mono text-[#71717A] hover:border-[#00FF41]/30 hover:text-white transition-all"
                         >
                           {tip.toUpperCase()}
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {history.map((msg, i) => (
                 <motion.div 
                   initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   key={i}
                   className={cn(
                     "flex flex-col max-w-[85%]",
                     msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                   )}
                 >
                    <div className={cn(
                      "p-3 rounded-lg text-[11px] font-mono",
                      msg.role === 'user' 
                        ? "bg-[#1F1F23] text-white border border-[#3F3F46]" 
                        : "bg-[#0D0D0F] text-[#00FF41] border border-[#00FF41]/10"
                    )}>
                       {msg.content}
                    </div>

                    {msg.parsed && (
                      <div className="mt-2 w-full p-2 bg-black border border-[#1F1F23] rounded flex flex-col gap-1">
                         <div className="flex items-center gap-1 text-[8px] font-mono text-[#52525B] uppercase mb-1">
                            <Filter size={8} /> Applied_Logic
                         </div>
                         <div className="flex flex-wrap gap-x-3 gap-y-1">
                             {msg.parsed.geography && <span className="text-[9px] font-mono text-[#E4E4E7]">REG: {msg.parsed.geography}</span>}
                             {msg.parsed.sector && <span className="text-[9px] font-mono text-[#E4E4E7]">SEC: {msg.parsed.sector}</span>}
                             {msg.parsed.minEsg > 0 && <span className="text-[9px] font-mono text-[#00FF41]">ESG: {msg.parsed.minEsg}+</span>}
                         </div>
                         {msg.parsed.themes && msg.parsed.themes.length > 0 && (
                           <div className="flex flex-wrap gap-1 mt-1">
                              {msg.parsed.themes.map((t: string) => (
                                <span key={t} className="px-1 bg-[#00FF41]/10 text-[#00FF41] rounded text-[8px]">{t}</span>
                              ))}
                           </div>
                         )}

                         {/* Results Preview (Data Points) */}
                         {results.length > 0 && (
                           <div className="mt-2 pt-2 border-t border-[#1F1F23]">
                              <div className="text-[8px] font-mono text-[#52525B] uppercase mb-1 flex items-center gap-1">
                                <Terminal size={8} /> Matches_Found: {results.length}
                              </div>
                              <div className="space-y-1">
                                 {results.slice(0, 3).map(res => (
                                   <div key={res.id} className="flex items-center justify-between text-[9px] font-mono bg-white/5 p-1 rounded">
                                      <span className="text-white">{res.id}</span>
                                      <span className="text-[#00FF41]">{res.score.toFixed(2)}</span>
                                   </div>
                                 ))}
                                 {results.length > 3 && <div className="text-[7px] text-[#52525B] text-center italic">+{results.length - 3} more...</div>}
                              </div>
                           </div>
                         )}
                         
                         {/* Suggested Slices */}
                         {msg.parsed.suggestedSlices && msg.parsed.suggestedSlices.length > 0 && (
                           <div className="mt-2 pt-2 border-t border-[#1F1F23]">
                              <div className="text-[8px] font-mono text-[#3B82F6] uppercase mb-1">Suggested_Slices</div>
                              <div className="flex flex-wrap gap-1">
                                 {msg.parsed.suggestedSlices.map((slice: string, si: number) => (
                                   <button 
                                      key={si}
                                      onClick={() => {
                                        setQuery(slice);
                                      }}
                                      className="px-2 py-0.5 border border-[#3B82F6]/30 bg-[#3B82F6]/5 text-[#3B82F6] text-[8px] font-mono rounded hover:bg-[#3B82F6]/10 transition-all flex items-center gap-1"
                                   >
                                      <ArrowRight size={8} /> {slice}
                                   </button>
                                 ))}
                              </div>
                           </div>
                         )}
                      </div>
                    )}
                 </motion.div>
               ))}

               {isProcessing && (
                 <div className="flex items-center gap-2 text-[#00FF41] font-mono text-[10px] animate-pulse">
                    <Loader2 size={12} className="animate-spin" />
                    ANALYZING_QUANT_DIRECTIVES...
                 </div>
               )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#1F1F23] bg-[#16161A]/30">
               <div className="relative">
                  <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Enter command or query..."
                    className="w-full bg-black border border-[#1F1F23] rounded-lg py-3 pl-4 pr-12 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]/40 transition-all placeholder:text-[#3F3F46]"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!query.trim() || isProcessing}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#00FF41] text-black rounded hover:bg-[#00E53B] transition-all disabled:opacity-30"
                  >
                    <Send size={14} />
                  </button>
               </div>
               <div className="flex items-center gap-4 mt-3">
                 <div className="flex items-center gap-1 text-[8px] font-mono text-[#52525B]">
                    <Command size={10} />
                    SEMANTIC_MODE_ON
                 </div>
                 <div className="flex items-center gap-1 text-[8px] font-mono text-[#52525B]">
                    <Sparkles size={10} />
                    GEMINI_INTEGRATED
                 </div>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
