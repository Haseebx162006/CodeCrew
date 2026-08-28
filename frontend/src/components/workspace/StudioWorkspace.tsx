import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { TASK_PRESETS } from '../../data/mockRepos';
import { TaskCategory, FileDiff } from '../../types';
import {
  Sparkles,
  Github,
  GitBranch,
  Terminal,
  ArrowRight,
  GitPullRequest,
  GitMerge,
  CheckCircle2,
  Circle,
  Loader2,
  Cpu,
  Zap,
  Shield,
  Bug,
  SlidersHorizontal,
  BookOpen,
  Check,
  ExternalLink,
  Lock,
  Globe,
  Star,
  RefreshCw,
  Link,
  MessageSquare,
  Copy,
  ChevronDown,
  FolderTree,
  FileCode,
  FilePlus,
  FileEdit,
  Code2,
  Play,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES: { value: TaskCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { value: 'feature', label: 'Feature', icon: Zap },
  { value: 'bugfix', label: 'Bug Fix', icon: Bug },
  { value: 'refactor', label: 'Refactor', icon: SlidersHorizontal },
  { value: 'security', label: 'Security', icon: Shield },
  { value: 'performance', label: 'Performance', icon: Zap },
  { value: 'docs', label: 'Docs', icon: BookOpen },
];

export const StudioWorkspace: React.FC = () => {
  const {
    repositories,
    selectedRepo,
    customRepoUrl,
    selectedBranch,
    setSelectedRepo,
    setCustomRepoUrl,
    setSelectedBranch,
    submitTask,
    tasks,
    activeTaskId,
    isExecuting,
    mergePullRequest,
    addNotification,
  } = useAppStore();

  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<TaskCategory>('feature');
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  const activeTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];
  const isRunning = activeTask && activeTask.status === 'running';
  const pr = activeTask?.pullRequest;
  const isMerged = pr?.status === 'merged';

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTask?.logs]);

  const handleApplyPreset = (preset: typeof TASK_PRESETS[0]) => {
    setPrompt(preset.prompt);
    setCategory(preset.category);
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isExecuting) return;
    const taskTitle = prompt.trim().split('\n')[0].slice(0, 60);
    await submitTask({
      title: taskTitle,
      prompt: prompt.trim(),
      category,
    });
  };

  const handleMerge = () => {
    if (activeTask) {
      mergePullRequest(activeTask.id);
    }
  };

  const currentDiff = pr?.diffs[selectedFileIdx] || pr?.diffs[0];

  const handleCopyDiff = () => {
    if (currentDiff) {
      navigator.clipboard.writeText(currentDiff.diffHunk);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pt-24 pb-16 px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-4">
      {/* Top Unified Studio Command Bar */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 border border-white/10 shadow-2xl backdrop-blur-2xl">
        <form onSubmit={handleDispatch} className="flex flex-col gap-3">
          {/* Row 1: Target Repo + Branch + Category Chips + Preset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Repo Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRepoDropdownOpen(!isRepoDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition-all cursor-pointer shadow-xs"
                >
                  <Github className="w-3.5 h-3.5 text-[#E5A967]" />
                  <span className="font-semibold">{selectedRepo?.fullName || 'Select Repository'}</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {isRepoDropdownOpen && (
                  <div className="absolute top-full mt-1.5 left-0 z-30 w-72 bg-[#121217] border border-white/15 rounded-xl shadow-2xl p-1.5 space-y-1">
                    <p className="px-2 py-1 text-[10px] uppercase font-mono text-stone-400">
                      Connected Repositories
                    </p>
                    {repositories.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelectedRepo(r);
                          setIsRepoDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between ${
                          selectedRepo?.id === r.id
                            ? 'bg-[#E5A967]/15 text-[#E5A967] font-semibold'
                            : 'text-stone-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate">{r.fullName}</span>
                        {selectedRepo?.id === r.id && <Check className="w-3.5 h-3.5 text-[#E5A967]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Branch Selector */}
              {selectedRepo && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-stone-300 transition-all cursor-pointer"
                  >
                    <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedBranch}</span>
                    <ChevronDown className="w-3 h-3 text-stone-400" />
                  </button>

                  {isBranchDropdownOpen && (
                    <div className="absolute top-full mt-1.5 left-0 z-30 w-44 bg-[#121217] border border-white/15 rounded-xl shadow-2xl p-1">
                      {selectedRepo.branches.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => {
                            setSelectedBranch(b);
                            setIsBranchDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between ${
                            selectedBranch === b
                              ? 'bg-[#E5A967]/15 text-[#E5A967] font-semibold'
                              : 'text-stone-300 hover:bg-white/5'
                          }`}
                        >
                          <span>{b}</span>
                          {selectedBranch === b && <Check className="w-3.5 h-3.5 text-[#E5A967]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Category Pills */}
              <div className="hidden md:flex items-center gap-1 pl-2 border-l border-white/10">
                {CATEGORIES.slice(0, 4).map((cat) => {
                  const isSelected = category === cat.value;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-tech flex items-center gap-1 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#E5A967] text-stone-950 font-bold'
                          : 'bg-white/5 text-stone-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Preset Chips */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-mono text-stone-500 hidden lg:inline mr-1">Presets:</span>
              {TASK_PRESETS.slice(0, 3).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 font-tech transition-colors cursor-pointer"
                >
                  {p.category === 'security' ? '🔐 JWT' : p.category === 'feature' ? '💳 Stripe' : '⚡ Orders'}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Prompt Input Composer + Run Button */}
          <div className="flex items-center gap-2 bg-[#060608] rounded-xl border border-white/10 px-3.5 py-2 shadow-inner">
            <Sparkles className="w-4 h-4 text-[#E5A967] shrink-0" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your task (e.g. Implement RFC-6749 JWT token rotation in auth middleware with Redis blacklisting and Vitest coverage)..."
              className="w-full bg-transparent text-xs sm:text-sm font-mono text-white placeholder-stone-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isExecuting || !prompt.trim()}
              className="shrink-0 flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#E5A967] to-[#D4883A] text-stone-950 text-xs font-bold font-tech uppercase tracking-wider transition-all hover:scale-[1.02] disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(229,169,103,0.3)]"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Dispatch Agent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main 3-Pane Pro Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Pane 1: File Tree & AST Explorer (Left - 3 cols) */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-4 border border-white/10 flex flex-col gap-3 min-h-[580px]">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono text-stone-300 font-semibold flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-[#E5A967]" />
              Repository AST Tree
            </span>
            <span className="text-[10px] font-mono text-stone-500">
              {selectedRepo?.name}
            </span>
          </div>

          {/* File Explorer List */}
          <div className="space-y-1 font-mono text-xs text-stone-400 overflow-y-auto flex-1">
            <div className="px-2 py-1 text-stone-500 font-bold uppercase text-[10px]">
              Modified & Staged Files
            </div>

            {pr?.diffs ? (
              pr.diffs.map((d, idx) => {
                const isSelected = idx === selectedFileIdx;
                return (
                  <button
                    key={d.filename}
                    type="button"
                    onClick={() => setSelectedFileIdx(idx)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#E5A967]/15 text-[#E5A967] font-semibold border border-[#E5A967]/30'
                        : 'hover:bg-white/5 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {d.status === 'added' ? (
                        <FilePlus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <FileEdit className="w-3.5 h-3.5 text-[#E5A967] shrink-0" />
                      )}
                      <span className="truncate">{d.filename.split('/').pop()}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">+{d.additions}</span>
                  </button>
                );
              })
            ) : (
              <div className="space-y-1 opacity-70">
                <div className="px-2.5 py-1 rounded text-stone-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-stone-500" />
                  <span>src/auth/jwt.service.ts</span>
                </div>
                <div className="px-2.5 py-1 rounded text-stone-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-stone-500" />
                  <span>src/middleware/tokenRefresh.ts</span>
                </div>
                <div className="px-2.5 py-1 rounded text-stone-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-stone-500" />
                  <span>src/tests/auth.test.ts</span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/5 mt-4 space-y-1.5 text-[11px] font-tech text-stone-400">
              <div className="flex items-center justify-between">
                <span>AST Symbols</span>
                <span className="font-mono text-white">842 parsed</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Branch Status</span>
                <span className="font-mono text-emerald-400">Up to date</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Test Framework</span>
                <span className="font-mono text-stone-300">Vitest 2.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pane 2: Monaco-Style Live Code Diff Editor (Center - 6 cols) */}
        <div className="lg:col-span-6 glass-card rounded-2xl border border-white/10 flex flex-col overflow-hidden min-h-[580px]">
          {/* File Tabs */}
          <div className="bg-[#0A0A0E] px-3 py-2 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto">
              {pr?.diffs.map((d, i) => (
                <button
                  key={d.filename}
                  type="button"
                  onClick={() => setSelectedFileIdx(i)}
                  className={`px-3 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    i === selectedFileIdx
                      ? 'bg-white/10 text-white font-medium border border-white/10'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <FileCode className="w-3 h-3 text-[#E5A967]" />
                  <span>{d.filename.split('/').pop()}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopyDiff}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-mono transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Current File Path Banner */}
          <div className="bg-[#0D0D12] px-4 py-2 border-b border-white/5 flex items-center justify-between text-xs font-mono text-stone-400">
            <span className="text-stone-200 truncate">{currentDiff?.filename || 'src/auth/jwt.service.ts'}</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">+{currentDiff?.additions || 48} lines</span>
              <span className="text-rose-400">-{currentDiff?.deletions || 8} lines</span>
            </div>
          </div>

          {/* Live Diff Code Body */}
          <div className="flex-1 bg-[#050507] p-4 font-mono text-[12px] leading-relaxed overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-thin">
            {currentDiff ? (
              currentDiff.diffHunk.split('\n').map((line, idx) => {
                const isAdd = line.startsWith('+') && !line.startsWith('+++');
                const isDel = line.startsWith('-') && !line.startsWith('---');
                const isHeader = line.startsWith('@@');

                let lineClass = 'text-stone-300';
                let bgClass = '';
                if (isAdd) {
                  lineClass = 'text-emerald-300 font-medium';
                  bgClass = 'bg-emerald-950/30';
                } else if (isDel) {
                  lineClass = 'text-rose-300 line-through opacity-70';
                  bgClass = 'bg-rose-950/30';
                } else if (isHeader) {
                  lineClass = 'text-[#E5A967] font-bold';
                  bgClass = 'bg-white/5';
                }

                return (
                  <div key={idx} className={`flex items-start px-2 py-0.5 rounded ${bgClass}`}>
                    <span className="w-8 shrink-0 select-none text-stone-600 text-right pr-3 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="w-4 shrink-0 select-none font-bold text-center opacity-70">
                      {isAdd ? '+' : isDel ? '-' : ' '}
                    </span>
                    <span className={`flex-1 whitespace-pre ${lineClass}`}>{line}</span>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 text-stone-500 space-y-2">
                <Code2 className="w-8 h-8 text-stone-600" />
                <p className="text-xs">Dispatch a task above to stream live generated diffs.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pane 3: Agent Telemetry & 1-Click PR Merge (Right - 3 cols) */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-4 border border-white/10 flex flex-col justify-between gap-4 min-h-[580px]">
          {/* Stages Progression */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono text-stone-300 font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Agent Pipeline
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {activeTask?.stages ? 'Active' : 'Standby'}
              </span>
            </div>

            {/* Micro Stages */}
            <div className="space-y-1.5">
              {(activeTask?.stages || [
                { id: '1', name: 'AST Ingestion', status: 'completed' },
                { id: '2', name: 'Context Planning', status: 'completed' },
                { id: '3', name: 'Code Synthesis', status: 'completed' },
                { id: '4', name: 'Vitest Matrix', status: 'completed' },
                { id: '5', name: 'PR Creation', status: 'completed' },
              ]).map((st, i) => {
                const isDone = st.status === 'completed';
                const isCurrent = st.status === 'in_progress';
                return (
                  <div
                    key={st.id}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-tech flex items-center justify-between ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : isCurrent
                        ? 'bg-[#E5A967]/20 border-[#E5A967]/50 text-[#E5A967] font-semibold animate-pulse'
                        : 'bg-white/[0.02] border-white/5 text-stone-500'
                    }`}
                  >
                    <span>0{i + 1} {st.name}</span>
                    {isDone && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    {isCurrent && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E5A967]" />}
                  </div>
                );
              })}
            </div>

            {/* Live Streaming Logs */}
            <div className="pt-2">
              <p className="text-[10px] uppercase font-mono text-stone-400 mb-1.5">
                Terminal Stream
              </p>
              <div className="bg-[#040406] rounded-xl p-3 border border-white/5 font-mono text-[10px] space-y-1.5 h-44 overflow-y-auto scrollbar-none">
                {activeTask?.logs ? (
                  activeTask.logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-1.5 text-stone-300">
                      <span className="text-[#E5A967]">&gt;</span>
                      <span className={log.type === 'success' ? 'text-emerald-400' : ''}>
                        {log.message}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-stone-600">Waiting for prompt dispatch...</div>
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>

          {/* Accept / Merge PR Card */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            {pr ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">PR #{pr.number} Ready</span>
                  <span className="text-stone-400">14/14 tests pass</span>
                </div>

                {!isMerged ? (
                  <button
                    type="button"
                    onClick={handleMerge}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold text-xs font-tech uppercase tracking-wider transition-all hover:shadow-[0_0_25px_rgba(61,214,140,0.4)] cursor-pointer"
                  >
                    <GitMerge className="w-4 h-4" />
                    <span>Accept & Merge Pull Request</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold font-mono text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Merged to {pr.baseBranch}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-stone-500 font-tech">
                Submit a task to generate an automated PR.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioWorkspace;
