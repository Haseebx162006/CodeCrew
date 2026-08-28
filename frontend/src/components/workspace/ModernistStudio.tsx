import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import {
  Github,
  GitBranch,
  ArrowRight,
  GitMerge,
  CheckCircle2,
  XCircle,
  Loader2,
  Cpu,
  Check,
  ExternalLink,
  Copy,
  ChevronDown,
  FolderTree,
  FileCode,
  FilePlus,
  FileEdit,
  Code2,
  AlertTriangle,
} from 'lucide-react';

export const ModernistStudio: React.FC = () => {
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
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [customRepoInput, setCustomRepoInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  const activeTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];
  const isFailed = activeTask?.status === 'failed';
  const pr = activeTask?.pullRequest;
  const isMerged = pr?.status === 'merged';

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTask?.logs]);

  // Keep selected file index within range of available diffs
  useEffect(() => {
    if (pr?.diffs && pr.diffs.length > 0 && selectedFileIdx >= pr.diffs.length) {
      setSelectedFileIdx(0);
    }
  }, [pr?.diffs, selectedFileIdx]);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isExecuting || isSubmitting) return;

    if (!selectedRepo && !customRepoUrl) {
      setIsRepoDropdownOpen(true);
      addNotification({
        title: 'Repository Required',
        message: 'Please select or link a GitHub repository to dispatch your agent task.',
        type: 'info',
      });
      return;
    }

    setIsSubmitting(true);
    const taskTitle = prompt.trim().split('\n')[0].slice(0, 60);

    try {
      await submitTask({
        title: taskTitle,
        prompt: prompt.trim(),
        category: 'feature',
      });
    } catch (err: any) {
      addNotification({
        title: 'Dispatch Failed',
        message: err?.message || 'Could not start the autonomous agent task.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMerge = () => {
    if (activeTask) {
      mergePullRequest(activeTask.id);
    }
  };

  const currentDiff = pr?.diffs && pr.diffs.length > 0 ? (pr.diffs[selectedFileIdx] || pr.diffs[0]) : null;

  const handleCopyDiff = () => {
    if (currentDiff) {
      navigator.clipboard.writeText(currentDiff.diffHunk);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isBusy = isExecuting || isSubmitting;

  return (
    <div className="py-8 px-4 sm:px-8 max-w-6xl mx-auto space-y-6">
      {/* Top Command Bar in White Card */}
      <div className="bg-white rounded-[32px] border-[1.5px] border-[#0F172A] p-6 shadow-2xl space-y-4">
        <form onSubmit={handleDispatch} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Repo Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRepoDropdownOpen(!isRepoDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border-[1.5px] border-[#0F172A] bg-white hover:bg-slate-50 text-xs font-mono font-semibold text-[#0F172A] cursor-pointer shadow-xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>{selectedRepo?.fullName || 'Select Repository'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {isRepoDropdownOpen && (
                  <div className="absolute top-full mt-1.5 left-0 z-30 w-80 bg-white border-[1.5px] border-[#0F172A] rounded-2xl shadow-2xl p-2.5 space-y-2">
                    <p className="px-1 text-[10px] uppercase font-mono text-slate-400 font-bold">
                      Connected Repositories ({repositories?.length || 0})
                    </p>
                    <div className="max-h-56 overflow-y-auto space-y-1">
                      {repositories && repositories.length > 0 ? (
                        repositories.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              setSelectedRepo(r);
                              setIsRepoDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono flex items-center justify-between transition-colors ${
                              selectedRepo?.id === r.id
                                ? 'bg-[#0F172A] text-white font-semibold'
                                : 'text-[#0F172A] hover:bg-slate-50'
                            }`}
                          >
                            <span className="truncate">{r.fullName}</span>
                            {selectedRepo?.id === r.id && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-3 text-center text-xs font-mono text-slate-400">
                          No repositories connected yet.
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <p className="px-1 text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">
                        Connect Custom GitHub Repo
                      </p>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={customRepoInput}
                          onChange={(e) => setCustomRepoInput(e.target.value)}
                          placeholder="https://github.com/owner/repo"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A]"
                        />
                        <button
                          type="button"
                          disabled={!customRepoInput.trim()}
                          onClick={async () => {
                            if (customRepoInput.trim()) {
                              await useAppStore.getState().addCustomRepository(customRepoInput.trim());
                              setCustomRepoInput('');
                              setIsRepoDropdownOpen(false);
                            }
                          }}
                          className="px-2.5 py-1 bg-[#0F172A] text-white rounded-lg text-xs font-mono font-bold hover:bg-black disabled:opacity-40 cursor-pointer"
                        >
                          Link
                        </button>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                        <a
                          href="https://github.com/apps/codecrew-agent-haseeb/installations/new"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          <span>Install GitHub App on your repos ↗</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Branch */}
              {selectedRepo && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDF3FA] text-[#6F87A7] text-xs font-mono font-semibold cursor-pointer"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>{selectedBranch}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {isBranchDropdownOpen && (
                    <div className="absolute top-full mt-1.5 left-0 z-30 w-44 bg-white border-[1.5px] border-[#0F172A] rounded-xl shadow-2xl p-1">
                      {selectedRepo.branches.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => {
                            setSelectedBranch(b);
                            setIsBranchDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between ${
                            selectedBranch === b
                              ? 'bg-[#0F172A] text-white font-semibold'
                              : 'text-[#0F172A] hover:bg-slate-50'
                          }`}
                        >
                          <span>{b}</span>
                          {selectedBranch === b && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Autonomous AI Workflow Engine
            </div>
          </div>

          {/* Prompt input row */}
          <div className="flex items-center gap-2 bg-[#F8FAFC] rounded-2xl border-[1.5px] border-[#0F172A] px-4 py-2.5">
            <span className="text-slate-400 font-mono text-sm">&gt;</span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your task (e.g. create a docs folder and add README.md explaining project architecture)..."
              className="w-full bg-transparent text-xs sm:text-sm font-mono text-[#0F172A] placeholder-slate-400 focus:outline-none"
              disabled={isBusy}
            />
            <button
              type="submit"
              disabled={isBusy || !prompt.trim()}
              className={`shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                isBusy
                  ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse cursor-not-allowed'
                  : 'bg-[#0F172A] hover:bg-black text-white hover:scale-105 active:scale-95'
              } disabled:opacity-40`}
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Processing...</span>
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

      {/* 3-Pane Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Pane 1: File Explorer (Left - 3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-[32px] border-[1.5px] border-[#0F172A] p-5 shadow-2xl flex flex-col gap-3 min-h-[560px]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-mono text-[#0F172A] font-bold flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-[#6F87A7]" />
              Repository Files
            </span>
            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
              {selectedRepo?.name}
            </span>
          </div>

          <div className="space-y-1 font-mono text-xs text-slate-500 overflow-y-auto flex-1">
            <div className="px-2 py-1 text-slate-400 font-bold uppercase text-[10px]">
              Changed / Created Files ({pr?.diffs?.length || 0})
            </div>

            {pr?.diffs && pr.diffs.length > 0 ? (
              pr.diffs.map((d, idx) => {
                const isSelected = idx === selectedFileIdx;
                return (
                  <button
                    key={d.filename}
                    type="button"
                    onClick={() => setSelectedFileIdx(idx)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F172A] text-white font-semibold shadow-xs'
                        : 'hover:bg-slate-50 text-[#0F172A]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {d.status === 'added' ? (
                        <FilePlus className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <FileEdit className="w-3.5 h-3.5 text-[#6F87A7] shrink-0" />
                      )}
                      <span className="truncate">{d.filename}</span>
                    </div>
                    <span className={`text-[10px] font-bold shrink-0 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`}>
                      +{d.additions}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs flex flex-col items-center justify-center h-48 space-y-2">
                <FileCode className="w-6 h-6 text-slate-300" />
                <p>No modified files yet.</p>
                <p className="text-[11px] text-slate-400">Dispatch an agent task to view real modified files.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pane 2: Monaco-Style Diff Editor (Center - 6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-[32px] border-[1.5px] border-[#0F172A] flex flex-col overflow-hidden shadow-2xl min-h-[560px]">
          {/* File Tab Header */}
          <div className="bg-[#F8FAFC] px-4 py-3 border-b border-[#0F172A] flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[80%]">
              {pr?.diffs && pr.diffs.length > 0 ? (
                pr.diffs.map((d, i) => (
                  <button
                    key={d.filename}
                    type="button"
                    onClick={() => setSelectedFileIdx(i)}
                    className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      i === selectedFileIdx
                        ? 'bg-[#0F172A] text-white font-semibold'
                        : 'text-slate-600 hover:text-black bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <FileCode className="w-3 h-3" />
                    <span className="truncate max-w-[140px]">{d.filename.split('/').pop()}</span>
                  </button>
                ))
              ) : (
                <span className="text-xs font-mono text-slate-400 px-2 py-1">Diff Editor</span>
              )}
            </div>

            {currentDiff && (
              <button
                type="button"
                onClick={handleCopyDiff}
                className="flex items-center gap-1 px-3 py-1 rounded-full border border-slate-300 hover:bg-white text-slate-700 text-xs font-mono transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {/* Current Path Banner */}
          {currentDiff && (
            <div className="bg-white px-5 py-2.5 border-b border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="text-[#0F172A] font-semibold truncate max-w-[320px]">{currentDiff.filename}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-emerald-600 font-bold">+{currentDiff.additions} lines</span>
                <span className="text-rose-600 font-bold">-{currentDiff.deletions} lines</span>
              </div>
            </div>
          )}

          {/* Diff Content */}
          <div className="flex-1 bg-[#0F172A] p-5 font-mono text-[12px] leading-relaxed overflow-x-auto overflow-y-auto max-h-[460px] scrollbar-none text-slate-200">
            {currentDiff ? (
              currentDiff.diffHunk.split('\n').map((line, idx) => {
                const isAdd = line.startsWith('+') && !line.startsWith('+++');
                const isDel = line.startsWith('-') && !line.startsWith('---');
                const isHeader = line.startsWith('@@');

                let lineClass = 'text-slate-300';
                let bgClass = '';
                if (isAdd) {
                  lineClass = 'text-emerald-300 font-medium';
                  bgClass = 'bg-emerald-950/40';
                } else if (isDel) {
                  lineClass = 'text-rose-300 line-through opacity-70';
                  bgClass = 'bg-rose-950/40';
                } else if (isHeader) {
                  lineClass = 'text-[#97ADCB] font-bold';
                  bgClass = 'bg-slate-800/50';
                }

                return (
                  <div key={idx} className={`flex items-start px-2 py-0.5 rounded ${bgClass}`}>
                    <span className="w-8 shrink-0 select-none text-slate-500 text-right pr-3 text-[10px]">
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
              <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-500 space-y-2">
                <Code2 className="w-8 h-8 text-slate-600" />
                <p className="text-xs">Dispatch a task above to stream live generated diffs.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pane 3: Agent Pipeline Stream & Terminal Output (Right - 3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-[32px] border-[1.5px] border-[#0F172A] p-5 shadow-2xl flex flex-col justify-between gap-4 min-h-[560px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-mono text-[#0F172A] font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#6F87A7]" />
                Pipeline Stream
              </span>
              <span className={`text-[10px] font-mono font-bold ${
                isFailed ? 'text-rose-600' : isBusy ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {isFailed ? 'Error Occurred' : isBusy ? 'Running' : 'Standby'}
              </span>
            </div>

            {/* Stages with Error Interruption Styling */}
            <div className="space-y-1.5">
              {(activeTask?.stages || [
                { id: '1', name: 'AST Ingestion', status: 'pending' },
                { id: '2', name: 'Context Planning', status: 'pending' },
                { id: '3', name: 'Code Synthesis', status: 'pending' },
                { id: '4', name: 'Test Verification', status: 'pending' },
                { id: '5', name: 'Git Commit & PR', status: 'pending' },
              ]).map((st, i) => {
                const isCurrent = st.status === 'in_progress';
                const isDone = st.status === 'completed';
                const isStageFailed = isFailed && (isCurrent || i === (activeTask?.currentStageIndex || 0));

                let bgClass = 'bg-slate-50 border-slate-200 text-slate-400';
                if (isStageFailed) {
                  bgClass = 'bg-rose-50 border-rose-300 text-rose-800 font-bold';
                } else if (isDone) {
                  bgClass = 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium';
                } else if (isCurrent) {
                  bgClass = 'bg-amber-50 border-amber-300 text-amber-900 font-semibold animate-pulse';
                }

                return (
                  <div
                    key={st.id}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-tech flex items-center justify-between transition-all ${bgClass}`}
                  >
                    <span>0{i + 1} {st.name}</span>
                    {isStageFailed ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    ) : isDone ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700 shrink-0" />
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Terminal logs */}
            <div className="pt-2">
              <p className="text-[10px] uppercase font-mono text-slate-400 font-bold mb-1.5">
                Terminal Output
              </p>
              <div className="bg-[#0F172A] rounded-xl p-3 text-slate-200 font-mono text-[10px] space-y-1.5 h-44 overflow-y-auto scrollbar-none">
                {activeTask?.logs && activeTask.logs.length > 0 ? (
                  activeTask.logs.map((log) => {
                    const isErr = log.type === 'error';
                    return (
                      <div key={log.id} className="flex items-start gap-1.5">
                        <span className={isErr ? 'text-rose-400' : 'text-[#97ADCB]'}>&gt;</span>
                        <span className={isErr ? 'text-rose-400 font-bold' : log.type === 'success' ? 'text-emerald-400' : ''}>
                          {log.message}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-slate-500">Waiting for agent dispatch...</div>
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>

          {/* Merge PR Button & Actions */}
          <div className="pt-3 border-t border-slate-100">
            {pr ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-600 font-bold">PR #{pr.number} Ready</span>
                  {pr.githubPrUrl ? (
                    <a
                      href={pr.githubPrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-mono hover:underline font-semibold"
                    >
                      <span>View on GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : null}
                </div>

                {!isMerged ? (
                  <button
                    type="button"
                    onClick={handleMerge}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#0F172A] hover:bg-black text-white font-bold text-xs font-tech uppercase tracking-wider transition-all hover:scale-105 shadow-md cursor-pointer"
                  >
                    <GitMerge className="w-4 h-4" />
                    <span>Accept & Merge PR</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold font-mono text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <span>Merged into {pr.baseBranch}</span>
                  </div>
                )}
              </div>
            ) : isFailed ? (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center text-xs text-rose-700 font-tech flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                <span>Workflow stopped due to an error.</span>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-tech">
                Submit a task to generate an automated PR.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernistStudio;
