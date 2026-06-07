"use client";

import { FolderPlus, Plus } from "lucide-react";
import { useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectForm } from "@/components/forms/project-form";
import { Modal } from "@/components/ui/modal";
import { useAppStore } from "@/lib/app-store";
import type { Project } from "@/types";
import { getPermissions } from "@/utils/permissions";

export function ProjectsView() {
  const { data, role, createProject, updateProject, deleteProject } = useAppStore();
  const permissions = getPermissions(role);
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
          <p className="text-sm font-medium text-indigo-600">Workspace</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Projects
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Plan initiatives, track delivery, and keep ownership visible.
          </p>
        </div>
        {permissions.canCreateProject && (
          <button className="button-primary" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            New project
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
                if (window.confirm(`Delete ${project.name} and all its tasks?`)) {
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
            <h2 className="mt-4 font-semibold text-slate-900">No projects yet</h2>
            <p className="mt-2 text-sm text-slate-500">
              Create the first project to start organizing work.
            </p>
          </div>
        </div>
      )}

      <Modal
        title={editing ? "Edit project" : "Create project"}
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
          submitLabel={editing ? "Save changes" : "Create project"}
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
