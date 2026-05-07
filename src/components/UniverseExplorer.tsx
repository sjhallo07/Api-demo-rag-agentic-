import React, { useState, useEffect } from 'react';
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
  Settings2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Security, UniverseQueryResponse } from '../types';
import { addAssetToPortfolio } from '../services/portfolioService';

export default function UniverseExplorer() {
  const [query, setQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
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
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['ticker', 'score', 'esg']);

  const COLUMNS = [
    { id: 'ticker', label: 'TICKER' },
    { id: 'pe', label: 'P/E_RATIO' },
    { id: 'marketCap', label: 'MARKET_CAP' },
    { id: 'score', label: 'SCORE' },
    { id: 'esg', label: 'ESG' },
  ];

  const SECTORS = ["Technology", "Semiconductors", "Consumer", "Automotive", "Finance", "Healthcare", "Energy"];
  const THEMES = ["Consumer Tech", "Enterprise Software", "Lithography", "AI/GPU", "Luxury", "EV Transition", "Global Banking", "Personal Care"];

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

  const clearFilters = () => {
    setSelectedThemes([]);
    setActiveThemeFilter(null);
    performSearch(query, { themes: [], sector: selectedSector });
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
      
      setSecurities(prev => prev.map((s, i) => {
        if (randomIndices.includes(i)) {
          // Volatility factor based on momentum
          const volatility = 0.03 + (s.momentum * 0.05);
          const drift = (Math.random() * volatility * 2) - volatility;
          
          return {
            ...s,
            score: Math.max(0, Math.min(1, s.score + drift)),
            momentum: Math.max(0, Math.min(1, s.momentum + (drift * 0.8)))
          };
        }
        return s;
      }));

      // Highlight the first updated security for visual feedback
      setLastUpdatedId(targetIds[0]);
      const timer = setTimeout(() => setLastUpdatedId(null), 1200);
      return () => clearTimeout(timer);
    }, 2000); // More frequent updates

    return () => clearInterval(interval);
  }, [isLiveMode, securities.length]);

  return (
    <div className="flex flex-col h-full space-y-6">
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
        /* Explorer Bar (Existing) */
        <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[300px] relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B] group-focus-within:text-[#00FF41] transition-colors" size={18} />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && performSearch(query)}
            placeholder="Search universe by geography, theme, or ticker..."
            className="w-full bg-[#0D0D0F] border border-[#1F1F23] rounded-md py-2.5 pl-10 pr-24 text-sm focus:outline-none focus:border-[#00FF41]/50 focus:ring-1 focus:ring-[#00FF41]/20 transition-all font-mono"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
             <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#00FF41]/5 border border-[#00FF41]/10">
                <div className="w-1 h-1 rounded-full bg-[#00FF41] animate-pulse" />
                <span className="text-[8px] font-mono text-[#00FF41] font-bold">SESSION_ACTIVE</span>
             </div>
             <kbd className="px-1.5 py-0.5 rounded bg-[#16161A] border border-[#1F1F23] text-[10px] font-mono text-[#52525B]">ENTER</kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 border rounded-md text-xs font-mono transition-all",
              isLiveMode 
                ? "bg-[#00FF41]/10 border-[#00FF41]/30 text-[#00FF41]" 
                : "bg-[#0D0D0F] border-[#1F1F23] text-[#71717A]"
            )}
          >
            <RefreshCcw size={14} className={isLiveMode ? "animate-spin-slow" : ""} />
            {isLiveMode ? "LIVE_FEED_ON" : "LIVE_FEED_OFF"}
          </button>
          <select 
            value={selectedSector}
            onChange={(e) => {
              setSelectedSector(e.target.value);
              performSearch(query, { sector: e.target.value, themes: selectedThemes });
            }}
            className="bg-[#0D0D0F] border border-[#1F1F23] rounded-md px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#00FF41]/50 text-[#E4E4E7]"
          >
            <option value="">ALL_SECTORS</option>
            {SECTORS.map(s => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>

          {/* Theme Multi-select */}
          <div className="relative">
            <button 
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 bg-[#0D0D0F] border rounded-md text-xs font-mono transition-all",
                selectedThemes.length > 0 ? "border-[#00FF41]/50 text-[#00FF41]" : "border-[#1F1F23] text-[#71717A] hover:border-[#52525B]"
              )}
            >
              <Zap size={14} />
              {selectedThemes.length > 0 ? `THEMES (${selectedThemes.length})` : "SELECT_THEMES"}
            </button>
            
            {showThemeDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowThemeDropdown(false)} />
                <div className="absolute top-full mt-2 left-0 w-48 bg-[#0D0D0F] border border-[#1F1F23] rounded-md shadow-2xl z-20 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-200">
                  {THEMES.map(theme => (
                    <button
                      key={theme}
                      onMouseEnter={() => setHoveredTheme(theme)}
                      onMouseLeave={() => setHoveredTheme(null)}
                      onClick={() => {
                        const newThemes = selectedThemes.includes(theme)
                          ? selectedThemes.filter(t => t !== theme)
                          : [...selectedThemes, theme];
                        setSelectedThemes(newThemes);
                        performSearch(query, { themes: newThemes, sector: selectedSector });
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded text-[10px] font-mono transition-colors flex items-center justify-between",
                        selectedThemes.includes(theme) ? "bg-[#00FF41]/10 text-[#00FF41]" : "text-[#71717A] hover:bg-[#16161A] hover:text-[#E4E4E7]"
                      )}
                    >
                      {theme.toUpperCase()}
                      {selectedThemes.includes(theme) && <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41]" />}
                    </button>
                  ))}
                  {selectedThemes.length > 0 && (
                    <button 
                      onClick={() => {
                        setSelectedThemes([]);
                        performSearch(query, { themes: [], sector: selectedSector });
                        setShowThemeDropdown(false);
                      }}
                      className="w-full text-center py-2 text-[9px] font-mono text-red-400 hover:bg-red-400/5 mt-1 border-t border-[#1F1F23]"
                    >
                      CLEAR_ALL
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <button className="flex items-center gap-2 px-3 py-2 bg-[#0D0D0F] border border-[#1F1F23] rounded-md text-xs font-mono hover:border-[#52525B] transition-all">
            <Filter size={14} />
            FILTERS
          </button>
          <button 
             onClick={() => performSearch(query)}
             className="p-2 bg-[#0D0D0F] border border-[#1F1F23] rounded-md hover:text-[#00FF41] transition-all"
          >
            <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-[#00FF41] text-black rounded-md text-xs font-bold hover:bg-[#00E53B] transition-all"
            >
              <Download size={14} />
              EXPORT_DATA
            </button>
            
            {showExportDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowExportDropdown(false)} />
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0D0D0F] border border-[#1F1F23] rounded-md shadow-2xl z-20 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={() => {
                      console.log("Exporting basket...");
                      setShowExportDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded text-[10px] font-mono text-[#E4E4E7] hover:bg-[#16161A] transition-colors flex items-center gap-2"
                  >
                    <Download size={12} className="text-[#00FF41]" />
                    EXPORT_BASKET
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="w-full text-left px-3 py-2 rounded text-[10px] font-mono text-[#E4E4E7] hover:bg-[#16161A] transition-colors flex items-center gap-2"
                  >
                    <FileText size={12} className="text-[#3B82F6]" />
                    DOWNLOAD_CSV
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="w-full text-left px-3 py-2 rounded text-[10px] font-mono text-[#E4E4E7] hover:bg-[#16161A] transition-colors flex items-center gap-2"
                  >
                    <FileCode size={12} className="text-orange-400" />
                    PRINT_PDF_REPORT
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="p-2 bg-[#0D0D0F] border border-[#1F1F23] rounded-md text-[#71717A] hover:text-white transition-all"
            >
              <Settings2 size={16} />
            </button>
            
            {showColumnDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowColumnDropdown(false)} />
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0D0D0F] border border-[#1F1F23] rounded-md shadow-2xl z-20 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-1.5 text-[8px] font-mono text-[#52525B] border-b border-[#1F1F23] mb-1">
                    CONFIGURE_COLUMNS
                  </div>
                  {COLUMNS.map(col => (
                    <button
                      key={col.id}
                      onClick={() => {
                        const newCols = visibleColumns.includes(col.id)
                          ? visibleColumns.filter(c => c !== col.id)
                          : [...visibleColumns, col.id];
                        // Ensure at least ticker is visible
                        if (newCols.length > 0) setVisibleColumns(newCols);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded text-[10px] font-mono transition-colors flex items-center justify-between",
                        visibleColumns.includes(col.id) ? "text-[#00FF41]" : "text-[#71717A] hover:bg-[#16161A] hover:text-[#E4E4E7]"
                      )}
                    >
                      {col.label}
                      {visibleColumns.includes(col.id) && <div className="w-1 h-1 rounded-full bg-[#00FF41]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
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

        {/* Factors Analysis Chart */}
        <div className="col-span-12 lg:col-span-8 bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6 flex flex-col h-[400px]">
           <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                 <h3 className="text-sm font-mono font-bold">FACTOR_EXPOSURE_INDEX</h3>
                 <p className="text-xs text-[#52525B]">Relative exposure analysis across selected universe</p>
              </div>
              <Maximize2 size={16} className="text-[#52525B] cursor-pointer" />
           </div>
           
           <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={filteredSecurities}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F1F23" vertical={false} />
                    <XAxis 
                      dataKey="id" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#52525B', fontSize: 10, fontFamily: 'monospace' }}
                      dy={10}
                    />
                    <YAxis 
                      hide
                    />
                    <Tooltip 
                      cursor={{ fill: '#1F1F23', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#0D0D0F', border: '1px solid #1F1F23', borderRadius: '4px', fontSize: '10px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#00FF41' }}
                    />
                    <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                       {filteredSecurities.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00FF41' : '#00A635'} />
                       ))}
                    </Bar>
                    <Bar dataKey="momentum" radius={[2, 2, 0, 0]}>
                       {filteredSecurities.map((entry, index) => (
                         <Cell key={`cell-m-${index}`} fill="#3B82F6" opacity={0.6} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Real-time Data Grid */}
        <div className="col-span-12 lg:col-span-4 bg-[#0D0D0F] border border-[#1F1F23] rounded-lg flex flex-col overflow-hidden max-h-[400px]">
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
           <div className="flex-1 overflow-y-auto">
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
                        <tr 
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
                        </tr>
                      );
                    })}
                  </tbody>
               </table>
           </div>
        </div>

      </div>
    </div>
  );
}
