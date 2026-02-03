import type { RoastSummary } from "@/lib/types";

export function RoastSummaryCard({ summary }: { summary: RoastSummary }) {
  return (
    <section className="w-full rounded-3xl bg-white/80 p-10 shadow-lift">
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-micro uppercase text-ink/45">
            The Verdict
          </p>
          <h2 className="mt-3 text-headline font-semibold tracking-tightish">
            What it all adds up to
          </h2>
        </div>

        <div className="grid gap-6">
          <div>
            <p className="text-micro uppercase text-ink/50">
              Observation
            </p>
            <p className="mt-2 text-sm text-ink/75">{summary.observation}</p>
          </div>
          <div>
            <p className="text-micro uppercase text-ink/50">
              Pattern Noticed
            </p>
            <p className="mt-2 text-sm text-ink/75">{summary.patternNoticed}</p>
          </div>
          <div>
            <p className="text-micro uppercase text-ink/50">
              How This Reads Publicly
            </p>
            <p className="mt-2 text-sm text-ink/75">{summary.publicPerception}</p>
          </div>
          <div>
            <p className="text-micro uppercase text-ink/50">
              What It Adds Up To
            </p>
            <p className="mt-2 text-sm text-ink/75">{summary.verdict}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-mist/80 px-6 py-5">
          <div>
            <p className="text-micro uppercase text-ink/50">
              Profile Score
            </p>
            <p className="mt-2 text-3xl font-semibold text-ink">
              {summary.profileScore}
            </p>
          </div>
          <div className="max-w-sm">
            <p className="text-micro uppercase text-ink/50">
              Final Line
            </p>
            <p className="mt-2 text-sm text-ink/70">{summary.finalLine}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
