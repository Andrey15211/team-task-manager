"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  projectSchema,
  type ProjectInput,
} from "@/lib/schemas";

export function ProjectForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  defaultValues?: ProjectInput;
  submitLabel: string;
  onSubmit: (values: ProjectInput) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      color: "#4f46e5",
    },
  });

  return (
    <form className="space-y-5 p-6" onSubmit={handleSubmit(onSubmit)}>
      <Field label="Project name" error={errors.name?.message}>
        <input {...register("name")} className="input" placeholder="Website redesign" />
      </Field>
      <Field label="Description" error={errors.description?.message}>
        <textarea
          {...register("description")}
          className="input min-h-28 resize-none"
          placeholder="What is the team coordinating in this project?"
        />
      </Field>
      <Field label="Project color" error={errors.color?.message}>
        <div className="flex items-center gap-3">
          <input {...register("color")} type="color" className="size-10 cursor-pointer" />
          <span className="text-sm text-slate-500">Used in project navigation.</span>
        </div>
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
