import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { TASK_PRESETS } from '../../data/mockRepos';
import { TaskCategory } from '../../types';
import { CodeDiffViewer } from '../ui/CodeDiffViewer';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES: { value: TaskCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { value: 'feature', label: 'Feature', icon: Zap },
  { value: 'bugfix', label: 'Bug Fix', icon: Bug },
  { value: 'refactor', label: 'Refactor', icon: SlidersHorizontal },
  { value: 'security', label: 'Security', icon: Shield },
  { value: 'performance', label: 'Performance', icon: Zap },
  { value: 'docs', label: 'Documentation', icon: BookOpen },
];

export const WorkspaceModal: React.FC = () => {
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

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<TaskCategory>('feature');
  const [runTests, setRunTests] = useState(true);
  const [generatePR, setGeneratePR] = useState(true);

  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const activeTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];
  const isRunning = activeTask && activeTask.status === 'running';
  const pr = activeTask?.pullRequest;
  const isMerged = pr?.status === 'merged';

  const handleApplyPreset = (preset: typeof TASK_PRESETS[0]) => {
    setTitle(preset.title);
    setPrompt(preset.prompt);
    setCategory(preset.category);
  };

  const handleVerifyRepo = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      addNotification({
        title: 'Repository Validated',
        message: 'Successfully fetched remote branch tree and AST symbols.',
        type: 'success',
      });
    }, 700);
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isExecuting) return;
    const taskTitle = title.trim() || prompt.trim().split('\n')[0].slice(0, 60);
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

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A967]/10 text-[#E5A967] text-xs font-mono font-medium border border-[#E5A967]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Autonomous AI Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Developer Workspace
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-tech mt-1">
            Connect repository, dispatch autonomous coding tasks, monitor live execution, and merge verified PRs.
          </p>
        </div>

        {activeTask && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-stone-400">Active Task:</span>
            <span className="text-[#E5A967] font-semibold truncate max-w-[200px]">
              {activeTask.title}
            </span>
          </div>
        )}
      </div>

      {/* Input Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step 1: Connect Repo (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white font-display">
                    1. Target Repository
                  </h3>
                  <p className="text-[11px] text-stone-400 font-tech">
                    Select or enter Git repository
                  </p>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl text-[11px] font-tech">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    !isCustomMode ? 'bg-white/10 text-white font-semibold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Repos
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    isCustomMode ? 'bg-white/10 text-white font-semibold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Custom URL
                </button>
              </div>
            </div>

            {!isCustomMode ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {repositories.map((repo) => {
                    const isSelected = selectedRepo?.id === repo.id;
                    return (
                      <button
                        key={repo.id}
                        type="button"
                        onClick={() => setSelectedRepo(repo)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-[#E5A967]/10 border-[#E5A967] ring-1 ring-[#E5A967]/40 shadow-[0_0_15px_rgba(229,169,103,0.15)]'
                            : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-mono font-semibold text-stone-200 truncate">
                            {repo.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#E5A967]" />}
                        </div>
                        <p className="text-[10px] text-stone-400 line-clamp-1 font-tech">
                          {repo.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500">
                          <span>{repo.language}</span>
                          <span>★ {repo.stars}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedRepo && (
                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <span className="text-xs font-tech text-stone-400 flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-[#E5A967]" />
                      Branch:
                    </span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-mono text-stone-200 border border-white/10 cursor-pointer"
                      >
                        <span>{selectedBranch}</span>
                        <ChevronDown className="w-3 h-3 text-stone-400" />
                      </button>
                      {isBranchDropdownOpen && (
                        <div className="absolute top-full mt-1 right-0 z-30 w-40 bg-[#121217] border border-white/10 rounded-xl shadow-xl py-1">
                          {selectedRepo.branches.map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => {
                                setSelectedBranch(b);
                                setIsBranchDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-white/5 flex items-center justify-between ${
                                selectedBranch === b ? 'text-[#E5A967] font-semibold' : 'text-stone-300'
                              }`}
                            >
                              {b}
                              {selectedBranch === b && <Check className="w-3 h-3 text-[#E5A967]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                    <Link className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={customRepoUrl}
                    onChange={(e) => setCustomRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repository"
                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-stone-600 focus:outline-none focus:border-[#E5A967]"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    placeholder="main"
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-stone-200 w-32 focus:outline-none focus:border-[#E5A967]"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyRepo}
                    disabled={isVerifying}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-tech text-stone-200 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                    <span>Validate</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Task Prompt Input (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between gap-4">
          <form onSubmit={handleDispatch} className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E5A967] to-[#D4883A] text-stone-950 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 fill-stone-950" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white font-display">
                    2. Describe Task
                  </h3>
                  <p className="text-[11px] text-stone-400 font-tech">
                    What should the AI implement or refactor?
                  </p>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1">
                {TASK_PRESETS.slice(0, 2).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 font-tech transition-colors cursor-pointer"
                  >
                    {p.category === 'security' ? 'JWT Rotation' : 'Stripe Webhook'}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.value;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-tech font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#E5A967] text-stone-950 font-bold shadow-xs'
                        : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title (e.g. Implement JWT refresh token rotation with Redis blacklisting)"
              className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-stone-600 focus:outline-none focus:border-[#E5A967]"
            />

            {/* Prompt textarea */}
            <textarea
              rows={3}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe requirements, files, edge cases, and test expectations...&#10;e.g. 'Add RFC-6749 compliant JWT refresh token rotation in src/auth/jwt.service.ts with Redis blacklisting upon logout. Include unit test specs and verify coverage.'"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-stone-200 placeholder-stone-600 leading-relaxed focus:outline-none focus:border-[#E5A967] resize-none"
            />

            {/* Flags & Submit */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
              <div className="flex items-center gap-3 text-xs font-tech text-stone-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={runTests}
                    onChange={(e) => setRunTests(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#E5A967] rounded border-white/20 bg-stone-900 focus:ring-[#E5A967]"
                  />
                  <span>Run Vitest Suite</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generatePR}
                    onChange={(e) => setGeneratePR(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#E5A967] rounded border-white/20 bg-stone-900 focus:ring-[#E5A967]"
                  />
                  <span>Open GitHub PR</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isExecuting || !prompt.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A967] to-[#D4883A] text-stone-950 text-xs font-bold font-tech uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(229,169,103,0.4)] disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                <span>{isExecuting ? 'Agent Working...' : 'Dispatch AI Agent'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Live Execution Timeline View */}
      {activeTask && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#E5A967]/15 text-[#E5A967] border border-[#E5A967]/30 flex items-center gap-1.5">
                    {isRunning ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E5A967] animate-ping" />
                        Live Execution Running
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        Execution Finished
                      </>
                    )}
                  </span>
                  <span className="text-xs font-mono text-stone-400">
                    Repo: <code className="text-stone-200">{activeTask.repo.fullName}</code>
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display text-white">
                  {activeTask.title}
                </h3>
              </div>

              <div className="text-right text-xs font-mono text-stone-400">
                <span>Started: {activeTask.createdAt}</span>
                {activeTask.completedAt && (
                  <p className="text-emerald-400">Finished: {activeTask.completedAt}</p>
                )}
              </div>
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {activeTask.stages.map((st, idx) => {
                const isDone = st.status === 'completed';
                const isCurrent = st.status === 'in_progress';
                return (
                  <div
                    key={st.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : isCurrent
                        ? 'bg-[#E5A967]/10 border-[#E5A967]/50 ring-1 ring-[#E5A967]/30 text-[#E5A967]'
                        : 'bg-white/[0.02] border-white/5 text-stone-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {isCurrent && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E5A967]" />}
                      {!isDone && !isCurrent && <Circle className="w-3 h-3 text-stone-600" />}
                    </div>
                    <h4 className="text-xs font-semibold font-display leading-tight line-clamp-2">
                      {st.name}
                    </h4>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isDone ? 'bg-emerald-400' : isCurrent ? 'bg-[#E5A967]' : 'bg-transparent'
                        }`}
                        style={{ width: `${st.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Terminal */}
            <div className="bg-[#050507] rounded-xl p-4 border border-white/5 font-mono text-xs h-60 overflow-y-auto space-y-1.5 scrollbar-thin">
              {activeTask.logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-stone-600 shrink-0 text-[10px]">[{log.timestamp}]</span>
                  <span className="text-[#E5A967] shrink-0 text-[10px] uppercase font-bold">
                    [{log.stage}]
                  </span>
                  <span
                    className={
                      log.type === 'success'
                        ? 'text-emerald-400'
                        : log.type === 'code'
                        ? 'text-sky-300'
                        : 'text-stone-300'
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center gap-2 text-stone-500 animate-pulse pt-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E5A967]" />
                  <span>Processing AST AST branches & generating type-safe patch...</span>
                </div>
              )}
            </div>
          </div>

          {/* Generated Pull Request Card */}
          {pr && (
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-white/10">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                      <GitPullRequest className="w-3.5 h-3.5" />
                      {isMerged ? `Merged PR #${pr.number}` : `Open PR #${pr.number}`}
                    </span>
                    <span className="text-xs font-mono text-stone-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                      {pr.branch} → {pr.baseBranch}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold font-display text-white">
                    {pr.title}
                  </h2>
                  <p className="text-xs font-tech text-stone-400">
                    Opened by <code className="text-[#E5A967]">{pr.author}</code> against branch{' '}
                    <code className="text-white">{pr.baseBranch}</code>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {pr.githubPrUrl ? (
                    <a
                      href={pr.githubPrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-tech transition-colors border border-white/10 cursor-pointer"
                    >
                      <span>View on GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                    </a>
                  ) : null}

                  {!isMerged ? (
                    <button
                      type="button"
                      onClick={handleMerge}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold text-xs font-tech uppercase tracking-wider transition-all hover:shadow-[0_0_25px_rgba(61,214,140,0.4)] cursor-pointer"
                    >
                      <GitMerge className="w-4 h-4" />
                      <span>Accept & Merge Pull Request</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold font-mono">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      Merged into {pr.baseBranch} ({pr.mergedAt})
                    </div>
                  )}
                </div>
              </div>

              {/* Diff Summary Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-tech text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-white">CI Test Suite</p>
                    <p className="text-[11px] text-emerald-400">14/14 tests passing (100%)</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                    ±
                  </div>
                  <div>
                    <p className="font-semibold text-white">Code Diff</p>
                    <p className="text-[11px] text-stone-300 font-mono">
                      <span className="text-emerald-400 font-bold">+{pr.additions}</span> /{' '}
                      <span className="text-rose-400 font-bold">-{pr.deletions}</span> in {pr.filesChanged} files
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E5A967]/20 text-[#E5A967] flex items-center justify-center font-bold">
                    ★
                  </div>
                  <div>
                    <p className="font-semibold text-white">Quality Audit</p>
                    <p className="text-[11px] text-stone-300">0 lint warnings · Strict typed</p>
                  </div>
                </div>
              </div>

              {/* Code Diff Viewer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400">
                    Unified Multi-File Diff Comparison
                  </h4>
                  <span className="text-xs text-stone-500 font-mono">
                    {pr.diffs.length} files modified
                  </span>
                </div>
                <CodeDiffViewer diffs={pr.diffs} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkspaceModal;
