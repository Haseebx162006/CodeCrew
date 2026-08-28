import React from 'react';
import { motion } from 'framer-motion';
import { IsometricCubesCluster } from '../ui/IsometricCubesCluster';
import { ArrowUpRight, Terminal, Cpu, Zap, CheckCircle2, Shield, Code2, Database } from 'lucide-react';

interface AwsmdHeroProps {
  onOpenWorkspace: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

const SAMPLE_PROMPTS = [
  { label: 'Stripe Webhooks with HMAC', icon: Code2 },
  { label: 'PostgreSQL pgvector Search', icon: Database },
  { label: 'JWT Refresh Token Rotation', icon: Shield },
  { label: 'Next.js 15 Auth Modal', icon: Terminal },
];

export const AwsmdHero: React.FC<AwsmdHeroProps> = ({ onOpenWorkspace, onOpenAuth }) => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-12">
      {/* Outer Slate-Periwinkle Framing Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-3">
        {/* Top Labels outside frame */}
        <div className="flex items-center justify-between text-xs font-mono tracking-wider text-slate-200 uppercase px-3 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI SOFTWARE HOUSE COLLECTIVE</span>
          </div>
          <span>LANGGRAPH · NEON POSTGRES · GROQ</span>
        </div>

        {/* Main Framed White Card with 1.5px Black Outline */}
        <div className="relative w-full bg-white rounded-[32px] border-[1.5px] border-[#0F172A] shadow-2xl p-6 sm:p-10 lg:p-14 overflow-hidden flex flex-col justify-between min-h-[660px]">
          {/* Inner Header Bar */}
          <div className="flex items-center justify-between z-10 select-none pb-4">
            <div className="flex items-center gap-4">
              {/* Brand Logo with circle dot */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#0F172A] flex items-center justify-center text-white shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="font-display font-extrabold text-lg tracking-tight text-[#0F172A]">
                  CodeCrew
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-mono font-bold">
                  v2.0
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
                Sign In
              </button>
              <button
                type="button"
                onClick={onOpenWorkspace}
                className="px-4 py-1.5 rounded-full bg-[#0F172A] text-white text-xs font-tech font-bold uppercase tracking-wider hover:bg-black transition-all cursor-pointer shadow-xs"
              >
                Open Studio
              </button>
            </div>
          </div>

          {/* Grid Layout: Left Content & Right Isometric Sculpture */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6 z-10">
            {/* Left Content (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Live Pill Status */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-[#0F172A] font-semibold tracking-tight"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>5 Autonomous Superhero Agents Ready for Your Repo</span>
              </motion.div>

              {/* Headline with Double-Pill Lens Badge */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#0F172A] leading-[1.06] tracking-tight"
              >
                <span>Deploy your</span>
                <br />
                <span className="inline-flex items-center my-1">
                  <span className="pill-outline-lens py-0.5 px-3.5 mx-1 text-[#0F172A]">
                    AI crew
                  </span>
                </span>
                <span>to main.</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xs sm:text-sm text-slate-600 font-tech leading-relaxed max-w-md"
              >
                An autonomous collective of specialized superhero agents. Powered by Iron Man (Backend), Spider-Man (Frontend), Hulk (Database), Captain America (Testing), and Wonder Woman (Documentation) to ship verified Pull Requests in seconds.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5 pt-1"
              >
                {/* Black Oblong Pill Button */}
                <button
                  type="button"
                  onClick={onOpenWorkspace}
                  className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-tech font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 shadow-md cursor-pointer"
                >
                  <span>Launch Agent Studio</span>
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowUpRight className="w-3 h-3 text-white" />
                  </div>
                </button>

                {/* Fine Outline Pill Button */}
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="px-6 py-2.5 rounded-full border-[1.5px] border-[#0F172A] hover:bg-slate-50 text-[#0F172A] text-xs font-tech font-semibold transition-all duration-200 cursor-pointer"
                >
                  Connect GitHub App
                </button>
              </motion.div>

              {/* Quick Sample Prompts */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-2 pt-2"
              >
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                  Quick Engineering Prompts:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PROMPTS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={onOpenWorkspace}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-slate-200 hover:border-[#0F172A] hover:bg-white text-[11px] font-tech text-slate-700 transition-all cursor-pointer shadow-2xs"
                      >
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Isometric 3D Cubic Cluster (6 cols) */}
            <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
              <IsometricCubesCluster />
            </div>
          </div>

          {/* Bottom Labels inside card */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 select-none pt-4 border-t border-slate-100 gap-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              LangGraph State Graph Checkpointed in PostgreSQL
            </span>
            <span>Zero Data Retention · Air-Gapped Sandboxing</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwsmdHero;
