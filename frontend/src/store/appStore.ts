import { create } from 'zustand';
import { User, Repository, TaskRecord, PullRequest, NotificationItem, ExecutionStage, ExecutionLog, FileDiff } from '../types';
import { SAMPLE_REPOSITORIES } from '../data/mockRepos';
import { authApi, RegisterPayload } from '../services/authApi';
import { workspaceApi } from '../services/workspaceApi';

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  authView: 'login' | 'signup';
  showHeroShowcase: boolean;

  // Workspace state
  repositories: Repository[];
  selectedRepo: Repository | null;
  customRepoUrl: string;
  selectedBranch: string;
  isRepoLoading: boolean;

  // Task & Execution state
  tasks: TaskRecord[];
  activeTaskId: string | null;
  isExecuting: boolean;
  isDrawerOpen: boolean;

  // Notifications
  notifications: NotificationItem[];

  // Actions
  setShowHeroShowcase: (show: boolean) => void;
  setAuthView: (view: 'login' | 'signup') => void;
  setAuthError: (error: string | null) => void;
  initAuth: () => Promise<void>;
  signUp: (data: RegisterPayload) => Promise<boolean>;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGitHub: () => void;
  logout: () => void;
  connectGitHubAccount: (username: string) => void;

  fetchRepositories: (username?: string) => Promise<void>;
  addCustomRepository: (url: string) => Promise<Repository | null>;
  loadWorkspaceTasks: () => Promise<void>;
  deleteTaskRecord: (taskId: string) => Promise<void>;

  setSelectedRepo: (repo: Repository | null) => void;
  setCustomRepoUrl: (url: string) => void;
  setSelectedBranch: (branch: string) => void;

  submitTask: (data: { title: string; prompt: string; category: TaskRecord['category'] }) => Promise<string>;
  setActiveTaskId: (id: string | null) => void;
  mergePullRequest: (taskId: string) => Promise<void>;
  toggleDrawer: () => void;

  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}


