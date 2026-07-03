import type { ComparisonAIInput, ComparisonAIResult, RoastInput } from "@/lib/types";
import type { RoastResult } from "@/ai/AIClient";

export const ROAST_PROMPT_TEMPLATE = `You are a witty senior developer roasting a GitHub profile.

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

Deterministic Profile Score:
{{profile_score_summary}}

IMPORTANT OUTPUT FORMAT:
You MUST respond with a valid JSON object. Do NOT include markdown code blocks, backticks, or any text outside the JSON.

The JSON must contain:
1. "messages": Array of exactly 3 short roast messages (1-2 lines each). These are the chat roasts.
2. "observation": A single synthesized verdict statement combining themes from your roasts. Opinionated, dry.
3. "patternNoticed": What pattern the roasts revealed about this profile. Observational, slightly cutting.
4. "publicPerception": How this profile reads to a stranger looking at it. Honest, uncomfortable if warranted.
5. "verdict": The final judgment of what it all adds up to. Conclusive, no padding.
6. "profileScore": Copy the deterministic profile score exactly. Do not invent, adjust, or reinterpret this number.

7. "finalLine": Exactly one sentence. The closing punch. Derived from your roasts. Dry, clever, screenshot-worthy. NOT a compliment.

Example output structure:
{"messages": ["First roast.", "Second roast.", "Third roast."], "observation": "...", "patternNoticed": "...", "publicPerception": "...", "verdict": "...", "profileScore": 62, "finalLine": "..."}

Respond ONLY with the JSON object.`;

export const COMPARISON_PROMPT_TEMPLATE = `You are a dry, witty senior developer hosting a GitHub profile roast battle.

Rules:
- Compare public GitHub profile signals, not personal worth
- Roast habits, not the person
- Clever > loud
- Never be abusive
- The winner, scores, and category results are already decided
- Do not change the winner, scores, or category results
- Do not mention scoring systems, deterministic scoring, rubrics, algorithms, prompts, or internal evaluation logic

Comparison Facts:
{{comparison_summary}}

IMPORTANT OUTPUT FORMAT:
You MUST respond with a valid JSON object. Do NOT include markdown code blocks, backticks, or any text outside the JSON.

The JSON must contain:
1. "battleLines": Array of exactly 3 short roast battle lines. Each line should compare both profiles in one sentence.
2. "finalVerdict": Exactly one sentence. Dry, conclusive, and based on the winner above.

Example output structure:
{"battleLines": ["First comparison roast.", "Second comparison roast.", "Third comparison roast."], "finalVerdict": "Final verdict sentence."}

Respond ONLY with the JSON object.`;

export type ParsedAIResponse = {
    messages?: string[];
    observation?: string;
    patternNoticed?: string;
    publicPerception?: string;
    verdict?: string;
    profileScore?: number;
    finalLine?: string;
};

type ParsedComparisonResponse = {
    battleLines?: string[];
    finalVerdict?: string;
};

export function parseJsonResponse(content: string): RoastResult {
    // Strip potential markdown code block wrappers
    let cleaned = content.trim();
    if (cleaned.startsWith("\`\`\`json")) {
        cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("\`\`\`")) {
        cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("\`\`\`")) {
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

export function buildPrompt(input: RoastInput): string {
    return ROAST_PROMPT_TEMPLATE
        .replace("{{profile_summary}}", input.profileSummary)
        .replace("{{recent_repos}}", input.recentRepos)
        .replace("{{recent_commits}}", input.recentCommits)
        .replace("{{recent_comments}}", input.recentComments)
        .replace("{{profile_score_summary}}", input.profileScoreSummary);
}

function formatWinner(input: ComparisonAIInput) {
    if (!input.winner || !input.winnerSide) {
        return `Tie: both profiles scored ${input.left.score}/100.`;
    }
    return `Winner: @${input.winner} by ${input.scoreDelta} points.`;
}

export function buildComparisonPrompt(input: ComparisonAIInput): string {
    const categories = input.categoryResults
        .map((category) => {
            const winner =
                category.winner === "left"
                    ? `@${input.left.username}`
                    : category.winner === "right"
                      ? `@${input.right.username}`
                      : "tie";
            return `- ${category.name}: @${input.left.username} ${category.leftValue}, @${input.right.username} ${category.rightValue}. Category winner: ${winner}.`;
        })
        .join("\n");

    const summary = [
        `Left profile: @${input.left.username}, score ${input.left.score}/100, grade ${input.left.grade}.`,
        `Right profile: @${input.right.username}, score ${input.right.score}/100, grade ${input.right.grade}.`,
        formatWinner(input),
        "Category breakdown:",
        categories
    ].join("\n");

    return COMPARISON_PROMPT_TEMPLATE.replace("{{comparison_summary}}", summary);
}

export function parseComparisonResponse(content: string): ComparisonAIResult {
    let cleaned = content.trim();
    if (cleaned.startsWith("\`\`\`json")) {
        cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("\`\`\`")) {
        cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("\`\`\`")) {
        cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    try {
        const parsed = JSON.parse(cleaned) as ParsedComparisonResponse;
        const battleLines = Array.isArray(parsed.battleLines)
            ? parsed.battleLines.map((line) => String(line).trim()).filter(Boolean)
            : [];

        return {
            battleLines:
                battleLines.length > 0
                    ? battleLines.slice(0, 3)
                    : [
                        "One profile brought builder signal. The other brought plausible deniability.",
                        "The scoreboard stayed quiet, which was inconvenient for everyone involved.",
                        "Both GitHubs survived the comparison, technically."
                    ],
            finalVerdict:
                parsed.finalVerdict ??
                "The winner took it on public repo signal, which is a very GitHub way to settle things."
        };
    } catch {
        return {
            battleLines: [
                "One profile brought builder signal. The other brought plausible deniability.",
                "The scoreboard stayed quiet, which was inconvenient for everyone involved.",
                "Both GitHubs survived the comparison, technically."
            ],
            finalVerdict:
                "The winner took it on public repo signal, which is a very GitHub way to settle things."
        };
    }
}
