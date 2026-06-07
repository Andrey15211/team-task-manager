import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().trim().min(2, "Project name is required").max(60),
  description: z.string().trim().min(10, "Add a short project description").max(240),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const taskSchema = z.object({
  title: z.string().trim().min(3, "Task title is required").max(100),
  description: z.string().trim().min(10, "Add a useful task description").max(500),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assigneeId: z.string().min(1, "Choose an assignee"),
  dueDate: z.string().min(1, "Choose a deadline"),
  tags: z.string().trim(),
});

export const authSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type AuthInput = z.infer<typeof authSchema>;
