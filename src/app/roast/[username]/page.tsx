import { RoastFlow } from "@/components/RoastFlow";
import { BackButton } from "@/components/BackButton";

export default function RoastPage({
  params
}: {
  params: { username: string };
}) {
  return (
    <main className="min-h-screen bg-paper px-6 py-16">
      <BackButton />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-12">
        <div className="text-center">
          <p className="text-micro uppercase text-ink/50">RoastGit</p>
          <h1 className="mt-4 text-headline font-semibold tracking-tightish">
            Roast report
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            @{params.username}
          </p>
        </div>
        <RoastFlow username={params.username} />
      </div>
    </main>
  );
}
