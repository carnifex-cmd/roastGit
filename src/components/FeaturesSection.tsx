const features = [
    {
        title: "AI-powered GitHub profile analysis",
        description:
            "We scan your public repos, commit history, and activity — then tell you what everyone else is thinking."
    },
    {
        title: "Funny, honest developer roasts",
        description:
            "Sharp enough to sting, restrained enough to share on Twitter."
    },
    {
        title: "No sign-up, no data stored",
        description:
            "Enter a GitHub username, get your roast. Nothing tracked, nothing saved."
    }
];

export function FeaturesSection() {
    return (
        <section className="px-6 py-28">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-12">
                <h2 className="text-micro uppercase text-ink/50">
                    Why developers love RoastGit
                </h2>
                <div className="flex w-full flex-col items-center gap-20">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center gap-3 text-center"
                        >
                            <h3 className="text-headline font-semibold tracking-tightish">
                                {feature.title}
                            </h3>
                            <p className="max-w-md text-body text-ink/70">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
