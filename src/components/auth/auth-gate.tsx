"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { hasMockSession } from "@/lib/mock-auth";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasMockSession()) {
      router.replace("/login");
      return;
    }
    queueMicrotask(() => setReady(true));
  }, [router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="size-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  return children;
}
