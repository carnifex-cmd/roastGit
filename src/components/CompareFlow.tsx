"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComparisonCategoryResult, ComparisonOutput, CompareSide } from "@/lib/types";
import { isValidGitHubUsername } from "@/lib/githubUsername";

type ErrorInfo = {
  message: string;
  canRetry: boolean;
};

const resultRows = new Set(["repositoryPortfolio", "activity", "profileCompleteness"]);
const CHAT_DELAY_MS = 550;
const SUMMARY_DELAY_MS = 1800;
const BAR_DELAY_MS = 2600;
const VERDICT_DELAY_MS = 3400;

function getError(status: number | null, fallback: string): ErrorInfo {
  if (status === 404) {
    return {
      message: fallback || "Couldn't find one of those GitHub users.",
      canRetry: false
    };
  }
  if (status === 429) {
    return {
      message: "Too many battles. Try again in a minute.",
      canRetry: true
    };
  }
  if (status === 400) {
    return {
      message: fallback || "Use two valid, different GitHub usernames.",
      canRetry: false
    };
  }
  return {
    message: fallback || "Something went wrong on our end. Try again.",
    canRetry: true
  };
}

function sideLabel(side: CompareSide | null, data: ComparisonOutput) {
  if (side === "left") return `@${data.left.username}`;
  if (side === "right") return `@${data.right.username}`;
  return "Tie";
}

function rowValue(category: ComparisonCategoryResult) {
  const max = Math.max(category.leftValue, category.rightValue, 1);
  return {
    left: `${Math.max(8, (category.leftValue / max) * 100)}%`,
    right: `${Math.max(8, (category.rightValue / max) * 100)}%`
  };
}

function barClass(side: CompareSide, winner: CompareSide | null) {
  if (winner === null) return "bg-ink/45";
  return winner === side ? "bg-ink/70" : "bg-ink/35";
}

function animationDelay(ms: number) {
  return { animationDelay: `${ms}ms` };
}

function AnimatedScore({ value, delayMs }: { value: number; delayMs: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setDisplayValue(0);
    const startTimer = window.setTimeout(() => {
      const start = performance.now();
      const duration = 1100;

      function tick(now: number) {
        const progress = Math.min(1, (now - start) / duration);
        // Gentler ease-out so the counter decelerates visibly into the final number
        const eased = 1 - Math.pow(1 - progress, 2.5);
        setDisplayValue(Math.round(value * eased));

        if (progress < 1) {
          window.requestAnimationFrame(tick);
        }
      }

      window.requestAnimationFrame(tick);
    }, delayMs);

    return () => window.clearTimeout(startTimer);
  }, [delayMs, value]);

  return <>{displayValue}/100</>;
}

