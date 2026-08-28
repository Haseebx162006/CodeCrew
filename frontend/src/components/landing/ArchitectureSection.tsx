import React from 'react';
import { Cpu, ShieldCheck, GitBranch, Terminal, Database, Sparkles, Network, ArrowRight } from 'lucide-react';

const ARCH_FEATURES = [
  {
    icon: Network,
    title: 'AST Symbol Ingestion',
    description: 'Constructs dynamic call graphs and type hierarchies without token limit constraints.',
    tag: 'Graph AST',
  },
  {
    icon: Cpu,
    title: 'Multi-Agent Tree Consensus',
    description: 'Parallel planner and auditor agents cross-validate diffs before emitting code.',
    tag: 'Consensus LLM',
  },
  {
    icon: Database,
    title: 'Semantic Vector Cache',
    description: 'Instant recall of previous refactors, PR guidelines, and style conventions.',
    tag: 'Vector DB',
  },
  {
    icon: ShieldCheck,
    title: 'Isolated Execution Sandbox',
    description: 'Zero network leakage. Tests and static analyzers execute in ephemeral Docker micro-vms.',
    tag: 'Air-Gapped',
  },
];

export const ArchitectureSection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-xs text-cyan-400 font-tech font-semibold uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5" />
          Under The Hood
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white">
          Engineered for Strict Enterprise Repos.
        </h2>
        <p className="text-stone-400 font-tech text-sm sm:text-base">
          Built on deterministic AST parsing, sandboxed test execution, and multi-model consensus validation.
        </p>
      </div>

      {/* Grid of 4 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ARCH_FEATURES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between border border-white/10 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#E5A967] flex items-center justify-center group-hover:bg-[#E5A967] group-hover:text-stone-950 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/5 text-stone-400">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white mb-2 font-display">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-400 font-tech leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center text-[11px] text-[#E5A967] font-medium font-tech opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn specification</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ArchitectureSection;
