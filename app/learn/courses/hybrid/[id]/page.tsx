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
  BarChart3, Clock, Calendar, GraduationCap, Target, FolderOpen,
  ClipboardList, MessageCircle, ChevronDown, ChevronRight, CheckCircle2,
  Circle, Lightbulb, PenTool, Layers, BookMarked, HelpCircle,
  Wrench, BrainCircuit, Info, List
} from "lucide-react"
import { hybridCourses } from "@/lib/mock-data"
import { COURSE_STATUS_LABELS, COURSE_TYPE_LABELS } from "@/lib/types"

/* ======================== Mock Data ======================== */

const PHASE_META = {
  "pre-class": { label: "课前", color: "bg-blue-50 text-blue-600 border-blue-200", icon: "bg-blue-100 text-blue-600" },
  "in-class": { label: "课中", color: "bg-green-50 text-green-600 border-green-200", icon: "bg-green-100 text-green-600" },
  "post-class": { label: "课后", color: "bg-purple-50 text-purple-600 border-purple-200", icon: "bg-purple-100 text-purple-600" },
} as const

interface ModuleItem {
  key: string
  label: string
  phase: keyof typeof PHASE_META
  icon: React.ComponentType<{ className?: string }>
  status: "done" | "in_progress" | "pending"
  desc: string
}

interface TeachingSession {
  id: string
  name: string
  week: number
  phase: keyof typeof PHASE_META
  mode: "online" | "offline"
  progress: number
  design: string
  review: string
  modules: ModuleItem[]
}

