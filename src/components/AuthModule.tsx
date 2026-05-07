import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Github, 
  Chrome, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { getDeviceId } from '../lib/fingerprint';
import { ENDPOINTS } from '../constants';

type AuthMode = 'login' | 'register' | 'forgot-password' | 'verify';

interface AuthModuleProps {
  onSuccess: (token: string, user: any) => void;
}

const AuthModule: React.FC<AuthModuleProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);

  useEffect(() => {
    const initFingerprint = async () => {
      const id = await getDeviceId();
      setDeviceId(id);
    };
    initFingerprint();
  }, []);

  // Simulates an API call to check if email exists
  useEffect(() => {
    if (mode === 'register' && email.length > 5 && email.includes('@')) {
      const timer = setTimeout(() => {
        // Mock check logic
        const exists = email.startsWith('used');
        setEmailExists(exists);
        if (exists) setError('This terminal access point (email) is already registered.');
        else setError(null);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setEmailExists(null);
    }
  }, [email, mode]);

  const validatePassword = (pass: string) => {
    return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Logic placeholder for real API calls
      console.log(`Executing ${mode} at ${ENDPOINTS.AUTH.LOGIN}`);
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

      if (mode === 'register' && !validatePassword(password)) {
        throw new Error('Signal integrity check failed: Password must be 8+ chars with uppercase and numbers.');
      }

      if (email === 'error@bita.com') {
        throw new Error('Authentication gateway error [502]: Remote relay failed.');
      }

      // Mock successful session
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_payload";
      const mockUser = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        email,
        name: name || email.split('@')[0],
        isVerified: false,
        deviceId
      };

      onSuccess(mockToken, mockUser);
    } catch (err: any) {
      setError(err.message || 'System error identified during handshake.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < 16; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    // Ensure complexity requirements
    pass += "A1!";
    setPassword(pass);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0D0D0F] border border-[#1F1F23] rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF41]/30 to-transparent" />
        
        <div className="mb-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-[#00FF41]/10 rounded-xl flex items-center justify-center mb-4 border border-[#00FF41]/20">
            <Fingerprint className="text-[#00FF41]" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'login' && 'Terminal Login'}
            {mode === 'register' && 'System Onboarding'}
            {mode === 'forgot-password' && 'Key Recovery'}
          </h2>
          <p className="text-[#71717A] text-xs mt-1 font-mono">
            DEVICE_ID: {deviceId ? <span className="text-[#00FF41]">{deviceId.substring(0, 8)}...</span> : 'INITIALIZING...'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#52525B] uppercase tracking-widest px-1">Full_Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B] group-focus-within:text-[#00FF41] transition-colors" size={16} />
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#16161A] border border-[#1F1F23] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00FF41]/50 transition-all font-mono"
                      placeholder="Identified Entity Name"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-[#52525B] uppercase tracking-widest px-1">Email_Address</label>
            <div className="relative group">
              <Mail className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                emailExists === true ? "text-red-500" : emailExists === false ? "text-[#00FF41]" : "text-[#52525B] group-focus-within:text-[#00FF41]"
              )} size={16} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full bg-[#16161A] border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all font-mono",
                  emailExists === true ? "border-red-500/50 focus:border-red-500" : "border-[#1F1F23] focus:border-[#00FF41]/50"
                )}
                placeholder="terminal@relay.system"
              />
              {emailExists === false && mode === 'register' && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00FF41]" size={14} />
              )}
            </div>
            {emailExists === true && mode === 'register' && (
              <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle size={10} /> DATA_EXISTENCE_DETECTED
              </p>
            )}
          </div>

          {mode !== 'forgot-password' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-mono text-[#52525B] uppercase tracking-widest">Auth_Key</label>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setMode('forgot-password')}
                    className="text-[10px] font-mono text-[#52525B] hover:text-[#00FF41] transition-colors"
                  >
                    FORGOT?
                  </button>
                )}
                {mode === 'register' && (
                  <button 
                    type="button"
                    onClick={suggestStrongPassword}
                    className="text-[10px] font-mono text-[#00FF41] hover:underline"
                  >
                    GENERATE_SECURE
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B] group-focus-within:text-[#00FF41] transition-colors" size={16} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#16161A] border border-[#1F1F23] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00FF41]/50 transition-all font-mono"
                  placeholder="Cipher Sequence"
                />
              </div>
              {mode === 'register' && password && (
                <div className="flex gap-1 mt-1.5">
                  {[1, 2, 3].map((i) => {
                    const strength = validatePassword(password) ? 3 : (password.length > 5 ? 1 : 0);
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1 flex-1 rounded-full bg-[#1F1F23] overflow-hidden",
                          i <= strength ? (strength === 3 ? "bg-[#00FF41]" : "bg-yellow-500") : ""
                        )}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={14} />
              <p className="text-[10px] text-red-400 font-mono leading-relaxed">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading || (mode === 'register' && emailExists === true)}
            className={cn(
              "w-full py-3 bg-[#00FF41] text-black rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#00E53B] transition-all disabled:opacity-50 mt-6",
              isLoading && "cursor-wait"
            )}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck size={16} />
                {mode === 'login' ? 'INITIALIZE_SESSION' : mode === 'register' ? 'COMPLETE_ONBOARDING' : 'SEND_RECOVERY_SIGNAL'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1F1F23]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest italic">
              <span className="bg-[#0D0D0F] px-3 text-[#52525B]">Relay_Through</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#16161A] border border-[#1F1F23] rounded-lg text-white text-xs font-mono hover:border-[#52525B] transition-all"
              onClick={() => console.log(`FUTURE_IMPLEMENTATION: ${ENDPOINTS.AUTH.GOOGLE_AUTH}`)}
            >
              <Chrome size={14} className="text-[#E4E4E7]" />
              GOOGLE
            </button>
            <button 
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#16161A] border border-[#1F1F23] rounded-lg text-white text-xs font-mono hover:border-[#52525B] transition-all"
              onClick={() => console.log(`FUTURE_IMPLEMENTATION: ${ENDPOINTS.AUTH.GITHUB_AUTH}`)}
            >
              <Github size={14} className="text-[#E4E4E7]" />
              GITHUB
            </button>
          </div>
        </div>

        <div className="mt-8 text-center space-y-4">
          <button 
            type="button"
            onClick={() => onSuccess('GUEST_TOKEN', { 
              id: 'guest_01', 
              name: 'GUEST_ANALYST', 
              email: 'guest@bita.terminal', 
              plan: 'standard', 
              isVerified: false, 
              joinedAt: new Date().toISOString() 
            })}
            className="w-full py-2.5 bg-transparent border border-[#1F1F23] text-[#52525B] rounded-lg text-[10px] font-mono hover:border-[#00FF41]/40 hover:text-white transition-all"
          >
            PROCEED_AS_GUEST [LIMITED_SESSION]
          </button>

          {mode === 'login' ? (
            <p className="text-[10px] font-mono text-[#52525B]">
              NEW_NODE? <button onClick={() => setMode('register')} className="text-[#00FF41] hover:underline ml-1">START_PROVISIONING</button>
            </p>
          ) : (
            <button 
              onClick={() => setMode('login')} 
              className="text-[10px] font-mono text-[#52525B] hover:text-[#E4E4E7] flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft size={10} /> RETURN_TO_ENTRY
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModule;
