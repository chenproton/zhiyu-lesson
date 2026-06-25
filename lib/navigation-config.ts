import type { PlatformNavigationConfig } from "@/components/platform-shell"

const externalPortalUrl = "http://111.170.170.202:3001/portal"
const externalWorkspaceUrl = "http://111.170.170.202:3001/portal/workspace"
const externalAppsUrl = "http://111.170.170.202:3001/portal/apps"

/* ============================================================
   统一导航树（数字课程平台）
   不再区分课程资源中心 / 课程建设与教学运行 / 学生学习平台
   ============================================================ */
export const unifiedNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "数字课程平台",
  currentPlatformId: "lesson-unified",
  currentPlatformLabel: "数字课程平台",
  brandHref: "/teacher/claim",
  brandIcon: "bookOpen",
  platformIcon: "bookOpen",
  sideBackHref: "/teacher/claim",
  currentUserName: "教师",
  currentUserRoleLabel: "教学用户",
  showCurrentTime: true,
  showUserMenu: true,
  userMenuItems: [
    { id: "profile", label: "个人中心", icon: "user" },
    { id: "account", label: "账号设置", icon: "settings" },
    { id: "logout", label: "退出登录", tone: "danger" },
  ],
  topNavItems: [
    { id: "portal", label: "门户首页", href: externalPortalUrl, icon: "home" },
    { id: "workspace", label: "我的服务台", href: externalWorkspaceUrl, icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: externalAppsUrl, icon: "layoutGrid" },
  ],
  sideNavItems: [
    {
      id: "resource-center",
      label: "课程资源中心",
      icon: "folderKanban",
      children: [
        { id: "system", label: "体系课管理", href: "/admin/system", matchers: ["/admin/system$", "/admin/system/add"] },
        { id: "granular", label: "颗粒课管理", href: "/admin/granular", matchers: ["/admin/granular$", "/admin/granular/add"] },
        { id: "hybrid", label: "混合课程管理", href: "/admin/hybrid", matchers: ["/admin/hybrid$", "/admin/hybrid/add"] },
      ],
    },
    {
      id: "course-package",
      label: "资源组课与复用",
      icon: "layers3",
      children: [
        { id: "course-builder", label: "资源组课工作台", href: "/admin/builder", matchers: ["/admin/builder"], hidden: true },
        { id: "course-templates", label: "课程模板/课程包", href: "/admin/templates", matchers: ["/admin/templates"], hidden: true },
      ],
    },
    {
      id: "course-open",
      label: "教学空间",
      icon: "layoutGrid",
      children: [
        { id: "claim", label: "开课计划管理", href: "/teacher/claim", matchers: ["/teacher/claim"] },
        { id: "my-class-hours", label: "我的课程表", href: "/teacher/in-class", matchers: ["/teacher/in-class"] },
        { id: "course-config", label: "课程模式配置", href: "/teacher/course-config", matchers: ["/teacher/course-config"], hidden: true },
        { id: "syllabus", label: "课程设计与大纲", href: "/teacher/syllabus", matchers: ["/teacher/syllabus"], hidden: true },
        { id: "grade-rules", label: "成绩规则配置", href: "/teacher/grade-rules", matchers: ["/teacher/grade-rules"], hidden: true },
      ],
    },
    {
      id: "course-prep",
      label: "备课中心",
      icon: "clipboardList",
      children: [
        { id: "resource-mount", label: "体系课/颗粒微课挂载", href: "/teacher/course-config", matchers: ["/teacher/course-config"], hidden: true },
        { id: "practical-tasks", label: "实训任务单", href: "/teacher/practical-tasks", matchers: ["/teacher/practical-tasks"], hidden: true },
        { id: "pre-class", label: "课前：预习任务", href: "/teacher/pre-class", matchers: ["/teacher/pre-class"], hidden: true },
        { id: "post-class", label: "课后：作业测验", href: "/teacher/post-class", matchers: ["/teacher/post-class"], hidden: true },
      ],
    },
    {
      id: "teaching-impl",
      label: "教学实施",
      icon: "sparkles",
      children: [
        { id: "behavior-collection", label: "学习行为采集", href: "/teacher/behavior-collection", matchers: ["/teacher/behavior-collection"], hidden: true },
        { id: "progress-tracking", label: "进度跟踪", href: "/teacher/progress-tracking", matchers: ["/teacher/progress-tracking"], hidden: true },
        { id: "early-warning", label: "预警提醒", href: "/teacher/early-warning", matchers: ["/teacher/early-warning"], hidden: true },
      ],
    },
    {
      id: "grade-eval",
      label: "成绩与评价",
      icon: "barChart3",
      children: [
        { id: "final-assessment", label: "期末：过程性考核", href: "/teacher/final-assessment", matchers: ["/teacher/final-assessment"], hidden: true },
        { id: "online-grades", label: "线上成绩计算", href: "/teacher/online-grades", matchers: ["/teacher/online-grades"], hidden: true },
        { id: "grade-submit", label: "成绩确认与提交", href: "/teacher/grade-submit", matchers: ["/teacher/grade-submit"], hidden: true },
        { id: "learning-portrait", label: "学习画像", href: "/teacher/learning-portrait", matchers: ["/teacher/learning-portrait"], hidden: true },
      ],
    },
    {
      id: "course-archive",
      label: "结课与沉淀",
      icon: "fileText",
      children: [
        { id: "class-close", label: "教学班结课", href: "/teacher/class-close", matchers: ["/teacher/class-close"], hidden: true },
        { id: "material-archive", label: "教学资料归档", href: "/teacher/material-archive", matchers: ["/teacher/material-archive"], hidden: true },
        { id: "resource-reuse", label: "资源复用", href: "/teacher/resource-reuse", matchers: ["/teacher/resource-reuse"], hidden: true },
      ],
    },
    {
      id: "approval-center",
      label: "资源审批与质量",
      icon: "badgeCheck",
      children: [
        { id: "approvals", label: "审批管理", href: "/admin/approvals", matchers: ["/admin/approvals"] },
        { id: "batches", label: "批次分组管理", href: "/admin/batches", matchers: ["/admin/batches"] },
        { id: "workflows", label: "审批流程管理", href: "/admin/workflows", matchers: ["/admin/workflows"] },
      ],
    },
  ],
  defaultExpandedSideNavIds: [
    "resource-center",
    "course-open",
    "approval-center",
  ],
  platformSwitchItems: [],
  shellClassName: "bg-background",
  mainClassName: "min-w-0 flex-1",
}

