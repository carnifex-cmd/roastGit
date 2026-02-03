import type {
  GitHubComment,
  GitHubCommit,
  GitHubProfile,
  GitHubRepo
} from "@/lib/types";
import { paginate } from "@/lib/pagination";

const API_BASE = "https://api.github.com";

async function fetchGitHubJSON<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub request failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as T;
}

export async function getProfile(username: string): Promise<GitHubProfile> {
  return fetchGitHubJSON<GitHubProfile>(`/users/${username}`);
}

export async function getRecentRepos(
  username: string,
  limit = 5
): Promise<GitHubRepo[]> {
  const repos = await fetchGitHubJSON<GitHubRepo[]>(
    `/users/${username}/repos?per_page=${limit}&sort=updated`
  );
  return repos.slice(0, limit);
}

export async function getRecentCommits(
  username: string,
  repos: GitHubRepo[],
  limit = 10
): Promise<GitHubCommit[]> {
  const commits: GitHubCommit[] = [];

  for (const repo of repos) {
    if (commits.length >= limit) break;

    const repoCommits = await paginate(
      async (page, perPage) => {
        const data = await fetchGitHubJSON<
          {
            commit?: { message?: string; author?: { date?: string } };
          }[]
        >(
          `/repos/${repo.full_name}/commits?author=${username}&per_page=${perPage}&page=${page}`
        );

        return data.map((item) => ({
          repo: repo.name,
          message: item.commit?.message ?? "(no message)",
          date: item.commit?.author?.date ?? repo.updated_at
        }));
      },
      limit - commits.length,
      { perPage: 10, maxPages: 3 }
    );

    commits.push(...repoCommits);
  }

  return commits.slice(0, limit);
}

export async function getRecentComments(
  username: string,
  limit = 5
): Promise<GitHubComment[]> {
  const comments = await paginate(
    async (page, perPage) => {
      const events = await fetchGitHubJSON<
        {
          type: string;
          repo: { name: string };
          created_at: string;
          payload?: { comment?: { body?: string } };
        }[]
      >(`/users/${username}/events/public?per_page=${perPage}&page=${page}`);
      return events
        .filter((event) =>
          ["IssueCommentEvent", "PullRequestReviewCommentEvent"].includes(
            event.type
          )
        )
        .map((event) => ({
          repo: event.repo.name,
          body: event.payload?.comment?.body ?? "",
          date: event.created_at
        }))
        .filter((comment) => comment.body.trim().length > 0);
    },
    limit,
    { perPage: 50, maxPages: 3 }
  );

  return comments;
}
