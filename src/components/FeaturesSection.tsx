const features = [
    {
        title: "GitHub-aware analysis",
        description:
            "We only look at what's public — and say what everyone else is thinking."
    },
    {
        title: "Controlled, tasteful roasts",
        description:
            "Sharp enough to sting, restrained enough to share."
    },
    {
        title: "Privacy-respecting by design",
        description:
            "Nothing stored. Nothing tracked. Just one honest review."
    }
];

export function FeaturesSection() {
    return (
        <section className="px-6 py-28">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-20">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-3 text-center"
                    >
                        <h2 className="text-headline font-semibold tracking-tightish">
                            {feature.title}
                        </h2>
                        <p className="max-w-md text-body text-ink/70">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
