import React from 'react';
import { Sparkles, Github, ArrowRight, User, LogOut, Layers, History, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

interface ModernNavbarProps {
  onOpenWorkspace: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  activeView: 'landing' | 'workspace';
  setActiveView: (view: 'landing' | 'workspace') => void;
}

export const ModernNavbar: React.FC<ModernNavbarProps> = ({
  onOpenWorkspace,
  onOpenAuth,
  activeView,
  setActiveView,
}) => {
  const { user, isAuthenticated, logout, tasks, toggleDrawer } = useAppStore();

  const completedTasks = tasks.filter((t) => t.status === 'completed' || t.status === 'merged');
  const runningTasks = tasks.filter((t) => t.status === 'running');

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-6xl px-4 select-none">
      <div className="glass-card rounded-2xl px-4 sm:px-6 py-3 border border-white/10 shadow-2xl backdrop-blur-2xl flex items-center justify-between gap-4">
        {/* Left Branding */}
        <button
          type="button"
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E5A967] to-[#D4883A] text-stone-950 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(229,169,103,0.3)]">
            <Sparkles className="w-4 h-4 fill-stone-950" />
          </div>
          <div>
            <span className="font-display font-bold text-base text-white tracking-tight">
              DevPulse
            </span>
            <span className="text-[10px] font-mono text-[#E5A967] uppercase tracking-wider block leading-none">
              AI STUDIO
            </span>
          </div>
        </button>

        {/* Center Navigation Links (when on landing) */}
        <div className="hidden md:flex items-center gap-6 text-xs font-tech text-stone-400">
          <button
            type="button"
            onClick={() => setActiveView('landing')}
            className={`transition-colors cursor-pointer ${activeView === 'landing' ? 'text-white font-medium' : 'hover:text-stone-200'}`}
          >
            Showcase
          </button>
          <button
            type="button"
            onClick={() => setActiveView('workspace')}
            className={`transition-colors cursor-pointer ${activeView === 'workspace' ? 'text-[#E5A967] font-semibold' : 'hover:text-stone-200'}`}
          >
            Workspace
          </button>
          <span className="text-stone-700">|</span>
          <div className="flex items-center gap-2">
            {runningTasks.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono animate-pulse">
                ● {runningTasks.length} Active Task
              </span>
            )}
            <span className="text-stone-400 text-[11px] font-mono">
              {completedTasks.length} PRs Shipped
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* History Button */}
              <button
                type="button"
                onClick={toggleDrawer}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 text-xs font-tech transition-colors cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-[#E5A967]" />
                <span>History ({tasks.length})</span>
              </button>

              {/* View Workspace Toggle */}
              {activeView === 'landing' ? (
                <button
                  type="button"
                  onClick={() => setActiveView('workspace')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5A967] to-[#D4883A] text-stone-950 text-xs font-bold font-tech transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(229,169,103,0.3)] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                  <span>Open Studio</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveView('landing')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-card text-stone-300 hover:text-white text-xs font-tech transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-stone-400" />
                  <span>Landing</span>
                </button>
              )}

              {/* User Profile Avatar */}
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <div className="w-7 h-7 rounded-full bg-stone-800 border border-white/15 overflow-hidden flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-stone-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign Out"
                  className="p-1 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 rounded-xl text-stone-300 hover:text-white text-xs font-tech transition-colors cursor-pointer"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5A967] to-[#D4883A] text-stone-950 text-xs font-bold font-tech transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(229,169,103,0.3)] cursor-pointer"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Start Free</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
