import type { RoastSummary } from "@/lib/types";
import type { RoastResult } from "@/ai/AIClient";

/**
 * Builds the summary from AI-generated verdict fields.
 * The AI now generates all summary content - no local calculation needed.
 */
export function buildSummary(aiResult: RoastResult): RoastSummary {
  return {
    observation: aiResult.observation,
    patternNoticed: aiResult.patternNoticed,
    publicPerception: aiResult.publicPerception,
    verdict: aiResult.verdict,
    profileScore: aiResult.profileScore,
    finalLine: aiResult.finalLine
  };
}
