# Taskflow

Taskflow is a portfolio-grade team task management application built around project ownership, role-aware collaboration, deadlines, comments, filters, and a drag-and-drop Kanban workflow.

The current demo uses typed mock data persisted in `localStorage`. Authentication and data access are isolated behind replaceable client adapters so the UI can be connected to Supabase or Auth.js without restructuring feature components.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- dnd-kit
- React Hook Form
- Zod
- Vitest and Testing Library
- Lucide icons

## Features

- Mock login, registration, logout, and protected application layout
- Dashboard with workspace stats, recent tasks, and project health
- Project create, edit, delete, list, and detail views
- Four-column Kanban: Todo, In Progress, Review, Done
- Drag-and-drop task status updates with visual drop feedback
- Task create, edit, delete, deadlines, priorities, assignees, and tags
- Task detail drawer with comments and activity context
- Combined search, priority, status, and assignee filters
- Owner, member, and readonly UI permission modes
- Responsive sidebar, horizontally scrollable mobile Kanban, loading, error, and empty states
- Local persistence and demo-data reset

## Role System

| Capability | Owner | Member | Readonly |
| --- | --- | --- | --- |
| Create/manage projects | Yes | No | No |
| Create/edit tasks | Yes | Yes | No |
| Delete tasks | Yes | No | No |
| Add comments | Yes | Yes | No |
| View projects and tasks | Yes | Yes | Yes |

The role selector in the top bar demonstrates all permission states. Production authorization must also be enforced in database policies or server-side handlers; hiding controls is not a security boundary.

## Architecture

```text
src/app                    App Router pages, layouts, loading/error states
src/components/auth        Mock auth forms and protected-layout gate
src/components/layout      Responsive application shell
src/components/projects    Dashboard and project CRUD
src/components/kanban      dnd-kit board and columns
src/components/tasks       Task cards and detail drawer
src/components/forms       React Hook Form + Zod forms
src/data/mockData.ts       Typed demo seed data
src/lib/app-store.tsx      Replaceable local repository/state adapter
src/types                  Domain contracts
src/utils                  Permissions and task filtering
```

`app-store.tsx` is intentionally the migration boundary. A Supabase implementation can replace its CRUD methods with server actions or repository calls while preserving the components and domain types.

## Database-Ready Schema

Recommended Supabase/Postgres tables:

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id),
  name text not null,
  description text not null default '',
  color text not null default '#4f46e5',
  created_at timestamptz not null default now()
);

create table project_members (
  project_id uuid not null references projects(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'member', 'readonly')),
  primary key (project_id, profile_id)
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null check (status in ('todo', 'in_progress', 'review', 'done')),
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  assignee_id uuid references profiles(id),
  due_date date,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  author_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);
```

For Supabase, add Row Level Security policies based on `project_members.role`. Owners manage projects and all tasks, members mutate tasks/comments, and readonly members receive select-only access.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The login form is prefilled with demo credentials; any valid email and password of at least six characters creates the mock session.

## Checks

```bash
npm test
npm run lint
npm run build
```

## Environment

The demo needs no environment variables. For a Supabase integration, copy `.env.example` to `.env.local` and provide the public project values locally.

Never expose a Supabase service-role key to the browser.

## Vercel Deployment

1. Import the repository in Vercel.
2. Keep the detected framework preset as Next.js.
3. Use `npm run build` as the build command.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` only after connecting Supabase.
5. Deploy. The mock-data version works without environment variables.

For Auth.js, configure its provider secrets and `AUTH_SECRET` in Vercel, then replace the mock gate with server-side session checks.

## Fullstack Skills Demonstrated

- Domain modeling and role-based permissions
- App Router layout and route composition
- Accessible forms and validation
- Stateful drag-and-drop workflows
- CRUD architecture and persistence boundaries
- Responsive product UI design
- Database schema and authorization planning
- Testable utility logic and production build verification

The approved visual reference is stored at `docs/design/taskflow-concept.png`.
