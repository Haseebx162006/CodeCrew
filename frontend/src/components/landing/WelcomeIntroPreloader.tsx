import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeIntroPreloaderProps {
  onComplete?: () => void;
}

const WORDS = [
  { text: 'AUTONOMOUS CREW', minPct: 0, activeColor: 'text-[#0F172A]', inactiveColor: 'text-slate-400' },
  { text: 'AST INGESTION', minPct: 25, activeColor: 'text-[#0F172A]', inactiveColor: 'text-slate-400' },
  { text: 'SUPERHERO AGENTS', minPct: 50, activeColor: 'text-[#2563EB]', inactiveColor: 'text-blue-300' },
  { text: 'PULL REQUESTS', minPct: 75, activeColor: 'text-[#0F172A]', inactiveColor: 'text-slate-400' },
];

export const WelcomeIntroPreloader: React.FC<WelcomeIntroPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const dismissedRef = useRef<boolean>(false);

  const handleDismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setIsVisible(false);
    onComplete?.();
  };

  useEffect(() => {
    // Paced smoothly over 6.5 seconds total
    const COUNT_DURATION = 5200; // 5.2s from 0 to 100%
    const TOTAL_DURATION = 6500; // 6.5s total (holds 1.3s at 100%)
    const startTime = performance.now();

    let animationFrameId: number;

    const tick = (now: number) => {
      if (dismissedRef.current) return;

      const elapsed = now - startTime;

      if (elapsed < COUNT_DURATION) {
        const pct = Math.min(100, Math.floor((elapsed / COUNT_DURATION) * 100));
        setProgress(pct);
        animationFrameId = requestAnimationFrame(tick);
      } else if (elapsed < TOTAL_DURATION) {
        setProgress(100);
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        handleDismiss();
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    // Guaranteed fallback dismiss at 9.5s
    const fallbackTimer = setTimeout(() => {
      handleDismiss();
    }, TOTAL_DURATION);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ 
            y: '-100%',
            transition: { duration: 0.95, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-[#CBD5E1] text-[#0F172A] flex flex-col justify-between p-6 sm:p-12 lg:p-16 select-none overflow-hidden cursor-pointer"
          onClick={handleDismiss}
        >
          {/* Top Bar Header */}
          <div className="flex items-start justify-between z-10">
            <div className="flex items-center gap-3.5">
              {/* Double Concentric Pulsing Ring */}
              <div className="relative w-9 h-9 flex items-center justify-center">
                <span className="absolute w-full h-full rounded-full border-[1.5px] border-[#0F172A]/40 animate-ping opacity-60" />
                <span className="w-6 h-6 rounded-full border-[2px] border-[#0F172A] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#0F172A]" />
                </span>
              </div>

              <div>
                <div className="text-base sm:text-lg font-extrabold font-mono text-[#0F172A] tracking-tight">
                  {progress}%
                </div>
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold">
                  CODECREW AUTONOMOUS ENGINE
                </div>
              </div>
            </div>

            {/* Skip Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className="px-4 py-1.5 rounded-full border border-[#0F172A]/40 text-xs font-mono uppercase tracking-wider text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-all cursor-pointer font-bold shadow-2xs"
            >
              Skip Intro
            </button>
          </div>

          {/* Center Giant Typographic Word Stack with Progressive Illuminations */}
          <div className="my-auto py-4 space-y-1 sm:space-y-2">
            {WORDS.map((item, idx) => {
              const isActivated = progress >= item.minPct;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ 
                    opacity: isActivated ? 1 : 0.35, 
                    x: 0,
                    scale: isActivated ? 1 : 0.98
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: idx * 0.18, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className={`text-4xl sm:text-7xl lg:text-8xl xl:text-9xl font-black font-display tracking-tighter leading-[0.92] uppercase transition-colors duration-500 ${
                    isActivated ? item.activeColor : item.inactiveColor
                  }`}
                >
                  {item.text}
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Bar Telemetry */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-600 pt-6 border-t border-[#0F172A]/20 z-10">
            <div>
              <span>(C) CODECREW AI SOFTWARE HOUSE</span>
            </div>
            <div>
              <span>LANGGRAPH + NEON POSTGRES + GROQ LPU</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeIntroPreloader;
