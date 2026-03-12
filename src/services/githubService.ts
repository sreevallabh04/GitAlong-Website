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
  owner?: {
    login: string;
    avatar_url: string;
  };
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

const GITHUB_API = 'https://api.github.com';

async function githubFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };

  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(`${GITHUB_API}${path}`, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

class GitHubService {
  async getUser(username: string): Promise<GitHubUser> {
    return githubFetch(`/users/${username}`);
  }

  async getUserRepositories(username: string): Promise<Repository[]> {
    return githubFetch(`/users/${username}/repos?sort=updated&per_page=30`);
  }

  async getRepositoryReadme(owner: string, repo: string): Promise<string> {
    try {
      const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
        headers: {
          'Accept': 'application/vnd.github.v3.html',
          ...(import.meta.env.VITE_GITHUB_TOKEN
            ? { 'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}` }
            : {}),
        },
      });
      if (!response.ok) return 'README not available';
      return response.text();
    } catch {
      return 'README not available';
    }
  }

  async getRepositoryCommits(owner: string, repo: string): Promise<Commit[]> {
    return githubFetch(`/repos/${owner}/${repo}/commits?per_page=10`);
  }

  async getTrendingRepositories(language?: string): Promise<Repository[]> {
    const dateThreshold = new Date();
    dateThreshold.setMonth(dateThreshold.getMonth() - 3);
    const dateStr = dateThreshold.toISOString().split('T')[0];

    const langFilter = language ? `+language:${encodeURIComponent(language)}` : '';
    const data = await githubFetch<{ items: Repository[] }>(
      `/search/repositories?q=created:>${dateStr}${langFilter}&sort=stars&order=desc&per_page=20`
    );
    return data.items;
  }
}

export const githubService = new GitHubService(); 
