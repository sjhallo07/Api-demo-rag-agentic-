import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Maximize2,
  RefreshCcw,
  Zap,
  ShieldCheck,
  TrendingUp,
  Globe,
  X,
  FileText,
  FileCode,
  Settings2,
  Clock,
  BrainCircuit,
  Plus,
  Layers
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGlobe, 
  faArrowTrendUp, 
  faArrowTrendDown, 
  faCircleCheck,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler
);
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Security, UniverseQueryResponse, SavedView } from '../types';
import { addAssetToPortfolio } from '../services/portfolioService';
import { UNIVERSE_METADATA } from '../constants';
import SmartUniverseAssistant from './SmartUniverseAssistant';

export default function UniverseExplorer() {
  const [query, setQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [minEsg, setMinEsg] = useState<number>(0);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [securities, setSecurities] = useState<Security[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSecurity, setSelectedSecurity] = useState<Security | null>(null);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const [isLiveMode, setIsLiveMode] = useState(true);
  const [lastUpdatedId, setLastUpdatedId] = useState<string | null>(null);
  const [activeThemeVisualization, setActiveThemeVisualization] = useState<string | null>(null);
  const [activeThemeFilter, setActiveThemeFilter] = useState<string | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showViewsDropdown, setShowViewsDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['ticker', 'score', 'esg']);
  const [themeExposureHistory, setThemeExposureHistory] = useState<any[]>([]);
  const [batchQueue, setBatchQueue] = useState<string[]>([]);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);

  useEffect(() => {
    const storedViews = localStorage.getItem('BITA_SAVED_VIEWS');
    if (storedViews) {
      setSavedViews(JSON.parse(storedViews));
    }
  }, []);

  const COLUMNS = [
    { id: 'ticker', label: 'TICKER' },
    { id: 'pe', label: 'P/E_RATIO' },
    { id: 'marketCap', label: 'MARKET_CAP' },
    { id: 'score', label: 'SCORE' },
    { id: 'esg', label: 'ESG' },
  ];

  const SECTORS = UNIVERSE_METADATA.SECTORS;
  const THEMES = UNIVERSE_METADATA.THEMES;

  const getThemeAssetCount = (theme: string) => {
    // In a real app, this would come from the API
    // Here we simulate it based on the securities we have + some stable randomness
    const baseCount = securities.filter(s => s.theme === theme).length;
    return baseCount + (theme.length * 2); 
  };

  const [activeTab, setActiveTab] = useState<'explorer' | 'builder'>('explorer');
  const [rules, setRules] = useState([{ field: 'sector', operator: 'equals', value: '' }]);

  const addRule = () => setRules([...rules, { field: 'sector', operator: 'equals', value: '' }]);
  const removeRule = (idx: number) => setRules(rules.filter((_, i) => i !== idx));
  const updateRule = (idx: number, updates: any) => {
    const newRules = [...rules];
    newRules[idx] = { ...newRules[idx], ...updates };
    setRules(newRules);
  };

  const performSearch = async (val: string = "", filters?: any) => {
    setIsLoading(true);
    const searchFilters = { ...filters };
    
    // Aggregate rules into filters if in builder mode
    if (activeTab === 'builder') {
      rules.forEach(rule => {
        if (rule.value) {
          searchFilters[rule.field] = rule.value;
        }
      });
    } else {
      if (selectedSector && !searchFilters.sector) {
        searchFilters.sector = selectedSector;
      }
      if (selectedThemes.length > 0 && !searchFilters.themes) {
        searchFilters.themes = selectedThemes;
      }
      if (minEsg > 0 && !searchFilters.minEsg) {
        searchFilters.minEsg = minEsg;
      }
    }

    try {
      const response = await fetch('/api/universe/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: val, filters: searchFilters })
      });
      const data: UniverseQueryResponse = await response.json();
      setSecurities(data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    performSearch();

    const handleChatQuery = (e: any) => {
      const { query, filters } = e.detail;
      setQuery(query);
      if (filters?.sector) {
        setSelectedSector(filters.sector);
      }
      if (filters?.themes) {
        setSelectedThemes(filters.themes);
      }
      performSearch(query, filters);
    };

    window.addEventListener('bit_query_universe', handleChatQuery);
    return () => window.removeEventListener('bit_query_universe', handleChatQuery);
  }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      performSearch(query, { sector: selectedSector, themes: selectedThemes, minEsg });
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const clearFilters = () => {
    setSelectedThemes([]);
    setMinEsg(0);
    setActiveThemeFilter(null);
    performSearch(query, { themes: [], sector: selectedSector, minEsg: 0 });
  };

  const addToBatchQueue = () => {
    if (query.trim()) {
      setBatchQueue([...batchQueue, query]);
      setQuery('');
    }
  };

  const removeFromBatchQueue = (index: number) => {
    setBatchQueue(batchQueue.filter((_, i) => i !== index));
  };

  const processBatchQueue = () => {
    if (batchQueue.length > 0) {
      const combinedQuery = batchQueue.join(" OR ");
      performSearch(combinedQuery, { sector: selectedSector, themes: selectedThemes, minEsg });
      setQuery(combinedQuery);
      setBatchQueue([]);
    }
  };

  const handleApplySmartFilters = (filters: any) => {
    if (filters.sector) setSelectedSector(filters.sector);
    if (filters.themes) setSelectedThemes(filters.themes);
    if (filters.minEsg) setMinEsg(filters.minEsg);
    if (filters.query) setQuery(filters.query);
    
    performSearch(filters.query || query, {
        sector: filters.sector || selectedSector,
        themes: filters.themes || selectedThemes,
        minEsg: filters.minEsg || minEsg
    });
  };

  const saveView = () => {
    const name = prompt("NAME_FOR_VIEW:");
    if (!name) return;
    const newView: SavedView = {
      id: Date.now().toString(),
      name,
      query,
      filters: { sector: selectedSector, themes: selectedThemes, minEsg }
    };
    const updatedViews = [...savedViews, newView];
    setSavedViews(updatedViews);
    localStorage.setItem('BITA_SAVED_VIEWS', JSON.stringify(updatedViews));
  };

  const loadView = (view: SavedView) => {
    setQuery(view.query);
    setSelectedSector(view.filters.sector);
    setSelectedThemes(view.filters.themes);
    setMinEsg(view.filters.minEsg);
    performSearch(view.query, view.filters);
  };

  const exportToCSV = () => {
    const headers = ["Ticker", "Name", "Sector", "Theme", "Score", "Momentum", "ESG"];
    const rows = filteredSecurities.map(s => [
      s.id,
      s.name,
      s.sector,
      s.theme,
      s.score.toFixed(4),
      s.momentum.toFixed(4),
      s.esg
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bita_universe_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportDropdown(false);
  };

  const exportToPDF = () => {
    // Simulated PDF export - in a real app would use jsPDF
    console.log("Generating PDF report for current universe view...");
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(`
        <html>
          <head>
            <title>BITA Universe Report</title>
            <style>
              body { font-family: monospace; background: #000; color: #00FF41; padding: 40px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #1F1F23; padding: 10px; text-align: left; }
              h1 { border-bottom: 2px solid #00FF41; padding-bottom: 10px; }
            </style>
          </head>
          <body>
            <h1>BITA_UNIVERSE_REPORT [${new Date().toLocaleString()}]</h1>
            <p>ACTIVE_FILTERS: ${selectedSector || 'NONE'} | ${selectedThemes.join(', ') || 'NONE'}</p>
            <table>
              <thead>
                <tr>
                  <th>TICKER</th><th>NAME</th><th>SECTOR</th><th>SCORE</th><th>ESG</th>
                </tr>
              </thead>
              <tbody>
                ${filteredSecurities.map(s => `
                  <tr>
                    <td>${s.id}</td><td>${s.name}</td><td>${s.sector}</td><td>${s.score.toFixed(2)}</td><td>${s.esg}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      reportWindow.document.close();
      reportWindow.print();
    }
    setShowExportDropdown(false);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredSecurities, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bita_universe_export_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportDropdown(false);
  };

  const filteredSecurities = activeThemeFilter 
    ? securities.filter(s => s.theme === activeThemeFilter)
    : securities;

  // Real-time market simulation interval
  useEffect(() => {
    if (!isLiveMode || securities.length === 0) return;

    const interval = setInterval(() => {
      // Pick 2 random securities to update instead of 1 for more activity
      const randomIndices = Array.from({ length: 2 }, () => Math.floor(Math.random() * securities.length));
      const targetIds = randomIndices.map(idx => securities[idx].id);
      
      let updatedSecurities: Security[] = [];
      setSecurities(prev => {
        updatedSecurities = prev.map((s, i) => {
          if (randomIndices.includes(i)) {
            const volatility = 0.03 + (s.momentum * 0.05);
            const drift = (Math.random() * volatility * 2) - volatility;
            
            return {
              ...s,
              score: Math.max(0, Math.min(1, s.score + drift)),
              momentum: Math.max(0, Math.min(1, s.momentum + (drift * 0.8)))
            };
          }
          return s;
        });
        return updatedSecurities;
      });

      // Update theme exposure history
      const themesToTrack = selectedThemes.length > 0 ? selectedThemes : [THEMES[0], THEMES[1], THEMES[2]];
      const timestamp = new Date().toLocaleTimeString();
      const currentExposure: any = { time: timestamp };
      
      themesToTrack.forEach(theme => {
        const themeExposure = updatedSecurities
          .filter(s => s.theme === theme)
          .reduce((acc, curr) => acc + curr.score, 0);
        currentExposure[theme] = parseFloat(themeExposure.toFixed(2));
      });

      setThemeExposureHistory(prev => {
        const next = [...prev, currentExposure];
        return next.slice(-20); // Keep last 20 points
      });

      // Highlight the first updated security for visual feedback
      setLastUpdatedId(targetIds[0]);
      const timer = setTimeout(() => setLastUpdatedId(null), 1200);
      return () => clearTimeout(timer);
    }, 2000); // More frequent updates

    return () => clearInterval(interval);
  }, [isLiveMode, securities.length]);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Global Indices Ticker Bar */}
      <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide border-b border-[#1F1F23]">
        <div className="flex items-center gap-2 shrink-0">
          <FontAwesomeIcon icon={faGlobe} className="text-[#00FF41] text-xs" />
          <span className="text-[10px] font-mono font-bold text-[#52525B] uppercase tracking-widest leading-none">Global_Indices</span>
        </div>
        {[
          { label: 'S&P 500', value: '5,123.42', change: '+1.24%' },
          { label: 'NASDAQ', value: '18,241.90', change: '+0.85%' },
          { label: 'DOW JONES', value: '38,927.15', change: '-0.12%' },
          { label: 'RUSSELL 2k', value: '2,045.10', change: '+2.10%' },
          { label: 'VIX_VOLAT', value: '14.25', change: '-3.45%' },
        ].map((index, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0 bg-[#0D0D0F] border border-[#1F1F23] px-3 py-1 rounded group hover:border-[#00FF41]/30 transition-all cursor-default text-[10px] font-mono">
            <span className="text-[#71717A] group-hover:text-white transition-colors">{index.label}</span>
            <span className="font-bold">{index.value}</span>
            <span className={cn(
              "font-bold flex items-center gap-1",
              index.change.startsWith('+') ? "text-[#00FF41]" : "text-red-500"
            )}>
              <FontAwesomeIcon 
                icon={index.change.startsWith('+') ? faArrowTrendUp : faArrowTrendDown} 
                className="text-[8px]"
              />
              {index.change}
            </span>
          </div>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-[9px] font-mono text-[#52525B] italic">
          <FontAwesomeIcon icon={faClock} className="text-[10px]" />
          NY_MARKET_OPEN
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-1 p-1 bg-[#0D0D0F] border border-[#1F1F23] rounded-lg w-fit">
         <button 
           onClick={() => setActiveTab('explorer')}
           className={cn(
             "px-4 py-1.5 rounded text-[10px] font-mono font-bold transition-all",
             activeTab === 'explorer' ? "bg-[#1F1F23] text-[#00FF41]" : "text-[#52525B] hover:text-[#71717A]"
           )}
         >
           MODERN_EXPLORER
         </button>
         <button 
           onClick={() => setActiveTab('builder')}
           className={cn(
             "px-4 py-1.5 rounded text-[10px] font-mono font-bold transition-all",
             activeTab === 'builder' ? "bg-[#1F1F23] text-[#3B82F6]" : "text-[#52525B] hover:text-[#71717A]"
           )}
         >
           RULE_BUILDER
         </button>
      </div>

      {activeTab === 'builder' ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6 space-y-4"
        >
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold">UNIVERSE_RULE_CONSTRUCTION</h3>
              <button 
                onClick={addRule}
                className="text-[10px] font-mono text-[#00FF41] hover:underline"
              >
                + ADD_CONDITION
              </button>
           </div>
           
           <div className="space-y-3">
              {rules.map((rule, i) => (
                <div key={i} className="flex items-center gap-3">
                   <select 
                    value={rule.field}
                    onChange={(e) => updateRule(i, { field: e.target.value })}
                    className="bg-black border border-[#1F1F23] rounded px-3 py-1.5 text-[10px] font-mono text-white focus:outline-none focus:border-[#3B82F6]/50"
                   >
                     <option value="sector">SECTOR</option>
                     <option value="geography">REGION</option>
                     <option value="marketCap">MARKET_CAP</option>
                     <option value="esg">ESG_RATING</option>
                   </select>
                   <select 
                    value={rule.operator}
                    onChange={(e) => updateRule(i, { operator: e.target.value })}
                    className="bg-black border border-[#1F1F23] rounded px-3 py-1.5 text-[10px] font-mono text-[#71717A] focus:outline-none focus:border-[#3B82F6]/50"
                   >
                     <option value="equals">EQUALS</option>
                     <option value="contains">CONTAINS</option>
                     <option value="greaterThan">GREATER_THAN</option>
                     <option value="lessThan">LESS_THAN</option>
                   </select>
                   <input 
                    type="text"
                    value={rule.value}
                    onChange={(e) => updateRule(i, { value: e.target.value })}
                    placeholder="VALUE..."
                    className="flex-1 bg-black border border-[#1F1F23] rounded px-3 py-1.5 text-[10px] font-mono text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00FF41]/50"
                   />
                   <button 
                    onClick={() => removeRule(i)}
                    className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded transition-colors"
                   >
                     ×
                   </button>
                </div>
              ))}
           </div>

           <div className="pt-4 flex items-center gap-3">
              <button 
                onClick={() => performSearch()}
                className="bg-[#3B82F6] text-black text-[10px] font-bold px-6 py-2 rounded font-mono hover:bg-[#2563EB] transition-all"
              >
                APPLY_UNIVERSE_LOGIC
              </button>
              <button className="text-[10px] font-mono text-[#52525B] hover:text-white transition-colors">
                SAVE_AS_TEMPLATE
              </button>
           </div>
        </motion.div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1 min-w-0 relative group order-2 md:order-1 flex flex-col gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B] group-focus-within:text-[#00FF41] transition-colors" size={18} />
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (e.shiftKey) {
                      addToBatchQueue();
                    } else {
                      performSearch(query);
                    }
                  }
                }}
                placeholder="Search universe... (Shift+Enter to queue)"
                className="w-full bg-[#0D0D0F] border border-[#1F1F23] rounded-md py-2.5 pl-10 pr-32 text-sm focus:outline-none focus:border-[#00FF41]/50 transition-all font-mono"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <button
                    onClick={addToBatchQueue}
                    disabled={!query.trim()}
                    title="Add to Query Batch"
                    className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all disabled:opacity-30 flex items-center justify-center"
                 >
                    <Plus size={14} className="text-blue-500" />
                 </button>
                 <button 
                  onClick={() => setIsAssistantOpen(true)}
                  className="p-1.5 rounded bg-[#00FF41]/10 border border-[#00FF41]/20 group/ai hover:bg-[#00FF41]/20 transition-all flex items-center gap-1.5"
                 >
                    <BrainCircuit className="text-[#00FF41]" size={14} />
                    <span className="hidden sm:inline text-[8px] font-mono text-[#00FF41] font-bold group-hover/ai:mr-1 transition-all">AI_ORCHESTRATE</span>
                 </button>
                 <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 opacity-30">
                    <div className="w-1 h-1 rounded-full bg-[#00FF41] animate-pulse" />
                    <span className="text-[8px] font-mono text-white font-bold tracking-tighter">DATA_SYNC [OK]</span>
                 </div>
              </div>
            </div>
            
            {batchQueue.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} 
                className="flex flex-wrap items-center gap-2 p-2 bg-[#0D0D0F] border border-[#1F1F23] rounded-md shadow-lg"
              >
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#52525B]">
                  <Layers size={14} />
                  <span>BATCH_QUEUE:</span>
                </div>
                {batchQueue.map((q, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-1 bg-[#16161A] text-xs font-mono text-[#E4E4E7] rounded border border-[#27272A]">
                    {q}
                    <button onClick={() => removeFromBatchQueue(i)} className="text-red-400 hover:text-red-300">
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <button 
                  onClick={processBatchQueue}
                  className="ml-auto px-3 py-1 bg-[#00FF41]/10 text-[#00FF41] text-[10px] font-mono font-bold rounded border border-[#00FF41]/30 hover:bg-[#00FF41]/20 transition-colors"
                >
                  PROCESS_QUEUE ({batchQueue.length})
                </button>
              </motion.div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 order-1 md:order-2">
            <button 
              onClick={() => setIsLiveMode(!isLiveMode)}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-xs font-mono transition-all",
                isLiveMode 
                  ? "bg-[#00FF41]/10 border-[#00FF41]/30 text-[#00FF41]" 
                  : "bg-[#0D0D0F] border-[#1F1F23] text-[#71717A]"
              )}
            >
              <RefreshCcw size={14} className={isLiveMode ? "animate-spin-slow" : ""} />
              <span className="hidden sm:inline">{isLiveMode ? "LIVE_FEED_ON" : "LIVE_FEED_OFF"}</span>
              <span className="sm:hidden">{isLiveMode ? "LIVE" : "PAUSED"}</span>
            </button>
            <select 
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
                performSearch(query, { sector: e.target.value, themes: selectedThemes });
              }}
              className="flex-1 sm:flex-none bg-[#0D0D0F] border border-[#1F1F23] rounded-md px-3 py-2 text-xs font-mono focus:outline-none text-[#E4E4E7]"
            >
              <option value="">SECTORS</option>
              {SECTORS.map(s => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Theme Multi-select */}
              <div className="relative flex-1 sm:flex-none">
                <button 
                  onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#0D0D0F] border rounded-md text-xs font-mono transition-all",
                    selectedThemes.length > 0 ? "border-[#00FF41]/50 text-[#00FF41]" : "border-[#1F1F23] text-[#71717A]"
                  )}
                >
                  <Zap size={14} />
                  <span className="hidden sm:inline">{selectedThemes.length > 0 ? `THEMES (${selectedThemes.length})` : "THEMES"}</span>
                  <span className="sm:hidden">{selectedThemes.length > 0 ? `THM (${selectedThemes.length})` : "THM"}</span>
                </button>
                
                {showThemeDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowThemeDropdown(false)} />
                    <div className="absolute top-full mt-2 right-0 sm:left-0 w-48 bg-[#0D0D0F] border border-[#1F1F23] rounded-md shadow-2xl z-20 p-2 space-y-1">
                      {THEMES.map(theme => (
                        <button
                          key={theme}
                          onClick={() => {
                            const newThemes = selectedThemes.includes(theme)
                              ? selectedThemes.filter(t => t !== theme)
                              : [...selectedThemes, theme];
                            setSelectedThemes(newThemes);
                            performSearch(query, { themes: newThemes, sector: selectedSector });
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded text-[10px] font-mono flex items-center justify-between",
                            selectedThemes.includes(theme) ? "bg-[#00FF41]/10 text-[#00FF41]" : "text-[#71717A] hover:bg-[#16161A]"
                          )}
                        >
                          {theme.toUpperCase()}
                          {selectedThemes.includes(theme) && <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41]" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="relative flex-1 sm:flex-none">
                <button 
                  onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#0D0D0F] border rounded-md text-xs font-mono transition-all",
                    minEsg > 0 ? "border-[#00FF41]/50 text-[#00FF41]" : "border-[#1F1F23] text-[#71717A] hover:text-white"
                  )}
                >
                  <Filter size={14} />
                  <span className="hidden sm:inline">FILTERS</span>
                  <span className="sm:hidden">FLTR</span>
                </button>

                {showFiltersDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFiltersDropdown(false)} />
                    <div className="absolute top-full mt-2 right-0 w-64 bg-[#0D0D0F] border border-[#1F1F23] rounded-md shadow-2xl z-20 p-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex items-center justify-between border-b border-[#1F1F23] pb-2 mb-2">
                        <span className="text-[10px] font-mono font-bold text-[#52525B]">UNIVERSE_FILTERS</span>
                        <button 
                          onClick={clearFilters}
                          className="text-[9px] font-mono text-red-500 hover:underline"
                        >
                          RESET
                        </button>
                      </div>

                      <div className="space-y-3">
                         <div className="flex justify-between items-center">
                            <label className="text-[10px] font-mono text-[#71717A]">MIN_ESG_SCORE</label>
                            <span className="text-[10px] font-mono text-[#00FF41] font-bold">{minEsg || 'ANY'}</span>
                         </div>
                         <input 
                           type="range"
                           min="0"
                           max="95"
                           step="5"
                           value={minEsg}
                           onChange={(e) => {
                             const val = parseInt(e.target.value);
                             setMinEsg(val);
                           }}
                           onMouseUp={() => performSearch(query, { minEsg, sector: selectedSector, themes: selectedThemes })}
                           onTouchEnd={() => performSearch(query, { minEsg, sector: selectedSector, themes: selectedThemes })}
                           className="w-full h-1.5 bg-[#1F1F23] rounded-lg appearance-none cursor-pointer accent-[#00FF41]"
                         />
                         <div className="flex justify-between text-[8px] font-mono text-[#52525B]">
                            <span>OFF</span>
                            <span>B</span>
                            <span>BBB</span>
                            <span>A</span>
                            <span>AAA</span>
                         </div>
                      </div>

                      <div className="pt-2 border-t border-[#1F1F23]">
                         <p className="text-[8px] font-mono text-[#52525B] leading-relaxed italic">
                           * ESG thresholds are mapped to internal vector benchmarks. 
                           AAA:90, AA:80, A:70, BBB:60, BB:50, B:40.
                         </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">                
                <div className="relative">
                  <button 
                    onClick={saveView}
                    className="p-2 bg-[#1F1F23] text-white rounded-md hover:bg-[#27272A] transition-all"
                    title="SAVE_CURRENT_VIEW"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowViewsDropdown(!showViewsDropdown)}
                    className={cn(
                      "p-2 bg-[#0D0D0F] border rounded-md transition-all",
                      showViewsDropdown ? "border-[#00FF41] text-[#00FF41]" : "border-[#1F1F23] text-[#71717A] hover:text-white"
                    )}
                    title="SAVED_VIEWS"
                  >
                    <Clock size={16} />
                  </button>
                  {showViewsDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowViewsDropdown(false)} />
                      <div className="absolute top-full mt-2 right-0 w-48 bg-[#0D0D0F] border border-[#1F1F23] rounded-md shadow-2xl z-20 p-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="px-3 py-1.5 text-[8px] font-mono text-[#52525B] border-b border-[#1F1F23] mb-1">
                          SAVED_VIEWS
                        </div>
                        {savedViews.length === 0 && <div className="px-3 py-2 text-[10px] font-mono text-[#71717A]">NO_VIEWS_SAVED</div>}
                        {savedViews.map(view => (
                           <button
                             key={view.id}
                             onClick={() => {
                               loadView(view);
                               setShowViewsDropdown(false);
                             }}
                             className="w-full text-left px-3 py-2 rounded text-[10px] font-mono text-[#71717A] hover:bg-[#16161A] hover:text-[#00FF41] flex items-center justify-between transition-colors"
                           >
                             {view.name.toUpperCase()}
                           </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    className="p-2 bg-[#00FF41] text-black rounded-md hover:bg-[#00E53B] transition-all"
                    title="EXPORT_UNIVERSE"
                  >
                    <Download size={16} />
                  </button>

                  {showExportDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowExportDropdown(false)} />
                      <div className="absolute top-full mt-2 right-0 w-48 bg-[#0D0D0F] border border-[#1F1F23] rounded-md shadow-2xl z-20 p-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="px-3 py-1.5 text-[8px] font-mono text-[#52525B] border-b border-[#1F1F23] mb-1">
                          EXPORT_DATA
                        </div>
                        <button
                          onClick={exportToCSV}
                          className="w-full text-left px-3 py-2 rounded text-[10px] font-mono text-[#71717A] hover:bg-[#16161A] hover:text-[#00FF41] flex items-center gap-2 transition-colors"
                        >
                          <FileText size={14} />
                          DOWNLOAD_CSV
                        </button>
                        <button
                          onClick={exportToPDF}
                          className="w-full text-left px-3 py-2 rounded text-[10px] font-mono text-[#71717A] hover:bg-[#16161A] hover:text-[#00FF41] flex items-center gap-2 transition-colors"
                        >
                          <FileText size={14} />
                          GENERATE_PDF
                        </button>
                        <button
                          onClick={exportToJSON}
                          className="w-full text-left px-3 py-2 rounded text-[10px] font-mono text-[#71717A] hover:bg-[#16161A] hover:text-[#00FF41] flex items-center gap-2 transition-colors"
                        >
                          <FileCode size={14} />
                          DOWNLOAD_JSON
                        </button>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                    className={cn(
                      "p-2 bg-[#0D0D0F] border rounded-md transition-all",
                      showColumnDropdown ? "border-[#00FF41] text-[#00FF41]" : "border-[#1F1F23] text-[#71717A] hover:text-white"
                    )}
                    title="COLUMN_DENSITY"
                  >
                    <Settings2 size={16} />
                  </button>

                  {showColumnDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowColumnDropdown(false)} />
                      <div className="absolute top-full mt-2 right-0 w-48 bg-[#0D0D0F] border border-[#1F1F23] rounded-md shadow-2xl z-20 p-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="px-3 py-1.5 text-[8px] font-mono text-[#52525B] border-b border-[#1F1F23] mb-1">
                          COLUMN_VISIBILITY
                        </div>
                        {COLUMNS.map(col => (
                          <button
                            key={col.id}
                            onClick={() => {
                              const next = visibleColumns.includes(col.id)
                                ? visibleColumns.filter(id => id !== col.id)
                                : [...visibleColumns, col.id];
                              if (next.length > 0) setVisibleColumns(next);
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded text-[10px] font-mono flex items-center justify-between transition-colors",
                              visibleColumns.includes(col.id) ? "text-[#00FF41] bg-[#00FF41]/5" : "text-[#71717A] hover:bg-[#16161A]"
                            )}
                          >
                            {col.label}
                            {visibleColumns.includes(col.id) && <ShieldCheck size={10} />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Selection Cards */}
      {selectedThemes.length > 0 && (
        <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {selectedThemes.map((theme) => (
            <motion.div
              layoutId={`theme-card-${theme}`}
              key={theme}
              onMouseEnter={() => setHoveredTheme(theme)}
              onMouseLeave={() => setHoveredTheme(null)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const isSelected = activeThemeFilter === theme;
                setActiveThemeFilter(isSelected ? null : theme);
                setActiveThemeVisualization(isSelected ? null : theme);
              }}
              className={cn(
                "relative flex-1 min-w-[200px] bg-[#0D0D0F] border p-4 rounded-lg cursor-pointer transition-all",
                activeThemeFilter === theme 
                  ? "border-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.15)] ring-1 ring-[#00FF41]/20 bg-[#121214]" 
                  : "border-[#1F1F23] hover:border-[#52525B] hover:bg-[#121214]"
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <motion.div 
                  animate={activeThemeFilter === theme ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    activeThemeFilter === theme ? "bg-[#00FF41] text-black" : "bg-[#00FF41]/10 text-[#00FF41]"
                  )}
                >
                  <Zap size={14} />
                </motion.div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const newThemes = selectedThemes.filter(t => t !== theme);
                    setSelectedThemes(newThemes);
                    if (activeThemeFilter === theme) setActiveThemeFilter(null);
                    if (activeThemeVisualization === theme) setActiveThemeVisualization(null);
                    performSearch(query, { themes: newThemes, sector: selectedSector });
                  }}
                  className="text-[#52525B] hover:text-red-400 p-1 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
              <h4 className="text-[10px] font-mono font-bold text-[#71717A] mb-1 tracking-wider">THEMATIC_BASKET</h4>
              <div className="flex items-end justify-between">
                <p className="text-sm font-bold text-white uppercase">{theme}</p>
                <div className="text-right">
                  <p className="text-[11px] font-mono text-[#00FF41] font-bold">{getThemeAssetCount(theme)}</p>
                  <p className="text-[8px] font-mono text-[#52525B]">ASSETS</p>
                </div>
              </div>
              
              {activeThemeFilter === theme && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-4 border-t border-[#1F1F23] space-y-3"
                >
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#52525B]">REL_STRENGTH</span>
                      <div className="w-24 h-1 bg-[#1F1F23] rounded-full overflow-hidden">
                         <div className="h-full bg-[#00FF41]" style={{ width: '75%' }} />
                      </div>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#52525B]">BETA_PROFILE</span>
                      <span className="text-[9px] font-mono text-[#E4E4E7]">1.24 (High)</span>
                   </div>
                   <button className="w-full py-2 bg-[#1F1F23] rounded text-[9px] font-mono text-[#00FF41] hover:bg-[#2A2A30] transition-colors border border-[#00FF41]/10">
                      EXPLORE_DEEP_INSIGHTS
                   </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Grid & Chart Layout */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Universe Metrics Summary */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
           {[
             { label: 'AVG ESG SCORE', value: (78.2 + (isLiveMode ? (Math.random() * 0.4 - 0.2) : 0)).toFixed(1), change: '+2.4%', icon: ShieldCheck, color: '#00FF41' },
             { label: 'TOP SECTOR', value: 'TECH', sub: '34% WEIGHT', icon: Zap, color: '#3B82F6' },
             { label: 'MOMENTUM', value: 'BULLISH', change: isLiveMode ? `${(82 + (Math.random() * 2 - 1)).toFixed(1)}%` : '82%', icon: TrendingUp, color: '#F43F5E' },
             { label: 'COVERAGE', value: '30,241', sub: 'INSTRUMENTS', icon: Globe, color: '#71717A' },
           ].map((stat, i) => (
             <div key={i} className="bg-[#0D0D0F] border border-[#1F1F23] p-4 rounded-lg relative overflow-hidden group hover:border-[#00FF41]/30 transition-all">
                <div className="flex justify-between items-start relative z-10">
                   <div>
                      <p className="text-[10px] font-mono text-[#52525B] tracking-wider mb-1">{stat.label}</p>
                      <h4 className="text-xl font-bold tracking-tight">{stat.value}</h4>
                      <p className={cn("text-[10px] font-mono mt-1", stat.change?.startsWith('+') ? "text-[#00FF41]" : "text-[#71717A]")}>
                        {stat.change || stat.sub}
                      </p>
                   </div>
                   <stat.icon size={20} className="text-[#1F1F23] group-hover:text-[#00FF41] transition-colors" />
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <stat.icon size={80} />
                </div>
             </div>
           ))}
        </div>

        {/* Factors Analysis & Theme Exposure Tabs/Split */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
           {/* Factors Analysis Chart */}
           <div className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6 flex flex-col h-[350px]">
              <div className="flex items-center justify-between mb-6">
                 <div className="space-y-1">
                    <h3 className="text-sm font-mono font-bold">FACTOR_EXPOSURE_INDEX</h3>
                    <p className="text-xs text-[#52525B]">Relative exposure analysis across selected universe</p>
                 </div>
                 <Maximize2 size={16} className="text-[#52525B] cursor-pointer" />
              </div>
              
              <div className="flex-1 w-full">
                 <Bar 
                    data={{
                      labels: filteredSecurities.map(s => s.id),
                      datasets: [
                        {
                          label: 'Score',
                          data: filteredSecurities.map(s => s.score),
                          backgroundColor: filteredSecurities.map((_, i) => i % 2 === 0 ? '#00FF41' : '#00A635'),
                          borderRadius: 2,
                        },
                        {
                          label: 'Momentum',
                          data: filteredSecurities.map(s => s.momentum),
                          backgroundColor: '#3B82F6',
                          borderRadius: 2,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          grid: { color: 'rgba(255, 255, 255, 0.05)' },
                          ticks: {
                            color: '#52525B',
                            font: { size: 10, family: 'monospace' }
                          }
                        },
                        y: {
                          display: false,
                        }
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: '#0D0D0F',
                          titleColor: '#00FF41',
                          bodyColor: '#E4E4E7',
                          borderColor: '#1F1F23',
                          borderWidth: 1,
                          titleFont: { family: 'monospace', size: 10 },
                          bodyFont: { family: 'monospace', size: 10 },
                        }
                      }
                    }}
                 />
              </div>
           </div>

           {/* Real-time Theme Exposure Chart */}
           <div className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6 flex flex-col h-[350px]">
              <div className="flex items-center justify-between mb-6">
                 <div className="space-y-1">
                    <h3 className="text-sm font-mono font-bold flex items-center gap-2">
                       <TrendingUp size={14} className="text-[#00FF41]" />
                       THEME_EXPOSURE_TRAJECTORY
                    </h3>
                    <p className="text-xs text-[#52525B]">Real-time concentration drift for active thematic baskets</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#00FF41]/5 border border-[#00FF41]/10">
                       <div className="w-1 h-1 rounded-full bg-[#00FF41] animate-pulse" />
                       <span className="text-[8px] font-mono text-[#00FF41]">LIVE_STREAM</span>
                    </div>
                 </div>
              </div>
              
              <div className="flex-1 w-full">
                 <Line 
                    data={{
                      labels: themeExposureHistory.map(d => d.time),
                      datasets: (selectedThemes.length > 0 ? selectedThemes : [THEMES[0], THEMES[1], THEMES[2]]).map((theme, idx) => ({
                        label: theme,
                        data: themeExposureHistory.map(d => d[theme] as number),
                        borderColor: idx === 0 ? '#00FF41' : idx === 1 ? '#3B82F6' : idx === 2 ? '#F59E0B' : '#8B5CF6',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        tension: 0.4
                      }))
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      animation: false,
                      scales: {
                        x: {
                          grid: { color: 'rgba(255, 255, 255, 0.05)' },
                          ticks: {
                            color: '#52525B',
                            font: { size: 8, family: 'monospace' },
                            maxTicksLimit: 5
                          },
                          display: themeExposureHistory.length >= 5
                        },
                        y: {
                          grid: { color: 'rgba(255, 255, 255, 0.05)' },
                          ticks: {
                            color: '#52525B',
                            font: { size: 8, family: 'monospace' }
                          }
                        }
                      },
                      plugins: {
                        legend: { 
                          position: 'top',
                          align: 'end',
                          labels: {
                            color: '#52525B',
                            font: { size: 8, family: 'monospace' },
                            usePointStyle: true,
                            boxWidth: 6
                          }
                        },
                        tooltip: {
                          backgroundColor: '#0D0D0F',
                          titleColor: '#00FF41',
                          bodyColor: '#E4E4E7',
                          borderColor: '#1F1F23',
                          borderWidth: 1,
                          titleFont: { family: 'monospace', size: 10 },
                          bodyFont: { family: 'monospace', size: 10 },
                        }
                      }
                    }}
                 />
                 {themeExposureHistory.length === 0 && (
                   <div className="absolute inset-0 flex items-center justify-center bg-[#0D0D0F]/80">
                      <p className="text-[10px] font-mono text-[#52525B] animate-pulse">WAITING_FOR_MARKET_TICK...</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
        {/* Real-time Data Grid */}
        <div className="col-span-12 lg:col-span-4 bg-[#0D0D0F] border border-[#1F1F23] rounded-lg flex flex-col overflow-hidden max-h-[600px] lg:max-h-[400px]">
           <div className="p-4 border-b border-[#1F1F23] flex items-center justify-between bg-[#16161A]/50">
              <span className="text-[10px] font-mono font-bold text-[#71717A]">UNIVERSE_STREAM</span>
              <div className="flex items-center gap-2">
                 <span className={cn(
                   "w-1.5 h-1.5 rounded-full transition-all duration-500",
                   isLiveMode ? "bg-[#00FF41] shadow-[0_0_8px_rgba(0,255,65,0.6)] animate-pulse" : "bg-red-500"
                 )} />
                 <span className="text-[9px] font-mono text-[#71717A]">{isLiveMode ? "REAL_TIME" : "PAUSED"}</span>
               </div>
           </div>
           
           {/* Desktop Table View */}
           <div className="hidden md:block flex-1 overflow-y-auto">
              <table className="w-full text-left">
                 <thead className="sticky top-0 bg-[#0D0D0F] border-b border-[#1F1F23] z-10">
                    <tr className="text-[10px] font-mono text-[#52525B]">
                        {visibleColumns.includes('ticker') && <th className="p-3 font-medium">TICKER</th>}
                        {visibleColumns.includes('pe') && <th className="p-3 font-medium text-right">P/E</th>}
                        {visibleColumns.includes('marketCap') && <th className="p-3 font-medium text-right">MCAP</th>}
                        {visibleColumns.includes('score') && <th className="p-3 font-medium text-right">SCORE</th>}
                        {visibleColumns.includes('esg') && <th className="p-3 font-medium text-right">ESG</th>}
                    </tr>
                 </thead>
                  <tbody className="divide-y divide-[#1F1F23] text-xs">
                    {filteredSecurities.map((security) => {
                      const isThemeHighlighted = security.theme === hoveredTheme || security.theme === activeThemeFilter;
                      
                      return (
                        <motion.tr 
                          layout
                          key={security.id} 
                          onClick={() => setSelectedSecurity(security)}
                          className={cn(
                            "group cursor-pointer transition-all duration-700 ease-out relative",
                            selectedSecurity?.id === security.id ? "bg-[#1F1F23]" : "hover:bg-[#16161A]",
                            isThemeHighlighted && "bg-[#00FF41]/5 border-l-2 border-l-[#00FF41] shadow-[inset_10px_0_15px_-10px_rgba(0,255,65,0.1)]",
                            lastUpdatedId === security.id && "bg-[#00FF41]/10 shadow-[inset_0_0_20px_rgba(0,255,65,0.05)] z-10 font-bold"
                          )}
                        >
                           {visibleColumns.includes('ticker') && (
                             <td className="p-3 relative">
                                {(lastUpdatedId === security.id || isThemeHighlighted) && (
                                  <motion.div 
                                    layoutId={`active-indicator-${security.id}`}
                                    className={cn(
                                      "absolute left-0 top-0 bottom-0 w-0.5",
                                      lastUpdatedId === security.id ? "bg-[#00FF41]" : "bg-[#00FF41]/40"
                                    )}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                )}
                                <div className="flex flex-col">
                                   <span className={cn(
                                     "font-bold transition-colors",
                                     isThemeHighlighted ? "text-[#00FF41]" : "text-[#E4E4E7]"
                                   )}>
                                     {security.id}
                                   </span>
                                   <span className="text-[10px] text-[#52525B] truncate w-24">
                                     {security.name}
                                   </span>
                                </div>
                             </td>
                           )}
                           {visibleColumns.includes('pe') && (
                             <td className="p-3 text-right font-mono text-[#E4E4E7]">
                               {security.pe?.toFixed(1) || '—'}
                             </td>
                           )}
                           {visibleColumns.includes('marketCap') && (
                             <td className="p-3 text-right font-mono text-[#E4E4E7]">
                               {security.marketCap || '—'}
                             </td>
                           )}
                           {visibleColumns.includes('score') && (
                             <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                   <motion.span 
                                     key={`${security.id}-${security.score}`}
                                     initial={{ color: (lastUpdatedId === security.id || isThemeHighlighted) ? '#00FF41' : '#E4E4E7' }}
                                     animate={{ color: isThemeHighlighted ? '#00FF41' : '#E4E4E7' }}
                                     transition={{ duration: 1 }}
                                     className="font-mono text-xs"
                                   >
                                     {security.score.toFixed(2)}
                                   </motion.span>
                                   {security.momentum > 0.8 ? <ArrowUpRight size={10} className="text-[#00FF41]" /> : <ArrowDownRight size={10} className="text-red-400" />}
                                </div>
                             </td>
                           )}
                           {visibleColumns.includes('esg') && (
                             <td className="p-3 text-right">
                                 <div className="flex flex-col items-end gap-1">
                                   <span className={cn(
                                     "px-1.5 py-0.5 rounded text-[9px] font-bold",
                                     security.esg.includes('A') ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                                   )}>
                                     {security.esg}
                                   </span>
                                   <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addAssetToPortfolio(security, 10);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 px-1.5 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20 rounded-[2px] transition-all text-[8px] font-mono hover:bg-[#00FF41] hover:text-black flex items-center gap-1"
                                   >
                                      BUY_10
                                   </button>
                                 </div>
                             </td>
                           )}
                         </motion.tr>
                      );
                    })}
                  </tbody>
              </table>
           </div>

           {/* Mobile Card View */}
           <div className="md:hidden flex-1 overflow-y-auto p-4 space-y-3">
             {filteredSecurities.map((security) => {
               const isThemeHighlighted = security.theme === hoveredTheme || security.theme === activeThemeFilter;
               return (
                 <div 
                   key={security.id}
                   onClick={() => setSelectedSecurity(security)}
                   className={cn(
                     "p-3 rounded-md bg-[#16161A] border transition-all relative overflow-hidden",
                     selectedSecurity?.id === security.id ? "border-[#00FF41]/50 bg-[#1A1A20]" : "border-[#1F1F23]",
                     lastUpdatedId === security.id && "ring-1 ring-[#00FF41]/50"
                   )}
                 >
                   {isThemeHighlighted && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00FF41]" />
                   )}
                   <div className="flex justify-between items-start mb-2">
                     <div className="flex flex-col">
                       <span className={cn(
                         "text-xs font-bold font-mono tracking-wider",
                         isThemeHighlighted ? "text-[#00FF41]" : "text-white"
                       )}>
                         {security.id}
                       </span>
                       <span className="text-[10px] text-[#52525B] font-mono">{security.name}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className={cn(
                           "px-1.5 py-0.5 rounded text-[8px] font-bold font-mono",
                           security.esg.includes('A') ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                        )}>
                           {security.esg}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono font-bold">{security.score.toFixed(2)}</span>
                          {security.momentum > 0.8 ? <ArrowUpRight size={10} className="text-[#00FF41]" /> : <ArrowDownRight size={10} className="text-red-400" />}
                        </div>
                     </div>
                   </div>
                   <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                      <div className="flex gap-4">
                        {visibleColumns.includes('pe') && (
                          <div className="flex flex-col">
                             <span className="text-[8px] text-[#52525B] font-mono">P/E</span>
                             <span className="text-[10px] font-mono">{security.pe?.toFixed(1) || '—'}</span>
                          </div>
                        )}
                        {visibleColumns.includes('marketCap') && (
                          <div className="flex flex-col">
                             <span className="text-[8px] text-[#52525B] font-mono">MCAP</span>
                             <span className="text-[10px] font-mono">{security.marketCap || '—'}</span>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addAssetToPortfolio(security, 10);
                        }}
                        className="p-1 px-2 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20 rounded-[2px] transition-all text-[8px] font-mono hover:bg-[#00FF41] hover:text-black"
                      >
                         BUY_10
                      </button>
                   </div>
                 </div>
               );
             })}
           </div>
        </div>

      </div>

      <SmartUniverseAssistant 
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onApplyFilters={handleApplySmartFilters}
        results={securities}
      />
    </div>
  );
}
