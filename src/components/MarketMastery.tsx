import React from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Building2,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

const SECTORS = [
  { sector: "Banking", function: "Deposits, lending, and capital management.", work: "High (Global)", roles: "Retail Banker, Credit Analyst, Branch Manager." },
  { sector: "Foreign Exchange", function: "Currency exchange and global trade settlement.", work: "High (24/7 Market)", roles: "FX Trader, Treasury Analyst, Compliance Officer." },
  { sector: "Capital Markets", function: "Issuing and trading stocks, bonds, and derivatives.", work: "Moderate to High", roles: "Investment Banker, Stockbroker, Equity Researcher." },
  { sector: "Asset Management", function: "Managing portfolios for individuals and institutions.", work: "Moderate", roles: "Portfolio Manager, Financial Advisor, Fund Administrator." },
  { sector: "Insurance", function: "Risk pooling and protection against financial loss.", work: "Moderate", roles: "Actuary, Underwriter, Claims Adjuster." },
  { sector: "Cryptocurrency", function: "Decentralized digital assets and blockchain finance.", work: "Emerging (Rapid Growth)", roles: "Blockchain Developer, Crypto Analyst, DeFi Strategist." },
  { sector: "FinTech", function: "Technological innovation in financial services.", work: "High (Growing Startups)", roles: "Software Engineer, Product Manager, Data Scientist." },
  { sector: "Real Estate", function: "Mortgage finance and property investment trusts (REITs).", work: "Moderate", roles: "Mortgage Broker, Property Manager, REIT Analyst." },
];

const NY_INDICES = [
  { name: 'S&P 500', value: '5,123.42', change: '+1.24%', trend: 'up' },
  { name: 'NASDAQ-100', value: '18,241.90', change: '+0.85%', trend: 'up' },
  { name: 'DOW JONES', value: '38,927.15', change: '-0.12%', trend: 'down' },
  { name: 'RUSSELL 2000', value: '2,045.10', change: '+2.10%', trend: 'up' },
];

export default function MarketMastery() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00FF41]/10 border border-[#00FF41]/20 rounded-lg">
            <Globe className="text-[#00FF41]" size={24} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-white uppercase font-mono">Market_Mastery_Hub</h2>
            <p className="text-[#71717A] text-sm">Comprehensive multi-sector intelligence and career trajectory mapping.</p>
          </div>
        </div>
      </div>

      {/* Global Indices Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {NY_INDICES.map((index, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -2 }}
            className="bg-[#0D0D0F] border border-[#1F1F23] p-4 rounded-lg flex justify-between items-center group hover:border-[#00FF41]/30 transition-all"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#52525B]">{index.name}</span>
              <div className="text-sm font-bold font-mono tracking-tighter text-white">{index.value}</div>
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-mono font-bold ${index.trend === 'up' ? 'text-[#00FF41]' : 'text-red-500'}`}>
              {index.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {index.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sectors Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="text-[#3B82F6]" size={18} />
            <h3 className="text-sm font-mono font-bold text-white uppercase">Sector_Inventory_L3</h3>
          </div>
          <div className="text-[10px] font-mono text-[#52525B]">LAST_UPDATE: PD-05-07-26_SYC</div>
        </div>

        <div className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1F1F23] bg-[#16161A]">
                  <th className="px-6 py-4 text-[10px] font-mono text-[#71717A] font-bold">SECTOR_NAME</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-[#71717A] font-bold">CORE_FUNCTION</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-[#71717A] font-bold">WORK_AVAILABILITY</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-[#71717A] font-bold">PRIMARY_ROLES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F23]">
                {SECTORS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#16161A]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.sector === 'Cryptocurrency' || item.sector === 'FinTech' ? 'bg-[#00FF41] animate-pulse' : 'bg-[#3B82F6]'}`} />
                        <span className="text-xs font-bold text-white uppercase font-mono">{item.sector}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#A1A1AA] font-light leading-relaxed">
                      {item.function}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-mono px-2 py-1 rounded border ${
                        item.work.includes('High') || item.work.includes('Emerging')
                        ? 'border-[#00FF41]/20 bg-[#00FF41]/5 text-[#00FF41]'
                        : 'border-[#3B82F6]/20 bg-[#3B82F6]/5 text-[#3B82F6]'
                      }`}>
                        {item.work}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#71717A] italic">
                      {item.roles}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Membership & History Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
            <Lock size={120} strokeWidth={1} />
          </div>
          <div className="space-y-2 relative z-10">
            <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
              <ShieldCheck className="text-[#00FF41]" size={16} />
              USER_ACCESS_&_MEMBERSHIP_PROTOCOLS
            </h3>
            <p className="text-xs text-[#71717A]">Based on global market structures and career standards.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-black border border-[#1F1F23] rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#E4E4E7]">STANDARD_PLAN (FREE)</span>
                <span className="text-[8px] font-mono text-[#52525B]">ACTIVE_LIMITS</span>
              </div>
              <ul className="space-y-2">
                <li className="text-[10px] font-mono text-[#71717A] flex gap-2">
                  <span className="text-[#00FF41]">•</span> Access to basic sector summaries and market snapshots.
                </li>
                <li className="text-[10px] font-mono text-[#71717A] flex gap-2">
                  <span className="text-[#00FF41]">•</span> History restricted to last 48 hours only.
                </li>
              </ul>
            </div>

            <div className="p-4 bg-[#00FF41]/5 border border-[#00FF41]/20 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#00FF41]">PREMIUM_UPGRADE_PROTOCOLS</span>
                <Zap size={12} className="text-[#00FF41] animate-pulse" />
              </div>
              <ul className="space-y-2">
                <li className="text-[10px] font-mono text-white flex gap-2">
                   <span className="text-[#00FF41]">»</span> COMPLETE_HISTORICAL_DATA [LIFETIME]
                </li>
                <li className="text-[10px] font-mono text-white flex gap-2">
                   <span className="text-[#00FF41]">»</span> FLIPPENER & COMPARATOR TOOLSET
                </li>
                <li className="text-[10px] font-mono text-white flex gap-2">
                   <span className="text-[#00FF41]">»</span> ADVANCED_EXPORT_CAPABILITIES [PDF/CSV/JSON]
                </li>
              </ul>
              <button className="w-full py-2 bg-[#00FF41] text-black rounded font-bold text-[10px] font-mono hover:bg-[#00E53B] transition-all">
                INITIATE_UPGRADE_SIGNAL
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#0D0D0F] border border-[#1F1F23] rounded-lg p-6 flex flex-col justify-between">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <Clock className="text-[#3B82F6]" size={16} />
                <h3 className="text-sm font-mono font-bold text-white uppercase">Access_Continuity</h3>
             </div>
             <p className="text-xs text-[#71717A] leading-relaxed">
               The BITA Intelligence protocol tracks your transition from a casual observer to a professional quantitative factor researcher. Your data footprint expands as your institutional access matures.
             </p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#1F1F23]">
             <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-[#52525B]">DATA_RETENTION_INDEX</span>
                <span className="text-white">48H / ∞</span>
             </div>
             <div className="w-full h-1.5 bg-[#1F1F23] rounded-full overflow-hidden">
                <div className="h-full bg-[#3B82F6]" style={{ width: '15%' }} />
             </div>
             <p className="mt-3 text-[9px] font-mono text-[#52525B] italic text-center">
               Maintain consistent activity history to unlock "Adaptive RAG" contextual memory.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
