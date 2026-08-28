import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitPullRequest,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  GitBranch,
  ArrowRight,
  Zap,
} from 'lucide-react';

const WORKFLOW_STAGES = [
  {
    step: '01',
    title: 'AST Ingestion & Semantic Graph',
    tagline: 'Deep Codebase Understanding',
    description:
      'The agent parses the entire abstract syntax tree, dependency graph, and interface boundaries. It identifies exact symbol references across thousands of files in milliseconds.',
    badge: 'Zero Hallucinations',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    codePreview: `// Stage 1: Abstract Syntax Tree Index
const astIndex = await parser.buildSymbolTree({
  repo: "github/ecommerce-core",
  targetSymbols: ["TokenManager", "RedisStore", "AuthContext"],
  depth: 4
});
// 1,420 modules indexed · 0 unresolvable types`,
  },
  {
    step: '02',
    title: 'Context-Aware Architecture Planning',
    tagline: 'Multi-file Strategy & Verification',
    description:
      'Rather than blindly generating code, DevPulse formulates a structured atomic plan with dependency ordering, type safety guarantees, and automated test specifications.',
    badge: 'Spec-Driven',
    badgeColor: 'text-[#E5A967] border-[#E5A967]/30 bg-[#E5A967]/10',
    codePreview: `## Execution Plan: JWT Refresh Rotation
1. [MODIFY] src/auth/jwt.service.ts
   - Inject Redis blacklist check before payload verification
   - Set 7-day TTL expiration key atomically
2. [CREATE] src/middleware/tokenRefresh.ts
   - Handle HTTP-only secure cookie rotation
3. [CREATE] src/tests/auth.test.ts
   - 14 test specs for replay protection & race conditions`,
  },
  {
    step: '03',
    title: 'Autonomous Code Synthesis',
    tagline: 'High-Throughput Clean Code',
    description:
      'The agent generates idiomatic, production-grade TypeScript, Go, Rust, or Python code. Every line conforms strictly to your repo’s linter, formatting guidelines, and architectural conventions.',
    badge: 'Production Ready',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    codePreview: `export const tokenRefreshMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies['refresh_token'];
  if (!token) return next();
  
  const pair = await JwtService.verifyAndRotate(token);
  res.cookie('refresh_token', pair.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  next();
};`,
  },
  {
    step: '04',
    title: 'Automated Vitest & Lint Sandbox',
    tagline: 'Self-Healing Test Suite',
    description:
      'The agent spins up an isolated sandbox, executes existing and newly generated unit test suites, and self-corrects any edge case regressions before pushing to GitHub.',
    badge: '100% Verified',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    codePreview: `✓ test/auth.spec.ts (14 tests) 18ms
  ✓ should rotate token on valid request
  ✓ should reject revoked token
  ✓ should handle concurrent refresh requests
  ✓ should enforce strict cookie flags

Test Files  1 passed (1)
Tests       14 passed (14)
Coverage    100% branch · 0 lint errors`,
  },
  {
    step: '05',
    title: 'GPG-Signed Pull Request Creation',
    tagline: 'Ready for Human Review & Merge',
    description:
      'A clean git branch is pushed, and a comprehensive Pull Request with markdown changelog, test verification logs, and diff summary is opened on your repository.',
    badge: '1-Click Merge',
    badgeColor: 'text-[#E5A967] border-[#E5A967]/30 bg-[#E5A967]/10',
    codePreview: `git checkout -b ai-agent/feat-jwt-rotation
git commit -S -m "feat(auth): RFC-6749 JWT token rotation"
git push origin ai-agent/feat-jwt-rotation

✓ GitHub Pull Request #42 opened:
  https://github.com/my-org/ecommerce-core/pull/42
  Status: All CI Checks Passed (🟢 3/3)`,
  },
];

export const InteractiveShowcase: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const currentStage = WORKFLOW_STAGES[activeStageIndex];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-xs text-[#E5A967] font-tech font-semibold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          Autonomous Lifecycle
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white">
          How the AI Agent Ships Code.
        </h2>
        <p className="text-stone-400 font-tech text-sm sm:text-base">
          From repository ingestion to GPG-signed Pull Request: explore the 5 autonomous stages that replace days of repetitive manual engineering.
        </p>
      </div>

      {/* Interactive Tabs + Stage Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Stage Selectors (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {WORKFLOW_STAGES.map((stage, idx) => {
            const isSelected = activeStageIndex === idx;
            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => setActiveStageIndex(idx)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 flex items-start gap-4 cursor-pointer border ${
                  isSelected
                    ? 'glass-card border-[#E5A967]/50 shadow-[0_0_20px_rgba(229,169,103,0.15)] bg-white/[0.04]'
                    : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/5 opacity-60 hover:opacity-90'
                }`}
              >
                <span
                  className={`font-mono text-sm font-bold px-2.5 py-1 rounded-lg ${
                    isSelected ? 'bg-[#E5A967] text-stone-950' : 'bg-white/5 text-stone-400'
                  }`}
                >
                  {stage.step}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-stone-300'}`}>
                      {stage.title}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-400 line-clamp-1 font-tech">
                    {stage.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Rich Interactive Stage Detail Card (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.step}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
            >
              {/* Background ambient glow */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#E5A967]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Stage Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-medium border ${currentStage.badgeColor}`}>
                  {currentStage.badge}
                </span>
                <span className="text-xs font-mono text-stone-500">
                  Stage {currentStage.step} / 05
                </span>
              </div>

              <h3 className="text-2xl font-bold font-display text-white mb-2">
                {currentStage.title}
              </h3>
              <p className="text-sm text-stone-300 font-tech leading-relaxed mb-6">
                {currentStage.description}
              </p>

              {/* Code / Output Container */}
              <div className="bg-[#060608] rounded-xl border border-white/10 p-4 font-mono text-xs text-stone-200 overflow-x-auto shadow-inner">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-[#E5A967]" />
                    Telemetry Output
                  </span>
                  <span>Autonomous Node #0{activeStageIndex + 1}</span>
                </div>
                <pre className="text-emerald-400 font-mono leading-relaxed whitespace-pre-wrap">
                  {currentStage.codePreview}
                </pre>
              </div>

              {/* Step Navigation Pill Controls */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10 text-xs">
                <button
                  type="button"
                  disabled={activeStageIndex === 0}
                  onClick={() => setActiveStageIndex((prev) => Math.max(0, prev - 1))}
                  className="text-stone-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                >
                  ← Previous Stage
                </button>

                <div className="flex gap-1.5">
                  {WORKFLOW_STAGES.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeStageIndex === i ? 'w-6 bg-[#E5A967]' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  disabled={activeStageIndex === WORKFLOW_STAGES.length - 1}
                  onClick={() => setActiveStageIndex((prev) => Math.min(WORKFLOW_STAGES.length - 1, prev + 1))}
                  className="text-[#E5A967] hover:text-white disabled:opacity-30 transition-colors font-medium cursor-pointer"
                >
                  Next Stage →
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default InteractiveShowcase;
