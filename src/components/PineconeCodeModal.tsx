import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Code, Loader2, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PineconeCodeModal({ isOpen, onClose }: Props) {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const agentResp = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: `Generate Pinecone code for: ${prompt}`,
          systemInstruction: "You are a specialized code generator for the Pinecone vector database. Provide clean, secure, and production-ready code snippets. Respond with code blocks.",
          temperature: 0.1
        })
      });

      if (!agentResp.ok) throw new Error("Code generation failed.");
      const agentData = await agentResp.json();
      setCode(agentData.content);
    } catch (error) {
      setCode('// Error: Neural service communication failed. Technical logs indicate a gateway timeout or missing Command Key.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-20 z-[111] bg-[#0A0A0B] border border-[#00FF41]/30 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-[#1F1F23] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#00FF41]">
                <Code size={18} />
                <span className="font-mono text-sm font-bold tracking-widest">PINECONE_CODE_GENERATOR</span>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-white/5 rounded transition-colors text-[#52525B] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-[#1F1F23]">
              <div className="relative">
                <input 
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the Pinecone operation (e.g., Create index, upsert vectors)..."
                  className="w-full bg-[#16161A] border border-[#1F1F23] rounded p-3 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]/50"
                />
                <button 
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00FF41] text-black px-4 py-1.5 rounded text-[10px] font-bold font-mono hover:bg-[#00E53B] disabled:opacity-30"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : 'GENERATE'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-black/50">
              {code ? (
                <div className="relative group">
                  <pre className="text-xs font-mono text-[#E4E4E7] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {code.replace(/```typescript|```/gi, '').trim()}
                  </pre>
                  <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 bg-[#16161A] text-[#52525B] rounded hover:text-white"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#3F3F46]">
                   <Code size={48} className="mb-4 opacity-20" />
                   <p className="text-xs font-mono">INPUT_REQUEST_TO_GENERATE_CODE</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
