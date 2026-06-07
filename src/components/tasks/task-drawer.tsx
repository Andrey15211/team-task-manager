"use client";

import {
  CalendarDays,
  MessageSquare,
  Pencil,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import type { Profile, Task, TaskComment } from "@/types";
import { useI18n } from "@/lib/i18n";
import { enUS, ru } from "date-fns/locale";

export function TaskDrawer({
  task,
  profiles,
  comments,
  canEdit,
  canDelete,
  canComment,
  onClose,
  onEdit,
  onDelete,
  onComment,
}: {
  task: Task | null;
  profiles: Profile[];
  comments: TaskComment[];
  canEdit: boolean;
  canDelete: boolean;
  canComment: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onComment: (body: string) => void;
}) {
  const [comment, setComment] = useState("");
  const { locale, t, status, priority, content } = useI18n();
  if (!task) return null;
  const assignee = profiles.find((profile) => profile.id === task.assigneeId)!;

  return (
    <>
      <button
        className="fixed inset-0 z-30 bg-slate-950/20"
        onClick={onClose}
        aria-label={t("closeTaskDetails")}
      />
      <aside
        className="fixed inset-y-0 right-0 z-40 w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={t("taskDetails")}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
            {t("taskDetails")}
          </span>
          <div className="flex items-center gap-1">
            {canEdit && (
              <button className="icon-button" onClick={onEdit} aria-label={t("editTask")}>
                <Pencil className="size-4" />
              </button>
            )}
            {canDelete && (
              <button
                className="icon-button hover:text-rose-600"
                onClick={onDelete}
                aria-label={t("delete")}
              >
                <Trash2 className="size-4" />
              </button>
            )}
            <button className="icon-button" onClick={onClose} aria-label={t("close")}>
              <X className="size-4" />
            </button>
          </div>
        </div>
        <div className="px-6 py-7 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase",
                task.priority === "urgent"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              {priority(task.priority)}
            </span>
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-medium capitalize text-indigo-700">
              {status(task.status)}
            </span>
          </div>
          <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-slate-950">
            {content(task.title)}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{content(task.description)}</p>
          <dl className="mt-8 grid gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
            <Meta icon={UserRound} label={t("assignee")}>
              <span className="flex items-center gap-2">
                <Avatar initials={assignee.initials} color={assignee.color} />
                {assignee.name}
              </span>
            </Meta>
            <Meta icon={CalendarDays} label={t("deadline")}>
              {format(parseISO(task.dueDate), "MMMM d, yyyy", { locale: locale === "ru" ? ru : enUS })}
            </Meta>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500"
              >
                {content(tag)}
              </span>
            ))}
          </div>
          <section className="mt-10">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-slate-400" />
              <h3 className="font-semibold text-slate-900">
                {t("comments")} <span className="text-slate-400">{comments.length}</span>
              </h3>
            </div>
            <div className="mt-5 space-y-5">
              {comments.map((item) => {
                const author = profiles.find((profile) => profile.id === item.authorId)!;
                return (
                  <div key={item.id} className="flex gap-3">
                    <Avatar initials={author.initials} color={author.color} />
                    <div className="min-w-0 flex-1 rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-slate-800">
                          {author.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {format(parseISO(item.createdAt), "MMM d, HH:mm", { locale: locale === "ru" ? ru : enUS })}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{content(item.body)}</p>
                    </div>
                  </div>
                );
              })}
              {!comments.length && (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  {t("noComments")}
                </p>
              )}
            </div>
            {canComment && (
              <form
                className="mt-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!comment.trim()) return;
                  onComment(comment.trim());
                  setComment("");
                }}
              >
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  className="input min-h-24 resize-none"
                  placeholder={t("commentPlaceholder")}
                />
                <div className="mt-3 flex justify-end">
                  <button className="button-primary" disabled={!comment.trim()}>
                    {t("addComment")}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </aside>
    </>
  );
}

function Meta({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof UserRound;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs text-slate-400">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium text-slate-700">{children}</dd>
    </div>
  );
}
