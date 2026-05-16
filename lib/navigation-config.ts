import type { PlatformNavigationConfig } from "@/platform-navigation-shell"

const externalPortalUrl = "http://47.251.48.187:3001/portal"
const externalWorkspaceUrl = "http://47.251.48.187:3001/portal/workspace"
const externalAppsUrl = "http://47.251.48.187:3001/portal/apps"

const platformSwitchItems: PlatformNavigationConfig["platformSwitchItems"] = [
  { id: "admin", label: "课程管理平台", href: "/admin/system", icon: "settings" },
  { id: "learn", label: "学生学习平台", href: "/learn", icon: "graduationCap" },
  { id: "teacher", label: "智慧课堂平台", href: "/teacher/schedule", icon: "bookOpen" },
]

/* ============================================================
   一、课程管理平台（/admin）
   ============================================================ */
export const adminNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "数字课程服务平台",
  currentPlatformId: "lesson-admin",
  currentPlatformLabel: "课程管理平台",
  brandHref: "/admin/system",
  brandIcon: "settings",
  platformIcon: "settings",
  sideBackHref: "/admin/system",
  currentUserName: "管理员",
  currentUserRoleLabel: "课程管理后台",
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
      id: "course-mgmt",
      label: "课程后台管理",
      icon: "settings",
      children: [
        { id: "system", label: "体系课管理", href: "/admin/system", matchers: ["/admin/system$", "/admin/system/add"] },
        { id: "granular", label: "颗粒课管理", href: "/admin/granular", matchers: ["/admin/granular$", "/admin/granular/add"] },
        { id: "approvals", label: "审批管理", href: "/admin/approvals", matchers: ["/admin/approvals"] },
        { id: "batches", label: "批次分组管理", href: "/admin/batches", matchers: ["/admin/batches"] },
        { id: "workflows", label: "审批流程管理", href: "/admin/workflows", matchers: ["/admin/workflows"] },
      ],
    },
  ],
  defaultExpandedSideNavIds: ["course-mgmt"],
  platformSwitchItems: platformSwitchItems?.filter((p) => p.id !== "admin"),
  shellClassName: "bg-background",
  mainClassName: "min-w-0 flex-1",
}

/* ============================================================
   二、学生学习平台（/learn）
   ============================================================ */
export const learnNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "数字课程服务平台",
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
      label: "课程前台首页",
      icon: "home",
      href: "/learn",
      matchers: ["/learn$", "/learn/courses"],
    },
    {
      id: "workspace",
      label: "我的学习台",
      icon: "briefcase",
      children: [
        { id: "my-courses", label: "我的课程", href: "/learn/dashboard/courses", matchers: ["/learn/dashboard/courses"] },
        { id: "grades", label: "成绩查看", href: "/learn/dashboard/grades", matchers: ["/learn/dashboard/grades"] },
        { id: "archive", label: "学习档案", href: "/learn/dashboard/archive", matchers: ["/learn/dashboard/archive"] },
      ],
    },
  ],
  defaultExpandedSideNavIds: ["workspace"],
  platformSwitchItems: platformSwitchItems?.filter((p) => p.id !== "learn"),
  shellClassName: "bg-background",
  mainClassName: "min-w-0 flex-1",
}

/* ============================================================
   三、智慧课堂平台（/teacher）
   ============================================================ */
export const teacherNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "数字课程服务平台",
  currentPlatformId: "lesson-teacher",
  currentPlatformLabel: "智慧课堂平台",
  brandHref: "/teacher/schedule",
  brandIcon: "bookOpen",
  platformIcon: "bookOpen",
  sideBackHref: "/teacher/schedule",
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
      id: "schedule",
      label: "教学日程",
      icon: "calendar",
      href: "/teacher/schedule",
      matchers: ["/teacher/schedule"],
    },
    {
      id: "records",
      label: "课堂记录",
      icon: "fileText",
      href: "/teacher/records",
      matchers: ["/teacher/records"],
    },
    {
      id: "analytics",
      label: "学情分析",
      icon: "lineChart",
      children: [
        { id: "class-analytics", label: "班级学情", href: "/teacher/analytics/class", matchers: ["/teacher/analytics/class"] },
        { id: "student-analytics", label: "学生个体", href: "/teacher/analytics/student", matchers: ["/teacher/analytics/student"] },
        { id: "resource-analytics", label: "资源分析", href: "/teacher/analytics/resource", matchers: ["/teacher/analytics/resource"] },
      ],
    },
  ],
  defaultExpandedSideNavIds: ["analytics"],
  platformSwitchItems: platformSwitchItems?.filter((p) => p.id !== "teacher"),
  shellClassName: "bg-background",
  mainClassName: "min-w-0 flex-1",
}

/* ============================================================
   保留但不再使用的旧配置（兼容）
   ============================================================ */
export const publicNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "场景化数智教学服务平台",
  currentPlatformId: "lesson-public",
  currentPlatformLabel: "课程首页",
  brandHref: "/",
  brandIcon: "settings",
  platformIcon: "settings",
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
