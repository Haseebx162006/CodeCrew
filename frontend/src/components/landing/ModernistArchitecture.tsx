import React from 'react';
import { Cpu, ShieldCheck, Network, Database, CheckCircle2, Clock, GitPullRequest, ArrowUpRight } from 'lucide-react';

const CARDS = [
  {
    icon: Network,
    title: 'AST Symbol Ingestion',
    desc: 'Constructs dynamic call graphs and type hierarchies with zero token hallucinations.',
    tag: 'Symbol Graph',
  },
  {
    icon: Cpu,
    title: 'Multi-Agent Tree Consensus',
    desc: 'Parallel planner and auditor agents cross-validate diffs before emitting commits.',
    tag: 'Consensus LLM',
  },
  {
    icon: Database,
    title: 'Semantic Vector Memory',
    desc: 'Instant recall of previous refactors, design systems, and repository PR conventions.',
    tag: 'Vector DB',
  },
  {
    icon: ShieldCheck,
    title: 'Isolated Execution Sandbox',
    desc: 'Zero network leakage. Tests and static analyzers execute in ephemeral Docker micro-vms.',
    tag: 'Air-Gapped',
  },
];

export const ModernistArchitecture: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-[32px] border-[1.5px] border-[#0F172A] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            under the hood
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F172A]">
            Engineered for Strict Enterprise Repos.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-tech">
            Deterministic AST parsing, sandboxed test execution, and multi-model consensus validation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl border-[1.5px] border-[#0F172A] bg-[#F8FAFC] flex flex-col justify-between gap-4 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">
                      {c.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold font-display text-[#0F172A] mb-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-tech leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const ModernistBenchmarks: React.FC = () => {
  const stats = [
    { value: '4.2 min', label: 'Average PR Generation', sub: 'From prompt to tested PR', icon: Clock },
    { value: '99.4%', label: 'First-Pass Pass Rate', sub: 'Across 45,000+ test suites', icon: CheckCircle2 },
    { value: '0 Leaks', label: 'Air-Gapped Sandbox', sub: 'SOC-2 compliant execution', icon: ShieldCheck },
    { value: '14,800+', label: 'PRs Merged to Main', sub: 'TypeScript, Go, Rust, React', icon: GitPullRequest },
  ];

  return (
    <section className="py-12 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-[32px] border-[1.5px] border-[#0F172A] p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="space-y-1 sm:border-r last:border-0 border-slate-200 pr-4">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-400 text-xs font-mono mb-1">
                  <Icon className="w-3.5 h-3.5 text-[#0F172A]" />
                  <span>Metric 0{idx + 1}</span>
                </div>
                <div className="text-3xl font-extrabold font-display text-[#0F172A]">
                  {s.value}
                </div>
                <div className="text-xs font-bold text-slate-700 font-tech">
                  {s.label}
                </div>
                <p className="text-[11px] text-slate-400 font-tech">
                  {s.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const ModernistFooter: React.FC<{ onOpenWorkspace: () => void; onOpenAuth: () => void }> = ({
  onOpenWorkspace,
  onOpenAuth,
}) => {
  return (
    <footer className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-[32px] border-[1.5px] border-[#0F172A] p-8 sm:p-14 shadow-2xl text-center space-y-6">
        <span className="inline-block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
          ready to ship?
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#0F172A] max-w-xl mx-auto leading-tight">
          Automate Your Engineering Backlog Today.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-tech max-w-md mx-auto">
          Connect your repository, describe your task, and let autonomous coding agents open tested Pull Requests.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            type="button"
            onClick={onOpenWorkspace}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-tech font-semibold uppercase tracking-wider transition-all hover:scale-105 shadow-md cursor-pointer"
          >
            <span>get started</span>
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRight className="w-3 h-3 text-white" />
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            className="px-6 py-2.5 rounded-full border-[1.5px] border-[#0F172A] hover:bg-slate-50 text-[#0F172A] text-xs font-tech font-medium transition-all cursor-pointer"
          >
            try for free
          </button>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-slate-400">
          <span>codecrew · autonomous pull request engine</span>
          <span>swiss modernism design</span>
        </div>
      </div>
    </footer>
  );
};