/* ============================================================
   以下为旧子平台配置，保留用于兼容，layout 已统一使用 unifiedNavigationConfig
   ============================================================ */
const platformSwitchItems: PlatformNavigationConfig["platformSwitchItems"] = [
  { id: "admin", label: "课程资源中心", href: "/admin/system", icon: "folderKanban" },
  { id: "teacher", label: "课程建设与教学运行", href: "/teacher/claim", icon: "bookOpen" },
]

export const adminNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "数字课程平台",
  currentPlatformId: "lesson-admin",
  currentPlatformLabel: "课程资源中心",
  brandHref: "/admin/system",
  brandIcon: "folderKanban",
  platformIcon: "folderKanban",
  sideBackHref: "/admin/system",
  currentUserName: "教研管理员",
  currentUserRoleLabel: "课程资源中心",
  showCurrentTime: true,
  showUserMenu: true,
  userMenuItems: [
    { id: "profile", label: "个人中心", icon: "user" },
    { id: "account", label: "账号设置", icon: "settings" },
    { id: "logout", label: "退出登录", tone: "danger" },
  ],
  topNavItems: [
    { id: "portal", label: "门户首页", href: externalPortalUrl, icon: "home" },
    { id: "workspace", label: "我的服务台", href: externalWorkspaceUrl, icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: externalAppsUrl, icon: "layoutGrid" },
  ],
  sideNavItems: [
    {
      id: "resource-center",
      label: "课程资源中心",
      icon: "folderKanban",
      children: [
        { id: "system", label: "体系课管理", href: "/admin/system", matchers: ["/admin/system$", "/admin/system/add"] },
        { id: "granular", label: "颗粒课管理", href: "/admin/granular", matchers: ["/admin/granular$", "/admin/granular/add"] },
        { id: "hybrid", label: "混合课程管理", href: "/admin/hybrid", matchers: ["/admin/hybrid$", "/admin/hybrid/add"] },
      ],
    },
    {
      id: "course-package",
      label: "资源组课与复用",
      icon: "layers3",
      children: [
        { id: "course-builder", label: "资源组课工作台", href: "/admin/builder", matchers: ["/admin/builder"], hidden: true },
        { id: "course-templates", label: "课程模板/课程包", href: "/admin/templates", matchers: ["/admin/templates"], hidden: true },
      ],
    },
    {
      id: "approval-center",
      label: "资源审批与质量",
      icon: "badgeCheck",
      children: [
        { id: "approvals", label: "审批管理", href: "/admin/approvals", matchers: ["/admin/approvals"] },
        { id: "batches", label: "批次分组管理", href: "/admin/batches", matchers: ["/admin/batches"] },
        { id: "workflows", label: "审批流程管理", href: "/admin/workflows", matchers: ["/admin/workflows"] },
      ],
    },
  ],
  defaultExpandedSideNavIds: ["resource-center", "approval-center"],
  platformSwitchItems: platformSwitchItems?.filter((p) => p.id !== "admin"),
  shellClassName: "bg-background",
  mainClassName: "min-w-0 flex-1",
}

