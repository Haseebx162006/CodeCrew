import React, { useState } from 'react';
import { FileDiff } from '../../types';
import { FileCode, Plus, Minus, FilePlus, FileEdit, Check, Copy } from 'lucide-react';

interface CodeDiffViewerProps {
  diffs: FileDiff[];
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({ diffs }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!diffs || diffs.length === 0) {
    return (
      <div className="p-8 text-center text-stone-400 text-xs bg-stone-50 rounded-xl border border-stone-200">
        No code diffs available.
      </div>
    );
  }

  const currentDiff = diffs[selectedFileIndex] || diffs[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDiff.diffHunk);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderDiffLine = (line: string, index: number) => {
    const isAddition = line.startsWith('+') && !line.startsWith('+++');
    const isDeletion = line.startsWith('-') && !line.startsWith('---');
    const isHeader = line.startsWith('@@');

    let bgClass = 'hover:bg-stone-800/40 text-stone-300';
    let lineIndicator = ' ';
    let textColor = 'text-stone-300';

    if (isAddition) {
      bgClass = 'bg-[#153424] text-emerald-300';
      lineIndicator = '+';
      textColor = 'text-emerald-300';
    } else if (isDeletion) {
      bgClass = 'bg-[#3b1919] text-rose-300';
      lineIndicator = '-';
      textColor = 'text-rose-300';
    } else if (isHeader) {
      bgClass = 'bg-[#22272e] text-[#C8963E] font-semibold';
      textColor = 'text-[#C8963E]';
    }

    return (
      <div
        key={index}
        className={`flex items-start font-mono text-[12px] leading-5 px-3 py-0.5 select-text ${bgClass}`}
      >
        <span className="w-8 shrink-0 text-stone-500 select-none text-right pr-3 font-mono text-[11px]">
          {index + 1}
        </span>
        <span className="w-4 shrink-0 select-none font-bold text-center opacity-70">
          {lineIndicator}
        </span>
        <span className={`flex-1 whitespace-pre-wrap break-all ${textColor}`}>
          {isAddition || isDeletion ? line.substring(1) : line}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* File Tabs Header */}
      <div className="flex items-center justify-between bg-stone-950 px-3 py-2 border-b border-stone-800 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-0">
          {diffs.map((diff, idx) => {
            const isSelected = idx === selectedFileIndex;
            return (
              <button
                key={diff.filename}
                type="button"
                onClick={() => setSelectedFileIndex(idx)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-800 text-stone-100 border border-stone-700 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                {diff.status === 'added' ? (
                  <FilePlus className="w-3.5 h-3.5 text-[#4D7C5E]" />
                ) : (
                  <FileEdit className="w-3.5 h-3.5 text-[#C8963E]" />
                )}
                <span className="truncate max-w-[160px]">{diff.filename.split('/').pop()}</span>
                <span className="text-[10px] font-sans text-emerald-400">+{diff.additions}</span>
                {diff.deletions > 0 && (
                  <span className="text-[10px] font-sans text-rose-400">-{diff.deletions}</span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-200 px-2 py-1 rounded bg-stone-900 hover:bg-stone-800 transition-colors ml-3 cursor-pointer shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#4D7C5E]" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Diff'}</span>
        </button>
      </div>

      {/* Current File Path Info */}
      <div className="bg-[#1a1917] px-4 py-2 border-b border-stone-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-stone-300 font-mono">
          <FileCode className="w-4 h-4 text-[#CC785C]" />
          <span>{currentDiff.filename}</span>
        </div>
        <div className="flex items-center gap-2 text-stone-400 text-[11px]">
          <span className="text-emerald-400 font-mono font-medium">+{currentDiff.additions} lines</span>
          <span className="text-rose-400 font-mono font-medium">-{currentDiff.deletions} lines</span>
        </div>
      </div>

      {/* Diff Content */}
      <div className="overflow-x-auto py-2 max-h-[420px] overflow-y-auto font-mono scrollbar-thin">
        {currentDiff.diffHunk.split('\n').map((line, idx) => renderDiffLine(line, idx))}
      </div>
    </div>
  );
};

export default CodeDiffViewer;
