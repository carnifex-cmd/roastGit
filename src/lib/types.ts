export type RoastInput = {
  profileSummary: string;
  recentRepos: string;
  recentCommits: string;
  recentComments: string;
  stage: "opening" | "reply" | "final";
};

export type RoastSummary = {
  codingHabits: string;
  projectNaming: string;
  consistency: string;
  overallVibe: string;
  score: number;
  compliment: string;
};

export type RoastOutput = {
  username: string;
  messages: string[];
  summary: RoastSummary;
  generatedAt: string;
};

export type GitHubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

export type GitHubRepo = {
  name: string;
  full_name: string;
  description: string | null;
  updated_at: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
};

export type GitHubCommit = {
  repo: string;
  message: string;
  date: string;
};

export type GitHubComment = {
  repo: string;
  body: string;
  date: string;
};
