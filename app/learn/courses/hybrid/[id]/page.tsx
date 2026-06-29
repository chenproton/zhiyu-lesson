"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ArrowLeft, BookOpen, PlayCircle, FileText, Users, MonitorPlay,
  BarChart3, Clock, GraduationCap, Target, FolderOpen,
  ClipboardList, MessageCircle, ChevronDown, ChevronRight, CheckCircle2,
  Circle, Lightbulb, PenTool, Layers, BookMarked, HelpCircle,
  Wrench, Info, List, BrainCircuit
} from "lucide-react"
import { hybridCourses } from "@/lib/mock-data"
import { COURSE_STATUS_LABELS, COURSE_TYPE_LABELS } from "@/lib/types"

/* ======================== Mock Data ======================== */

interface ModuleItem {
  key: string
  label: string
  phase: "pre-class" | "in-class" | "post-class"
  icon: React.ComponentType<{ className?: string }>
  status: "done" | "in_progress" | "pending"
  desc: string
}

interface TeachingSession {
  id: string
  name: string
  week: number
  phase: "pre-class" | "in-class" | "post-class"
  mode: "online" | "offline"
  progress: number
  design: string
  review: string
  modules: ModuleItem[]
}

const SESSIONS: TeachingSession[] = [
  {
    id: "s1", name: "第一周：课程导论与环境搭建", week: 1, phase: "pre-class", mode: "online", progress: 100,
    design: "教学重点：前端技术栈全景介绍、开发环境搭建（VSCode + Node.js + Git）\n教学难点：理解前后端分离架构、Git工作流概念理解\n教学方法：在线预习视频 + 课堂讲解 + 实操演示",
    review: "本节课顺利完成课程导论与开发环境搭建。学生整体对前端技术栈有了初步了解，90%的学生成功完成环境搭建。",
    modules: [
      { key: "prePreview", label: "课前预习", phase: "pre-class", icon: BookOpen, status: "done", desc: "观看课程导论视频（15min），了解前端技术栈体系" },
      { key: "preResources", label: "学习资源", phase: "pre-class", icon: FolderOpen, status: "done", desc: "阅读开发环境搭建指南.pdf" },
      { key: "preTasks", label: "课前任务", phase: "pre-class", icon: ClipboardList, status: "done", desc: "完成环境搭建自检清单" },
    ],
  },
  {
    id: "s2", name: "第二周：HTML5与CSS3核心", week: 2, phase: "in-class", mode: "offline", progress: 85,
    design: "教学重点：HTML5语义化标签、CSS3 Flexbox/Grid布局、响应式设计原理\n教学难点：Grid布局的网格线概念、媒体查询与移动端适配\n教学方法：课前预习微课 + 课堂案例演示 + 随堂练习 + 项目实践",
    review: "课堂互动积极，学生掌握了Flexbox布局核心属性。随堂测验平均分82分，整体情况良好。",
    modules: [
      { key: "preQuizzes", label: "课前测验", phase: "pre-class", icon: HelpCircle, status: "done", desc: "HTML/CSS基础概念测验（10题）" },
      { key: "lecture", label: "课堂讲授", phase: "in-class", icon: MonitorPlay, status: "done", desc: "HTML5语义化标签 + CSS3 Flexbox/Grid布局" },
      { key: "inClassTasks", label: "课堂任务", phase: "in-class", icon: ClipboardList, status: "in_progress", desc: "响应式网页布局实战练习" },
      { key: "inClassQuizzes", label: "随堂测验", phase: "in-class", icon: CheckCircle2, status: "done", desc: "Flexbox布局测验，平均分82" },
      { key: "classQuestions", label: "课堂提问", phase: "in-class", icon: MessageCircle, status: "done", desc: "随堂提问互动3次" },
      { key: "practiceTasks", label: "实践任务", phase: "in-class", icon: Wrench, status: "in_progress", desc: "仿写京东首页静态布局" },
    ],
  },
  {
    id: "s3", name: "第三周：JavaScript基础", week: 3, phase: "post-class", mode: "online", progress: 65,
    design: "教学重点：JS变量与数据类型、函数与作用域、DOM操作与事件处理\n教学难点：闭包的理解与应用、事件委托机制",
    review: "JavaScript基础讲授完成。闭包概念对部分学生仍较难理解，建议下次课前发布针对性预习视频。",
    modules: [
      { key: "homeworks", label: "课后作业", phase: "post-class", icon: FileText, status: "in_progress", desc: "实现一个Todo List应用（截止2026-07-15）" },
      { key: "extensionMaterials", label: "拓展资料", phase: "post-class", icon: BookMarked, status: "done", desc: "阅读MDN JavaScript高级教程" },
      { key: "trainingReports", label: "实训报告", phase: "post-class", icon: ClipboardList, status: "pending", desc: "撰写DOM操作实训报告" },
    ],
  },
  {
    id: "s4", name: "第四周：JavaScript进阶", week: 4, phase: "pre-class", mode: "online", progress: 40,
    design: "教学重点：ES6+新特性（箭头函数、解构、模板字符串）、异步编程（Promise、async/await）、模块化编程\n教学难点：Promise链式调用与错误处理",
    review: "",
    modules: [
      { key: "prePreview", label: "课前预习", phase: "pre-class", icon: BookOpen, status: "in_progress", desc: "观看ES6新特性教学视频（20min）" },
      { key: "preResources", label: "学习资源", phase: "pre-class", icon: FolderOpen, status: "done", desc: "阅读ES6标准入门.pdf" },
      { key: "preTasks", label: "课前任务", phase: "pre-class", icon: ClipboardList, status: "pending", desc: "完成Promise编程练习题5道" },
    ],
  },
  {
    id: "s5", name: "第五周：React框架入门", week: 5, phase: "in-class", mode: "offline", progress: 20,
    design: "教学重点：React核心概念与JSX、组件Props与State管理、Hooks（useState, useEffect）\n教学难点：State不可变更新、useEffect的依赖管理",
    review: "",
    modules: [
      { key: "preQuizzes", label: "课前测验", phase: "pre-class", icon: HelpCircle, status: "pending", desc: "React基础概念测验" },
      { key: "lecture", label: "课堂讲授", phase: "in-class", icon: MonitorPlay, status: "pending", desc: "React核心概念、JSX、组件化思想" },
      { key: "inClassTasks", label: "课堂任务", phase: "in-class", icon: ClipboardList, status: "pending", desc: "编写第一个React组件并进行调试" },
    ],
  },
  {
    id: "s6", name: "第六周：React组件开发实战", week: 6, phase: "post-class", mode: "online", progress: 0,
    design: "教学重点：组件拆分与组合、状态提升与Context、自定义Hooks\n教学难点：组件通信方案选型、自定义Hooks的封装思维",
    review: "",
    modules: [
      { key: "homeworks", label: "课后作业", phase: "post-class", icon: FileText, status: "pending", desc: "实现天气查询应用（React + 公开API）" },
    ],
  },
  {
    id: "s7", name: "第七周：TypeScript与工程化", week: 7, phase: "pre-class", mode: "online", progress: 0,
    design: "教学重点：TypeScript类型系统、Vite构建工具配置、ESLint/Prettier代码规范\n教学难点：泛型与高级类型、tsconfig.json配置",
    review: "",
    modules: [
      { key: "prePreview", label: "课前预习", phase: "pre-class", icon: BookOpen, status: "pending", desc: "阅读TypeScript入门指南" },
      { key: "preResources", label: "学习资源", phase: "pre-class", icon: FolderOpen, status: "pending", desc: "TypeScript类型体操练习仓库" },
    ],
  },
  {
    id: "s8", name: "第八周：前端项目综合实战", week: 8, phase: "in-class", mode: "offline", progress: 0,
    design: "教学重点：项目需求分析与架构设计、前后端分离开发流程、项目打包与部署\n教学难点：前后端接口联调、项目性能优化",
    review: "",
    modules: [
      { key: "lecture", label: "课堂讲授", phase: "in-class", icon: MonitorPlay, status: "pending", desc: "项目管理流程与团队协作方案" },
      { key: "inClassTasks", label: "课堂任务", phase: "in-class", icon: ClipboardList, status: "pending", desc: "分组选题与技术方案评审" },
      { key: "practiceTasks", label: "实践任务", phase: "in-class", icon: Wrench, status: "pending", desc: "完成小组项目核心功能开发" },
    ],
  },
]

