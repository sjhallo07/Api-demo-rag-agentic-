import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Target, 
  Shield, 
  TrendingUp, 
  PieChart, 
  ArrowRight,
  BrainCircuit,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Security } from '../types';

interface UserProfile {
  sectors: string[];
  horizon: 'short' | 'long' | null;
  risk: 'aggressive' | 'passive' | null;
}

export default function StrategyBuilder() {
  const [profile, setProfile] = useState<UserProfile>({
    sectors: [],
    horizon: null,
    risk: null
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState<any | null>(null);

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
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <BrainCircuit className="text-[#00FF41]" size={24} />
          STRATEGY_BUILDER [v1.0]
        </h2>
        <p className="text-[#71717A] text-sm">
          Dynamic multi-factor strategy orchestration based on your institutional sub-profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Configuration */}
        <section className="md:col-span-1 space-y-6 bg-[#0D0D0F] border border-[#1F1F23] p-6 rounded-lg">
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
                      "px-3 py-1 rounded text-[10px] font-mono border transition-all",
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

            <button
              onClick={generateStrategy}
              disabled={isGenerating || !profile.horizon || !profile.risk || profile.sectors.length === 0}
              className="w-full mt-4 bg-[#00FF41] text-black py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#00E53B] transition-all disabled:opacity-50"
            >
              {isGenerating ? <TrendingUp className="animate-pulse" size={16} /> : <Zap size={16} />}
              {isGenerating ? "OPTIMIZING..." : "GENERATE_STRATEGY"}
            </button>
          </div>
        </section>

        {/* Strategy Output */}
        <section className="md:col-span-2 min-h-[400px] border border-[#1F1F23] border-dashed rounded-lg flex flex-col items-center justify-center relative overflow-hidden bg-[#0A0A0B]">
          <AnimatePresence mode="wait">
            {!strategy && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
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
                className="text-center space-y-6 px-12"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#1F1F23] border-t-[#00FF41] rounded-full animate-spin mx-auto" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00FF41]" size={20} />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-mono text-[#00FF41] animate-pulse">EXTRACTING_FACTOR_LOADS...</p>
                  <div className="w-48 h-1 bg-[#1F1F23] mx-auto rounded-full overflow-hidden">
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
                className="w-full h-full p-8 space-y-8"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-mono text-[#52525B]">ACTIVE_STRATEGY</h4>
                    <h3 className="text-2xl font-bold tracking-tight text-[#E4E4E7]">{strategy.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#00FF41]/10 border border-[#00FF41]/20 rounded text-[10px] font-mono text-[#00FF41]">
                    <Shield size={12} />
                    HEDGED_STANCE
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[11px] font-mono text-[#71717A] tracking-wider border-b border-[#1F1F23] pb-2">WEIGHT_DISTRIBUTION</p>
                    <div className="space-y-4">
                      {strategy.allocation.map((item: any) => (
                        <div key={item.name} className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span>{item.name}</span>
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
                    <p className="text-[11px] font-mono text-[#71717A] tracking-wider border-b border-[#1F1F23] pb-2">SUGGESTED_TICKERS</p>
                    <div className="space-y-3">
                      {strategy.suggestions.map((ticker: any) => (
                        <div key={ticker.id} className="group p-3 bg-[#16161A] border border-[#1F1F23] rounded-md hover:border-[#00FF41]/30 transition-all flex items-center justify-between">
                           <div className="space-y-1">
                              <span className="text-sm font-bold block">{ticker.id}</span>
                              <span className="text-[10px] text-[#52525B] line-clamp-1">{ticker.reason}</span>
                           </div>
                           <ArrowRight size={14} className="text-[#52525B] group-hover:text-[#00FF41] group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1F1F23] flex items-center justify-between text-[10px] font-mono text-[#52525B]">
                   <p className="flex items-center gap-2 italic">
                     <BrainCircuit size={14} />
                     Generated via BITA Intelligence Agent v4.2 [LLM-GROUNDED]
                   </p>
                   <button className="text-[#00FF41] hover:underline">RE-OPTIMIZE_PARAMS</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
