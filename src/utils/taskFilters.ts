import type { Task, TaskFilters } from "@/types";

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const query = filters.query?.trim().toLowerCase();

  return tasks.filter((task) => {
    const searchable = [task.title, task.description, ...task.tags]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!filters.priority ||
        filters.priority === "all" ||
        task.priority === filters.priority) &&
      (!filters.status ||
        filters.status === "all" ||
        task.status === filters.status) &&
      (!filters.assigneeId ||
        filters.assigneeId === "all" ||
        task.assigneeId === filters.assigneeId)
    );
  });
}
