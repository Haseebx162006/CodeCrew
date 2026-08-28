export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  githubConnected: boolean;
  githubUsername?: string;
  avatarUrl?: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  url: string;
  defaultBranch: string;
  branches: string[];
  language: string;
  stars: number;
  isPrivate: boolean;
  description: string;
}

export type TaskCategory = 'feature' | 'bugfix' | 'refactor' | 'performance' | 'security' | 'docs';

export type TaskStatus = 'queued' | 'running' | 'completed' | 'partially_completed' | 'failed' | 'merged';

export interface ExecutionLog {
  id: string;
  timestamp: string;
  stage: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'code' | 'test';
  metadata?: Record<string, unknown>;
}

export interface FileDiff {
  filename: string;
  oldPath?: string;
  newPath?: string;
  status: 'modified' | 'added' | 'deleted';
  additions: number;
  deletions: number;
  diffHunk: string;
  oldCode?: string;
  newCode?: string;
}

export interface ExecutionStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number; // 0 to 100
  durationMs?: number;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  description: string;
  branch: string;
  baseBranch: string;
  author: string;
  avatarUrl?: string;
  createdAt: string;
  status: 'open' | 'merged' | 'closed';
  checksPassed: boolean;
  filesChanged: number;
  additions: number;
  deletions: number;
  diffs: FileDiff[];
  githubPrUrl: string;
  mergedAt?: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  prompt: string;
  category: TaskCategory;
  repo: Repository;
  targetBranch: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  stages: ExecutionStage[];
  currentStageIndex: number;
  logs: ExecutionLog[];
  pullRequest?: PullRequest;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: Date;
  actionLabel?: string;
  onAction?: () => void;
}
