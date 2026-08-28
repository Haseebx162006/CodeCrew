import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Github, Mail, Lock, ArrowRight, Sparkles, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithGitHub, setAuthView, isAuthLoading, authError, setAuthError } = useAppStore();

  const [email, setEmail] = useState('haseeb@example.com');
  const [password, setPassword] = useState('password123');
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
    <div className="min-h-screen bg-[#FAF7F2] text-stone-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#CC785C] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-semibold tracking-tight text-stone-900">
            DevPulse AI
          </span>
        </div>
        <h2 className="text-xl font-serif text-stone-800 font-medium">
          Sign in to your AI Agent Workspace
        </h2>
        <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
          Execute tasks, monitor real-time diffs, and ship production-ready PRs with autonomous coding agents.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-stone-200 rounded-2xl">
          {/* Quick 1-Click GitHub Sign In */}
          <button
            type="button"
            onClick={loginWithGitHub}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-900 hover:bg-black text-white text-sm font-medium transition-all shadow-xs cursor-pointer"
          >
            <Github className="w-4 h-4" />
            Sign in with GitHub OAuth
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-stone-400 font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Error Banner */}
          {(localError || authError) && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-4">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{localError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="engineer@company.com"
                  className="block w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CC785C] focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Password
                </label>
                <span className="text-[11px] text-stone-400 hover:text-stone-600 cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CC785C] focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#CC785C] hover:bg-[#B8654A] text-white text-sm font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4D7C5E]" />
              Encrypted session
            </span>
            <button
              type="button"
              onClick={() => {
                setAuthError(null);
                setAuthView('signup');
              }}
              className="text-[#CC785C] hover:underline font-medium cursor-pointer"
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
