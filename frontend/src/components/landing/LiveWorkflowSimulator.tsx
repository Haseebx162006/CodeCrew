import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  GitPullRequest, 
  Terminal, 
  Cpu, 
  Code2, 
  Database, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface WorkflowScenario {
  id: string;
  title: string;
  repo: string;
  prompt: string;
  steps: {
    agent: string;
    agentName: string;
    action: string;
    log: string;
    duration: string;
  }[];
  prSummary: {
    title: string;
    branch: string;
    filesChanged: number;
    testsPassing: string;
  };
}

const SCENARIOS: WorkflowScenario[] = [
  {
    id: 'stripe-webhooks',
    title: 'Stripe Webhooks & Idempotency',
    repo: 'acme-corp/billing-service',
    prompt: 'Implement Stripe checkout webhook endpoint with HMAC signature verification, idempotency lock, and invoice status DB updates.',
    steps: [
      {
        agent: 'Database',
        agentName: 'Hulk',
        action: 'Created migration for idempotency keys table',
        log: 'Wrote migrations/005_webhook_events.sql · Created UNIQUE constraint on event_id',
        duration: '0.34s'
      },
      {
        agent: 'Backend',
        agentName: 'Iron Man',
        action: 'Implemented webhook controller & signature verification',
        log: 'Wrote src/controllers/stripe_webhook.ts · Added raw-body HMAC buffer check',
        duration: '0.68s'
      },
      {
        agent: 'Testing',
        agentName: 'Captain America',
        action: 'Generated & ran test replay attack test suite',
        log: '8/8 tests passed in sandbox · 100% coverage on invalid signatures & duplicate events',
        duration: '0.41s'
      },
      {
        agent: 'Documentation',
        agentName: 'Wonder Woman',
        action: 'Drafted webhook integration guide & architecture spec',
        log: 'Wrote docs/WEBHOOKS.md with sequence flow diagrams & retry policy',
        duration: '0.25s'
      },
      {
        agent: 'Orchestrator',
        agentName: 'CodeCrew',
        action: 'Committed and opened GitHub Pull Request',
        log: 'Pushed branch codecrew/stripe-webhook-idempotency · PR #28 opened',
        duration: '0.19s'
      }
    ],
    prSummary: {
      title: 'feat(billing): Stripe webhook handler with HMAC verification & idempotency table',
      branch: 'codecrew/stripe-webhook-idempotency',
      filesChanged: 3,
      testsPassing: '8/8 passing (100% branch)'
    }
  },
  {
    id: 'rag-search',
    title: 'Hybrid pgvector RAG Search',
    repo: 'devhouse/knowledge-engine',
    prompt: 'Add hybrid semantic vector search combining pgvector cosine distance with tsvector keyword ranking using Reciprocal Rank Fusion (RRF).',
    steps: [
      {
        agent: 'Database',
        agentName: 'Hulk',
        action: 'Added HNSW index and RRF SQL query functions',
        log: 'Wrote sql/hybrid_search.sql with cosine similarity <=> and ts_rank fusion',
        duration: '0.29s'
      },
      {
        agent: 'Backend',
        agentName: 'Iron Man',
        action: 'Built FastAPI search route with score normalization',
        log: 'Wrote app/routers/search.py with Pydantic request models & async session',
        duration: '0.52s'
      },
      {
        agent: 'Testing',
        agentName: 'Captain America',
        action: 'Executed test vector retrieval accuracy benchmarks',
        log: '12/12 tests passed · Verified Top-5 recall accuracy > 94%',
        duration: '0.38s'
      },
      {
        agent: 'Documentation',
        agentName: 'Wonder Woman',
        action: 'Generated OpenAPI schema and API documentation',
        log: 'Updated openapi.json and authored docs/HYBRID_SEARCH.md',
        duration: '0.22s'
      },
      {
        agent: 'Orchestrator',
        agentName: 'CodeCrew',
        action: 'Committed and opened GitHub Pull Request',
        log: 'Pushed branch codecrew/hybrid-vector-search · PR #54 opened',
        duration: '0.18s'
      }
    ],
    prSummary: {
      title: 'feat(rag): Hybrid search endpoint with HNSW pgvector index & RRF fusion',
      branch: 'codecrew/hybrid-vector-search',
      filesChanged: 4,
      testsPassing: '12/12 passing (94% recall)'
    }
  },
  {
    id: 'auth-modal',
    title: 'Next.js 15 Auth Modal & OTP',
    repo: 'saas-collective/web-app',
    prompt: 'Create a responsive modern authentication modal in Next.js 15 with 6-digit OTP verification, Tailwind styling, and smooth animations.',
    steps: [
      {
        agent: 'Frontend',
        agentName: 'Spider-Man',
        action: 'Constructed AuthModal component with OTP inputs',
        log: 'Wrote src/components/AuthModal.tsx with Framer Motion physics & Tailwind styles',
        duration: '0.74s'
      },
      {
        agent: 'Backend',
        agentName: 'Iron Man',
        action: 'Added OTP generation & verification endpoints',
        log: 'Wrote src/app/api/auth/otp/route.ts with rate-limiting & hash check',
        duration: '0.45s'
      },
      {
        agent: 'Testing',
        agentName: 'Captain America',
        action: 'Verified keyboard navigation and form validation',
        log: '6/6 UI accessibility & unit tests passed without errors',
        duration: '0.31s'
      },
      {
        agent: 'Documentation',
        agentName: 'Wonder Woman',
        action: 'Documented authentication flow and component usage',
        log: 'Authored docs/AUTH_MODAL_GUIDE.md with prop interfaces and examples',
        duration: '0.20s'
      },
      {
        agent: 'Orchestrator',
        agentName: 'CodeCrew',
        action: 'Committed and opened GitHub Pull Request',
        log: 'Pushed branch codecrew/modern-auth-modal · PR #12 opened',
        duration: '0.18s'
      }
    ],
    prSummary: {
      title: 'feat(ui): Responsive AuthModal with 6-digit OTP verification & Framer Motion',
      branch: 'codecrew/modern-auth-modal',
      filesChanged: 3,
      testsPassing: '6/6 passing (WCAG AA)'
    }
  }
];

