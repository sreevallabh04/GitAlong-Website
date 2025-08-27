import { Octokit } from '@octokit/rest';

// Initialize Octokit with GitHub API
const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN || undefined,
});

// Check if GitHub API is available
const isGitHubAvailable = () => {
  return !!import.meta.env.VITE_GITHUB_TOKEN;
};

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  location: string;
  company: string;
  blog: string;
  twitter_username: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  visibility: string;
  default_branch: string;
}

export interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  };
}

class GitHubService {

  // Get user profile
  async getUser(username: string): Promise<GitHubUser> {
    try {
      if (!isGitHubAvailable()) {
        throw new Error('GitHub API is not configured. Please add VITE_GITHUB_TOKEN to your environment variables.');
      }

      const response = await octokit.users.getByUsername({ username });
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Get user repositories
  async getUserRepositories(username: string): Promise<Repository[]> {
    try {
      if (!isGitHubAvailable()) {
        throw new Error('GitHub API is not configured. Please add VITE_GITHUB_TOKEN to your environment variables.');
      }

      const response = await octokit.repos.listForUser({ username });
      return response.data;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }

  // Get repository README
  async getRepositoryReadme(owner: string, repo: string): Promise<string> {
    try {
      const response = await octokit.repos.getReadme({
        owner,
        repo,
        mediaType: {
          format: 'html'
        }
      });

      return response.data as string;
    } catch (error) {
      console.error('Error fetching README:', error);
      return 'README not available';
    }
  }

  // Get repository commits
  async getRepositoryCommits(owner: string, repo: string): Promise<Commit[]> {
    try {
      const response = await octokit.repos.listCommits({
        owner,
        repo,
        per_page: 10
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching commits:', error);
      throw error;
    }
  }

  // Get trending repositories
  async getTrendingRepositories(): Promise<Repository[]> {
    try {
      const response = await octokit.search.repos({
        q: 'created:>2024-01-01',
        sort: 'stars',
        order: 'desc',
        per_page: 10
      });

      return response.data.items;
    } catch (error) {
      console.error('Error fetching trending repositories:', error);
      throw error;
    }
  }
}

export const githubService = new GitHubService(); 