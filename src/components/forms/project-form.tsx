"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  projectSchema,
  type ProjectInput,
} from "@/lib/schemas";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
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
      <Field label={t("projectName")} error={errors.name ? t("validationProjectName") : undefined}>
        <input {...register("name")} className="input" placeholder={t("projectNamePlaceholder")} />
      </Field>
      <Field label={t("description")} error={errors.description ? t("validationProjectDescription") : undefined}>
        <textarea
          {...register("description")}
          className="input min-h-28 resize-none"
          placeholder={t("projectDescriptionPlaceholder")}
        />
      </Field>
      <Field label={t("projectColor")} error={errors.color?.message}>
        <div className="flex items-center gap-3">
          <input {...register("color")} type="color" className="size-10 cursor-pointer" />
          <span className="text-sm text-slate-500">{t("projectColorHint")}</span>
        </div>
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
