"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="fixed left-6 top-4 z-50 flex items-center gap-2 text-sm text-ink/50 transition hover:text-ink/80"
        >
            <span className="text-base">←</span>
            <span>Back</span>
        </button>
    );
}
