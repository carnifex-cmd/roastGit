import type { RoastInput } from "@/lib/types";

export type RoastResult = {
  messages: string[];
  observation: string;
  patternNoticed: string;
  publicPerception: string;
  verdict: string;
  profileScore: number;
  finalLine: string;
};

export interface AIClient {
  generateRoast(input: RoastInput): Promise<RoastResult>;
}