export const LiveWorkflowSimulator: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<WorkflowScenario>(SCENARIOS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const startSimulation = () => {
    setCurrentStepIndex(0);
    setIsRunning(true);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isRunning && currentStepIndex < activeScenario.steps.length) {
      timeout = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 900);
    } else if (currentStepIndex >= activeScenario.steps.length) {
      setIsRunning(false);
    }
    return () => clearTimeout(timeout);
  }, [isRunning, currentStepIndex, activeScenario.steps.length]);

  return (
    <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-[32px] border-[1.5px] border-[#0F172A] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              Interactive Workflow Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F172A]">
              Watch the Superhero Crew Execute a Real Task.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-tech mt-1">
              Select an engineering task below and simulate how the agents coordinate in real time.
            </p>
          </div>

          {/* Scenario Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setActiveScenario(sc);
                  setCurrentStepIndex(0);
                  setIsRunning(false);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-tech font-semibold transition-all cursor-pointer ${
                  activeScenario.id === sc.id
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sc.title}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <Terminal className="w-3.5 h-3.5 text-[#0F172A]" />
              <span>Target Repo: <strong className="text-slate-800">{activeScenario.repo}</strong></span>
            </div>
            <p className="text-xs sm:text-sm font-tech text-[#0F172A] font-medium">
              "{activeScenario.prompt}"
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={startSimulation}
              disabled={isRunning}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-tech font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                isRunning
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#0F172A] hover:bg-black text-white hover:scale-105'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{currentStepIndex > 0 && currentStepIndex >= activeScenario.steps.length ? 'Replay' : 'Run Task'}</span>
            </button>
            
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCurrentStepIndex(0);
                  setIsRunning(false);
                }}
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                title="Reset simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Live Coordination Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Step Execution Feed (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">
              Autonomous Step Pipeline
            </span>

            <div className="space-y-2.5">
              {activeScenario.steps.map((step, idx) => {
                const isExecuted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex && isRunning;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0.5 }}
                    animate={{ 
                      opacity: isExecuted || isCurrent ? 1 : 0.4,
                      scale: isCurrent ? 1.01 : 1
                    }}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isExecuted
                        ? 'border-emerald-500/40 bg-emerald-50/20'
                        : isCurrent
                        ? 'border-[#0F172A] bg-white shadow-md ring-2 ring-[#0F172A]/10'
                        : 'border-slate-200 bg-[#FAFAFA]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        {isExecuted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : isCurrent ? (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0F172A] border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-[10px] font-mono flex items-center justify-center">
                            {idx + 1}
                          </span>
                        )}
                        <span className="font-bold font-display text-[#0F172A]">
                          {step.agent} Agent ({step.agentName})
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {isExecuted ? step.duration : '--'}
                      </span>
                    </div>

                    <p className="text-xs font-tech text-slate-700 ml-6">
                      {step.action}
                    </p>

                    {(isExecuted || isCurrent) && (
                      <div className="mt-2 ml-6 text-[11px] font-mono text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-200/80">
                        {step.log}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Real-Time GitHub Pull Request Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl border-[1.5px] border-[#0F172A] bg-[#0F172A] text-white shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <GitPullRequest className="w-4 h-4" />
                  <span>GitHub Pull Request</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  {currentStepIndex >= activeScenario.steps.length ? 'Open & Ready' : 'Pending Synthesis'}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-bold font-display leading-snug text-slate-100">
                  {activeScenario.prSummary.title}
                </h4>
                <div className="text-xs font-mono text-slate-400">
                  Branch: <span className="text-slate-200">{activeScenario.prSummary.branch}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs font-tech text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Files Affected:</span>
                  <span className="font-mono text-slate-200">{activeScenario.prSummary.filesChanged} files (+142, -18)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Automated Checks:</span>
                  <span className="font-mono text-emerald-400">{activeScenario.prSummary.testsPassing}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">GPG Commit:</span>
                  <span className="font-mono text-slate-300">Verified by CodeCrew-Bot</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={startSimulation}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] text-xs font-tech font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>{currentStepIndex >= activeScenario.steps.length ? 'Merge to Main' : 'Trigger Agent Run'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveWorkflowSimulator;
