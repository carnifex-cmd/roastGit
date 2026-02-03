import Perplexity from "@perplexity-ai/perplexity_ai";
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

export class PerplexityClient implements AIClient {
  async generateRoast(input: RoastInput): Promise<RoastResult> {
    const prompt = PROMPT_TEMPLATE
      .replace("{{profile_summary}}", input.profileSummary)
      .replace("{{recent_repos}}", input.recentRepos)
      .replace("{{recent_commits}}", input.recentCommits)
      .replace("{{recent_comments}}", input.recentComments)
      .replace("{{stage}}", input.stage);

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      throw new Error("Missing PERPLEXITY_API_KEY environment variable.");
    }

    const client = new Perplexity();
    const completion = (await client.chat.completions.create({
      model: process.env.PERPLEXITY_MODEL ?? "sonar-pro",
      messages: [{ role: "user", content: prompt }]
    })) as {
      choices?: { message?: { content?: string } }[];
    };

    const message = completion.choices?.[0]?.message?.content?.trim();
    if (!message) {
      throw new Error("Perplexity returned an empty response.");
    }

    return { message };
  }
}
