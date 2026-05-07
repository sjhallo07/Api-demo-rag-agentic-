import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Target, 
  Shield, 
  TrendingUp, 
  PieChart, 
  ArrowRight,
  BrainCircuit,
  Sparkles,
  Save,
  FolderOpen,
  Trash2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Security, StrategyTemplate } from '../types';

interface UserProfileState {
  sectors: string[];
  horizon: 'short' | 'long' | null;
  risk: 'aggressive' | 'passive' | null;
}

export default function StrategyBuilder() {
  const [profile, setProfile] = useState<UserProfileState>({
    sectors: [],
    horizon: null,
    risk: null
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState<any | null>(null);
  const [templates, setTemplates] = useState<StrategyTemplate[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('strategy_templates');
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse templates", e);
      }
    }
  }, []);

  const saveTemplate = () => {
    if (!templateName.trim()) return;
    
    const newTemplate: StrategyTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: templateName,
      profile: { ...profile },
      createdAt: new Date().toISOString()
    };

    const updated = [...templates, newTemplate];
    setTemplates(updated);
    localStorage.setItem('strategy_templates', JSON.stringify(updated));
    setTemplateName('');
    setShowSaveDialog(false);
  };

  const deleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('strategy_templates', JSON.stringify(updated));
  };

  const loadTemplate = (template: StrategyTemplate) => {
    setProfile(template.profile);
    setStrategy(null); // Clear active strategy when loading new params
  };

  const generateStrategy = async () => {
    if (!profile.horizon || !profile.risk || profile.sectors.length === 0) return;
    
    setIsGenerating(true);
    // Simulate complex strategy generation with RAG Agent
    setTimeout(() => {
      setStrategy({
        name: `${profile.risk?.toUpperCase()} ${profile.sectors[0].toUpperCase()} CORE`,
        allocation: [
          { name: 'Core Assets', weight: 60, color: '#00FF41' },
          { name: 'Growth Satellite', weight: 25, color: '#3B82F6' },
          { name: 'Hedge/Defensive', weight: 15, color: '#F43F5E' },
        ],
        suggestions: [
          { id: 'ASML', name: 'ASML Holding', reason: 'High R&D efficiency in Tech sector (Long-term growth).' },
          { id: 'SAP', name: 'SAP SE', reason: 'Stable recurring revenue, matches Passive risk profile.' },
          { id: 'NVDA', name: 'NVIDIA Corp', reason: 'Aggressive exposure to semi-thematics.' }
        ]
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <BrainCircuit className="text-[#00FF41]" size={24} />
          STRATEGY_BUILDER [v1.0]
        </h2>
        <p className="text-[#71717A] text-[11px] md:text-sm">
          Dynamic multi-factor strategy orchestration based on your institutional sub-profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Configuration */}
        <section className="md:col-span-1 space-y-6 bg-[#0D0D0F] border border-[#1F1F23] p-5 md:p-6 rounded-lg">
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-[#52525B] flex items-center gap-2">
              <Target size={14} /> USER_PROFILING
            </h3>
            
            <div className="space-y-3">
              <label className="block text-[11px] font-mono text-[#71717A]">SECTORS_OF_INTEREST</label>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Semiconductors', 'Finance', 'Consumer'].map(s => (
                  <button
                    key={s}
                    onClick={() => setProfile(p => ({
                      ...p,
                      sectors: p.sectors.includes(s) ? p.sectors.filter(x => x !== s) : [...p.sectors, s]
                    }))}
                    className={cn(
                      "px-3 py-1.5 md:py-1 rounded text-[10px] font-mono border transition-all",
                      profile.sectors.includes(s) 
                        ? "bg-[#00FF41]/10 border-[#00FF41]/30 text-[#00FF41]" 
                        : "bg-[#16161A] border-[#1F1F23] text-[#52525B] hover:border-[#52525B]"
                    )}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-mono text-[#71717A]">INVESTMENT_HORIZON</label>
              <div className="grid grid-cols-2 gap-2">
                {['short', 'long'].map(h => (
                  <button
                    key={h}
                    onClick={() => setProfile(p => ({ ...p, horizon: h as any }))}
                    className={cn(
                      "px-3 py-2 rounded text-[10px] font-mono border text-center transition-all",
                      profile.horizon === h 
                        ? "bg-[#00FF41]/10 border-[#00FF41]/30 text-[#00FF41]" 
                        : "bg-[#16161A] border-[#1F1F23] text-[#52525B]"
                    )}
                  >
                    {h.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-mono text-[#71717A]">RISK_APPETITE</label>
              <div className="grid grid-cols-2 gap-2">
                {['aggressive', 'passive'].map(r => (
                  <button
                    key={r}
                    onClick={() => setProfile(p => ({ ...p, risk: r as any }))}
                    className={cn(
                      "px-3 py-2 rounded text-[10px] font-mono border text-center transition-all",
                      profile.risk === r 
                        ? "bg-[#00FF41]/10 border-[#00FF41]/30 text-[#00FF41]" 
                        : "bg-[#16161A] border-[#1F1F23] text-[#52525B]"
                    )}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={generateStrategy}
                disabled={isGenerating || !profile.horizon || !profile.risk || profile.sectors.length === 0}
                className="flex-1 bg-[#00FF41] text-black py-2.5 rounded font-bold text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-[#00E53B] transition-all disabled:opacity-50"
              >
                {isGenerating ? <TrendingUp className="animate-pulse" size={14} /> : <Zap size={14} />}
                {isGenerating ? "OPTIMIZING..." : "GENERATE"}
              </button>
              <button
                onClick={() => setShowSaveDialog(true)}
                disabled={isGenerating || profile.sectors.length === 0}
                className="px-3 bg-[#16161A] border border-[#1F1F23] text-[#71717A] rounded hover:border-[#00FF41]/30 hover:text-[#00FF41] transition-all disabled:opacity-50"
                title="Save as Template"
              >
                <Save size={14} />
              </button>
            </div>
          </div>

          {/* Save Dialog */}
          <AnimatePresence>
            {showSaveDialog && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-4 bg-black border border-[#00FF41]/20 rounded-md space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-[#00FF41]">TEMPLATE_NAME</label>
                  <input 
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="ENTER_NAME..."
                    className="w-full bg-[#0D0D0F] border border-[#1F1F23] rounded px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-[#00FF41]/50"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={saveTemplate}
                    className="flex-1 bg-[#00FF41] text-black py-1.5 rounded font-bold text-[10px] font-mono"
                  >
                    CONFIRM_SAVE
                  </button>
                  <button 
                    onClick={() => setShowSaveDialog(false)}
                    className="px-3 bg-transparent border border-[#1F1F23] text-[#71717A] rounded text-[10px] font-mono"
                  >
                    CANCEL
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Saved Templates */}
          {templates.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#1F1F23] space-y-4">
              <h3 className="text-[10px] font-mono font-bold text-[#52525B] flex items-center gap-2">
                <FolderOpen size={12} /> SAVED_TEMPLATES_INDEX
              </h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#1F1F23]">
                {templates.map(template => (
                  <div 
                    key={template.id}
                    onClick={() => loadTemplate(template)}
                    className="group flex flex-col p-3 bg-black/40 border border-[#1F1F23] rounded-md hover:border-[#00FF41]/20 transition-all cursor-pointer relative"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#E4E4E7] truncate pr-8">{template.name}</span>
                      <button 
                        onClick={(e) => deleteTemplate(template.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-[#F43F5E] hover:text-red-400 p-1 transition-opacity absolute top-2 right-2"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                       <div className="flex items-center gap-1 text-[8px] font-mono text-[#52525B]">
                          <Clock size={8} />
                          {new Date(template.createdAt).toLocaleDateString()}
                       </div>
                       <div className="flex gap-1">
                          {template.profile.sectors.slice(0, 2).map(s => (
                            <span key={s} className="px-1 bg-[#1F1F23] text-[7px] text-[#71717A] rounded">{s.substring(0, 3).toUpperCase()}</span>
                          ))}
                          {template.profile.sectors.length > 2 && <span className="text-[7px] text-[#52525B]">+{template.profile.sectors.length - 2}</span>}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Strategy Output */}
        <section className="md:col-span-2 min-h-[400px] border border-[#1F1F23] border-dashed rounded-lg flex flex-col items-center justify-center relative overflow-hidden bg-[#0A0A0B]">
          <AnimatePresence mode="wait">
            {!strategy && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4 p-6"
              >
                <Target size={48} className="mx-auto text-[#1F1F23]" />
                <div className="space-y-1">
                  <p className="text-sm font-mono text-[#52525B]">AWAITING_INPUT_PARAMS</p>
                  <p className="text-[10px] text-[#3F3F46]">Configure your profile to trigger agentic synthesis.</p>
                </div>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6 px-6 md:px-12"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#1F1F23] border-t-[#00FF41] rounded-full animate-spin mx-auto" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00FF41]" size={20} />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-mono text-[#00FF41] animate-pulse uppercase">Extracting_Factor_Loads...</p>
                  <div className="w-full max-w-[200px] h-1 bg-[#1F1F23] mx-auto rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-[#00FF41]" 
                     />
                  </div>
                </div>
              </motion.div>
            )}

            {strategy && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full p-4 md:p-8 space-y-6 md:space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-mono text-[#52525B]">ACTIVE_STRATEGY</h4>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#E4E4E7]">{strategy.name}</h3>
                  </div>
                  <div className="flex items-center self-start gap-2 px-3 py-1 bg-[#00FF41]/10 border border-[#00FF41]/20 rounded text-[10px] font-mono text-[#00FF41]">
                    <Shield size={12} />
                    HEDGED_STANCE
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-4">
                    <p className="text-[11px] font-mono text-[#71717A] tracking-wider border-b border-[#1F1F23] pb-2 uppercase">Weight_Distribution</p>
                    <div className="space-y-4">
                      {strategy.allocation.map((item: any) => (
                        <div key={item.name} className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-[#E4E4E7]">{item.name.toUpperCase()}</span>
                            <span>{item.weight}%</span>
                          </div>
                          <div className="h-1.5 bg-[#1F1F23] rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.weight}%` }}
                              style={{ backgroundColor: item.color }}
                              className="h-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[11px] font-mono text-[#71717A] tracking-wider border-b border-[#1F1F23] pb-2 uppercase">Suggested_Tickers</p>
                    <div className="space-y-3">
                      {strategy.suggestions.map((ticker: any) => (
                        <div key={ticker.id} className="group p-3 bg-[#16161A] border border-[#1F1F23] rounded-md hover:border-[#00FF41]/30 transition-all flex items-center justify-between">
                           <div className="space-y-1">
                              <span className="text-sm font-bold block text-white">{ticker.id}</span>
                              <span className="text-[10px] text-[#52525B] line-clamp-1">{ticker.reason}</span>
                           </div>
                           <ArrowRight size={14} className="text-[#52525B] group-hover:text-[#00FF41] group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1F1F23] flex flex-col md:flex-row md:items-center justify-between gap-4 text-[10px] font-mono text-[#52525B]">
                   <p className="flex items-center gap-2 italic">
                     <BrainCircuit size={14} />
                     Generated via BITA Intelligence Agent v4.2 [LLM-GROUNDED]
                   </p>
                   <button 
                    onClick={() => setStrategy(null)}
                    className="text-[#00FF41] hover:underline self-start md:self-auto"
                   >
                    RE-OPTIMIZE_PARAMS
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
