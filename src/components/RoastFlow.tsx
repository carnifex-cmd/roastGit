"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RoastOutput } from "@/lib/types";
import { RoastSummaryCard } from "@/components/RoastSummaryCard";

const replySets = [
  ["Okay, go on", "Go ahead"],
  ["Fair enough", "Noted"],
  ["All right", "Understood"]
];

export function RoastFlow({ username }: { username: string }) {
  const [data, setData] = useState<RoastOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [userReplies, setUserReplies] = useState<string[]>([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const fetchedUsername = useRef<string | null>(null);

  const replies = useMemo(() => replySets.slice(0, 3), []);

  useEffect(() => {
    if (fetchedUsername.current === username) return;
    fetchedUsername.current = username;

    // Reset all state for new username
    setData(null);
    setError(null);
    setLoading(true);
    setVisibleCount(0);
    setUserReplies([]);
    setFadeOut(false);
    setShowSummary(false);

    async function loadRoast() {
      try {
        const response = await fetch("/api/roast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username })
        });

        const payload = (await response.json()) as RoastOutput & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to load roast.");
        }

        setData(payload);
        setVisibleCount(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error.");
      } finally {
        setLoading(false);
      }
    }

    loadRoast();
  }, [username]);

  function handleReply(reply: string) {
    setUserReplies((current) => [...current, reply]);
    if (!data) return;

    if (visibleCount < data.messages.length) {
      setVisibleCount((count) => count + 1);
      return;
    }

    setFadeOut(true);
    setTimeout(() => {
      setShowSummary(true);
    }, 500);
  }

  if (loading) {
    return (
      <div className="w-full max-w-2xl rounded-3xl bg-white/70 p-10 text-center text-ink/60 shadow-soft animate-fade-in">
        Preparing a measured roast.
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-2xl rounded-3xl bg-white/70 p-10 text-center text-ink/60 shadow-soft">
        {error ?? "Unable to load the roast."}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      {!showSummary && (
        <div
          className={`flex flex-col gap-6 transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"
            }`}
        >
          {data.messages.slice(0, visibleCount).map((message, index) => (
            <div key={`pair-${index}`} className="flex flex-col gap-6">
              {/* AI message */}
              <div
                className="max-w-[80%] rounded-3xl bg-mist px-6 py-4 text-sm leading-relaxed text-ink/80 shadow-soft animate-fade-in"
              >
                {message}
              </div>
              {/* User reply (if exists for this message) */}
              {userReplies[index] && (
                <div
                  className="ml-auto max-w-[80%] rounded-3xl bg-white/80 px-6 py-4 text-sm text-ink/70 shadow-soft"
                >
                  {userReplies[index]}
                </div>
              )}
            </div>
          ))}

          {visibleCount <= data.messages.length &&
            userReplies.length < visibleCount ? (
            <div className="flex flex-wrap gap-3">
              {replies[userReplies.length]?.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleReply(reply)}
                  className="rounded-full bg-ink px-5 py-2 text-xs uppercase tracking-[0.2em] text-paper transition hover:translate-y-[-1px]"
                >
                  {reply}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {showSummary && (
        <div className="animate-fade-in">
          <RoastSummaryCard summary={data.summary} />
        </div>
      )}
    </div>
  );
}
