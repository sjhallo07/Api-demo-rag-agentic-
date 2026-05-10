/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  Cpu,
  BookOpen,
  ShieldAlert,
  CreditCard,
  LogOut,
  User as UserIcon,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils.ts';
import { ModuleId, UserProfile } from './types.ts';
import ChatTerminal from './components/ChatTerminal.tsx';
import UniverseExplorer from './components/UniverseExplorer.tsx';
import StrategyBuilder from './components/StrategyBuilder.tsx';
import AnalyticsDashboard from './components/AnalyticsDashboard.tsx';
import AdminIntelligence from './components/AdminIntelligence.tsx';
import MobilePreview from './components/MobilePreview.tsx';
import ApiDocs from './components/ApiDocs.tsx';
import IntelligenceDocumentation from './components/IntelligenceDocumentation.tsx';
import MarketMastery from './components/MarketMastery.tsx';
import LandingPage from './components/LandingPage.tsx';
import AuthModule from './components/AuthModule.tsx';
import PaymentModule from './components/PaymentModule.tsx';
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
  { id: 'intelligence' as ModuleId, name: 'Intelligence Architecture', icon: Cpu, description: 'Documentation on RAG pipeline, chunking, and data ingestion.' },
  { id: 'payments' as ModuleId, name: 'Billing Infrastructure', icon: CreditCard, description: 'Manage institutional subscription and billing.' },
  { id: 'admin' as ModuleId, name: 'Admin Intelligence', icon: ShieldAlert, description: 'Manage financial knowledge base and agent learning tokens.' },
  { id: 'market_mastery' as ModuleId, name: 'Market Mastery', icon: BookOpen, description: 'Insights on financial sectors, careers, and global markets.' },
  { id: 'docs' as ModuleId, name: 'API Documentation', icon: BookOpen, description: 'Technical specifications for BITA endpoints.' },
  { id: 'mobile_preview' as ModuleId, name: 'Mobile App View', icon: Compass, description: 'Visualize how the BITA intelligence looks on a mobile device.' },
];

