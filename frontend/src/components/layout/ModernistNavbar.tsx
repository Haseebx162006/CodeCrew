import React from 'react';
import { ArrowUpRight, Github, User, LogOut, History, Sparkles, Layers } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

interface ModernistNavbarProps {
  onOpenWorkspace: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  activeView: 'landing' | 'workspace';
  setActiveView: (view: 'landing' | 'workspace') => void;
}

export const ModernistNavbar: React.FC<ModernistNavbarProps> = ({
  onOpenWorkspace,
  onOpenAuth,
  activeView,
  setActiveView,
}) => {
  const { user, isAuthenticated, logout, tasks, toggleDrawer } = useAppStore();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 select-none">
      <div className="bg-white rounded-full px-5 py-2.5 border-[1.5px] border-[#0F172A] shadow-xl flex items-center justify-between gap-4">
        {/* Left Brand */}
        <button
          type="button"
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2 cursor-pointer text-left"
        >
          <div className="w-5 h-5 rounded-full bg-[#0F172A] flex items-center justify-center text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <span className="font-display font-extrabold text-sm tracking-tight text-[#0F172A]">
            codecrew
          </span>
        </button>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-5 text-xs font-tech font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveView('landing')}
            className={`transition-colors cursor-pointer ${activeView === 'landing' ? 'text-[#0F172A] font-bold underline underline-offset-4' : 'hover:text-[#0F172A]'}`}
          >
            showcase
          </button>
          <button
            type="button"
            onClick={() => setActiveView('workspace')}
            className={`transition-colors cursor-pointer ${activeView === 'workspace' ? 'text-[#0F172A] font-bold underline underline-offset-4' : 'hover:text-[#0F172A]'}`}
          >
            studio workspace
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400 font-mono text-[11px]">
            {tasks.length} tasks recorded
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleDrawer}
                className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-tech transition-colors cursor-pointer"
              >
                <History className="w-3 h-3" />
                <span>history</span>
              </button>

              {activeView === 'landing' ? (
                <button
                  type="button"
                  onClick={() => setActiveView('workspace')}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-tech font-semibold transition-all hover:scale-105 shadow-xs cursor-pointer"
                >
                  <span>open studio</span>
                  <ArrowUpRight className="w-3 h-3 text-white" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveView('landing')}
                  className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:bg-slate-50 text-[#0F172A] text-xs font-tech transition-colors cursor-pointer"
                >
                  landing
                </button>
              )}

              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1 rounded-full text-[#0F172A] hover:opacity-70 text-xs font-tech font-semibold transition-opacity cursor-pointer"
              >
                sign in
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-tech font-semibold transition-all hover:scale-105 shadow-xs cursor-pointer"
              >
                <span>get started</span>
                <ArrowUpRight className="w-3 h-3 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ModernistNavbar;
