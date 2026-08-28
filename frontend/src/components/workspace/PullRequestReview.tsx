import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { CodeDiffViewer } from '../ui/CodeDiffViewer';
import { GitPullRequest, GitMerge, CheckCircle2, ExternalLink, Sparkles, MessageSquare, ArrowRight, ShieldCheck, Check, GitCommit } from 'lucide-react';

export const PullRequestReview: React.FC = () => {
  const { tasks, activeTaskId, mergePullRequest } = useAppStore();

  const activeTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];
  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  if (!activeTask || !activeTask.pullRequest) return null;

  const pr = activeTask.pullRequest;
  const isMerged = pr.status === 'merged';

  const handleMerge = () => {
    mergePullRequest(activeTask.id);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setFeedback('');
    }, 1000);
  };

  return (
    <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 shadow-xs flex flex-col gap-6">
      {/* PR Header Card */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-stone-100">
        <div className="space-y-2 flex-1 min-w-[280px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              <GitPullRequest className="w-3.5 h-3.5 text-[#4D7C5E]" />
              {isMerged ? 'Merged PR #' + pr.number : 'Open PR #' + pr.number}
            </span>

            <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
              {pr.branch} → {pr.baseBranch}
            </span>

            <span className="text-xs text-stone-400 font-mono">
              Created {pr.createdAt}
            </span>
          </div>

          <h2 className="text-lg font-bold text-stone-900 font-serif">
            {pr.title}
          </h2>

          <div className="flex items-center gap-2 text-xs text-stone-600">
            <span className="font-mono font-medium text-stone-900 flex items-center gap-1">
              <GitCommit className="w-3.5 h-3.5 text-[#CC785C]" />
              {pr.author}
            </span>
            <span>wants to merge {pr.filesChanged} commits into <code className="text-stone-800 font-mono">{pr.baseBranch}</code></span>
          </div>
        </div>

        {/* Merge PR Action Button */}
        <div className="flex items-center gap-3">
          {pr.githubPrUrl ? (
            <a
              href={pr.githubPrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-all shadow-xs"
            >
              <span>View on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>
          ) : null}

          {!isMerged ? (
            <button
              type="button"
              onClick={handleMerge}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#4D7C5E] hover:bg-[#3f674d] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              <GitMerge className="w-4 h-4" />
              Accept & Merge Pull Request
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              Merged at {pr.mergedAt}
            </div>
          )}
        </div>
      </div>

      {/* CI/CD Status & Diff Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-800">Automated CI Checks</p>
            <p className="text-[11px] text-[#4D7C5E] font-medium">All 14 tests passing (100%)</p>
          </div>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
            <GitPullRequest className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-800">Files Changed</p>
            <p className="text-[11px] text-stone-500 font-mono">
              <span className="text-emerald-600 font-bold">+{pr.additions}</span> / <span className="text-rose-600 font-bold">-{pr.deletions}</span> in {pr.filesChanged} files
            </p>
          </div>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-800">AI Code Quality</p>
            <p className="text-[11px] text-stone-500 font-medium">0 lint issues · Strict typing</p>
          </div>
        </div>
      </div>

      {/* PR Markdown Description */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E2D8] text-xs text-stone-700 space-y-2 leading-relaxed">
        <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
          Pull Request Description
        </h4>
        <div className="whitespace-pre-line font-sans text-stone-600">
          {pr.description}
        </div>
      </div>

      {/* Code Diff Viewer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            Source Code Changes & Diff Comparison
          </h4>
          <span className="text-xs text-stone-400 font-mono">
            {pr.diffs.length} files modified
          </span>
        </div>

        <CodeDiffViewer diffs={pr.diffs} />
      </div>

      {/* Iterate & Request Changes Box */}
      {!isMerged && (
        <form onSubmit={handleFeedbackSubmit} className="pt-2 border-t border-stone-100 space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
            Request AI Changes / Further Refinement
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. 'Also add rate limiting to the token refresh endpoint (max 10 req/min)'"
              className="flex-1 px-3.5 py-2 border border-stone-300 rounded-xl text-xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CC785C]"
            />
            <button
              type="submit"
              disabled={isSubmittingFeedback || !feedback.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isSubmittingFeedback ? 'Iterating...' : 'Request Iteration'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PullRequestReview;
