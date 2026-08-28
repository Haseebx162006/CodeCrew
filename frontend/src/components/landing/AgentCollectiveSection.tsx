import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  Code2, 
  Database, 
  ShieldAlert, 
  BookOpen, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  Zap,
  GitPullRequest
} from 'lucide-react';

interface AgentProfile {
  id: string;
  name: string;
  role: string;
  badge: string;
  avatarIcon: React.ElementType;
  accentColor: string;
  bgLight: string;
  description: string;
  responsibilities: string[];
  techStack: string[];
  sampleOutput: {
    filename: string;
    lang: string;
    code: string;
  };
}

const AGENTS: AgentProfile[] = [
  {
    id: 'planner',
    name: 'Ada (Lead Architect)',
    role: 'AST Analysis & Topological Planning',
    badge: 'Orchestrator',
    avatarIcon: Cpu,
    accentColor: '#3B82F6',
    bgLight: '#EFF6FF',
    description: 'Deconstructs high-level human prompts into atomic subtasks with resolved dependency graphs and type-safe module mapping.',
    responsibilities: [
      'AST Symbol Graph Construction',
      'Cyclic Dependency Resolution',
      'Subtask Topological Ordering',
      'Target Module Detection'
    ],
    techStack: ['LangGraph', 'Tree-Sitter AST', 'NetworkX', 'Groq LPU'],
    sampleOutput: {
      filename: 'execution_plan.json',
      lang: 'json',
      code: `{
  "plan_id": "plan_948a_jwt_rotation",
  "root_objective": "RFC-6749 Refresh Token Rotation with Redis Blacklist",
  "subtasks": [
    { "id": "t1", "agent": "database", "target": "schema/refresh_tokens.sql", "deps": [] },
    { "id": "t2", "agent": "backend", "target": "src/auth/jwt.service.ts", "deps": ["t1"] },
    { "id": "t3", "agent": "testing", "target": "tests/auth.spec.ts", "deps": ["t2"] }
  ],
  "estimated_execution_time": "1.8s"
}`
    }
  },
  {
    id: 'backend',
    name: 'Marcus (Backend Engineer)',
    role: 'APIs, Business Logic & Security',
    badge: 'Core Engine',
    avatarIcon: Code2,
    accentColor: '#10B981',
    bgLight: '#ECFDF5',
    description: 'Writes type-safe backend APIs, async worker queues, cryptographic hashing, and enterprise business domain logic.',
    responsibilities: [
      'REST & GraphQL API Endpoints',
      'JWT/OAuth2 & HMAC Authentication',
      'Async Service Architecture',
      'Strict Schema Validation'
    ],
    techStack: ['Node.js', 'FastAPI', 'TypeScript', 'Express', 'Python'],
    sampleOutput: {
      filename: 'src/services/jwt_auth.service.ts',
      lang: 'typescript',
      code: `export class JwtAuthService {
  public static async rotateRefreshToken(token: string): Promise<TokenPair> {
    const payload = await verifyToken(token, JWT_REFRESH_SECRET);
    const isBlacklisted = await redis.get(\`bl:\${payload.jti}\`);
    if (isBlacklisted) throw new UnauthorizedException('Revoked token replay detected');
    
    // Atomically invalidate old token and issue fresh keypair
    await redis.setex(\`bl:\${payload.jti}\`, 604800, 'revoked');
    return this.generateTokenPair(payload.userId);
  }
}`
    }
  },
  {
    id: 'frontend',
    name: 'Elena (Frontend Engineer)',
    role: 'Modern UI, State & Motion',
    badge: 'Client Engine',
    avatarIcon: Sparkles,
    accentColor: '#8B5CF6',
    bgLight: '#F5F3FF',
    description: 'Builds pixel-perfect React/Next.js components, fluid Tailwind v4 styles, responsive layouts, and interactive state management.',
    responsibilities: [
      'Tailwind CSS v4 & Obsidian Themes',
      'React 19 Hooks & State Stores',
      'Micro-Interactions & Motion',
      'Accessibility & Screen Reader QA'
    ],
    techStack: ['React 19', 'Next.js 15', 'Tailwind v4', 'Framer Motion'],
    sampleOutput: {
      filename: 'src/components/TokenExpirationBanner.tsx',
      lang: 'tsx',
      code: `export const TokenExpirationBanner: React.FC = () => {
  const { session, refreshSession } = useAuth();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between"
    >
      <span className="text-xs font-mono text-amber-200">Session expiring in 2m. Auto-rotating...</span>
      <button onClick={refreshSession} className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-lg">
        Refresh Now
      </button>
    </motion.div>
  );
};`
    }
  },
  {
    id: 'database',
    name: 'Darius (Database Architect)',
    role: 'PostgreSQL, Vector DB & Schemas',
    badge: 'Data Engine',
    avatarIcon: Database,
    accentColor: '#F59E0B',
    bgLight: '#FFFBEB',
    description: 'Designs normalized SQL schemas, ACID transaction rollbacks, index strategies, and pgvector embeddings.',
    responsibilities: [
      'Zero-Downtime Migration Scripts',
      'pgvector 1536-dim Embedding Tables',
      'B-Tree & GIN Index Tuning',
      'Row Level Security (RLS) Policies'
    ],
    techStack: ['PostgreSQL', 'pgvector', 'Prisma', 'SQLAlchemy', 'Redis'],
    sampleOutput: {
      filename: 'migrations/004_create_refresh_tokens.sql',
      lang: 'sql',
      code: `CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  is_revoked BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_token_lookup ON refresh_tokens(token_hash) WHERE is_revoked = FALSE;`
    }
  },
  {
    id: 'testing',
    name: 'Valkyrie (QA & Testing Lead)',
    role: 'Vitest, Sandbox & Regression Shield',
    badge: 'Guardian Engine',
    avatarIcon: ShieldAlert,
    accentColor: '#EC4899',
    bgLight: '#FDF2F8',
    description: 'Generates comprehensive test suites, mocks external dependencies, and validates 100% test passing in isolated sandboxes.',
    responsibilities: [
      'Automated Vitest & Pytest Specs',
      'Edge-Case & Replay Attack Fuzzing',
      '100% Branch Coverage Verification',
      'Air-Gapped Sandbox Execution'
    ],
    techStack: ['Vitest', 'Pytest', 'Playwright', 'Jest', 'MockWebServer'],
    sampleOutput: {
      filename: 'tests/auth_rotation.spec.ts',
      lang: 'typescript',
      code: `describe('RFC-6749 Token Rotation', () => {
  it('should immediately revoke old refresh token upon first exchange', async () => {
    const pair1 = await authService.issueTokens(testUser.id);
    const pair2 = await authService.rotateRefreshToken(pair1.refreshToken);
    
    expect(pair2.accessToken).toBeDefined();
    // Replay attempt must throw 401
    await expect(authService.rotateRefreshToken(pair1.refreshToken))
      .rejects.toThrow('Revoked token replay detected');
  });
});`
    }
  },
  {
    id: 'docs',
    name: 'Scribe (Documentation Engineer)',
    role: 'API Specs, Architecture & Markdown',
    badge: 'Docs Engine',
    avatarIcon: BookOpen,
    accentColor: '#06B6D4',
    bgLight: '#ECFEFF',
    description: 'Compiles clean architectural documentation, OpenAPI Swagger specifications, sequence diagrams, and PR changelogs.',
    responsibilities: [
      'Architecture & Sequence Diagrams',
      'OpenAPI 3.1 & Swagger Specs',
      'Production-Ready README Guides',
      'GPG-Signed PR Changelogs'
    ],
    techStack: ['Markdown', 'OpenAPI 3.1', 'Mermaid.js', 'TypeDoc'],
    sampleOutput: {
      filename: 'docs/AUTH_ARCHITECTURE.md',
      lang: 'markdown',
      code: `# 🔐 Authentication & Session Architecture

## Token Rotation Flow
\`\`\`mermaid
sequenceDiagram
  Client->>+API Gateway: POST /api/auth/refresh (HTTP-only Cookie)
  API Gateway->>+Redis: Check JTI in Blacklist
  Redis-->>-API Gateway: Valid (Not Revoked)
  API Gateway->>+Postgres: Mark old JTI as Revoked
  API Gateway-->>-Client: Set-Cookie: new_refresh_token + JWT
\`\`\`
`
    }
  }
];

