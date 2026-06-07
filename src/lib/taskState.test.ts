import { describe, expect, it } from "vitest";
import type { Task } from "@/types";
import { moveTask } from "@/lib/taskState";

const task: Task = {
  id: "task-1",
  projectId: "project-1",
  title: "Prepare launch checklist",
  description: "Confirm release owners.",
  status: "todo",
  priority: "urgent",
  assigneeId: "user-1",
  dueDate: "2026-06-08",
  tags: ["Launch"],
  commentIds: [],
  createdAt: "2026-06-01",
};

describe("moveTask", () => {
  it("updates the selected task status without mutating the source array", () => {
    const source = [task];
    const result = moveTask(source, "task-1", "in_progress");

    expect(result[0].status).toBe("in_progress");
    expect(source[0].status).toBe("todo");
  });

  it("returns the same tasks when the target does not exist", () => {
    expect(moveTask([task], "missing", "done")).toEqual([task]);
  });
});
