import { describe, expect, it } from "vitest";
import { getPermissions } from "@/utils/permissions";

describe("getPermissions", () => {
  it("allows owners to manage projects and tasks", () => {
    expect(getPermissions("owner")).toEqual({
      canCreateProject: true,
      canManageProject: true,
      canCreateTask: true,
      canEditTask: true,
      canDeleteTask: true,
      canComment: true,
    });
  });

  it("allows members to work with tasks but not manage projects", () => {
    expect(getPermissions("member")).toEqual({
      canCreateProject: false,
      canManageProject: false,
      canCreateTask: true,
      canEditTask: true,
      canDeleteTask: false,
      canComment: true,
    });
  });

  it("keeps readonly users in view-only mode", () => {
    expect(Object.values(getPermissions("readonly")).every((value) => !value)).toBe(true);
  });
});
