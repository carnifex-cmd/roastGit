import type { RoastSummary } from "@/lib/types";
import type { RoastResult } from "@/ai/AIClient";
import type { ProfileScore } from "@/lib/types";

/**
 * Builds the summary from AI-generated text fields and a deterministic score.
 */
export function buildSummary(
  aiResult: RoastResult,
  profileScore: ProfileScore
): RoastSummary {
  return {
    observation: aiResult.observation,
    patternNoticed: aiResult.patternNoticed,
    publicPerception: aiResult.publicPerception,
    verdict: aiResult.verdict,
    profileScore: profileScore.score,
    profileScoreGrade: profileScore.grade,
    profileScoreBreakdown: profileScore.breakdown,
    profileScoreVersion: profileScore.scorerVersion,
    finalLine: aiResult.finalLine
  };
}
