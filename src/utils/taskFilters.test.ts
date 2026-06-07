import { describe, expect, it } from "vitest";
import type { Task } from "@/types";
import { filterTasks } from "@/utils/taskFilters";

const tasks: Task[] = [
  {
    id: "task-1",
    projectId: "project-1",
    title: "Review onboarding flow",
    description: "Check the new member experience.",
    status: "review",
    priority: "high",
    assigneeId: "user-1",
    dueDate: "2026-06-10",
    tags: ["Product"],
    commentIds: [],
    createdAt: "2026-06-01",
  },
  {
    id: "task-2",
    projectId: "project-1",
    title: "Write release notes",
    description: "Summarize the June release.",
    status: "todo",
    priority: "medium",
    assigneeId: "user-2",
    dueDate: "2026-06-15",
    tags: ["Content"],
    commentIds: [],
    createdAt: "2026-06-02",
  },
];

describe("filterTasks", () => {
  it("combines search, priority, status and assignee filters", () => {
    expect(
      filterTasks(tasks, {
        query: "onboarding",
        priority: "high",
        status: "review",
        assigneeId: "user-1",
      }),
    ).toEqual([tasks[0]]);
  });

  it("matches query against tags and description", () => {
    expect(filterTasks(tasks, { query: "content" })).toEqual([tasks[1]]);
    expect(filterTasks(tasks, { query: "member experience" })).toEqual([tasks[0]]);
  });
});
