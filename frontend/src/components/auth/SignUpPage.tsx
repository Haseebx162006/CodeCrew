import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Github, User, Mail, MapPin, Lock, ArrowUpRight, ArrowLeft, ShieldCheck, AlertCircle, Loader2, GitPullRequest, FileCode, CheckCircle2 } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { signUp, loginWithGitHub, setActiveView, isAuthLoading, authError, setAuthError } = useAppStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    githubUsername: '',
  });

  const [linkGithub, setLinkGithub] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (authError) setAuthError(null);
    if (localError) setLocalError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setAuthError(null);

    if (!formData.name.trim()) {
      setLocalError('Full name is required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setLocalError('Please provide a valid work email address.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    signUp({
      name: formData.name,
      email: formData.email,
      address: formData.address,
      password: formData.password,
      githubUsername: linkGithub ? formData.githubUsername || formData.name.toLowerCase().replace(/\s+/g, '-') : undefined,
    });
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

      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center mb-6">
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
          Create Developer Account
        </h2>
        <p className="mt-1 text-xs text-slate-700 font-tech">
          Connect your repositories, dispatch autonomous AI agents, and ship ready-to-merge Pull Requests.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
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
              <span className="bg-white px-3 text-slate-400">Or register with email</span>
            </div>
          </div>

          {/* Transparent GitHub Permissions Notice Box */}
          <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
              <Github className="w-4 h-4 text-[#0F172A]" />
              <span>GitHub Integration Permissions:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-tech text-slate-600">
              <div className="flex items-start gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-[#0F172A] shrink-0 mt-0.5" />
                <span><strong>Contents (Read/Write):</strong> Clones repo & commits to feature branches.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5 text-[#0F172A] shrink-0 mt-0.5" />
                <span><strong>Pull Requests (Read/Write):</strong> Opens formatted PRs with diffs.</span>
              </div>
            </div>
            <div className="pt-1 border-t border-slate-200/60 flex items-center gap-1 text-[10px] font-medium text-emerald-700">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Safe guarantee: CodeCrew only commits to isolated branches, never directly to main.</span>
            </div>
          </div>

          {/* Error Banner */}
          {(localError || authError) && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-tech mb-4">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{localError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                Full Name
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Haseeb Ahmad"
                  className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A]"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="engineer@company.com"
                  className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A]"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                Physical / Office Address
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Suite 400, Innovation Tech Park"
                  className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                Password (min 6 characters)
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A]"
                />
              </div>
            </div>

            {/* Link GitHub Checkbox */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkGithub}
                  onChange={(e) => setLinkGithub(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#0F172A] rounded border-slate-300 focus:ring-[#0F172A]"
                />
                <span className="text-[11px] font-tech text-slate-700">
                  Connect GitHub username for automated PR assignment
                </span>
              </label>

              {linkGithub && (
                <input
                  type="text"
                  value={formData.githubUsername}
                  onChange={(e) => handleInputChange('githubUsername', e.target.value)}
                  placeholder="GitHub Username (e.g. haseeb-ahmad)"
                  className="block w-full px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono placeholder-slate-400 focus:outline-none focus:border-[#0F172A]"
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-tech font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-sm cursor-pointer mt-3 disabled:opacity-50"
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Enter Workspace</span>
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Switch */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-tech text-slate-500">
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Enterprise GPG Signed
            </span>
            <button
              type="button"
              onClick={() => {
                setAuthError(null);
                setActiveView('login');
              }}
              className="text-[#0F172A] font-bold hover:underline cursor-pointer text-xs"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
