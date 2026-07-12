import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CompareFlow } from "@/components/CompareFlow";
import { Navbar } from "@/components/Navbar";
import { isValidGitHubUsername } from "@/lib/githubUsername";

type Props = {
  params: {
    leftUsername: string;
    rightUsername: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const left = params.leftUsername.toLowerCase();
  const right = params.rightUsername.toLowerCase();

  return {
    title: `@${left} vs @${right} GitHub Roast Battle`,
    description:
      "Compare two GitHub profiles with deterministic scores and a dry RoastGit verdict.",
    robots: {
      index: false,
      follow: true
    },
    alternates: {
      canonical: "https://roastgit.in/compare"
    },
    openGraph: {
      title: `@${left} vs @${right} | RoastGit`,
      description: "A shareable GitHub profile roast battle.",
      url: `https://roastgit.in/compare/${left}/${right}`
    }
  };
}

export default function ComparePairPage({ params }: Props) {
  const left = params.leftUsername.trim();
  const right = params.rightUsername.trim();
  const normalizedLeft = left.toLowerCase();
  const normalizedRight = right.toLowerCase();

  if (
    !isValidGitHubUsername(left) ||
    !isValidGitHubUsername(right) ||
    normalizedLeft === normalizedRight
  ) {
    redirect("/compare");
  }

  if (left !== normalizedLeft || right !== normalizedRight) {
    redirect(`/compare/${normalizedLeft}/${normalizedRight}`);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-paper px-6 pb-20 pt-32 sm:pt-40">
        <CompareFlow
          initialLeftUsername={normalizedLeft}
          initialRightUsername={normalizedRight}
          autoRun
        />
      </main>
    </>
  );
}
