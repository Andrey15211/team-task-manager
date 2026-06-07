import type { Role } from "@/types";

export interface Permissions {
  canCreateProject: boolean;
  canManageProject: boolean;
  canCreateTask: boolean;
  canEditTask: boolean;
  canDeleteTask: boolean;
  canComment: boolean;
}

const permissionsByRole: Record<Role, Permissions> = {
  owner: {
    canCreateProject: true,
    canManageProject: true,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: true,
    canComment: true,
  },
  member: {
    canCreateProject: false,
    canManageProject: false,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: false,
    canComment: true,
  },
  readonly: {
    canCreateProject: false,
    canManageProject: false,
    canCreateTask: false,
    canEditTask: false,
    canDeleteTask: false,
    canComment: false,
  },
};

export function getPermissions(role: Role): Permissions {
  return permissionsByRole[role];
}
