"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { taskSchema, type TaskInput } from "@/lib/schemas";
import type { Profile } from "@/types";
import { useI18n } from "@/lib/i18n";

export function TaskForm({
  profiles,
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  profiles: Profile[];
  defaultValues?: TaskInput;
  submitLabel: string;
  onSubmit: (values: TaskInput) => void;
  onCancel: () => void;
}) {
  const { t, status, priority } = useI18n();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assigneeId: profiles[0]?.id ?? "",
      dueDate: "2026-06-15",
      tags: "",
    },
  });

  return (
    <form className="space-y-5 p-6" onSubmit={handleSubmit(onSubmit)}>
      <Field label={t("taskTitle")} error={errors.title ? t("validationTaskTitle") : undefined}>
        <input {...register("title")} className="input" placeholder={t("taskTitlePlaceholder")} />
      </Field>
      <Field label={t("description")} error={errors.description ? t("validationTaskDescription") : undefined}>
        <textarea
          {...register("description")}
          className="input min-h-28 resize-none"
          placeholder={t("taskDescriptionPlaceholder")}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("status")} error={errors.status?.message}>
          <select {...register("status")} className="input">
            {(["todo", "in_progress", "review", "done"] as const).map((item) => <option key={item} value={item}>{status(item)}</option>)}
          </select>
        </Field>
        <Field label={t("priority")} error={errors.priority?.message}>
          <select {...register("priority")} className="input">
            {(["low", "medium", "high", "urgent"] as const).map((item) => <option key={item} value={item}>{priority(item)}</option>)}
          </select>
        </Field>
        <Field label={t("assignee")} error={errors.assigneeId ? t("validationAssignee") : undefined}>
          <select {...register("assigneeId")} className="input">
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("deadline")} error={errors.dueDate ? t("validationDeadline") : undefined}>
          <input {...register("dueDate")} type="date" className="input" />
        </Field>
      </div>
      <Field label={t("tags")} error={errors.tags?.message}>
        <input
          {...register("tags")}
          className="input"
          placeholder={t("tagsPlaceholder")}
        />
      </Field>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button type="button" className="button-secondary" onClick={onCancel}>
          {t("cancel")}
        </button>
        <button className="button-primary" disabled={isSubmitting}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
      {error && <span className="block text-xs text-rose-600">{error}</span>}
    </label>
  );
}
