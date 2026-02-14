"use client";

import { useState, useCallback } from "react";
import type { RoastSummary } from "@/lib/types";

type ShareButtonProps = {
    username: string;
    summary: RoastSummary;
};

function formatRoastReport(username: string, summary: RoastSummary): string {
    return [
        ``,
        `OBSERVATION`,
        summary.observation,
        ``,
        `PATTERN NOTICED`,
        summary.patternNoticed,
        ``,
        `HOW THIS READS PUBLICLY`,
        summary.publicPerception,
        ``,
        `WHAT IT ADDS UP TO`,
        summary.verdict,
        ``,
        `PROFILE SCORE: ${summary.profileScore}/100`,
        ``,
        `FINAL LINE`,
        summary.finalLine,
        ``,
        `—`,
        `Get yours at roastgit.in`,
    ].join("\n");
}

export function ShareButton({ username, summary }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const shareText = formatRoastReport(username, summary);

    const handleShare = useCallback(async () => {
        // Use native share API if available (mobile)
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: `@${username}'s GitHub Roast Report`,
                    text: shareText,
                });
                return;
            } catch {
                // User cancelled or share failed — fall through to clipboard
            }
        }

        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(shareText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard API not available
        }
    }, [username, shareText]);

    return (
        <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-ink/60 ring-1 ring-ink/10 transition hover:bg-ink/10 hover:text-ink/80"
        >
            {copied ? (
                <>
                    <CheckIcon />
                    Copied!
                </>
            ) : (
                <>
                    <ShareIcon />
                    Share roast
                </>
            )}
        </button>
    );
}

function ShareIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
