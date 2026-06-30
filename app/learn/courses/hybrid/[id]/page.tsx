"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  BookOpen, Clock, FileText, FolderOpen, List,
  PlayCircle, Target, User, BarChart3, GraduationCap,
  ClipboardList, ChevronDown, ChevronRight, CheckCircle2,
  PenTool, MonitorPlay, Users, BookMarked,
} from "lucide-react"
import { hybridCourses } from "@/lib/mock-data"
import { COURSE_TYPE_LABELS } from "@/lib/types"

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
      { key: "preQuizzes", label: "课前测验", phase: "pre-class", icon: PenTool, status: "done", desc: "HTML/CSS基础概念测验（10题）" },
      { key: "lecture", label: "课堂讲授", phase: "in-class", icon: MonitorPlay, status: "done", desc: "HTML5语义化标签 + CSS3 Flexbox/Grid布局" },
      { key: "inClassTasks", label: "课堂任务", phase: "in-class", icon: ClipboardList, status: "in_progress", desc: "响应式网页布局实战练习" },
      { key: "inClassQuizzes", label: "随堂测验", phase: "in-class", icon: CheckCircle2, status: "done", desc: "Flexbox布局测验，平均分82" },
      { key: "practiceTasks", label: "实践任务", phase: "in-class", icon: BookMarked, status: "in_progress", desc: "仿写京东首页静态布局" },
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
      { key: "practiceTasks", label: "实践任务", phase: "in-class", icon: BookMarked, status: "pending", desc: "完成小组项目核心功能开发" },
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
    { title: "前端技术栈基础习题库", count: 30, type: "题库" },
    { title: "开发环境搭建验收试卷", count: 12, type: "试卷" },
    { title: "Git工作流随堂测", count: 5, type: "随堂测" },
  ],
  "s2": [
    { title: "HTML5语义化习题库", count: 40, type: "题库" },
    { title: "CSS3布局实战试卷", count: 15, type: "试卷" },
    { title: "Flexbox课堂即时问答", count: 8, type: "现场问答" },
    { title: "响应式页面设计作业", count: 1, type: "作业" },
  ],
  "s3": [
    { title: "JavaScript基础题库", count: 50, type: "题库" },
    { title: "DOM操作编程作业", count: 3, type: "作业" },
    { title: "JS闭包机制随堂测", count: 6, type: "随堂测" },
  ],
  "s4": [
    { title: "ES6+新特性题库", count: 35, type: "题库" },
    { title: "Promise异步编程作业", count: 2, type: "作业" },
    { title: "ES6综合测评试卷", count: 20, type: "试卷" },
  ],
  "s5": [
    { title: "React核心概念题库", count: 30, type: "题库" },
    { title: "组件设计在线评审", count: 4, type: "在线评审" },
    { title: "Hooks应用随堂测", count: 5, type: "随堂测" },
  ],
  "s6": [
    { title: "组件封装设计评审", count: 3, type: "在线评审" },
    { title: "Context状态管理作业", count: 2, type: "作业" },
    { title: "React组件化成果评价", count: 5, type: "成果评价" },
  ],
  "s7": [
    { title: "TypeScript类型系统题库", count: 40, type: "题库" },
    { title: "工程化配置实践作业", count: 2, type: "作业" },
    { title: "TS类型体操现场问答", count: 6, type: "现场问答" },
  ],
  "s8": [
    { title: "前端综合能力测评", count: 50, type: "题库" },
    { title: "项目答辩专家评审", count: 5, type: "在线评审" },
    { title: "前端项目成果评价", count: 8, type: "成果评价" },
    { title: "综合结课考核试卷", count: 25, type: "试卷" },
  ],
}

/* ======================== Sub Components ======================== */

