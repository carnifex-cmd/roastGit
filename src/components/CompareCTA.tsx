import Link from "next/link";

export function CompareCTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <p className="text-micro uppercase text-ink/50">Roast Battle</p>
        <div className="flex flex-col gap-4">
          <h2 className="text-headline font-semibold tracking-tightish">
            Compare two GitHub profiles
          </h2>
          <p className="text-body text-ink/70">
            Put two public GitHub profiles side by side and let the repo receipts decide.
          </p>
        </div>
        <Link
          href="/compare"
          className="rounded-full bg-ink px-6 py-4 text-base font-semibold text-paper shadow-lift transition hover:translate-y-[-1px]"
        >
          Start a roast battle
        </Link>
      </div>
    </section>
  );
}
