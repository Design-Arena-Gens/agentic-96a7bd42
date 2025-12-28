"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";

type LogEntry = {
  id: string;
  createdAt: string;
  topic: string;
  status: "success" | "failed";
  youtubeUrl?: string;
  summary?: string;
  error?: string;
};

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptOverride, setPromptOverride] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/logs", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load logs");
      const data = (await res.json()) as { logs: LogEntry[] };
      setLogs(data.logs ?? []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    void fetchLogs();
    const interval = setInterval(() => {
      void fetchLogs();
    }, 30_000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptOverride.trim() || undefined })
      });
      const data = (await res.json()) as {
        success: boolean;
        error?: string;
        data?: { topic: string; youtubeUrl?: string };
      };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Failed to generate video");
      }
      setMessage(
        `Video generated for topic "${data.data?.topic ?? "Unknown"}"${
          data.data?.youtubeUrl ? ` and uploaded to ${data.data.youtubeUrl}` : ""
        }.`
      );
      setPromptOverride("");
      await fetchLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  }, [fetchLogs, promptOverride]);

  const upcomingCron = useMemo(() => {
    const now = new Date();
    const next = new Date(now);
    next.setUTCDate(now.getUTCDate() + (now.getUTCHours() >= 14 ? 1 : 0));
    next.setUTCHours(14, 0, 0, 0);
    return next;
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-xl shadow-brand-900/20 backdrop-blur">
        <h1 className="text-4xl font-bold text-white md:text-5xl">
          Autonomous Viral Video Agent
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-300">
          This agent ideates, produces, and uploads a daily AI-generated short-form video
          to your YouTube channel. Kick off a run manually, adjust prompts, and monitor
          publishing status from this control surface.
        </p>
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-400">
              Next automated drop
            </p>
            <p className="text-xl font-semibold text-white">
              {upcomingCron.toLocaleString()} (UTC)
            </p>
            <p className="text-sm text-slate-400">
              {formatDistanceToNow(upcomingCron, { addSuffix: true })}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
            <input
              value={promptOverride}
              onChange={(event) => setPromptOverride(event.target.value)}
              placeholder="Optional: Force a topic or niche"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 md:w-72"
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isLoading ? "Spinning Up..." : "Run Now"}
            </button>
          </div>
        </div>
        {message ? (
          <div className="mt-4 rounded-xl border border-emerald-600/40 bg-emerald-900/30 p-4 text-sm text-emerald-200">
            {message}
          </div>
        ) : null}
        {error ? (
          <div className="mt-4 rounded-xl border border-rose-700/40 bg-rose-900/30 p-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Recent drops</h2>
            <p className="text-sm text-slate-400">
              Each run captures the full pipeline: ideation, script, media synthesis, render,
              and upload confirmation.
            </p>
          </div>
          <button
            onClick={() => void fetchLogs()}
            className="self-start rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-brand-400/70 hover:text-brand-200"
          >
            Refresh feed
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          {logs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center text-sm text-slate-500">
              No runs just yet. Trigger a generation to populate the timeline.
            </div>
          ) : (
            logs.map((log) => (
              <article
                key={log.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-inner shadow-black/20"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                    <h3 className="text-xl font-semibold text-white">{log.topic}</h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      log.status === "success"
                        ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/30"
                        : "bg-rose-500/10 text-rose-200 ring-1 ring-inset ring-rose-400/30"
                    }`}
                  >
                    {log.status === "success" ? "Published" : "Failed"}
                  </span>
                </div>
                {log.summary ? (
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {log.summary}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  {log.youtubeUrl ? (
                    <a
                      href={log.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-2 font-medium text-brand-200 transition hover:bg-brand-500/20"
                    >
                      Watch on YouTube
                    </a>
                  ) : null}
                  {log.error ? (
                    <span className="rounded-lg border border-rose-700/50 bg-rose-900/20 px-3 py-2 text-rose-200">
                      {log.error}
                    </span>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
