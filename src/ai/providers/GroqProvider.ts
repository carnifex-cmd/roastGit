import Groq from "groq-sdk";
import type { AIClient, RoastResult } from "@/ai/AIClient";
import type { RoastInput } from "@/lib/types";
import { buildPrompt, parseJsonResponse } from "@/ai/shared";

const DEFAULT_MODEL = "openai/gpt-oss-120b";

export class GroqProvider implements AIClient {
    async generateRoast(input: RoastInput): Promise<RoastResult> {
        const prompt = buildPrompt(input);

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("Missing GROQ_API_KEY environment variable.");
        }

        const client = new Groq({ apiKey });
        const model = process.env.GROQ_MODEL ?? DEFAULT_MODEL;

        const completion = await client.chat.completions.create({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_completion_tokens: 1024,
            stream: false,
        });

        const content = completion.choices?.[0]?.message?.content?.trim();
        if (!content) {
            throw new Error("Groq returned an empty response.");
        }

        return parseJsonResponse(content);
    }
}
