/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Layers, 
  BarChart3, 
  FileText, 
  History, 
  Dna, 
  Database, 
  Compass,
  LayoutGrid,
  Menu,
  X,
  Plus,
  BrainCircuit,
  BookOpen,
  ShieldAlert,
  CreditCard,
  LogOut,
  User as UserIcon,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { ModuleId, UserProfile } from './types';
import ChatTerminal from './components/ChatTerminal';
import UniverseExplorer from './components/UniverseExplorer';
import StrategyBuilder from './components/StrategyBuilder';
import PortfolioDashboard from './components/PortfolioDashboard';
import AdminIntelligence from './components/AdminIntelligence';
import MobilePreview from './components/MobilePreview';
import ApiDocs from './components/ApiDocs';
import MarketMastery from './components/MarketMastery';
import LandingPage from './components/LandingPage';
import AuthModule from './components/AuthModule';
import PaymentModule from './components/PaymentModule';
import { SESSION_KEY } from './constants';

// Font Awesome Setup
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, 
  faChartPie, 
  faMicrochip, 
  faUserShield, 
  faBookBookmark, 
  faBars, 
  faCircle,
  faTerminal,
  faChartLine,
  faShieldHalved,
  faGear
} from '@fortawesome/free-solid-svg-icons';
import { faFontAwesome } from '@fortawesome/free-brands-svg-icons';

library.add(
  faLayerGroup, 
  faChartPie, 
  faMicrochip, 
  faUserShield, 
  faBookBookmark, 
  faBars, 
  faCircle,
  faTerminal,
  faChartLine,
  faShieldHalved,
  faGear,
  faFontAwesome
);

const MODULES = [
  { id: 'universe' as ModuleId, name: 'Universe Construction', icon: Layers, description: 'Slice and dice based on geography, sectors, and factors.' },
  { id: 'analytics' as ModuleId, name: 'Portfolio Dashboard', icon: BarChart3, description: 'Interactive visualization of portfolio allocation, performance, and ESG.' },
  { id: 'strategy' as ModuleId, name: 'Strategy Builder', icon: BrainCircuit, description: 'Personalized investment strategies based on your profile.' },
  { id: 'payments' as ModuleId, name: 'Billing Infrastructure', icon: CreditCard, description: 'Manage institutional subscription and billing.' },
  { id: 'admin' as ModuleId, name: 'Admin Intelligence', icon: ShieldAlert, description: 'Manage financial knowledge base and agent learning tokens.' },
  { id: 'market_mastery' as ModuleId, name: 'Market Mastery', icon: BookOpen, description: 'Insights on financial sectors, careers, and global markets.' },
  { id: 'docs' as ModuleId, name: 'API Documentation', icon: BookOpen, description: 'Technical specifications for BITA endpoints.' },
  { id: 'mobile_preview' as ModuleId, name: 'Mobile App View', icon: Compass, description: 'Visualize how the BITA intelligence looks on a mobile device.' },
];

