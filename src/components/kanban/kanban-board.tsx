"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskDrawer } from "@/components/tasks/task-drawer";
import { TaskForm } from "@/components/forms/task-form";
import { Modal } from "@/components/ui/modal";
import { useAppStore } from "@/lib/app-store";
import type { Task, TaskFilters, TaskStatus } from "@/types";
import { filterTasks } from "@/utils/taskFilters";
import { getPermissions } from "@/utils/permissions";

const columns: { status: TaskStatus; title: string }[] = [
  { status: "todo", title: "Todo" },
  { status: "in_progress", title: "In Progress" },
  { status: "review", title: "Review" },
  { status: "done", title: "Done" },
];

export function KanbanBoard({ projectId }: { projectId: string }) {
  const {
    data,
    role,
    createTask,
    updateTask,
    deleteTask,
    moveTaskTo,
    addComment,
  } = useAppStore();
  const permissions = getPermissions(role);
  const project = data.projects.find((item) => item.id === projectId);
  const projectTasks = data.tasks.filter((task) => task.projectId === projectId);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [createStatus, setCreateStatus] = useState<TaskStatus>("todo");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const visibleTasks = useMemo(
    () => filterTasks(projectTasks, filters),
    [projectTasks, filters],
  );
  const selectedTask =
    data.tasks.find((task) => task.id === selectedTaskId) ?? null;

  if (!project) {
    return (
      <div className="grid min-h-[calc(100vh-4rem)] place-items-center p-8 text-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Project not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            It may have been deleted from the demo workspace.
          </p>
        </div>
      </div>
    );
  }

  const startCreate = (status: TaskStatus) => {
    setCreateStatus(status);
    setEditingTask(null);
    setFormOpen(true);
  };

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(data.tasks.find((task) => task.id === active.id) ?? null);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over || !permissions.canEditTask) return;
    const overTask = data.tasks.find((task) => task.id === over.id);
    const status = (overTask?.status ?? over.data.current?.status) as
      | TaskStatus
      | undefined;
    if (status) moveTaskTo(String(active.id), status);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="size-3 rounded"
                  style={{ backgroundColor: project.color }}
                />
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {project.name}
                </h1>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                {project.description}
              </p>
            </div>
            {permissions.canCreateTask && (
              <button className="button-primary" onClick={() => startCreate("todo")}>
                <Plus className="size-4" />
                Add task
              </button>
            )}
          </div>
          <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center">
            <label className="relative flex-1 xl:max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.query ?? ""}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, query: event.target.value }))
                }
                className="input pl-9"
                placeholder="Search tasks or tags"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
              <span className="flex items-center gap-2 px-2 text-xs font-medium text-slate-400">
                <SlidersHorizontal className="size-4" />
                Filters
              </span>
              <FilterSelect
                label="Priority"
                value={filters.priority ?? "all"}
                onChange={(priority) =>
                  setFilters((current) => ({
                    ...current,
                    priority: priority as TaskFilters["priority"],
                  }))
                }
                options={["all", "low", "medium", "high", "urgent"]}
              />
              <FilterSelect
                label="Status"
                value={filters.status ?? "all"}
                onChange={(status) =>
                  setFilters((current) => ({
                    ...current,
                    status: status as TaskFilters["status"],
                  }))
                }
                options={["all", "todo", "in_progress", "review", "done"]}
              />
              <select
                value={filters.assigneeId ?? "all"}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    assigneeId: event.target.value,
                  }))
                }
                className="filter-select"
                aria-label="Filter by assignee"
              >
                <option value="all">All assignees</option>
                {data.profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
              <span className="flex items-center gap-1.5 whitespace-nowrap px-2 text-xs text-slate-400">
                <Filter className="size-3.5" />
                {visibleTasks.length} tasks
              </span>
            </div>
          </div>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragCancel={() => setActiveTask(null)}
        onDragEnd={onDragEnd}
      >
        <div className="mx-auto grid max-w-[1600px] grid-flow-col gap-4 overflow-x-auto px-4 py-6 sm:px-6 lg:px-8 xl:grid-flow-row xl:grid-cols-4 xl:overflow-visible">
          {columns.map((column) => (
            <KanbanColumn
              key={column.status}
              status={column.status}
              title={column.title}
              tasks={visibleTasks.filter((task) => task.status === column.status)}
              profiles={data.profiles}
              canCreate={permissions.canCreateTask}
              canDrag={permissions.canEditTask}
              onCreate={() => startCreate(column.status)}
              onTaskClick={(task) => setSelectedTaskId(task.id)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="w-[292px]">
              <TaskCard
                task={activeTask}
                assignee={
                  data.profiles.find(
                    (profile) => profile.id === activeTask.assigneeId,
                  )!
                }
                overlay
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <TaskDrawer
        task={selectedTask}
        profiles={data.profiles}
        comments={data.comments.filter(
          (comment) => comment.taskId === selectedTask?.id,
        )}
        canEdit={permissions.canEditTask}
        canDelete={permissions.canDeleteTask}
        canComment={permissions.canComment}
        onClose={() => setSelectedTaskId(null)}
        onEdit={() => {
          setEditingTask(selectedTask);
          setFormOpen(true);
        }}
        onDelete={() => {
          if (selectedTask && window.confirm(`Delete "${selectedTask.title}"?`)) {
            deleteTask(selectedTask.id);
            setSelectedTaskId(null);
          }
        }}
        onComment={(body) => selectedTask && addComment(selectedTask.id, body)}
      />
      <Modal
        title={editingTask ? "Edit task" : "Create task"}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(null);
        }}
      >
        <TaskForm
          profiles={data.profiles}
          defaultValues={
            editingTask
              ? {
                  title: editingTask.title,
                  description: editingTask.description,
                  status: editingTask.status,
                  priority: editingTask.priority,
                  assigneeId: editingTask.assigneeId,
                  dueDate: editingTask.dueDate,
                  tags: editingTask.tags.join(", "),
                }
              : {
                  title: "",
                  description: "",
                  status: createStatus,
                  priority: "medium",
                  assigneeId: data.profiles[0]?.id ?? "",
                  dueDate: "2026-06-15",
                  tags: "",
                }
          }
          submitLabel={editingTask ? "Save changes" : "Create task"}
          onCancel={() => {
            setFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={(values) => {
            if (editingTask) updateTask(editingTask.id, values);
            else createTask(projectId, values);
            setFormOpen(false);
            setEditingTask(null);
          }}
        />
      </Modal>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="filter-select"
      aria-label={`Filter by ${label.toLowerCase()}`}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option === "all"
            ? `All ${label.toLowerCase()}`
            : option.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
