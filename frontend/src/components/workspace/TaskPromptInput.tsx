import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { TASK_PRESETS } from '../../data/mockRepos';
import { TaskCategory } from '../../types';
import { Sparkles, Terminal, ArrowRight, Lightbulb, Zap, Shield, Bug, SlidersHorizontal, BookOpen, Check } from 'lucide-react';

const CATEGORIES: { value: TaskCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { value: 'feature', label: 'Feature', icon: Zap },
  { value: 'bugfix', label: 'Bug Fix', icon: Bug },
  { value: 'refactor', label: 'Refactor', icon: SlidersHorizontal },
  { value: 'security', label: 'Security', icon: Shield },
  { value: 'performance', label: 'Performance', icon: Zap },
  { value: 'docs', label: 'Documentation', icon: BookOpen },
];

export const TaskPromptInput: React.FC = () => {
  const { submitTask, isExecuting, selectedRepo } = useAppStore();

  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<TaskCategory>('feature');
  const [runTests, setRunTests] = useState(true);
  const [generatePR, setGeneratePR] = useState(true);

  const handleApplyPreset = (preset: typeof TASK_PRESETS[0]) => {
    setTitle(preset.title);
    setPrompt(preset.prompt);
    setCategory(preset.category);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isExecuting) return;

    const taskTitle = title.trim() || prompt.trim().split('\n')[0].slice(0, 60);
    await submitTask({
      title: taskTitle,
      prompt: prompt.trim(),
      category,
    });
  };

  return (
    <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 shadow-xs transition-all">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#CC785C] text-white flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              2. Describe the Task for AI Agent
            </h3>
            <p className="text-xs text-stone-500">
              Specify what needs to be implemented, fixed, refactored, or optimized
            </p>
          </div>
        </div>

        {/* Quick Presets Dropdown / Button */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-stone-400 font-medium hidden sm:inline">
            Quick Examples:
          </span>
          <div className="flex flex-wrap gap-1">
            {TASK_PRESETS.slice(0, 2).map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F4F0E8] hover:bg-[#EAE4DA] text-stone-700 font-medium transition-colors cursor-pointer"
              >
                {p.category === 'security' ? 'JWT Rotation' : 'Stripe Webhook'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-stone-500 font-medium mr-1">Category:</span>
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.value;
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#CC785C] text-white shadow-xs'
                    : 'bg-[#F4F0E8] text-stone-600 hover:bg-[#EAE4DA]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Task Title */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title (e.g. Implement JWT refresh token rotation with Redis blacklisting)"
            className="block w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs font-medium placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CC785C] focus:border-transparent"
          />
        </div>

        {/* Task Detailed Prompt */}
        <div className="relative">
          <textarea
            rows={4}
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the exact requirements, files to modify, edge cases to consider, and testing criteria...&#10;e.g. 'Add RFC-6749 compliant JWT refresh token rotation in src/auth/jwt.service.ts with Redis blacklisting upon logout. Include unit test specs and verify coverage.'"
            className="block w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-mono leading-relaxed placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CC785C] focus:border-transparent resize-y"
          />
        </div>

        {/* Options & Dispatch Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={runTests}
                onChange={(e) => setRunTests(e.target.checked)}
                className="w-3.5 h-3.5 text-[#CC785C] rounded border-stone-300 focus:ring-[#CC785C]"
              />
              <span>Run Automated Unit Tests</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={generatePR}
                onChange={(e) => setGeneratePR(e.target.checked)}
                className="w-3.5 h-3.5 text-[#CC785C] rounded border-stone-300 focus:ring-[#CC785C]"
              />
              <span>Generate GitHub Pull Request</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isExecuting || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#CC785C] hover:bg-[#B8654A] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {isExecuting ? 'Agent Implementing Task...' : 'Dispatch AI Agent'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskPromptInput;
