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

export function DashboardView() {
  const { data } = useAppStore();
  const activeTasks = data.tasks.filter((task) => task.status !== "done");
  const doneTasks = data.tasks.filter((task) => task.status === "done");
  const dueSoon = activeTasks.filter((task) => task.dueDate <= "2026-06-10");
  const recentTasks = [...data.tasks].slice(0, 5);

  const stats = [
    { label: "Active projects", value: data.projects.length, icon: FolderKanban },
    { label: "Open tasks", value: activeTasks.length, icon: ListTodo },
    { label: "Due soon", value: dueSoon.length, icon: Clock3 },
    { label: "Completed", value: doneTasks.length, icon: CheckCircle2 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-indigo-600">Sunday, June 7</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Good morning, Maya
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Here is what needs attention across the workspace.
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
              <h2 className="font-semibold text-slate-950">Recent tasks</h2>
              <p className="mt-1 text-xs text-slate-500">
                The latest work across active projects.
              </p>
            </div>
            <Link href="/projects" className="text-sm font-medium text-indigo-600">
              View projects
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
                      {task.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{project?.name}</p>
                  </div>
                  <span className="hidden rounded-md bg-slate-100 px-2 py-1 text-[11px] capitalize text-slate-500 sm:block">
                    {task.status.replace("_", " ")}
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
              <h2 className="font-semibold text-slate-950">Project health</h2>
              <p className="mt-1 text-xs text-slate-500">Completion by project.</p>
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
                    <span className="font-medium text-slate-700">{project.name}</span>
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
            Manage all projects
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
