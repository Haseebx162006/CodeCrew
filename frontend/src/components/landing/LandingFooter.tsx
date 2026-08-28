import React from 'react';
import { Sparkles, ArrowRight, Github, Twitter, ShieldCheck, Heart } from 'lucide-react';

interface LandingFooterProps {
  onOpenWorkspace: () => void;
  onOpenAuth: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onOpenWorkspace, onOpenAuth }) => {
  return (
    <footer className="border-t border-white/10 bg-[#060608] relative overflow-hidden">
      {/* Big CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="glass-card rounded-3xl p-8 sm:p-14 border border-[#E5A967]/30 text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E5A967]/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A967]/10 text-[#E5A967] text-xs font-mono font-medium border border-[#E5A967]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Instant Setup in 30 Seconds
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white max-w-2xl mx-auto tracking-tight">
            Ready to Automate Your Engineering Backlog?
          </h2>

          <p className="text-stone-400 font-tech text-sm sm:text-base max-w-xl mx-auto">
            Connect your repository, describe your task, and let autonomous coding agents open tested Pull Requests.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={onOpenWorkspace}
              className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#E5A967] to-[#D4883A] text-stone-950 font-bold text-sm transition-all duration-200 hover:shadow-[0_0_30px_rgba(229,169,103,0.5)] hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-stone-950" />
              <span>Launch Studio Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2.5 px-7 py-4 rounded-xl glass-card text-white font-medium text-sm transition-all duration-200 hover:bg-white/10 border-white/15 cursor-pointer"
            >
              <Github className="w-4 h-4" />
              <span>Sign Up with GitHub</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright & links */}
        <div className="pt-12 mt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500 font-tech">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#E5A967] text-stone-950 font-bold flex items-center justify-center text-xs">
              DP
            </div>
            <span className="font-semibold text-white">DevPulse AI</span>
            <span>— The Autonomous Pull Request Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#benchmarks" className="hover:text-white transition-colors">Benchmarks</a>
            <span className="flex items-center gap-1 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SOC2 Type II
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
