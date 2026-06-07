"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { initialData } from "@/data/mockData";
import { moveTask } from "@/lib/taskState";
import type {
  AppData,
  Project,
  Role,
  Task,
  TaskComment,
  TaskStatus,
} from "@/types";
import type { ProjectInput, TaskInput } from "@/lib/schemas";

const STORAGE_KEY = "taskflow-demo-data";

interface AppStore {
  data: AppData;
  currentUserId: string;
  role: Role;
  setRole: (role: Role) => void;
  createProject: (input: ProjectInput) => Project;
  updateProject: (id: string, input: ProjectInput) => void;
  deleteProject: (id: string) => void;
  createTask: (projectId: string, input: TaskInput) => Task;
  updateTask: (id: string, input: TaskInput) => void;
  deleteTask: (id: string) => void;
  moveTaskTo: (id: string, status: TaskStatus) => void;
  addComment: (taskId: string, body: string) => void;
  resetDemo: () => void;
}

const AppStoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    if (typeof window === "undefined") return initialData;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialData;
    try {
      return JSON.parse(saved) as AppData;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return initialData;
    }
  });
  const [role, setRole] = useState<Role>("owner");
  const currentUserId = "user-1";

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const createProject = useCallback(
    (input: ProjectInput) => {
      const project: Project = {
        ...input,
        id: crypto.randomUUID(),
        memberIds: [currentUserId],
        createdAt: new Date().toISOString(),
      };
      setData((current) => ({
        ...current,
        projects: [...current.projects, project],
        projectMembers: [
          ...current.projectMembers,
          { projectId: project.id, profileId: currentUserId, role: "owner" },
        ],
      }));
      return project;
    },
    [currentUserId],
  );

  const updateProject = useCallback((id: string, input: ProjectInput) => {
    setData((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === id ? { ...project, ...input } : project,
      ),
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      projects: current.projects.filter((project) => project.id !== id),
      projectMembers: current.projectMembers.filter(
        (member) => member.projectId !== id,
      ),
      tasks: current.tasks.filter((task) => task.projectId !== id),
      comments: current.comments.filter((comment) =>
        current.tasks.some(
          (task) => task.id === comment.taskId && task.projectId !== id,
        ),
      ),
    }));
  }, []);

  const createTask = useCallback((projectId: string, input: TaskInput) => {
    const task: Task = {
      ...input,
      id: crypto.randomUUID(),
      projectId,
      tags: input.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      commentIds: [],
      createdAt: new Date().toISOString(),
    };
    setData((current) => ({ ...current, tasks: [...current.tasks, task] }));
    return task;
  }, []);

  const updateTask = useCallback((id: string, input: TaskInput) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...input,
              tags: input.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            }
          : task,
      ),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== id),
      comments: current.comments.filter((comment) => comment.taskId !== id),
    }));
  }, []);

  const moveTaskTo = useCallback((id: string, status: TaskStatus) => {
    setData((current) => ({ ...current, tasks: moveTask(current.tasks, id, status) }));
  }, []);

  const addComment = useCallback(
    (taskId: string, body: string) => {
      const comment: TaskComment = {
        id: crypto.randomUUID(),
        taskId,
        authorId: currentUserId,
        body,
        createdAt: new Date().toISOString(),
      };
      setData((current) => ({
        ...current,
        comments: [...current.comments, comment],
        tasks: current.tasks.map((task) =>
          task.id === taskId
            ? { ...task, commentIds: [...task.commentIds, comment.id] }
            : task,
        ),
      }));
    },
    [currentUserId],
  );

  const resetDemo = useCallback(() => setData(initialData), []);

  const value = useMemo(
    () => ({
      data,
      currentUserId,
      role,
      setRole,
      createProject,
      updateProject,
      deleteProject,
      createTask,
      updateTask,
      deleteTask,
      moveTaskTo,
      addComment,
      resetDemo,
    }),
    [
      data,
      role,
      createProject,
      updateProject,
      deleteProject,
      createTask,
      updateTask,
      deleteTask,
      moveTaskTo,
      addComment,
      resetDemo,
    ],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore must be used inside AppStoreProvider");
  }
  return context;
}
