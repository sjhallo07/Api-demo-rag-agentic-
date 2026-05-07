import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Globe, 
  PieChart as PieChartIcon, 
  ShieldCheck, 
  Search, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  MoreVertical,
  RefreshCw,
  Download,
  ExternalLink,
  Plus,
  X,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { PortfolioPosition, getPortfolio, savePortfolio, removeAssetFromPortfolio } from '../services/portfolioService';
import { INSTRUMENTS, Security } from '../services/universeService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const COLORS = ['#00FF41', '#3B82F6', '#F43F5E', '#A855F7', '#EAB308', '#06B6D4'];

interface ActionMenuProps {
  onClose: () => void;
}

function ActionMenu({ onClose }: ActionMenuProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute right-0 mt-2 w-48 bg-[#16161A] border border-[#1F1F23] rounded-md shadow-2xl z-50 overflow-hidden"
    >
      <div className="py-1">
        {[
          { name: 'View Market Data', icon: ExternalLink },
          { name: 'Adjust Weight', icon: Target },
          { name: 'Add to Watchlist', icon: Plus },
          { name: 'Download Factsheet', icon: Download },
        ].map((item) => (
          <button 
            key={item.name}
            onClick={() => {
              console.log(`Action: ${item.name}`);
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-[10px] font-mono text-[#A1A1AA] hover:bg-[#1F1F23] hover:text-[#00FF41] flex items-center gap-2 transition-colors"
          >
            <item.icon size={12} />
            {item.name.toUpperCase()}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function PortfolioDashboard() {
  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [filteredPortfolio, setFilteredPortfolio] = useState<PortfolioPosition[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [selectedAssetToAdd, setSelectedAssetToAdd] = useState<Security | null>(null);
  const [addQuantity, setAddQuantity] = useState(1);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const data = getPortfolio();
      setPortfolio(data);
      setFilteredPortfolio(data);
      setIsRefreshing(false);
    }, 800);
  };

  const handleRemoveAsset = (id: string) => {
    const updated = removeAssetFromPortfolio(id);
    setPortfolio(updated);
    setFilteredPortfolio(updated);
    setActiveMenuId(null);
  };

  const stats = useMemo(() => {
    if (filteredPortfolio.length === 0) return null;
    
    const totalPL = filteredPortfolio.reduce((sum, p) => sum + p.unrealizedPL, 0);
    const avgScore = filteredPortfolio.reduce((sum, p) => sum + p.score, 0) / filteredPortfolio.length;
    
    // Financial Analytics
    const sharpe = (totalPL / 12) * 1.5; // Simulated Sharpe Ratio
    const volatility = 14.5 + (Math.random() * 2);
    const beta = 0.85 + (Math.random() * 0.3);
    
    return {
      totalPL,
      avgScore,
      sharpe,
      volatility,
      beta
    };
  }, [filteredPortfolio]);

  const sectorData = useMemo(() => {
    const sectors: Record<string, number> = {};
    filteredPortfolio.forEach(p => {
      sectors[p.sector] = (sectors[p.sector] || 0) + p.weight;
    });
    return Object.entries(sectors).map(([name, value]) => ({ name, value: value * 100 }));
  }, [filteredPortfolio]);

  const geoData = useMemo(() => {
    const regions: Record<string, number> = {};
    filteredPortfolio.forEach(p => {
      regions[p.geography] = (regions[p.geography] || 0) + p.weight;
    });
    return Object.entries(regions).map(([name, value]) => ({ name, value: value * 100 }));
  }, [filteredPortfolio]);

  const aggregatePerformance = useMemo(() => {
    if (filteredPortfolio.length === 0) return [];
    
    const historyLength = filteredPortfolio[0].returnHistory.length;
    const startVal = filteredPortfolio.reduce((sum, p) => sum + (p.returnHistory[0]?.value || 0) * p.weight, 0);

    return Array.from({ length: historyLength }, (_, i) => {
      let totalVal = 0;
      filteredPortfolio.forEach(p => {
        totalVal += (p.returnHistory[i]?.value || 0) * p.weight;
      });
      const change = ((totalVal - startVal) / startVal) * 100;
      return {
        date: filteredPortfolio[0].returnHistory[i].date,
        value: totalVal,
        change
      };
    });
  }, [filteredPortfolio]);

  const handleSemanticSearch = async () => {
    if (!filterQuery.trim()) {
      setFilteredPortfolio(portfolio);
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate semantic filtering
      const q = filterQuery.toLowerCase();
      let results = [...portfolio];
      
      if (q.includes('tech')) results = results.filter(p => p.sector === 'Technology' || p.sector === 'Semiconductors');
      if (q.includes('europe')) results = results.filter(p => p.geography === 'Europe');
      if (q.includes('momentum')) results = results.filter(p => p.momentum > 0.7);
      
      setFilteredPortfolio(results);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddAssetToPortfolio = () => {
    if (!selectedAssetToAdd) return;
    
    const existing = getPortfolio();
    const existingIndex = existing.findIndex(p => p.id === selectedAssetToAdd.id);
    
    let updated;
    if (existingIndex > -1) {
      existing[existingIndex].quantity += Number(addQuantity);
      updated = existing;
    } else {
      updated = [...existing, {
        ...selectedAssetToAdd,
        quantity: Number(addQuantity),
        weight: 1 / (existing.length + 1),
        unrealizedPL: 0,
        purchasedAt: new Date().toISOString(),
        returnHistory: Array.from({ length: 30 }, (_, i) => ({
          date: `2024-04-${i + 1}`,
          value: 100 + (i * 0.1)
        }))
      } as PortfolioPosition];
    }
    
    // Normalize weights
    const total = updated.length;
    updated.forEach(p => p.weight = 1 / total);
    
    savePortfolio(updated);
    setPortfolio(updated);
    setFilteredPortfolio(updated);
    setIsAddingAsset(false);
    setSelectedAssetToAdd(null);
  };

  return (
    <div className="space-y-6 relative">
      {/* Add Asset Modal */}
      <AnimatePresence>
        {isAddingAsset && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               onClick={() => setIsAddingAsset(false)}
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="relative bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6 w-full max-w-md shadow-2xl space-y-6"
             >
                <div className="flex items-center justify-between border-b border-[#1F1F23] pb-4">
                   <h3 className="font-mono font-bold text-[#00FF41]">EXECUTE_MANUAL_ORDER</h3>
                   <button onClick={() => setIsAddingAsset(false)} className="text-[#52525B] hover:text-white"><X size={18} /></button>
                </div>
                
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-mono text-[#71717A]">SELECT_SECURITY</label>
                      <select 
                        onChange={(e) => setSelectedAssetToAdd(INSTRUMENTS.find(i => i.id === e.target.value) || null)}
                        className="w-full bg-[#16161A] border border-[#1F1F23] rounded p-2 text-xs font-mono outline-none focus:border-[#00FF41]"
                      >
                         <option value="">-- SEARCH_TICKER --</option>
                         {INSTRUMENTS.map(i => (
                           <option key={i.id} value={i.id}>{i.id} - {i.name}</option>
                         ))}
                      </select>
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-[10px] font-mono text-[#71717A]">QUANTITY (SHARES)</label>
                      <input 
                        type="number"
                        value={addQuantity}
                        onChange={(e) => setAddQuantity(Number(e.target.value))}
                        className="w-full bg-[#16161A] border border-[#1F1F23] rounded p-2 text-xs font-mono outline-none focus:border-[#00FF41]"
                      />
                   </div>

                   {selectedAssetToAdd && (
                     <div className="p-3 bg-[#00FF41]/5 border border-[#00FF41]/10 rounded flex justify-between items-center">
                        <div className="text-[10px] font-mono text-[#71717A]">ESTIMATED_IMPACT</div>
                        <div className="text-[10px] font-mono text-[#00FF41]">SYSTEM_NEUTRAL</div>
                     </div>
                   )}
                </div>

                <button 
                  onClick={handleAddAssetToPortfolio}
                  disabled={!selectedAssetToAdd}
                  className="w-full py-2 bg-[#00FF41] text-black font-mono font-bold text-xs rounded hover:bg-[#00E53B] transition-all disabled:opacity-50"
                >
                   CONFIRM_ACQUISITION
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Header & NLP Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-[#00FF41]/10 border border-[#00FF41]/20 flex items-center justify-center">
             <TrendingUp className="text-[#00FF41]" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-mono font-bold text-white tracking-tighter uppercase">Portfolio_Intelligence</h1>
            <div className="flex items-center gap-3 mt-1">
               <p className="text-[10px] text-[#71717A] font-mono">NODE_STATUS: <span className="text-[#00FF41]">ACTIVE</span></p>
               <div className="w-1 h-1 rounded-full bg-[#52525B]" />
               <p className="text-[10px] text-[#71717A] font-mono italic">DATA_SYNC: 3s AGO</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="relative w-full md:w-72 group">
              <input 
                type="text" 
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSemanticSearch()}
                placeholder="Semantic filter..."
                className="w-full bg-[#0D0D0F] border border-[#1F1F23] rounded-md py-2 pl-8 pr-4 text-[11px] font-mono focus:outline-none focus:border-[#00FF41]/50 transition-all placeholder:text-[#3F3F46]"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#52525B] group-hover:text-[#00FF41] transition-colors" size={12} />
           </div>
           
           <button 
             onClick={refreshData}
             className="p-2 bg-[#0D0D0F] border border-[#1F1F23] rounded hover:border-[#00FF41]/50 transition-all text-[#71717A] hover:text-[#00FF41]"
             title="Sync Intelligence"
           >
              <RefreshCw size={14} className={cn(isRefreshing && "animate-spin")} />
           </button>

           <button 
             onClick={() => setIsAddingAsset(true)}
             className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#00FF41] border border-[#00FF41]/20 rounded text-[10px] font-mono text-black hover:bg-[#00E53B] transition-all font-bold"
           >
              <Plus size={12} />
              BUY_ASSET
           </button>

           <button 
             className="p-2 bg-[#0D0D0F] border border-[#1F1F23] rounded hover:border-[#3B82F6]/50 transition-all text-[#71717A] hover:text-[#3B82F6]"
             title="Export Analytics PDF"
           >
              <Download size={14} />
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0D0D0F] border border-[#1F1F23] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#71717A]">SHARPE_RATIO</span>
            <ShieldCheck size={14} className="text-[#3B82F6]" />
          </div>
          <div className="text-xl font-mono font-bold text-white tracking-tight">
            {stats?.sharpe.toFixed(2)}
          </div>
          <div className="mt-1 text-[10px] text-[#52525B] font-mono">
             RISK_ADJUSTED_RETURN
          </div>
        </div>

        <div className="bg-[#0D0D0F] border border-[#1F1F23] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#71717A]">ANN_VOLATILITY</span>
            <TrendingUp size={14} className="text-red-500" />
          </div>
          <div className="text-xl font-mono font-bold text-white tracking-tight">
            {stats?.volatility.toFixed(1)}%
          </div>
          <div className="mt-1 text-[10px] text-[#52525B] font-mono">
            365D_STANDARD_DEVIATION
          </div>
        </div>

        <div className="bg-[#0D0D0F] border border-[#1F1F23] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#71717A]">MARKET_BETA</span>
            <Target size={14} className="text-[#A855F7]" />
          </div>
          <div className="text-xl font-mono font-bold text-white tracking-tight">
            {stats?.beta.toFixed(2)}
          </div>
          <div className="mt-1 text-[10px] text-[#52525B] font-mono flex items-center gap-1">
             S&P_500_CORRELATION
          </div>
        </div>

        <div className="bg-[#0D0D0F] border border-[#1F1F23] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#71717A]">MOMENTUM_SCORE</span>
            <TrendingUp size={14} className="text-[#00FF41]" />
          </div>
          <div className="text-xl font-mono font-bold text-white tracking-tight">
            {(stats?.avgScore || 0).toFixed(1)}
          </div>
          <div className="mt-1 text-[10px] text-[#52525B] font-mono">
            BULLISH INDICATOR
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Performance Chart */}
        <div className="md:col-span-8 bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-mono font-bold text-white">PORTFOLIO_PERFORMANCE</h3>
              <p className="text-[10px] text-[#52525B] font-mono">CUMULATIVE RETURN (30D)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 px-2 flex items-center bg-[#16161A] border border-[#1F1F23] rounded text-[9px] font-mono text-[#71717A]">1D</div>
              <div className="h-6 px-2 flex items-center bg-[#16161A] border border-[#1F1F23] rounded text-[9px] font-mono text-[#71717A]">1W</div>
              <div className="h-6 px-2 flex items-center bg-[#00FF41]/10 border border-[#00FF41]/30 rounded text-[9px] font-mono text-[#00FF41]">1M</div>
            </div>
          </div>
          
          <div className="h-64 mt-auto">
            <Line 
              data={{
                labels: aggregatePerformance.map(d => d.date),
                datasets: [{
                  fill: true,
                  label: 'Value',
                  data: aggregatePerformance.map(d => d.value),
                  borderColor: '#00FF41',
                  backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
                    gradient.addColorStop(0, 'rgba(0, 255, 65, 0.2)');
                    gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
                    return gradient;
                  },
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#16161A',
                    titleColor: '#71717A',
                    bodyColor: '#E4E4E7',
                    borderColor: '#1F1F23',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 4,
                    titleFont: { family: 'monospace', size: 10, weight: 'bold' },
                    bodyFont: { family: 'monospace', size: 10 },
                    displayColors: false,
                    callbacks: {
                      title: (context: any) => `PERIOD: ${context[0].label}`,
                      label: (context: any) => {
                        const data = aggregatePerformance[context.dataIndex];
                        return [
                         `INDEX_VAL: $${data.value.toFixed(2)}M`,
                         `TOTAL_RET: ${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)}%`,
                         `VOLATILITY: ${(Math.random() * 2 + 1).toFixed(2)}%`
                        ];
                      }
                    }
                  }
                },
                scales: {
                  x: { display: false },
                  y: {
                    grid: { color: '#1F1F23' },
                    ticks: { color: '#52525B', font: { family: 'monospace', size: 10 } }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Allocation Sidebar */}
        <div className="md:col-span-4 flex flex-col gap-6">
           <div className="flex-1 bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6">
              <h3 className="text-sm font-mono font-bold text-white mb-4">SECTOR_ALLOCATION</h3>
              <div className="h-48">
                <Pie 
                  data={{
                    labels: sectorData.map(d => d.name),
                    datasets: [{
                      data: sectorData.map(d => d.value),
                      backgroundColor: COLORS,
                      borderColor: '#0D0D0F',
                      borderWidth: 2,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#16161A',
                        borderColor: '#1F1F23',
                        borderWidth: 1,
                        padding: 12,
                        titleFont: { family: 'monospace', size: 10, weight: 'bold' },
                        bodyFont: { family: 'monospace', size: 10 },
                        displayColors: true,
                        callbacks: {
                          label: (context: any) => ` ${context.label.toUpperCase()}: ${context.raw.toFixed(2)}% ALLOC`
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="space-y-2 mt-2">
                {sectorData.slice(0, 3).map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[10px] font-mono text-[#71717A]">{s.name.toUpperCase()}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white">{s.value.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
           </div>

           <div className="flex-1 bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6">
              <h3 className="text-sm font-mono font-bold text-white mb-4">GEO_EXPOSURE</h3>
              <div className="h-48">
                <Bar 
                  data={{
                    labels: geoData.map(d => d.name),
                    datasets: [{
                      label: 'Exposure %',
                      data: geoData.map(d => d.value),
                      backgroundColor: '#3B82F6',
                      borderRadius: 4,
                    }]
                  }}
                  options={{
                    indexAxis: 'y' as const,
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#16161A',
                        borderColor: '#1F1F23',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                           label: (context: any) => ` ${context.raw.toFixed(2)}% SYSTEM_EXPOSURE`
                        }
                      }
                    },
                    scales: {
                      x: { 
                        grid: { display: false },
                        ticks: { color: '#52525B', font: { family: 'monospace', size: 8 } }
                      },
                      y: {
                        grid: { display: false },
                        ticks: { color: '#71717A', font: { family: 'monospace', size: 9 } }
                      }
                    }
                  }}
                />
              </div>
           </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#1F1F23] bg-[#16161A]/50 flex items-center justify-between">
           <h3 className="text-sm font-mono font-bold text-white">POSITION_BREAKDOWN</h3>
           <Filter size={14} className="text-[#52525B]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1F1F23] bg-[#050506]">
                <th className="p-3 text-[10px] font-mono text-[#52525B] uppercase tracking-wider">Asset</th>
                <th className="p-3 text-[10px] font-mono text-[#52525B] uppercase tracking-wider">Sector</th>
                <th className="p-3 text-[10px] font-mono text-[#52525B] uppercase tracking-wider text-right">Weight</th>
                <th className="p-3 text-[10px] font-mono text-[#52525B] uppercase tracking-wider text-right">P/L (30D)</th>
                <th className="p-3 text-[10px] font-mono text-[#52525B] uppercase tracking-wider text-center">ESG</th>
                <th className="p-3 text-[10px] font-mono text-[#52525B] uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPortfolio.map((pos) => (
                <tr key={pos.id} className="border-b border-[#1F1F23] hover:bg-[#16161A] transition-colors group">
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-bold text-white">{pos.id}</span>
                      <span className="text-[10px] text-[#52525B] font-mono">{pos.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-mono text-[#71717A] px-2 py-0.5 bg-[#1F1F23] rounded">{pos.sector.toUpperCase()}</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-[11px] font-mono text-[#E4E4E7]">{(pos.weight * 100).toFixed(2)}%</span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className={cn("text-[11px] font-mono", pos.unrealizedPL > 0 ? "text-[#00FF41]" : "text-red-500")}>
                        {pos.unrealizedPL > 0 ? "+" : ""}{pos.unrealizedPL.toFixed(2)}%
                      </span>
                      <div className="w-12 h-1 bg-[#1F1F23] rounded-full overflow-hidden mt-1">
                        <div 
                          className={cn("h-full", pos.unrealizedPL > 0 ? "bg-[#00FF41]" : "bg-red-500")} 
                          style={{ width: `${Math.min(100, Math.abs(pos.unrealizedPL) * 5)}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center">
                      <span className={cn(
                        "text-[10px] font-mono px-1.5 py-0.5 rounded border",
                        pos.esg === 'AAA' ? "text-[#00FF41] border-[#00FF41]/30 bg-[#00FF41]/5" :
                        pos.esg === 'AA' ? "text-blue-400 border-blue-400/30 bg-blue-400/5" :
                        "text-[#71717A] border-[#1F1F23] bg-[#16161A]"
                      )}>
                        {pos.esg}
                      </span>
                    </div>
                  </td>
                      <td className="p-3">
                    <div className="flex justify-center relative">
                       <button 
                        onClick={() => setActiveMenuId(activeMenuId === pos.id ? null : pos.id)}
                        className="p-1.5 hover:bg-[#1F1F23] rounded text-[#52525B] hover:text-[#00FF41] transition-colors"
                       >
                          <MoreVertical size={14} />
                       </button>
                       <AnimatePresence>
                         {activeMenuId === pos.id && (
                           <>
                             <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                             <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 mt-2 w-48 bg-[#16161A] border border-[#1F1F23] rounded-md shadow-2xl z-50 overflow-hidden"
                            >
                              <div className="py-1">
                                {[
                                  { name: 'View Market Data', icon: ExternalLink, action: () => {} },
                                  { name: 'Adjust Weight', icon: Target, action: () => {} },
                                  { name: 'Purge Asset', icon: Trash2, action: () => handleRemoveAsset(pos.id), color: 'text-red-400' },
                                  { name: 'Download Factsheet', icon: Download, action: () => {} },
                                ].map((item) => (
                                  <button 
                                    key={item.name}
                                    onClick={() => {
                                      item.action();
                                      setActiveMenuId(null);
                                    }}
                                    className={cn(
                                      "w-full text-left px-4 py-2 text-[10px] font-mono hover:bg-[#1F1F23] flex items-center gap-2 transition-colors",
                                      item.color || "text-[#A1A1AA] hover:text-[#00FF41]"
                                    )}
                                  >
                                    <item.icon size={12} />
                                    {item.name.toUpperCase()}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                           </>
                         )}
                       </AnimatePresence>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPortfolio.length === 0 && (
            <div className="p-12 text-center text-[#52525B] font-mono">
               NO_POSITIONS_MATCH_CRITERIA
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
