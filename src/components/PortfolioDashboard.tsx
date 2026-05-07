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
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { getPortfolioData, PortfolioPosition } from '../services/universeService';

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

export default function PortfolioDashboard() {
  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [filteredPortfolio, setFilteredPortfolio] = useState<PortfolioPosition[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const data = getPortfolioData();
    setPortfolio(data);
    setFilteredPortfolio(data);
  }, []);

  const stats = useMemo(() => {
    if (filteredPortfolio.length === 0) return null;
    
    const totalPL = filteredPortfolio.reduce((sum, p) => sum + p.unrealizedPL, 0);
    const avgScore = filteredPortfolio.reduce((sum, p) => sum + p.score, 0) / filteredPortfolio.length;
    const esgScores: Record<string, number> = { 'AAA': 95, 'AA': 85, 'A': 75, 'BBB': 65, 'BB': 55, 'B': 45 };
    const avgEsg = filteredPortfolio.reduce((sum, p) => sum + (esgScores[p.esg] || 50), 0) / filteredPortfolio.length;
    
    return {
      totalPL,
      avgScore,
      avgEsg
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
    return Array.from({ length: historyLength }, (_, i) => {
      let totalVal = 0;
      filteredPortfolio.forEach(p => {
        totalVal += (p.returnHistory[i]?.value || 0) * p.weight;
      });
      return {
        date: filteredPortfolio[0].returnHistory[i].date,
        value: totalVal
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
      // Simulate semantic filtering via API
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: `Filtering request: "${filterQuery}". Based on this query, please provide a filter criteria for geography, sector, or themes in JSON format.`,
          extractionOnly: true 
        })
      });
      
      const data = await response.json();
      const filters = JSON.parse(data.content || "{}");
      
      let results = [...portfolio];
      if (filters.sector) results = results.filter(p => p.sector.toLowerCase().includes(filters.sector.toLowerCase()));
      if (filters.geography) results = results.filter(p => p.geography.toLowerCase() === filters.geography.toLowerCase());
      
      setFilteredPortfolio(results);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & NLP Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white tracking-tighter">PORTFOLIO_ANALYTICS</h1>
          <p className="text-xs text-[#71717A] font-mono mt-1">REAL-TIME RISK & PERFORMANCE ENGINE</p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <input 
            type="text" 
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSemanticSearch()}
            placeholder="Ask anything (e.g. 'Show me Tech in Europe')..."
            className="w-full bg-[#0D0D0F] border border-[#1F1F23] rounded-md py-2.5 pl-10 pr-12 text-xs font-mono focus:outline-none focus:border-[#00FF41]/50 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B] group-hover:text-[#00FF41] transition-colors" size={14} />
          <button 
            onClick={handleSemanticSearch}
            className="absolute right-2 top-1.5 bottom-1.5 px-2 bg-[#1F1F23] rounded text-[9px] font-mono hover:text-[#00FF41] transition-all"
          >
            {isAnalyzing ? "..." : "QUERY"}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0D0D0F] border border-[#1F1F23] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#71717A]">ACTIVE_EXPOSURE</span>
            <PieChartIcon size={14} className="text-[#3B82F6]" />
          </div>
          <div className="text-xl font-mono font-bold text-white tracking-tight">
            ${(filteredPortfolio.length * 1.2).toFixed(1)}M
          </div>
          <div className="mt-1 text-[10px] text-[#52525B] font-mono">
            {filteredPortfolio.length} POSITIONS
          </div>
        </div>

        <div className="bg-[#0D0D0F] border border-[#1F1F23] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#71717A]">UNREALIZED_P/L</span>
            <TrendingUp size={14} className={cn(stats?.totalPL && stats.totalPL > 0 ? "text-[#00FF41]" : "text-red-500")} />
          </div>
          <div className={cn("text-xl font-mono font-bold tracking-tight", stats?.totalPL && stats.totalPL > 0 ? "text-[#00FF41]" : "text-red-500")}>
            {stats?.totalPL && stats.totalPL > 0 ? "+" : ""}{stats?.totalPL?.toFixed(2)}%
          </div>
          <div className="mt-1 text-[10px] text-[#52525B] font-mono">
            LAST 30 DAYS
          </div>
        </div>

        <div className="bg-[#0D0D0F] border border-[#1F1F23] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#71717A]">ESG_AGGREGATE</span>
            <ShieldCheck size={14} className="text-[#00FF41]" />
          </div>
          <div className="text-xl font-mono font-bold text-white tracking-tight">
            {stats?.avgEsg.toFixed(1)}
          </div>
          <div className="mt-1 text-[10px] text-[#52525B] font-mono flex items-center gap-1">
             <div className="w-2.5 h-2.5 rounded bg-[#00FF41]/20 flex items-center justify-center">
                <div className="w-1 h-1 bg-[#00FF41] rounded-full" />
             </div>
             AAA_TIER_RATING
          </div>
        </div>

        <div className="bg-[#0D0D0F] border border-[#1F1F23] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#71717A]">MOMENTUM_SCORE</span>
            <TrendingUp size={14} className="text-[#F43F5E]" />
          </div>
          <div className="text-xl font-mono font-bold text-white tracking-tight">
            {(stats?.avgScore || 0 * 100).toFixed(1)}
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
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#0D0D0F',
                    titleColor: '#71717A',
                    bodyColor: '#00FF41',
                    borderColor: '#1F1F23',
                    borderWidth: 1,
                    padding: 10,
                    titleFont: { family: 'monospace', size: 10 },
                    bodyFont: { family: 'monospace', size: 10 }
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
                        backgroundColor: '#0D0D0F',
                        borderColor: '#1F1F23',
                        borderWidth: 1,
                        padding: 10,
                        titleFont: { family: 'monospace', size: 10 },
                        bodyFont: { family: 'monospace', size: 10 }
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
                        backgroundColor: '#0D0D0F',
                        borderColor: '#1F1F23',
                        borderWidth: 1,
                        padding: 10,
                        titleFont: { family: 'monospace', size: 10 },
                        bodyFont: { family: 'monospace', size: 10 }
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
                    <div className="flex justify-center">
                       <button className="p-1 hover:bg-[#1F1F23] rounded text-[#52525B] hover:text-white transition-colors">
                          <Target size={14} />
                       </button>
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
