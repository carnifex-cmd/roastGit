"use client";

import Link from "next/link";

export function Navbar() {
    return (
        <nav aria-label="Main navigation" className="fixed left-0 right-0 top-0 z-50 px-6 py-4">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
                <Link
                    href="/"
                    className="text-sm font-semibold tracking-tight text-ink/90 transition hover:text-ink"
                >
                    RoastGit
                </Link>
                <div className="flex items-center gap-5">
                    <Link
                        href="/compare"
                        className="text-sm text-ink/50 transition hover:text-ink/80"
                    >
                        Compare
                    </Link>
                    <Link
                        href="/#how-it-works"
                        className="text-sm text-ink/50 transition hover:text-ink/80"
                    >
                        How it works
                    </Link>
                </div>
            </div>
        </nav>
    );
}

