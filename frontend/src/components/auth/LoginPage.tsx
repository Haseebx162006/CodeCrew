import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Github, Mail, Lock, ArrowUpRight, ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithGitHub, setActiveView, isAuthLoading, authError, setAuthError } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setAuthError(null);

    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    login(email, password);
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (authError) setAuthError(null);
    if (localError) setLocalError(null);
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (authError) setAuthError(null);
    if (localError) setLocalError(null);
  };

  return (
    <div className="min-h-screen bg-[#7D8DA5] text-[#0F172A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 select-none relative">
      {/* Top Left Back Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={() => setActiveView('landing')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-[#0F172A] text-xs font-tech font-semibold border-[1.5px] border-[#0F172A] shadow-md transition-all hover:scale-105 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Showcase</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        {/* Brand Logo */}
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white" />
          </div>
          <span className="font-display font-black text-2xl tracking-tight text-[#0F172A]">
            codecrew
          </span>
        </div>
        <h2 className="text-2xl font-display font-bold text-[#0F172A] tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1 text-xs text-slate-700 font-tech">
          Sign in to dispatch autonomous agents, monitor diffs, and ship Pull Requests.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-2xl border-[1.5px] border-[#0F172A] rounded-[28px] relative">
          {/* Quick 1-Click GitHub Sign In */}
          <button
            type="button"
            onClick={loginWithGitHub}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-tech font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-sm cursor-pointer"
          >
            <Github className="w-4 h-4" />
            <span>Continue with GitHub OAuth</span>
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono font-bold">
              <span className="bg-white px-3 text-slate-400">Or sign in with email</span>
            </div>
          </div>

          {/* Error Banner */}
          {(localError || authError) && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-tech mb-4">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{localError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                Work Email Address
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="engineer@company.com"
                  className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-500">
                  Password
                </label>
              </div>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-tech font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-sm cursor-pointer mt-2 disabled:opacity-50"
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Switch */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-tech text-slate-500">
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              GPG Verified
            </span>
            <button
              type="button"
              onClick={() => {
                setAuthError(null);
                setActiveView('signup');
              }}
              className="text-[#0F172A] font-bold hover:underline cursor-pointer text-xs"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
