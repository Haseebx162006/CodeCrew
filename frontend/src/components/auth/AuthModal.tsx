import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { X, Github, Mail, Lock, User, MapPin, Sparkles, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signup' }) => {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl overflow-hidden bg-[#0D0D12] text-stone-200 z-10"
        >
          {/* Top glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#E5A967]/15 rounded-full blur-[90px] pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6 space-y-1">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E5A967] to-[#D4883A] text-stone-950 font-bold mb-2 shadow-[0_0_20px_rgba(229,169,103,0.4)]">
              <Sparkles className="w-5 h-5 fill-stone-950" />
            </div>
            <h2 className="text-2xl font-bold font-display text-white">
              {mode === 'signup' ? 'Create Developer Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-stone-400 font-tech">
              {mode === 'signup'
                ? 'Connect GitHub and start generating autonomous Pull Requests.'
                : 'Sign in to access your repositories and active PR pipelines.'}
            </p>
          </div>

          {/* 1-Click GitHub OAuth Button */}
          <button
            type="button"
            onClick={handleGitHubAuth}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white hover:bg-stone-100 text-stone-950 text-xs font-bold font-tech uppercase tracking-wider transition-all shadow-md cursor-pointer mb-5"
          >
            <Github className="w-4 h-4" />
            <span>Continue with GitHub OAuth</span>
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-[#0D0D12] px-3 text-stone-500 font-medium">
                Or with work email
              </span>
            </div>
          </div>

            {/* Error Banner */}
            {(localError || authError) && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-tech mb-4"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="leading-tight">{localError || authError}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g. Haseeb Ahmad"
                        className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#E5A967] focus:ring-1 focus:ring-[#E5A967]"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                      Office / Physical Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="e.g. Floor 4, Tech Innovation Hub"
                        className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#E5A967] focus:ring-1 focus:ring-[#E5A967]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="engineer@company.com"
                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#E5A967] focus:ring-1 focus:ring-[#E5A967]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#E5A967] focus:ring-1 focus:ring-[#E5A967]"
                  />
                </div>
              </div>

              {/* Link GitHub Option (Sign Up) */}
              {mode === 'signup' && (
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={linkGithub}
                      onChange={(e) => setLinkGithub(e.target.checked)}
                      className="w-3.5 h-3.5 text-[#E5A967] rounded border-white/20 bg-stone-900 focus:ring-[#E5A967]"
                    />
                    <span className="text-xs font-tech text-stone-300 flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-stone-400" />
                      Link GitHub account for automated PRs
                    </span>
                  </label>
                  {linkGithub && (
                    <input
                      type="text"
                      value={formData.githubUsername}
                      onChange={(e) => handleInputChange('githubUsername', e.target.value)}
                      placeholder="GitHub username (e.g. haseeb-ahmad)"
                      className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-[#E5A967] focus:outline-none focus:border-[#E5A967]"
                    />
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#E5A967] to-[#D4883A] text-stone-950 font-bold text-xs font-tech uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(229,169,103,0.4)] cursor-pointer mt-2 disabled:opacity-50"
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Account & Enter Studio' : 'Sign In to Studio'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Switch Mode Footer */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400 font-tech">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                GPG Encrypted
              </span>
              <button
                type="button"
                onClick={() => handleSwitchMode(mode === 'signup' ? 'login' : 'signup')}
                className="text-[#E5A967] hover:underline font-medium cursor-pointer"
              >
                {mode === 'signup' ? 'Already registered? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