const COURSE_OBJECTIVES = `## 💡 知识目标

1. 掌握HTML/CSS/JavaScript前端三件套的核心语法与应用，理解三者在前端开发中的职责分工
2. 理解React组件化开发思想，掌握Hooks API（useState、useEffect、useContext等）的使用
3. 了解前端工程化体系（Vite、TypeScript、ESLint、Prettier），能独立搭建现代化前端项目
4. 熟悉前后端交互原理（HTTP协议、RESTful API设计），掌握数据请求与状态同步方案

## 🔧 能力目标

1. 能够独立完成中小型前端项目的设计与开发
2. 具备组件化拆分、封装与复用的能力
3. 掌握版本控制（Git）与团队协作开发能力
4. 能够进行前端性能优化与调试（Lighthouse、DevTools）

## 🎯 素质目标

1. 培养自主学习与终身学习意识，能够跟进前端技术发展
2. 建立工程化思维与代码规范意识
3. 提升沟通表达与团队协作能力

---

> 📋 **课程说明**：本课程为线上线下混合式教学，共 8 周 48 课时（线上 24h + 线下 24h），理论讲解与项目实战相结合，帮助学习者系统掌握 Web 前端开发核心技术。`

const SESSION_RESOURCES: Record<string, { id: string; name: string; type: string; size: string }[]> = {
  "s1": [
    { id: "sr1-1", name: "前端开发环境搭建指南.pdf", type: "PDF", size: "2.3MB" },
    { id: "sr1-2", name: "Node.js 安装与配置教程", type: "视频", size: "35min" },
    { id: "sr1-3", name: "Git 基础操作快速入门", type: "链接", size: "在线" },
  ],
  "s2": [
    { id: "sr2-1", name: "HTML5与CSS3权威指南.pdf", type: "PDF", size: "8.5MB" },
    { id: "sr2-2", name: "Flexbox与Grid布局详解.pptx", type: "PPT", size: "4.1MB" },
    { id: "sr2-3", name: "响应式设计实战案例集", type: "链接", size: "在线" },
  ],
  "s3": [
    { id: "sr3-1", name: "JavaScript高级程序设计.pdf", type: "PDF", size: "12.3MB" },
    { id: "sr3-2", name: "ES6标准入门（阮一峰）", type: "链接", size: "在线" },
    { id: "sr3-3", name: "DOM操作实战练习.zip", type: "压缩包", size: "3.5MB" },
  ],
  "s4": [
    { id: "sr4-1", name: "ES6新特性全面解析（视频）", type: "视频", size: "1.5GB" },
    { id: "sr4-2", name: "Promise与异步编程实战指南.pdf", type: "PDF", size: "2.1MB" },
  ],
  "s5": [
    { id: "sr5-1", name: "React 18官方文档（中文版）", type: "链接", size: "在线" },
    { id: "sr5-2", name: "React Hooks实战指南.pdf", type: "PDF", size: "6.2MB" },
    { id: "sr5-3", name: "React入门教学视频（共5集）", type: "视频", size: "2.8GB" },
  ],
  "s6": [
    { id: "sr6-1", name: "React组件设计模式.pdf", type: "PDF", size: "4.4MB" },
    { id: "sr6-2", name: "天气API接口文档", type: "链接", size: "在线" },
  ],
  "s7": [
    { id: "sr7-1", name: "TypeScript深入浅出（视频教程）", type: "视频", size: "2.1GB" },
    { id: "sr7-2", name: "Vite实战指南.pdf", type: "PDF", size: "3.2MB" },
    { id: "sr7-3", name: "前端工程化体系搭建", type: "链接", size: "在线" },
  ],
  "s8": [
    { id: "sr8-1", name: "前端项目实战源码（示例仓库）", type: "链接", size: "在线" },
    { id: "sr8-2", name: "Git版本控制最佳实践.pdf", type: "PDF", size: "2.8MB" },
    { id: "sr8-3", name: "前端部署与CI/CD指南.pdf", type: "PDF", size: "3.5MB" },
  ],
}

