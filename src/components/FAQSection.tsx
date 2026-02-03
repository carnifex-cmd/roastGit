"use client";

import { useState, useCallback } from "react";

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
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = useCallback((index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    }, []);

    return (
        <section className="px-6 py-16">
            <div className="mx-auto flex max-w-2xl flex-col gap-5">
                <p className="text-center text-micro uppercase text-ink/50">
                    Questions
                </p>
                <div className="divide-y divide-ink/15">
                    {faqs.map((faq, index) => (
                        <div key={index} className="py-4">
                            <button
                                onClick={() => toggle(index)}
                                className="flex w-full items-center justify-between text-left"
                            >
                                <span className="text-body font-medium text-ink/90">
                                    {faq.question}
                                </span>
                                <span className="text-ink/40 transition-transform duration-150">
                                    {openIndex === index ? "−" : "+"}
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-150 ease-out ${openIndex === index ? "mt-2 max-h-40 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <p className="text-body text-ink/70">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
