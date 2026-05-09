import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Terminal as TerminalIcon, 
  Menu, 
  Send, 
  Home, 
  TrendingUp, 
  Briefcase, 
  Cpu, 
  Settings, 
  Fingerprint, 
  Radio, 
  ShieldCheck,
  Wifi,
  Battery,
  Signal,
  Search,
  Activity,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function MobilePreview() {
  const [activeTab, setActiveTab] = useState('HOME');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'HOME', icon: Home, label: 'HOME' },
    { id: 'MKTS', icon: TrendingUp, label: 'MKTS' },
    { id: 'PORT', icon: Briefcase, label: 'PORT' },
    { id: 'AUTO', icon: Cpu, label: 'AUTO' },
    { id: 'SET', icon: Settings, label: 'SET' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'HOME':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-3 bg-[#1F1F23] rounded-2xl rounded-tl-none border border-[#2A2A30] text-[11px] leading-relaxed max-w-[90%] text-white/80">
              Welcome to BITA Mobile. Terminal session initialized. Ingressing multi-factor data streams.
            </div>
            <div className="p-3 bg-[#00FF41]/10 text-[#00FF41] rounded-2xl rounded-tr-none border border-[#00FF41]/20 text-[11px] leading-relaxed max-w-[85%] ml-auto">
              Analyze tech exposure in EU markets.
            </div>
            <div className="p-3 bg-[#1F1F23] rounded-2xl rounded-tl-none border border-[#2A2A30] text-[11px] leading-relaxed space-y-2">
              <div className="flex items-center gap-2 text-[#00FF41] mb-1">
                <Activity size={10} />
                <span className="font-mono text-[9px] uppercase tracking-widest font-bold">LIVE_SIGNAL</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between border-b border-[#2A2A30] py-1 text-white/70">
                  <span>ASML.AS</span>
                  <span className="text-[#00FF41] font-mono">+2.4%</span>
                </div>
                <div className="flex justify-between border-b border-[#2A2A30] py-1 text-white/70">
                  <span>SAP.DE</span>
                  <span className="text-[#00FF41] font-mono">+1.8%</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'MKTS':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-2">
              {['S&P 500', 'NASDAQ', 'FTSE 100', 'DAX'].map(index => (
                <div key={index} className="p-2 bg-[#1F1F23] border border-[#2A2A30] rounded-lg">
                  <div className="text-[9px] text-[#71717A] uppercase font-mono">{index}</div>
                  <div className="text-xs font-bold text-white tracking-tighter">
                    {Math.floor(Math.random() * 15000 + 4000).toLocaleString()}
                  </div>
                  <div className="text-[9px] text-[#00FF41] font-mono">+0.45%</div>
                </div>
              ))}
            </div>
            <div className="h-24 w-full bg-[#1F1F23] border border-[#2A2A30] rounded-lg relative overflow-hidden">
               <svg className="w-full h-full opacity-30">
                  <path d="M 0 60 Q 20 40 40 50 T 80 30 T 120 40 T 160 20 T 200 40 T 240 10 L 240 100 L 0 100 Z" fill="#00FF41" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-[#00FF41] bg-black/50 px-2 py-0.5 rounded border border-[#00FF41]/20">AGGREGATE_TREMDS</span>
               </div>
            </div>
          </motion.div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
            <Zap size={32} className="mb-2 text-[#00FF41]" />
            <span className="text-[10px] font-mono">MODULE_RESTRICTED</span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[800px] space-y-12 py-12 px-4 selection:bg-[#00FF41]/30">
      <div className="text-center space-y-3 max-w-lg">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#16161A] border border-[#27272A] mb-2"
        >
          <Smartphone size={16} className="text-[#00FF41]" />
          <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">Institutional_Preview</span>
        </motion.div>
        <h2 className="text-4xl font-extrabold tracking-tighter text-white">
          BITA_OS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF41] to-blue-500">MOBILE</span>
        </h2>
        <p className="text-[#71717A] text-base leading-relaxed">
          The full power of the RAG Intelligence Hub, encrypted and optimized for institutional-grade mobile telemetry.
        </p>
      </div>

      <div className="relative group">
        {/* Outer Glow */}
        <div className="absolute -inset-4 bg-[#00FF41]/10 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
        
        {/* Device Frame */}
        <div className="relative w-[340px] h-[680px] bg-[#050505] border-[12px] border-[#1F1F23] rounded-[55px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
          {/* Notch / Dynamic Island Simulation */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1F1F23] rounded-b-3xl z-30 flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#050505]" />
            <div className="w-8 h-1.5 rounded-full bg-[#050505]" />
          </div>

          {/* Status Bar */}
          <div className="px-8 pt-4 pb-2 flex justify-between items-center text-[10px] font-bold text-white/90 z-20">
             <div className="font-mono">{currentTime}</div>
             <div className="flex items-center gap-1.5 opacity-80">
                <Signal size={10} />
                <Wifi size={10} />
                <Battery size={10} className="rotate-90" />
             </div>
          </div>
          
          {/* Inner Screen Content */}
          <div className="flex-1 flex flex-col px-6 pt-2 font-sans overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00FF41] flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,255,65,0.4)]">
                  <TerminalIcon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-mono font-black text-xs tracking-tighter leading-none text-white">BITA_MOBILE</h3>
                  <span className="text-[8px] font-mono text-[#00FF41] uppercase tracking-widest">LIVE_CONNECTION</span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-[#16161A] border border-[#27272A] flex items-center justify-center text-[#71717A] hover:text-white transition-colors">
                <Menu size={18} />
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
              <AnimatePresence mode="wait">
                 {renderContent()}
              </AnimatePresence>
            </div>

            {/* Sticky Input Area (Chat Style) */}
            <div className="py-4 mt-auto">
              <div className="bg-[#16161A] border border-[#27272A] rounded-2xl p-1 flex items-center gap-1 shadow-lg">
                <input 
                  type="text" 
                  placeholder="Query BITA Agent..." 
                  className="flex-1 bg-transparent border-none outline-none text-xs text-white px-3 py-2 font-mono placeholder:text-[#3F3F46]"
                  readOnly
                />
                <button className="w-8 h-8 rounded-xl bg-[#00FF41] flex items-center justify-center text-black transition-transform hover:scale-105 active:scale-95">
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Bottom Tab Bar */}
            <div className="border-t border-white/[0.05] flex items-center justify-between px-2 pt-4 pb-8 mb-2">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 transition-all duration-300",
                    activeTab === item.id ? "text-[#00FF41] scale-110" : "text-[#52525B] hover:text-white"
                  )}
                >
                  <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest",
                    activeTab === item.id ? "opacity-100" : "opacity-0"
                  )}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Side Buttons simulation */}
        <div className="absolute top-[120px] -left-[14px] w-[3px] h-10 bg-[#1F1F23] rounded-l-lg" />
        <div className="absolute top-[180px] -left-[14px] w-[3px] h-16 bg-[#1F1F23] rounded-l-lg" />
        <div className="absolute top-[180px] -right-[14px] w-[3px] h-20 bg-[#1F1F23] rounded-r-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[
          { icon: Fingerprint, label: "BIOMETRIC_VAULT", desc: "Military-grade data isolation" },
          { icon: Radio, label: "SAT_LINK", desc: "Redundant connection mesh" },
          { icon: ShieldCheck, label: "SOVEREIGN_CLEARED", desc: "Institutional compliance" }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#09090B] border border-white/[0.05] p-5 rounded-3xl flex flex-col items-center text-center group hover:bg-[#111114] transition-all">
            <item.icon className="text-[#00FF41] mb-3 group-hover:scale-110 transition-transform" size={24} />
            <h4 className="text-white font-mono text-[10px] font-bold uppercase tracking-widest mb-1">{item.label}</h4>
            <p className="text-[#71717A] text-[11px] font-mono">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

