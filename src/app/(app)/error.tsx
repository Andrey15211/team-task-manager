"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center p-8 text-center">
      <div>
        <AlertTriangle className="mx-auto size-10 text-amber-500" />
        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          This view could not be loaded
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Retry the view. Your locally saved demo data is preserved.
        </p>
        <button className="button-primary mt-6" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