function Dashboard({ user, onLogout }: { user: UserProfile, onLogout: () => void }) {
  const [activeModule, setActiveModule] = useState<ModuleId>('universe');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenTermux = () => {
    const intentUrl = "intent://#Intent;scheme=termux;package=com.termux;end";
    window.location.href = intentUrl;
  };

  return (
    <div className="flex h-screen w-full bg-[#0A0A0B] text-[#E4E4E7] font-sans selection:bg-[#00FF41] selection:text-black overflow-hidden animate-in fade-in duration-700">
      {/* Sidebar (Rest of logic remains same, just moved to component) */}
      {/* Sidebar */}
      <aside 
        className={cn(
          "relative flex flex-col border-r border-[#1F1F23] bg-[#0D0D0F] transition-all duration-300 z-50",
          isSidebarOpen ? "w-72" : "w-16"
        )}
      >
        <div className="p-4 flex items-center gap-3 border-bottom border-[#1F1F23]">
          <button 
            onClick={handleOpenTermux}
            title="Open Local Termux (Android)"
            className="w-8 h-8 rounded-sm bg-[#00FF41] flex items-center justify-center text-black hover:bg-[#00E53B] transition-all active:scale-95 group relative"
          >
            <Terminal size={20} />
            {!isSidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#1F1F23] text-[#00FF41] text-[10px] font-mono rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-[#00FF41]/20">
                OPEN_TERMUX
              </div>
            )}
          </button>
          {isSidebarOpen && (
            <span className="font-mono font-bold tracking-tighter text-xl">BITA COMMAND</span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group relative overflow-hidden",
                activeModule === module.id 
                  ? "bg-[#1F1F23] text-white shadow-[0_0_15px_rgba(0,255,65,0.1)]" 
                  : "text-[#71717A] hover:bg-[#16161A] hover:text-[#E4E4E7]"
              )}
            >
              <module.icon className={cn("shrink-0", activeModule === module.id ? "text-[#00FF41]" : "text-[#71717A] group-hover:text-[#00FF41]")} size={18} />
              {isSidebarOpen && (
                <div className="flex flex-col items-start leading-none gap-0.5">
                  <span className="text-sm font-medium">{module.name}</span>
                </div>
              )}
              {activeModule === module.id && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-2/3 bg-[#00FF41] rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1F1F23]">
          {isSidebarOpen ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#52525B]">
                <span>SYSTEM STATUS</span>
                <span className="text-[#00FF41] flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-[#00FF41] animate-pulse" />
                  ONLINE
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#52525B]">
                {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse" />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-[#1F1F23] bg-[#0D0D0F]/80 backdrop-blur-md flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-[#1F1F23] rounded transition-colors text-[#71717A] hover:text-white"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-[#71717A]">
              <Compass size={14} />
              <span>TERMINAL / {MODULES.find(m => m.id === activeModule)?.name?.toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsDocsModalOpen(true)}
               className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#00FF41]/10 border border-[#00FF41]/20 rounded text-[10px] font-mono text-[#00FF41] hover:bg-[#00FF41]/20 transition-all font-bold"
             >
                <BookOpen size={12} />
                DOCS_VER_1.0
             </button>
             <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-[#16161A] border border-[#1F1F23] rounded text-[11px] font-mono">
                <span className="text-[#52525B]">TERMINAL:</span>
                <span className="text-[#00FF41]">{user.name.toUpperCase()}</span>
             </div>
             <button 
                onClick={onLogout}
                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors text-[#52525B]"
                title="EXIT_SIGNAL"
             >
                <LogOut size={18} />
             </button>
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1F1F23] to-[#0A0A0B] border border-[#1F1F23] flex items-center justify-center overflow-hidden">
                {user.avatar ? <img src={user.avatar} alt="avatar" /> : <UserIcon size={14} />}
             </div>
          </div>
        </header>

        {/* Documentation Modal */}
        <AnimatePresence>
          {isDocsModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDocsModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-5xl h-[85vh] bg-[#0D0D0F] border border-[#1F1F23] rounded-xl shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="p-4 border-b border-[#1F1F23] flex items-center justify-between bg-[#16161A]">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#00FF41]" />
                      <span className="text-xs font-mono font-bold tracking-widest text-[#00FF41]">SYSTEM_CORE_DOCUMENTATION</span>
                   </div>
                   <button 
                     onClick={() => setIsDocsModalOpen(false)}
                     className="p-1.5 hover:bg-[#1F1F23] rounded text-[#71717A] hover:text-white transition-colors"
                   >
                     <X size={18} />
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                   <ApiDocs />
                </div>
                <div className="p-3 bg-[#0A0A0B] border-t border-[#1F1F23] flex justify-center">
                   <p className="text-[9px] font-mono text-[#3F3F46] tracking-tighter">BITA INTELLIGENCE PROTOCOL © 2026 / ALL RIGHTS RESERVED / ACCESS_LEVEL: INSTITUTIONAL</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dynamic Viewport */}
        <div className="flex-1 flex overflow-hidden lg:flex-row flex-col pb-16 lg:pb-0">
          {/* Main Visualizer Area */}
          <div className="flex-1 overflow-y-auto bg-[#050506] relative">
            <AnimatePresence mode="wait">
              {activeModule === 'universe' ? (
                <motion.div
                  key="universe"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 h-full"
                >
                  <UniverseExplorer />
                </motion.div>
              ) : activeModule === 'analytics' ? (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 h-full"
                >
                  <PortfolioDashboard />
                </motion.div>
              ) : activeModule === 'strategy' ? (
                <motion.div
                  key="strategy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 h-full"
                >
                  <StrategyBuilder />
                </motion.div>
              ) : activeModule === 'payments' ? (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 h-full"
                >
                  <PaymentModule />
                </motion.div>
              ) : activeModule === 'admin' ? (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 h-full"
                >
                  <AdminIntelligence />
                </motion.div>
              ) : activeModule === 'mobile_preview' ? (
                <motion.div
                  key="mobile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 h-full"
                >
                  <MobilePreview />
                </motion.div>
              ) : activeModule === 'market_mastery' ? (
                <motion.div
                  key="market_mastery"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 h-full"
                >
                  <MarketMastery />
                </motion.div>
              ) : activeModule === 'docs' ? (
                <motion.div
                  key="docs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 h-full"
                >
                  <ApiDocs />
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                   <div className="text-center space-y-4">
                      <LayoutGrid className="mx-auto text-[#1F1F23]" size={64} strokeWidth={1} />
                      <h2 className="text-xl font-mono text-[#E4E4E7]">MODULE_UNDER_CONSTRUCTION</h2>
                      <p className="text-[#71717A] max-w-sm mx-auto text-sm">
                        This API module is being deployed to your current endpoint. 
                        Please utilize the Chat Terminal for preliminary data calls.
                      </p>
                      <button 
                        onClick={() => setActiveModule('universe')}
                        className="px-4 py-2 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20 rounded-md text-xs font-mono hover:bg-[#00FF41]/20 transition-all"
                      >
                         RETURN TO UNIVERSE EXPLORER
                      </button>
                   </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat Terminal Sidebar */}
          <div className="lg:w-[450px] w-full border-l border-[#1F1F23] bg-[#0D0D0F] flex flex-col h-full lg:pb-0 pb-16">
            <div className="p-4 border-b border-[#1F1F23] flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#00FF41]" />
                 <span className="text-xs font-mono font-bold">BITA ASSISTANT</span>
               </div>
               <span className="text-[10px] font-mono text-[#52525B]">v4.2.0-HYBRID</span>
            </div>
            <ChatTerminal />
          </div>
        </div>

        {/* Mobile Navbar (FontAwesome) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0D0D0F] border-t border-[#1F1F23] flex items-center justify-around px-4 z-[60] backdrop-blur-md bg-opacity-90">
          {MODULES.slice(0, 5).map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                activeModule === module.id ? "text-[#00FF41]" : "text-[#52525B]"
              )}
            >
              <FontAwesomeIcon 
                icon={
                  module.id === 'universe' ? faLayerGroup :
                  module.id === 'analytics' ? faChartPie :
                  module.id === 'strategy' ? faMicrochip :
                  module.id === 'admin' ? faUserShield :
                  module.id === 'docs' ? faBookBookmark : faCircle
                } 
                className="text-lg"
              />
              <span className="text-[8px] font-mono whitespace-nowrap">{module.id.toUpperCase()}</span>
            </button>
          ))}
          <button
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="flex flex-col items-center gap-1 text-[#52525B]"
          >
             <FontAwesomeIcon icon={faBars} className="text-lg" />
             <span className="text-[8px] font-mono">MENU</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'auth'>('landing');

  useEffect(() => {
    const savedToken = localStorage.getItem(SESSION_KEY);
    if (savedToken) {
      // Future: Real token verification
      setUser({
        id: 'u_123',
        email: 'john@bita.com',
        name: 'John Doe',
        isVerified: true,
        plan: 'standard',
        joinedAt: new Date().toISOString()
      });
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (token: string, userData: UserProfile) => {
    localStorage.setItem(SESSION_KEY, token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setView('landing');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <LandingPage key="landing" onGetStarted={() => setView('auth')} />
      ) : (
        <div key="auth" className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative">
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#16161A_1px,transparent_1px),linear-gradient(to_bottom,#16161A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="relative z-10 w-full max-w-md">
            <AuthModule onSuccess={handleAuthSuccess} />
          </div>
          <button 
            onClick={() => setView('landing')}
            className="absolute top-6 left-6 text-xs text-[#52525B] hover:text-[#00FF41] font-mono flex items-center gap-2"
          >
            <ArrowLeft size={14} /> EXIT_AUTH_GATEWAY
          </button>
        </div>
      )}
    </AnimatePresence>
  );
}

