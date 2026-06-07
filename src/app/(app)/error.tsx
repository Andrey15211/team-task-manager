"use client";

import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const { t } = useI18n();
  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center p-8 text-center">
      <div>
        <AlertTriangle className="mx-auto size-10 text-amber-500" />
        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          {t("errorTitle")}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {t("errorText")}
        </p>
        <button className="button-primary mt-6" onClick={reset}>
          {t("tryAgain")}
        </button>
      </div>
    </div>
  );
}