const SESSION_QUIZZES: Record<string, { title: string; count: number; type: string }[]> = {
  "s1": [
    { title: "前端技术栈基础认知测验", count: 5, type: "单选" },
    { title: "开发环境搭建检查", count: 3, type: "实操" },
  ],
  "s2": [
    { title: "HTML5语义化标签测验", count: 8, type: "单选" },
    { title: "Flexbox与Grid布局测验", count: 10, type: "混合" },
  ],
  "s3": [
    { title: "JavaScript基础测验", count: 10, type: "混合" },
    { title: "DOM操作实践检测", count: 5, type: "编程" },
  ],
  "s4": [
    { title: "ES6+新特性测验", count: 8, type: "单选" },
    { title: "Promise编程挑战", count: 3, type: "编程" },
  ],
  "s5": [
    { title: "React基础概念测验", count: 10, type: "混合" },
  ],
  "s6": [
    { title: "React组件化测验", count: 6, type: "混合" },
    { title: "组件设计实战考核", count: 2, type: "编程" },
  ],
  "s7": [
    { title: "TypeScript类型系统测验", count: 8, type: "单选" },
  ],
  "s8": [
    { title: "前端项目综合考核", count: 15, type: "混合" },
    { title: "项目答辩评估", count: 1, type: "答辩" },
  ],
}

