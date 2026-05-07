import React from 'react';
import { motion } from 'framer-motion';

export default function MobilePreview() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 py-12">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
          <i className="fas fa-mobile-screen-button text-[#00FF41]"></i>
          MOBILE_APP_PREVIEW
        </h2>
        <p className="text-[#71717A] text-sm">
          Simulated view of the BITA Intelligence Terminal on institutional mobile appliances.
        </p>
      </div>

      <div className="relative w-[320px] h-[640px] bg-[#0A0A0B] border-[8px] border-[#1F1F23] rounded-[40px] shadow-2xl overflow-hidden shadow-[#000]">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#1F1F23] rounded-b-2xl z-20"></div>
        
        {/* Inner Screen */}
        <div className="h-full flex flex-col p-4 pt-10 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#00FF41] flex items-center justify-center text-black">
                <i className="fas fa-terminal text-xs"></i>
              </div>
              <span className="font-mono font-bold text-xs tracking-tighter">BITA_MOBILE</span>
            </div>
            <i className="fas fa-bars text-[#71717A]"></i>
          </div>

          {/* Chat Mockup */}
          <div className="flex-1 space-y-4 overflow-y-auto scrollbar-none">
            <div className="p-3 bg-[#1F1F23] rounded-2xl rounded-tl-none border border-[#2A2A30] text-[11px] leading-relaxed max-w-[85%]">
              Welcome to BITA Mobile. Ingressing multi-factor data streams.
            </div>
            <div className="p-3 bg-[#00FF41]/10 text-[#00FF41] rounded-2xl rounded-tr-none border border-[#00FF41]/20 text-[11px] leading-relaxed max-w-[85%] ml-auto">
              Show me tech tickers with AAA ESG and high momentum.
            </div>
            <div className="p-3 bg-[#1F1F23] rounded-2xl rounded-tl-none border border-[#2A2A30] text-[11px] leading-relaxed space-y-2">
              <p>MATCHED_UNIVERSE:</p>
              <div className="space-y-1">
                <div className="flex justify-between border-b border-[#2A2A30] py-1">
                  <span>AAPL.US</span>
                  <span className="text-[#00FF41]">0.98</span>
                </div>
                <div className="flex justify-between border-b border-[#2A2A30] py-1">
                  <span>ASML.NL</span>
                  <span className="text-[#00FF41]">0.95</span>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="mt-4 pt-4 border-t border-[#1F1F23]">
            <div className="flex items-center gap-2 bg-[#16161A] border border-[#1F1F23] rounded-full px-4 py-2">
              <span className="text-[10px] text-[#52525B] flex-1">Query terminal...</span>
              <i className="fas fa-paper-plane text-[#00FF41] text-xs"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 text-[#52525B]">
        <div className="flex flex-col items-center gap-2">
          <i className="fas fa-fingerprint text-xl"></i>
          <span className="text-[9px] font-mono">ENCRYPTED</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <i className="fas fa-satellite-dish text-xl"></i>
          <span className="text-[9px] font-mono">LIVE_SYNC</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <i className="fas fa-vault text-xl"></i>
          <span className="text-[9px] font-mono">ASSET_SAFE</span>
        </div>
      </div>
    </div>
  );
}
