"use client";

import Link from "next/link";

export function Navbar() {
    return (
        <nav aria-label="Main navigation" className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-6">
            <div className="mx-auto flex w-full max-w-[calc(100vw-2rem)] items-center justify-center gap-4 rounded-full bg-paper/65 px-4 py-2 shadow-[0_8px_30px_rgba(29,29,27,0.06)] ring-1 ring-white/50 backdrop-blur-xl sm:max-w-5xl sm:justify-between sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none sm:ring-0 sm:backdrop-blur-none">
                <Link
                    href="/"
                    className="whitespace-nowrap text-sm font-semibold tracking-tight text-ink/90 transition hover:text-ink sm:rounded-full sm:bg-paper/65 sm:px-4 sm:py-2 sm:shadow-[0_8px_30px_rgba(29,29,27,0.06)] sm:ring-1 sm:ring-white/50 sm:backdrop-blur-xl sm:hover:bg-paper/80"
                >
                    RoastGit
                </Link>
                <div className="flex min-w-0 items-center gap-4 sm:gap-5 sm:rounded-full sm:bg-paper/65 sm:px-4 sm:py-2 sm:shadow-[0_8px_30px_rgba(29,29,27,0.06)] sm:ring-1 sm:ring-white/50 sm:backdrop-blur-xl">
                    <Link
                        href="/compare"
                        className="whitespace-nowrap text-sm text-ink/65 transition hover:text-ink/90"
                    >
                        Compare
                    </Link>
                    <Link
                        href="/#how-it-works"
                        className="whitespace-nowrap text-sm text-ink/65 transition hover:text-ink/90"
                    >
                        How it works
                    </Link>
                </div>
            </div>
        </nav>
    );
}
