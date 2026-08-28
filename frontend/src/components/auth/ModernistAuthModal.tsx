import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { X, Github, Mail, Lock, User, MapPin, ArrowUpRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModernistAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const ModernistAuthModal: React.FC<ModernistAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
}) => {
  const { signUp, login, loginWithGitHub, isAuthLoading, authError, setAuthError } = useAppStore();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [localError, setLocalError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: 'Haseeb Ahmad',
    email: 'haseeb@example.com',
    address: 'Floor 4, Tech Innovation Hub, Sector G-10',
    password: 'password123',
    githubUsername: 'haseeb-ahmad',
  });

  const [linkGithub, setLinkGithub] = useState(true);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (authError) setAuthError(null);
    if (localError) setLocalError(null);
  };

  const handleSwitchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setAuthError(null);
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setAuthError(null);

    // Validation
    if (!formData.email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setLocalError('Name is required.');
        return;
      }
      const success = await signUp({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        password: formData.password,
        githubUsername: linkGithub ? formData.githubUsername : undefined,
      });
      if (success) {
        onClose();
      }
    } else {
      const success = await login(formData.email, formData.password);
      if (success) {
        onClose();
      }
    }
  };

  const handleGitHubAuth = () => {
    loginWithGitHub();
    onClose();
  };

  return (
    <AnimatePresence>
      {/* Outer Viewport-Safe Overlay with Auto Scroll */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#0F172A]/60 backdrop-blur-xs select-none">
        
        {/* Backdrop click listener */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Card with 1.5px Black Outline & Max Height Constraint */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-md bg-white rounded-[28px] sm:rounded-[32px] border-[1.5px] border-[#0F172A] p-5 sm:p-6 shadow-2xl z-10 text-[#0F172A] my-auto max-h-[92vh] flex flex-col justify-between overflow-hidden"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-black transition-colors cursor-pointer z-20"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Scrollable Container Inside Modal */}
          <div className="overflow-y-auto pr-1 space-y-3.5 scrollbar-thin">
            
            {/* Header */}
            <div className="text-center pt-1 pb-1 space-y-1">
              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0F172A] text-white font-bold mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#0F172A] tracking-tight">
                {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-[11px] text-slate-500 font-tech">
                {mode === 'signup'
                  ? 'Connect GitHub and dispatch autonomous superhero agents.'
                  : 'Sign in to access your repositories and active agents.'}
              </p>
            </div>

            {/* GitHub 1-Click Button */}
            <button
              type="button"
              onClick={handleGitHubAuth}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-tech font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-xs cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Continue with GitHub OAuth</span>
            </button>

            {/* Divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase font-mono">
                <span className="bg-white px-2.5 text-slate-400 font-bold">
                  Or with work email
                </span>
              </div>
            </div>

            {/* Error Banner */}
            {(localError || authError) && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-tech"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="leading-tight">{localError || authError}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-0.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Haseeb Ahmad"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-0.5">
                      Office / Physical Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Floor 4, Tech Innovation Hub"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-0.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-0.5">
                  Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              {mode === 'signup' && (
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={linkGithub}
                      onChange={(e) => setLinkGithub(e.target.checked)}
                      className="w-3.5 h-3.5 text-[#0F172A] rounded border-slate-300 focus:ring-[#0F172A]"
                    />
                    <span className="text-[11px] font-tech text-slate-700">
                      Connect GitHub account for PRs
                    </span>
                  </label>
                  {linkGithub && (
                    <input
                      type="text"
                      value={formData.githubUsername}
                      onChange={(e) => handleInputChange('githubUsername', e.target.value)}
                      placeholder="GitHub username (e.g. haseeb-ahmad)"
                      className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
                    />
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-tech font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-xs cursor-pointer mt-2 disabled:opacity-50"
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Bar */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-tech shrink-0">
            <span className="flex items-center gap-1 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              GPG Verified
            </span>
            <button
              type="button"
              onClick={() => handleSwitchMode(mode === 'signup' ? 'login' : 'signup')}
              className="text-[#0F172A] font-bold hover:underline cursor-pointer text-[11px]"
            >
              {mode === 'signup' ? 'Already registered? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModernistAuthModal;
