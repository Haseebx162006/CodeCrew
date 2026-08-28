import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Shield, 
  Zap, 
  Database, 
  FileText, 
  Cpu, 
  Check, 
  Volume2, 
  VolumeX, 
  X,
  Layers,
  CheckCircle2
} from 'lucide-react';

export interface SuperheroAgent {
  id: string;
  heroName: string;
  agentRole: string;
  alias: string;
  image: string;
  tagline: string;
  quote: string;
  themeColor: string;
  badgeIcon: React.ReactNode;
  powers: string[];
  stats: {
    label: string;
    value: number;
  }[];
}

const SUPERHERO_AGENTS: SuperheroAgent[] = [
  {
    id: 'backend',
    heroName: 'Iron Man',
    agentRole: 'Backend Agent & API Architect',
    alias: 'The Arc Reactor Server Engine',
    image: '/heroes/ironman.png',
    tagline: 'Powered by High-Throughput Async Architecture',
    quote: 'JARVIS, spin up the backend microservices and optimize the API routing pipelines.',
    themeColor: '#D97706',
    badgeIcon: <Cpu className="w-4 h-4 text-amber-600" />,
    powers: [
      'High-Throughput FastAPI & Python Endpoints',
      'Async Middleware & Connection Mesh',
      'Microsecond Latency & Cache Invalidation',
      'Fault-Tolerant Enterprise Business Logic'
    ],
    stats: [
      { label: 'Server Throughput', value: 99 },
      { label: 'Architecture Logic', value: 98 },
      { label: 'API Security', value: 96 },
      { label: 'Compute Power', value: 97 },
    ],
  },
  {
    id: 'frontend',
    heroName: 'Spider-Man',
    agentRole: 'Frontend Agent & UI/UX Visionary',
    alias: 'The Web-Slinger of Modern UI',
    image: '/heroes/spiderman.png',
    tagline: 'Weaving Responsive Interfaces & Fluid Motion',
    quote: 'I weave seamless UI components and reactive user interfaces before you can say Peter Parker.',
    themeColor: '#DC2626',
    badgeIcon: <Zap className="w-4 h-4 text-red-600" />,
    powers: [
      'Futuristic React & TypeScript Interfaces',
      'Fluid Motion & Kinetic Component Systems',
      'Pixel-Perfect Responsive Layouts',
      'Zero-Latency Reactive State Management'
    ],
    stats: [
      { label: 'UI Agility', value: 99 },
      { label: 'Design Precision', value: 97 },
      { label: 'Render Speed', value: 98 },
      { label: 'User Experience', value: 96 },
    ],
  },
  {
    id: 'testing',
    heroName: 'Captain America',
    agentRole: 'Testing & QA Guardian',
    alias: 'The Vibranium Test Shield',
    image: '/heroes/captainamerica.png',
    tagline: 'I Can Test Code All Day',
    quote: 'No bug gets past this Vibranium shield. If it is not rigorously verified, it does not ship.',
    themeColor: '#2563EB',
    badgeIcon: <Shield className="w-4 h-4 text-blue-600" />,
    powers: [
      'Bulletproof Unit & Integration Test Suites',
      'Zero-Regression Guard & Edge-Case Traps',
      'Automated CI/CD Pipeline Verification',
      'Real-Time Test Coverage & Audit Logs'
    ],
    stats: [
      { label: 'Test Shield', value: 99 },
      { label: 'Bug Elimination', value: 98 },
      { label: 'Code Stability', value: 99 },
      { label: 'Security Guard', value: 94 },
    ],
  },
  {
    id: 'docs',
    heroName: 'Wonder Woman',
    agentRole: 'Documentation & Architecture Agent',
    alias: 'The Lasso of Truth & Code Clarity',
    image: '/heroes/wonderwoman.png',
    tagline: 'Wielding the Lasso of Truth & Architectural Precision',
    quote: 'Code without clear documentation is chaos. I bring truth, clarity, and precision to your entire repository.',
    themeColor: '#DB2777',
    badgeIcon: <FileText className="w-4 h-4 text-pink-600" />,
    powers: [
      'Lasso of Truth OpenAPI Specs',
      'Living Architecture Blueprints & Schemas',
      'Comprehensive Developer Guides & SDK Docs',
      'Rich, Context-Aware Pull Request Summaries'
    ],
    stats: [
      { label: 'Clarity & Truth', value: 99 },
      { label: 'API Specs', value: 97 },
      { label: 'Architecture Docs', value: 96 },
      { label: 'Developer Love', value: 98 },
    ],
  },
  {
    id: 'database',
    heroName: 'The Incredible Hulk',
    agentRole: 'Database & Schema Titan',
    alias: 'The Gamma Schema Powerhouse',
    image: '/heroes/hulk.png',
    tagline: 'HULK SMASH HIGH-LATENCY QUERIES!',
    quote: 'Hulk crush slow database queries! Complex migrations and heavy relational tables are light work for Hulk!',
    themeColor: '#059669',
    badgeIcon: <Database className="w-4 h-4 text-emerald-600" />,
    powers: [
      'Massive SQL Migrations & Relational Schemas',
      'High-Throughput PostgreSQL & Neon Tuning',
      'Optimized Indexes & Query Execution Plans',
      'ACID Resilience & Schema Integrity'
    ],
    stats: [
      { label: 'Data Muscle', value: 100 },
      { label: 'Schema Power', value: 99 },
      { label: 'Query Crushing', value: 98 },
      { label: 'Data Durability', value: 97 },
    ],
  },
];