const SESSIONS: TeachingSession[] = [
  {
    id: "s1", name: "第一周：课程导论与环境搭建", week: 1, phase: "pre-class", mode: "online", progress: 100,
    design: "**教学重点**\n- 前端技术栈全景介绍\n- 开发环境搭建（VSCode + Node.js + Git）\n\n**教学难点**\n- 理解前后端分离架构\n- Git工作流概念理解\n\n**教学方法**\n在线预习视频 + 课堂讲解 + 实操演示",
    review: "本节课顺利完成课程导论与开发环境搭建。学生整体对前端技术栈有了初步了解，90%的学生成功完成环境搭建。个别学生对Git操作不熟练，下次课需加强练习。",
    modules: [
      { key: "prePreview", label: "课前预习", phase: "pre-class", icon: BookOpen, status: "done", desc: "观看课程导论视频（15min），了解前端技术栈体系" },
      { key: "preResources", label: "学习资源", phase: "pre-class", icon: FolderOpen, status: "done", desc: "阅读开发环境搭建指南.pdf，安装VSCode/Node.js/Git" },
      { key: "preTasks", label: "课前任务", phase: "pre-class", icon: ClipboardList, status: "done", desc: "完成环境搭建自检清单，提交截图到学习平台" },
    ],
  },
  {
    id: "s2", name: "第二周：HTML5与CSS3核心", week: 2, phase: "in-class", mode: "offline", progress: 85,
    design: "**教学重点**\n- HTML5语义化标签\n- CSS3 Flexbox/Grid布局\n- 响应式设计原理\n\n**教学难点**\n- Grid布局的网格线概念\n- 媒体查询与移动端适配\n\n**教学方法**\n课前预习微课 + 课堂案例演示 + 随堂练习 + 项目实践",
    review: "课堂互动积极，学生掌握了Flexbox布局核心属性。Grid布局部分需要更多练习。随堂测验平均分82分，整体情况良好。",
    modules: [
      { key: "preQuizzes", label: "课前测验", phase: "pre-class", icon: HelpCircle, status: "done", desc: "HTML/CSS基础概念测验（10题）" },
      { key: "lecture", label: "课堂讲授", phase: "in-class", icon: MonitorPlay, status: "done", desc: "HTML5语义化标签 + CSS3 Flexbox/Grid布局理论讲解" },
      { key: "inClassTasks", label: "课堂任务", phase: "in-class", icon: ClipboardList, status: "in_progress", desc: "完成响应式网页布局实战练习" },
      { key: "inClassQuizzes", label: "随堂测验", phase: "in-class", icon: CheckCircle2, status: "done", desc: "Flexbox布局10题测验，平均分82" },
      { key: "classQuestions", label: "课堂提问", phase: "in-class", icon: MessageCircle, status: "done", desc: "随堂提问互动3次" },
      { key: "practiceTasks", label: "实践任务", phase: "in-class", icon: Wrench, status: "in_progress", desc: "仿写京东首页静态布局" },
    ],
  },
  {
    id: "s3", name: "第三周：JavaScript基础", week: 3, phase: "post-class", mode: "online", progress: 65,
    design: "**教学重点**\n- JS变量、数据类型与运算\n- 函数、作用域与闭包\n- DOM操作与事件处理\n\n**教学难点**\n- 闭包的理解与应用\n- 事件委托机制",
    review: "JavaScript基础讲授完成。闭包概念对部分学生仍较难理解，建议下次课前再发布一个针对性预习视频。DOM操作部分学生掌握较好。",
    modules: [
      { key: "homeworks", label: "课后作业", phase: "post-class", icon: FileText, status: "in_progress", desc: "实现一个Todo List应用（截止2026-07-15）" },
      { key: "extensionMaterials", label: "拓展资料", phase: "post-class", icon: BookMarked, status: "done", desc: "阅读MDN JavaScript高级教程" },
      { key: "trainingReports", label: "实训报告", phase: "post-class", icon: ClipboardList, status: "pending", desc: "撰写DOM操作实训报告" },
    ],
  },
  {
    id: "s4", name: "第四周：JavaScript进阶", week: 4, phase: "pre-class", mode: "online", progress: 40,
    design: "**教学重点**\n- ES6+新特性（箭头函数、解构、模板字符串）\n- 异步编程（Promise、async/await）\n- 模块化编程\n\n**教学难点**\n- Promise链式调用与错误处理",
    review: "",
    modules: [
      { key: "prePreview", label: "课前预习", phase: "pre-class", icon: BookOpen, status: "in_progress", desc: "观看ES6新特性教学视频（20min）" },
      { key: "preResources", label: "学习资源", phase: "pre-class", icon: FolderOpen, status: "done", desc: "阅读ES6标准入门.pdf" },
      { key: "preTasks", label: "课前任务", phase: "pre-class", icon: ClipboardList, status: "pending", desc: "完成Promise编程练习题5道" },
    ],
  },
  {
    id: "s5", name: "第五周：React框架入门", week: 5, phase: "in-class", mode: "offline", progress: 20,
    design: "**教学重点**\n- React核心概念与JSX\n- 组件Props与State管理\n- Hooks（useState, useEffect）\n\n**教学难点**\n- State不可变更新\n- useEffect的依赖管理",
    review: "",
    modules: [
      { key: "preQuizzes", label: "课前测验", phase: "pre-class", icon: HelpCircle, status: "pending", desc: "React基础概念测验" },
      { key: "lecture", label: "课堂讲授", phase: "in-class", icon: MonitorPlay, status: "pending", desc: "React核心概念、JSX、组件化思想" },
      { key: "inClassTasks", label: "课堂任务", phase: "in-class", icon: ClipboardList, status: "pending", desc: "编写第一个React组件并进行调试" },
    ],
  },
  {
    id: "s6", name: "第六周：React组件开发实战", week: 6, phase: "post-class", mode: "online", progress: 0,
    design: "**教学重点**\n- 组件拆分与组合\n- 状态提升与Context\n- 自定义Hooks\n\n**教学难点**\n- 组件通信方案选型\n- 自定义Hooks的封装思维",
    review: "",
    modules: [
      { key: "homeworks", label: "课后作业", phase: "post-class", icon: FileText, status: "pending", desc: "实现天气查询应用（React + 公开API）" },
    ],
  },
  {
    id: "s7", name: "第七周：TypeScript与工程化", week: 7, phase: "pre-class", mode: "online", progress: 0,
    design: "**教学重点**\n- TypeScript类型系统\n- Vite构建工具配置\n- ESLint/Prettier代码规范\n\n**教学难点**\n- 泛型与高级类型\n- tsconfig.json配置",
    review: "",
    modules: [
      { key: "prePreview", label: "课前预习", phase: "pre-class", icon: BookOpen, status: "pending", desc: "阅读TypeScript入门指南（官方文档）" },
      { key: "preResources", label: "学习资源", phase: "pre-class", icon: FolderOpen, status: "pending", desc: "TypeScript类型体操练习仓库" },
    ],
  },
  {
    id: "s8", name: "第八周：前端项目综合实战", week: 8, phase: "in-class", mode: "offline", progress: 0,
    design: "**教学重点**\n- 项目需求分析与架构设计\n- 前后端分离开发流程\n- 项目打包与部署\n\n**教学难点**\n- 前后端接口联调\n- 项目性能优化",
    review: "",
    modules: [
      { key: "lecture", label: "课堂讲授", phase: "in-class", icon: MonitorPlay, status: "pending", desc: "项目管理流程与团队协作方案" },
      { key: "inClassTasks", label: "课堂任务", phase: "in-class", icon: ClipboardList, status: "pending", desc: "分组选题与技术方案评审" },
      { key: "practiceTasks", label: "实践任务", phase: "in-class", icon: Wrench, status: "pending", desc: "完成小组项目核心功能开发" },
    ],
  },
]

