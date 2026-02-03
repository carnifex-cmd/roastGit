import type { RoastInput } from "@/lib/types";

export type RoastResult = {
  message: string;
};

export interface AIClient {
  generateRoast(input: RoastInput): Promise<RoastResult>;
}
