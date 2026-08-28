import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeIntroPreloaderProps {
  onComplete?: () => void;
}

const WORDS = [
  { text: 'AUTONOMOUS CREW', color: 'text-[#475569]' },
  { text: 'AST INGESTION', color: 'text-[#0F172A]' },
  { text: 'SUPERHERO AGENTS', color: 'text-[#2563EB]' },
  { text: 'PULL REQUESTS', color: 'text-[#0F172A]' },
];

export const WelcomeIntroPreloader: React.FC<WelcomeIntroPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const dismissedRef = useRef<boolean>(false);

  const handleDismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    sessionStorage.setItem('codecrew_intro_seen', 'true');
    setIsVisible(false);
    onComplete?.();
  };

  useEffect(() => {
    // Check if user already saw the intro during this browser session
    const hasSeenIntro = sessionStorage.getItem('codecrew_intro_seen');
    if (hasSeenIntro) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    const COUNT_DURATION = 6400; // 6.4s from 0 to 100%
    const TOTAL_DURATION = 8000; // 8.0s total before curtain slide
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

    // Hard fallback timeout: guaranteed dismiss after exactly 3.8s
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
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-[#CBD5E1] text-[#0F172A] flex flex-col justify-between p-6 sm:p-12 lg:p-16 select-none overflow-hidden cursor-pointer"
          onClick={handleDismiss}
        >
          {/* Top Bar Header */}
          <div className="flex items-start justify-between z-10">
            <div className="flex items-center gap-3.5">
              {/* Double Concentric Pulsing Ring */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <span className="absolute w-full h-full rounded-full border-[1.5px] border-[#0F172A]/40 animate-ping opacity-60" />
                <span className="w-6 h-6 rounded-full border-[2px] border-[#0F172A] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#0F172A]" />
                </span>
              </div>

              <div>
                <div className="text-sm sm:text-base font-extrabold font-mono text-[#0F172A] tracking-tight">
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
              className="px-3.5 py-1 rounded-full border border-[#0F172A]/30 text-[11px] font-mono uppercase tracking-wider text-slate-700 hover:bg-[#0F172A] hover:text-white transition-all cursor-pointer"
            >
              Skip
            </button>
          </div>

          {/* Center Giant Typographic Word Stack */}
          <div className="my-auto py-4 space-y-1 sm:space-y-2">
            {WORDS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: idx * 0.12, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className={`text-4xl sm:text-7xl lg:text-8xl xl:text-9xl font-black font-display tracking-tighter leading-[0.92] uppercase ${item.color}`}
              >
                {item.text}
              </motion.div>
            ))}
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
