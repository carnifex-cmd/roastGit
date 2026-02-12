import type { Metadata } from "next";
import { RoastFlow } from "@/components/RoastFlow";
import { BackButton } from "@/components/BackButton";
import { RoastJsonLd } from "@/components/JsonLd";
import { getRoast } from "@/lib/roast";
import type { RoastOutput } from "@/lib/types";

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = params;
  return {
    title: `@${username}'s GitHub Roast`,
    description: `See what AI thinks about ${username}'s GitHub profile — repos, commits, and coding patterns analyzed.`,
    openGraph: {
      title: `@${username}'s GitHub Roast | RoastGit`,
      description: `An AI-generated roast of ${username}'s GitHub profile.`,
      url: `https://roastgit.in/roast/${username}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `@${username}'s GitHub Roast | RoastGit`,
      description: `An AI-generated roast of ${username}'s GitHub profile.`,
    },
    alternates: {
      canonical: `https://roastgit.in/roast/${username}`,
    },
  };
}

export default async function RoastPage({ params }: Props) {
  let roastData: RoastOutput | null = null;

  try {
    roastData = await getRoast(params.username);
  } catch {
    // Server-side fetch failed — RoastFlow will fallback to client-side fetch
  }

  return (
    <main className="min-h-screen bg-paper px-6 py-16">
      <BackButton />
      <article className="mx-auto flex w-full max-w-4xl flex-col items-center gap-12">
        <header className="text-center">
          <p className="text-micro uppercase text-ink/50">RoastGit</p>
          <h1 className="mt-4 text-headline font-semibold tracking-tightish">
            Roast report
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            @{params.username}
          </p>
        </header>

        {/* SSR content for crawlers — hidden from visual users */}
        {roastData && (
          <div className="sr-only">
            {roastData.messages.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
            <p>{roastData.summary.verdict}</p>
            <p>Profile Score: {roastData.summary.profileScore}/10</p>
          </div>
        )}

        <RoastFlow username={params.username} initialData={roastData} />
      </article>
      <RoastJsonLd
        username={params.username}
        score={roastData?.summary.profileScore}
        verdict={roastData?.summary.verdict}
      />
    </main>
  );
}

