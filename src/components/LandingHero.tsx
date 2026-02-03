import { UsernameForm } from "@/components/UsernameForm";

export function LandingHero() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <div className="flex w-full max-w-3xl flex-col items-center gap-10 text-center">
        <div className="flex flex-col gap-6">
          <p className="text-micro uppercase text-ink/50">
            RoastGit
          </p>
          <h1 className="text-headline font-semibold tracking-tightish sm:text-display">
            Your GitHub. Honestly reviewed.
          </h1>
          <p className="text-body text-ink/70">
            We analyze your public GitHub activity and roast it with restraint.
          </p>
        </div>
        <UsernameForm />
      </div>
    </main>
  );
}
