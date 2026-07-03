import type {
  GitHubComment,
  GitHubCommit,
  GitHubProfile,
  GitHubRepo,
  ProfileScore,
  ProfileScoreBreakdown,
  ProfileScoreGrade
} from "@/lib/types";

const SCORER_VERSION = "v2";
const DAY_MS = 24 * 60 * 60 * 1000;

type ScoreInput = {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  commits: GitHubCommit[];
  comments: GitHubComment[];
  evaluatedAt?: Date;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function daysSince(value: string, evaluatedAt: Date) {
  const time = new Date(value).getTime();
  if (!Number.isFinite(time)) return Number.POSITIVE_INFINITY;
  return Math.max(0, (evaluatedAt.getTime() - time) / DAY_MS);
}

function ratio(count: number, cap: number) {
  if (cap <= 0) return 0;
  return clamp(count / cap, 0, 1);
}

function logRatio(value: number, cap: number) {
  return clamp(Math.log10(Math.max(0, value) + 1) / Math.log10(cap + 1), 0, 1);
}

function hasText(value: string | null | undefined) {
  return Boolean(value && value.trim().length > 0);
}

function hasUsefulText(value: string | null | undefined) {
  return Boolean(value && value.trim().length >= 8);
}

function isUsefulCommitMessage(message: string) {
  const cleaned = message.trim().toLowerCase();
  if (cleaned.length < 4) return false;
  return !["update", "fix", "changes", "wip", "test", "commit"].includes(cleaned);
}

function roundCategory(value: number) {
  return Math.round(value * 10) / 10;
}

function getGrade(score: number): ProfileScoreGrade {
  if (score <= 20) return "Empty";
  if (score <= 40) return "Minimal";
  if (score <= 60) return "Average";
  if (score <= 80) return "Solid";
  return "Standout";
}

function scoreProfileCompleteness(profile: GitHubProfile, evaluatedAt: Date) {
  let score = 0;
  if (hasText(profile.name)) score += 2;
  if (hasText(profile.bio)) score += 3;
  if (daysSince(profile.created_at, evaluatedAt) >= 183) score += 2;
  if (daysSince(profile.created_at, evaluatedAt) >= 365) score += 1;
  if (daysSince(profile.updated_at, evaluatedAt) <= 365) score += 2;
  return score;
}

function scoreRepositoryPortfolio(
  profile: GitHubProfile,
  repos: GitHubRepo[],
  evaluatedAt: Date
) {
  const sampledRepoCount = Math.max(1, repos.length);
  const languages = new Set(repos.map((repo) => repo.language).filter(Boolean));
  const nonForkRepos = repos.filter((repo) => !repo.fork).length;
  const recentlyUpdatedRepos = repos.filter(
    (repo) => daysSince(repo.updated_at, evaluatedAt) <= 365
  ).length;

  return (
    ratio(profile.public_repos, 25) * 10 +
    ratio(repos.length, 20) * 5 +
    ratio(nonForkRepos, sampledRepoCount) * 8 +
    ratio(languages.size, 5) * 6 +
    ratio(recentlyUpdatedRepos, sampledRepoCount) * 6
  );
}

function scoreActivity(
  profile: GitHubProfile,
  repos: GitHubRepo[],
  commits: GitHubCommit[],
  comments: GitHubComment[],
  evaluatedAt: Date
) {
  const sampledRepoCount = Math.max(1, repos.length);
  const recentlyUpdatedRepos = repos.filter(
    (repo) => daysSince(repo.updated_at, evaluatedAt) <= 90
  ).length;
  const activeCommitRepos = new Set(commits.map((commit) => commit.repo)).size;

  return (
    (daysSince(profile.updated_at, evaluatedAt) <= 180 ? 4 : 0) +
    ratio(recentlyUpdatedRepos, sampledRepoCount) * 8 +
    ratio(commits.length, 20) * 12 +
    ratio(activeCommitRepos, 4) * 4 +
    ratio(comments.length, 5) * 2
  );
}

function scorePublicSignal(profile: GitHubProfile, repos: GitHubRepo[]) {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const starredRepos = repos.filter((repo) => repo.stargazers_count > 0).length;

  return (
    logRatio(profile.followers, 1000) * 3 +
    logRatio(totalStars, 100) * 5 +
    ratio(starredRepos, 5) * 2
  );
}

function scorePresentationQuality(repos: GitHubRepo[], commits: GitHubCommit[]) {
  const sampledRepoCount = Math.max(1, repos.length);
  const describedRepos = repos.filter((repo) => hasUsefulText(repo.description)).length;
  const usefulCommits = commits.filter((commit) => isUsefulCommitMessage(commit.message)).length;
  const enoughPublicData = repos.length >= 3 || commits.length >= 3;

  return (
    ratio(describedRepos, sampledRepoCount) * 8 +
    ratio(usefulCommits, Math.max(1, commits.length)) * 4 +
    (enoughPublicData ? 3 : 0)
  );
}

export function calculateProfileScore({
  profile,
  repos,
  commits,
  comments,
  evaluatedAt = new Date()
}: ScoreInput): ProfileScore {
  const breakdown: ProfileScoreBreakdown = {
    profileCompleteness: roundCategory(scoreProfileCompleteness(profile, evaluatedAt)),
    repositoryPortfolio: roundCategory(scoreRepositoryPortfolio(profile, repos, evaluatedAt)),
    activity: roundCategory(scoreActivity(profile, repos, commits, comments, evaluatedAt)),
    publicSignal: roundCategory(scorePublicSignal(profile, repos)),
    presentationQuality: roundCategory(scorePresentationQuality(repos, commits))
  };

  const score = Math.round(
    clamp(
      breakdown.profileCompleteness +
        breakdown.repositoryPortfolio +
        breakdown.activity +
        breakdown.publicSignal +
        breakdown.presentationQuality
    )
  );

  return {
    score,
    grade: getGrade(score),
    breakdown,
    scorerVersion: SCORER_VERSION
  };
}

export function formatProfileScore(score: ProfileScore) {
  const breakdown = score.breakdown;
  return [
    `Deterministic profile score: ${score.score}/100`,
    `Grade: ${score.grade}`,
    `Scorer version: ${score.scorerVersion}`,
    "Breakdown:",
    `- Profile completeness: ${breakdown.profileCompleteness}/10`,
    `- Repository portfolio: ${breakdown.repositoryPortfolio}/35`,
    `- Activity: ${breakdown.activity}/30`,
    `- Public signal: ${breakdown.publicSignal}/10`,
    `- Presentation quality: ${breakdown.presentationQuality}/15`
  ].join("\n");
}
