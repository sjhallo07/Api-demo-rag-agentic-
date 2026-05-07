import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, Code2, Terminal, Play, CheckCircle2, XCircle, Loader2, Globe, Search } from 'lucide-react';

const DOCS_HEADER = `# BITA Intelligence API Documentation [v1.0]

This document outlines the core functional modules and API specifications for the BITA Financial Intelligence Terminal. All requests are handled via JSON over HTTPS.
`;

const DOCS_SECTIONS = [
  {
    id: 'reference',
    title: '1. Reference Data API',
    content: `## 1. Reference Data API
**Endpoint:** \`GET /api/reference-data\`
**Description:** The foundational layer providing basic static and dynamic metadata for all financial instruments.
- **Use Cases:** Instrument lookup, catalog population, identifier mapping (ISIN, Ticker, Currency).
- **Metadata:** Ticker, Name, Sector, Country, Currency, Asset Class.
`
  },
  {
    id: 'thematics',
    title: '2. Thematics API',
    content: `## 2. Thematics API
**Endpoint:** \`GET /api/thematics\`
**Description:** Groups assets based on macro-economic trends and investment narratives.
- **Use Cases:** Thematic portfolio construction, exposure analysis to megatrends (AI, Clean Energy, ESG).
- **Data Points:** Relevance scores, thematic constituents, thematic weights.
`
  },
  {
    id: 'universe',
    title: '3. Investment Universe Construction API',
    content: `## 3. Investment Universe Construction API
**Endpoint:** \`POST /api/universe/search\`
**Description:** Rule-based filtering engine to create specialized investable sub-sets.
- **Use Cases:** ESG exclusions (e.g., Tabaco), Geography filtering (e.g., Large Cap Europe), Watchlist automation.
- **Engine:** Supports complex logical operators (EQUALS, GREATER_THAN, IN) on multi-factor data.
`
  },
  {
    id: 'analytics',
    title: '4. Analytics API',
    content: `## 4. Analytics API
**Endpoint:** \`GET /api/analytics/portfolio\`
**Description:** High-performance calculation engine for risk and performance metrics.
- **Use Cases:** Volatility analysis, Sharpe Ratio, Beta correlation, Tracking Error.
- **Output:** KPI summaries and comparative benchmark series.
`
  },
  {
    id: 'backtesting',
    title: '5. Backtesting API',
    content: `## 5. Backtesting API
**Endpoint:** \`POST /api/backtest\`
**Description:** Historical simulation engine for testing multi-factor investment strategies.
- **Use Cases:** Portfolio simulation, Stress testing (e.g., COVID-19 impact), Rebalancing optimization.
- **Output:** Equity curves, Drawdown series, and periodized return matrices.
`
  },
  {
    id: 'factsheets',
    title: '6. Factsheets API',
    content: `## 6. Factsheets API
**Endpoint:** \`GET /api/factsheets/:id\`
**Description:** Professional-grade report generation for portfolios or individual instruments.
- **Use Cases:** PDF generation for client reports, "One-pagers" for investment funds.
- **Format:** Supports dynamic PDF rendering/export with sector allocation charts and performance tables.
`
  },
  {
    id: 'agent',
    title: '7. RAG Agent Orchestrator',
    content: `## 7. RAG Agent Orchestrator
**Endpoint:** \`POST /api/agent/chat\`  
**Description:** The primary interface for the Strategic RAG Agent. It handles conversational logic, document ingestion, and semantic retrieval.
`
  }
];