const COURSE_RESOURCES = [
  { id: "r1", name: "HTML5与CSS3权威指南.pdf", type: "doc", size: "8.5MB", icon: "text-red-500", bg: "bg-red-50" },
  { id: "r2", name: "React 18官方文档（中文版）", type: "link", size: "在线文档", icon: "text-green-500", bg: "bg-green-50" },
  { id: "r3", name: "JavaScript高级程序设计（第4版）.pdf", type: "doc", size: "12.3MB", icon: "text-red-500", bg: "bg-red-50" },
  { id: "r4", name: "TypeScript深入浅出（视频教程）", type: "video", size: "2.1GB", icon: "text-blue-500", bg: "bg-blue-50" },
  { id: "r5", name: "Vite实战指南.pdf", type: "doc", size: "3.2MB", icon: "text-red-500", bg: "bg-red-50" },
  { id: "r6", name: "Flexbox与Grid布局详解.pptx", type: "ppt", size: "4.1MB", icon: "text-purple-500", bg: "bg-purple-50" },
  { id: "r7", name: "前端工程化体系搭建", type: "link", size: "在线文档", icon: "text-green-500", bg: "bg-green-50" },
  { id: "r8", name: "ES6标准入门（阮一峰）", type: "link", size: "在线文档", icon: "text-green-500", bg: "bg-green-50" },
  { id: "r9", name: "Git版本控制最佳实践.pdf", type: "doc", size: "2.8MB", icon: "text-red-500", bg: "bg-red-50" },
  { id: "r10", name: "前端项目实战源码（示例仓库）", type: "archive", size: "15MB", icon: "text-orange-500", bg: "bg-orange-50" },
]

const COURSE_GOALS = {
  knowledge: [
    "掌握HTML/CSS/JavaScript前端三件套的核心语法与应用",
    "理解React组件化开发思想，掌握Hooks API的使用",
    "了解前端工程化体系（Vite、TypeScript、ESLint）",
    "熟悉前后端交互原理（HTTP协议、RESTful API）",
  ],
  ability: [
    "能够独立完成中小型前端项目开发",
    "具备组件设计与封装能力",
    "掌握版本控制（Git）与团队协作开发能力",
    "能够进行前端性能优化与调试",
  ],
  quality: [
    "培养自主学习与终身学习意识",
    "建立工程化思维与规范意识",
    "提升沟通表达与团队协作能力",
  ],
}

const QUIZ_QUESTIONS = [
  { id: "q1", type: "single", stem: "以下哪个是React中用于管理组件状态的Hook？", options: ["useEffect", "useState", "useContext", "useRef"], answer: "useState" },
  { id: "q2", type: "single", stem: "CSS中Flexbox布局，设置justify-content: center的作用是？", options: ["主轴居中", "交叉轴居中", "垂直居中", "水平拉伸"], answer: "主轴居中" },
  { id: "q3", type: "single", stem: "TypeScript中，以下哪个关键字用于定义接口？", options: ["type", "class", "interface", "enum"], answer: "interface" },
  { id: "q4", type: "multiple", stem: "以下哪些是ES6的新特性？", options: ["箭头函数", "Promise", "模板字符串", "ActiveXObject"], answer: "箭头函数,Promise,模板字符串" },
  { id: "q5", type: "multiple", stem: "React中以下哪些方式可以触发组件重渲染？", options: ["State更新", "Props变化", "Context值变化", "直接修改DOM"], answer: "State更新,Props变化,Context值变化" },
]

/* ======================== Sub Components ======================== */

