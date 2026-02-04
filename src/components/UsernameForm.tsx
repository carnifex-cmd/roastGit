"use client";

import { useUsernameInput } from "@/hooks/useUsernameInput";

export function UsernameForm() {
  const {
    value,
    setValue,
    setTouched,
    isValid,
    showError,
    handleSubmit
  } = useUsernameInput();

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="flex flex-col gap-3">
        <label className="text-micro uppercase text-ink/50">
          GitHub Username
        </label>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="octocat"
          className="w-full rounded-full bg-white/70 px-6 py-4 text-lg text-ink shadow-soft outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-accent"
          aria-invalid={showError}
        />
        <button
          type="submit"
          disabled={!isValid}
          className="rounded-full bg-ink px-6 py-4 text-base font-semibold text-paper shadow-lift transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:bg-ink/40"
        >
          Run the roast
        </button>
        <div className="text-xs text-ink/45">
          Public data only. One roast. No sign-up.
        </div>
        {showError ? (
          <p className="text-xs text-ink/60">
            Use 1–39 characters. Letters, numbers, and single hyphens only.
          </p>
        ) : null}
      </div>
    </form>
  );
}
