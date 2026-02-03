export default function LoadingRoast() {
  return (
    <main className="min-h-screen bg-paper px-6 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10">
        <div className="text-center">
          <p className="text-micro uppercase text-ink/50">RoastGit</p>
          <h1 className="mt-4 text-headline font-semibold tracking-tightish">
            Preparing your roast
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Sourcing the facts, not the drama.
          </p>
        </div>
        <div className="h-28 w-full max-w-2xl rounded-3xl bg-white/60 shadow-soft animate-fade-in" />
      </div>
    </main>
  );
}
