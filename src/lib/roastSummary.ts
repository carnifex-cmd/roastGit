import type {
  GitHubComment,
  GitHubCommit,
  GitHubProfile,
  GitHubRepo,
  RoastSummary
} from "@/lib/types";
import { clamp, splitSentences, truncate } from "@/lib/utils";

const complimentKeywords = [
  "clean",
  "solid",
  "sharp",
  "thoughtful",
  "impressive",
  "steady",
  "consistent",
  "disciplined",
  "elegant",
  "strong"
];

function extractCompliment(message: string) {
  const sentences = splitSentences(message);
  const match = sentences.find((sentence) =>
    complimentKeywords.some((keyword) =>
      sentence.toLowerCase().includes(keyword)
    )
  );
  return truncate(match ?? sentences[sentences.length - 1] ?? message, 140);
}

export function buildSummary(params: {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  commits: GitHubCommit[];
  comments: GitHubComment[];
  roastMessage: string;
}): RoastSummary {
  const { profile, repos, commits, comments, roastMessage } = params;

  const commitCount = commits.length;
  const repoCount = repos.length;
  const hasComments = comments.length > 0;
  const hasGenericNames = repos.some((repo) =>
    /^(test|demo|sample|final|new|misc|temp)/i.test(repo.name)
  );

  const codingHabits =
    commitCount >= 8
      ? "You commit in tight bursts; the work shows up even when you keep it quiet."
      : commitCount >= 3
      ? "Commits are sparse but deliberate, like you only ship when it matters."
      : "Commits are rare enough to feel curated, which reads as selective or stalled.";

  const projectNaming = hasGenericNames
    ? "Project names lean functional—efficient, a touch forgettable."
    : "Project names are clean and intentional, with minimal clutter.";

  const latestUpdate = repos[0]?.updated_at;
  const earliestUpdate = repos[repos.length - 1]?.updated_at;
  const spreadDays = latestUpdate && earliestUpdate
    ? Math.abs(
        (new Date(latestUpdate).getTime() -
          new Date(earliestUpdate).getTime()) /
          86_400_000
      )
    : 0;

  const consistency =
    spreadDays > 120
      ? "Activity comes in seasons, with noticeable quiet stretches."
      : "Updates land in a tight window, suggesting a focused push.";

  const overallVibe = hasComments
    ? "A calm, builder-first vibe—quiet confidence with occasional commentary."
    : "A quiet, builder-first vibe—minimal noise, mostly shipping.";

  const scoreBase = 70;
  const score = clamp(
    scoreBase + commitCount * 2 + repoCount - (hasGenericNames ? 6 : 0),
    40,
    96
  );

  return {
    codingHabits,
    projectNaming,
    consistency,
    overallVibe,
    score,
    compliment: extractCompliment(roastMessage)
  };
}
