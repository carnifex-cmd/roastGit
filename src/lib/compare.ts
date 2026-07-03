import { getAIClient } from "@/ai";
import { getRecentComments, getRecentCommits, getRecentRepos, getProfile } from "@/lib/github";
import { calculateProfileScore } from "@/lib/profileScore";
import type {
  CompareSide,
  ComparedProfile,
  ComparisonAIInput,
  ComparisonCategoryResult,
  ComparisonOutput,
  GitHubComment,
  GitHubCommit,
  GitHubRepo,
  ProfileScoreBreakdown
} from "@/lib/types";

const REPO_SAMPLE_LIMIT = 20;
const COMMIT_SAMPLE_LIMIT = 20;

const CATEGORY_LABELS: Record<keyof ProfileScoreBreakdown, string> = {
  repositoryPortfolio: "Repository substance",
  activity: "Activity",
  presentationQuality: "Project presentation",
  publicSignal: "Public signal",
  profileCompleteness: "Profile polish"
};

const CATEGORY_ORDER: (keyof ProfileScoreBreakdown)[] = [
  "repositoryPortfolio",
  "activity",
  "presentationQuality",
  "publicSignal",
  "profileCompleteness"
];

async function getComparedProfile(username: string): Promise<ComparedProfile> {
  const profile = await getProfile(username);

  const [reposResult, commentsResult] = await Promise.allSettled([
    getRecentRepos(username, REPO_SAMPLE_LIMIT),
    getRecentComments(username, 5)
  ]);

  const repos: GitHubRepo[] = reposResult.status === "fulfilled" ? reposResult.value : [];
  const comments: GitHubComment[] = commentsResult.status === "fulfilled" ? commentsResult.value : [];

  let commits: GitHubCommit[] = [];
  if (repos.length > 0) {
    try {
      commits = await getRecentCommits(username, repos, COMMIT_SAMPLE_LIMIT);
    } catch {
      commits = [];
    }
  }

  const profileScore = calculateProfileScore({
    profile,
    repos,
    commits,
    comments
  });

  return {
    username: profile.login,
    score: profileScore.score,
    grade: profileScore.grade,
    breakdown: profileScore.breakdown,
    scorerVersion: profileScore.scorerVersion
  };
}

function getCategoryWinner(leftValue: number, rightValue: number): CompareSide | null {
  if (leftValue === rightValue) return null;
  return leftValue > rightValue ? "left" : "right";
}

function buildCategoryResults(
  left: ComparedProfile,
  right: ComparedProfile
): ComparisonCategoryResult[] {
  return CATEGORY_ORDER.map((key) => {
    const leftValue = left.breakdown[key];
    const rightValue = right.breakdown[key];

    return {
      key,
      name: CATEGORY_LABELS[key],
      leftValue,
      rightValue,
      winner: getCategoryWinner(leftValue, rightValue)
    };
  });
}

function getWinner(left: ComparedProfile, right: ComparedProfile): CompareSide | null {
  if (left.score === right.score) return null;
  return left.score > right.score ? "left" : "right";
}

export async function compareProfiles(
  leftUsername: string,
  rightUsername: string
): Promise<ComparisonOutput> {
  const [left, right] = await Promise.all([
    getComparedProfile(leftUsername),
    getComparedProfile(rightUsername)
  ]);

  const winnerSide = getWinner(left, right);
  const winner = winnerSide === "left" ? left.username : winnerSide === "right" ? right.username : null;
  const scoreDelta = Math.abs(left.score - right.score);
  const categoryResults = buildCategoryResults(left, right);

  const comparisonInput: ComparisonAIInput = {
    left,
    right,
    winner,
    winnerSide,
    scoreDelta,
    categoryResults
  };

  const aiClient = getAIClient();
  const aiResult = await aiClient.generateComparison(comparisonInput);

  return {
    ...comparisonInput,
    battleLines: aiResult.battleLines.slice(0, 3),
    finalVerdict: aiResult.finalVerdict,
    generatedAt: new Date().toISOString()
  };
}
