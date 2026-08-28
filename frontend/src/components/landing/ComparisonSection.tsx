import React from 'react';
import { Check, X, Sparkles, Layers, ShieldCheck, Zap, GitPullRequest, Database, Cpu } from 'lucide-react';

const COMPARISON_ROWS = [
  {
    feature: 'Scope of Code Changes',
    traditional: 'Single-file inline code autocompletion',
    codecrew: 'Full-repository AST mapping & multi-file atomic diffs',
    highlight: true,
  },
  {
    feature: 'Planning & Dependency Resolution',
    traditional: 'Manual developer planning & manual file navigation',
    codecrew: 'Autonomous topological planning with cyclic dependency checks',
    highlight: false,
  },
  {
    feature: 'Automated Test Verification',
    traditional: 'Developer manually runs test commands',
    codecrew: 'Vitest / Pytest suites generated and executed in air-gapped sandboxes',
    highlight: true,
  },
  {
    feature: 'GitHub Integration',
    traditional: 'Copy-paste code into local editor manually',
    codecrew: 'Direct feature branch creation, commit push, and Pull Request opening',
    highlight: true,
  },
  {
    feature: 'Failure Recovery & Token Budget',
    traditional: 'Context lost on error; restart from beginning',
    codecrew: 'PostgreSQL Async Saver checkpointing; resumes from exact failure point',
    highlight: true,
  },
  {
    feature: 'Model Latency & Throughput',
    traditional: '20-40s queue delays on generic LLM endpoints',
    codecrew: 'Ultra-low TTFT (~35ms) powered by Groq LPU acceleration',
    highlight: false,
  },
];

export const ComparisonSection: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-[32px] border-[1.5px] border-[#0F172A] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            why autonomous collective?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F172A]">
            More than an Autocomplete. A Full Engineering Team.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-tech">
            Compare traditional AI code assistants with CodeCrew's multi-agent software collective.
          </p>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border-[1.5px] border-[#0F172A] rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] text-white text-xs font-display">
                <th className="p-4 sm:p-5 border-r border-slate-700 w-2/5">Capability</th>
                <th className="p-4 sm:p-5 border-r border-slate-700 w-3/10 text-slate-400">Traditional AI Copilots</th>
                <th className="p-4 sm:p-5 w-3/10 text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  CodeCrew Autonomous Crew
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-tech">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr 
                  key={idx} 
                  className={idx % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'}
                >
                  <td className="p-4 sm:p-5 border-r border-slate-200 font-semibold text-[#0F172A]">
                    {row.feature}
                  </td>
                  <td className="p-4 sm:p-5 border-r border-slate-200 text-slate-500">
                    <div className="flex items-start gap-2">
                      <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{row.traditional}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-[#0F172A] font-medium bg-emerald-50/30">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                      <span>{row.codecrew}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
