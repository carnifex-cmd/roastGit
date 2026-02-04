import type { AIClient, RoastResult } from "@/ai/AIClient";
import type { RoastInput } from "@/lib/types";
import { buildPrompt, parseJsonResponse } from "@/ai/shared";

export class OpenAIProvider implements AIClient {
    async generateRoast(input: RoastInput): Promise<RoastResult> {
        const prompt = buildPrompt(input);

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
