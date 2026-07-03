export type RoastInput = {
  profileSummary: string;
  recentRepos: string;
  recentCommits: string;
  recentComments: string;
  profileScoreSummary: string;
  stage: "opening" | "reply" | "final";
};

export type ProfileScoreGrade =
  | "Empty"
  | "Minimal"
  | "Average"
  | "Solid"
  | "Standout";

export type ProfileScoreBreakdown = {
  profileCompleteness: number;
  repositoryPortfolio: number;
  activity: number;
  publicSignal: number;
  presentationQuality: number;
};

export type ProfileScore = {
  score: number;
  grade: ProfileScoreGrade;
  breakdown: ProfileScoreBreakdown;
  scorerVersion: string;
};

export type RoastSummary = {
  observation: string;
  patternNoticed: string;
  publicPerception: string;
  verdict: string;
  profileScore: number;
  profileScoreGrade?: ProfileScoreGrade;
  profileScoreBreakdown?: ProfileScoreBreakdown;
  profileScoreVersion?: string;
  finalLine: string;
};

export type RoastOutput = {
  username: string;
  messages: string[];
  summary: RoastSummary;
  generatedAt: string;
};

export type CompareSide = "left" | "right";

export type ComparedProfile = {
  username: string;
  score: number;
  grade: ProfileScoreGrade;
  breakdown: ProfileScoreBreakdown;
  scorerVersion: string;
};

export type ComparisonCategoryResult = {
  key: keyof ProfileScoreBreakdown;
  name: string;
  leftValue: number;
  rightValue: number;
  winner: CompareSide | null;
};

export type ComparisonAIInput = {
  left: ComparedProfile;
  right: ComparedProfile;
  winner: string | null;
  winnerSide: CompareSide | null;
  scoreDelta: number;
  categoryResults: ComparisonCategoryResult[];
};

export type ComparisonAIResult = {
  battleLines: string[];
  finalVerdict: string;
};

export type ComparisonOutput = ComparisonAIInput &
  ComparisonAIResult & {
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
  forks_count?: number;
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
