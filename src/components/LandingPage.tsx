import React from 'react';
import { 
  Terminal, 
  Shield, 
  BarChart3, 
  Zap, 
  Layers, 
  MoveRight, 
  Cpu, 
  Globe2,
  Workflow,
  Network,
  Activity,
  Code2,
  Bot,
  Brain,
  ListChecks,
  MessageSquare,
  Sparkles,
  Database,
  Cloud,
  Search,
  FileText,
  User as UserIcon,
  Play,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onGetStarted: () => void;
}

const RAGArchitecture = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(false);

  const steps = [
    {
      id: 1,
      title: "User Input",
      desc: "User submits a natural language prompt and query through the terminal interface.",
      icon: UserIcon,
      nodes: ['user', 'ui'],
      color: "text-blue-400"
    },
    {
      id: 2,
      title: "Task Routing",
      desc: "The Aggregator Agent receives the query and determines the execution requirements.",
      icon: MessageSquare,
      nodes: ['ui', 'aggregator'],
      color: "text-green-400"
    },
    {
      id: 3,
      title: "Memory & Planning",
      desc: "Agent checks long-term history and constructs a plan using CoT (Chain of Thought) or ReACT frameworks.",
      icon: ListChecks,
      nodes: ['aggregator', 'planning', 'memory'],
      color: "text-purple-400"
    },
    {
      id: 4,
      title: "MCP Tool Fetching",
      desc: "Sub-agents execute tools across MCP servers (Local, Web Search, Cloud Engines) to retrieve grounded data.",
      icon: Database,
      nodes: ['aggregator', 'agents', 'mcp'],
      color: "text-[#00FF41]"
    },
    {
      id: 5,
      title: "Model Synthesis",
      desc: "Prompt + Query + Enhanced Context are sent to the LLM (Gemini, GPT) for final intelligent synthesis.",
      icon: Sparkles,
      nodes: ['aggregator', 'models'],
      color: "text-orange-400"
    },
    {
      id: 6,
      title: "Response Delivery",
      desc: "The final synthesized intelligence is delivered back to the terminal for the user.",
      icon: Zap,
      nodes: ['aggregator', 'ui'],
      color: "text-blue-400"
    }
  ];

  React.useEffect(() => {
    let interval: any;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 px-4">
      {/* Diagram Area */}
      <div className="relative h-[600px] mb-12 bg-[#050505]/50 border border-white/[0.05] rounded-3xl p-8 overflow-hidden">
        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>
          <g className="text-[#3F3F46]">
            {/* User to UI */}
            <path d="M 120 100 L 300 100" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            {/* UI to Aggregator */}
            <path d="M 500 100 L 500 250" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            {/* Planning & Memory to Aggregator */}
            <path d="M 750 200 L 600 300" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 750 400 L 600 300" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            {/* Aggregator to Models */}
            <path d="M 400 300 L 200 300" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            {/* Aggregator to Agents */}
            <path d="M 500 350 L 500 450" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          </g>
        </svg>

        {/* Nodes */}
        {/* User */}
        <div id="node-user" className={cn(
          "absolute top-10 left-20 transition-all duration-500",
          steps[activeStep].nodes.includes('user') ? "scale-110 opacity-100" : "scale-100 opacity-40 grayscale"
        )}>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#16161A] border border-[#27272A] flex items-center justify-center">
              <UserIcon size={32} className="text-blue-400" />
            </div>
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">USER</span>
          </div>
        </div>

        {/* Chat UI */}
        <div id="node-ui" className={cn(
          "absolute top-10 left-[40%] right-[20%] transition-all duration-500",
          steps[activeStep].nodes.includes('ui') ? "scale-110 opacity-100" : "scale-100 opacity-40 grayscale"
        )}>
          <div className="w-full bg-[#16161A] border border-[#27272A] rounded-xl p-4 shadow-2xl">
            <div className="flex gap-1 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
            </div>
            <div className="h-1 bg-[#27272A] rounded w-full mb-2" />
            <div className="h-1 bg-[#27272A] rounded w-2/3" />
          </div>
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest mt-2 block text-center">TERMINAL_INTERFACE</span>
        </div>

        {/* Aggregator Agent */}
        <div id="node-aggregator" className={cn(
          "absolute top-[45%] left-[45%] transition-all duration-500 z-10",
          steps[activeStep].nodes.includes('aggregator') ? "scale-125 opacity-100" : "scale-100 opacity-60 grayscale"
        )}>
          <div className="group relative">
            <div className="absolute -inset-4 bg-[#00FF41]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            <div className="w-24 h-24 rounded-2xl bg-[#00FF41] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,65,0.3)] relative">
              <Bot size={48} className="text-black" />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#00FF41] uppercase tracking-widest mt-3 block text-center">AGGREGATOR_AGENT</span>
          </div>
        </div>

        {/* Memory & Planning */}
        <div className="absolute right-10 top-[20%] space-y-20">
          <div id="node-memory" className={cn(
            "transition-all duration-500",
            steps[activeStep].nodes.includes('memory') ? "scale-110 opacity-100" : "scale-100 opacity-40 grayscale"
          )}>
            <div className="flex items-center gap-4 bg-[#16161A] p-4 border border-[#8B5CF6]/30 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                <Brain size={24} className="text-[#8B5CF6]" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[10px] text-white/50">MEMORY</div>
                <div className="text-xs font-bold text-white uppercase italic">Context_Recall</div>
              </div>
            </div>
          </div>

          <div id="node-planning" className={cn(
            "transition-all duration-500",
            steps[activeStep].nodes.includes('planning') ? "scale-110 opacity-100" : "scale-100 opacity-40 grayscale"
          )}>
            <div className="flex items-center gap-4 bg-[#16161A] p-4 border border-[#F59E0B]/30 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
                <ListChecks size={24} className="text-[#F59E0B]" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[10px] text-white/50">PLANNING</div>
                <div className="text-xs font-bold text-white uppercase italic">CoT_Execution</div>
              </div>
            </div>
          </div>
        </div>

        {/* Generative Models */}
        <div id="node-models" className="absolute left-10 top-[45%] space-y-4">
          <div className={cn(
            "transition-all duration-500",
            steps[activeStep].nodes.includes('models') ? "scale-110 opacity-100" : "scale-100 opacity-40 grayscale"
          )}>
             <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                   <div className="w-10 h-10 rounded bg-[#16161A] border border-[#27272A] flex items-center justify-center">
                      <Sparkles size={20} className="text-[#00FF41]" />
                   </div>
                   <div className="w-10 h-10 rounded bg-[#16161A] border border-[#27272A] flex items-center justify-center">
                      <Sparkles size={20} className="text-[#00A3FF]" />
                   </div>
                   <div className="w-10 h-10 rounded bg-[#16161A] border border-[#27272A] flex items-center justify-center">
                      <Sparkles size={20} className="text-[#8B5CF6]" />
                   </div>
                </div>
                <span className="text-[10px] font-mono text-white/50 text-center uppercase tracking-widest">GEN_MODELS</span>
             </div>
          </div>
        </div>

        {/* Sub-Agents & MCP */}
        <div id="node-agents" className={cn(
          "absolute bottom-10 left-[20%] right-[20%] flex justify-center gap-12 transition-all duration-500",
          steps[activeStep].nodes.includes('agents') ? "scale-110 opacity-100" : "scale-100 opacity-40 grayscale"
        )}>
          {['Local', 'Web', 'Cloud'].map((type, i) => (
            <div key={type} className="flex flex-col items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-[#16161A] border border-[#27272A] flex items-center justify-center">
                  <Network size={20} className="text-[#00FF41]/70" />
               </div>
               <div className="px-3 py-1.5 bg-[#0D0D0F] border border-[#27272A] rounded font-mono text-[9px] text-[#A1A1AA]">
                  MCP_{type.toUpperCase()}
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls & Steps Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={cn(
                  "px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all",
                  isAutoPlaying ? "bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/30" : "bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30"
                )}
             >
                {isAutoPlaying ? <RotateCcw size={14} /> : <Play size={14} />}
                {isAutoPlaying ? "STOP_SIMULATION" : "PLAY_WORKFLOW"}
             </button>
             <div className="flex gap-1">
                {steps.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => { setActiveStep(i); setIsAutoPlaying(false); }}
                    className={cn(
                      "w-8 h-1.5 rounded-full transition-all",
                      activeStep === i ? "bg-[#00FF41] w-12" : "bg-[#27272A]"
                    )}
                  />
                ))}
             </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
               <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16161A] text-[10px] font-mono font-bold border border-white/[0.05]", steps[activeStep].color)}>
                  STEP_{steps[activeStep].id}_06
               </div>
               <h3 className="text-3xl font-bold text-white tracking-tight">{steps[activeStep].title}</h3>
               <p className="text-[#A1A1AA] text-lg leading-relaxed">{steps[activeStep].desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4">
           {steps.map((step, i) => (
             <button 
                key={step.id}
                onClick={() => { setActiveStep(i); setIsAutoPlaying(false); }}
                className={cn(
                  "p-4 rounded-xl border transition-all text-left group",
                  activeStep === i 
                    ? "bg-[#16161A] border-[#00FF41]/30 shadow-[0_0_20px_rgba(0,255,65,0.1)]" 
                    : "bg-[#09090B] border-[#27272A] hover:border-[#3F3F46]"
                )}
             >
                <step.icon size={20} className={cn("mb-2 transition-transform group-hover:scale-110", activeStep === i ? step.color : "text-[#71717A]")} />
                <div className="text-[10px] font-mono font-bold text-[#52525B] mb-1">STAGE_{step.id}</div>
                <div className={cn("text-xs font-bold", activeStep === i ? "text-white" : "text-[#71717A]")}>{step.title.toUpperCase()}</div>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

const DataLearningSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section id="strategy" className="container mx-auto px-6 py-24 border-t border-white/[0.05]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="absolute inset-0 bg-[#00FF41]/5 blur-3xl rounded-full" />
          <div className="relative bg-[#0D0D0F] border border-[#1F1F23] rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-[#1F1F23] pb-4">
              <Database className="text-[#00FF41]" size={24} />
              <h3 className="text-xl font-bold text-white font-mono uppercase tracking-widest">DATA_LEARNING_PIPELINE</h3>
            </div>
            
            <div className="space-y-6">
              {[
                { 
                  icon: FileText, 
                  title: 'Multimodal Ingestion', 
                  desc: 'Drop PDF, MD, or TXT research into the terminal. Support for raw financial identifier extraction.',
                  color: 'text-blue-400' 
                },
                { 
                  icon: Layers, 
                  title: 'LangChain Semantic Splitting', 
                  desc: 'Large files are processed via RecursiveCharacterTextSplitter. (Chunk: 1000, Overlap: 200).',
                  color: 'text-[#00FF41]' 
                },
                { 
                  icon: Brain, 
                  title: 'Vector Embedding', 
                  desc: 'Google Gemini converts semantic chunks into high-dimensional numerical representations.',
                  color: 'text-purple-400' 
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className={cn("shrink-0 w-10 h-10 rounded bg-[#16161A] border border-white/[0.05] flex items-center justify-center", item.color)}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-[#71717A] text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#00FF41]/5 border border-[#00FF41]/10 rounded-xl space-y-2">
               <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#00FF41]">
                  <Zap size={14} />
                  ORCHESTRATOR_LOG: CHUNKING_COMPLETED
               </div>
               <div className="h-1.5 w-full bg-[#1F1F23] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-full bg-[#00FF41]" 
                  />
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 order-1 lg:order-2">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded bg-[#00FF41]/10 border border-[#00FF41]/20 text-[#00FF41] text-[10px] font-mono font-bold uppercase tracking-widest">
              Contextual_Intelligence
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">Teach BITA Your <br/> Proprietary View</h2>
            <p className="text-[#A1A1AA] text-lg leading-relaxed">
              Upload your private research documents, market notes, and Excel summaries. BITA uses advanced RAG (Retrieval-Augmented Generation) to merge your qualitative insights with real-time quantitative telemetry.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-[#16161A] border border-white/[0.05] rounded-xl hover:border-[#00FF41]/30 transition-colors">
                <div className="text-3xl font-bold text-white mb-1">1000</div>
                <div className="text-[10px] font-mono text-[#52525B] uppercase font-bold tracking-widest">CHUNK_SIZE_CHAR</div>
             </div>
             <div className="p-4 bg-[#16161A] border border-white/[0.05] rounded-xl hover:border-[#00FF41]/30 transition-colors">
                <div className="text-3xl font-bold text-white mb-1">200</div>
                <div className="text-[10px] font-mono text-[#52525B] uppercase font-bold tracking-widest">OVERLAP_RATIO</div>
             </div>
          </div>

          <button 
            onClick={onGetStarted}
            className="flex items-center gap-3 px-6 py-3 bg-[#1F1F23] text-white border border-white/[0.1] rounded-lg text-sm font-bold hover:bg-[#2A2A30] hover:border-[#00FF41]/30 transition-all group"
          >
            START_LEARNING_SESSION
            <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#E4E4E7] selection:bg-[#00FF41]/30 selection:text-white overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#16161A_1px,transparent_1px),linear-gradient(to_bottom,#16161A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00FF41]/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed top-[30%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center bg-[#050505]/60 backdrop-blur-xl border-b border-white/[0.05] rounded-b-2xl mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00FF41] to-[#00A3FF] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.2)]">
            <Terminal className="text-black" size={24} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">BITA_INTELLIGENCE</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Infrastructure', 'Self-Learning', 'Analytics', 'APIs'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace('self-learning', 'strategy')}`} className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors">{item}</a>
          ))}
          <button 
            onClick={onGetStarted}
            className="px-5 py-2.5 bg-[#16161A] border border-[#27272A] rounded-md text-xs font-bold text-white hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all"
          >
            LOGIN_TERMINAL
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-16 pb-24">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161A] border border-[#27272A] text-gray-300 text-[11px] font-mono font-bold"
            >
              <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
              ORCHESTRATING_QUANTITATIVE_ALPHA_v4.5
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[1.05]"
            >
              The AI Operating System for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF41] via-[#00A3FF] to-[#8B5CF6]">
                Financial Intelligence.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#A1A1AA] text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Bridge the gap between qualitative research and quantitative execution with our advanced RAG-Agentic terminal. Built for elite investment universes and multi-factor strategies.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            >
              <button 
                onClick={onGetStarted}
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00FF41] to-[#00CC33] text-black rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_30px_rgba(0,255,65,0.2)]"
              >
                PROVISION_TERMINAL_ACCESS
                <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onGetStarted} // Redirect to login for now, where they can see docs
                className="w-full sm:w-auto px-8 py-4 bg-[#16161A] border border-[#27272A] rounded-lg text-white font-bold text-sm hover:bg-[#1C1C21] transition-all"
              >
                VIEW_ARM_ARCHITECTURE
              </button>
            </motion.div>
          </div>

          {/* Floating Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24">
            {[
              { icon: Zap, label: 'L_FEED', val: '24ms_LATENCY', color: 'text-[#00FF41]', border: 'border-[#00FF41]/20', bg: 'bg-[#00FF41]/5' },
              { icon: BarChart3, label: 'V_SEARCH', val: '8.4M_VECTORS', color: 'text-[#00A3FF]', border: 'border-[#00A3FF]/20', bg: 'bg-[#00A3FF]/5' },
              { icon: Shield, label: 'A_GROUND', val: 'SOC2_TYPE_II', color: 'text-[#8B5CF6]', border: 'border-[#8B5CF6]/20', bg: 'bg-[#8B5CF6]/5' },
              { icon: Globe2, label: 'U_ACCESS', val: '84_EXCHANGES', color: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20', bg: 'bg-[#F59E0B]/5' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className={cn("p-5 rounded-2xl border backdrop-blur-sm transition-all hover:scale-[1.02]", stat.border, stat.bg)}
              >
                <div className="flex items-center gap-2 text-[11px] font-mono text-white/70 mb-2">
                  <stat.icon size={14} className={stat.color} />
                  {stat.label}
                </div>
                <div className="text-base font-bold text-white font-mono">{stat.val}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Data Learning Section (INSERTED HERE) */}
        <DataLearningSection onGetStarted={onGetStarted} />

        {/* Technical Features Section */}
        <section id="infrastructure" className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#D8B4FE] text-[10px] font-mono font-bold">
                  ORCHESTRATOR_ENGINE
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">RAG-Agentic <br/> Core Architecture</h2>
                <p className="text-[#A1A1AA] text-lg leading-relaxed">
                  The BITA terminal doesn't just display data—it understands it. Our proprietary retrieval engine maps thematic megatrends to specific quantitative factor loads in real-time.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Layers, title: 'Multi-Factor Scaffolding', desc: 'Auto-calibrate universes based on sectoral rotation, momentum, and sentiment drifts combined with value factors.' },
                  { icon: Workflow, title: 'Semantic Factor Matching', desc: 'Uses Google Gemini Embeddings to connect plain-language economic ideas directly to security exposures.' },
                  { icon: Activity, title: 'Live Backtesting Simulation', desc: 'Run historical simulations instantly within the chat terminal with accurate point-in-time reference data.' }
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-5 bg-[#0D0D0F]/80 p-4 border border-white/[0.05] rounded-xl hover:border-white/[0.1] transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#16161A] to-[#1C1C21] border border-[#27272A] flex items-center justify-center shrink-0">
                      <feature.icon className="text-[#00FF41]" size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-base">{feature.title}</h4>
                      <p className="text-sm text-[#71717A] leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF41] via-[#00A3FF] to-[#8B5CF6] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-[#09090B] border border-[#27272A] rounded-3xl p-8 h-[480px] overflow-hidden flex flex-col transform transition-transform group-hover:rotate-y-2 group-hover:rotate-x-2">
                {/* Mock Terminal Interface */}
                <div className="flex items-center gap-2 mb-6 border-b border-[#27272A] pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-[11px] font-mono text-[#71717A] flex-1 text-center">bita-terminal ~ /srv/quant</span>
                </div>
                <div className="space-y-5 font-mono text-sm flex-1 overflow-auto custom-scrollbar">
                  <div>
                    <span className="text-[#00FF41]">➜</span> <span className="text-blue-400">~</span> <span className="text-white">bitactl universe generate --theme "AI Networking"</span>
                  </div>
                  <div className="text-[#71717A] text-xs">
                    [+] SEMANTIC_RAG_ENGINE: Parsing user intent...<br/>
                    [+] MAPPING: "AI Networking" &rarr; ["Optics", "Silicon Photonics", "InfiniBand"]<br/>
                    [+] VECTOR_SEARCH: Querying 8.4M embeddings space...
                  </div>
                  <div className="text-white text-xs border-l-2 border-purple-500 pl-3">
                    FOUND_ENTITIES: 42 Securities<br/>
                    APPLYING_QUANT_FILTERS: (MarketCap &gt; 5B) AND (Vol_30D &lt; 40%)
                  </div>
                  <div>
                    <span className="text-green-400 text-xs">SUCCESS: UNIVERSE_CONSTRUCTED</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {['NVDA', 'AVGO', 'ANET', 'MRVL', 'COHR', 'LITE'].map(ticker => (
                      <div key={ticker} className="px-3 py-2 bg-[#16161A] border border-[#27272A] rounded flex justify-between items-center">
                        <span className="text-white font-bold">{ticker}</span>
                        <span className="text-[#00FF41] text-[10px]">+1.2%</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-blue-400 text-xs pt-2 animate-pulse">
                    <span className="text-white">bitactl</span> port --optimize --target-vol 12% _
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agentic RAG Architecture Section */}
        <section id="strategy" className="container mx-auto px-6 py-24 border-t border-white/[0.05]">
          <div className="text-center mb-16 space-y-4">
             <div className="inline-block px-3 py-1 rounded bg-[#00FF41]/10 border border-[#00FF41]/20 text-[#00FF41] text-[10px] font-mono font-bold uppercase">
                Architecture_Deep_Dive
             </div>
             <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">How Agentic RAG Works</h2>
             <p className="text-[#A1A1AA] max-w-2xl mx-auto text-lg">
                Explore the autonomous orchestration layer that powers BITA's financial research and investment strategy generation.
             </p>
          </div>

          <RAGArchitecture />
        </section>

        {/* API Services Section */}
        <section id="apis" className="container mx-auto px-6 py-24 mb-16">
          <div className="text-center mb-16 space-y-4">
             <div className="inline-block px-3 py-1 rounded bg-[#00A3FF]/10 border border-[#00A3FF]/20 text-[#00A3FF] text-[10px] font-mono font-bold">
                DEVELOPER_ECOSYSTEM
             </div>
             <h2 className="text-4xl font-bold text-white tracking-tight">Financial API Services</h2>
             <p className="text-[#A1A1AA] max-w-2xl mx-auto">Integrate BITA's intelligence directly into your own applications, trading algorithms, or internal dashboards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Universe API",
                method: "POST",
                endpoint: "/api/universe/construct",
                desc: "Build highly customized investment universes combining fundamental factors and semantic similarities.",
                color: "text-[#00FF41]",
                bg: "bg-[#00FF41]/10",
                border: "border-[#00FF41]/30"
              },
              {
                title: "Thematics API",
                method: "GET",
                endpoint: "/api/thematics/exposure",
                desc: "Get real-time scoring of any equity's exposure to custom-defined macro or micro trends.",
                color: "text-[#00A3FF]",
                bg: "bg-[#00A3FF]/10",
                border: "border-[#00A3FF]/30"
              },
              {
                title: "Backtesting API",
                method: "POST",
                endpoint: "/api/simulate/strategy",
                desc: "Lightning-fast historical simulation engine with built-in transaction costs and corporate action adjustments.",
                color: "text-[#8B5CF6]",
                bg: "bg-[#8B5CF6]/10",
                border: "border-[#8B5CF6]/30"
              }
            ].map((api) => (
              <div key={api.title} className="bg-[#09090B] border border-[#27272A] p-6 rounded-2xl hover:border-[#3F3F46] transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Code2 size={64} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{api.title}</h3>
                <p className="text-sm text-[#A1A1AA] mb-6 min-h-[40px]">{api.desc}</p>
                
                <div className="bg-[#050505] rounded-lg p-3 font-mono text-[11px] flex items-center gap-3 border border-[#16161A]">
                  <span className={cn("px-2 py-0.5 rounded font-bold", api.bg, api.color)}>{api.method}</span>
                  <span className="text-[#D4D4D8] truncate">{api.endpoint}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="relative z-10 border-t border-white/[0.05] bg-[#050505] pt-12 pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Terminal className="text-[#00FF41]" size={20} />
              <span className="font-bold tracking-tight text-white">BITA_INTELLIGENCE</span>
            </div>
            <div className="flex gap-6 text-sm text-[#A1A1AA]">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">API Status</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
          <div className="text-center text-[10px] font-mono text-[#52525B]">
            COPYRIGHT © 2026 BITA_COMMAND_AGENT. SECURE_RELAY_PROTECTED. ALL_SIGNALS_ENCRYPTED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