export const AgentCollectiveSection: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile>(AGENTS[0]);

  return (
    <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-[32px] border-[1.5px] border-[#0F172A] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#0F172A] text-xs font-mono font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>THE AUTONOMOUS COLLECTIVE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-[#0F172A] tracking-tight">
              Meet Your 5-Agent Software House.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-tech mt-1 max-w-xl">
              Each specialized agent possesses isolated domain expertise. Coordinated by LangGraph, they collaborate to turn raw issues into verified Pull Requests.
            </p>
          </div>

          <div className="text-right hidden md:block">
            <span className="text-xs font-mono text-slate-400">Zero Prompt Token Waste</span>
            <div className="text-sm font-bold font-tech text-[#0F172A]">Postgres State Memory Active</div>
          </div>
        </div>

        {/* Agent Selector Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {AGENTS.map((agent) => {
            const Icon = agent.avatarIcon;
            const isSelected = selectedAgent.id === agent.id;
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelectedAgent(agent)}
                className={`p-3.5 rounded-2xl border-[1.5px] transition-all text-left flex flex-col justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-lg scale-[1.02]'
                    : 'border-slate-200 bg-[#F8FAFC] text-[#0F172A] hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-[#0F172A]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/10 text-white' : 'bg-slate-200/60 text-slate-600'
                    }`}
                  >
                    {agent.badge}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold font-display leading-tight truncate">
                    {agent.name.split(' ')[0]}
                  </div>
                  <div
                    className={`text-[10px] font-tech truncate ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {agent.role.split('&')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Agent Detail Workspace */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedAgent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2"
          >
            {/* Left Card: Agent Persona & Responsibilities (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl border-[1.5px] border-[#0F172A] bg-[#FAFAFA] flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center shadow-md">
                    {React.createElement(selectedAgent.avatarIcon, { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-[#0F172A]">
                      {selectedAgent.name}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 block">
                      {selectedAgent.role}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-tech leading-relaxed">
                  {selectedAgent.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Core Capabilities
                  </span>
                  <div className="space-y-1.5">
                    {selectedAgent.responsibilities.map((resp, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-tech text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stack Tags */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block mb-2">
                  Primary Tooling
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono font-medium text-slate-700 shadow-2xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card: Live Code / File Output Generated by Agent (7 cols) */}
            <div className="lg:col-span-7 bg-[#0F172A] rounded-2xl border border-slate-800 p-5 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-slate-300 font-medium ml-2">
                    {selectedAgent.sampleOutput.filename}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-emerald-400 text-[10px]">
                    Generated by {selectedAgent.name.split(' ')[0]}
                  </span>
                </div>
              </div>

              <div className="my-4 overflow-x-auto">
                <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                  <code>{selectedAgent.sampleOutput.code}</code>
                </pre>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Zap className="w-3 h-3" />
                  Generated in ~0.62s via Groq
                </span>
                <span>Type Check: 0 Errors</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AgentCollectiveSection;
