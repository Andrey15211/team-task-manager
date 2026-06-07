"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Layers3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createMockSession } from "@/lib/mock-auth";
import { authSchema, type AuthInput } from "@/lib/schemas";
import { useI18n } from "@/lib/i18n";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { locale, setLocale, t } = useI18n();
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
            {isLogin ? t("welcomeBack") : t("createWorkspace")}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isLogin
              ? t("loginText")
              : t("registerText")}
          </p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit(submit)}>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>{t("email")}</span>
              <input
                {...register("email")}
                className="input"
                type="email"
                autoComplete="email"
              />
              {errors.email && (
                <span className="block text-xs text-rose-600">{t("validationEmail")}</span>
              )}
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>{t("password")}</span>
              <input
                {...register("password")}
                className="input"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              {errors.password && (
                <span className="block text-xs text-rose-600">
                  {t("validationPassword")}
                </span>
              )}
            </label>
            <button className="button-primary w-full">
              {isLogin ? t("signIn") : t("createAccount")}
              <ArrowRight className="size-4" />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? t("newToTaskflow") : t("alreadyAccount")}{" "}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              {isLogin ? t("createAccount") : t("signIn")}
            </Link>
          </p>
        </div>
      </section>
      <section className="hidden items-center bg-slate-950 px-12 text-white lg:flex">
        <div className="mx-auto max-w-lg">
          <div className="mb-8 flex gap-2">
            {(["ru", "en"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setLocale(item)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${locale === item ? "bg-white text-slate-950" : "bg-white/10 text-white"}`}>
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <p className="text-sm font-medium text-indigo-300">{t("focusedExecution")}</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight">
            {t("authHero")}
          </h2>
          <div className="mt-10 space-y-5">
            {[
              t("authBenefit1"),
              t("authBenefit2"),
              t("authBenefit3"),
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
