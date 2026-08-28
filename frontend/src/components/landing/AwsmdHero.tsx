import React from 'react';
import { motion } from 'framer-motion';
import { IsometricCubesCluster } from '../ui/IsometricCubesCluster';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface AwsmdHeroProps {
  onOpenWorkspace: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const AwsmdHero: React.FC<AwsmdHeroProps> = ({ onOpenWorkspace, onOpenAuth }) => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-12">
      {/* Outer Slate-Periwinkle Framing Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-3">
        {/* Top Labels outside frame (From reference) */}
        <div className="flex items-center justify-between text-xs font-mono tracking-wider text-slate-200 uppercase px-3 select-none">
          <span>landing page</span>
          <span>ai engineering system</span>
        </div>

        {/* Main Framed White Card with 1.5px Black Outline */}
        <div className="relative w-full bg-white rounded-[32px] border-[1.5px] border-[#0F172A] shadow-2xl p-6 sm:p-10 lg:p-14 overflow-hidden flex flex-col justify-between min-h-[640px]">
          {/* Inner Header Bar */}
          <div className="flex items-center justify-between z-10 select-none pb-4">
            <div className="flex items-center gap-4">
              {/* Minimal Hamburger lines */}
              <div className="flex flex-col gap-1 cursor-pointer hover:opacity-70 transition-opacity">
                <span className="w-5 h-[2px] bg-[#0F172A] rounded-full" />
                <span className="w-3.5 h-[2px] bg-[#0F172A] rounded-full" />
              </div>

              {/* Brand Logo with black circle dot */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#0F172A] flex items-center justify-center text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="font-display font-extrabold text-base tracking-tight text-[#0F172A]">
                  codecrew
                </span>
              </div>
            </div>

            {/* Top Right Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="text-xs font-tech font-semibold text-[#0F172A] hover:opacity-70 transition-opacity cursor-pointer hidden sm:inline"
              >
                sign in
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-1.5 rounded-full bg-[#0F172A] text-white text-xs font-tech font-medium hover:bg-black transition-all cursor-pointer shadow-xs"
              >
                get started
              </button>
            </div>
          </div>

          {/* Grid Layout: Left Content & Right Isometric Sculpture */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6 z-10">
            {/* Left Content (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 text-xs font-mono text-[#0F172A] font-medium tracking-tight"
              >
                <span>→ the autonomous engineering crew for your codebase</span>
              </motion.div>

              {/* Headline with Double-Pill Lens Badge (Exact Reference Style) */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#0F172A] leading-[1.08] tracking-tight"
              >
                <span>Keep your</span>
                <br />
                <span className="inline-flex items-center my-1">
                  <span className="pill-outline-lens py-0.5 px-3.5 mx-1 text-[#0F172A]">
                    code
                  </span>
                </span>
                <span>autonomous.</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xs sm:text-sm text-slate-500 font-tech leading-relaxed max-w-md"
              >
                Turn engineering prompts into tested, production-ready GitHub Pull Requests. CodeCrew ingests your AST, writes type-safe diffs, runs test suites, and opens verified PRs in minutes.
              </motion.p>

              {/* Pill Action Buttons (Exact Reference Styling) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5 pt-2"
              >
                {/* Black Oblong Pill Button */}
                <button
                  type="button"
                  onClick={onOpenWorkspace}
                  className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-tech font-semibold uppercase tracking-wider transition-all duration-200 hover:scale-105 shadow-md cursor-pointer"
                >
                  <span>launch crew</span>
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowUpRight className="w-3 h-3 text-white" />
                  </div>
                </button>

                {/* Fine Outline Pill Button */}
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="px-6 py-2.5 rounded-full border-[1.5px] border-[#0F172A] hover:bg-slate-50 text-[#0F172A] text-xs font-tech font-medium transition-all duration-200 cursor-pointer"
                >
                  try for free
                </button>
              </motion.div>
            </div>

            {/* Right Column: Isometric 3D Cubic Cluster (6 cols) */}
            <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
              <IsometricCubesCluster />
            </div>
          </div>

          {/* Bottom Labels inside card (From reference) */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 select-none pt-4 border-t border-slate-100">
            <span>autonomous engineering platform</span>
            <span>codecrew studio</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwsmdHero;
