export function Footer() {
    return (
        <footer className="px-6 py-16">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
                <p className="text-micro uppercase text-ink/40">RoastGit</p>
                <nav className="flex gap-4 text-xs text-ink/40">
                    <a href="#how-it-works">How it works</a>
                    <a
                        href="https://github.com/carnifex-cmd/roastGit"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://x.com/shxrdexe"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        X / Twitter
                    </a>
                </nav>
                <p className="text-xs text-ink/40">
                    Made for fun. Uses the GitHub API. Not affiliated with GitHub.
                </p>
                <p className="text-xs text-ink/30">
                    © {new Date().getFullYear()} RoastGit. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