/* ======================== Sub Components ======================== */

function CatalogNav({
  sessions,
  selectedId,
  onSelect,
  courseId,
}: {
  sessions: TeachingSession[]
  selectedId: string
  onSelect: (id: string) => void
  courseId: string
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(sessions.map((s) => s.id)))

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="w-[250px] shrink-0 bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <List className="w-4 h-4 text-[#1890ff]" />
        课程目录
        <span className="text-xs font-normal text-gray-400 ml-auto">{sessions.length} 次课</span>
      </h3>
      <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
        {sessions.map((s) => {
          const isExpanded = expanded.has(s.id)
          const isActive = selectedId === s.id
          const doneMods = s.modules.filter((m) => m.status === "done").length
          return (
            <div key={s.id}>
              <button
                onClick={() => { toggle(s.id); onSelect(s.id); }}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  isActive ? "bg-[#e6f7ff] text-[#1890ff] font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                <span className="w-5 h-5 rounded bg-[#1890ff]/10 text-[#1890ff] text-[10px] font-semibold flex items-center justify-center shrink-0">
                  {s.week}
                </span>
                <span className="truncate flex-1">{s.name.split("：")[1] || s.name}</span>
                <span className="text-[10px] text-gray-400 shrink-0">{doneMods}/{s.modules.length}</span>
              </button>
              {isExpanded && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-gray-100 pl-2">
                  {s.modules.map((m) => {
                    const Icon = m.icon
                    return (
                      <Link
                        key={m.key}
                        href={`/learn/courses/hybrid/${courseId}/learn?session=${s.id}&module=${m.key}`}
                        className={`flex items-center gap-2 rounded-md px-2 py-1 text-left text-xs transition-colors ${
                          m.status === "done" ? "text-green-600" :
                          m.status === "in_progress" ? "text-blue-600" : "text-gray-400"
                        } hover:bg-gray-50`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{m.label}</span>
                        {m.status === "done" && <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0 ml-auto" />}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TreeView({ sessions, courseId }: { sessions: TeachingSession[]; courseId: string }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(sessions.map((s) => s.id)))

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-1">
      {sessions.map((s) => {
        const isExpanded = expanded.has(s.id)
        return (
          <div key={s.id}>
            <div className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors bg-gray-50 font-medium text-gray-800">
              <button onClick={() => toggle(s.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <FileText className="w-4 h-4 text-[#1890ff] shrink-0" />
              <span className="flex-1 truncate text-sm">{s.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={s.mode === "online" ? "default" : "secondary"} className="text-[10px] px-1.5 h-4">
                  {s.mode === "online" ? "线上" : "线下"}
                </Badge>
                <Progress value={s.progress} className="h-1.5 w-[60px]" />
                <span className="text-[10px] text-gray-400 w-8 text-right">{s.progress}%</span>
              </div>
              <Link href={`/learn/courses/hybrid/${courseId}/learn?session=${s.id}`}>
                <Button size="sm" className="h-7 text-xs bg-[#1890ff] hover:bg-[#40a9ff]">
                  <PlayCircle className="w-3 h-3 mr-1" />开始学习
                </Button>
              </Link>
            </div>
            {isExpanded && (
              <div className="mt-0.5 ml-6 space-y-0.5 border-l border-gray-100 pl-4 py-1">
                {s.modules.map((m) => {
                  const Icon = m.icon
                  return (
                    <Link
                      key={m.key}
                      href={`/learn/courses/hybrid/${courseId}/learn?session=${s.id}&module=${m.key}`}
                      className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors hover:bg-gray-50 ${
                        m.status === "done" ? "text-green-600" :
                        m.status === "in_progress" ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{m.label}</span>
                      <span className="text-[10px] text-gray-400 ml-auto">{m.desc.length > 18 ? m.desc.slice(0, 18) + "..." : m.desc}</span>
                      {m.status === "done" && <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ======================== Main Page ======================== */

export default function HybridCourseDetailPage() {
  const params = useParams()
  const course = hybridCourses.find((c) => c.id === params.id)

  if (!course) {
    return <div className="text-center py-20 text-muted-foreground">未找到该混合课程</div>
  }

  const totalProgress = Math.round(SESSIONS.reduce((sum, s) => sum + s.progress, 0) / SESSIONS.length)
  const [selectedId, setSelectedId] = useState("s1")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/learn"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{COURSE_TYPE_LABELS[course.type]}</Badge>
            <Badge>{COURSE_STATUS_LABELS[course.status]}</Badge>
          </div>
          <h1 className="text-2xl font-bold mt-1">{course.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/learn/courses/hybrid/${course.id}/learn`}>
            <PlayCircle className="h-4 w-4 mr-1" />进入学习
          </Link>
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-2"><MonitorPlay className="h-5 w-5 text-blue-600" /><div><p className="text-xs text-muted-foreground">线上学时</p><p className="text-xl font-bold">{course.onlineHours}h</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-2"><Users className="h-5 w-5 text-orange-600" /><div><p className="text-xs text-muted-foreground">线下学时</p><p className="text-xl font-bold">{course.offlineHours}h</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-green-600" /><div><p className="text-xs text-muted-foreground">成绩权重</p><p className="text-xl font-bold">{course.onlineWeight}/{course.offlineWeight}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-2"><Clock className="h-5 w-5 text-purple-600" /><div><p className="text-xs text-muted-foreground">学习人数</p><p className="text-xl font-bold">{course.studyCount}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-cyan-600" /><div><p className="text-xs text-muted-foreground">总进度</p><div className="flex items-center gap-2"><p className="text-xl font-bold">{totalProgress}%</p><Progress value={totalProgress} className="h-2 w-16" /></div></div></div></CardContent></Card>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="info"><Info className="h-4 w-4 mr-1" />课程信息</TabsTrigger>
          <TabsTrigger value="goals"><Target className="h-4 w-4 mr-1" />课程目标</TabsTrigger>
          <TabsTrigger value="catalog"><List className="h-4 w-4 mr-1" />课程目录</TabsTrigger>
          <TabsTrigger value="design"><PenTool className="h-4 w-4 mr-1" />教学设计</TabsTrigger>
          <TabsTrigger value="resources"><FolderOpen className="h-4 w-4 mr-1" />课程资源</TabsTrigger>
          <TabsTrigger value="quiz"><ClipboardList className="h-4 w-4 mr-1" />课程测评</TabsTrigger>
        </TabsList>

        {/* Catalog - tree view */}
        <TabsContent value="catalog">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="w-4 h-4 text-[#1890ff]" />课程目录
                <span className="text-xs font-normal text-gray-400">({SESSIONS.length} 次课)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TreeView sessions={SESSIONS} courseId={course.id} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Course Info */}
        <TabsContent value="info">
          <Card>
            <CardHeader><CardTitle>课程简介</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                本课程为线上线下混合式课程，融合传统课堂教学与数字课程资源，形成"课前线上自主学习 + 课中线下智慧课堂 + 课后线上作业测验 + 期末过程性考核归档"的完整教学闭环。涵盖HTML/CSS/JavaScript基础、React框架开发、TypeScript工程化、前端项目实战等内容。
              </p>
              <div className="space-y-3">
                <p className="font-medium flex items-center gap-2"><Info className="w-4 h-4 text-[#1890ff]" />课程信息</p>
                <div className="text-sm text-muted-foreground space-y-2 grid grid-cols-2 gap-x-8">
                  <div className="flex justify-between py-1.5 border-b border-gray-50"><span>课程编码</span><span className="font-medium text-gray-700">{course.code}</span></div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50"><span>授课教师</span><span className="font-medium text-gray-700">{course.teacher}</span></div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50"><span>上课学期</span><span className="font-medium text-gray-700">{course.semester}</span></div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50"><span>上课班级</span><span className="font-medium text-gray-700">{course.className}</span></div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50"><span>课程分类</span><span className="font-medium text-gray-700">{course.category}</span></div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50"><span>所属专业</span><span className="font-medium text-gray-700">{course.major}</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals - single rich text */}
        <TabsContent value="goals">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-4 h-4 text-[#1890ff]" />课程目标</CardTitle></CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {COURSE_OBJECTIVES}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Design */}
        <TabsContent value="design">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><PenTool className="w-4 h-4 text-blue-500" />教学设计总览</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {SESSIONS.map((s) => (
                  <Collapsible key={s.id}>
                    <CollapsibleTrigger className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">第{s.week}周 · {s.name}</span>
                      <Badge variant="outline" className="text-[10px]">{s.mode === "online" ? "线上" : "线下"}</Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-8 p-3 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                      {s.design}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources - linked to catalog */}
        <TabsContent value="resources">
          <div className="flex gap-4">
            <CatalogNav sessions={SESSIONS} selectedId={selectedId} onSelect={setSelectedId} courseId={course.id} />
            <div className="flex-1 min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    课程资源
                    <span className="text-xs font-normal text-gray-400">— {SESSIONS.find(s => s.id === selectedId)?.name || ""}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(SESSION_RESOURCES[selectedId] || []).length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                      <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>请选择左侧目录查看对应课时资源</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(SESSION_RESOURCES[selectedId] || []).map((r) => (
                        <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#1890ff] hover:shadow-sm transition-all cursor-pointer">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{r.name}</p>
                            <p className="text-xs text-gray-400">{r.size}</p>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">{r.type}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Quiz - linked to catalog */}
        <TabsContent value="quiz">
          <div className="flex gap-4">
            <CatalogNav sessions={SESSIONS} selectedId={selectedId} onSelect={setSelectedId} courseId={course.id} />
            <div className="flex-1 min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-blue-500" />
                    课程测评
                    <span className="text-xs font-normal text-gray-400">— {SESSIONS.find(s => s.id === selectedId)?.name || ""}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(SESSION_QUIZZES[selectedId] || []).length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                      <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>请选择左侧目录查看对应课时测评</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(SESSION_QUIZZES[selectedId] || []).map((qz, i) => (
                        <div key={i} className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                              <h4 className="text-sm font-semibold text-gray-800">{qz.title}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-[10px]">{qz.type}</Badge>
                              <Badge variant="outline" className="text-[10px]">{qz.count} 题</Badge>
                            </div>
                          </div>
                          <Link href={`/learn/courses/hybrid/${course.id}/learn?session=${selectedId}`}>
                            <Button size="sm" variant="outline" className="mt-1">
                              <PlayCircle className="w-3 h-3 mr-1" />进入测评
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
