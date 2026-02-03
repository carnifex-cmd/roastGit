import type { AIClient, RoastResult } from "@/ai/AIClient";
import type { RoastInput } from "@/lib/types";

const PROMPT_TEMPLATE = `You are a witty senior developer roasting a GitHub profile.

Rules:
- Dry humor only
- Clever > loud
- Roast habits, not the person
- Never be abusive
- Include exactly ONE sincere compliment in one of your messages

GitHub Profile Summary:
{{profile_summary}}

Recent Repositories:
{{recent_repos}}

Recent Commits (summarized):
{{recent_commits}}

Recent Comments (if any):
{{recent_comments}}

IMPORTANT OUTPUT FORMAT:
You MUST respond with a valid JSON object containing a "messages" array with exactly 3 short roast messages (1-2 lines each).
Do NOT include markdown code blocks, backticks, or any text outside the JSON.

Example output format:
{"messages": ["First roast message here.", "Second roast message here.", "Third message with a compliment."]}

Respond ONLY with the JSON object.`;

function parseJsonResponse(content: string): string[] {
  // Strip potential markdown code block wrappers
  let cleaned = content.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  try {
    const parsed = JSON.parse(cleaned) as { messages?: string[] };
    if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
      return parsed.messages.map((m) => String(m).trim()).filter(Boolean);
    }
  } catch {
    // Fallback: treat as plain text and split by sentences
  }

  // Fallback: split by sentence endings
  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.length > 0 ? sentences.slice(0, 3) : [content.trim()];
}

export class OpenAIClient implements AIClient {
  async generateRoast(input: RoastInput): Promise<RoastResult> {
    const prompt = PROMPT_TEMPLATE
      .replace("{{profile_summary}}", input.profileSummary)
      .replace("{{recent_repos}}", input.recentRepos)
      .replace("{{recent_commits}}", input.recentCommits)
      .replace("{{recent_comments}}", input.recentComments);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OPENAI_API_KEY environment variable.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("OpenAI returned an empty response.");
    }

    const messages = parseJsonResponse(content);
    return { messages };
  }
}