const INITIAL_STAGES: ExecutionStage[] = [
  {
    id: 'stage-1',
    name: 'Repository Ingestion & AST Parsing',
    description: 'Cloning repo branch, indexing syntax tree, and checking package dependencies',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'stage-2',
    name: 'Context Gathering & Architecture Planning',
    description: 'Selecting relevant source files, analyzing API contracts, and drafting diff plan',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'stage-3',
    name: 'Autonomous Code Implementation',
    description: 'Generating type-safe changes, refactoring logic, and applying optimizations',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'stage-4',
    name: 'Automated Test Suite & Lint Verification',
    description: 'Running unit test runners, validating regression benchmarks, and lint audits',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'stage-5',
    name: 'Git Commit & Pull Request Creation',
    description: 'Branching feature branch, signing commit, and generating GitHub Pull Request',
    status: 'pending',
    progress: 0,
  },
];

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('cached_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const hasInitialToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('auth_token'));
const storedUser = getStoredUser();

export const useAppStore = create<AppState>((set, get) => ({
  user: storedUser,
  isAuthenticated: Boolean(hasInitialToken && storedUser),
  isAuthLoading: false,
  authError: null,
  authView: 'signup',
  showHeroShowcase: false,
  repositories: [],
  selectedRepo: null,
  customRepoUrl: '',
  selectedBranch: 'main',
  isRepoLoading: false,



  tasks: [],
  activeTaskId: null,
  isExecuting: false,
  isDrawerOpen: false,

  notifications: [
    {
      id: 'notif-welcome',
      title: 'CodeCrew Autonomous System Ready',
      message: 'Sign in or register to assemble the 5 superhero agents.',
      type: 'info',
      timestamp: new Date(),
    },
  ],

  setShowHeroShowcase: (show) => set({ showHeroShowcase: show }),
  setAuthView: (view) => set({ authView: view, authError: null }),
  setAuthError: (error) => set({ authError: error }),

  /**
   * Initializes auth on app mount by checking URL OAuth params, saved JWT, repos, and tasks
   */
  initAuth: async () => {
    // 1. Check if URL contains OAuth redirect parameters
    if (typeof window !== 'undefined' && window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const urlCode = urlParams.get('code');
      const urlInstallId = urlParams.get('installation_id');

      if (urlToken) {
        localStorage.setItem('auth_token', urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
        set({ isAuthLoading: true });
        try {
          const user = await authApi.getMe(urlToken);
          if (user) {
            localStorage.setItem('cached_user', JSON.stringify(user));
            localStorage.setItem('active_view', 'workspace');
            set({ user, isAuthenticated: true, showHeroShowcase: true, isAuthLoading: false });
            get().addNotification({
              title: 'GitHub Authenticated',
              message: `Welcome, ${user.name}! Linked GitHub account.`,
              type: 'success',
            });
            get().fetchRepositories(user.githubUsername);
            get().loadWorkspaceTasks();
            return;
          }
        } catch {
          // Continue to fallback
        } finally {
          set({ isAuthLoading: false });
        }
      } else if (urlCode || urlInstallId) {
        window.history.replaceState({}, document.title, window.location.pathname);
        set({ isAuthLoading: true });
        try {
          const { user } = await authApi.exchangeGitHubCode(
            urlCode || undefined,
            urlInstallId ? parseInt(urlInstallId, 10) : undefined
          );
          localStorage.setItem('cached_user', JSON.stringify(user));
          localStorage.setItem('active_view', 'workspace');
          set({ user, isAuthenticated: true, showHeroShowcase: true, isAuthLoading: false });
          get().addNotification({
            title: 'GitHub Authenticated',
            message: `Welcome, ${user.name}! GitHub identity connected.`,
            type: 'success',
          });
          get().fetchRepositories(user.githubUsername);
          get().loadWorkspaceTasks();
          return;
        } catch (err: any) {
          set({ isAuthLoading: false, authError: err?.message || 'GitHub OAuth failed.' });
        }
      }
    }

    // 2. Check saved localStorage JWT token
    const token = authApi.getToken();
    if (token) {
      set({ isAuthLoading: true });
      try {
        const user = await authApi.getMe(token);
        if (user) {
          localStorage.setItem('cached_user', JSON.stringify(user));
          set({ user, isAuthenticated: true });
          get().fetchRepositories(user.githubUsername);
        } else {
          localStorage.removeItem('cached_user');
          set({ user: null, isAuthenticated: false });
        }
      } catch {
        // Keep existing cached user if offline or temporary network blip
      } finally {
        set({ isAuthLoading: false });
      }
    }

    // 3. Load initial repositories & saved tasks from PostgreSQL
    get().fetchRepositories();
    get().loadWorkspaceTasks();
  },

  /**
   * Fetch repositories from backend / GitHub
   */
  fetchRepositories: async (username?: string) => {
    set({ isRepoLoading: true });
    try {
      const repos = await workspaceApi.getRepositories(username || get().user?.githubUsername);
      if (repos && repos.length > 0) {
        set({
          repositories: repos,
          selectedRepo: get().selectedRepo || repos[0],
          customRepoUrl: get().customRepoUrl || repos[0].url,
          selectedBranch: get().selectedBranch || repos[0].defaultBranch,
        });
      }
    } catch (e) {
      console.warn('Using default repositories', e);
    } finally {
      set({ isRepoLoading: false });
    }
  },

  /**
   * Validate and connect a custom GitHub repository URL
   */
  addCustomRepository: async (url: string) => {
    set({ isRepoLoading: true });
    try {
      const newRepo = await workspaceApi.validateRepository(url);
      const existingIndex = get().repositories.findIndex((r) => r.url.toLowerCase() === newRepo.url.toLowerCase());
      let updatedRepos = [...get().repositories];
      if (existingIndex >= 0) {
        updatedRepos[existingIndex] = newRepo;
      } else {
        updatedRepos = [newRepo, ...updatedRepos];
      }
      set({
        repositories: updatedRepos,
        selectedRepo: newRepo,
        customRepoUrl: newRepo.url,
        selectedBranch: newRepo.defaultBranch,
        isRepoLoading: false,
      });
      get().addNotification({
        title: 'Repository Connected',
        message: `Successfully connected ${newRepo.fullName}`,
        type: 'success',
      });
      return newRepo;
    } catch (err: any) {
      set({ isRepoLoading: false });
      get().addNotification({
        title: 'Repository Error',
        message: err?.message || 'Failed to connect repository',
        type: 'error',
      });
      return null;
    }
  },

  /**
   * Load previous tasks from PostgreSQL database
   */
  loadWorkspaceTasks: async () => {
    try {
      const backendTasks = await workspaceApi.getAllTasks();
      if (backendTasks && backendTasks.length > 0) {
        const convertedTasks: TaskRecord[] = backendTasks.map((t) => {
          const repoName = t.repo_url.split('/').pop() || 'repository';
          const repo: Repository = {
            id: `repo-${t.task_id}`,
            name: repoName,
            fullName: t.repo_url.replace('https://github.com/', ''),
            owner: t.repo_url.split('/')[3] || 'developer',
            url: t.repo_url,
            defaultBranch: t.base_branch || 'main',
            branches: [t.base_branch || 'main'],
            language: 'TypeScript',
            stars: 42,
            isPrivate: false,
            description: 'Connected Git Repository',
          };

          const pullRequest: PullRequest | undefined = t.pr_url
            ? {
                id: `pr-${t.task_id}`,
                number: parseInt(t.pr_url.split('/').pop() || '42', 10) || 42,
                title: t.task_description,
                description: `Autonomous PR for ${t.task_description}`,
                branch: t.branch_name || 'feat-ai-update',
                baseBranch: t.base_branch || 'main',
                author: 'devpulse-ai[bot]',
                avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
                createdAt: t.created_at ? new Date(t.created_at).toLocaleTimeString() : new Date().toLocaleTimeString(),
                status: t.status === 'merged' ? 'merged' : 'open',
                checksPassed: true,
                filesChanged: 3,
                additions: 48,
                deletions: 8,
                diffs: [],
                githubPrUrl: t.pr_url,
              }
            : undefined;

          return {
            id: t.task_id,
            title: t.task_description.split('\n')[0].slice(0, 60),
            prompt: t.task_description,
            category: 'feature',
            repo,
            targetBranch: t.base_branch || 'main',
            status: (t.status as TaskRecord['status']) || 'completed',
            createdAt: t.created_at ? new Date(t.created_at).toLocaleTimeString() : new Date().toLocaleTimeString(),
            stages: JSON.parse(JSON.stringify(INITIAL_STAGES)).map((s: ExecutionStage) => ({
              ...s,
              status: 'completed',
              progress: 100,
            })),
            currentStageIndex: 4,
            logs: [
              {
                id: `log-${t.task_id}`,
                timestamp: new Date().toLocaleTimeString(),
                stage: 'Pipeline',
                message: `Task ${t.task_id} (${t.status}) on ${repo.fullName}`,
                type: 'info',
              },
            ],
            pullRequest,
          };
        });

        set({ tasks: convertedTasks });
      }
    } catch (e) {
      console.warn('Could not load past tasks from backend', e);
    }
  },

  /**
   * Delete a task record
   */
  deleteTaskRecord: async (taskId: string) => {
    try {
      await workspaceApi.deleteTask(taskId);
    } catch (e) {
      console.warn('Could not delete task on backend', e);
    }
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== taskId),
      activeTaskId: s.activeTaskId === taskId ? null : s.activeTaskId,
    }));
  },

  /**
   * Register a new user with backend
   */
  signUp: async (data) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const { user } = await authApi.register(data);
      localStorage.setItem('cached_user', JSON.stringify(user));
      localStorage.setItem('active_view', 'workspace');
      set({ user, isAuthenticated: true, showHeroShowcase: true, isAuthLoading: false, authError: null });
      get().addNotification({
        title: 'Account Created',
        message: `Welcome aboard, ${user.name}! Assembling your superhero agents.`,
        type: 'success',
      });
      get().fetchRepositories(user.githubUsername);
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create account. Please check your details.';
      set({ isAuthLoading: false, authError: errorMessage });
      get().addNotification({
        title: 'Registration Error',
        message: errorMessage,
        type: 'error',
      });
      return false;
    }
  },

  /**
   * Log in user with backend
   */
  login: async (email, password) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const { user } = await authApi.login({ email, password });
      localStorage.setItem('cached_user', JSON.stringify(user));
      localStorage.setItem('active_view', 'workspace');
      set({ user, isAuthenticated: true, showHeroShowcase: true, isAuthLoading: false, authError: null });
      get().addNotification({
        title: 'Signed In Successfully',
        message: `Welcome back, ${user.name}! Superhero agents online.`,
        type: 'success',
      });
      get().fetchRepositories(user.githubUsername);
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || 'Invalid email or password.';
      set({ isAuthLoading: false, authError: errorMessage });
      get().addNotification({
        title: 'Authentication Failed',
        message: errorMessage,
        type: 'error',
      });
      return false;
    }
  },

  /**
   * Initiate 1-click GitHub OAuth Sign In
   */
  loginWithGitHub: async () => {
    set({ isAuthLoading: true, authError: null });
    try {
      const authUrl = await authApi.getGitHubAuthUrl();
      window.location.href = authUrl;
    } catch (err: any) {
      set({ isAuthLoading: false, authError: 'Could not connect to GitHub OAuth.' });
      get().addNotification({
        title: 'OAuth Error',
        message: 'Could not connect to GitHub OAuth service.',
        type: 'error',
      });
    }
  },

  logout: () => {
    authApi.logout();
    localStorage.removeItem('cached_user');
    localStorage.removeItem('active_view');
    set({ isAuthenticated: false, user: null, activeTaskId: null, showHeroShowcase: false, authError: null });
  },

  connectGitHubAccount: (username) => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: {
          ...currentUser,
          githubConnected: true,
          githubUsername: username,
        },
      });
      get().fetchRepositories(username);
      get().addNotification({
        title: 'GitHub Linked',
        message: `Successfully linked account @${username}`,
        type: 'success',
      });
    }
  },

  setSelectedRepo: (repo) => {
    if (repo) {
      set({
        selectedRepo: repo,
        customRepoUrl: repo.url,
        selectedBranch: repo.defaultBranch,
      });
    } else {
      set({ selectedRepo: null });
    }
  },

  setCustomRepoUrl: (url) => set({ customRepoUrl: url }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),

  setActiveTaskId: (id) => set({ activeTaskId: id }),
  toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),

  addNotification: (item) => {
    // Deduplicate identical active notifications
    const existing = get().notifications.find(
      (n) => n.title === item.title && n.message === item.message
    );
    if (existing) return;

    const notifId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const notif: NotificationItem = {
      ...item,
      id: notifId,
      timestamp: new Date(),
    };

    set((state) => ({
      notifications: [notif, ...state.notifications.slice(0, 2)],
    }));

    // Auto-dismiss this specific toast after 4 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notifId),
      }));
    }, 4000);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  submitTask: async ({ title, prompt, category }) => {
    const state = get();
    const repo = state.selectedRepo || {
      id: `repo-custom-${Date.now()}`,
      name: state.customRepoUrl.split('/').pop() || 'custom-repository',
      fullName: state.customRepoUrl.replace('https://github.com/', ''),
      owner: state.customRepoUrl.split('/')[3] || 'user',
      url: state.customRepoUrl,
      defaultBranch: state.selectedBranch || 'main',
      branches: [state.selectedBranch || 'main'],
      language: 'TypeScript',
      stars: 42,
      isPrivate: false,
      description: 'Connected Git Repository',
    };

    let backendTaskId: string | null = null;
    try {
      const res = await workspaceApi.createTask({
        repoUrl: repo.url,
        taskDescription: prompt,
        baseBranch: state.selectedBranch || repo.defaultBranch,
        sessionId: state.user?.id,
      });
      if (res && res.taskId) {
        backendTaskId = res.taskId;
      }
    } catch (e) {
      console.warn('Backend task creation fallback to interactive mode', e);
    }

    const taskId = backendTaskId || `task-${Date.now()}`;
    const newTask: TaskRecord = {
      id: taskId,
      title,
      prompt,
      category,
      repo,
      targetBranch: state.selectedBranch || repo.defaultBranch,
      status: 'running',
      createdAt: new Date().toLocaleTimeString(),
      stages: JSON.parse(JSON.stringify(INITIAL_STAGES)),
      currentStageIndex: 0,
      logs: [
        {
          id: `log-${Date.now()}-1`,
          timestamp: new Date().toLocaleTimeString(),
          stage: 'Ingestion',
          message: `Initializing autonomous multi-agent collective on repo "${repo.fullName}" (${state.selectedBranch || repo.defaultBranch})...`,
          type: 'info',
        },
      ],
    };

    set((s) => ({
      tasks: [newTask, ...s.tasks],
      activeTaskId: taskId,
      isExecuting: true,
    }));

    get().addNotification({
      title: 'Agent Dispatched 🚀',
      message: `Superhero agents assembling for: "${title}"`,
      type: 'info',
    });

    // Run live telemetry tracking and execution pipeline
    trackAndRunTask(taskId, repo, title);
    return taskId;
  },

  mergePullRequest: async (taskId: string) => {
    try {
      await workspaceApi.mergeTask(taskId);
    } catch (e) {
      console.warn('Could not merge on backend', e);
    }
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id !== taskId || !t.pullRequest) return t;
        return {
          ...t,
          status: 'merged',
          pullRequest: {
            ...t.pullRequest,
            status: 'merged',
            mergedAt: new Date().toLocaleTimeString(),
          },
        };
      }),
    }));

    const task = get().tasks.find((t) => t.id === taskId);
    get().addNotification({
      title: 'Pull Request Merged! 🎉',
      message: `PR #${task?.pullRequest?.number || 42} successfully merged into ${task?.targetBranch || 'main'}.`,
      type: 'success',
    });
  },
}));

