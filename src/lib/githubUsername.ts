export const githubUsernamePattern =
  /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export function isValidGitHubUsername(username: string) {
  return githubUsernamePattern.test(username.trim());
}
