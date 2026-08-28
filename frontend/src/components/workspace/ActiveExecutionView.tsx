import React, { useRef, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { Sparkles, Terminal, CheckCircle2, Circle, Loader2, GitBranch, Cpu, Code2, ShieldAlert, Check, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ActiveExecutionView: React.FC = () => {
  const { tasks, activeTaskId } = useAppStore();
  const logsEndRef = useRef<HTMLDivElement>(null);

  const activeTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTask?.logs]);

  if (!activeTask) return null;

  const isRunning = activeTask.status === 'running';

  return (
    <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#CC785C]/15 text-[#CC785C]">
              {isRunning ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CC785C] animate-ping" />
                  Live Execution in Progress
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 text-[#4D7C5E]" />
                  Execution Complete
                </>
              )}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Branch: <code className="text-stone-700 bg-stone-100 px-1 py-0.5 rounded">{activeTask.targetBranch}</code>
            </span>
          </div>

          <h3 className="text-base font-semibold text-stone-900 font-serif">
            {activeTask.title}
          </h3>
          <p className="text-xs text-stone-500 font-mono mt-0.5 line-clamp-1">
            Repo: {activeTask.repo.fullName}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-stone-400 font-mono">Started: {activeTask.createdAt}</span>
          {activeTask.completedAt && (
            <p className="text-[11px] text-[#4D7C5E] font-mono font-medium">
              Finished: {activeTask.completedAt}
            </p>
          )}
        </div>
      </div>

      {/* Interactive Sequence of Stages (Progress Bar + Step Indicators) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#CC785C]" />
            Agent Workflow Pipeline
          </span>
          <span className="text-xs font-mono text-stone-500 font-medium">
            Stage {Math.min(activeTask.stages.length, activeTask.currentStageIndex + 1)} of {activeTask.stages.length}
          </span>
        </div>

        {/* Stages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {activeTask.stages.map((stage, idx) => {
            const isDone = stage.status === 'completed';
            const isCurrent = stage.status === 'in_progress';
            const isPending = stage.status === 'pending';
            const heroMap = [
              { hero: 'Hulk', role: 'Database Titan', img: '/heroes/hulk.png' },
              { hero: 'Wonder Woman', role: 'Docs Architect', img: '/heroes/wonderwoman.png' },
              { hero: 'Iron Man', role: 'Backend Slinger', img: '/heroes/ironman.png' },
              { hero: 'Spider-Man', role: 'UI Visionary', img: '/heroes/spiderman.png' },
              { hero: 'Captain America', role: 'QA Guardian', img: '/heroes/captainamerica.png' },
            ];
            const heroInfo = heroMap[idx] || heroMap[0];

            return (
              <div
                key={stage.id}
                className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isDone
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : isCurrent
                    ? 'bg-[#FAF7F2] border-[#CC785C] ring-1 ring-[#CC785C] shadow-xs'
                    : 'bg-stone-50/70 border-stone-200 text-stone-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <img 
                        src={heroInfo.img} 
                        alt={heroInfo.hero} 
                        className="w-5 h-5 rounded-full object-cover border border-stone-300 bg-white shadow-xs" 
                      />
                      <span className="text-[10px] font-mono font-semibold uppercase">
                        {heroInfo.hero}
                      </span>
                    </div>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#4D7C5E]" />}
                    {isCurrent && <Loader2 className="w-3.5 h-3.5 text-[#CC785C] animate-spin" />}
                    {isPending && <Circle className="w-3 h-3 text-stone-300" />}
                  </div>
                  <h4 className={`text-xs font-semibold leading-tight line-clamp-2 ${isCurrent ? 'text-[#CC785C]' : isDone ? 'text-stone-800' : 'text-stone-400'}`}>
                    {stage.name}
                  </h4>
                </div>

                {/* Micro Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-stone-200/60 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isDone ? 'bg-[#4D7C5E]' : isCurrent ? 'bg-[#CC785C]' : 'bg-transparent'
                      }`}
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Terminal & Log Stream */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-stone-600" />
            Agent Live Output & Telemetry
          </span>
          <span className="text-[11px] text-stone-400 font-mono">
            {activeTask.logs.length} events logged
          </span>
        </div>

        <div className="bg-stone-950 text-stone-300 font-mono text-xs rounded-xl p-4 h-64 overflow-y-auto border border-stone-800 shadow-inner scrollbar-thin flex flex-col gap-1.5">
          {activeTask.logs.map((log) => {
            const isSuccess = log.type === 'success';
            const isCode = log.type === 'code';
            const isError = log.type === 'error';

            return (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                <span className="text-stone-600 select-none shrink-0 text-[10px] mt-0.5">
                  [{log.timestamp}]
                </span>
                <span className="text-[#C8963E] select-none shrink-0 text-[10px] uppercase font-bold">
                  [{log.stage}]
                </span>
                <span
                  className={`flex-1 break-all ${
                    isSuccess
                      ? 'text-emerald-400 font-medium'
                      : isCode
                      ? 'text-sky-300'
                      : isError
                      ? 'text-rose-400'
                      : 'text-stone-300'
                  }`}
                >
                  {log.message}
                </span>
              </div>
            );
          })}
          {isRunning && (
            <div className="flex items-center gap-2 text-stone-500 animate-pulse pt-1">
              <Loader2 className="w-3 h-3 animate-spin text-[#CC785C]" />
              <span className="text-[11px]">Processing AST nodes and generating diffs...</span>
            </div>
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ActiveExecutionView;
