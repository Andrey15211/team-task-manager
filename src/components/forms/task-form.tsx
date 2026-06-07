"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { taskSchema, type TaskInput } from "@/lib/schemas";
import type { Profile } from "@/types";

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
      <Field label="Task title" error={errors.title?.message}>
        <input {...register("title")} className="input" placeholder="Prepare sprint review" />
      </Field>
      <Field label="Description" error={errors.description?.message}>
        <textarea
          {...register("description")}
          className="input min-h-28 resize-none"
          placeholder="Add enough context for the assignee to start."
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status" error={errors.status?.message}>
          <select {...register("status")} className="input">
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </Field>
        <Field label="Priority" error={errors.priority?.message}>
          <select {...register("priority")} className="input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </Field>
        <Field label="Assignee" error={errors.assigneeId?.message}>
          <select {...register("assigneeId")} className="input">
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Deadline" error={errors.dueDate?.message}>
          <input {...register("dueDate")} type="date" className="input" />
        </Field>
      </div>
      <Field label="Tags" error={errors.tags?.message}>
        <input
          {...register("tags")}
          className="input"
          placeholder="Design, Research, Mobile"
        />
      </Field>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button type="button" className="button-secondary" onClick={onCancel}>
          Cancel
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