export const teacherNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "数字课程平台",
  currentPlatformId: "lesson-teacher",
  currentPlatformLabel: "课程建设与教学运行",
  brandHref: "/teacher/claim",
  brandIcon: "bookOpen",
  platformIcon: "bookOpen",
  sideBackHref: "/teacher/claim",
  currentUserName: "教师",
  currentUserRoleLabel: "主讲教师",
  showCurrentTime: true,
  showUserMenu: true,
  userMenuItems: [
    { id: "profile", label: "个人中心", icon: "user" },
    { id: "account", label: "账号设置", icon: "settings" },
    { id: "logout", label: "退出登录", tone: "danger" },
  ],
  topNavItems: [
    { id: "portal", label: "门户首页", href: externalPortalUrl, icon: "home" },
    { id: "workspace", label: "我的服务台", href: externalWorkspaceUrl, icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: externalAppsUrl, icon: "layoutGrid" },
  ],
  sideNavItems: [
    {
      id: "course-open",
      label: "教学空间",
      icon: "layoutGrid",
      children: [
        { id: "claim", label: "开课计划管理", href: "/teacher/claim", matchers: ["/teacher/claim"] },
        { id: "my-class-hours", label: "我的课程表", href: "/teacher/in-class", matchers: ["/teacher/in-class"] },
        { id: "course-config", label: "课程模式配置", href: "/teacher/course-config", matchers: ["/teacher/course-config"], hidden: true },
        { id: "syllabus", label: "课程设计与大纲", href: "/teacher/syllabus", matchers: ["/teacher/syllabus"], hidden: true },
        { id: "grade-rules", label: "成绩规则配置", href: "/teacher/grade-rules", matchers: ["/teacher/grade-rules"], hidden: true },
      ],
    },
    {
      id: "course-prep",
      label: "备课中心",
      icon: "clipboardList",
      children: [
        { id: "resource-mount", label: "体系课/颗粒微课挂载", href: "/teacher/course-config", matchers: ["/teacher/course-config"], hidden: true },
        { id: "practical-tasks", label: "实训任务单", href: "/teacher/practical-tasks", matchers: ["/teacher/practical-tasks"], hidden: true },
        { id: "pre-class", label: "课前：预习任务", href: "/teacher/pre-class", matchers: ["/teacher/pre-class"], hidden: true },
        { id: "post-class", label: "课后：作业测验", href: "/teacher/post-class", matchers: ["/teacher/post-class"], hidden: true },
      ],
    },
    {
      id: "teaching-impl",
      label: "教学实施",
      icon: "sparkles",
      children: [
        { id: "behavior-collection", label: "学习行为采集", href: "/teacher/behavior-collection", matchers: ["/teacher/behavior-collection"], hidden: true },
        { id: "progress-tracking", label: "进度跟踪", href: "/teacher/progress-tracking", matchers: ["/teacher/progress-tracking"], hidden: true },
        { id: "early-warning", label: "预警提醒", href: "/teacher/early-warning", matchers: ["/teacher/early-warning"], hidden: true },
      ],
    },
    {
      id: "grade-eval",
      label: "成绩与评价",
      icon: "barChart3",
      children: [
        { id: "final-assessment", label: "期末：过程性考核", href: "/teacher/final-assessment", matchers: ["/teacher/final-assessment"], hidden: true },
        { id: "online-grades", label: "线上成绩计算", href: "/teacher/online-grades", matchers: ["/teacher/online-grades"], hidden: true },
        { id: "grade-submit", label: "成绩确认与提交", href: "/teacher/grade-submit", matchers: ["/teacher/grade-submit"], hidden: true },
        { id: "learning-portrait", label: "学习画像", href: "/teacher/learning-portrait", matchers: ["/teacher/learning-portrait"], hidden: true },
      ],
    },
    {
      id: "course-archive",
      label: "结课与沉淀",
      icon: "fileText",
      children: [
        { id: "class-close", label: "教学班结课", href: "/teacher/class-close", matchers: ["/teacher/class-close"], hidden: true },
        { id: "material-archive", label: "教学资料归档", href: "/teacher/material-archive", matchers: ["/teacher/material-archive"], hidden: true },
        { id: "resource-reuse", label: "资源复用", href: "/teacher/resource-reuse", matchers: ["/teacher/resource-reuse"], hidden: true },
      ],
    },
  ],
  defaultExpandedSideNavIds: ["course-open"],
  platformSwitchItems: platformSwitchItems?.filter((p) => p.id !== "teacher"),
  shellClassName: "bg-background",
  mainClassName: "min-w-0 flex-1",
}

