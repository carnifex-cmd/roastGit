const steps = [
    "Enter your GitHub username",
    "We analyze recent public activity",
    "You get a short, honest roast"
];

export function HowItWorks() {
    return (
        <section className="px-6 py-24">
            <div className="mx-auto flex max-w-xl flex-col items-center gap-10">
                <p className="text-micro uppercase text-ink/50">How it works</p>
                <ol className="flex flex-col gap-8">
                    {steps.map((step, index) => (
                        <li key={index} className="flex items-baseline gap-4">
                            <span className="text-micro text-ink/40">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-body text-ink/80">{step}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
