import { NextResponse } from "next/server";
import { compareProfiles } from "@/lib/compare";
import { UserNotFoundError } from "@/lib/github";
import { isValidGitHubUsername } from "@/lib/githubUsername";
import { getRequestKey, rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const { leftUsername, rightUsername } = (await request.json()) as {
    leftUsername?: string;
    rightUsername?: string;
  };

  const left = leftUsername?.trim() ?? "";
  const right = rightUsername?.trim() ?? "";

  if (!isValidGitHubUsername(left) || !isValidGitHubUsername(right)) {
    return NextResponse.json(
      { error: "Both GitHub usernames must be valid." },
      { status: 400 }
    );
  }

  if (left.toLowerCase() === right.toLowerCase()) {
    return NextResponse.json(
      { error: "Choose two different GitHub usernames." },
      { status: 400 }
    );
  }

  const key = getRequestKey(request.headers);
  const limit = await rateLimit(`compare:${key}`, 4, 60_000);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again shortly." },
      {
        status: 429,
        headers: {
          "x-ratelimit-remaining": "0",
          "x-ratelimit-reset": limit.resetAt.toString()
        }
      }
    );
  }

  try {
    const comparison = await compareProfiles(left, right);
    return NextResponse.json(comparison, {
      headers: {
        "x-ratelimit-remaining": limit.remaining.toString(),
        "x-ratelimit-reset": limit.resetAt.toString()
      }
    });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
