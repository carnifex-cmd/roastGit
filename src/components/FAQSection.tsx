const faqs = [
    {
        question: "Is this private?",
        answer: "Only your public GitHub data is accessed. Nothing hidden, nothing private."
    },
    {
        question: "What data do you access?",
        answer: "Public repos, commits, and profile information. The same things anyone can see."
    },
    {
        question: "Is anything stored?",
        answer: "Nothing. We don't keep any data after your roast is generated."
    },
    {
        question: "Is this free?",
        answer: "Completely. No accounts, no payments, no catch."
    },
    {
        question: "Can it be offensive?",
        answer: "We try to keep it light. If it stings, that's the point — but never cruel."
    }
];

export function FAQSection() {
    return (
        <section className="px-6 py-16">
            <div className="mx-auto flex max-w-2xl flex-col gap-5">
                <h2 className="text-center text-micro uppercase text-ink/50">
                    Questions
                </h2>
                <div className="divide-y divide-ink/15">
                    {faqs.map((faq, index) => (
                        <details key={index} className="group py-4">
                            <summary className="flex w-full cursor-pointer items-center justify-between text-left text-body font-medium text-ink/90 marker:content-none [&::-webkit-details-marker]:hidden">
                                <span>{faq.question}</span>
                                <span className="text-ink/40 transition-transform duration-150 group-open:rotate-45">
                                    +
                                </span>
                            </summary>
                            <p className="mt-2 text-body text-ink/70">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

