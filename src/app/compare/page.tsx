import type { Metadata } from "next";
import { CompareFlow } from "@/components/CompareFlow";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Compare GitHub Profiles | RoastGit",
  description:
    "Compare two GitHub profiles with deterministic scores and a dry RoastGit verdict."
};

export default function ComparePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-paper px-6 pb-20 pt-32 sm:pt-40">
        <CompareFlow />
      </main>
    </>
  );
}
