import type { AIClient } from "@/ai/AIClient";
import { MockAIClient } from "@/ai/MockAIClient";
import { OpenAIClient } from "@/ai/OpenAIClient";

const provider = process.env.AI_PROVIDER ?? "mock";

export function getAIClient(): AIClient {
  switch (provider) {
    case "openai":
      return new OpenAIClient();
    case "mock":
    default:
      return new MockAIClient();
  }
}
