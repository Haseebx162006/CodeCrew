import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Github, GitBranch, Link, Star, Lock, Globe, Check, ChevronDown, RefreshCw } from 'lucide-react';

export const RepoConnectCard: React.FC = () => {
  const {
    repositories,
    selectedRepo,
    customRepoUrl,
    selectedBranch,
    setSelectedRepo,
    setCustomRepoUrl,
    setSelectedBranch,
    addNotification,
  } = useAppStore();

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomRepoUrl(val);
  };

  const handleVerifyRepo = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      addNotification({
        title: 'Repository Validated',
        message: `Successfully connected and fetched remote branch tree.`,
        type: 'success',
      });
    }, 800);
  };

  return (
    <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 shadow-xs transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
            <Github className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              1. Connect GitHub Repository
            </h3>
            <p className="text-xs text-stone-500">
              Select or paste any public/private repository to dispatch tasks
            </p>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-1 bg-[#F4F0E8] p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setIsCustomMode(false)}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              !isCustomMode ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Connected Repos
          </button>
          <button
            type="button"
            onClick={() => setIsCustomMode(true)}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              isCustomMode ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Custom Git URL
          </button>
        </div>
      </div>

      {!isCustomMode ? (
        /* Connected Repos Selection Grid */
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {repositories.map((repo) => {
              const isSelected = selectedRepo?.id === repo.id;
              return (
                <button
                  key={repo.id}
                  type="button"
                  onClick={() => setSelectedRepo(repo)}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FBF8F5] border-[#CC785C] ring-1 ring-[#CC785C]'
                      : 'bg-white hover:bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-semibold text-stone-800 truncate font-mono">
                      {repo.fullName}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#CC785C] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-500 line-clamp-1 mb-2">
                    {repo.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-stone-400 font-mono mt-auto">
                    <span className="flex items-center gap-1">
                      {repo.isPrivate ? <Lock className="w-3 h-3 text-amber-600" /> : <Globe className="w-3 h-3 text-emerald-600" />}
                      {repo.language}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-stone-400" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1 text-[#CC785C]">
                      <GitBranch className="w-3 h-3" />
                      {repo.defaultBranch}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Branch Picker */}
          {selectedRepo && (
            <div className="pt-2 flex items-center gap-3 border-t border-stone-100">
              <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 shrink-0">
                <GitBranch className="w-3.5 h-3.5 text-[#CC785C]" />
                Target Branch:
              </span>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F0E8] hover:bg-[#EAE4DA] rounded-lg text-xs font-mono font-medium text-stone-800 border border-stone-200 cursor-pointer"
                >
                  <span>{selectedBranch}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {isBranchDropdownOpen && (
                  <div className="absolute top-full mt-1 left-0 z-30 w-44 bg-white border border-stone-200 rounded-xl shadow-lg py-1">
                    {selectedRepo.branches.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setSelectedBranch(b);
                          setIsBranchDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-stone-50 flex items-center justify-between ${
                          selectedBranch === b ? 'text-[#CC785C] font-semibold bg-[#FAF7F2]' : 'text-stone-700'
                        }`}
                      >
                        {b}
                        {selectedBranch === b && <Check className="w-3.5 h-3.5 text-[#CC785C]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[11px] text-stone-400 hidden sm:inline">
                Pull Request will be opened against branch <code className="text-stone-600 bg-stone-100 px-1 py-0.5 rounded">{selectedBranch}</code>
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Custom Git Repo URL Input */
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Git Repository URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1 rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Link className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={customRepoUrl}
                  onChange={handleCustomUrlChange}
                  placeholder="https://github.com/facebook/react"
                  className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-xl text-xs font-mono placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CC785C] focus:border-transparent"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyRepo}
                disabled={isVerifying || !customRepoUrl}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                {isVerifying ? 'Verifying...' : 'Validate Repo'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-[#CC785C]" />
              Target Branch:
            </span>
            <input
              type="text"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              placeholder="main"
              className="px-3 py-1 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono text-stone-800 w-32 focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoConnectCard;
