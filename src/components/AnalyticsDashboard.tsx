import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { fetchAnalyticsData } from '../services/analyticsService';
import { Loader2, TrendingUp, ShieldAlert, Leaf } from 'lucide-react';
import { cn } from '../lib/utils';

const COLORS = ['#00FF41', '#3B82F6', '#F43F5E', '#A855F7', '#EAB308'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');
  const [portfolioId, setPortfolioId] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetchAnalyticsData(timeframe, portfolioId).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [timeframe, portfolioId]);

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="animate-spin text-[#00FF41]" size={32} />
    </div>
  );

  return (
    <div className="space-y-6 h-full overflow-y-auto p-6 font-mono">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">ANALYTICS_DASHBOARD</h1>
        <div className="flex gap-2 text-[10px]">
        <div className="flex gap-1 text-[10px]">
          {['7d', '30d', '90d'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={cn(
                "px-2 py-1 border transition-all",
                timeframe === t 
                  ? "bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]" 
                  : "bg-[#0D0D0F] border-[#1F1F23] text-[#71717A] hover:bg-[#16161A] hover:text-white"
              )}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
          <select value={portfolioId} onChange={(e) => setPortfolioId(e.target.value)} className="bg-[#0D0D0F] border border-[#1F1F23] p-1 text-[#00FF41]">
            <option value="all">ALL_PORTFOLIOS</option>
            <option value="tech">TECH_PORTFOLIO</option>
          </select>
        </div>
      </div>
      
      {/* Performance Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6">
          <h2 className="text-sm text-[#71717A] mb-4">PERFORMANCE_ATTRIBUTION</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F23" />
                <XAxis dataKey="date" hide />
                <YAxis stroke="#52525B" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0D0D0F', border: '1px solid #1F1F23' }} />
                <Line type="monotone" dataKey="value" stroke="#00FF41" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ESG & Environmental */}
        <div className="grid grid-cols-2 gap-4">
           {[
             { label: 'ESG_SCORE', value: data.esgMetrics.avgScore, icon: TrendingUp },
             { label: 'CARBON_INTENSITY', value: data.esgMetrics.carbonIntensity, icon: Leaf },
             { label: 'CONTROVERSY', value: data.esgMetrics.controversies, icon: ShieldAlert },
           ].map((metric, i) => (
             <div key={i} className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-4 flex flex-col justify-between">
                <span className="text-[10px] text-[#71717A]">{metric.label}</span>
                <div className="flex items-end justify-between">
                  <span className="text-xl font-bold text-white">{metric.value}</span>
                  <metric.icon size={16} className="text-[#00FF41]" />
                </div>
             </div>
           ))}
        </div>
      </div>

       {/* Sectors & Countries */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6">
          <h2 className="text-sm text-[#71717A] mb-4">SECTOR_BREAKDOWN</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.sectorBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F23" />
                <XAxis dataKey="name" stroke="#52525B" fontSize={10}/>
                <YAxis stroke="#52525B" fontSize={10}/>
                <Tooltip contentStyle={{ backgroundColor: '#0D0D0F', border: '1px solid #1F1F23' }} />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6">
          <h2 className="text-sm text-[#71717A] mb-4">COUNTRY_BREAKDOWN</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.countryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" label>
                  {data.countryBreakdown.map((_:any, index:number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
       </div>
    </div>
  );
}