function CatalogNav({
  sessions,
  selectedId,
  onSelect,
  courseId: _courseId,
}: {
  sessions: TeachingSession[]
  selectedId: string
  onSelect: (id: string) => void
  courseId: string
}) {
  return (
    <div className="w-[250px] shrink-0 bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <List className="w-4 h-4 text-[#1890ff]" />
        课程目录
        <span className="text-xs font-normal text-gray-400 ml-auto">{sessions.length} 次课</span>
      </h3>
      <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
        {sessions.map((s) => {
          const isActive = selectedId === s.id
          return (
            <div key={s.id}>
              <button
                onClick={() => onSelect(s.id)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  isActive ? "bg-[#e6f7ff] text-[#1890ff] font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="w-5 h-5 rounded bg-[#1890ff]/10 text-[#1890ff] text-[10px] font-semibold flex items-center justify-center shrink-0">
                  {s.week}
                </span>
                <span className="truncate flex-1">{s.name.split("：")[1] || s.name}</span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TreeView({ sessions, courseId }: { sessions: TeachingSession[]; courseId: string }) {
  return (
    <div className="space-y-1">
      {sessions.map((s) => (
        <div key={s.id}>
          <div className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors bg-gray-50 font-medium text-gray-800">
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
        </div>
      ))}
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
  const [activeTab, setActiveTab] = useState("goals")
  const [selectedId, setSelectedId] = useState("s1")
  const coverLabel = course.category || "混合课程"

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground transition-colors">课程首页</Link>
        <span>/</span>
        <span className="text-foreground">混合课详情</span>
      </div>

      {/* Top Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#e7e5e4] shadow-[0_4px_20px_rgba(69,26,3,0.06)]">
        <div className="flex gap-6">
          <div className="w-[260px] min-h-[180px] rounded-xl bg-gradient-to-br from-purple-700 to-violet-500 flex items-center justify-center relative overflow-hidden shrink-0">
            <span className="absolute top-3 left-3 bg-white/25 text-white px-3 py-1 rounded-md text-sm font-semibold backdrop-blur-sm">{course.version}</span>
            <span className="text-white text-5xl font-bold opacity-25">{coverLabel}</span>
            <span className="absolute bottom-3 right-3 bg-black/40 text-white px-3 py-1 rounded-md text-xs">{course.code}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-2xl font-bold text-[#0f172a]">{course.name}</h1>
              <Badge className="text-xs bg-[#eff6ff] text-[#2563eb] hover:bg-[#eff6ff] border-none">{COURSE_TYPE_LABELS[course.type]}</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs border border-[#ffedd5] bg-[#fff7ed] text-[#c2410c]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" /></svg>
                面向行业：{course.industry}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs border border-[#bbf7d0] bg-[#dcfce7] text-[#15803d]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                适用专业：{course.major}
              </span>
            </div>
            <div className="flex flex-col gap-2.5 mb-4">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <User className="h-3.5 w-3.5 text-[#94a3b8]" />
                  <span>授课教师：{course.teacher}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <Clock className="h-3.5 w-3.5 text-[#94a3b8]" />
                  <span>更新时间：{course.updateDate}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <BookOpen className="h-3.5 w-3.5 text-[#94a3b8]" />
                  <span>课程分类：{course.category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <GraduationCap className="h-3.5 w-3.5 text-[#94a3b8]" />
                  <span>{course.semester} · {course.className}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/learn/courses/hybrid/${course.id}/learn`}>
                <Button className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] hover:from-[#2563eb] hover:to-[#3b82f6] text-white border-0 px-8 py-2.5 text-base rounded-lg">
                  <PlayCircle className="h-4 w-4 mr-2" />开始学习
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Box */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "线上学时", value: `${course.onlineHours}h` },
          { label: "线下学时", value: `${course.offlineHours}h` },
          { label: "成绩权重", value: `${course.onlineWeight}/${course.offlineWeight}` },
          { label: "学习人数", value: course.studyCount },
          { label: "总进度", value: `${totalProgress}%` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] py-3 px-4 text-center hover:border-[#bfdbfe] hover:shadow-[0_4px_12px_rgba(37,99,235,0.08)] transition-all">
            <div className="text-[24px] font-bold text-[#1e293b] leading-tight">{stat.value}</div>
            <div className="text-[13px] text-[#64748b]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom Tab Card */}
      <div className="bg-white rounded-2xl border border-[#e7e5e4] shadow-[0_4px_20px_rgba(69,26,3,0.06)] overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start gap-0 rounded-none border-b border-[#f5f5f4] bg-white h-auto p-0 overflow-x-auto">
            {[
              { value: "goals", label: "课程目标", icon: Target },
              { value: "catalog", label: "课程目录", icon: List },
              { value: "design", label: "教学设计", icon: PenTool },
              { value: "resources", label: "课程资源", icon: FolderOpen },
              { value: "quiz", label: "节点测评", icon: ClipboardList },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative shrink-0 px-4 py-4 text-[15px] text-[#64748b] rounded-none border-0 bg-transparent data-[state=active]:text-[#3b82f6] data-[state=active]:font-semibold data-[state=active]:shadow-none data-[state=active]:bg-transparent hover:text-[#2563eb] transition-colors
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-sm data-[state=active]:after:bg-[#3b82f6]"
              >
                <tab.icon className="h-4 w-4 mr-1.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="p-6 min-h-[500px]">
            {/* Goals */}
            <TabsContent value="goals" className="mt-0">
              <h3 className="text-base font-semibold text-[#1f2937] mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#3b82f6]" />课程目标
              </h3>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {COURSE_OBJECTIVES}
              </div>
            </TabsContent>

            {/* Catalog */}
            <TabsContent value="catalog" className="mt-0">
              <h3 className="text-base font-semibold text-[#1f2937] mb-4">课程目录</h3>
              <TreeView sessions={SESSIONS} courseId={course.id} />
            </TabsContent>

            {/* Design */}
            <TabsContent value="design" className="mt-0">
              <h3 className="text-base font-semibold text-[#1f2937] mb-4 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-[#3b82f6]" />教学设计总览
              </h3>
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
            </TabsContent>

            {/* Resources */}
            <TabsContent value="resources" className="mt-0">
              <div className="flex gap-4">
                <CatalogNav sessions={SESSIONS} selectedId={selectedId} onSelect={setSelectedId} courseId={course.id} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[#1f2937] mb-4 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    课程资源
                    <span className="text-xs font-normal text-gray-400">— {SESSIONS.find(s => s.id === selectedId)?.name || ""}</span>
                  </h3>
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
                </div>
              </div>
            </TabsContent>

            {/* Quiz */}
            <TabsContent value="quiz" className="mt-0">
              <div className="flex gap-4">
                <CatalogNav sessions={SESSIONS} selectedId={selectedId} onSelect={setSelectedId} courseId={course.id} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[#1f2937] mb-4 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-blue-500" />
                    节点测评
                    <span className="text-xs font-normal text-gray-400">— {SESSIONS.find(s => s.id === selectedId)?.name || ""}</span>
                  </h3>
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
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
