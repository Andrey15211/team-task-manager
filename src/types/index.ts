export type Role = "owner" | "member" | "readonly";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Profile {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  memberIds: string[];
  createdAt: string;
}

export interface ProjectMember {
  projectId: string;
  profileId: string;
  role: Role;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
  tags: string[];
  commentIds: string[];
  createdAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface TaskFilters {
  query?: string;
  priority?: TaskPriority | "all";
  status?: TaskStatus | "all";
  assigneeId?: string | "all";
}

export interface AppData {
  profiles: Profile[];
  projects: Project[];
  projectMembers: ProjectMember[];
  tasks: Task[];
  comments: TaskComment[];
}
