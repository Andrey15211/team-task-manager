import type { Task, TaskStatus } from "@/types";

export function moveTask(
  tasks: Task[],
  taskId: string,
  status: TaskStatus,
): Task[] {
  if (!tasks.some((task) => task.id === taskId)) {
    return tasks;
  }

  return tasks.map((task) => (task.id === taskId ? { ...task, status } : task));
}
