"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role, TaskPriority, TaskStatus } from "@/types";

export type Locale = "ru" | "en";

const ru = {
  overview: "Обзор", projects: "Проекты", workspaceProjects: "Проекты пространства",
  newProject: "Новый проект", resetDemo: "Сбросить демо-данные", logout: "Выйти",
  closeNavigation: "Закрыть навигацию", closeSidebar: "Закрыть боковую панель",
  openNavigation: "Открыть навигацию", searchWorkspace: "Поиск по пространству",
  demoRole: "Демо-роль", workspace: "Рабочее пространство",
  activeProjects: "Активные проекты", openTasks: "Открытые задачи", dueSoon: "Скоро срок",
  completed: "Завершено", greetingDate: "Воскресенье, 7 июня", greeting: "Доброе утро, Майя",
  attention: "Вот что требует внимания в рабочем пространстве.",
  recentTasks: "Недавние задачи", recentTasksText: "Последняя работа по активным проектам.",
  viewProjects: "Открыть проекты", projectHealth: "Состояние проектов",
  completionByProject: "Прогресс по проектам.", manageProjects: "Управлять проектами",
  projectsLead: "Планируйте инициативы, отслеживайте выполнение и сохраняйте прозрачное владение.",
  noProjects: "Проектов пока нет", noProjectsText: "Создайте первый проект, чтобы организовать работу.",
  editProject: "Редактировать проект", createProject: "Создать проект",
  saveChanges: "Сохранить изменения", edit: "Редактировать", delete: "Удалить",
  projectActions: "Действия с проектом", complete: "завершено", of: "из",
  deleteProjectConfirm: "Удалить проект и все его задачи?",
  projectName: "Название проекта", projectNamePlaceholder: "Редизайн сайта",
  description: "Описание", projectDescriptionPlaceholder: "Что команда координирует в этом проекте?",
  projectColor: "Цвет проекта", projectColorHint: "Используется в навигации проекта.",
  cancel: "Отмена", taskTitle: "Название задачи", taskTitlePlaceholder: "Подготовить обзор спринта",
  taskDescriptionPlaceholder: "Добавьте контекст, достаточный для начала работы.",
  status: "Статус", priority: "Приоритет", assignee: "Исполнитель", deadline: "Срок",
  tags: "Теги", tagsPlaceholder: "Дизайн, Исследование, Мобильная версия",
  addTask: "Добавить задачу", searchTasks: "Поиск по задачам или тегам", filters: "Фильтры",
  allPriorities: "Все приоритеты", allStatuses: "Все статусы", allAssignees: "Все исполнители",
  tasks: "задач", projectNotFound: "Проект не найден",
  projectNotFoundText: "Возможно, он был удалён из демо-пространства.",
  editTask: "Редактировать задачу", createTask: "Создать задачу",
  deleteTaskConfirm: "Удалить задачу?", dropTask: "Перетащите задачу сюда",
  addTaskTo: "Добавить задачу в", taskDetails: "Детали задачи",
  closeTaskDetails: "Закрыть детали задачи", close: "Закрыть", comments: "Комментарии",
  noComments: "Комментариев пока нет. Добавьте первое обновление проекта.",
  commentPlaceholder: "Добавьте понятное обновление или вопрос...", addComment: "Добавить комментарий",
  email: "Email", password: "Пароль", welcomeBack: "С возвращением",
  createWorkspace: "Создайте рабочее пространство",
  loginText: "Войдите, чтобы координировать проекты, сроки и прогресс команды.",
  registerText: "Начните организовывать командную работу в едином пространстве.",
  signIn: "Войти", createAccount: "Создать аккаунт", newToTaskflow: "Впервые в Taskflow?",
  alreadyAccount: "Уже есть аккаунт?", focusedExecution: "Сфокусированная командная работа",
  authHero: "Одно понятное место для каждого решения и срока проекта.",
  authBenefit1: "Перемещайте работу по наглядному процессу из четырёх этапов.",
  authBenefit2: "Явно фиксируйте роли и права редактирования.",
  authBenefit3: "Проверяйте сроки и обсуждения без потери контекста.",
  errorTitle: "Не удалось загрузить представление",
  errorText: "Повторите попытку. Локально сохранённые демо-данные останутся на месте.",
  tryAgain: "Повторить", closeDialog: "Закрыть диалог",
  validationEmail: "Введите корректный email", validationPassword: "Пароль должен содержать минимум 6 символов",
  validationProjectName: "Введите название проекта", validationProjectDescription: "Добавьте краткое описание проекта",
  validationTaskTitle: "Введите название задачи", validationTaskDescription: "Добавьте полезное описание задачи",
  validationAssignee: "Выберите исполнителя", validationDeadline: "Выберите срок",
} as const;

