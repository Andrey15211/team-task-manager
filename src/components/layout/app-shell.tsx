"use client";

import {
  BarChart3,
  ChevronDown,
  FolderKanban,
  Layers3,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { clearMockSession } from "@/lib/mock-auth";
import { useAppStore } from "@/lib/app-store";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/avatar";
import type { Role } from "@/types";
import { useI18n } from "@/lib/i18n";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, setLocale, t, role: roleLabel, content } = useI18n();
  const { data, currentUserId, role, setRole, resetDemo } = useAppStore();
  const user = data.profiles.find((profile) => profile.id === currentUserId)!;
  const currentProject = data.projects.find((project) =>
    pathname.includes(project.id),
  );

  const logout = () => {
    clearMockSession();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {mobileOpen && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label={t("closeNavigation")}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white">
              <Layers3 className="size-5" />
            </span>
            <span className="font-semibold tracking-tight">Taskflow</span>
          </Link>
          <button
            className="rounded-lg p-2 text-slate-500 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label={t("closeSidebar")}
          >
            <X className="size-4" />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          <NavLink href="/dashboard" active={pathname === "/dashboard"} icon={BarChart3}>
            {t("overview")}
          </NavLink>
          <NavLink
            href="/projects"
            active={pathname === "/projects"}
            icon={FolderKanban}
          >
            {t("projects")}
          </NavLink>
        </nav>
        <div className="px-5 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {t("workspaceProjects")}
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto px-3">
          {data.projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                pathname.includes(project.id) && "bg-indigo-50 text-indigo-700",
              )}
            >
              <span
                className="size-2.5 rounded-[4px]"
                style={{ backgroundColor: project.color }}
              />
              <span className="truncate">{content(project.name)}</span>
            </Link>
          ))}
          <Link
            href="/projects"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <Plus className="size-4" />
            {t("newProject")}
          </Link>
        </div>
        <div className="border-t border-slate-200 p-3">
          <button
            onClick={resetDemo}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <Settings className="size-4" />
            {t("resetDemo")}
          </button>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <LogOut className="size-4" />
            {t("logout")}
          </button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label={t("openNavigation")}
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-950">
              {currentProject ? content(currentProject.name) : pathname === "/projects" ? t("projects") : t("overview")}
            </p>
            <p className="hidden text-xs text-slate-400 sm:block">
              Northstar {t("workspace").toLocaleLowerCase(locale)}
            </p>
          </div>
          <label className="relative hidden w-64 lg:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder={t("searchWorkspace")}
            />
          </label>
          <div className="flex h-9 items-center rounded-lg border border-slate-200 bg-white p-1 text-xs font-semibold">
            {(["ru", "en"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLocale(item)}
                className={cn("h-7 rounded-md px-2", locale === item ? "bg-indigo-600 text-white" : "text-slate-500")}
                aria-pressed={locale === item}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <label className="relative">
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              className="h-9 appearance-none rounded-lg border border-slate-200 bg-white py-0 pl-3 pr-8 text-xs font-medium capitalize text-slate-600 outline-none"
              aria-label={t("demoRole")}
            >
              {(["owner", "member", "readonly"] as Role[]).map((item) => (
                <option key={item} value={item}>{roleLabel(item)}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          </label>
          <Avatar initials={user.initials} color={user.color} className="size-8" />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  active,
  icon: Icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: typeof BarChart3;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
      )}
    >
      <Icon className="size-4" />
      {children}
    </Link>
  );
}
