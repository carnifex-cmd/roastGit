import type { AIClient, RoastResult } from "@/ai/AIClient";
import type { RoastInput } from "@/lib/types";

export class MockAIClient implements AIClient {
  async generateRoast(_input: RoastInput): Promise<RoastResult> {
    return {
      messages: [
        "Your commit history reads like a minimalist novel—short, intentional, and a little quiet.",
        "The repo names suggest you iterate fast, which is efficient, if not always memorable.",
        "Still, your code cadence is clean and steady, and that discipline shows."
      ],
      observation: "You ship code like you're afraid someone might actually read it.",
      patternNoticed: "Weekend warrior commits suggest a 9-to-5 that doesn't know about your side quests.",
      publicPerception: "Your GitHub says 'I build things' but the README says 'figure it out yourself.'",
      verdict: "Quietly competent, aggressively undocumented.",
      profileScore: 62,
      finalLine: "You're one good README away from being taken seriously."
    };
  }
}