type Key = keyof typeof ru;
const en: Record<Key, string> = {
  overview: "Overview", projects: "Projects", workspaceProjects: "Workspace projects",
  newProject: "New project", resetDemo: "Reset demo data", logout: "Log out",
  closeNavigation: "Close navigation", closeSidebar: "Close sidebar", openNavigation: "Open navigation",
  searchWorkspace: "Search workspace", demoRole: "Demo role", workspace: "Workspace",
  activeProjects: "Active projects", openTasks: "Open tasks", dueSoon: "Due soon", completed: "Completed",
  greetingDate: "Sunday, June 7", greeting: "Good morning, Maya",
  attention: "Here is what needs attention across the workspace.",
  recentTasks: "Recent tasks", recentTasksText: "The latest work across active projects.",
  viewProjects: "View projects", projectHealth: "Project health", completionByProject: "Completion by project.",
  manageProjects: "Manage all projects", projectsLead: "Plan initiatives, track delivery, and keep ownership visible.",
  noProjects: "No projects yet", noProjectsText: "Create the first project to start organizing work.",
  editProject: "Edit project", createProject: "Create project", saveChanges: "Save changes",
  edit: "Edit", delete: "Delete", projectActions: "Project actions", complete: "complete", of: "of",
  deleteProjectConfirm: "Delete the project and all its tasks?",
  projectName: "Project name", projectNamePlaceholder: "Website redesign", description: "Description",
  projectDescriptionPlaceholder: "What is the team coordinating in this project?", projectColor: "Project color",
  projectColorHint: "Used in project navigation.", cancel: "Cancel", taskTitle: "Task title",
  taskTitlePlaceholder: "Prepare sprint review", taskDescriptionPlaceholder: "Add enough context for the assignee to start.",
  status: "Status", priority: "Priority", assignee: "Assignee", deadline: "Deadline", tags: "Tags",
  tagsPlaceholder: "Design, Research, Mobile", addTask: "Add task", searchTasks: "Search tasks or tags",
  filters: "Filters", allPriorities: "All priorities", allStatuses: "All statuses",
  allAssignees: "All assignees", tasks: "tasks", projectNotFound: "Project not found",
  projectNotFoundText: "It may have been deleted from the demo workspace.", editTask: "Edit task",
  createTask: "Create task", deleteTaskConfirm: "Delete the task?", dropTask: "Drop a task here",
  addTaskTo: "Add task to", taskDetails: "Task details", closeTaskDetails: "Close task details",
  close: "Close", comments: "Comments", noComments: "No comments yet. Add the first project update.",
  commentPlaceholder: "Add a clear update or question...", addComment: "Add comment",
  email: "Email", password: "Password", welcomeBack: "Welcome back", createWorkspace: "Create your workspace",
  loginText: "Sign in to coordinate projects, deadlines, and team progress.",
  registerText: "Start organizing team work with a focused project workspace.", signIn: "Sign in",
  createAccount: "Create account", newToTaskflow: "New to Taskflow?", alreadyAccount: "Already have an account?",
  focusedExecution: "Focused team execution", authHero: "One clear place for every project decision and deadline.",
  authBenefit1: "Move work through a visual four-stage workflow.",
  authBenefit2: "Keep roles and editing rights explicit.",
  authBenefit3: "Review deadlines and discussion without losing context.",
  errorTitle: "This view could not be loaded", errorText: "Retry the view. Your locally saved demo data is preserved.",
  tryAgain: "Try again", closeDialog: "Close dialog", validationEmail: "Enter a valid email",
  validationPassword: "Password must contain at least 6 characters", validationProjectName: "Project name is required",
  validationProjectDescription: "Add a short project description", validationTaskTitle: "Task title is required",
  validationTaskDescription: "Add a useful task description", validationAssignee: "Choose an assignee",
  validationDeadline: "Choose a deadline",
};

