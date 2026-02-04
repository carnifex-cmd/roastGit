import { NextResponse } from "next/server";
import { getRoast } from "@/lib/roast";
import { getRequestKey, rateLimit } from "@/lib/rateLimit";
import { UserNotFoundError } from "@/lib/github";

export async function POST(request: Request) {
  const { username } = (await request.json()) as { username?: string };

  if (!username || username.trim().length === 0) {
    return NextResponse.json(
      { error: "Username is required." },
      { status: 400 }
    );
  }

  const key = getRequestKey(request.headers);
  const limit = await rateLimit(key, 6, 60_000);

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
    const roast = await getRoast(username.trim());
    return NextResponse.json(roast, {
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
