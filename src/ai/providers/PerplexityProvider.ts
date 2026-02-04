import Perplexity from "@perplexity-ai/perplexity_ai";
import type { AIClient, RoastResult } from "@/ai/AIClient";
import type { RoastInput } from "@/lib/types";
import { buildPrompt, parseJsonResponse } from "@/ai/shared";

const VALID_MODELS = [
    "sonar-pro",
    "sonar",
    "sonar-deep-research",
    "sonar-reasoning",
    "sonar-reasoning-pro"
] as const;

type PerplexityModel = typeof VALID_MODELS[number];

function getValidatedModel(): PerplexityModel {
    const modelName = process.env.PERPLEXITY_MODEL ?? "sonar-pro";
    if (!VALID_MODELS.includes(modelName as PerplexityModel)) {
        throw new Error(
            `Invalid PERPLEXITY_MODEL: ${modelName}. Valid options: ${VALID_MODELS.join(", ")}`
        );
    }
    return modelName as PerplexityModel;
}

export class PerplexityProvider implements AIClient {
    async generateRoast(input: RoastInput): Promise<RoastResult> {
        const prompt = buildPrompt(input);

        const apiKey = process.env.PERPLEXITY_API_KEY;
        if (!apiKey) {
            throw new Error("Missing PERPLEXITY_API_KEY environment variable.");
        }

        const client = new Perplexity();
        const modelName = getValidatedModel();
        const completion = (await client.chat.completions.create({
            model: modelName,
            messages: [{ role: "user", content: prompt }]
        })) as {
            choices?: { message?: { content?: string } }[];
        };

        const content = completion.choices?.[0]?.message?.content?.trim();
        if (!content) {
            throw new Error("Perplexity returned an empty response.");
        }

        return parseJsonResponse(content);
    }
}
