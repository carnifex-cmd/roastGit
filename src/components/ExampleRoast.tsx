const exampleLines = [
    "186 forks but commits like they're rationing them.",
    "The README has more personality than the last 6 months of contributions."
];

export function ExampleRoast() {
    return (
        <section className="px-6 py-24">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
                <p className="text-micro uppercase text-ink/40">Example</p>
                <div className="w-full rounded-2xl bg-white/60 p-8 shadow-soft">
                    <div className="flex flex-col gap-4">
                        {exampleLines.map((line, index) => (
                            <p key={index} className="text-body text-ink/70">
                                "{line}"
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
