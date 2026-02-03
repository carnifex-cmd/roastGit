import type { AIClient, RoastResult } from "@/ai/AIClient";
import type { RoastInput } from "@/lib/types";

const PROMPT_TEMPLATE = `You are a witty senior developer roasting a GitHub profile.

Rules:
- Dry humor only
- Clever > loud
- Short responses (1–2 lines)
- Roast habits, not the person
- Never be abusive
- Include exactly ONE sincere compliment

GitHub Profile Summary:
{{profile_summary}}

Recent Repositories:
{{recent_repos}}

Recent Commits (summarized):
{{recent_commits}}

Recent Comments (if any):
{{recent_comments}}

Conversation Stage:
{{stage}} 
(Stage can be: opening | reply | final)

Respond ONLY with the roast message.`;

export class OpenAIClient implements AIClient {
  async generateRoast(input: RoastInput): Promise<RoastResult> {
    const prompt = PROMPT_TEMPLATE
      .replace("{{profile_summary}}", input.profileSummary)
      .replace("{{recent_repos}}", input.recentRepos)
      .replace("{{recent_commits}}", input.recentCommits)
      .replace("{{recent_comments}}", input.recentComments)
      .replace("{{stage}}", input.stage);

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
        max_tokens: 120
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const message = data.choices?.[0]?.message?.content?.trim();
    if (!message) {
      throw new Error("OpenAI returned an empty response.");
    }

    return { message };
  }
}
