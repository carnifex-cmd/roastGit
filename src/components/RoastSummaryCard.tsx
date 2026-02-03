import type { RoastSummary } from "@/lib/types";

export function RoastSummaryCard({ summary }: { summary: RoastSummary }) {
  return (
    <section className="w-full rounded-3xl bg-white/80 p-10 shadow-lift">
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-micro uppercase text-ink/45">
            Roast Summary
          </p>
          <h2 className="mt-3 text-headline font-semibold tracking-tightish">
            The polite verdict
          </h2>
        </div>

        <div className="grid gap-6">
          <div>
            <p className="text-micro uppercase text-ink/50">
              Coding Habits
            </p>
            <p className="mt-2 text-sm text-ink/75">{summary.codingHabits}</p>
          </div>
          <div>
            <p className="text-micro uppercase text-ink/50">
              Project Naming
            </p>
            <p className="mt-2 text-sm text-ink/75">{summary.projectNaming}</p>
          </div>
          <div>
            <p className="text-micro uppercase text-ink/50">
              Consistency
            </p>
            <p className="mt-2 text-sm text-ink/75">{summary.consistency}</p>
          </div>
          <div>
            <p className="text-micro uppercase text-ink/50">
              Overall GitHub Vibe
            </p>
            <p className="mt-2 text-sm text-ink/75">{summary.overallVibe}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-mist/80 px-6 py-5">
          <div>
            <p className="text-micro uppercase text-ink/50">
              Roast Score
            </p>
            <p className="mt-2 text-3xl font-semibold text-ink">
              {summary.score}
            </p>
          </div>
          <div className="max-w-sm">
            <p className="text-micro uppercase text-ink/50">
              Compliment
            </p>
            <p className="mt-2 text-sm text-ink/70">{summary.compliment}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
