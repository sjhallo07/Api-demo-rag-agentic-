import React from 'react';
import { 
  Terminal, 
  Shield, 
  BarChart3, 
  Zap, 
  Layers, 
  MoveRight, 
  Cpu, 
  Globe2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#E4E4E7] selection:bg-[#00FF41]/30 selection:text-white">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#16161A_1px,transparent_1px),linear-gradient(to_bottom,#16161A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-8 flex justify-between items-center bg-[#050505]/50 backdrop-blur-md sticky top-0 border-b border-white/[0.03]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00FF41] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.2)]">
            <Terminal className="text-black" size={24} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">BITA_INTELLIGENCE</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Infrastructure', 'Strategy', 'Analytics', 'Docs'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-mono text-[#52525B] hover:text-[#00FF41] transition-colors">{item.toUpperCase()}</a>
          ))}
          <button 
            onClick={onGetStarted}
            className="px-5 py-2 bg-[#16161A] border border-[#1F1F23] rounded-md text-xs font-bold hover:border-[#52525B] transition-all"
          >
            LOGIN_TERMINAL
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="container mx-auto px-6 pt-24 pb-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF41]/5 border border-[#00FF41]/20 text-[#00FF41] text-[10px] font-mono font-bold"
            >
              <Cpu size={12} />
              ORCHESTRATING_QUANTITATIVE_ALPHA_v4.2
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]"
            >
              The Operating System for <span className="text-[#00FF41]">Financial Intelligence.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#71717A] text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Bridge the gap between qualitative research and quantitative execution with our RAG-Agentic terminal. Built for elite investment universes.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button 
                onClick={onGetStarted}
                className="group w-full sm:w-auto px-8 py-4 bg-[#00FF41] text-black rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#00E53B] transition-all shadow-[0_0_30px_rgba(0,255,65,0.15)]"
              >
                PROVISION_TERMINAL_ACCESS
                <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-[#16161A] border border-[#1F1F23] rounded-lg text-white font-bold text-sm hover:border-[#52525B] transition-all">
                VIEW_DOCUMENTATION
              </button>
            </motion.div>
          </div>

          {/* Floating Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-32">
            {[
              { icon: Zap, label: 'L_FEED', val: '24ms_LATENCY', color: 'text-[#00FF41]' },
              { icon: BarChart3, label: 'V_SEARCH', val: '8.4M_VECTORS', color: 'text-blue-400' },
              { icon: Shield, label: 'A_GROUND', val: 'SOC2_TYPE_II', color: 'text-purple-400' },
              { icon: Globe2, label: 'U_ACCESS', val: '84_EXCHANGES', color: 'text-orange-400' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="p-4 bg-[#0D0D0F] border border-[#1F1F23] rounded-xl space-y-1 group hover:border-[#52525B] transition-colors"
              >
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#52525B]">
                  <stat.icon size={12} className={stat.color} />
                  {stat.label}
                </div>
                <div className="text-sm font-bold text-white group-hover:text-[#00FF41] transition-colors font-mono">{stat.val}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technical Features Section */}
        <section id="infrastructure" className="container mx-auto px-6 py-24 border-t border-white/[0.03]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">RAG-Agentic Core Architecture</h2>
                <p className="text-[#71717A] leading-relaxed">
                  The BITA terminal doesn't just display data—it understands it. Our proprietary retrieval engine maps thematic megatrends to specific quantitative factor loads in real-time.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Layers, title: 'Multi-Factor Scaffolding', desc: 'Auto-calibrate universes based on sectoral rotation and sentiment drifts.' },
                  { icon: Globe2, title: 'Geographic Grounding', desc: 'Global instrument coverage with point-in-time financial identifier retrieval.' },
                  { icon: Shield, title: 'Identified Device Verification', desc: 'Secure institutional access via advanced biometric and device fingerprinting.' }
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#16161A] border border-[#1F1F23] flex items-center justify-center shrink-0">
                      <feature.icon className="text-[#00FF41]" size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">{feature.title}</h4>
                      <p className="text-xs text-[#52525B] leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00FF41] to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-[#0D0D0F] border border-[#1F1F23] rounded-2xl p-8 h-[400px] overflow-hidden">
                {/* Mock Terminal Interface */}
                <div className="flex items-center gap-1.5 mb-6">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  <span className="ml-2 text-[10px] font-mono text-[#52525B]">BITA_REPL_v4.2.0</span>
                </div>
                <div className="space-y-4 font-mono text-xs">
                  <p className="text-[#00FF41]">bitactl universe init --sector="Technology"</p>
                  <p className="text-[#52525B]">[+] INITIALIZING_VECTOR_ENGINE...</p>
                  <p className="text-[#52525B]">[+] FETCHING_TICKER_MAP_8.4M...</p>
                  <p className="text-white">SCANNING THEMATIC OVERLAP: "GPU_TRANSITION"</p>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="h-6 bg-[#16161A] border border-[#1F1F23] rounded animate-pulse" />
                    ))}
                  </div>
                  <p className="text-blue-400 mt-4 underline underline-offset-4">LINK_ESTABLISHED: NVDA_US_EQUITY</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-6 py-12 border-t border-white/[0.03] text-center text-[10px] font-mono text-[#52525B]">
        COPYRIGHT © 2026 BITA_COMMAND_AGENT. SECURE_RELAY_PROTECTED. ALL_SIGNALS_ENCRYPTED.
      </footer>
    </div>
  );
};

export default LandingPage;
