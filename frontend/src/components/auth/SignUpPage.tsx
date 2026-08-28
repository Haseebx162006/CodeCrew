import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Github, User, Mail, MapPin, Lock, ArrowRight, Shield, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { signUp, loginWithGitHub, setAuthView, isAuthLoading, authError, setAuthError } = useAppStore();

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
          Create your autonomous developer account
        </h2>
        <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
          Connect your repositories, dispatch autonomous AI code tasks, and merge PRs directly into GitHub.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-stone-200 rounded-2xl">
          {/* Quick 1-Click GitHub Sign In */}
          <button
            type="button"
            onClick={loginWithGitHub}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-900 hover:bg-black text-white text-sm font-medium transition-all shadow-xs cursor-pointer"
          >
            <Github className="w-4 h-4" />
            Continue with GitHub OAuth
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-stone-400 font-medium">Or register with email</span>
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
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Full Name
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Haseeb Ahmad"
                  className="block w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CC785C] focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Work Email Address
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="engineer@company.com"
                  className="block w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CC785C] focus:border-transparent"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Physical / Office Address
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Suite 400, Innovation Tech Park"
                  className="block w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CC785C] focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Password (min 6 characters)
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CC785C] focus:border-transparent"
                />
              </div>
            </div>

            {/* Link GitHub Option */}
            <div className="p-3 bg-[#FBF9F5] border border-stone-200 rounded-xl space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkGithub}
                  onChange={(e) => setLinkGithub(e.target.checked)}
                  className="w-4 h-4 text-[#CC785C] rounded border-stone-300 focus:ring-[#CC785C]"
                />
                <span className="text-xs font-medium text-stone-700 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" />
                  Connect GitHub Account for Automated PRs
                </span>
              </label>

              {linkGithub && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={formData.githubUsername}
                    onChange={(e) => handleInputChange('githubUsername', e.target.value)}
                    placeholder="GitHub Username (e.g. haseeb-ahmad)"
                    className="block w-full px-3 py-1.5 border border-stone-300 rounded-md text-xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CC785C]"
                  />
                </div>
              )}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Enter Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#4D7C5E]" />
              Enterprise GPG signed commits
            </span>
            <button
              type="button"
              onClick={() => {
                setAuthError(null);
                setAuthView('login');
              }}
              className="text-[#CC785C] hover:underline font-medium cursor-pointer"
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
