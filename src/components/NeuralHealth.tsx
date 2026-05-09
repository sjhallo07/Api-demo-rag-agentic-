import React, { useState, useEffect } from 'react';
import { Database, Zap, Cpu, Activity, BarChart3, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

const DATA_DOMAINS = [
  { name: 'Global_Macro_Vectors', status: 'SYNCHRONIZED', coverage: 98, tokens: '41.2M' },
  { name: 'Sector_Sentiment_Graph', status: 'LEARNING', coverage: 74, tokens: '12.8M' },
  { name: 'ESG_Compliance_Embeddings', status: 'OPTIMIZING', coverage: 89, tokens: '8.4M' },
  { name: 'Emerging_Thematics_Map', status: 'SYNCHRONIZED', coverage: 92, tokens: '15.1M' },
];

export default function NeuralHealth() {
  const [apiStatus, setApiStatus] = useState<'testing' | 'stable' | 'failure'>('testing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const checkApi = async () => {
      try {
        const resp = await fetch('/api/test-bita');
        const data = await resp.json();
        if (data.status === 'success') {
          setApiStatus('stable');
        } else {
          setApiStatus('failure');
          setErrorMsg(data.message || 'API connection failed');
        }
      } catch (err) {
        setApiStatus('failure');
        setErrorMsg('Network error connecting to BITA hub');
      }
    };
    
    checkApi();
  }, []);

  return (
    <div className="space-y-6 bg-[#0D0D0F] border border-[#1F1F23] rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="text-[#00FF41]" size={20} />
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest">Neural_Architecture_Status</h3>
        </div>
        <div className="flex items-center gap-2">
            {apiStatus === 'testing' ? (
              <>
                <Loader2 size={12} className="animate-spin text-[#71717A]" />
                <span className="text-[9px] font-mono text-[#71717A]">VALIDATING_AI_CORE...</span>
              </>
            ) : apiStatus === 'stable' ? (
              <>
                <CheckCircle2 size={12} className="text-[#00FF41]" />
                <span className="text-[9px] font-mono text-[#00FF41]">SYSTEM_INTEGRITY_STABLE</span>
              </>
            ) : (
              <>
                <AlertCircle size={12} className="text-red-500" />
                <span className="text-[9px] font-mono text-red-500 uppercase">CONNECTION_ERROR: CHECK_API_KEY</span>
              </>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DATA_DOMAINS.map((domain, i) => (
          <div key={i} className="p-4 bg-black/40 border border-[#1F1F23] rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-[#52525B]">{domain.name}</span>
              <Activity size={10} className="text-[#00FF41]" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-white">{domain.coverage}% COVERAGE</span>
                <span className={domain.status === 'SYNCHRONIZED' ? 'text-[#00FF41]' : 'text-blue-400'}>{domain.status}</span>
              </div>
              <div className="w-full h-1 bg-[#1F1F23] rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${domain.coverage}%` }}
                    className={`h-full ${domain.status === 'SYNCHRONIZED' ? 'bg-[#00FF41]' : 'bg-blue-500'}`}
                />
              </div>
            </div>
            <div className="text-[8px] font-mono text-[#52525B]">TOTAL_VECTORS: {domain.tokens}</div>
          </div>
        ))}
      </div>

      <div className="p-4 border border-dashed border-[#1F1F23] rounded-lg bg-black/20">
        <div className="flex items-start gap-4">
          {apiStatus === 'failure' ? (
            <AlertCircle className="text-red-500 shrink-0" size={18} />
          ) : (
            <Database className="text-[#3B82F6] shrink-0" size={18} />
          )}
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-white font-bold">
              {apiStatus === 'failure' ? 'RAG_ENGINE_AUTHENTICATION_ERROR' : 'RAG_EMBEDDING_ENGINE_v4.2'}
            </p>
            <p className="text-[10px] text-[#52525B] leading-relaxed font-mono">
              {apiStatus === 'failure' 
                ? `CRITICAL: ${errorMsg}. Please update the 'BITA_AI_API_KEY' secret.`
                : 'The BITA terminal utilizes Gemini Embedding models to vectorize financial identifiers. Status: ACTIVE. Memory Decay: DISABLED.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
