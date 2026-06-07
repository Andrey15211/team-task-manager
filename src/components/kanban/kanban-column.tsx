"use client";

/* eslint-disable react-hooks/refs -- dnd-kit exposes callback refs and drag state from hooks. */

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { TaskCard } from "@/components/tasks/task-card";
import { cn } from "@/lib/cn";
import type { Profile, Task, TaskStatus } from "@/types";

const columnStyles: Record<TaskStatus, { dot: string; soft: string }> = {
  todo: { dot: "bg-slate-400", soft: "bg-slate-100" },
  in_progress: { dot: "bg-blue-500", soft: "bg-blue-50" },
  review: { dot: "bg-violet-500", soft: "bg-violet-50" },
  done: { dot: "bg-emerald-500", soft: "bg-emerald-50" },
};

export function KanbanColumn({
  status,
  title,
  tasks,
  profiles,
  canCreate,
  canDrag,
  onCreate,
  onTaskClick,
}: {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  profiles: Profile[];
  canCreate: boolean;
  canDrag: boolean;
  onCreate: () => void;
  onTaskClick: (task: Task) => void;
}) {
  const droppable = useDroppable({ id: status, data: { type: "column", status } });
  const style = columnStyles[status];

  return (
    <section
      ref={droppable.setNodeRef}
      className={cn(
        "flex min-h-[520px] w-[292px] shrink-0 flex-col rounded-2xl border border-slate-200/80 bg-slate-100/70 p-3 transition xl:w-auto xl:min-w-0",
        droppable.isOver && "border-indigo-300 bg-indigo-50/70 ring-2 ring-indigo-100",
      )}
    >
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-2.5">
          <span className={cn("size-2.5 rounded-full", style.dot)} />
          <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-[11px] font-medium text-slate-500",
              style.soft,
            )}
          >
            {tasks.length}
          </span>
        </div>
        {canCreate && (
          <button
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-indigo-600"
            onClick={onCreate}
            aria-label={`Add task to ${title}`}
          >
            <Plus className="size-4" />
          </button>
        )}
      </div>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="mt-3 flex flex-1 flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              assignee={profiles.find((profile) => profile.id === task.assigneeId)!}
              onClick={() => onTaskClick(task)}
              disabled={!canDrag}
            />
          ))}
          {!tasks.length && (
            <div className="grid min-h-28 place-items-center rounded-xl border border-dashed border-slate-300 bg-white/60 p-4 text-center text-xs text-slate-400">
              Drop a task here
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}
