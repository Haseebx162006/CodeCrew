import React from 'react';
import { useAppStore } from '../../store/appStore';
import { X, GitPullRequest, CheckCircle2, Clock, Loader2, ArrowRight, GitMerge, ChevronRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TaskHistoryDrawer: React.FC = () => {
  const { tasks, activeTaskId, isDrawerOpen, toggleDrawer, setActiveTaskId, deleteTaskRecord } = useAppStore();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleDrawer}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Task History & PRs</h3>
                <p className="text-xs text-stone-500">{tasks.length} total tasks executed</p>
              </div>
              <button
                type="button"
                onClick={toggleDrawer}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  No tasks executed yet. Submit your first prompt to see PRs here.
                </div>
              ) : (
                tasks.map((task) => {
                  const isSelected = task.id === activeTaskId;
                  const isMerged = task.status === 'merged';
                  const isRunning = task.status === 'running';
                  const isCompleted = task.status === 'completed';

                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        setActiveTaskId(task.id);
                        toggleDrawer();
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 relative group ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-[#CC785C] ring-1 ring-[#CC785C]'
                          : 'bg-white hover:bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-stone-400">
                          {task.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isMerged && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                              <GitMerge className="w-3 h-3" /> Merged
                            </span>
                          )}
                          {isCompleted && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <GitPullRequest className="w-3 h-3" /> PR #{task.pullRequest?.number}
                            </span>
                          )}
                          {isRunning && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                              <Loader2 className="w-3 h-3 animate-spin" /> Running
                            </span>
                          )}

                          <button
                            type="button"
                            title="Delete task"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTaskRecord(task.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-semibold text-stone-800 line-clamp-2 leading-snug">
                        {task.title}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono pt-1 border-t border-stone-100">
                        <span className="truncate max-w-[200px]">{task.repo.name}</span>
                        <span>{task.createdAt}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskHistoryDrawer;
