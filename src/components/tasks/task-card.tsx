"use client";

/* eslint-disable react-hooks/refs -- dnd-kit exposes callback refs and drag state from hooks. */

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CalendarDays, MessageSquare } from "lucide-react";
import { format, isBefore, parseISO } from "date-fns";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import type { Profile, Task } from "@/types";
import { useI18n } from "@/lib/i18n";
import { enUS, ru } from "date-fns/locale";

const priorityStyles = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
  urgent: "bg-rose-50 text-rose-700",
};

export function TaskCard({
  task,
  assignee,
  onClick,
  overlay = false,
  disabled = false,
}: {
  task: Task;
  assignee: Profile;
  onClick?: () => void;
  overlay?: boolean;
  disabled?: boolean;
}) {
  const { locale, priority, content } = useI18n();
  const sortable = useSortable({
    id: task.id,
    disabled,
    data: { type: "task", status: task.status },
  });
  const overdue =
    task.status !== "done" && isBefore(parseISO(task.dueDate), new Date("2026-06-07"));

  return (
    <article
      ref={sortable.setNodeRef}
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      {...sortable.attributes}
      {...sortable.listeners}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md",
        sortable.isDragging && "opacity-30",
        overlay && "rotate-2 shadow-xl ring-2 ring-indigo-300",
        disabled && "cursor-default",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
            priorityStyles[task.priority],
          )}
        >
          {priority(task.priority)}
        </span>
        <Avatar initials={assignee.initials} color={assignee.color} />
      </div>
      <h3 className="mt-3 text-sm font-semibold leading-5 text-slate-900">
        {content(task.title)}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
        {content(task.description)}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {task.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-slate-50 px-2 py-1 text-[10px] text-slate-500"
          >
            {content(tag)}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
        <span
          className={cn(
            "flex items-center gap-1.5",
            overdue && "font-medium text-rose-600",
          )}
        >
          <CalendarDays className="size-3.5" />
          {format(parseISO(task.dueDate), "MMM d", { locale: locale === "ru" ? ru : enUS })}
        </span>
        <span className="flex items-center gap-1.5">
          <MessageSquare className="size-3.5" />
          {task.commentIds.length}
        </span>
      </div>
    </article>
  );
}
