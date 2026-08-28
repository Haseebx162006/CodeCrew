import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Github, Sparkles, LogOut, GitPullRequest, History, CheckCircle2, User, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, tasks, toggleDrawer, isDrawerOpen } = useAppStore();

  const completedTasks = tasks.filter((t) => t.status === 'completed' || t.status === 'merged');
  const runningTasks = tasks.filter((t) => t.status === 'running');

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E2D8] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#CC785C] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-bold tracking-tight text-stone-900">
                DevPulse AI
              </span>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#CC785C]/15 text-[#CC785C]">
                Agent Platform
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              Autonomous AI Engineering & PR Generator
            </p>
          </div>
        </div>

        {/* Center Live Counters */}
        <div className="hidden md:flex items-center gap-2">
          {runningTasks.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {runningTasks.length} Task Running
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F0E8] border border-[#E8E2D8] text-stone-700 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4D7C5E]" />
            <span>{completedTasks.length} PRs Generated</span>
          </div>
        </div>

        {/* Right User & Actions */}
        <div className="flex items-center gap-3">
          {/* History Drawer Trigger */}
          <button
            type="button"
            onClick={toggleDrawer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              isDrawerOpen
                ? 'bg-[#CC785C] text-white border-[#CC785C]'
                : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 shadow-xs'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Task History ({tasks.length})</span>
          </button>

          {/* Connected GitHub status */}
          {user?.githubConnected ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium">
              <Github className="w-3.5 h-3.5 text-stone-200" />
              <span>@{user.githubUsername || 'connected'}</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-600 text-xs">
              <Github className="w-3.5 h-3.5 text-stone-400" />
              <span>No GitHub</span>
            </div>
          )}

          {/* User Avatar & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E8E2D8] overflow-hidden border border-stone-300 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-stone-600" />
                )}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-medium text-stone-800 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-stone-400 leading-tight">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