function SessionCatalog({
  sessions,
  selectedId,
  onSelect,
}: {
  sessions: TeachingSession[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  const [expandedPhases, setExpandedPhases] = useState<Set<keyof typeof PHASE_META>>(
    new Set(["pre-class", "in-class", "post-class"])
  )

  const togglePhase = (phase: keyof typeof PHASE_META) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev)
      if (next.has(phase)) next.delete(phase)
      else next.add(phase)
      return next
    })
  }

  const phases = ["pre-class", "in-class", "post-class"] as (keyof typeof PHASE_META)[]

  return (
    <div className="w-[260px] shrink-0 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <List className="w-4 h-4 text-[#1890ff]" />
          课程目录
          <span className="text-xs font-normal text-gray-400 ml-auto">{sessions.length} 次课</span>
        </h3>
      </div>
      <div className="py-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {phases.map((phase) => {
          const phaseSessions = sessions.filter((s) => s.phase === phase)
          if (phaseSessions.length === 0) return null
          const isExpanded = expandedPhases.has(phase)
          const meta = PHASE_META[phase]
          return (
            <div key={phase}>
              <button
                onClick={() => togglePhase(phase)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span className={`px-1.5 py-0.5 rounded text-[10px] border ${meta.color}`}>{meta.label}</span>
                <span>{phaseSessions.length} 次课</span>
              </button>
              {isExpanded && (
                <div className="space-y-0.5 px-2 pb-2">
                  {phaseSessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSelect(s.id)}
                      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                        selectedId === s.id
                          ? "bg-[#e6f7ff] text-[#1890ff] font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                      <span className="truncate flex-1">第{s.week}周：{s.name.split("：")[1] || s.name}</span>
                      <span className="text-[10px] text-gray-400">{s.progress}%</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SessionDetailPanel({ session }: { session: TeachingSession }) {
  const phaseMeta = PHASE_META[session.phase]
  const doneModules = session.modules.filter((m) => m.status === "done").length
  const totalModules = session.modules.length

  const groupedModules = session.modules.reduce(
    (acc, m) => {
      if (!acc[m.phase]) acc[m.phase] = []
      acc[m.phase].push(m)
      return acc
    },
    {} as Record<string, ModuleItem[]>
  )

  const phaseOrder = ["pre-class", "in-class", "post-class"]
  const phaseLabels: Record<string, string> = {
    "pre-class": "课前准备",
    "in-class": "教学实施",
    "post-class": "课后拓展",
  }

  return (
    <div className="space-y-4">
      {/* Session header info */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs border ${phaseMeta.color}`}>{phaseMeta.label}</span>
          <Badge variant="outline" className="text-xs">
            {session.mode === "online" ? "线上" : "线下"}教学
          </Badge>
        </div>
        <span className="text-xs text-gray-400">第{session.week}周</span>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-400">完成度</span>
          <div className="flex items-center gap-2 w-[120px]">
            <Progress value={session.progress} className="h-2" />
            <span className="text-xs font-medium text-gray-600">{session.progress}%</span>
          </div>
        </div>
      </div>

      {/* Module cards by phase */}
      {phaseOrder.map((phase) => {
        const mods = groupedModules[phase]
        if (!mods || mods.length === 0) return null
        return (
          <div key={phase}>
            <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-2">
              <Layers className="w-3 h-3" />
              {phaseLabels[phase] || phase}
              <span className="text-gray-300">({mods.filter((m) => m.status === "done").length}/{mods.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mods.map((m) => {
                const Icon = m.icon
                const statusColors = {
                  done: "border-green-200 bg-green-50/50",
                  in_progress: "border-blue-200 bg-blue-50/50",
                  pending: "border-gray-200 bg-gray-50/50",
                }
                const statusDot = {
                  done: "bg-green-500",
                  in_progress: "bg-blue-500",
                  pending: "bg-gray-300",
                }
                const statusLabel = {
                  done: "已完成",
                  in_progress: "进行中",
                  pending: "待开始",
                }
                return (
                  <Link
                    key={m.key}
                    href={`/learn/courses/hybrid/${session.id.replace("s", "hybrid-") || "hybrid-1"}/learn?session=${session.id}&module=${m.key}`}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border ${statusColors[m.status]} hover:shadow-sm transition-all cursor-pointer`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${m.status === "done" ? "bg-green-100" : m.status === "in_progress" ? "bg-blue-100" : "bg-gray-100"} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${m.status === "done" ? "text-green-600" : m.status === "in_progress" ? "text-blue-600" : "text-gray-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[m.status]} shrink-0`} />
                        <span className="text-sm font-medium text-gray-700 truncate">{m.label}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{m.desc}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                      {statusLabel[m.status]}
                    </Badge>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Teaching design */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors w-full">
          <PenTool className="w-4 h-4 text-blue-500" />
          教学设计
          <ChevronDown className="w-3.5 h-3.5" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
          {session.design}
        </CollapsibleContent>
      </Collapsible>

      {/* Post-lesson review */}
      {session.review && (
        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors w-full">
            <ClipboardList className="w-4 h-4 text-purple-500" />
            课后复盘
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 p-3 rounded-lg bg-purple-50 border border-purple-100 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {session.review}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

function QuizPanel() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)

  const selectSingle = (qId: string, opt: string) => {
    if (showResults) return
    setAnswers((prev) => ({ ...prev, [qId]: opt }))
  }

  const toggleMultiple = (qId: string, opt: string) => {
    if (showResults) return
    setAnswers((prev) => {
      const current = (prev[qId] || "").split(",").filter(Boolean)
      const idx = current.indexOf(opt)
      if (idx >= 0) current.splice(idx, 1)
      else current.push(opt)
      return { ...prev, [qId]: current.sort().join(",") }
    })
  }

  const checkAnswer = (qId: string) => {
    if (!showResults) return null
    const user = answers[qId] || ""
    const question = QUIZ_QUESTIONS.find((q) => q.id === qId)
    if (!question) return null
    return user === question.answer ? "correct" : "wrong"
  }

  const score = QUIZ_QUESTIONS.reduce((sum, q) => {
    return sum + ((answers[q.id] || "") === q.answer ? 1 : 0)
  }, 0)

  return (
    <div className="space-y-6">
      {QUIZ_QUESTIONS.map((q, qi) => {
        const result = checkAnswer(q.id)
        return (
          <div key={q.id} className={`p-4 rounded-lg border ${result === "correct" ? "border-green-200 bg-green-50/30" : result === "wrong" ? "border-red-200 bg-red-50/30" : "border-gray-100"}`}>
            <div className="flex items-start gap-2 mb-3">
              <span className="px-1.5 py-0.5 rounded bg-[#1890ff] text-white text-xs font-semibold shrink-0 mt-0.5">{qi + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{q.stem}</p>
                <Badge variant="secondary" className="text-[10px] mt-1">
                  {q.type === "single" ? "单选" : "多选"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2 ml-8">
              {q.options.map((opt) => {
                const isSelected = q.type === "single"
                  ? answers[q.id] === opt
                  : (answers[q.id] || "").split(",").includes(opt)
                const isCorrectAnswer = q.answer.split(",").includes(opt)
                let optionClass = "border-gray-200 hover:border-gray-300"
                if (isSelected && !showResults) optionClass = "border-[#1890ff] bg-blue-50"
                if (showResults && isCorrectAnswer) optionClass = "border-green-500 bg-green-50"
                if (showResults && isSelected && !isCorrectAnswer) optionClass = "border-red-500 bg-red-50"

                return (
                  <button
                    key={opt}
                    onClick={() => q.type === "single" ? selectSingle(q.id, opt) : toggleMultiple(q.id, opt)}
                    disabled={showResults}
                    className={`flex items-center gap-2 w-full p-2.5 rounded-lg border text-left text-sm transition-colors ${optionClass}`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? "border-[#1890ff] bg-[#1890ff]" : "border-gray-300"
                    }`}>
                      {isSelected && <span className="text-white text-[10px]">✓</span>}
                    </span>
                    {opt}
                    {showResults && isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                    {showResults && isSelected && !isCorrectAnswer && <span className="text-red-500 text-xs ml-auto">✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {showResults ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">
              得分：{score}/{QUIZ_QUESTIONS.length}
            </span>
            <Badge variant={score >= QUIZ_QUESTIONS.length * 0.6 ? "default" : "destructive"}>
              {score >= QUIZ_QUESTIONS.length * 0.6 ? "及格" : "不及格"}
            </Badge>
          </div>
        ) : (
          <span className="text-xs text-gray-400">
            已答 {Object.keys(answers).length}/{QUIZ_QUESTIONS.length} 题
          </span>
        )}
        <Button
          size="sm"
          onClick={() => setShowResults(!showResults)}
          disabled={!showResults && Object.keys(answers).length === 0}
        >
          {showResults ? "重新作答" : "提交答题"}
        </Button>
      </div>
    </div>
  )
}

/* ======================== Main Page ======================== */

export default function HybridCourseDetailPage() {
  const params = useParams()
  const course = hybridCourses.find((c) => c.id === params.id)

  if (!course) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        未找到该混合课程
      </div>
    )
  }

  const totalProgress = Math.round(SESSIONS.reduce((sum, s) => sum + s.progress, 0) / SESSIONS.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/learn">
            <ArrowLeft className="h-4 w-4" />
          </Link>
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
            <PlayCircle className="h-4 w-4 mr-1" /> 进入学习
          </Link>
        </Button>
      </div>

      {/* Cover banner */}
      <div className={`h-48 rounded-xl bg-gradient-to-br ${course.coverColor} flex items-center justify-center text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="text-center relative z-10">
          <h2 className="text-3xl font-bold">{course.name}</h2>
          <p className="mt-2 opacity-90">{course.major} · {course.teacher}</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="text-sm opacity-80">班级：{course.className}</span>
            <span className="text-sm opacity-80">|</span>
            <span className="text-sm opacity-80">学期：{course.semester}</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2">
              <MonitorPlay className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">线上学时</p>
                <p className="text-xl font-bold">{course.onlineHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">线下学时</p>
                <p className="text-xl font-bold">{course.offlineHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">成绩权重</p>
                <p className="text-xl font-bold">{course.onlineWeight}/{course.offlineWeight}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">学习人数</p>
                <p className="text-xl font-bold">{course.studyCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-cyan-600" />
              <div>
                <p className="text-xs text-muted-foreground">总进度</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold">{totalProgress}%</p>
                  <Progress value={totalProgress} className="h-2 w-16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="catalog"><List className="h-4 w-4 mr-1" />课程目录</TabsTrigger>
          <TabsTrigger value="intro"><BookOpen className="h-4 w-4 mr-1" />课程信息</TabsTrigger>
          <TabsTrigger value="goals"><Target className="h-4 w-4 mr-1" />学习目标</TabsTrigger>
          <TabsTrigger value="design"><PenTool className="h-4 w-4 mr-1" />教学设计</TabsTrigger>
          <TabsTrigger value="resources"><FolderOpen className="h-4 w-4 mr-1" />课程资源</TabsTrigger>
          <TabsTrigger value="quiz"><ClipboardList className="h-4 w-4 mr-1" />课程测评</TabsTrigger>
          <TabsTrigger value="discuss"><MessageCircle className="h-4 w-4 mr-1" />讨论答疑</TabsTrigger>
        </TabsList>

        {/* 课程目录 */}
        <TabsContent value="catalog">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">线上 {course.onlineHours}h</Badge>
                  <Badge variant="outline" className="text-xs border-orange-200 text-orange-600">线下 {course.offlineHours}h</Badge>
                  <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">
                    共 {SESSIONS.length} 次课
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">学期总进度</span>
                  <Progress value={totalProgress} className="h-2 w-[100px]" />
                  <span className="text-xs font-medium">{totalProgress}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(["pre-class", "in-class", "post-class"] as (keyof typeof PHASE_META)[]).map((phase) => {
                  const phaseSessions = SESSIONS.filter((s) => s.phase === phase)
                  if (phaseSessions.length === 0) return null
                  const meta = PHASE_META[phase]
                  const phaseLabels = { "pre-class": "课前自主学习", "in-class": "课中线下教学", "post-class": "课后在线拓展" }
                  return (
                    <div key={phase}>
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className={`text-sm font-semibold px-3 py-1 rounded-full border ${meta.color}`}>
                          {phaseLabels[phase]}
                        </h3>
                        <span className="text-xs text-gray-400">{phaseSessions.length} 次课</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {phaseSessions.map((s) => {
                          const doneMods = s.modules.filter((m) => m.status === "done").length
                          return (
                            <div
                              key={s.id}
                              className="border rounded-lg p-4 hover:border-[#1890ff] hover:shadow-sm transition-all cursor-pointer group"
                              onClick={() => document.dispatchEvent(new CustomEvent("selectSession", { detail: s.id }))}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant={s.mode === "online" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0 h-4">
                                      {s.mode === "online" ? "线上" : "线下"}
                                    </Badge>
                                    <span className="text-xs text-gray-400">第{s.week}周</span>
                                  </div>
                                  <h4 className="font-medium text-gray-800 group-hover:text-[#1890ff] transition-colors">
                                    {s.name}
                                  </h4>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="flex items-center gap-1.5">
                                    <Progress value={s.progress} className="h-1.5 w-[60px]" />
                                    <span className={`text-xs font-medium ${
                                      s.progress === 100 ? "text-green-600" : s.progress > 0 ? "text-blue-600" : "text-gray-400"
                                    }`}>{s.progress}%</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {s.modules.map((m) => {
                                  const Icon = m.icon
                                  return (
                                    <span
                                      key={m.key}
                                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] border ${
                                        m.status === "done" ? "border-green-200 bg-green-50 text-green-600" :
                                        m.status === "in_progress" ? "border-blue-200 bg-blue-50 text-blue-600" :
                                        "border-gray-200 bg-gray-50 text-gray-400"
                                      }`}
                                    >
                                      <Icon className="w-3 h-3" />
                                      {m.label}
                                    </span>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 课程信息 */}
        <TabsContent value="intro">
          <Card>
            <CardHeader><CardTitle>课程简介</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                本课程为线上线下混合式课程，融合传统课堂教学与数字课程资源，形成"课前线上自主学习 + 课中线下智慧课堂 + 课后线上作业测验 + 期末过程性考核归档"的完整教学闭环。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="font-medium flex items-center gap-2"><Info className="w-4 h-4 text-[#1890ff]" />课程信息</p>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex justify-between py-1.5 border-b border-gray-50"><span>课程编码</span><span className="font-medium text-gray-700">{course.code}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-gray-50"><span>授课教师</span><span className="font-medium text-gray-700">{course.teacher}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-gray-50"><span>上课学期</span><span className="font-medium text-gray-700">{course.semester}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-gray-50"><span>上课班级</span><span className="font-medium text-gray-700">{course.className}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-gray-50"><span>课程分类</span><span className="font-medium text-gray-700">{course.category}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-gray-50"><span>所属专业</span><span className="font-medium text-gray-700">{course.major}</span></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-medium flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#1890ff]" />考核方式</p>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                      <p className="font-medium text-blue-700">线上成绩：{course.onlineWeight}%</p>
                      <p className="text-xs mt-1">观看时长、线上作业、单元测验、讨论参与度</p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-50 border border-orange-100">
                      <p className="font-medium text-orange-700">线下成绩：{course.offlineWeight}%</p>
                      <p className="text-xs mt-1">课堂签到、课堂互动、项目实践、期末答辩</p>
                    </div>
                    <p className="text-xs text-gray-500">总评：线上 + 线下加权汇总，平台自动计算</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 学习目标 */}
        <TabsContent value="goals">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />知识目标
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {COURSE_GOALS.knowledge.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">{i + 1}</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-green-500" />能力目标
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {COURSE_GOALS.ability.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">{i + 1}</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-500" />素质目标
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {COURSE_GOALS.quality.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">{i + 1}</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 教学设计全集 */}
        <TabsContent value="design">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-500" />
                教学设计总览
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SESSIONS.map((s) => (
                  <Collapsible key={s.id}>
                    <CollapsibleTrigger className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">第{s.week}周 · {s.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] border ${PHASE_META[s.phase].color}`}>
                        {PHASE_META[s.phase].label}
                      </span>
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

        {/* 课程资源 */}
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-amber-500" />
                课程资源
                <span className="text-xs font-normal text-gray-400">({COURSE_RESOURCES.length} 项)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {COURSE_RESOURCES.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#1890ff] hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-lg ${r.bg} flex items-center justify-center shrink-0`}>
                      <FileText className={`w-5 h-5 ${r.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.size}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{r.type === "doc" ? "文档" : r.type === "video" ? "视频" : r.type === "link" ? "链接" : r.type === "ppt" ? "课件" : "压缩包"}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 课程测评 */}
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                课程综合测评
                <span className="text-xs font-normal text-gray-400">({QUIZ_QUESTIONS.length} 题)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuizPanel />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 讨论答疑 */}
        <TabsContent value="discuss">
          <Card>
            <CardContent className="pt-10 pb-10 text-center text-muted-foreground">
              <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">讨论答疑区（演示）</p>
              <p className="text-xs mt-1">教师和学生可在此进行问答交流</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
