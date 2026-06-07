"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
} from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/app-store";
import { useI18n } from "@/lib/i18n";

export function DashboardView() {
  const { data } = useAppStore();
  const { t, status, content } = useI18n();
  const activeTasks = data.tasks.filter((task) => task.status !== "done");
  const doneTasks = data.tasks.filter((task) => task.status === "done");
  const dueSoon = activeTasks.filter((task) => task.dueDate <= "2026-06-10");
  const recentTasks = [...data.tasks].slice(0, 5);

  const stats = [
    { label: t("activeProjects"), value: data.projects.length, icon: FolderKanban },
    { label: t("openTasks"), value: activeTasks.length, icon: ListTodo },
    { label: t("dueSoon"), value: dueSoon.length, icon: Clock3 },
    { label: t("completed"), value: doneTasks.length, icon: CheckCircle2 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-indigo-600">{t("greetingDate")}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          {t("greeting")}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {t("attention")}
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{label}</span>
              <Icon className="size-4 text-slate-400" />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              {value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="font-semibold text-slate-950">{t("recentTasks")}</h2>
              <p className="mt-1 text-xs text-slate-500">
                {t("recentTasksText")}
              </p>
            </div>
            <Link href="/projects" className="text-sm font-medium text-indigo-600">
              {t("viewProjects")}
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentTasks.map((task) => {
              const assignee = data.profiles.find(
                (profile) => profile.id === task.assigneeId,
              )!;
              const project = data.projects.find(
                (item) => item.id === task.projectId,
              );
              return (
                <Link
                  key={task.id}
                  href={`/projects/${task.projectId}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: project?.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {content(task.title)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{project ? content(project.name) : ""}</p>
                  </div>
                  <span className="hidden rounded-md bg-slate-100 px-2 py-1 text-[11px] capitalize text-slate-500 sm:block">
                    {status(task.status)}
                  </span>
                  <Avatar initials={assignee.initials} color={assignee.color} />
                </Link>
              );
            })}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-950">{t("projectHealth")}</h2>
              <p className="mt-1 text-xs text-slate-500">{t("completionByProject")}</p>
            </div>
          </div>
          <div className="mt-6 space-y-6">
            {data.projects.map((project) => {
              const tasks = data.tasks.filter((task) => task.projectId === project.id);
              const done = tasks.filter((task) => task.status === "done").length;
              const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
              return (
                <div key={project.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{content(project.name)}</span>
                    <span className="text-slate-400">{progress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${progress}%`, backgroundColor: project.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            href="/projects"
            className="mt-8 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {t("manageProjects")}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
