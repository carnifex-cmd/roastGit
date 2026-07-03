import { getAIClient } from "@/ai";
import { getProfile, getRecentComments, getRecentCommits, getRecentRepos } from "@/lib/github";
import { calculateProfileScore, formatProfileScore } from "@/lib/profileScore";
import { buildSummary } from "@/lib/roastSummary";
import type { GitHubComment, GitHubCommit, GitHubRepo, RoastOutput } from "@/lib/types";
import { getCache, setCache, trackRoast } from "@/lib/cache";
import { truncate } from "@/lib/utils";

const CACHE_TTL_MS = 7 * 60 * 1000;
const REPO_SAMPLE_LIMIT = 20;
const COMMIT_SAMPLE_LIMIT = 20;

function formatProfileSummary(profile: Awaited<ReturnType<typeof getProfile>>) {
  return [
    `Username: ${profile.login}`,
    `Name: ${profile.name ?? "(none)"}`,
    `Bio: ${profile.bio ?? "(none)"}`,
    `Public repos: ${profile.public_repos}`,
    `Followers: ${profile.followers}`,
    `Following: ${profile.following}`,
    `Profile created: ${profile.created_at}`,
    `Last updated: ${profile.updated_at}`
  ].join("\n");
}

function formatRepos(repos: GitHubRepo[]) {
  if (repos.length === 0) return "(no recent repositories)";
  return repos
    .map((repo) => {
      const description = repo.description ? truncate(repo.description, 120) : "(no description)";
      return `${repo.name} — ${description}. Updated: ${repo.updated_at}. Stars: ${repo.stargazers_count}. Language: ${repo.language ?? "n/a"}.`;
    })
    .join("\n");
}

function formatCommits(commits: GitHubCommit[]) {
  if (commits.length === 0) return "(no recent commits found)";
  return commits
    .map((commit) => `${commit.repo}: ${truncate(commit.message, 140)} (${commit.date})`)
    .join("\n");
}

function formatComments(comments: GitHubComment[]) {
  if (comments.length === 0) return "(no recent comments found)";
  return comments
    .map((comment) => `${comment.repo}: ${truncate(comment.body, 120)} (${comment.date})`)
    .join("\n");
}

export async function getRoast(username: string): Promise<RoastOutput> {
  const cacheKey = `roast:${username.toLowerCase()}`;
  const cached = await getCache<RoastOutput>(cacheKey);
  if (cached) return cached;

  // Fetch profile first - this is required and will throw UserNotFoundError if user doesn't exist
  const profile = await getProfile(username);

  // Fetch repos, comments with resilience - these can fail without breaking the roast
  const [reposResult, commentsResult] = await Promise.allSettled([
    getRecentRepos(username, REPO_SAMPLE_LIMIT),
    getRecentComments(username, 5)
  ]);

  const repos: GitHubRepo[] = reposResult.status === "fulfilled" ? reposResult.value : [];
  const comments: GitHubComment[] = commentsResult.status === "fulfilled" ? commentsResult.value : [];

  // Commits depend on repos, so only fetch if repos succeeded
  let commits: GitHubCommit[] = [];
  if (repos.length > 0) {
    try {
      commits = await getRecentCommits(username, repos, COMMIT_SAMPLE_LIMIT);
    } catch {
      // Commits fetch failed, proceed without them
    }
  }

  const profileScore = calculateProfileScore({
    profile,
    repos,
    commits,
    comments
  });

  const aiClient = getAIClient();
  const roastResult = await aiClient.generateRoast({
    profileSummary: formatProfileSummary(profile),
    recentRepos: formatRepos(repos),
    recentCommits: formatCommits(commits),
    recentComments: formatComments(comments),
    profileScoreSummary: formatProfileScore(profileScore),
    stage: "final"
  });

  // Use messages directly from AI client (already structured)
  const messages = roastResult.messages;

  const summary = buildSummary(roastResult, profileScore);

  const output: RoastOutput = {
    username: profile.login,
    messages,
    summary,
    generatedAt: new Date().toISOString()
  };

  setCache(cacheKey, output, CACHE_TTL_MS);
  trackRoast(profile.login);
  return output;
}
