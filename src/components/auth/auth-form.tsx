"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Layers3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createMockSession } from "@/lib/mock-auth";
import { authSchema, type AuthInput } from "@/lib/schemas";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthInput>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "maya@northstar.dev", password: "demo123" },
  });

  const submit = () => {
    createMockSession();
    router.push("/dashboard");
  };

  const isLogin = mode === "login";

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_1.05fr]">
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-12 inline-flex items-center gap-2 text-slate-950">
            <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white">
              <Layers3 className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Taskflow</span>
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {isLogin ? "Welcome back" : "Create your workspace"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isLogin
              ? "Sign in to coordinate projects, deadlines, and team progress."
              : "Start organizing team work with a focused project workspace."}
          </p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit(submit)}>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Email</span>
              <input
                {...register("email")}
                className="input"
                type="email"
                autoComplete="email"
              />
              {errors.email && (
                <span className="block text-xs text-rose-600">{errors.email.message}</span>
              )}
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Password</span>
              <input
                {...register("password")}
                className="input"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              {errors.password && (
                <span className="block text-xs text-rose-600">
                  {errors.password.message}
                </span>
              )}
            </label>
            <button className="button-primary w-full">
              {isLogin ? "Sign in" : "Create account"}
              <ArrowRight className="size-4" />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "New to Taskflow?" : "Already have an account?"}{" "}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              {isLogin ? "Create an account" : "Sign in"}
            </Link>
          </p>
        </div>
      </section>
      <section className="hidden items-center bg-slate-950 px-12 text-white lg:flex">
        <div className="mx-auto max-w-lg">
          <p className="text-sm font-medium text-indigo-300">Focused team execution</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight">
            One clear place for every project decision and deadline.
          </h2>
          <div className="mt-10 space-y-5">
            {[
              "Move work through a visual four-stage workflow.",
              "Keep roles and editing rights explicit.",
              "Review deadlines and discussion without losing context.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-indigo-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
