import type { AIClient, RoastResult } from "@/ai/AIClient";
import type { RoastInput } from "@/lib/types";

const PROMPT_TEMPLATE = `You are a witty senior developer roasting a GitHub profile.

Rules:
- Dry humor only
- Clever > loud
- Roast habits, not the person
- Never be abusive
- Be opinionated and slightly uncomfortable
- Never instructional or HR-like

GitHub Profile Summary:
{{profile_summary}}

Recent Repositories:
{{recent_repos}}

Recent Commits (summarized):
{{recent_commits}}

Recent Comments (if any):
{{recent_comments}}

IMPORTANT OUTPUT FORMAT:
You MUST respond with a valid JSON object. Do NOT include markdown code blocks, backticks, or any text outside the JSON.

The JSON must contain:
1. "messages": Array of exactly 3 short roast messages (1-2 lines each). These are the chat roasts.
2. "observation": A single synthesized verdict statement combining themes from your roasts. Opinionated, dry.
3. "patternNoticed": What pattern the roasts revealed about this profile. Observational, slightly cutting.
4. "publicPerception": How this profile reads to a stranger looking at it. Honest, uncomfortable if warranted.
5. "verdict": The final judgment of what it all adds up to. Conclusive, no padding.
6. "profileScore": Integer 0-100 rating how this GitHub profile comes across to a stranger. Be harsh. High effort ≠ high score. Confusing/sparse profiles score lower. Clear/intentional profiles may score higher. This is subjective judgment, not a metric.
7. "finalLine": Exactly one sentence. The closing punch. Derived from your roasts. Dry, clever, screenshot-worthy. NOT a compliment.

Example output structure:
{"messages": ["First roast.", "Second roast.", "Third roast."], "observation": "...", "patternNoticed": "...", "publicPerception": "...", "verdict": "...", "profileScore": 62, "finalLine": "..."}

Respond ONLY with the JSON object.`;



type ParsedAIResponse = {
  messages?: string[];
  observation?: string;
  patternNoticed?: string;
  publicPerception?: string;
  verdict?: string;
  profileScore?: number;
  finalLine?: string;
};

function parseJsonResponse(content: string): RoastResult {
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
    const parsed = JSON.parse(cleaned) as ParsedAIResponse;

    const messages = Array.isArray(parsed.messages)
      ? parsed.messages.map((m) => String(m).trim()).filter(Boolean)
      : [];

    return {
      messages: messages.length > 0 ? messages : [content.trim()],
      observation: parsed.observation ?? "The profile exists. That's the main observation.",
      patternNoticed: parsed.patternNoticed ?? "A pattern of having a GitHub account.",
      publicPerception: parsed.publicPerception ?? "It reads like a GitHub profile.",
      verdict: parsed.verdict ?? "It's a GitHub profile.",
      profileScore: typeof parsed.profileScore === "number" ? parsed.profileScore : 50,
      finalLine: parsed.finalLine ?? "At least the username was available."
    };
  } catch {
    // Fallback: split by sentence endings for messages, use defaults for rest
    const sentences = content
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      messages: sentences.length > 0 ? sentences.slice(0, 3) : [content.trim()],
      observation: "The profile exists. That's the main observation.",
      patternNoticed: "A pattern of having a GitHub account.",
      publicPerception: "It reads like a GitHub profile.",
      verdict: "It's a GitHub profile.",
      profileScore: 50,
      finalLine: "At least the username was available."
    };
  }
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
        max_tokens: 600
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

    return parseJsonResponse(content);
  }
}
