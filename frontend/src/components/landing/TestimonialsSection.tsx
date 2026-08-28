import React from 'react';
import { Quote, Star } from 'lucide-react';

const REVIEWS = [
  {
    quote:
      'DevPulse handled our complex multi-tenant JWT rotation refactor across 8 microservices. The PR passed all 142 integration tests on the first try.',
    author: 'Liam Vance',
    role: 'VP of Engineering',
    company: 'Nexus Cloud',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    quote:
      'The AST parsing is shockingly accurate. It doesn’t guess or hallucinate variable names—it writes code exactly like our senior engineers do.',
    author: 'Elena Rostova',
    role: 'Staff Infrastructure Architect',
    company: 'ScaleMetric',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
  },
  {
    quote:
      'Our team merged 40+ chore & refactor PRs in one sprint without writing a single line of boilerplate manually. It changed our developer velocity permanently.',
    author: 'Marcus Chen',
    role: 'Head of Core Platform',
    company: 'HyperFlow IO',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card text-xs text-[#E5A967] font-tech font-semibold uppercase tracking-wider">
          <Star className="w-3.5 h-3.5 fill-[#E5A967]" />
          Engineered for Teams
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white">
          Loved by Senior Developers.
        </h2>
        <p className="text-stone-400 font-tech text-sm sm:text-base">
          See how high-growth engineering teams use autonomous agents to eliminate tech debt.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((r, idx) => (
          <div
            key={idx}
            className="glass-card glass-card-hover rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <Quote className="w-8 h-8 text-[#E5A967]/40" />
              <p className="text-stone-300 font-tech text-sm leading-relaxed">
                "{r.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-white/5">
              <img
                src={r.avatar}
                alt={r.author}
                className="w-10 h-10 rounded-full object-cover border border-[#E5A967]/40"
              />
              <div>
                <h4 className="text-sm font-semibold text-white font-display">
                  {r.author}
                </h4>
                <p className="text-xs text-stone-400 font-tech">
                  {r.role} · {r.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
