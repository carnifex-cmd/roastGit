import type { RoastInput } from "@/lib/types";

export type RoastResult = {
  messages: string[];
};

export interface AIClient {
  generateRoast(input: RoastInput): Promise<RoastResult>;
}
