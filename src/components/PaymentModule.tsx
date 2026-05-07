import React from 'react';
import { CreditCard, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const PaymentModule: React.FC = () => {
  return (
    <div className="space-y-8 p-6 md:p-8 bg-[#0D0D0F] border border-[#1F1F23] rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <CreditCard className="text-[#00FF41]" size={28} />
            PAYMENT_INFRASTRUCTURE [BETA]
          </h2>
          <p className="text-[#71717A] text-sm mt-1">
            Manage your institutional subscription and billing cycles.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#00FF41]/10 border border-[#00FF41]/20 rounded text-[10px] font-mono text-[#00FF41]">
          <Shield size={12} />
          SECURE_ENCRYPTION_ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Plan Selection */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xs font-mono font-bold text-[#52525B] uppercase tracking-widest border-b border-[#1F1F23] pb-2">Selected_Plan</h3>
          <div className="p-5 bg-[#16161A] border border-[#00FF41] rounded-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 px-2 py-1 bg-[#00FF41] text-black text-[8px] font-bold font-mono">ACTIVE</div>
            <h4 className="text-white font-bold">TERMINAL_PRO</h4>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">$499</span>
              <span className="text-[#52525B] text-xs font-mono">/MONTH</span>
            </div>
            <ul className="mt-4 space-y-2">
              {['Unlimited Universe Calls', 'Real-time Vector Search', 'Priority API Grounding', 'Dedicated Analyst Support'].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-[10px] text-[#A1A1AA]">
                  <CheckCircle2 size={12} className="text-[#00FF41]" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <button 
            disabled
            className="w-full py-3 bg-[#1F1F23] text-[#52525B] rounded font-bold text-xs cursor-not-allowed border border-[#2D2D33]"
          >
            // FUTURE_IMPLEMENTATION [STRIPE_STRATEGY]
          </button>
        </div>

        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-mono font-bold text-[#52525B] uppercase tracking-widest border-b border-[#1F1F23] pb-2">Stored_Credentials</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-[#0D0D0F] border border-[#1F1F23] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-[#16161A] border border-[#1F1F23] rounded flex items-center justify-center">
                  <CreditCard size={20} className="text-[#00FF41]" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">•••• •••• •••• 4242</p>
                  <p className="text-[10px] text-[#52525B]">EXP: 12/28 • VISA CORPORATE</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#00FF41] bg-[#00FF41]/5 px-2 py-0.5 rounded border border-[#00FF41]/20">DEFAULT</span>
            </div>

            <button 
              disabled
              className="w-full py-4 border border-dashed border-[#1F1F23] text-[#52525B] text-[10px] font-mono hover:border-[#00FF41]/30 hover:text-[#00FF41] transition-all"
            >
              + ATTACH_NEW_PAYMENT_ENTITY [READ_ONLY]
            </button>
          </div>

          <div className="p-4 bg-[#00FF41]/5 border border-[#00FF41]/20 rounded-lg flex items-start gap-4">
            <Zap className="text-[#00FF41] shrink-0" size={18} />
            <div className="space-y-1">
              <p className="text-[#00FF41] text-xs font-bold">Direct Settlement Enabled</p>
              <p className="text-[10px] text-[#52525B] leading-relaxed">
                BITA Terminal utilizes smart routing to minimize transaction slippage on institutional invoices. Next billing cycle: June 1, 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModule;
