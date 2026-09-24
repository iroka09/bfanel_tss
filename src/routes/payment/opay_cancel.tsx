import { useEffect, useState } from "react";

import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/payment/opay_cancel')({
  component: PaymentCancelledPage,
})


function CancelIcon() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow */}
      <div className="absolute h-28 w-28 rounded-full bg-amber-400/20 blur-2xl dark:bg-amber-300/10" />

      {/* Pulse Ring */}
      <div className="absolute h-24 w-24 animate-ping rounded-full border border-amber-400/20" />

      {/* Main Circle */}
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-amber-500/20 bg-white/70 shadow-2xl backdrop-blur-xl dark:bg-zinc-900/70 dark:border-amber-400/10">
        <div className="relative h-8 w-8">
          <span className="absolute left-1/2 top-1/2 h-[2px] w-8 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-amber-600 dark:bg-amber-400" />
          <span className="absolute left-1/2 top-1/2 h-[2px] w-8 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-amber-600 dark:bg-amber-400" />
        </div>
      </div>
    </div>
  );
}

function PaymentCancelledPage() {
  const [mounted, setMounted] = useState(false);
  const { ref } = Route.useSearch()
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf7f2] px-6 py-16 text-zinc-900 transition-colors dark:bg-[#090909] dark:text-white">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-amber-300/30 blur-3xl dark:bg-amber-500/10" />

        <div className="absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-stone-300/40 blur-3xl dark:bg-zinc-800/40" />

        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/20 blur-3xl dark:bg-amber-400/5" />
      </div>

      {/* Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] dark:opacity-20 opacity-30" />

      {/* Card */}
      <section
        className={`relative z-10 w-full max-w-xl rounded-[2rem] border border-white/20 bg-white/60 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-all duration-700 dark:border-white/5 dark:bg-zinc-900/60 dark:shadow-[0_20px_80px_rgba(0,0,0,0.45)]
        ${mounted
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
          }`}
      >
        {/* Tiny Top Badge */}
        <div className="mb-10 flex justify-center">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-amber-700 dark:text-amber-300">
            Transaction Cancelled
          </span>
        </div>

        {/* Icon */}
        <div className="mb-10 flex justify-center">
          <CancelIcon />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="font-serif text-5xl font-light tracking-tight md:text-6xl">
            Payment{" "}
            <span className="italic text-amber-600 dark:text-amber-400">
              interrupted
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-[15px] leading-8 text-zinc-600 dark:text-zinc-400">
            Your checkout process was cancelled before the transaction could be
            completed.
            <span className="font-medium text-zinc-900 dark:text-white">
              {" "}
              No funds were deducted.
            </span>
          </p>
        </div>

        {/* Reference */}
        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-zinc-200/80 bg-white/70 px-5 py-3 text-sm shadow-sm backdrop-blur-md dark:border-zinc-700/50 dark:bg-zinc-800/60 overflow-hidden">
            <div className="h-2 min-w-2 rounded-full bg-amber-500" />
            <span className="uppercase tracking-[0.2em] text-zinc-500">
              Ref
            </span>

            <span className="block font-medium tracking-wide text-zinc-900 dark:text-white overflow-auto">
              {ref}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button className="group relative overflow-hidden rounded-full bg-gradient-to-br from-amber-500 to-orange-600 px-8 py-4 text-sm font-medium text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <span className="relative z-10">Try Again</span>

            <div className="absolute inset-0 translate-x-[-120%] skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-[120%]" />
          </button>

          <button className="rounded-full border border-zinc-300 bg-white/60 px-8 py-4 text-sm font-medium text-zinc-700 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Go Home
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Need assistance?{" "}
            <a
              href="mailto:support@bfanel.com"
              className="text-amber-700 underline-offset-4 transition hover:underline dark:text-amber-400"
            >
              Contact support
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}