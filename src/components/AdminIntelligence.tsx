
import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  Trash2, 
  Brain, 
  Clock, 
  Tag, 
  AlertCircle,
  FileText,
  Save,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import NeuralHealth from './NeuralHealth';
import { getKnowledgeBase, addInsight, FinancialInsight } from '../services/knowledgeService';

export default function AdminIntelligence() {
  const [knowledgeBase, setKnowledgeBase] = useState<FinancialInsight[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Insight Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<FinancialInsight['category']>('market');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setKnowledgeBase(getKnowledgeBase());
  }, []);

  const handleAddInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    addInsight({
      title: newTitle,
      content: newContent,
      category: newCategory,
      source: 'Admin Manual Entry',
      impactScore: Math.random() * 0.5 + 0.5
    });

    setKnowledgeBase(getKnowledgeBase());
    setNewTitle('');
    setNewContent('');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsAdding(false);
    }, 1500);
  };

  const filteredKnowledge = knowledgeBase.filter(i => 
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <NeuralHealth />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-[#00FF41]/10 border border-[#00FF41]/20 flex items-center justify-center">
             <Database className="text-[#00FF41]" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-mono font-bold text-white tracking-tighter uppercase">Intelligence_Repository</h1>
            <p className="text-[10px] text-[#71717A] font-mono mt-1">MANAGEMENT CONSOLE / RAG_RETRIEVAL_STATUS: <span className="text-[#00FF41]">OPTIMIZED</span></p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00FF41] text-black rounded text-xs font-mono font-bold hover:bg-[#00E53B] transition-all"
        >
          {isAdding ? "CANCEL_UPLOAD" : "INJECT_NEW_KNOWLEDGE"}
          <Plus size={14} className={cn(isAdding && "rotate-45")} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddInsight} className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6 space-y-4 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-[#71717A] block">INSIGHT_TITLE</label>
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Tech Earnings Semantic Shift Q2"
                    className="w-full bg-[#16161A] border border-[#1F1F23] rounded p-2 text-xs font-mono focus:border-[#00FF41]/50 outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-[#71717A] block">CATEGORY_TAG</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#16161A] border border-[#1F1F23] rounded p-2 text-xs font-mono focus:border-[#00FF41]/50 outline-none appearance-none"
                  >
                    <option value="market">MARKET_SPECIFIC</option>
                    <option value="macro">MACRO_ECONOMIC</option>
                    <option value="technical">TECHNICAL_ANALYSIS</option>
                    <option value="unstructured">UNSTRUCTURED_DATA</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-[#71717A] block">KNOWLEDGE_CONTENT (AGENT_TRAINING_CORPUS)</label>
                <textarea 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Insert raw financial text, news segments, or qualitative analysis for the agent to learn from..."
                  className="w-full bg-[#16161A] border border-[#1F1F23] rounded p-3 text-xs font-mono focus:border-[#00FF41]/50 outline-none resize-none"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={isSaved}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded text-xs font-mono font-bold transition-all",
                    isSaved ? "bg-[#00FF41]/20 text-[#00FF41]" : "bg-[#1F1F23] text-white hover:bg-[#2A2A30]"
                  )}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 size={16} />
                      KNOWLEDGE_PERSISTED
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      COMMIT_TO_ENGINE
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Knowledge Explorer */}
        <div className="md:col-span-8 space-y-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B] group-focus-within:text-[#00FF41] transition-colors" size={14} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query the local knowledge graph..."
              className="w-full bg-[#0D0D0F] border border-[#1F1F23] rounded-md py-2.5 pl-10 pr-4 text-xs font-mono focus:outline-none focus:border-[#00FF41]/50 transition-all placeholder:text-[#3F3F46]"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {filteredKnowledge.map((insight) => (
              <motion.div 
                layout
                key={insight.id}
                className="bg-[#0D0D0F] border border-[#1F1F23] p-4 rounded-lg hover:border-[#3F3F46] transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded",
                      insight.category === 'market' ? "bg-blue-500/10 text-blue-500" :
                      insight.category === 'macro' ? "bg-purple-500/10 text-purple-500" :
                      "bg-orange-500/10 text-orange-500"
                    )}>
                      <Tag size={12} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-tight">{insight.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock size={10} className="text-[#52525B]" />
                        <span className="text-[9px] font-mono text-[#52525B]">{new Date(insight.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-[10px] font-mono font-bold text-[#00FF41]">{(insight.impactScore * 100).toFixed(0)}%</p>
                      <p className="text-[8px] font-mono text-[#52525B]">RELEVANCE</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-[#A1A1AA] leading-relaxed mb-4 font-mono">
                  {insight.content}
                </p>

                <div className="flex items-center justify-between border-t border-[#1F1F23] pt-3">
                  <span className="text-[9px] font-mono text-[#52525B]">SOURCE: {insight.source.toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1 px-2 text-[9px] font-mono text-[#71717A] hover:bg-[#1F1F23] rounded flex items-center gap-1 transition-colors">
                       <Brain size={10} />
                       RE-INDEX
                    </button>
                    <button className="p-1 px-2 text-[9px] font-mono text-red-400/60 hover:bg-red-400/10 rounded flex items-center gap-1 transition-colors">
                       <Trash2 size={10} />
                       PURGE
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredKnowledge.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-[#1F1F23] rounded-lg">
                <AlertCircle className="mx-auto text-[#1F1F23] mb-3" size={32} />
                <p className="text-sm font-mono text-[#52525B]">NO_INTEL_MATCHES_VECTOR_QUERY</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="md:col-span-4 space-y-6">
           <div className="bg-[#0D0D0F] border border-[#1F1F23] p-6 rounded-lg">
              <h3 className="text-xs font-mono font-bold text-white mb-4 border-b border-[#1F1F23] pb-2 uppercase tracking-widest">Engine_Stats</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#71717A]">TOTAL_TOKENS_LEARNED</span>
                    <span className="text-xs font-mono text-white">425.8k</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#71717A]">KNOWLEDGE_DENSITY</span>
                    <span className="text-xs font-mono text-[#00FF41]">HIGH_PRECISION</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#71717A]">ACTIVE_INDEXES</span>
                    <span className="text-xs font-mono text-white">14</span>
                 </div>
                 <div className="pt-4 mt-2 border-t border-[#1F1F23]">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-[9px] font-mono text-[#52525B]">KNOWLEDGE_RETENTION</span>
                       <span className="text-[9px] font-mono text-[#00FF41]">98.2%</span>
                    </div>
                    <div className="w-full h-1 bg-[#1F1F23] rounded-full overflow-hidden">
                       <div className="h-full bg-[#00FF41]" style={{ width: '98.2%' }} />
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-[#00FF41]/5 border border-[#00FF41]/20 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                 <Brain className="text-[#00FF41]" size={18} />
                 <h3 className="text-xs font-mono font-bold text-[#00FF41] uppercase tracking-widest">Agent_Evolution</h3>
              </div>
              <p className="text-[10px] text-[#A1A1AA] leading-relaxed mb-4 font-mono">
                 The BITA Agent utilizes semantic RAG to improve investment signals. As you inject more institutional knowledge, 
                 the model's ability to identify thematic alpha increases.
              </p>
              <div className="p-3 bg-black/40 border border-[#00FF41]/10 rounded font-mono text-[9px] text-[#00FF41]/70">
                 PROMPT: "Integrate latest ECB minutes into the sentiment vector."
              </div>
           </div>

           <div className="bg-[#0D0D0F] border border-[#1F1F23] p-6 rounded-lg space-y-4">
              <div className="flex items-center gap-3">
                 <Clock className="text-[#3B82F6]" size={18} />
                 <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">User_Access_Audit</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-black border border-[#1F1F23] rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-mono text-[#71717A]">PLAN:</span>
                    <span className="text-[9px] font-mono text-[#00FF41] font-bold">STANDARD_ACCESS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#71717A]">HISTORY_RETENTION:</span>
                    <span className="text-[9px] font-mono text-white">48_HOURS</span>
                  </div>
                </div>
                <p className="text-[10px] text-[#52525B] leading-relaxed font-mono">
                  Standard users (Registered &lt; 7 days) are limited to basic sector summaries. 
                  Upgrade to <span className="text-[#00FF41]">PREMIUM</span> for full historical data and "Flippener" tool access.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
