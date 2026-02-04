import type { AIClient } from "@/ai/AIClient";
import { MockAIClient } from "@/ai/MockAIClient";
import { OpenAIProvider } from "@/ai/providers/OpenAIProvider";
import { PerplexityProvider } from "@/ai/providers/PerplexityProvider";

const provider = process.env.AI_PROVIDER ?? "mock";

export function getAIClient(): AIClient {
  switch (provider) {
    case "openai":
      return new OpenAIProvider();
    case "perplexity":
      return new PerplexityProvider();
    case "mock":
    default:
      return new MockAIClient();
  }
}