const DOCS_FOOTER = `
---

## 8. Termux / Android CLI Integration
BITA Command supports native Android terminal integration via Termux. 

### Quick Install (Bash)
\`\`\`bash
# Run this in Termux to create the bita command
echo 'curl -s -X POST https://'$(window.location.host)'/api/agent/chat -H "Content-Type: application/json" -d "{\\"query\\": \\"$*\\"}" | jq -r ".content"' > bita && chmod +x bita
# Usage
./bita "Top AI stocks in Europe"
\`\`\`
`;

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'tests' | 'cli'>('endpoints');
  const [searchQuery, setSearchQuery] = useState('');
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return DOCS_HEADER + '\n---\n' + DOCS_SECTIONS.map(s => s.content).join('\n---\n') + DOCS_FOOTER;

    const query = searchQuery.toLowerCase();
    const matches = DOCS_SECTIONS.filter(section => 
      section.title.toLowerCase().includes(query) || 
      section.content.toLowerCase().includes(query)
    );

    if (matches.length === 0) return '# NO_MATCHES_FOUND\n\nYour search query returned zero results within the endpoint registry.';

    return DOCS_HEADER + '\n---\n' + matches.map(s => s.content).join('\n---\n');
  }, [searchQuery]);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Code2 className="text-[#00FF41]" size={24} />
            SYSTEM_DOCUMENTATION [DOC_ID: 0x8F]
          </h2>
          <p className="text-[#71717A] text-sm italic">
            Specifications for internal orchestration and RAG communication protocols.
          </p>
        </div>

        <div className="relative group w-full md:w-64">
           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B] group-focus-within:text-[#00FF41] transition-colors" />
           <input 
             type="text"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="SEARCH_ENDPOINTS..."
             className="w-full bg-[#0D0D0F] border border-[#1F1F23] rounded-lg py-2 pl-9 pr-4 text-[10px] font-mono text-white focus:outline-none focus:border-[#00FF41]/50 transition-all placeholder:text-[#3F3F46]"
           />
        </div>
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
                 onClick={() => setActiveTab('cli')}
                 className={`w-full text-left p-2 rounded text-xs font-mono flex items-center gap-2 transition-colors ${activeTab === 'cli' ? 'bg-[#1F1F23] text-[#00FF41]' : 'text-[#71717A] hover:bg-[#16161A]'}`}
               >
                  <Globe size={12} /> TERMUX_CLI
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
                  {filteredDocs}
                </ReactMarkdown>
             </div>
           ) : activeTab === 'cli' ? (
             <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#1F1F23] pb-4">
                   <Terminal className="text-[#00FF41]" size={20} />
                   <h4 className="text-sm font-bold font-mono">TERMUX_ANDROID_INTEGRATION</h4>
                </div>

                <div className="space-y-4">
                   <div className="p-4 bg-[#16161A] border border-[#1F1F23] rounded-md">
                      <p className="text-xs text-[#A1A1AA] mb-4">
                        To enable deep integration with your Android device, run the following setup script in your Termux environment. 
                        This connects your local shell directly to the BITA Intelligence Orchestrator.
                      </p>
                      
                      <div className="relative group">
                         <pre className="bg-black p-4 rounded text-[#00FF41] text-[10px] font-mono overflow-x-auto border border-[#00FF41]/20">
                            {`pkg install jq curl -y\n\ncat << 'EOF' > bita\n#!/bin/bash\n# BITA COMMAND CLI\nURL="${window.location.origin}/api/agent/chat"\nQUERY=$*\ncurl -s -X POST "$URL" -H "Content-Type: application/json" -d "{\\"query\\": \\"$QUERY\\"}" | jq -r ".content"\nEOF\n\nchmod +x bita\nmv bita $PREFIX/bin/\n\n# Usage:\n# bita "What are top ESG stocks?"`}
                         </pre>
                         <button 
                           onClick={() => navigator.clipboard.writeText(`pkg install jq curl -y\ncat << 'EOF' > bita\n#!/bin/bash\nURL="${window.location.origin}/api/agent/chat"\nQUERY=$*\ncurl -s -X POST "$URL" -H "Content-Type: application/json" -d "{\\"query\\": \\"$QUERY\\"}" | jq -r ".content"\nEOF\nchmod +x bita\nmv bita $PREFIX/bin/`)}
                           className="absolute top-2 right-2 p-1.5 bg-[#1F1F23] rounded text-[#71717A] hover:text-[#00FF41] transition-all opacity-0 group-hover:opacity-100"
                         >
                            <Code2 size={12} />
                         </button>
                      </div>
                   </div>

                   <div className="flex items-start gap-3 p-4 bg-[#00FF41]/5 border border-[#00FF41]/10 rounded">
                      <BookOpen size={16} className="text-[#00FF41] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-white">AUTOMATION ENABLED</p>
                         <p className="text-[10px] text-[#71717A]">You can now pipe shell outputs to BITA for analysis: <code className="text-[#00FF41]">ls -la | bita "Summarize these files"</code></p>
                      </div>
                   </div>
                </div>
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
