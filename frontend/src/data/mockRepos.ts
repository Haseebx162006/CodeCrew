import { Repository, TaskCategory } from '../types';

export const SAMPLE_REPOSITORIES: Repository[] = [
  {
    id: 'repo-1',
    name: 'ecommerce-core',
    fullName: 'my-org/ecommerce-core',
    owner: 'my-org',
    url: 'https://github.com/my-org/ecommerce-core',
    defaultBranch: 'main',
    branches: ['main', 'develop', 'release/v2.1', 'staging'],
    language: 'TypeScript',
    stars: 342,
    isPrivate: false,
    description: 'High-throughput checkout, inventory management, and stripe payment processing service.',
  },
  {
    id: 'repo-2',
    name: 'cloud-analytics-api',
    fullName: 'acme-inc/cloud-analytics-api',
    owner: 'acme-inc',
    url: 'https://github.com/acme-inc/cloud-analytics-api',
    defaultBranch: 'main',
    branches: ['main', 'feat/clickhouse-sync', 'v3-dev'],
    language: 'Go / Python',
    stars: 819,
    isPrivate: true,
    description: 'Distributed real-time streaming telemetry and analytics pipeline.',
  },
  {
    id: 'repo-3',
    name: 'dev-workspace-ui',
    fullName: 'anthropic-dev/dev-workspace-ui',
    owner: 'anthropic-dev',
    url: 'https://github.com/anthropic-dev/dev-workspace-ui',
    defaultBranch: 'main',
    branches: ['main', 'feature/canvas-editor', 'patch-auth'],
    language: 'React / TypeScript',
    stars: 1420,
    isPrivate: false,
    description: 'Next-gen collaborative developer interface built with Tailwind and React.',
  },
  {
    id: 'repo-4',
    name: 'auth-jwt-service',
    fullName: 'security-labs/auth-jwt-service',
    owner: 'security-labs',
    url: 'https://github.com/security-labs/auth-jwt-service',
    defaultBranch: 'master',
    branches: ['master', 'oauth-v2', 'dev'],
    language: 'Rust',
    stars: 560,
    isPrivate: false,
    description: 'Ultra-low latency OAuth2 & JWT session validation proxy with Redis cache.',
  },
];

export interface TaskPreset {
  title: string;
  category: TaskCategory;
  prompt: string;
  suggestedRepo: string;
}

export const TASK_PRESETS: TaskPreset[] = [
  {
    title: 'Implement JWT Refresh Token Rotation & Session Revocation',
    category: 'security',
    suggestedRepo: 'https://github.com/my-org/ecommerce-core',
    prompt: 'Add secure HTTP-only refresh token rotation in the auth middleware with Redis blacklisting upon logout. Include unit tests for token expiration, replay attack detection, and refresh endpoint.',
  },
  {
    title: 'Add Stripe Webhook Idempotency & Failed Payment Retry Handler',
    category: 'feature',
    suggestedRepo: 'https://github.com/my-org/ecommerce-core',
    prompt: 'Implement idempotent webhook event handling for Stripe checkout.session.completed and invoice.payment_failed. Ensure events are deduplicated in PostgreSQL and trigger exponential backoff email alerts.',
  },
  {
    title: 'Optimize Database Query Indexes & Fix N+1 Query Bottleneck in Orders API',
    category: 'performance',
    suggestedRepo: 'https://github.com/acme-inc/cloud-analytics-api',
    prompt: 'Refactor GET /api/v1/orders to use eager loading for order items and customer profiles. Add composite B-Tree index on (customer_id, created_at DESC) and verify query execution plan latency drops under 5ms.',
  },
  {
    title: 'Build Dark/Light Mode Theme Provider with System Preference Sync',
    category: 'refactor',
    suggestedRepo: 'https://github.com/anthropic-dev/dev-workspace-ui',
    prompt: 'Create a resilient ThemeProvider React context supporting "system", "dark", and "light" with smooth CSS variable transitions and zero layout shifts on initial load.',
  },
];
