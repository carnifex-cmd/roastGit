"use client";

import Link from "next/link";

export function Navbar() {
    return (
        <nav className="fixed left-0 right-0 top-0 z-50 px-6 py-4">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
                <Link
                    href="/"
                    className="text-sm font-semibold tracking-tight text-ink/90 transition hover:text-ink"
                >
                    RoastGit
                </Link>
                <a
                    href="https://github.com/carnifex-cmd/roastGit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink/50 transition hover:text-ink/80"
                >
                    GitHub
                </a>
            </div>
        </nav>
    );
}
