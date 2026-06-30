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
      label: "在线课资源库",
      icon: "folderKanban",
      children: [
        { id: "system", label: "体系课管理", href: "/admin/system", matchers: ["/admin/system$", "/admin/system/add"] },
        { id: "granular", label: "颗粒课管理", href: "/admin/granular", matchers: ["/admin/granular$", "/admin/granular/add"] },
      ],
    },
    {
      id: "hybrid-center",
      label: "混合课资源库",
      icon: "layers3",
      children: [
        { id: "hybrid", label: "混合课模板管理", href: "/admin/hybrid", matchers: ["/admin/hybrid$", "/admin/hybrid/add"] },
        { id: "hybrid-archive", label: "混合课历史档案库", href: "/admin/hybrid-archive", matchers: ["/admin/hybrid-archive"] },
      ],
    },
    {
      id: "course-open",
      label: "教学空间",
      icon: "layoutGrid",
      children: [
        { id: "claim", label: "开课计划管理", href: "/teacher/claim", matchers: ["/teacher/claim"] },
        { id: "behavior-collection", label: "课程学习跟踪", href: "/teacher/behavior-collection", matchers: ["/teacher/behavior-collection"] },
        { id: "progress-tracking", label: "课程测评跟踪", href: "/teacher/progress-tracking", matchers: ["/teacher/progress-tracking"] },
        { id: "final-assessment", label: "课程期末总评", href: "/teacher/final-assessment", matchers: ["/teacher/final-assessment"] },
        { id: "grade-submit", label: "成绩确认与提交", href: "/teacher/grade-submit", matchers: ["/teacher/grade-submit"] },
        { id: "learning-portrait", label: "我的学生画像", href: "/teacher/learning-portrait", matchers: ["/teacher/learning-portrait"] },
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
    "hybrid-center",
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
      label: "在线课资源库",
      icon: "folderKanban",
      children: [
        { id: "system", label: "体系课管理", href: "/admin/system", matchers: ["/admin/system$", "/admin/system/add"] },
        { id: "granular", label: "颗粒课管理", href: "/admin/granular", matchers: ["/admin/granular$", "/admin/granular/add"] },
      ],
    },
    {
      id: "hybrid-center",
      label: "混合课资源库",
      icon: "layers3",
      children: [
        { id: "hybrid", label: "混合课模板管理", href: "/admin/hybrid", matchers: ["/admin/hybrid$", "/admin/hybrid/add"] },
        { id: "hybrid-archive", label: "混合课历史档案库", href: "/admin/hybrid-archive", matchers: ["/admin/hybrid-archive"] },
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
  defaultExpandedSideNavIds: ["resource-center", "hybrid-center", "approval-center"],
  platformSwitchItems: platformSwitchItems?.filter((p) => p.id !== "admin"),
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
    { id: "archive", label: "学习档案", icon: "fileText", href: externalWorkspaceUrl },
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
        { id: "my-tasks", label: "学习任务", href: "/learn/dashboard/tasks", matchers: ["/learn/dashboard/tasks"] },
        { id: "workspace-learning", label: "我的课程·成绩·档案", href: externalWorkspaceUrl },
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