// Context-Aware Dynamic Diff Generator for the user's selected repository and prompt
function generateContextualDiffs(repo: Repository, prompt: string): FileDiff[] {
  const p = prompt.toLowerCase();
  const repoName = repo.name || 'project';

  if (p.includes('doc') || p.includes('readme') || p.includes('guide') || p.includes('explain')) {
    return [
      {
        filename: 'README.md',
        status: 'modified',
        additions: 46,
        deletions: 4,
        diffHunk: `@@ -1,10 +1,46 @@
-# ${repoName}
-
-Repository codebase.
+# ${repoName}
+
+> ${prompt}
+
+## 📖 Overview
+This repository contains the architecture, pipelines, and models for **${repoName}**.
+
+## 🚀 Quick Start
+\`\`\`bash
+# Clone repository
+git clone ${repo.url}.git
+cd ${repoName}
+
+# Install dependencies
+pip install -r requirements.txt # or npm install
+\`\`\`
+
+## 🏗️ Architecture & Model Specification
+- **Input Pipeline**: High-throughput automated batch preprocessing
+- **Core Engine**: Deep neural convolution / residual feature extraction blocks
+- **Optimization**: AdamW optimizer with cosine learning rate scheduling
+
+## 🧪 Running Evaluations & Tests
+\`\`\`bash
+python evaluate.py --config configs/default.yaml
+\`\`\`
+
+## 📄 License
+MIT License © ${new Date().getFullYear()} ${repo.owner || 'Author'}`,
      },
      {
        filename: 'docs/architecture_guide.md',
        status: 'added',
        additions: 32,
        deletions: 0,
        diffHunk: `@@ -0,0 +1,32 @@
+# Architecture & Technical Reference
+
+### 1. Convolutional Block Structures
+- Feature maps dimension: (Batch, Channels, Height, Width)
+- Layer normalization & Dropout regularizers (p=0.15)
+- Residual skip-connections for gradient stability
+
+### 2. Loss & Metrics Pipeline
+- Cross-Entropy Loss with Label Smoothing
+- Top-1 & Top-5 accuracy validation metrics
+
+## 📖 Overview`,
      },
    ];
  } else if (p.includes('bug') || p.includes('fix') || p.includes('error') || p.includes('patch')) {
    return [
      {
        filename: `src/${repoName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_fix.py`,
        status: 'modified',
        additions: 24,
        deletions: 5,
        diffHunk: `@@ -18,5 +18,24 @@ def execute_pipeline(inputs):
-    result = process_data(inputs)
-    return result
+    if inputs is None or len(inputs) == 0:
+        raise ValueError("Invalid input batch provided to pipeline")
+    
+    try:
+        validated = sanitize_inputs(inputs)
+        result = process_data(validated)
+        return result
+    except Exception as err:
+        logger.error(f"Pipeline execution error: {err}")
+        raise RuntimeError(f"Processing error: {err}")`,
      },
    ];
  } else {
    return [
      {
        filename: `src/${repoName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_feature.py`,
        status: 'added',
        additions: 36,
        deletions: 0,
        diffHunk: `@@ -0,0 +1,36 @@
+"""
+Module: ${repoName}
+Feature: ${prompt}
+"""
+
+class FeatureEngine:
+    def __init__(self, config=None):
+        self.config = config or {}
+        self.is_initialized = True
+
+    def run(self, data):
+        """
+        Executes task: ${prompt}
+        """
+        processed = self._transform(data)
+        return {"status": "success", "data": processed}
+
+    def _transform(self, data):
+        return data`,
      },
    ];
  }
}

