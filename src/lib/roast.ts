import { getAIClient } from "@/ai";
import { getProfile, getRecentComments, getRecentCommits, getRecentRepos } from "@/lib/github";
import { buildSummary } from "@/lib/roastSummary";
import type { RoastOutput } from "@/lib/types";
import { getCache, setCache } from "@/lib/cache";
import { splitSentences, truncate } from "@/lib/utils";

const CACHE_TTL_MS = 7 * 60 * 1000;

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

function formatRepos(repos: Awaited<ReturnType<typeof getRecentRepos>>) {
  if (repos.length === 0) return "(no recent repositories)";
  return repos
    .map((repo) => {
      const description = repo.description ? truncate(repo.description, 120) : "(no description)";
      return `${repo.name} — ${description}. Updated: ${repo.updated_at}. Stars: ${repo.stargazers_count}. Language: ${repo.language ?? "n/a"}.`;
    })
    .join("\n");
}

function formatCommits(commits: Awaited<ReturnType<typeof getRecentCommits>>) {
  if (commits.length === 0) return "(no recent commits found)";
  return commits
    .map((commit) => `${commit.repo}: ${truncate(commit.message, 140)} (${commit.date})`)
    .join("\n");
}

function formatComments(comments: Awaited<ReturnType<typeof getRecentComments>>) {
  if (comments.length === 0) return "(no recent comments found)";
  return comments
    .map((comment) => `${comment.repo}: ${truncate(comment.body, 120)} (${comment.date})`)
    .join("\n");
}

function splitRoastMessage(message: string) {
  const sentences = splitSentences(message);
  if (sentences.length === 0 && message.trim().length > 0) {
    return [message.trim()];
  }
  if (sentences.length >= 3) return sentences.slice(0, 3);
  if (sentences.length === 2) {
    const tailParts = sentences[1]
      .split(/,|;|—/)
      .map((part) => part.trim())
      .filter(Boolean);
    if (tailParts.length >= 2) {
      return [sentences[0], tailParts[0], tailParts.slice(1).join(", ")];
    }
  }
  if (sentences.length === 1) {
    const parts = message
      .split(/,|;|—/)
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length >= 3) return parts.slice(0, 3);
  }
  return sentences;
}

export async function getRoast(username: string): Promise<RoastOutput> {
  const cacheKey = `roast:${username.toLowerCase()}`;
  const cached = getCache<RoastOutput>(cacheKey);
  if (cached) return cached;

  const [profile, repos, comments] = await Promise.all([
    getProfile(username),
    getRecentRepos(username, 5),
    getRecentComments(username, 5)
  ]);
  const commits = await getRecentCommits(username, repos, 10);

  const aiClient = getAIClient();
  const roastResult = await aiClient.generateRoast({
    profileSummary: formatProfileSummary(profile),
    recentRepos: formatRepos(repos),
    recentCommits: formatCommits(commits),
    recentComments: formatComments(comments),
    stage: "final"
  });

  const messages = splitRoastMessage(roastResult.message);
  const summary = buildSummary({
    profile,
    repos,
    commits,
    comments,
    roastMessage: roastResult.message
  });

  const output: RoastOutput = {
    username: profile.login,
    messages,
    summary,
    generatedAt: new Date().toISOString()
  };

  setCache(cacheKey, output, CACHE_TTL_MS);
  return output;
}
