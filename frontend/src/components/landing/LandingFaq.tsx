import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Github, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does CodeCrew access and write to my GitHub repositories?',
    answer: 'CodeCrew integrates via an official GitHub App. When you select a repository, the App generates short-lived, permission-bounded installation tokens. The agents clone your repository into an isolated sandbox, build feature branches, commit code diffs, and open Pull Requests for your human team to review.'
  },
  {
    question: 'What happens if a step in the workflow fails or times out?',
    answer: 'CodeCrew uses PostgreSQL state checkpointing (via LangGraph AsyncPostgresSaver). If an agent hits an error, completed subtasks are preserved, and the workflow resumes directly from the failed stage without restarting from the beginning, saving 100% of the tokens and time.'
  },
  {
    question: 'Does CodeCrew train on my proprietary source code?',
    answer: 'Never. CodeCrew communicates via enterprise API endpoints with zero-data retention policies. Your source code, AST tokens, and repository files are processed strictly in-memory during task execution and immediately wiped after PR creation.'
  },
  {
    question: 'What frameworks, languages, and stacks are supported?',
    answer: 'CodeCrew supports all modern full-stack architectures including TypeScript, React, Next.js, Node.js, Express, Python, FastAPI, Go, Rust, Java, Flutter, Docker, Kubernetes, PostgreSQL, Prisma, SQLAlchemy, and Tailwind CSS.'
  },
  {
    question: 'How does CodeCrew maintain such fast execution speeds?',
    answer: 'By leveraging Groq LPU inference accelerators alongside concise single-pass prompt architectures, Time-To-First-Token (TTFT) is reduced to ~35ms, and full multi-file code synthesis completes in under 2 seconds per agent step.'
  }
];

export const LandingFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-[32px] border-[1.5px] border-[#0F172A] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            frequently asked questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F172A]">
            Everything You Need to Know.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-tech">
            Common questions regarding security, GitHub App permissions, and multi-agent architecture.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all bg-[#FAFAFA]"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-display font-bold text-xs sm:text-sm text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#0F172A]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-200 bg-white"
                    >
                      <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 font-tech leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingFaq;
