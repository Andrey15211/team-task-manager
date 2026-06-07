"use client";

import { FolderPlus, Plus } from "lucide-react";
import { useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectForm } from "@/components/forms/project-form";
import { Modal } from "@/components/ui/modal";
import { useAppStore } from "@/lib/app-store";
import type { Project } from "@/types";
import { getPermissions } from "@/utils/permissions";
import { useI18n } from "@/lib/i18n";

export function ProjectsView() {
  const { data, role, createProject, updateProject, deleteProject } = useAppStore();
  const permissions = getPermissions(role);
  const { t, content } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const close = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">{t("workspace")}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            {t("projects")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {t("projectsLead")}
          </p>
        </div>
        {permissions.canCreateProject && (
          <button className="button-primary" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            {t("newProject")}
          </button>
        )}
      </div>

      {data.projects.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={data.tasks.filter((task) => task.projectId === project.id)}
              profiles={data.profiles.filter((profile) =>
                project.memberIds.includes(profile.id),
              )}
              canManage={permissions.canManageProject}
              onEdit={() => {
                setEditing(project);
                setModalOpen(true);
              }}
              onDelete={() => {
                if (window.confirm(`${content(project.name)}: ${t("deleteProjectConfirm")}`)) {
                  deleteProject(project.id);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid min-h-80 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <div>
            <FolderPlus className="mx-auto size-10 text-slate-300" />
            <h2 className="mt-4 font-semibold text-slate-900">{t("noProjects")}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {t("noProjectsText")}
            </p>
          </div>
        </div>
      )}

      <Modal
        title={editing ? t("editProject") : t("createProject")}
        open={modalOpen}
        onClose={close}
      >
        <ProjectForm
          defaultValues={
            editing
              ? {
                  name: editing.name,
                  description: editing.description,
                  color: editing.color,
                }
              : undefined
          }
          submitLabel={editing ? t("saveChanges") : t("createProject")}
          onCancel={close}
          onSubmit={(values) => {
            if (editing) updateProject(editing.id, values);
            else createProject(values);
            close();
          }}
        />
      </Modal>
    </div>
  );
}