function Dashboard({ user, onLogout }: { user: UserProfile, onLogout: () => void }) {
  const [activeModule, setActiveModule] = useState<ModuleId>('universe');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [chatWidth, setChatWidth] = useState(400);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Resize logic for Sidebar
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  // Resize logic for Chat
  const chatRef = useRef<HTMLDivElement>(null);
  const [isResizingChat, setIsResizingChat] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingSidebar) {
        const newWidth = e.clientX;
        if (newWidth > 64 && newWidth < 450) {
          setSidebarWidth(newWidth);
          if (newWidth < 120) setIsSidebarOpen(false);
          else setIsSidebarOpen(true);
        }
      }
      if (isResizingChat) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth > 300 && newWidth < 800) {
          setChatWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingChat(false);
      document.body.style.cursor = 'default';
    };

    if (isResizingSidebar || isResizingChat) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar, isResizingChat]);

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
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        style={{ width: isSidebarOpen ? sidebarWidth : 64 }}
        className={cn(
          "relative hidden lg:flex flex-col border-r border-[#1F1F23] bg-[#0D0D0F] transition-[width] duration-75 z-50",
          !isSidebarOpen && "items-center"
        )}
      >
        <div className="p-4 flex items-center gap-3 border-b border-[#1F1F23] h-14 shrink-0">
          <button 
            onClick={handleOpenTermux}
            title="Open Local Termux (Android)"
            className="w-8 h-8 shrink-0 rounded-sm bg-[#00FF41] flex items-center justify-center text-black hover:bg-[#00E53B] transition-all active:scale-95 group relative"
          >
            <Terminal size={18} />
            {!isSidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#1F1F23] text-[#00FF41] text-[10px] font-mono rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-[#00FF41]/20">
                OPEN_TERMUX
              </div>
            )}
          </button>
          {isSidebarOpen && (
            <span className="font-mono font-bold tracking-tighter text-lg truncate">BITA COMMAND</span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1 custom-scrollbar">
          {MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group relative overflow-hidden",
                activeModule === module.id 
                  ? "bg-[#1F1F23] text-white shadow-[0_0_15px_rgba(0,255,65,0.05)] border border-[#00FF41]/10" 
                  : "text-[#71717A] hover:bg-[#16161A] hover:text-[#E4E4E7]"
              )}
            >
              <module.icon className={cn("shrink-0", activeModule === module.id ? "text-[#00FF41]" : "text-[#71717A] group-hover:text-[#00FF41]")} size={18} />
              {isSidebarOpen && (
                <div className="flex flex-col items-start leading-none gap-0.5 truncate">
                  <span className="text-sm font-medium truncate">{module.name}</span>
                </div>
              )}
              {activeModule === module.id && (
                <motion.div 
                  layoutId="active-nav-indicator"
                  className="absolute left-0 w-1 h-3/4 bg-[#00FF41] rounded-r-full shadow-[0_0_8px_rgba(0,255,65,0.5)]"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1F1F23] shrink-0">
          {isSidebarOpen ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#52525B]">
                <span>SYSTEM_INTEGRITY</span>
                <span className="text-[#00FF41] flex items-center gap-1.5 font-bold">
                  <div className="w-1 h-1 rounded-full bg-[#00FF41] animate-pulse" />
                  STABLE
                </span>
              </div>
              <div className="text-[10px] font-mono text-[#3F3F46] flex items-center justify-between">
                <span>{currentTime.toLocaleTimeString([], { hour12: false })}</span>
                <span>v4.2.0</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse" />
            </div>
          )}
        </div>

        {/* Resize Handle */}
        <div 
          onMouseDown={() => setIsResizingSidebar(true)}
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#00FF41]/20 transition-colors z-50 group"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#1F1F23] group-hover:bg-[#00FF41] rounded-full transition-colors" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-[#1F1F23] bg-[#0D0D0F]/80 backdrop-blur-md flex items-center justify-between px-6 z-40 shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-[#1F1F23] rounded transition-colors text-[#71717A] hover:text-white"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button 
              onClick={() => setIsMobileChatOpen(true)}
              className="lg:hidden p-1.5 hover:bg-[#1F1F23] rounded transition-colors text-[#71717A] hover:text-white"
            >
              <Terminal size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-[#71717A] truncate max-w-[200px] sm:max-w-none">
              <Compass size={14} className="shrink-0" />
              <span className="truncate">TERMINAL / {MODULES.find(m => m.id === activeModule)?.name?.toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsDocsModalOpen(true)}
               className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#00FF41]/10 border border-[#00FF41]/20 rounded text-[9px] font-mono text-[#00FF41] hover:bg-[#00FF41]/20 transition-all font-bold tracking-widest"
             >
                <BookOpen size={12} />
                DOCS_v1.0
             </button>
             <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-[#16161A] border border-[#1F1F23] rounded text-[10px] font-mono">
                <span className="text-[#52525B]">USER_PROFILE:</span>
                <span className="text-[#00FF41] font-bold">{user.name.toUpperCase()}</span>
             </div>
             <button 
                onClick={onLogout}
                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors text-[#52525B]"
                title="TERMINATE_SESSION"
             >
                <LogOut size={18} />
             </button>
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1F1F23] to-[#0A0A0B] border border-[#1F1F23] flex items-center justify-center overflow-hidden shrink-0">
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
                  <AnalyticsDashboard />
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
              ) : activeModule === 'intelligence' ? (
                <motion.div
                  key="intelligence"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-full overflow-hidden"
                >
                  <IntelligenceDocumentation />
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
          <div 
            ref={chatRef}
            style={{ width: chatWidth }}
            className="relative lg:flex hidden border-l border-[#1F1F23] bg-[#0D0D0F] flex-col h-full overflow-hidden"
          >
            {/* Resize Handle (Left side) */}
            <div 
              onMouseDown={() => setIsResizingChat(true)}
              className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-[#00FF41]/20 transition-colors z-50 group"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#1F1F23] group-hover:bg-[#00FF41] rounded-full transition-colors" />
            </div>

            <div className="p-4 border-b border-[#1F1F23] flex items-center justify-between shrink-0 bg-[#0D0D0F]">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_8px_rgba(0,255,65,0.5)]" />
                 <span className="text-[10px] font-mono font-bold tracking-widest">BITA_ASSIST_v4.2</span>
               </div>
               <span className="text-[9px] font-mono text-[#3F3F46] uppercase">Active_Session</span>
            </div>
            <div className="flex-1 overflow-hidden">
               <ChatTerminal />
            </div>
          </div>
        </div>

        {/* Mobile View Terminal Overlay */}
        {isMobileChatOpen && (
          <div className="fixed inset-0 z-[60] bg-[#0A0A0B] flex flex-col">
            <div className="p-4 border-b border-[#1F1F23] flex items-center justify-between shrink-0 bg-[#0D0D0F]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_8px_rgba(0,255,65,0.5)]" />
                <span className="text-[10px] font-mono font-bold tracking-widest">BITA_ASSIST_v4.2</span>
              </div>
              <button onClick={() => setIsMobileChatOpen(false)} className="p-2 hover:bg-[#1F1F23] rounded">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatTerminal />
            </div>
          </div>
        )}

        {/* Mobile Navbar (FontAwesome) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0D0D0F] border-t border-[#1F1F23] flex items-center justify-around px-4 z-[60] backdrop-blur-md bg-opacity-90">
          {MODULES.slice(0, 4).map((module) => (
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
             onClick={() => setIsMobileMenuOpen(true)}
             className="flex flex-col items-center gap-1 text-[#52525B]"
          >
             <FontAwesomeIcon icon={faBars} className="text-lg" />
             <span className="text-[8px] font-mono">MENU</span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-0 z-[65] bg-[#0A0A0B] p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-mono font-bold">ALL_COMPONENTS</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {MODULES.map((module) => (
                   <button
                     key={module.id}
                     onClick={() => {
                       setActiveModule(module.id);
                       setIsMobileMenuOpen(false);
                     }}
                     className="bg-[#16161A] border border-[#1F1F23] p-4 rounded-lg flex flex-col items-center gap-2 text-center hover:border-[#00FF41]/30 transition-all"
                   >
                     <module.icon className="text-[#00FF41]" size={24} />
                     <span className="text-xs font-mono">{module.name}</span>
                   </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'auth'>('landing');

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
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
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (token: string, userData: UserProfile) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SESSION_KEY, token);
    }
    setUser(userData);
  };

  const handleLogout = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
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