const statusLabels: Record<Locale, Record<TaskStatus, string>> = {
  ru: { todo: "К выполнению", in_progress: "В работе", review: "На проверке", done: "Готово" },
  en: { todo: "Todo", in_progress: "In Progress", review: "Review", done: "Done" },
};
const priorityLabels: Record<Locale, Record<TaskPriority, string>> = {
  ru: { low: "Низкий", medium: "Средний", high: "Высокий", urgent: "Срочный" },
  en: { low: "Low", medium: "Medium", high: "High", urgent: "Urgent" },
};
const roleLabels: Record<Locale, Record<Role, string>> = {
  ru: { owner: "Владелец", member: "Участник", readonly: "Только чтение" },
  en: { owner: "Owner", member: "Member", readonly: "Readonly" },
};

const seededRu: Record<string, string> = {
  "Product Launch": "Запуск продукта",
  "Coordinate the June launch across product, design, and growth.": "Координация июньского запуска между продуктом, дизайном и маркетингом.",
  "Mobile Refresh": "Обновление мобильной версии",
  "Improve mobile navigation, performance, and visual consistency.": "Улучшение мобильной навигации, производительности и визуальной целостности.",
  "Research Hub": "Центр исследований",
  "Centralize customer insights and quarterly research.": "Централизация клиентских инсайтов и квартальных исследований.",
  "Finalize launch messaging": "Завершить тексты запуска",
  "Align the product narrative across the website, release notes, and customer email.": "Согласовать позиционирование продукта на сайте, в заметках к релизу и письме клиентам.",
  "QA billing upgrade flow": "Проверить обновление тарифа",
  "Test plan changes, declined cards, and invoice history.": "Проверить смену тарифа, отклонённые карты и историю счетов.",
  "Prepare launch dashboard": "Подготовить дашборд запуска",
  "Add activation, conversion, and retention launch metrics.": "Добавить метрики активации, конверсии и удержания для запуска.",
  "Update onboarding checklist": "Обновить чек-лист онбординга",
  "Reflect the new workspace setup and invite flow.": "Отразить новую настройку пространства и сценарий приглашений.",
  "Review help center updates": "Проверить обновления справочного центра",
  "Check tone, screenshots, and links before publishing.": "Проверить тон, скриншоты и ссылки перед публикацией.",
  "Approve launch email": "Утвердить письмо о запуске",
  "Final stakeholder review for segmented launch email.": "Финальная проверка сегментированного письма заинтересованными сторонами.",
  "Configure release monitoring": "Настроить мониторинг релиза",
  "Dashboards and alerts are live for the release window.": "Подготовить дашборды и оповещения на период релиза.",
  "Confirm support coverage": "Подтвердить график поддержки",
  "Publish the launch-week support rotation.": "Опубликовать график дежурств поддержки на неделю запуска.",
  "Prototype mobile navigation": "Прототипировать мобильную навигацию",
  "Test two compact navigation patterns.": "Проверить два компактных варианта навигации.",
  "The product narrative is approved. I added two notes for the email version.": "Позиционирование утверждено. Я добавил две заметки для версии письма.",
  "Please include a comparison against the previous release cohort.": "Добавьте сравнение с когортой предыдущего релиза.",
  "Screenshots are current. One billing link still needs replacement.": "Скриншоты актуальны. Одну ссылку на оплату ещё нужно заменить.",
  Marketing: "Маркетинг", Launch: "Запуск", Analytics: "Аналитика", Product: "Продукт",
  Content: "Контент", Engineering: "Разработка", Operations: "Операции", Design: "Дизайн",
};

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: Key) => string;
  status: (value: TaskStatus) => string;
  priority: (value: TaskPriority) => string;
  role: (value: Role) => string;
  content: (value: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");
  useEffect(() => {
    const saved = window.localStorage.getItem("taskflow-locale");
    if (saved === "ru" || saved === "en") {
      queueMicrotask(() => setLocaleState(saved));
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("taskflow-locale", locale);
  }, [locale]);
  const value = useMemo<I18nValue>(() => ({
    locale,
    setLocale: setLocaleState,
    t: (key) => (locale === "ru" ? ru[key] : en[key]),
    status: (item) => statusLabels[locale][item],
    priority: (item) => priorityLabels[locale][item],
    role: (item) => roleLabels[locale][item],
    content: (item) => locale === "ru" ? seededRu[item] ?? item : item,
  }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used within I18nProvider");
  return value;
}