export function CompareFlow() {
  const [leftUsername, setLeftUsername] = useState("");
  const [rightUsername, setRightUsername] = useState("");
  const [leftTouched, setLeftTouched] = useState(false);
  const [rightTouched, setRightTouched] = useState(false);
  const [data, setData] = useState<ComparisonOutput | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const left = leftUsername.trim();
  const right = rightUsername.trim();
  const leftValid = isValidGitHubUsername(left);
  const rightValid = isValidGitHubUsername(right);
  const sameUsername = left.length > 0 && right.length > 0 && left.toLowerCase() === right.toLowerCase();
  const formValid = leftValid && rightValid && !sameUsername;

  const visibleRows = useMemo(
    () => data?.categoryResults.filter((category) => resultRows.has(category.key)) ?? [],
    [data]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLeftTouched(true);
    setRightTouched(true);
    if (!formValid) return;

    setLoading(true);
    setErrorInfo(null);
    setData(null);

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leftUsername: left, rightUsername: right })
      });
      const payload = (await response.json()) as ComparisonOutput & { error?: string };

      if (!response.ok) {
        setErrorInfo(getError(response.status, payload.error ?? ""));
        return;
      }

      setData(payload);
    } catch {
      setErrorInfo(getError(null, "Connection issue. Check your network and try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-12">
      <section className="flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <div>
          <p className="text-micro uppercase text-ink/50">Roast Battle</p>
          <h1 className="mt-4 text-display font-semibold tracking-tightish text-ink">
            Compare two GitHub profiles
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-body text-ink/60">
            A deterministic score, a dry verdict, and one public repo ego check.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <div className="flex flex-col gap-3 text-left">
              <label htmlFor="left-username" className="sr-only">
                First username
              </label>
              <input
                id="left-username"
                value={leftUsername}
                onChange={(event) => setLeftUsername(event.target.value)}
                onBlur={() => setLeftTouched(true)}
                placeholder="First username"
                className="w-full rounded-full bg-white/70 px-6 py-4 text-lg text-ink shadow-soft outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-accent"
                aria-invalid={leftTouched && !leftValid}
              />
            </div>

            <div className="pb-4 text-micro uppercase text-ink/35">VS</div>

            <div className="flex flex-col gap-3 text-left">
              <label htmlFor="right-username" className="sr-only">
                Second username
              </label>
              <input
                id="right-username"
                value={rightUsername}
                onChange={(event) => setRightUsername(event.target.value)}
                onBlur={() => setRightTouched(true)}
                placeholder="Second username"
                className="w-full rounded-full bg-white/70 px-6 py-4 text-lg text-ink shadow-soft outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-accent"
                aria-invalid={rightTouched && !rightValid}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!formValid || loading}
            className="mt-5 w-full rounded-full bg-ink px-6 py-4 text-base font-semibold text-paper shadow-lift transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:bg-ink/40 sm:w-auto sm:min-w-56"
          >
            {loading ? "Starting battle" : "Start the battle"}
          </button>

          <div className="mt-3 text-xs text-ink/45">
            Public data only. No leaderboard. No sign-up.
          </div>

          {(leftTouched && left.length > 0 && !leftValid) ||
          (rightTouched && right.length > 0 && !rightValid) ? (
            <p className="mt-3 text-xs text-ink/60">
              Use 1-39 characters. Letters, numbers, and single hyphens only.
            </p>
          ) : null}
          {sameUsername ? (
            <p className="mt-3 text-xs text-ink/60">
              Pick two different GitHub usernames. Mirror matches are for CSS bugs.
            </p>
          ) : null}
        </form>
      </section>

      {loading ? (
        <div className="w-full max-w-2xl rounded-3xl bg-white/70 p-10 text-center text-ink/60 shadow-soft animate-fade-in">
          Preparing a measured face-off.
        </div>
      ) : null}

      {errorInfo ? (
        <div className="w-full max-w-2xl rounded-3xl bg-white/70 p-10 text-center shadow-soft animate-fade-in">
          <p className="text-ink/70">{errorInfo.message}</p>
          {errorInfo.canRetry ? (
            <button
              type="button"
              onClick={() => setErrorInfo(null)}
              className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:translate-y-[-1px]"
            >
              Try again
            </button>
          ) : null}
        </div>
      ) : null}

      {data && !loading ? (
        <section className="w-full max-w-3xl animate-fade-in">
          <div className="grid gap-4">
            {data.battleLines.map((line, index) => (
              <div
                key={`${line}-${index}`}
                style={animationDelay(index * CHAT_DELAY_MS)}
                className={`max-w-[82%] rounded-3xl px-6 py-4 text-sm leading-relaxed opacity-0 shadow-soft animate-fade-in ${
                  index % 2 === 0
                    ? "bg-mist text-ink/80"
                    : "ml-auto bg-white/80 text-ink/70"
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          <div
            style={animationDelay(SUMMARY_DELAY_MS)}
            className="mt-8 rounded-2xl bg-white/80 p-8 opacity-0 shadow-lift animate-fade-in"
          >
            <div className="grid gap-6 text-center sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div>
                <p className="text-micro uppercase text-ink/45">@{data.left.username}</p>
                <p
                  style={animationDelay(SUMMARY_DELAY_MS + 180)}
                  className="mt-2 text-4xl font-semibold text-ink opacity-0 animate-fade-in"
                >
                  <AnimatedScore value={data.left.score} delayMs={SUMMARY_DELAY_MS + 180} />
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-ink/45">
                  {data.left.grade}
                </p>
              </div>
              <div
                style={{
                  animationDelay: `${BAR_DELAY_MS + 350}ms`,
                  animationDuration: "900ms"
                }}
                className="rounded-full bg-paper px-6 py-4 ring-1 ring-ink/10 animate-[compareWinnerPulse_900ms_ease-out_forwards]"
              >
                <p className="text-micro uppercase text-ink/45">
                  {data.winner ? "Winner" : "Result"}
                </p>
                <p className="mt-1 text-sm font-medium text-ink">
                  {sideLabel(data.winnerSide, data)}
                </p>
                <p className="mt-1 text-xs text-ink/45">Delta {data.scoreDelta}</p>
              </div>
              <div>
                <p className="text-micro uppercase text-ink/45">@{data.right.username}</p>
                <p
                  style={animationDelay(SUMMARY_DELAY_MS + 260)}
                  className="mt-2 text-4xl font-semibold text-ink opacity-0 animate-fade-in"
                >
                  <AnimatedScore value={data.right.score} delayMs={SUMMARY_DELAY_MS + 260} />
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-ink/45">
                  {data.right.grade}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5">
              {visibleRows.map((category, rowIndex) => {
                const widths = rowValue(category);
                const delayMs = BAR_DELAY_MS + rowIndex * 220;
                return (
                  <div
                    key={category.key}
                    style={animationDelay(delayMs)}
                    className="opacity-0 animate-fade-in"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium text-ink/75">{category.name}</p>
                      <p className="text-xs text-ink/40">
                        {category.leftValue} vs {category.rightValue}
                      </p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="h-2 rounded-full bg-mist">
                        <div
                          className={`h-2 origin-left rounded-full ${barClass("left", category.winner)} animate-[compareBarSweep_900ms_cubic-bezier(0.22,1,0.36,1)_forwards]`}
                          style={{
                            width: widths.left,
                            transform: "scaleX(0)",
                            animationDelay: `${delayMs}ms`
                          }}
                        />
                      </div>
                      <div className="h-2 rounded-full bg-mist">
                        <div
                          className={`h-2 origin-left rounded-full ${barClass("right", category.winner)} animate-[compareBarSweep_900ms_cubic-bezier(0.22,1,0.36,1)_forwards]`}
                          style={{
                            width: widths.right,
                            transform: "scaleX(0)",
                            animationDelay: `${delayMs}ms`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={animationDelay(VERDICT_DELAY_MS)}
              className="mt-8 rounded-2xl bg-paper px-6 py-5 text-center opacity-0 animate-fade-in"
            >
              <p className="text-micro uppercase text-ink/45">Final verdict</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{data.finalVerdict}</p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
