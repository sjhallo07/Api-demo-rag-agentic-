import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { UNIVERSE_METADATA } from '../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ThemeExposureHistoryChartProps {
  history: any[];
  selectedThemes: string[];
  isLiveMode: boolean;
}

const THEME_COLORS: Record<string, string> = {
  'Consumer Tech': '#00FF41',
  'Enterprise Software': '#3B82F6',
  'Lithography': '#F59E0B',
  'AI/GPU': '#8B5CF6',
  'Luxury': '#F43F5E',
  'EV Transition': '#10B981',
  'Global Banking': '#6366F1',
  'Personal Care': '#EC4899',
};

export default function ThemeExposureHistoryChart({ 
  history, 
  selectedThemes, 
  isLiveMode 
}: ThemeExposureHistoryChartProps) {
  const THEMES = UNIVERSE_METADATA.THEMES;
  const activeThemes = selectedThemes.length > 0 ? selectedThemes : [THEMES[0], THEMES[1], THEMES[2]];

  const chartData = useMemo(() => {
    return {
      labels: history.map(d => d.time),
      datasets: activeThemes.map((theme) => {
        const color = THEME_COLORS[theme] || '#71717A';
        return {
          label: theme.toUpperCase(),
          data: history.map(d => d[theme] || 0),
          borderColor: color,
          backgroundColor: `${color}10`,
          borderWidth: 2,
          pointRadius: history.length > 10 ? 0 : 2,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          tension: 0.4,
          fill: true,
        };
      }),
    };
  }, [history, activeThemes]);

  const trends = useMemo(() => {
    if (history.length < 5) return [];

    return activeThemes.map(theme => {
      const recent = history.slice(-5);
      const start = recent[0][theme] || 0;
      const end = recent[recent.length - 1][theme] || 0;
      const diff = end - start;
      const percentChange = start !== 0 ? (diff / start) * 100 : 0;

      return {
        theme,
        diff,
        percentChange,
        status: diff > 0.05 ? 'up' : diff < -0.05 ? 'down' : 'neutral'
      };
    });
  }, [history, activeThemes]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {trends.map((trend) => (
          <div 
            key={trend.theme} 
            className="bg-black/40 border border-[#1F1F23] rounded p-2 flex flex-col gap-1 items-start group hover:border-[#52525B] transition-all"
          >
            <div className="flex items-center gap-1.5 min-w-0 w-full">
              <div 
                className="w-1.5 h-1.5 rounded-full shrink-0" 
                style={{ backgroundColor: THEME_COLORS[trend.theme] || '#71717A' }} 
              />
              <span className="text-[8px] font-mono font-bold text-[#71717A] truncate uppercase leading-none group-hover:text-white transition-colors">
                {trend.theme}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 pt-0.5">
               <span className="text-xs font-bold text-white leading-none">
                 {(history[history.length - 1]?.[trend.theme] || 0).toFixed(2)}
               </span>
               <div className={cn(
                 "flex items-center gap-0.5 text-[8px] font-mono font-bold",
                 trend.status === 'up' ? "text-[#00FF41]" : trend.status === 'down' ? "text-red-500" : "text-[#71717A]"
               )}>
                 {trend.status === 'up' ? <TrendingUp size={8} /> : trend.status === 'down' ? <TrendingDown size={8} /> : <Minus size={8} />}
                 {Math.abs(trend.percentChange).toFixed(1)}%
               </div>
            </div>
          </div>
        ))}
        {activeThemes.length === 0 && (
          <div className="col-span-full py-4 text-center border border-dashed border-[#1F1F23] rounded">
             <p className="text-[10px] font-mono text-[#52525B]">ACTIVATE_THEMES_TO_TRACK_MOMENTUM</p>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 relative">
        <Line 
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: isLiveMode ? 0 : 500
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
            scales: {
              x: {
                grid: { 
                  display: true,
                  color: 'rgba(255, 255, 255, 0.03)' 
                },
                ticks: {
                  color: '#52525B',
                  font: { size: 9, family: 'monospace' },
                  maxTicksLimit: 6,
                  autoSkip: true,
                },
                display: history.length >= 2
              },
              y: {
                grid: { 
                  display: true,
                  color: 'rgba(255, 255, 255, 0.03)' 
                },
                ticks: {
                  color: '#52525B',
                  font: { size: 9, family: 'monospace' },
                  callback: (value) => value.toString()
                }
              }
            },
            plugins: {
              legend: { 
                display: false // We have our own custom indicator above
              },
              tooltip: {
                enabled: true,
                backgroundColor: '#0D0D0F',
                titleColor: '#00FF41',
                bodyColor: '#E4E4E7',
                borderColor: '#1F1F23',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 4,
                titleFont: { family: 'monospace', size: 11, weight: 'bold' },
                bodyFont: { family: 'monospace', size: 10 },
                titleSpacing: 4,
                bodySpacing: 4,
                boxPadding: 4,
                usePointStyle: true,
              }
            }
          }}
        />
        
        {history.length < 2 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D0D0F]/40 backdrop-blur-[1px] rounded-lg">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
               className="mb-3"
             >
                <Info size={24} className="text-[#3B82F6] opacity-30" />
             </motion.div>
             <p className="text-[10px] font-mono text-[#52525B] uppercase tracking-[0.2em] font-bold">Initializing_Thematic_Telemetry...</p>
             <p className="text-[8px] font-mono text-[#3F3F46] mt-1 italic">Waiting for sufficient data packets to render trajectory</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#1F1F23]">
         <div className="flex gap-4">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-sm bg-[#00FF41]/20 border border-[#00FF41]/40" />
               <span className="text-[9px] font-mono text-[#52525B]">DATA_SOURCE: GEMINI_RAG_v4</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-sm bg-[#3B82F6]/20 border border-[#3B82F6]/40" />
               <span className="text-[9px] font-mono text-[#52525B]">ENGINE: BIT_HYBRID_CORE</span>
            </div>
         </div>
         <span className="text-[8px] font-mono text-[#3F3F46] italic uppercase">Internal_Proprietary_Exposure_Calculation</span>
      </div>
    </div>
  );
}
