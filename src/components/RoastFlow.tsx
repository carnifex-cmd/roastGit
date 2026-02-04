"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import type { RoastOutput } from "@/lib/types";
import { RoastSummaryCard } from "@/components/RoastSummaryCard";

const replySets = [
  ["Okay, go on", "Go ahead"],
  ["Fair enough", "Noted"],
  ["All right", "Understood"]
];

type ErrorType = "not_found" | "rate_limit" | "network" | "server";

type ErrorInfo = {
  type: ErrorType;
  message: string;
  canRetry: boolean;
};

function categorizeError(status: number | null, errorMessage: string): ErrorInfo {
  if (status === 404) {
    return {
      type: "not_found",
      message: "Couldn't find that GitHub user. Double-check the username.",
      canRetry: false
    };
  }
  if (status === 429) {
    return {
      type: "rate_limit",
      message: "Too many requests. Try again in a minute.",
      canRetry: true
    };
  }
  if (status === null) {
    return {
      type: "network",
      message: "Connection issue. Check your network and try again.",
      canRetry: true
    };
  }
  return {
    type: "server",
    message: "Something went wrong on our end. Try again.",
    canRetry: true
  };
}

export function RoastFlow({ username }: { username: string }) {
  const [data, setData] = useState<RoastOutput | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [userReplies, setUserReplies] = useState<string[]>([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const fetchedUsername = useRef<string | null>(null);

  const replies = useMemo(() => replySets.slice(0, 3), []);

  const loadRoast = useCallback(async () => {
    setData(null);
    setErrorInfo(null);
    setLoading(true);
    setVisibleCount(0);
    setUserReplies([]);
    setFadeOut(false);
    setShowSummary(false);

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
        setErrorInfo(categorizeError(response.status, payload.error ?? ""));
        return;
      }

      setData(payload);
      setVisibleCount(1);
    } catch {
      setErrorInfo(categorizeError(null, "Network error"));
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (fetchedUsername.current === username) return;
    fetchedUsername.current = username;
    loadRoast();
  }, [username, loadRoast]);

  function handleRetry() {
    fetchedUsername.current = null;
    loadRoast();
  }

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

  if (errorInfo || !data) {
    return (
      <div className="w-full max-w-2xl rounded-3xl bg-white/70 p-10 shadow-soft animate-fade-in">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-4xl">
            {errorInfo?.type === "not_found" && "🔍"}
            {errorInfo?.type === "rate_limit" && "⏱️"}
            {errorInfo?.type === "network" && "📡"}
            {errorInfo?.type === "server" && "⚠️"}
            {!errorInfo && "⚠️"}
          </div>
          <p className="text-ink/70 text-lg">
            {errorInfo?.message ?? "Unable to load the roast."}
          </p>
          <div className="flex gap-3">
            {errorInfo?.canRetry && (
              <button
                onClick={handleRetry}
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:translate-y-[-1px]"
              >
                Try Again
              </button>
            )}
            <Link
              href="/"
              className="rounded-full bg-white/80 px-6 py-3 text-sm font-medium text-ink/70 ring-1 ring-ink/10 transition hover:bg-white"
            >
              Go Back
            </Link>
          </div>
        </div>
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