// Web Audio synthesizer for smooth subtle SFX
const playSlideSound = (isMuted: boolean) => {
  if (isMuted || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.16);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  } catch (e) {
    // Ignore audio restrictions
  }
};

interface SuperheroAgentsShowcaseProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const SuperheroAgentsShowcase: React.FC<SuperheroAgentsShowcaseProps> = ({
  isOpen,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isSquadView, setIsSquadView] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentHero = SUPERHERO_AGENTS[currentIndex];

  const paginate = useCallback((newDirection: number) => {
    if (newDirection > 0) {
      if (currentIndex < SUPERHERO_AGENTS.length - 1) {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
        playSlideSound(isMuted);
      } else {
        setIsSquadView(true);
      }
    } else {
      if (isSquadView) {
        setIsSquadView(false);
        setCurrentIndex(SUPERHERO_AGENTS.length - 1);
        setDirection(-1);
      } else if (currentIndex > 0) {
        setDirection(-1);
        setCurrentIndex((prev) => prev - 1);
        playSlideSound(isMuted);
      }
    }
  }, [currentIndex, isSquadView, isMuted]);

  // Horizontal scroll wheel listener
  useEffect(() => {
    if (!isOpen) return;

    let isThrottled = false;
    const handleWheel = (e: WheelEvent) => {
      if (isThrottled) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 25) {
        isThrottled = true;
        if (delta > 0) {
          paginate(1);
        } else {
          paginate(-1);
        }
        setTimeout(() => {
          isThrottled = false;
        }, 500);
      }
    };

    const node = containerRef.current;
    if (node) {
      node.addEventListener('wheel', handleWheel, { passive: true });
    }

    return () => {
      if (node) {
        node.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isOpen, paginate]);

  // Keyboard arrow listeners
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        paginate(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        paginate(-1);
      } else if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, paginate, onComplete]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        paginate(1);
      } else {
        paginate(-1);
      }
    }
    touchStartX.current = null;
  };

  if (!isOpen) return null;

  // Slide Animation Variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 160 : -160,
      opacity: 0,
      scale: 0.97,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -160 : 160,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const imageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 240,
        damping: 24,
        delay: 0.05,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.92,
      transition: { duration: 0.18 },
    }),
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0F172A]/70 backdrop-blur-md select-none overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Outer Slate Frame (Landing Page Reference Style) */}
      <div 
        ref={containerRef}
        className="w-full max-w-5xl mx-auto flex flex-col gap-2 my-auto"
      >
        {/* Top Labels outside the white card */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-slate-200 uppercase px-3 select-none">
          <span>superhero agent onboarding</span>
          <div className="flex items-center gap-3">
            <span>scroll or swipe to navigate →</span>
            <span>0{currentIndex + 1} / 05</span>
          </div>
        </div>

        {/* Main White Modernist Card - Responsive & Compact to fit all screens */}
        <div className="relative w-full bg-white rounded-[28px] sm:rounded-[32px] border-[1.5px] border-[#0F172A] shadow-2xl p-4 sm:p-6 lg:p-8 overflow-hidden flex flex-col justify-between max-h-[90vh] sm:max-h-[88vh] text-[#0F172A]">
          
          {/* Top Bar inside Card */}
          <div className="flex items-center justify-between z-10 pb-3 border-b border-slate-100 shrink-0">
            {/* Left: Brand Identity & Agent Counter */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#0F172A] flex items-center justify-center text-white font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-[#0F172A]">
                  codecrew
                </span>
                <span className="pill-outline-lens text-[10px] sm:text-[11px] py-0.5 px-2.5 text-[#0F172A] font-semibold">
                  {isSquadView ? 'Squad Assembled' : `Agent ${currentIndex + 1} of 5`}
                </span>
              </div>
            </div>

            {/* Right: Audio Toggle, Skip Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-[#0F172A] transition-colors cursor-pointer"
                title={isMuted ? 'Enable Sound FX' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#0F172A]" />}
              </button>

              <button
                type="button"
                onClick={onComplete}
                className="px-3.5 py-1 rounded-full bg-[#0F172A] text-white text-xs font-tech font-medium hover:bg-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>Skip to Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Dynamic Content Area: Single Hero Slide vs All Squad */}
          {!isSquadView ? (
            <div className="relative my-auto py-2 sm:py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center overflow-y-auto max-h-[calc(90vh-140px)] pr-1">
              
              {/* LEFT SIDE: Big 3D Model Character with Clean White Pedestal */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[240px] sm:min-h-[300px]">
                
                {/* Subtle Modernist Ambient Floor Shadow */}
                <div className="absolute bottom-4 w-40 sm:w-52 h-4 bg-[#0F172A]/10 rounded-full blur-md pointer-events-none" />

                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={currentHero.id}
                    custom={direction}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative flex flex-col items-center justify-center w-full"
                  >
                    {/* Big 3D Character Image (Transparent Cutout on Pure White Canvas) */}
                    <div className="relative flex items-center justify-center">
                      <motion.img
                        src={currentHero.image}
                        alt={currentHero.heroName}
                        animate={{
                          y: [0, -6, 0],
                        }}
                        transition={{
                          duration: 3.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="max-h-[220px] sm:max-h-[290px] lg:max-h-[330px] w-auto object-contain select-none pointer-events-none filter drop-shadow-[0_12px_20px_rgba(15,23,42,0.15)]"
                      />
                    </div>

                    {/* Character Tagline Pill under model */}
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-mono font-medium text-slate-700 shadow-2xs">
                      {currentHero.badgeIcon}
                      <span className="font-bold text-[#0F172A]">{currentHero.heroName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{currentHero.alias}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* RIGHT SIDE: Clean Modernist Typography, Capabilities, & Radar */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={currentHero.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-3"
                  >
                    {/* Eyebrow / Agent Role */}
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 font-medium">
                      <span>→ autonomous agent #{currentIndex + 1}</span>
                      <span className="text-slate-300">/</span>
                      <span className="text-[#0F172A] font-bold uppercase">{currentHero.id}</span>
                    </div>

                    {/* Headline with Double-Pill Lens Badge (Landing Page Style) */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#0F172A] leading-tight tracking-tight">
                      <span>{currentHero.agentRole.split('&')[0]}</span>
                      <br />
                      <span className="inline-flex items-center my-0.5">
                        <span className="pill-outline-lens py-0.5 px-3 mx-1 text-[#0F172A] text-xl sm:text-2xl">
                          {currentHero.heroName}
                        </span>
                      </span>
                    </h1>

                    {/* Tagline */}
                    <p className="text-xs sm:text-sm font-tech text-slate-600 leading-snug font-medium">
                      {currentHero.tagline}
                    </p>

                    {/* Quote Bubble */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-tech text-slate-700 italic relative">
                      <span className="font-serif text-slate-400 text-base mr-1">“</span>
                      <span>{currentHero.quote}</span>
                      <span className="font-serif text-slate-400 text-base ml-1">”</span>
                    </div>

                    {/* Capabilities Grid */}
                    <div>
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Core Capabilities
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {currentHero.powers.map((power, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] text-[#0F172A] font-tech shadow-2xs"
                          >
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{power}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Performance Metrics Bars */}
                    <div className="pt-0.5 space-y-1">
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                        {currentHero.stats.map((st, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-600">
                              <span>{st.label}</span>
                              <span className="text-[#0F172A]">{st.value}%</span>
                            </div>
                            <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                              <div 
                                className="h-full rounded-full bg-[#0F172A] transition-all duration-500"
                                style={{ width: `${st.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          ) : (
            /* ========================================================= */
            /* ALL 5 SUPERHERO SQUAD ASSEMBLED VIEW */
            /* ========================================================= */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="my-auto py-3 sm:py-5 flex flex-col items-center text-center space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]"
            >
              <div className="max-w-xl mx-auto space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-[11px] font-mono font-bold uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>5 Superhero Agents Assembled</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#0F172A] tracking-tight">
                  Your Software House is Ready
                </h1>
                <p className="text-xs text-slate-500 font-tech max-w-md mx-auto">
                  Tasks submitted to CodeCrew will be automatically planned and executed across this specialized multi-agent collective.
                </p>
              </div>

              {/* 5 Hero Squad Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
                {SUPERHERO_AGENTS.map((agent, idx) => (
                  <div 
                    key={agent.id}
                    onClick={() => {
                      setIsSquadView(false);
                      setCurrentIndex(idx);
                    }}
                    className="group cursor-pointer p-2.5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#0F172A] transition-all duration-300 flex flex-col items-center text-center shadow-2xs hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="w-14 h-14 rounded-xl mb-1.5 flex items-center justify-center p-1 bg-white border border-slate-200 overflow-hidden group-hover:border-[#0F172A] transition-colors">
                      <img 
                        src={agent.image} 
                        alt={agent.heroName} 
                        className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                    <h4 className="text-xs font-bold text-[#0F172A] font-display">{agent.heroName}</h4>
                    <p className="text-[10px] font-tech text-slate-500 line-clamp-1">
                      {agent.agentRole.split('&')[0]}
                    </p>
                    <span className="mt-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                      Ready
                    </span>
                  </div>
                ))}
              </div>

              {/* Enter Studio Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onComplete}
                  className="px-6 py-2.5 rounded-full bg-[#0F172A] hover:bg-black text-white font-tech font-semibold text-xs tracking-wider uppercase shadow-lg hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Launch Workspace & Deploy Agents</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Bottom Bar: Horizontal Track Indicator & Navigation Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between z-10 shrink-0">
            
            {/* Horizontal Track Step Dots */}
            <div className="flex items-center gap-1.5">
              {SUPERHERO_AGENTS.map((hero, idx) => (
                <button
                  key={hero.id}
                  type="button"
                  onClick={() => {
                    setIsSquadView(false);
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    !isSquadView && currentIndex === idx
                      ? 'w-7 bg-[#0F172A]'
                      : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                  title={hero.heroName}
                />
              ))}
              <button
                type="button"
                onClick={() => setIsSquadView(true)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  isSquadView ? 'w-7 bg-emerald-600' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                }`}
                title="Squad Assembled"
              />
            </div>

            {/* Prev / Next Horizontal Slide Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => paginate(-1)}
                disabled={currentIndex === 0 && !isSquadView}
                className="px-3 py-1 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-[#0F172A] text-xs font-tech font-semibold flex items-center gap-1 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Prev</span>
              </button>

              {!isSquadView ? (
                <button
                  type="button"
                  onClick={() => paginate(1)}
                  className="px-3.5 py-1 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-tech font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <span>{currentIndex === SUPERHERO_AGENTS.length - 1 ? 'Assemble Squad' : 'Next Agent'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onComplete}
                  className="px-4 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-tech font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <span>Launch Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default SuperheroAgentsShowcase;