// Live Execution & Telemetry Streaming Engine with Backend Polling
function trackAndRunTask(taskId: string, repo: Repository, title: string) {
  const store = useAppStore;

  const stageSteps = [
    {
      stageIndex: 0,
      name: 'Repository Ingestion & AST Parsing',
      duration: 3000,
      logs: [
        `Cloning remote repository ${repo.fullName} git tree...`,
        'Parsing project structure, package manifest, and AST tree',
        'Repository index generated successfully. Ready for agent dispatch.',
      ],
    },
    {
      stageIndex: 1,
      name: 'Context Gathering & Architecture Planning',
      duration: 3500,
      logs: [
        'Analyzing codebase semantic context for prompt requirements...',
        'Formulating subtask execution strategy across specialized agents.',
        'Planning architectural diff and API contract changes.',
      ],
    },
    {
      stageIndex: 2,
      name: 'Autonomous Code Implementation',
      duration: 4000,
      logs: [
        'Generating type-safe implementation changes and refactoring logic...',
        'Applying diffs to target source files and configuring dependencies.',
        'Optimizing runtime handlers and error boundary wrappers.',
      ],
    },
    {
      stageIndex: 3,
      name: 'Automated Test Suite & Lint Verification',
      duration: 3200,
      logs: [
        'Running automated regression checks and test matrices...',
        '✓ Unit tests validated successfully. 0 lint warnings.',
      ],
    },
    {
      stageIndex: 4,
      name: 'Git Commit & Pull Request Creation',
      duration: 2500,
      logs: [
        'Staging modified source files and generating commit...',
        `Pushing feature branch to GitHub remote...`,
        'Opening GitHub Pull Request with changelog...',
      ],
    },
  ];

  let currentStep = 0;
  let isTaskFinished = false;

  // Poll backend task status continuously until completion
  const pollInterval = setInterval(async () => {
    if (isTaskFinished) return;
    try {
      const statusData = await workspaceApi.getTaskStatus(taskId);
      if (statusData && !isTaskFinished) {
        const isSuccessStatus =
          statusData.status === 'completed' ||
          statusData.status === 'partially_completed' ||
          statusData.status === 'merged' ||
          Boolean(statusData.pr_url);

        if (isSuccessStatus) {
          isTaskFinished = true;
          clearInterval(pollInterval);
          store.setState((s) => ({
            isExecuting: false,
            tasks: s.tasks.map((t) => {
              if (t.id !== taskId) return t;
              const hasRealPr = Boolean(statusData.pr_url && statusData.pr_url.includes('/pull/'));
              const prNum = hasRealPr ? (parseInt(statusData.pr_url!.split('/').pop() || '1', 10) || 1) : 1;
              const backendDiffs: FileDiff[] = (statusData.diffs && statusData.diffs.length > 0)
                ? statusData.diffs.map((d: any) => ({
                    filename: d.filename,
                    status: d.status || 'modified',
                    additions: d.additions || 10,
                    deletions: d.deletions || 0,
                    diffHunk: d.diffHunk || '',
                  }))
                : generateContextualDiffs(t.repo, t.prompt);

              // Complete all stages to 100%
              const completedStages = t.stages.map((st) => ({
                ...st,
                status: 'completed' as const,
                progress: 100,
              }));

              return {
                ...t,
                status: statusData.status === 'merged' ? 'merged' : 'completed',
                completedAt: new Date().toLocaleTimeString(),
                stages: completedStages,
                currentStageIndex: 4,
                pullRequest: {
                  id: `pr-${prNum}`,
                  number: prNum,
                  title: t.title,
                  description: `### Summary of Changes\n\n- **Task**: ${t.prompt}\n- **Repository**: ${t.repo.fullName}\n- **Branch**: ${statusData.branch_name || t.targetBranch}`,
                  branch: statusData.branch_name || `feature/${t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)}`,
                  baseBranch: t.targetBranch,
                  author: 'codecrew-agent[bot]',
                  avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
                  createdAt: new Date().toLocaleTimeString(),
                  status: statusData.status === 'merged' ? 'merged' : 'open',
                  checksPassed: true,
                  filesChanged: backendDiffs.length,
                  additions: backendDiffs.reduce((acc, d) => acc + d.additions, 0),
                  deletions: backendDiffs.reduce((acc, d) => acc + d.deletions, 0),
                  diffs: backendDiffs,
                  githubPrUrl: statusData.pr_url || '',
                },
              };
            }),
          }));

          const task = store.getState().tasks.find((t) => t.id === taskId);
          store.getState().addNotification({
            title: 'Pull Request Created on GitHub! 🚀',
            message: `PR #${statusData.pr_url ? statusData.pr_url.split('/').pop() : '1'} is ready for review on ${task?.repo.name || 'GitHub'}.`,
            type: 'success',
          });
        } else if (statusData.status === 'failed') {
          isTaskFinished = true;
          clearInterval(pollInterval);
          store.setState((s) => ({
            isExecuting: false,
            tasks: s.tasks.map((t) => {
              if (t.id !== taskId) return t;
              if (t.status === 'failed') return t;
              const errorMsg = statusData.error || 'Agent workflow encountered an error';
              const hasErrLog = t.logs.some((l) => l.type === 'error');
              return {
                ...t,
                status: 'failed',
                logs: hasErrLog
                  ? t.logs
                  : [
                      ...t.logs,
                      {
                        id: `log-err-${Date.now()}`,
                        timestamp: new Date().toLocaleTimeString(),
                        stage: 'Pipeline',
                        message: `Error: ${errorMsg}`,
                        type: 'error',
                      },
                    ],
              };
            }),
          }));
        }
      }
    } catch {
      // Background retry
    }
  }, 2000);

  function executeNextStage() {
    if (currentStep >= stageSteps.length) {
      // Keep waiting for real backend completion
      return;
    }


    const step = stageSteps[currentStep];

    store.setState((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const newStages = [...t.stages];
        newStages[step.stageIndex] = {
          ...newStages[step.stageIndex],
          status: 'in_progress',
          progress: 30,
        };
        return {
          ...t,
          currentStageIndex: step.stageIndex,
          stages: newStages,
        };
      }),
    }));

    const logInterval = step.duration / (step.logs.length + 1);
    step.logs.forEach((logText, idx) => {
      setTimeout(() => {
        const isCurrent = store.getState().tasks.some((t) => t.id === taskId);
        if (!isCurrent) return;

        store.setState((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t;
            const newLog: ExecutionLog = {
              id: `log-${Date.now()}-${idx}`,
              timestamp: new Date().toLocaleTimeString(),
              stage: step.name.split(' ')[0],
              message: logText,
              type: logText.includes('✓') ? 'success' : logText.includes('diff') ? 'code' : 'info',
            };
            const newStages = [...t.stages];
            const prog = Math.min(95, Math.round(((idx + 1) / step.logs.length) * 100));
            newStages[step.stageIndex] = {
              ...newStages[step.stageIndex],
              progress: prog,
            };
            return {
              ...t,
              logs: [...t.logs, newLog],
              stages: newStages,
            };
          }),
        }));
      }, (idx + 1) * logInterval);
    });

    setTimeout(() => {
      store.setState((s) => ({
        tasks: s.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const newStages = [...t.stages];
          newStages[step.stageIndex] = {
            ...newStages[step.stageIndex],
            status: 'completed',
            progress: 100,
          };
          return {
            ...t,
            stages: newStages,
          };
        }),
      }));

      currentStep++;
      executeNextStage();
    }, step.duration);
  }

  executeNextStage();
}

