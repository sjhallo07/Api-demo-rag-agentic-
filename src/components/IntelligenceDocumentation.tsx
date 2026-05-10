
import React from 'react';
import { 
  FileText, 
  Layers, 
  Workflow, 
  BrainCircuit, 
  ShieldCheck, 
  Database, 
  Code2, 
  Terminal,
  Search,
  Cpu,
  Share2,
  FileJson,
  Blocks
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const DOC_SECTIONS = [
  {
    id: 'data-ingestion',
    title: 'Data Ingestion Protocol',
    icon: Database,
    content: `BITA supports multimodal data ingestion for universe construction and qualitative research. 
    Users can provide context through two primary channels:`,
    subsections: [
      {
        title: 'Transient Context (Chat)',
        desc: 'Upload PDF, TXT, MD, or Images directly to the chat terminal. These files are processed recursively and used as active context for the current session.'
      },
      {
        title: 'Persistent Knowledge (Insights)',
        desc: 'Add structured research notes or macro views to the Knowledge Base. These are indexed and retrieved across all agentic executions.'
      }
    ]
  },
  {
    id: 'processing',
    title: 'Semantic Processing & Chunking',
    icon: Layers,
    content: `To handle large financial documents efficiently, BITA utilizes LangChain's RecursiveCharacterTextSplitter.`,
    details: [
      { label: 'Chunk Size', val: '1000 characters', desc: 'Optimal length for capturing distinct financial arguments.' },
      { label: 'Chunk Overlap', val: '200 characters', desc: 'Preserves context between neighboring segments.' },
      { label: 'Separators', val: '["\\n\\n", "\\n", " ", ""]', desc: 'Splits naturally at paragraph or sentence boundaries.' }
    ]
  },
  {
    id: 'rag-flow',
    title: 'The RAG Pipeline',
    icon: Workflow,
    content: 'The Retrieval Augmented Generation pipeline ensures that every assistant response is grounded in provided data + universe telemetry.',
    steps: [
      { step: 1, title: 'Vectorization', desc: 'Gemini Embedding models convert text chunks into 1536-dimensional vectors.' },
      { step: 2, title: 'Semantic Search', desc: 'Cosine similarity identifies top-K relevant chunks from your documents.' },
      { step: 3, title: 'Synthesis', desc: 'The BITA Orchestrator combines query + context + universe data for final reasoning.' }
    ]
  }
];

export default function IntelligenceDocumentation() {
  return (
    <div className="flex flex-col h-full bg-[#050505] overflow-y-auto custom-scrollbar">
      <div className="p-8 max-w-5xl mx-auto w-full space-y-12 pb-24">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#00FF41]/10 border border-[#00FF41]/20 text-[#00FF41] text-[10px] font-mono font-bold uppercase tracking-widest">
            CORE_ARCHITECTURE_v4.2
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Intelligence & RAG Documentation</h1>
          <p className="text-[#A1A1AA] text-lg max-w-3xl leading-relaxed">
            Understand the underlying mechanics of how BITA processes financial data, constructs semantic embeddings, and generates agentic investment strategies.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'EMBEDDING_ENGINE', val: 'text-embedding-004', icon: Cpu },
             { label: 'VECTOR_DIMENSIONS', val: '1536_NODE_GRID', icon: Blocks },
             { label: 'SPLITTER_LOGIC', val: 'LANGCHAIN_RECURSIVE', icon: Share2 },
             { label: 'SUPPORTED_EXT', val: 'PDF_TXT_MD_CSV', icon: FileJson },
           ].map((stat, i) => (
             <div key={i} className="p-4 bg-[#0D0D0F] border border-[#1F1F23] rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-[9px] font-mono text-[#52525B]">
                   <stat.icon size={12} className="text-[#3B82F6]" />
                   {stat.label}
                </div>
                <div className="text-xs font-bold text-white font-mono">{stat.val}</div>
             </div>
           ))}
        </div>

        {/* Main Sections */}
        <div className="space-y-16">
          {DOC_SECTIONS.map((section, idx) => (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              key={section.id} 
              className="space-y-6"
            >
              <div className="flex items-center gap-4 border-b border-[#1F1F23] pb-4">
                 <div className="w-10 h-10 rounded-lg bg-[#16161A] border border-[#1F1F23] flex items-center justify-center">
                    <section.icon size={20} className="text-[#00FF41]" />
                 </div>
                 <h2 className="text-2xl font-bold text-white tracking-tight">{section.title}</h2>
              </div>
              
              <p className="text-[#A1A1AA] leading-relaxed max-w-3xl">{section.content}</p>

              {section.subsections && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {section.subsections.map((sub, i) => (
                     <div key={i} className="p-5 bg-[#0A0A0B] border border-[#1F1F23] rounded-xl space-y-2 hover:border-[#00FF41]/30 transition-colors group">
                        <h4 className="font-bold text-white text-sm group-hover:text-[#00FF41] transition-colors uppercase font-mono tracking-tighter">{sub.title}</h4>
                        <p className="text-xs text-[#71717A] leading-relaxed">{sub.desc}</p>
                     </div>
                   ))}
                </div>
              )}

              {section.details && (
                <div className="space-y-3">
                   {section.details.map((detail, i) => (
                     <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#0D0D0F] border border-[#1F1F23] rounded-lg gap-2">
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-mono text-[#52525B] w-28 uppercase">{detail.label}</span>
                           <span className="text-xs font-bold text-white font-mono">{detail.val}</span>
                        </div>
                        <span className="text-[10px] text-[#71717A] italic">{detail.desc}</span>
                     </div>
                   ))}
                </div>
              )}

              {section.steps && (
                <div className="relative space-y-4">
                   {section.steps.map((step, i) => (
                     <div key={i} className="flex gap-6 items-start relative overflow-hidden group">
                        <div className="flex flex-col items-center shrink-0">
                           <div className="w-8 h-8 rounded-full bg-[#1F1F23] border border-[#27272A] flex items-center justify-center text-[10px] font-mono font-bold text-white z-10 group-hover:border-[#00FF41] transition-colors">
                              {step.step}
                           </div>
                           {i < section.steps.length - 1 && <div className="w-px h-full bg-[#1F1F23] mt-2 group-hover:bg-[#00FF41]/30 transition-colors" />}
                        </div>
                        <div className="pb-8">
                           <h4 className="font-bold text-white text-base mb-1 tracking-tight">{step.title}</h4>
                           <p className="text-sm text-[#71717A] leading-relaxed">{step.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
            </motion.section>
          ))}
        </div>

        {/* Code Example */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 border-b border-[#1F1F23] pb-4">
              <div className="w-10 h-10 rounded-lg bg-[#16161A] border border-[#1F1F23] flex items-center justify-center">
                 <Code2 size={20} className="text-[#3B82F6]" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Manual Ingestion via CLI</h2>
           </div>
           <p className="text-[#A1A1AA] leading-relaxed">
              Power users can use the integrated terminal commands to upload and index documents into the local RAG workspace.
           </p>
           <div className="bg-[#050505] border border-[#1F1F23] rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-[#16161A] p-2 px-4 flex items-center justify-between border-b border-[#1F1F23]">
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                 </div>
                 <span className="text-[10px] font-mono text-[#52525B]">bash ~ /ingest_manager.sh</span>
              </div>
              <pre className="p-6 text-xs font-mono text-white/80 overflow-x-auto selection:bg-[#3B82F6]/30">
                 <code>{`# Step 1: Initialize local knowledge vector
bitactl knowledge init --path ./local_workspace

# Step 2: Extract and chunk PDF research
bitactl ingest research_q1_2024.pdf --splitter recursive --chunk-size 1000

# Step 3: Synch to BITA intelligence cluster
bitactl sync --target cloud-rag-v4`}</code>
              </pre>
           </div>
        </section>

        {/* Security Warning */}
        <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex gap-4 items-start">
           <ShieldCheck size={24} className="text-blue-500 shrink-0" />
           <div className="space-y-2">
              <h4 className="text-sm font-bold text-blue-400 font-mono uppercase tracking-tight">Data_Privacy_Protocol_Enabled</h4>
              <p className="text-xs text-[#71717A] leading-relaxed">
                 Uploaded documents are processed locally within the browser context and only relevant semantic chunks are sent to the BITA 
                 Orchestrator for final synthesis. Your raw full-text documents are never stored on persistent centralized servers unless 
                 specifically synchronized with the knowledge base.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
