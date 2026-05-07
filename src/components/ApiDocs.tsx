import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, Code2, Terminal, Play, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const DOCS_MD = `# BITA Intelligence API Documentation [v1.0]

This document outlines the available endpoints for the BITA Financial Intelligence Terminal. All requests should be sent with \`Content-Type: application/json\`.

---

## 1. Investment Universe Construction API
**Endpoint:** \`POST /api/universe/search\`  
**Description:** Filters the 30k+ instrument universe based on quantitative factors and semantic themes.

### Request Body
\`\`\`json
{
  "query": "High momentum tech stocks",
  "filters": {
    "sector": "Technology",
    "geography": "North America",
    "minEsg": 80
  }
}
\`\`\`

---

## 2. Analytics API
**Endpoint:** \`GET /api/analytics/portfolio\`  
**Description:** Retrieves risk analytics and performance metrics for the current active portfolio.

---

## 3. Factsheets API
**Endpoint:** \`GET /api/factsheets/:id\`  
**Description:** Generates a dynamic link to the PDF factsheet for a specific instrument.

---

## 4. Backtesting API
**Endpoint:** \`POST /api/backtest\`  
**Description:** Simulates portfolio performance across historical timeframes.

---

## 5. Thematics API
**Endpoint:** \`GET /api/thematics\`  
**Description:** Maps megatrends (AI, Clean Energy) to specific ticker exposures.

---

## 6. Reference Data API
**Endpoint:** \`GET /api/reference/:id\`  
**Description:** Retrieves point-in-time financial identifiers (ISIN, CUSIP, SEDOL).

---

## 7. RAG Agent Orchestrator
**Endpoint:** \`POST /api/agent/chat\`  
**Description:** The primary interface for the Strategic RAG Agent. It handles conversational logic, document ingestion, and semantic retrieval.`;

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'tests'>('endpoints');
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runSystemTest = async () => {
    setIsRunning(true);
    setTestResults(null);
    try {
      const results: any = {};

      const testEndpoint = async (name: string, url: string, method: string = 'GET', body?: any) => {
        const start = performance.now();
        const r = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          ...(body && { body: JSON.stringify(body) })
        });
        const end = performance.now();
        return { 
          status: r.ok, 
          latency: Math.round(end - start), 
          name 
        };
      };

      results.universe = await testEndpoint('Universe Construction', '/api/universe/search', 'POST', { query: 'AI' });
      results.analytics = await testEndpoint('Analytics API', '/api/analytics/portfolio');
      results.factsheets = await testEndpoint('Factsheets API', '/api/factsheets/AAPL');
      results.backtest = await testEndpoint('Backtesting API', '/api/backtest', 'POST', { portfolio: ['AAPL'] });
      results.thematics = await testEndpoint('Thematics API', '/api/thematics');
      results.reference = await testEndpoint('Reference Data API', '/api/reference/AAPL');
      results.agent = await testEndpoint('RAG Orchestrator', '/api/agent/chat', 'POST', { query: 'Health check' });

      setTestResults(results);
    } catch (e) {
      setTestResults({ error: String(e) });
    }
    setIsRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <Code2 className="text-[#00FF41]" size={24} />
          SYSTEM_DOCUMENTATION [DOC_ID: 0x8F]
        </h2>
        <p className="text-[#71717A] text-sm italic">
          Specifications for internal orchestration and RAG communication protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-4 space-y-4">
            <h3 className="text-[10px] font-mono font-bold text-[#52525B] uppercase tracking-widest">Navigation</h3>
            <div className="space-y-2">
               <button 
                 onClick={() => setActiveTab('endpoints')}
                 className={`w-full text-left p-2 rounded text-xs font-mono flex items-center gap-2 transition-colors ${activeTab === 'endpoints' ? 'bg-[#1F1F23] text-[#00FF41]' : 'text-[#71717A] hover:bg-[#16161A]'}`}
               >
                  <Terminal size={12} /> ENDPOINTS
               </button>
               <button 
                 onClick={() => setActiveTab('tests')}
                 className={`w-full text-left p-2 rounded text-xs font-mono flex items-center gap-2 transition-colors ${activeTab === 'tests' ? 'bg-[#1F1F23] text-[#00FF41]' : 'text-[#71717A] hover:bg-[#16161A]'}`}
               >
                  <Play size={12} /> LIVE_TESTS
               </button>
            </div>
          </div>

          <div className="bg-[#00FF41]/5 border border-[#00FF41]/20 rounded-lg p-4">
             <p className="font-mono text-[9px] text-[#00FF41] leading-relaxed">
               STATUS: {isRunning ? 'RUNNING_TESTS...' : 'SYSTEM_READY'}<br />
               VERSION: 4.2.0-STABLE<br />
               LATENCY: {testResults?.universe?.latency || '--'}ms
             </p>
          </div>
        </div>

        <div className="md:col-span-3 bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-8 min-h-[400px]">
           {activeTab === 'endpoints' ? (
             <div className="markdown-body prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {DOCS_MD}
                </ReactMarkdown>
             </div>
           ) : (
             <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#1F1F23] pb-4">
                   <div className="space-y-1">
                      <h4 className="text-sm font-bold">API Function Verification</h4>
                      <p className="text-[11px] text-[#71717A]">Verify end-to-end connectivity and "Sentence-Transformers" semantic retrieval.</p>
                   </div>
                   <button 
                     onClick={runSystemTest}
                     disabled={isRunning}
                     className="px-4 py-2 bg-[#00FF41] text-black rounded font-bold text-[10px] flex items-center gap-2 hover:bg-[#00E53B] disabled:opacity-50"
                   >
                     {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                     RUN_ALL_TESTS
                   </button>
                </div>

                {!testResults && !isRunning && (
                  <div className="flex flex-col items-center justify-center h-48 border border-dashed border-[#1F1F23] rounded">
                     <Terminal size={32} className="text-[#1F1F23] mb-2" />
                     <p className="text-[10px] font-mono text-[#52525B]">AWAITING_TEST_EXECUTION</p>
                  </div>
                )}

                {isRunning && (
                   <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="h-12 bg-[#16161A] animate-pulse rounded border border-[#1F1F23]" />
                      ))}
                   </div>
                )}

                {testResults && (
                   <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      {Object.entries(testResults).filter(([k]) => k !== 'error').map(([key, result]: [string, any]) => (
                        <div key={key} className="p-4 bg-[#16161A] rounded border border-[#1F1F23] flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              {result.status ? <CheckCircle2 className="text-[#00FF41]" size={16} /> : <XCircle className="text-red-500" size={16} />}
                              <div className="space-y-0.5">
                                 <p className="text-xs font-mono font-bold">{result.name.toUpperCase()}</p>
                                 <p className="text-[10px] text-[#52525B]">Endpoint Connectivity Test</p>
                              </div>
                           </div>
                           <span className="text-[10px] font-mono text-[#71717A]">{result.latency}ms</span>
                        </div>
                      ))}

                      {testResults.error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs font-mono">
                           ERROR: {testResults.error}
                        </div>
                      )}
                   </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
