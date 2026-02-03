import type { AIClient, RoastResult } from "@/ai/AIClient";
import type { RoastInput } from "@/lib/types";

export class MockAIClient implements AIClient {
  async generateRoast(_input: RoastInput): Promise<RoastResult> {
    return {
      messages: [
        "Your commit history reads like a minimalist novel—short, intentional, and a little quiet.",
        "The repo names suggest you iterate fast, which is efficient, if not always memorable.",
        "Still, your code cadence is clean and steady, and that discipline shows."
      ]
    };
  }
}
