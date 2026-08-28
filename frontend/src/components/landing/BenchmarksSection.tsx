import React from 'react';
import { Zap, CheckCircle2, GitPullRequest, Clock, ShieldCheck, Flame } from 'lucide-react';

const STATS = [
  {
    value: '4.2 min',
    label: 'Average PR Generation',
    subtext: 'From natural language prompt to tested PR',
    icon: Clock,
  },
  {
    value: '99.4%',
    label: 'First-Pass Test Pass Rate',
    subtext: 'Across 45,000+ unit & integration suites',
    icon: CheckCircle2,
  },
  {
    value: '0 Leaks',
    label: 'Ephemeral Air-Gapped Sandbox',
    subtext: 'SOC-2 compliant zero retention execution',
    icon: ShieldCheck,
  },
  {
    value: '14,800+',
    label: 'PRs Merged to Main',
    subtext: 'TypeScript, Go, Rust, Python, React',
    icon: GitPullRequest,
  },
];

export const BenchmarksSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden backdrop-blur-2xl">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E5A967]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col justify-between space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-[#E5A967]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400">Metric 0{idx + 1}</span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-stone-200 font-tech">
                  {stat.label}
                </div>
                <p className="text-xs text-stone-400 font-tech">
                  {stat.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenchmarksSection;
