/**
 * Workspace API Service
 * Handles communication with the FastAPI Backend for Repositories and Agent Tasks.
 */

import { Repository } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface CreateTaskPayload {
  repoUrl: string;
  taskDescription: string;
  baseBranch?: string;
  githubToken?: string;
  sessionId?: string;
}

export interface TaskStatusResponse {
  task_id: string;
  session_id?: string | null;
  status: 'queued' | 'running' | 'completed' | 'partially_completed' | 'failed' | 'merged';
  repo_url: string;
  task_description: string;
  base_branch: string;
  branch_name?: string | null;
  pr_url?: string | null;
  diffs?: Array<{ filename: string; status: string; additions: number; deletions: number; diffHunk: string }>;
  completed_tasks?: Array<{ id: string; description: string; agent: string }>;
  failed_tasks?: Array<{ id: string; description: string; error?: string }>;
  error?: string | null;
}


export interface TaskListItem {
  task_id: string;
  session_id?: string | null;
  status: string;
  task_description: string;
  repo_url: string;
  base_branch?: string;
  branch_name?: string | null;
  pr_url?: string | null;
  error?: string | null;
  created_at?: string | null;
}

export const workspaceApi = {
  /**
   * Fetch connected or public repositories
   */
  async getRepositories(username?: string): Promise<Repository[]> {
    const url = username
      ? `${API_BASE_URL}/api/repos?username=${encodeURIComponent(username)}`
      : `${API_BASE_URL}/api/repos`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch repositories (${response.status})`);
    }
    return response.json();
  },

  /**
   * Validate a custom GitHub repository URL and fetch branch list
   */
  async validateRepository(url: string): Promise<Repository> {
    const response = await fetch(`${API_BASE_URL}/api/repos/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Could not validate GitHub repository.');
    }

    return response.json();
  },

  /**
   * Submit a new agent task to the backend workflow engine
   */
  async createTask(payload: CreateTaskPayload): Promise<{ taskId: string; sessionId: string; status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repo_url: payload.repoUrl,
        task_description: payload.taskDescription,
        base_branch: payload.baseBranch || 'main',
        github_token: payload.githubToken || null,
        session_id: payload.sessionId || null,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to dispatch task to backend agent.');
    }

    const data = await response.json();
    return {
      taskId: data.task_id,
      sessionId: data.session_id,
      status: data.status,
      message: data.message,
    };
  },

  /**
   * Poll current progress, execution status, branch, and PR URL of a task
   */
  async getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch task status for ${taskId}`);
    }
    return response.json();
  },

  /**
   * Get all past recorded tasks from PostgreSQL
   */
  async getAllTasks(): Promise<TaskListItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/tasks`);
    if (!response.ok) {
      return [];
    }
    return response.json();
  },

  /**
   * Merge task and its PR on GitHub
   */
  async mergeTask(taskId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/merge`, {
      method: 'POST',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to merge PR on GitHub');
    }
    return response.json();
  },

  /**
   * Delete a task record
   */
  async deleteTask(taskId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};
