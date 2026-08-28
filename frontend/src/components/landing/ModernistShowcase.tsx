import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, FileCode, CheckCircle2, GitBranch, ArrowUpRight } from 'lucide-react';

const STAGES = [
  {
    step: '01',
    title: 'AST Symbol Ingestion',
    tag: 'Graph AST',
    desc: 'Parses the entire abstract syntax tree, dependency tree, and interface signatures across thousands of modules in milliseconds.',
    code: `// Stage 1: Build Symbol Graph
const symbolMap = await parser.buildAST({
  repo: "github/ecommerce-core",
  targetSymbols: ["TokenManager", "RedisStore", "AuthMiddleware"],
  depth: 4
});
// ✓ 1,420 modules indexed · 0 unresolvable types`,
  },
  {
    step: '02',
    title: 'Context Planning & Diff Spec',
    tag: 'Spec Driven',
    desc: 'Formulates an atomic step-by-step diff plan with multi-file dependency ordering and regression prevention.',
    code: `## Plan: RFC-6749 JWT Token Rotation
1. [MODIFY] src/auth/jwt.service.ts
   - Inject Redis token revocation check
2. [CREATE] src/middleware/tokenRefresh.ts
   - Enforce HTTP-only secure cookie rotation
3. [CREATE] src/tests/auth.test.ts
   - 14 test specs for replay protection`,
  },
  {
    step: '03',
    title: 'Autonomous Code Synthesis',
    tag: 'Type-Safe',
    desc: 'Synthesizes clean, production-grade TypeScript, Go, Rust, or Python code adhering strictly to your repo conventions.',
    code: `export const tokenRefreshMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['refresh_token'];
  if (!token) return next();
  const pair = await JwtService.verifyAndRotate(token);
  res.cookie('refresh_token', pair.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
  next();
};`,
  },
  {
    step: '04',
    title: 'Automated Vitest Sandbox',
    tag: '100% Passing',
    desc: 'Spins up an ephemeral isolated sandbox, runs automated unit test suites, and verifies 0 regression errors.',
    code: `✓ test/auth.spec.ts (14 tests) 18ms
  ✓ should rotate token on valid request
  ✓ should reject revoked token
  ✓ should handle concurrent refresh requests
Coverage: 100% branch · 0 lint errors`,
  },
  {
    step: '05',
    title: 'GPG Signed Pull Request',
    tag: '1-Click Merge',
    desc: 'Pushes the branch to GitHub and opens a Pull Request with complete changelog, test verification logs, and diff view.',
    code: `git checkout -b ai-agent/feat-jwt-rotation
git commit -S -m "feat(auth): RFC-6749 JWT token rotation"
git push origin ai-agent/feat-jwt-rotation

✓ Pull Request #42 generated on GitHub (Passed 3/3 Checks)`,
  },
];

export const ModernistShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = STAGES[activeIdx];

  return (
    <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-[32px] border-[1.5px] border-[#0F172A] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              autonomous lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F172A]">
              How the Agent Ships Pull Requests.
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {STAGES.map((st, i) => (
              <button
                key={st.step}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  activeIdx === i
                    ? 'bg-[#0F172A] text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                0{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Stage Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#EDF3FA] text-[#6F87A7] text-xs font-mono font-semibold">
              {current.tag}
            </span>
            <h3 className="text-2xl font-bold font-display text-[#0F172A]">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-tech leading-relaxed">
              {current.desc}
            </p>
          </div>

          {/* Right Code Sandbox (7 cols) */}
          <div className="lg:col-span-7 bg-[#0F172A] rounded-2xl p-5 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-[#97ADCB]" />
                Stage 0{activeIdx + 1} Telemetry
              </span>
              <span>Node Verified</span>
            </div>
            <pre className="text-emerald-400 leading-relaxed whitespace-pre-wrap">
              {current.code}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernistShowcase;
