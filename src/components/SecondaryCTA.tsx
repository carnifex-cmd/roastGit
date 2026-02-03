"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const usernamePattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export function SecondaryCTA() {
    const router = useRouter();
    const [value, setValue] = useState("");
    const [touched, setTouched] = useState(false);

    const trimmed = value.trim();
    const isValid = useMemo(() => usernamePattern.test(trimmed), [trimmed]);
    const showError = touched && trimmed.length > 0 && !isValid;

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!isValid) return;
        router.push(`/roast/${trimmed}`);
    }

    return (
        <section className="px-6 py-24">
            <div className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
                <p className="text-headline font-medium tracking-tightish text-ink/90">
                    Curious what your GitHub says about you?
                </p>
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <div className="flex flex-col gap-3">
                        <input
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                            onBlur={() => setTouched(true)}
                            placeholder="octocat"
                            className="w-full rounded-full bg-white/70 px-5 py-3 text-base text-ink shadow-soft outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-accent"
                            aria-invalid={showError}
                        />
                        <button
                            type="submit"
                            disabled={!isValid}
                            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper shadow-lift transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:bg-ink/40"
                        >
                            Get roasted
                        </button>
                        {showError ? (
                            <p className="text-xs text-ink/60">
                                Use 1–39 characters. Letters, numbers, and single hyphens only.
                            </p>
                        ) : null}
                    </div>
                </form>
            </div>
        </section>
    );
}
