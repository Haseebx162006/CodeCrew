import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  Sparkles,
  GitPullRequest,
  Github,
  Terminal,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Code2,
  Play,
  Check,
  Flame,
  Zap,
  CornerDownLeft,
  FileCode,
  GitBranch,
  Search,
  Command,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenWorkspace: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

const HERO_PRESETS = [
  {
    id: 'jwt',
    label: 'JWT Rotation & Blacklist',
    category: 'Security',
    icon: '🔐',
    repo: 'security-labs/auth-core',
    branch: 'main',
    prompt: 'Implement RFC-6749 refresh token rotation in auth middleware with Redis blacklisting and zero-downtime migration.',
    files: ['src/auth/jwt.service.ts', 'src/middleware/tokenRefresh.ts', 'src/tests/auth.test.ts'],
    diff: [
      { line: '@@ -18,6 +18,18 @@ export class TokenManager {', type: 'header' },
      { line: '-  async verify(token: string) { return jwt.verify(token); }', type: 'del' },
      { line: '+  async rotate(refreshToken: string): Promise<TokenPair> {', type: 'add' },
      { line: '+    const isRevoked = await this.redis.get(`revoked:${refreshToken}`);', type: 'add' },
      { line: '+    if (isRevoked) throw new TokenReplayError("Revoked token replay");', type: 'add' },
      { line: '+    await this.redis.set(`revoked:${refreshToken}`, "1", "EX", 604800);', type: 'add' },
      { line: '+    return this.issueNewTokenPair(payload.userId, payload.roles);', type: 'add' },
      { line: '+  }', type: 'add' },
    ],
    logs: [
      'Cloning AST symbol tree for security-labs/auth-core...',
      'Identified 842 symbols · Parsed Redis cache boundaries',
      'Synthesized secure token rotation handler with RFC-6749 compliance',
      'Running Vitest sandbox: 18/18 tests passing (100% coverage)',
      'Generated GitHub Pull Request #341 on branch ai-agent/jwt-rotation',
    ],
  },
  {
    id: 'stripe',
    label: 'Stripe Webhook Deduplication',
    category: 'Fintech',
    icon: '💳',
    repo: 'ecommerce/payment-service',
    branch: 'main',
    prompt: 'Add atomic event deduplication for Stripe webhooks with exponential backoff alerts in PostgreSQL.',
    files: ['src/routes/webhooks.ts', 'src/services/stripe.service.ts', 'src/db/events.ts'],
    diff: [
      { line: '@@ -42,6 +42,16 @@ export const webhookHandler = async (req) => {', type: 'header' },
      { line: '+  const eventId = req.headers["stripe-signature-id"];', type: 'add' },
      { line: '+  const lock = await redis.set(`lock:event:${eventId}`, "1", "NX", "EX", 60);', type: 'add' },
      { line: '+  if (!lock) return res.status(200).json({ received: true });', type: 'add' },
      { line: '+  await db.events.upsert({ where: { eventId }, data: req.body });', type: 'add' },
      { line: '+  await queue.dispatch("payments.process", req.body);', type: 'add' },
    ],
    logs: [
      'Cloning repository tree & PostgreSQL schemas...',
      'Identified webhook route in src/routes/webhooks.ts',
      'Applied idempotent event locking with Redis Distributed Locks',
      'Ran stress test matrix: 5,000 concurrent webhooks deduplicated without error',
      'Created Pull Request #194 with migration guide',
    ],
  },
  {
    id: 'rust',
    label: 'Lock-Free Engine Acceleration',
    category: 'High-Perf',
    icon: '⚡',
    repo: 'high-freq/engine-rs',
    branch: 'master',
    prompt: 'Refactor Mutex ring buffer to crossbeam lock-free atomic pointer queue and benchmark throughput.',
    files: ['src/engine/ring_buffer.rs', 'src/queue/atomic.rs', 'benches/throughput.rs'],
    diff: [
      { line: '@@ -11,4 +11,14 @@ pub struct RingBuffer<T> {', type: 'header' },
      { line: '-  lock: Mutex<VecDeque<T>>,', type: 'del' },
      { line: '+  head: AtomicUsize,', type: 'add' },
      { line: '+  tail: AtomicUsize,', type: 'add' },
      { line: '+  buffer: Box<[MaybeUninit<T>]>,', type: 'add' },
    ],
    logs: [
      'Inspecting cargo dependencies and miri safety checks...',
      'Replaced std::sync::Mutex with crossbeam lock-free ring buffer',
      'Benchmarking throughput: 1.2M ops/sec -> 8.9M ops/sec (+641%)',
      'Zero undefined behavior detected by Miri analyzer',
      'Pull Request #882 created and approved by automated reviewers',
    ],
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenWorkspace, onOpenAuth }) => {
  const [activePreset, setActivePreset] = useState(HERO_PRESETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [logs, setLogs] = useState<string[]>(HERO_PRESETS[0].logs);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleRunSimulation = (preset: typeof HERO_PRESETS[0]) => {
    setActivePreset(preset);
    setIsRunning(true);
    setProgress(0);
    setLogs([]);

    let step = 0;
    const interval = setInterval(() => {
      if (step < preset.logs.length) {
        const nextLog = preset.logs[step];
        setLogs((prev) => [...prev, nextLog]);
        setProgress(Math.round(((step + 1) / preset.logs.length) * 100));
        step++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 550);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Interactive mouse spotlight glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-40 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(229, 169, 103, 0.12), transparent 40%)`,
        }}
      />

      {/* Floating Top Pill */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-stone-300 mb-8 backdrop-blur-xl shadow-2xl"
      >
        <span className="w-2 h-2 rounded-full bg-[#E5A967] animate-ping" />
        <span className="font-tech font-semibold tracking-wider text-white">AUTONOMOUS PR GENERATOR</span>
        <span className="text-stone-600">/</span>
        <span className="text-[#E5A967] font-medium flex items-center gap-1">
          Zero Hallucination AST
          <ArrowRight className="w-3 h-3" />
        </span>
      </motion.div>

      {/* Cinematic Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-center max-w-5xl leading-[1.05] font-display mb-6"
      >
        <span className="text-white">Give Your Repo a Task.</span>
        <br />
        <span className="gold-gradient-text">Ship a Tested Pull Request.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-sm sm:text-lg text-stone-400 text-center max-w-2xl font-tech leading-relaxed mb-10"
      >
        Connect your repository, describe your task, and watch autonomous AI agents parse ASTs, write type-safe code, run tests, and open GPG-signed PRs on GitHub.
      </motion.p>

      {/* Hero Action CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4 mb-16 z-10"
      >
        <button
          type="button"
          onClick={onOpenWorkspace}
          className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#E5A967] to-[#D4883A] text-stone-950 font-bold text-sm transition-all duration-200 hover:shadow-[0_0_35px_rgba(229,169,103,0.45)] hover:scale-[1.02] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-stone-950" />
          <span>Launch AI Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onOpenAuth('signup')}
          className="flex items-center gap-2.5 px-7 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all duration-200 border border-white/15 backdrop-blur-md cursor-pointer"
        >
          <Github className="w-4 h-4 text-stone-300" />
          <span>Connect GitHub Free</span>
        </button>
      </motion.div>

      {/* Raycast-style Floating Command Bar & Live 3D Code Hologram */}
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="w-full max-w-5xl rounded-2xl bg-[#0C0C11]/90 border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden relative"
      >
        {/* Luminous Top Command Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0E0E14] flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Repo & Branch Chips */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-stone-200">
                <Github className="w-3.5 h-3.5 text-[#E5A967]" />
                <span className="font-semibold text-white">{activePreset.repo}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-stone-400">
                <GitBranch className="w-3 h-3 text-emerald-400" />
                <span>{activePreset.branch}</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-mono text-stone-500 hidden sm:inline mr-1">Presets:</span>
              {HERO_PRESETS.map((p) => {
                const isSelected = activePreset.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleRunSimulation(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-tech transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#E5A967] text-stone-950 font-bold shadow-xs'
                        : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Raycast Prompt Input */}
          <div className="relative flex items-center bg-[#07070A] rounded-xl border border-white/10 px-3.5 py-2.5 shadow-inner">
            <div className="text-[#E5A967] mr-2.5 flex items-center">
              <Sparkles className="w-4 h-4 fill-[#E5A967]" />
            </div>
            <input
              type="text"
              readOnly
              value={activePreset.prompt}
              className="w-full bg-transparent text-xs sm:text-sm font-mono text-stone-100 focus:outline-none select-all"
            />
            <button
              type="button"
              onClick={() => handleRunSimulation(activePreset)}
              disabled={isRunning}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#E5A967] to-[#D4883A] text-stone-950 text-xs font-bold font-tech uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50 cursor-pointer ml-2"
            >
              {isRunning ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Run Agent</span>
                  <CornerDownLeft className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live IDE Split-View: Left File Tree & Live Diff / Right Live AST Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10 bg-[#07070B]">
          {/* Left: Code Diff Editor (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between gap-3">
            <div className="space-y-3">
              {/* File Tabs */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  {activePreset.files.map((f, i) => (
                    <span
                      key={f}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5 ${
                        i === 0 ? 'bg-white/10 text-white font-medium border border-white/10' : 'text-stone-500'
                      }`}
                    >
                      <FileCode className="w-3 h-3 text-[#E5A967]" />
                      {f.split('/').pop()}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">+18 additions / -2 deletions</span>
              </div>

              {/* Diff Lines */}
              <div className="bg-[#040406] rounded-xl p-3.5 font-mono text-[11px] leading-relaxed border border-white/5 overflow-x-auto space-y-1">
                {activePreset.diff.map((d, i) => {
                  const isAdd = d.type === 'add';
                  const isDel = d.type === 'del';
                  const isHeader = d.type === 'header';
                  return (
                    <div
                      key={i}
                      className={`px-2 py-0.5 rounded ${
                        isAdd
                          ? 'bg-emerald-950/40 text-emerald-300 font-medium'
                          : isDel
                          ? 'bg-rose-950/40 text-rose-300 line-through opacity-70'
                          : isHeader
                          ? 'text-[#E5A967] font-bold'
                          : 'text-stone-300'
                      }`}
                    >
                      {d.line}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                <span>Autonomous Generation & Test Matrix</span>
                <span className="text-[#E5A967] font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E5A967] to-emerald-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Live AST Telemetry & PR Acceptance Banner (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between gap-4 bg-[#09090E]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Live AST & Test Logs
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 18/18 Passing
                </span>
              </div>

              {/* Log Terminal */}
              <div className="bg-[#040406] rounded-xl p-3 border border-white/5 font-mono text-[11px] space-y-2 h-44 overflow-y-auto scrollbar-none">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-stone-300">
                    <span className="text-[#E5A967] shrink-0 font-bold">&gt;</span>
                    <span className={log.includes('PR') ? 'text-emerald-400 font-semibold' : ''}>
                      {log}
                    </span>
                  </div>
                ))}
                {isRunning && (
                  <div className="flex items-center gap-2 text-stone-500 animate-pulse text-[10px]">
                    <Sparkles className="w-3 h-3 text-[#E5A967] animate-spin" />
                    <span>Analyzing call graph & parsing symbol nodes...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Accept PR Call to Action */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/30 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  Pull Request #341 Ready
                </span>
                <span className="text-xs text-white font-tech">0 conflicts · GPG signed</span>
              </div>

              <button
                type="button"
                onClick={onOpenWorkspace}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs font-bold font-tech uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shrink-0"
              >
                Merge to Main
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