export const learnNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "数字课程平台",
  currentPlatformId: "lesson-learn",
  currentPlatformLabel: "学生学习平台",
  brandHref: "/learn",
  brandIcon: "graduationCap",
  platformIcon: "graduationCap",
  sideBackHref: "/learn",
  currentUserName: "学生",
  currentUserRoleLabel: "学生",
  showCurrentTime: true,
  showUserMenu: true,
  userMenuItems: [
    { id: "profile", label: "个人中心", icon: "user" },
    { id: "archive", label: "学习档案", icon: "fileText", href: "/learn/dashboard/archive" },
    { id: "logout", label: "退出登录", tone: "danger" },
  ],
  topNavItems: [
    { id: "portal", label: "门户首页", href: externalPortalUrl, icon: "home" },
    { id: "workspace", label: "我的服务台", href: externalWorkspaceUrl, icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: externalAppsUrl, icon: "layoutGrid" },
  ],
  sideNavItems: [
    {
      id: "portal",
      label: "课程大厅",
      icon: "home",
      href: "/learn",
      matchers: ["/learn$", "/learn/courses"],
    },
    {
      id: "my-learning",
      label: "我的学习",
      icon: "briefcase",
      children: [
        { id: "my-courses", label: "我的课程", href: "/learn/dashboard/courses", matchers: ["/learn/dashboard/courses"] },
        { id: "my-tasks", label: "学习任务", href: "/learn/dashboard/tasks", matchers: ["/learn/dashboard/tasks"] },
        { id: "grades", label: "成绩查看", href: "/learn/dashboard/grades", matchers: ["/learn/dashboard/grades"] },
        { id: "archive", label: "学习档案", href: "/learn/dashboard/archive", matchers: ["/learn/dashboard/archive"] },
      ],
    },
  ],
  defaultExpandedSideNavIds: ["my-learning"],
  platformSwitchItems: [],
  shellClassName: "bg-background",
  mainClassName: "min-w-0 flex-1",
}

export const publicNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "数字课程平台",
  currentPlatformId: "lesson-public",
  currentPlatformLabel: "课程首页",
  brandHref: "/",
  brandIcon: "folderKanban",
  platformIcon: "folderKanban",
  sideBackHref: "/",
  showCurrentTime: true,
  showUserMenu: false,
  hideSideNav: true,
  topNavItems: [
    { id: "portal", label: "门户首页", href: externalPortalUrl, icon: "home" },
    { id: "workspace", label: "我的服务台", href: externalWorkspaceUrl, icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: externalAppsUrl, icon: "layoutGrid" },
  ],
  sideNavItems: [],
  shellClassName: "bg-background",
  mainClassName: "min-w-0 flex-1",
}
