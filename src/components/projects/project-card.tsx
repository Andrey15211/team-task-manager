"use client";

import { ArrowUpRight, CalendarDays, MoreHorizontal, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import type { Profile, Project, Task } from "@/types";

export function ProjectCard({
  project,
  tasks,
  profiles,
  canManage,
  onEdit,
  onDelete,
}: {
  project: Project;
  tasks: Task[];
  profiles: Profile[];
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const completed = tasks.filter((task) => task.status === "done").length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <span
          className="grid size-11 place-items-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: project.color }}
        >
          {project.name.slice(0, 2).toUpperCase()}
        </span>
        {canManage && (
          <div className="relative">
            <button
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Project actions"
            >
              <MoreHorizontal className="size-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 w-32 rounded-lg border border-slate-200 bg-white p-1 text-sm shadow-lg">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit();
                  }}
                  className="w-full rounded-md px-3 py-2 text-left hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="w-full rounded-md px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Link href={`/projects/${project.id}`} className="mt-5 block">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-950">{project.name}</h3>
          <ArrowUpRight className="size-4 text-slate-300 transition group-hover:text-indigo-600" />
        </div>
        <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
          {project.description}
        </p>
      </Link>
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{completed} of {tasks.length} complete</span>
          <span className="font-medium text-slate-700">{progress}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex -space-x-2">
          {profiles.slice(0, 4).map((profile) => (
            <Avatar
              key={profile.id}
              initials={profile.initials}
              color={profile.color}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            {project.memberIds.length}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {tasks.length}
          </span>
        </div>
      </div>
    </article>
  );
}
