"use client"

import { useState, useMemo, useCallback } from "react"
import { useParams } from "next/navigation"
import { notFound } from "next/navigation"

import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  FileText,
  Circle,
  CheckCircle2,
  Download,
  GraduationCap,
  Clock,
  MonitorPlay,
  Lightbulb,
  FolderOpen,
  ClipboardList,
  MessageCircle,
  HelpCircle,
  Wrench,
  Check,
  Upload,
  Database,
  X,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

import { hybridCourses } from "@/lib/mock-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AssessmentCardGroup } from "@/components/shared/AssessmentCardGroup"

/* ---------- types ---------- */

type Phase = "pre-class" | "in-class" | "post-class"

interface SessionSection {
  id: string
  phase: Phase
  phaseLabel: string
  doneCount: number
  totalCount: number
}

interface SessionNode {
  id: number
  title: string
  week: number
  mode: "online" | "offline"
  progress: number
  sections: SessionSection[]
}

/* ---------- mock data: sessions ---------- */

const SESSIONS: SessionNode[] = [
  {
    id: 1, title: "第一周：课程导论与环境搭建", week: 1, mode: "online", progress: 100,
    sections: [
      { id: "1-pre", phase: "pre-class", phaseLabel: "课前", doneCount: 4, totalCount: 4 },
      { id: "1-in", phase: "in-class", phaseLabel: "课中", doneCount: 3, totalCount: 5 },
      { id: "1-post", phase: "post-class", phaseLabel: "课后", doneCount: 1, totalCount: 3 },
    ],
  },
  {
    id: 2, title: "第二周：HTML5与CSS3核心", week: 2, mode: "offline", progress: 85,
    sections: [
      { id: "2-pre", phase: "pre-class", phaseLabel: "课前", doneCount: 4, totalCount: 4 },
      { id: "2-in", phase: "in-class", phaseLabel: "课中", doneCount: 2, totalCount: 5 },
      { id: "2-post", phase: "post-class", phaseLabel: "课后", doneCount: 0, totalCount: 3 },
    ],
  },
  {
    id: 3, title: "第三周：JavaScript基础", week: 3, mode: "online", progress: 65,
    sections: [
      { id: "3-pre", phase: "pre-class", phaseLabel: "课前", doneCount: 2, totalCount: 4 },
      { id: "3-in", phase: "in-class", phaseLabel: "课中", doneCount: 1, totalCount: 5 },
      { id: "3-post", phase: "post-class", phaseLabel: "课后", doneCount: 1, totalCount: 3 },
    ],
  },
  {
    id: 4, title: "第四周：JavaScript进阶", week: 4, mode: "online", progress: 40,
    sections: [
      { id: "4-pre", phase: "pre-class", phaseLabel: "课前", doneCount: 1, totalCount: 4 },
      { id: "4-in", phase: "in-class", phaseLabel: "课中", doneCount: 0, totalCount: 5 },
      { id: "4-post", phase: "post-class", phaseLabel: "课后", doneCount: 0, totalCount: 3 },
    ],
  },
  {
    id: 5, title: "第五周：React框架入门", week: 5, mode: "offline", progress: 20,
    sections: [
      { id: "5-pre", phase: "pre-class", phaseLabel: "课前", doneCount: 0, totalCount: 4 },
      { id: "5-in", phase: "in-class", phaseLabel: "课中", doneCount: 0, totalCount: 5 },
      { id: "5-post", phase: "post-class", phaseLabel: "课后", doneCount: 0, totalCount: 3 },
    ],
  },
]

/* ---------- mock data: phase modules ---------- */

interface QuizQuestion {
  id: string
  type: "single" | "multiple" | "judge" | "essay"
  question: string
  options?: { key: string; text: string }[]
  correctAnswer?: string
  correctText?: string
  score: number
}

interface AttachmentItem {
  name: string
  file: string
}

interface ResourceItem {
  name: string
  type: string
  size: string
}

interface TaskItem {
  name: string
  requirement: string
  source?: "manual" | "scenario"
  scenarioTitle?: string
  attachments?: AttachmentItem[]
}

interface QuestionItem {
  stem: string
  answer: string
  source?: "manual" | "bank"
  bankTitle?: string
}

interface LectureSection {
  name: string
  content: string
  attachments?: AttachmentItem[]
}

interface HomeworkItem {
  requirement: string
  deadline: string
}

interface ExtensionMaterialItem {
  name: string
  type: string
  source: string
}

interface ReportItem {
  name: string
  template: string
  required: boolean
  attachments?: AttachmentItem[]
}

interface PhaseModules {
  prePreview?: { preview: string; attachments: AttachmentItem[] }
  preResources?: { resources: ResourceItem[] }
  preTasks?: { tasks: TaskItem[] }
  preQuizzes?: { quizzes: QuizQuestion[] }
  lecture?: { sections: LectureSection[] }
  inClassTasks?: { tasks: TaskItem[] }
  inClassQuizzes?: { quizzes: QuizQuestion[] }
  classQuestions?: { questions: QuestionItem[] }
  practiceTasks?: { tasks: TaskItem[] }
  homeworks?: { homeworks: HomeworkItem[] }
  extensionMaterials?: { materials: ExtensionMaterialItem[] }
  trainingReports?: { reports: ReportItem[] }
}

const PHASE_MODULES: Record<number, PhaseModules> = {}

for (let s = 1; s <= 5; s++) {
  PHASE_MODULES[s] = {
    prePreview: {
      preview: `### 第${s}周 课前预习\n\n本节预习将帮助你了解本周课程的核心知识体系，为课堂学习做好充分准备。\n\n**预习内容**\n\n1. 观看预习视频（约15分钟），了解整体框架\n2. 阅读配套文档，理解核心概念\n3. 记录疑问，带着问题进入课堂`,
      attachments: [
        { name: `第${s}周 预习导读.pdf`, file: `preview-guide-${s}.pdf` },
        { name: `第${s}周 概念梳理表.pdf`, file: `concept-map-${s}.pdf` },
      ],
    },
    preResources: {
      resources: [
        { name: `第${s}周 课程预习教材.pdf`, type: "PDF", size: `${(2 + s * 0.5).toFixed(1)}MB` },
        { name: "环境配置与工具安装指南", type: "视频", size: "25分钟" },
        { name: "相关技术文档与参考资料", type: "链接", size: "在线文档" },
        { name: `第${s}周 预习课件.pptx`, type: "PPT", size: `${(3 + s * 0.3).toFixed(1)}MB` },
      ],
    },
    preTasks: {
      tasks: [
        {
          name: "环境准备与配置",
          requirement: "按照预习文档中的步骤，完成开发环境的安装和配置。完成后截图保存，作为课前任务完成的凭证。",
          attachments: [
            { name: "环境配置检查清单", file: "env-checklist.pdf" },
            { name: "开发工具安装包", file: "dev-tools.zip" },
          ],
        },
        {
          name: "预习知识自测",
          requirement: "阅读预习材料后，完成以下自测题目，检测自己的预习效果。遇到不明白的概念记录下来。",
          attachments: [
            { name: "自测题目与答案", file: "self-test.pdf" },
          ],
        },
      ],
    },
    preQuizzes: {
      quizzes: [
        { id: `pq${s}-1`, type: "single", question: "HTML5新增的语义化标签不包括以下哪个？", options: [{ key: "A", text: "<header>" }, { key: "B", text: "<nav>" }, { key: "C", text: "<section>" }, { key: "D", text: "<container>" }], correctAnswer: "D", score: 10 },
        { id: `pq${s}-2`, type: "single", question: "CSS中以下哪个属性用于设置盒子模型？", options: [{ key: "A", text: "box-sizing" }, { key: "B", text: "box-model" }, { key: "C", text: "box-shadow" }, { key: "D", text: "box-style" }], correctAnswer: "A", score: 10 },
        { id: `pq${s}-3`, type: "multiple", question: "以下哪些是CSS3的新特性？", options: [{ key: "A", text: "圆角（border-radius）" }, { key: "B", text: "阴影（box-shadow）" }, { key: "C", text: "弹性盒（Flexbox）" }, { key: "D", text: "表格布局（table）" }], correctAnswer: "A,B,C", score: 15 },
        { id: `pq${s}-4`, type: "judge", question: "Flexbox是一维布局模型，适合处理单行或单列的布局。", correctAnswer: "true", score: 5 },
        { id: `pq${s}-5`, type: "essay", question: "请简述Flexbox布局和Grid布局的主要区别及各自适用场景。", correctText: "Flexbox是一维布局模型，适合处理单行或单列的对齐和分布，常用于导航栏、列表、工具栏等场景。Grid是二维布局模型，同时控制行和列，适合页面整体布局、卡片网格等复杂网格场景。两者可以混合使用，在Grid容器内的子元素也可以设为Flex容器。", score: 20 },
      ],
    },
    lecture: {
      sections: [
        {
          name: "知识回顾与导入",
          content: `#### 知识回顾\n\n复习第${s > 1 ? s - 1 : "一"}周的核心知识点，建立与本节课内容的联系。\n\n- 前置知识梳理\n- 常见问题回顾\n- 本节课学习目标说明`,
          attachments: [{ name: "复习资料.pdf", file: "review.pdf" }],
        },
        {
          name: "核心概念讲解",
          content: `#### 核心概念\n\n本节课将深入探讨前端开发的核心技术，帮助同学们建立完整的知识体系。\n\n**重点内容**\n- 理解核心技术的工作原理\n- 掌握常用API和工具的使用方法\n- 学会调试和排查常见问题\n\n**难点解析**\n- 复杂概念通过实例演示加深理解\n- 提供多种解题思路和优化方案`,
          attachments: [{ name: "核心概念PPT.pptx", file: "core-concepts.pptx" }],
        },
        {
          name: "案例演示与总结",
          content: `#### 案例与总结\n\n通过实际案例演示本节知识点的应用，并对本节课内容进行总结。\n\n- 真实项目案例分析\n- 代码演示与讲解\n- 课后练习与思考`,
          attachments: [{ name: "案例源码.zip", file: "demo-source.zip" }],
        },
      ],
    },
    inClassTasks: {
      tasks: [
        { name: "课堂练习一：基础功能实现", requirement: "根据课堂讲授内容，编写代码实现以下功能：\n1. 创建基本的页面结构\n2. 实现核心交互逻辑\n3. 添加样式美化界面\n完成后提交代码截图或文件。" },
        { name: "课堂练习二：进阶挑战", requirement: "在基础功能的基础上，实现以下拓展需求：\n1. 添加数据持久化功能\n2. 实现响应式布局\n3. 优化用户体验\n提交完整的代码文件。" },
      ],
    },
    inClassQuizzes: {
      quizzes: [
        { id: `iq${s}-1`, type: "single", question: "Flexbox中，设置主轴方向为垂直应该使用？", options: [{ key: "A", text: "flex-direction: row" }, { key: "B", text: "flex-direction: column" }, { key: "C", text: "flex-wrap: wrap" }, { key: "D", text: "align-items: center" }], correctAnswer: "B", score: 10 },
        { id: `iq${s}-2`, type: "single", question: "Grid布局中，fr单位的含义是？", options: [{ key: "A", text: "固定像素值" }, { key: "B", text: "百分比" }, { key: "C", text: "按比例分配剩余空间" }, { key: "D", text: "相对em单位" }], correctAnswer: "C", score: 10 },
        { id: `iq${s}-3`, type: "multiple", question: "以下哪些是有效的CSS媒体查询写法？", options: [{ key: "A", text: "@media (max-width: 768px)" }, { key: "B", text: "@media screen and (min-width: 1024px)" }, { key: "C", text: "@media (width > 500px)" }, { key: "D", text: "@media all" }], correctAnswer: "A,B", score: 15 },
        { id: `iq${s}-4`, type: "judge", question: "Flexbox和Grid可以混合使用，在Grid容器内的元素可以同时设为Flex容器。", correctAnswer: "true", score: 5 },
      ],
    },
    classQuestions: {
      questions: [
        { stem: "Flexbox和Grid布局分别适用于什么场景？", answer: "Flexbox适用于一维线性布局（如导航栏、工具栏、列表），强调单行或单列的弹性分配；Grid适用于二维网格布局（如页面整体布局、卡片阵列），同时控制行和列。", source: "manual" },
        { stem: "CSS选择器的优先级是如何计算的？", answer: "CSS优先级按权重叠加计算：!important > 内联样式(1000) > ID选择器(100) > 类/属性/伪类(10) > 元素/伪元素(1)。权重会叠加但不会进位。", source: "manual" },
        { stem: "React 中 useEffect 的依赖数组作用是什么？", answer: "", source: "bank", bankTitle: "React 中 useEffect 的依赖数组作用是什么？" },
      ],
    },
    practiceTasks: {
      tasks: [
        {
          name: "实战项目：仿写网站首页",
          requirement: `使用HTML5语义化标签 + CSS3 Flexbox/Grid搭配，仿写一个网站首页。\n\n**要求：**\n1. 包含顶部搜索栏、主导航、轮播图区域、分类导航、商品列表、底部信息\n2. 适配PC端（>1200px）和移动端（<768px）两种屏幕\n3. 代码结构清晰，添加适当的注释\n\n**提交**：HTML/CSS/JS代码打包为.zip文件上传`,
          source: "manual",
          attachments: [{ name: "项目需求文档", file: "project-requirement.pdf" }],
        },
        {
          name: "企业官网响应式布局实战",
          requirement: "完成一个企业官网的响应式页面开发，包含首页、产品页、关于我们等模块。",
          source: "scenario",
          scenarioTitle: "企业官网响应式布局实战",
        },
      ],
    },
    homeworks: {
      homeworks: [
        { requirement: `**第${s}周 课后作业**\n\n完成以下编程练习，巩固本周所学知识：\n\n1. **基础功能**（60分）：实现核心功能模块\n   - 创建完整的页面结构\n   - 实现数据绑定和事件处理\n   - 添加基本的样式美化\n\n2. **进阶功能**（30分）：\n   - 使用localStorage实现数据持久化\n   - 添加动画和过渡效果\n   - 实现响应式布局\n\n3. **代码规范**（10分）：\n   - 使用语义化HTML标签\n   - CSS遵循BEM命名规范\n   - JavaScript代码模块化\n\n**提交格式**：将代码打包为.zip文件上传\n**截止时间**：2026-07-${10 + s} 23:59`, deadline: `2026-07-${10 + s} 23:59` },
      ],
    },
    extensionMaterials: {
      materials: [
        { name: "MDN Web Docs - 官方技术文档", type: "链接", source: "Mozilla Developer Network" },
        { name: "相关技术书籍推荐（中文版）", type: "PDF", source: "GitHub 开源仓库" },
        { name: "技术博客 - 进阶教程", type: "链接", source: "掘金社区" },
        { name: "CodeWars 编程挑战平台", type: "链接", source: "codewars.com" },
      ],
    },
    trainingReports: {
      reports: [
        {
          name: `第${s}周 实训报告`,
          template: "## 实训目的\n\n## 实训内容\n\n## 实验步骤与代码\n\n## 实验结果截图\n\n## 遇到的问题及解决方案\n\n## 心得体会",
          required: true,
          attachments: [
            { name: "报告封面模板", file: "report-cover.docx" },
            { name: "实验数据样例", file: "sample-data.xlsx" },
          ],
        },
      ],
    },
  }
}

/* ---------- mock data: assessments per session ---------- */

interface AssessmentItem {
  title: string
  count: number
  type: string
}

const SESSION_ASSESSMENTS: Record<number, { preQuizzes: AssessmentItem[]; inClassQuizzes: AssessmentItem[]; homeworks: AssessmentItem[] }> = {}

for (let s = 1; s <= 5; s++) {
  SESSION_ASSESSMENTS[s] = {
    preQuizzes: [
      { title: `第${s}周 课前预习习题库`, count: 15 + s * 2, type: "题库" },
      { title: `第${s}周 课前摸底试卷`, count: 10, type: "试卷" },
    ],
    inClassQuizzes: [
      { title: `第${s}周 课堂随堂测`, count: 5 + s, type: "随堂测" },
      { title: `第${s}周 课堂即时问答`, count: 3 + s, type: "现场问答" },
    ],
    homeworks: [
      { title: `第${s}周 课后编程作业`, count: 3, type: "作业" },
    ],
  }
}

/* ---------- helpers ---------- */

function phaseIcon(phase: Phase) {
  switch (phase) {
    case "pre-class": return <BookOpen className="h-3.5 w-3.5 text-blue-400" />
    case "in-class": return <MonitorPlay className="h-3.5 w-3.5 text-green-400" />
    case "post-class": return <FileText className="h-3.5 w-3.5 text-purple-400" />
  }
}

function phaseColor(phase: Phase) {
  switch (phase) {
    case "pre-class": return { bg: "bg-blue-50", text: "text-blue-600", badge: "border-blue-200 bg-blue-50 text-blue-600" }
    case "in-class": return { bg: "bg-green-50", text: "text-green-600", badge: "border-green-200 bg-green-50 text-green-600" }
    case "post-class": return { bg: "bg-purple-50", text: "text-purple-600", badge: "border-purple-200 bg-purple-50 text-purple-600" }
  }
}

/* ---------- page ---------- */

export default function HybridCourseLearnPage() {
  const params = useParams()
  const courseId = params.id as string

  const course = useMemo(() => hybridCourses.find((c) => c.id === courseId), [courseId])

  if (!course) {
    notFound()
  }

  const [currentSessionId, setCurrentSessionId] = useState<number>(SESSIONS[0]?.id ?? 1)
  const [activePhaseTab, setActivePhaseTab] = useState<Phase>("pre-class")
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [showResources, setShowResources] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const currentSession = SESSIONS.find((s) => s.id === currentSessionId) ?? SESSIONS[0]
  const modules = PHASE_MODULES[currentSessionId] ?? PHASE_MODULES[1]

  const totalProgress = useMemo(() => {
    if (SESSIONS.length === 0) return 0
    return Math.round(SESSIONS.reduce((sum, s) => sum + s.progress, 0) / SESSIONS.length)
  }, [])

  const selectSession = useCallback((sessionId: number) => {
    setCurrentSessionId(sessionId)
  }, [])

  /* ---------- quiz state per session ---------- */
  const [quizState, setQuizState] = useState<Record<string, { answers: Record<string, string>; submitted: boolean; score: number }>>({})

  const handleQuizAnswer = (quizKey: string, qId: string, answer: string) => {
    setQuizState((prev) => ({
      ...prev,
      [quizKey]: {
        ...(prev[quizKey] ?? { answers: {}, submitted: false, score: 0 }),
        answers: { ...(prev[quizKey]?.answers ?? {}), [qId]: answer },
      },
    }))
  }

  const handleQuizSubmit = (quizKey: string, questions: QuizQuestion[]) => {
    const answers = quizState[quizKey]?.answers ?? {}
    let score = 0
    questions.forEach((q) => {
      const ans = answers[q.id]
      if (!ans) return
      if (q.type === "single" || q.type === "judge") {
        if (ans === q.correctAnswer) score += q.score
      } else if (q.type === "multiple") {
        const userSet = new Set(ans.split(",").filter(Boolean))
        const correctSet = new Set((q.correctAnswer ?? "").split(",").filter(Boolean))
        const intersection = [...userSet].filter((k) => correctSet.has(k))
        if (intersection.length === correctSet.size && userSet.size === correctSet.size) score += q.score
        else if (intersection.length > 0) score += Math.floor(q.score * 0.5)
      } else if (q.type === "essay" && ans.trim().length > 5) {
        score += Math.floor(q.score * 0.6)
      }
    })
    setQuizState((prev) => ({
      ...prev,
      [quizKey]: { ...(prev[quizKey] ?? { answers: {}, submitted: false, score: 0 }), submitted: true, score },
    }))
    setCompletedModules((prev) => {
      const next = new Set(prev)
      next.add(quizKey)
      return next
    })
  }

  const handleQuizRetake = (quizKey: string) => {
    setQuizState((prev) => ({
      ...prev,
      [quizKey]: { answers: {}, submitted: false, score: 0 },
    }))
  }

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] overflow-hidden bg-white">
      {/* ---------- left sidebar: session catalog ---------- */}
      <aside className="flex w-[300px] flex-shrink-0 flex-col border-r border-gray-100 bg-white">
        {/* course header */}
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-start gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-green-700 text-xs font-bold text-white">
              课
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold text-gray-800">《{course.name}》</h2>
              <Badge variant="secondary" className="mt-1 bg-green-50 text-green-600 hover:bg-green-50">
                #混合课
              </Badge>
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-gray-400">
            <span>共 {SESSIONS.length} 次课</span>
          </div>
        </div>

        {/* session list */}
        <ScrollArea className="flex-1">
          <div className="py-2">
            {SESSIONS.map((session) => {
              const isCurrent = session.id === currentSessionId

              return (
                <div
                  key={session.id}
                  className={cn(
                    "border-b border-gray-50 last:border-b-0",
                    isCurrent && "bg-blue-50/50"
                  )}
                >
                  <button
                    onClick={() => selectSession(session.id)}
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-gray-50",
                      isCurrent && "hover:bg-blue-50/80"
                    )}
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded bg-green-100 text-green-700 text-[10px] font-semibold flex items-center justify-center">
                      {session.week}
                    </span>
                    <span className={cn("truncate text-sm flex-1", isCurrent ? "font-semibold text-blue-600" : "text-gray-700")}>
                      {session.title}
                    </span>
                    {session.progress === 100 && (
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                    )}
                    <Badge variant={session.mode === "online" ? "default" : "secondary"} className="text-[10px] px-1.5 h-4">
                      {session.mode === "online" ? "线上" : "线下"}
                    </Badge>
                  </button>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </aside>

      {/* ---------- right main area ---------- */}
      <main className="flex flex-1 flex-col overflow-y-auto bg-gray-50/50">
        {/* video / reading placeholder */}
        <div className="relative mx-4 mt-4 rounded-lg bg-slate-900 overflow-hidden flex-shrink-0">
          <div className="flex w-full max-h-[65vh] aspect-video items-center justify-center">
            <div className="text-center">
              <MonitorPlay className="mx-auto h-16 w-16 text-slate-600" />
              <p className="mt-4 text-sm text-slate-400">{
                currentSession?.mode === "online" ? "在线教学内容区域" : "课堂教学内容区域"
              }</p>
              <p className="mt-1 text-xs text-slate-600">{currentSession?.title ?? "请选择课程开始学习"}</p>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <Badge variant="outline" className="border-slate-600 bg-slate-800/80 text-slate-300">
              {currentSession?.mode === "online" ? "线上" : "线下"}
            </Badge>
            <span className="text-xs text-slate-400">第{currentSession?.week}周</span>
          </div>

          {/* 课程资源浮动入口 */}
          <button
            onClick={() => setShowResources((v) => !v)}
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800/80 border border-slate-600 text-slate-300 text-xs hover:bg-slate-700 hover:text-white transition-colors"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            课程资源
          </button>

          {/* 资源浮动面板 */}
          {showResources && (
            <div className="absolute top-12 left-3 w-[320px] max-h-[360px] overflow-y-auto rounded-lg bg-slate-800/95 backdrop-blur-sm border border-slate-600 shadow-lg z-20">
              <div className="px-3 py-2.5 border-b border-slate-700 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <FolderOpen className="h-3.5 w-3.5" />
                  课程资源
                </span>
                <button onClick={() => setShowResources(false)} className="text-slate-500 hover:text-slate-300">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-2 space-y-1.5">
                {[
                  { name: "前端开发环境搭建指南.pdf", type: "PDF", size: "2.3MB" },
                  { name: "HTML5与CSS3权威指南.pdf", type: "PDF", size: "8.5MB" },
                  { name: "ES6标准入门（阮一峰）", type: "链接", size: "在线" },
                  { name: "React 18官方文档（中文版）", type: "链接", size: "在线" },
                  { name: "前端项目实战源码仓库", type: "链接", size: "在线" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-700/50 transition-colors cursor-pointer group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-700 text-slate-400 group-hover:bg-blue-600/50 group-hover:text-blue-300 shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-200 truncate group-hover:text-white transition-colors">{r.name}</p>
                      <p className="text-[10px] text-slate-500">{r.type} · {r.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* phase tabs */}
        <div className="p-6">
          <Tabs value={activePhaseTab} onValueChange={(v) => setActivePhaseTab(v as Phase)} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="pre-class">
                <BookOpen className="mr-1.5 h-4 w-4" />
                课前教学活动
              </TabsTrigger>
              <TabsTrigger value="in-class">
                <MonitorPlay className="mr-1.5 h-4 w-4" />
                课中教学活动
              </TabsTrigger>
              <TabsTrigger value="post-class">
                <FileText className="mr-1.5 h-4 w-4" />
                课后教学活动
              </TabsTrigger>
            </TabsList>

            {/* 课前 */}
            <TabsContent value="pre-class" className="mt-0">
              <div className="space-y-4">
                {/* 课前预习 */}
                {modules.prePreview && (
                  <ModuleCard icon={<BookOpen className="h-4 w-4 text-blue-500" />} title="课前预习" badge="课前" badgeClass={phaseColor("pre-class").badge}>
                    <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{modules.prePreview.preview}</div>
                    {modules.prePreview.attachments && modules.prePreview.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs text-gray-400">预习资料附件</p>
                        {modules.prePreview.attachments.map((att, i) => (
                          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700 truncate">{att.name}</p>
                              <p className="text-xs text-gray-400">{att.file}</p>
                            </div>
                            <Button variant="outline" size="sm" className="shrink-0 gap-1">
                              <Download className="h-3.5 w-3.5" />下载
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ModuleCard>
                )}

                {/* 学习资源 */}
                {modules.preResources && (
                  <ModuleCard icon={<Database className="h-4 w-4 text-cyan-500" />} title="学习资源" badge="课前" badgeClass={phaseColor("pre-class").badge}>
                    <div className="space-y-2">
                      {modules.preResources.resources.map((r, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{r.name}</p>
                            <p className="text-xs text-gray-400">{r.type} · {r.size}</p>
                          </div>
                          <Button variant="outline" size="sm" className="shrink-0 gap-1">
                            <Download className="h-3.5 w-3.5" />下载
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ModuleCard>
                )}

                {/* 课前任务 */}
                {modules.preTasks && (
                  <ModuleCard icon={<ClipboardList className="h-4 w-4 text-orange-500" />} title="课前任务" badge="课前" badgeClass={phaseColor("pre-class").badge}>
                    <div className="space-y-3">
                      {modules.preTasks.tasks.map((t, i) => (
                        <div key={i} className="p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                            <span className="text-sm font-medium text-gray-700">{t.name}</span>
                          </div>
                          <p className="text-xs text-gray-500 ml-7 whitespace-pre-line">{t.requirement}</p>
                          {t.attachments && t.attachments.length > 0 && (
                            <div className="mt-2 ml-7 space-y-1.5">
                              {t.attachments.map((att, j) => (
                                <div key={j} className="flex items-center gap-2 text-xs text-gray-500">
                                  <FileText className="h-3.5 w-3.5 text-blue-400" />
                                  <span className="flex-1 truncate">{att.name}</span>
                                  <span className="text-gray-400">{att.file}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ModuleCard>
                )}

                {/* 课前测验 */}
                {modules.preQuizzes && (
                  <ModuleCard icon={<HelpCircle className="h-4 w-4 text-amber-500" />} title="课前测验" badge="课前" badgeClass={phaseColor("pre-class").badge}>
                    <AssessmentCardGroup
                      items={SESSION_ASSESSMENTS[currentSessionId]?.preQuizzes ?? []}
                      emptyMessage="暂未配置课前测验"
                      onItemClick={() => setDialogOpen(true)}
                    />
                  </ModuleCard>
                )}
              </div>
            </TabsContent>

            {/* 课中 */}
            <TabsContent value="in-class" className="mt-0">
              <div className="space-y-4">
                {/* 课堂讲授 */}
                {modules.lecture && (
                  <ModuleCard icon={<MonitorPlay className="h-4 w-4 text-green-500" />} title="课堂讲授" badge="课中" badgeClass={phaseColor("in-class").badge}>
                    <div className="space-y-4">
                      {modules.lecture.sections.map((section, i) => (
                        <div key={i} className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                            <span className="text-sm font-medium text-gray-700">{section.name}</span>
                          </div>
                          <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed ml-7">{section.content}</div>
                          {section.attachments && section.attachments.length > 0 && (
                            <div className="mt-2 ml-7 space-y-1.5">
                              {section.attachments.map((att, j) => (
                                <div key={j} className="flex items-center gap-2 text-xs text-gray-500">
                                  <FileText className="h-3.5 w-3.5 text-green-400" />
                                  <span className="flex-1 truncate">{att.name}</span>
                                  <span className="text-gray-400">{att.file}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ModuleCard>
                )}

                {/* 课堂任务 */}
                {modules.inClassTasks && (
                  <ModuleCard icon={<ClipboardList className="h-4 w-4 text-orange-500" />} title="课堂任务" badge="课中" badgeClass={phaseColor("in-class").badge}>
                    <div className="space-y-3">
                      {modules.inClassTasks.tasks.map((t, i) => (
                        <div key={i} className="p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                            <span className="text-sm font-medium text-gray-700">{t.name}</span>
                          </div>
                          <p className="text-xs text-gray-500 ml-7 whitespace-pre-line">{t.requirement}</p>
                        </div>
                      ))}
                    </div>
                  </ModuleCard>
                )}

                {/* 随堂测验 */}
                {modules.inClassQuizzes && (
                  <ModuleCard icon={<HelpCircle className="h-4 w-4 text-amber-500" />} title="随堂测验" badge="课中" badgeClass={phaseColor("in-class").badge}>
                    <AssessmentCardGroup
                      items={SESSION_ASSESSMENTS[currentSessionId]?.inClassQuizzes ?? []}
                      emptyMessage="暂未配置随堂测验"
                      onItemClick={() => setDialogOpen(true)}
                    />
                  </ModuleCard>
                )}

                {/* 课堂提问 */}
                {modules.classQuestions && (
                  <ModuleCard icon={<MessageCircle className="h-4 w-4 text-teal-500" />} title="课堂提问" badge="课中" badgeClass={phaseColor("in-class").badge}>
                    <div className="space-y-3">
                      {modules.classQuestions.questions.map((q, i) => (
                        <div key={i} className="p-3 rounded-lg border border-gray-100">
                          {q.source === "bank" ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Database className="h-4 w-4 text-[#1890ff]" />
                                <div>
                                  <p className="text-sm font-medium">{q.bankTitle || q.stem}</p>
                                  <p className="text-xs text-gray-400">来自题库</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start gap-2 mb-2">
                                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-gray-700">{q.stem}</p>
                              </div>
                              <div className="ml-6 p-2 rounded bg-gray-50 border border-gray-100">
                                <p className="text-xs text-gray-500">
                                  <span className="font-medium text-blue-600">参考答案：</span>{q.answer}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </ModuleCard>
                )}

                {/* 实践任务 */}
                {modules.practiceTasks && (
                  <ModuleCard icon={<Wrench className="h-4 w-4 text-pink-500" />} title="实践任务" badge="课中" badgeClass={phaseColor("in-class").badge}>
                    <div className="space-y-3">
                      {modules.practiceTasks.tasks.map((t, i) => (
                        <div key={i} className="p-4 rounded-lg border border-gray-100">
                          {t.source === "scenario" ? (
                            <div className="flex items-start gap-2">
                              <Database className="h-4 w-4 text-[#1890ff] shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">{t.scenarioTitle || t.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">来自实践场景库</p>
                                <p className="text-xs text-gray-500 mt-2">{t.requirement}</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <Wrench className="w-4 h-4 text-pink-500" />
                                <span className="text-sm font-medium text-gray-700">{t.name}</span>
                              </div>
                              <p className="text-xs text-gray-500 whitespace-pre-line ml-6">{t.requirement}</p>
                              {t.attachments && t.attachments.length > 0 && (
                                <div className="mt-2 ml-6 space-y-1.5">
                                  {t.attachments.map((att, j) => (
                                    <div key={j} className="flex items-center gap-2 text-xs text-gray-500">
                                      <FileText className="h-3.5 w-3.5 text-pink-400" />
                                      <span className="flex-1 truncate">{att.name}</span>
                                      <span className="text-gray-400">{att.file}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                          <div className="mt-3 ml-6 flex items-center gap-3">
                            <Button size="sm" variant="outline">
                              <Upload className="w-3.5 h-3.5 mr-1" />提交成果
                            </Button>
                            <span className="text-xs text-gray-400">支持 .zip, .pdf 格式</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ModuleCard>
                )}
              </div>
            </TabsContent>

            {/* 课后 */}
            <TabsContent value="post-class" className="mt-0">
              <div className="space-y-4">
                {/* 课后作业 */}
                {modules.homeworks && (
                  <ModuleCard icon={<FileText className="h-4 w-4 text-purple-500" />} title="课后作业" badge="课后" badgeClass={phaseColor("post-class").badge}>
                    <AssessmentCardGroup
                      items={SESSION_ASSESSMENTS[currentSessionId]?.homeworks ?? []}
                      emptyMessage="暂未配置课后作业"
                      onItemClick={() => setDialogOpen(true)}
                    />
                  </ModuleCard>
                )}

                {/* 拓展资料 */}
                {modules.extensionMaterials && (
                  <ModuleCard icon={<FolderOpen className="h-4 w-4 text-indigo-500" />} title="拓展资料" badge="课后" badgeClass={phaseColor("post-class").badge}>
                    <div className="space-y-2">
                      {modules.extensionMaterials.materials.map((m, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer">
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-indigo-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{m.name}</p>
                            <p className="text-xs text-gray-400">{m.type} · {m.source}</p>
                          </div>
                          <Button variant="outline" size="sm" className="shrink-0 gap-1">
                            <Download className="h-3.5 w-3.5" />查看
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ModuleCard>
                )}

                {/* 实训报告 */}
                {modules.trainingReports && (
                  <ModuleCard icon={<ClipboardList className="h-4 w-4 text-rose-500" />} title="实训报告" badge="课后" badgeClass={phaseColor("post-class").badge}>
                    <div className="space-y-3">
                      {modules.trainingReports.reports.map((r, i) => (
                        <div key={i} className="p-4 rounded-lg border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="w-4 h-4 text-purple-500" />
                              <span className="text-sm font-medium text-gray-700">{r.name}</span>
                              {r.required && <Badge variant="outline" className="text-[10px] border-red-200 text-red-500">必修</Badge>}
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 mb-3">
                            <p className="text-xs text-gray-500 font-medium mb-1">报告模板：</p>
                            <pre className="text-xs text-gray-600 whitespace-pre-line">{r.template}</pre>
                          </div>
                          {r.attachments && r.attachments.length > 0 && (
                            <div className="mb-3 space-y-1.5">
                              <p className="text-xs text-gray-400">报告附件</p>
                              {r.attachments.map((att, j) => (
                                <div key={j} className="flex items-center gap-2 text-xs text-gray-500">
                                  <FileText className="h-3.5 w-3.5 text-purple-400" />
                                  <span className="flex-1 truncate">{att.name}</span>
                                  <span className="text-gray-400">{att.file}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <Button size="sm" variant="outline">
                            <Upload className="w-3.5 h-3.5 mr-1" />提交报告
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ModuleCard>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>提示</DialogTitle>
            <DialogDescription className="text-center py-4 text-base">
              前往测评中心使用
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ---------- sub components ---------- */

function ModuleCard({
  icon, title, badge, badgeClass, children,
}: {
  icon: React.ReactNode
  title: string
  badge: string
  badgeClass: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">{icon}</div>
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="outline" className={`${badgeClass} text-[10px]`}>{badge}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

function QuizWidget({
  quizKey,
  questions,
  quizData,
  onAnswer,
  onSubmit,
  onRetake,
}: {
  quizKey: string
  questions: QuizQuestion[]
  quizData?: { answers: Record<string, string>; submitted: boolean; score: number }
  onAnswer: (qId: string, answer: string) => void
  onSubmit: () => void
  onRetake: () => void
}) {
  const answers = quizData?.answers ?? {}
  const submitted = quizData?.submitted ?? false
  const score = quizData?.score ?? 0
  const totalScore = questions.reduce((s, q) => s + q.score, 0)
  const allAnswered = questions.every((q) => {
    const ans = answers[q.id]?.trim()
    if (!ans) return false
    if (q.type === "multiple") return ans.split(",").filter(Boolean).length > 0
    return true
  })

  const typeLabel = (type: string) => {
    switch (type) {
      case "single": return { text: "单选题", color: "bg-blue-50 text-blue-500" }
      case "multiple": return { text: "多选题", color: "bg-purple-50 text-purple-500" }
      case "judge": return { text: "判断题", color: "bg-orange-50 text-orange-500" }
      case "essay": return { text: "简答题", color: "bg-green-50 text-green-600" }
      default: return { text: type, color: "bg-gray-50 text-gray-500" }
    }
  }

  if (questions.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">暂未配置测验题目</p>
  }

  return (
    <div className="space-y-4">
      {submitted && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
          <span className="text-sm text-blue-700">得分：<strong>{score}</strong> / {totalScore}</span>
          <Button variant="outline" size="sm" onClick={onRetake}>重新作答</Button>
        </div>
      )}

      {questions.map((q, idx) => {
        const tl = typeLabel(q.type)
        return (
          <div key={q.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50/50">
            <div className="flex items-start gap-2 mb-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center mt-0.5">
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium">{q.question}</p>
                <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] ${tl.color}`}>{tl.text}</span>
              </div>
              <span className="text-xs text-gray-400">{q.score}分</span>
            </div>

            {/* single choice */}
            {q.type === "single" && q.options && (
              <div className="space-y-2 ml-7">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.key
                  const isCorrect = opt.key === q.correctAnswer
                  const showCorrect = submitted && isCorrect
                  const showWrong = submitted && isSelected && !isCorrect
                  return (
                    <button key={opt.key} disabled={submitted} onClick={() => onAnswer(q.id, opt.key)}
                      className={`w-full flex items-center gap-2 p-2.5 rounded-md text-left text-sm transition-all ${
                        showCorrect ? "bg-green-50 border border-green-200 text-green-700" :
                        showWrong ? "bg-red-50 border border-red-200 text-red-700" :
                        isSelected ? "bg-blue-50 border border-blue-200 text-blue-700" :
                        "bg-white border border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30"
                      }`}>
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        showCorrect ? "border-green-500 bg-green-500" : showWrong ? "border-red-500 bg-red-500" :
                        isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                      }`}>
                        {(isSelected || showCorrect) && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="flex-1">{opt.key}. {opt.text}</span>
                      {showCorrect && <Check className="h-3.5 w-3.5 text-green-600" />}
                      {showWrong && <Circle className="h-3.5 w-3.5 text-red-600" />}
                    </button>
                  )
                })}
              </div>
            )}

            {/* multiple choice */}
            {q.type === "multiple" && q.options && (() => {
              const selectedKeys = new Set((answers[q.id] ?? "").split(",").filter(Boolean))
              const correctKeys = new Set((q.correctAnswer ?? "").split(",").filter(Boolean))
              return (
                <div className="space-y-2 ml-7">
                  {q.options.map((opt) => {
                    const isSelected = selectedKeys.has(opt.key)
                    const isCorrectOption = correctKeys.has(opt.key)
                    const showCorrect = submitted && isCorrectOption
                    const showWrong = submitted && isSelected && !isCorrectOption
                    return (
                      <button key={opt.key} disabled={submitted}
                        onClick={() => {
                          const next = new Set(selectedKeys)
                          if (next.has(opt.key)) next.delete(opt.key)
                          else next.add(opt.key)
                          onAnswer(q.id, [...next].join(","))
                        }}
                        className={`w-full flex items-center gap-2 p-2.5 rounded-md text-left text-sm transition-all ${
                          showCorrect ? "bg-green-50 border border-green-200 text-green-700" :
                          showWrong ? "bg-red-50 border border-red-200 text-red-700" :
                          isSelected ? "bg-blue-50 border border-blue-200 text-blue-700" :
                          "bg-white border border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30"
                        }`}>
                        <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                          isSelected || showCorrect
                            ? showCorrect ? "border-green-500 bg-green-500" : showWrong ? "border-red-500 bg-red-500" : "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}>
                          {(isSelected || showCorrect) && <Check className="h-3 w-3 text-white" />}
                        </span>
                        <span className="flex-1">{opt.key}. {opt.text}</span>
                        {showCorrect && <Check className="h-3.5 w-3.5 text-green-600" />}
                        {showWrong && <Circle className="h-3.5 w-3.5 text-red-600" />}
                      </button>
                    )
                  })}
                </div>
              )
            })()}

            {/* judge */}
            {q.type === "judge" && (
              <div className="space-y-2 ml-7">
                {[{ key: "true", text: "正确" }, { key: "false", text: "错误" }].map((opt) => {
                  const isSelected = answers[q.id] === opt.key
                  const isCorrect = opt.key === q.correctAnswer
                  const showCorrect = submitted && isCorrect
                  const showWrong = submitted && isSelected && !isCorrect
                  return (
                    <button key={opt.key} disabled={submitted} onClick={() => onAnswer(q.id, opt.key)}
                      className={`w-full flex items-center gap-2 p-2.5 rounded-md text-left text-sm transition-all ${
                        showCorrect ? "bg-green-50 border border-green-200 text-green-700" :
                        showWrong ? "bg-red-50 border border-red-200 text-red-700" :
                        isSelected ? "bg-blue-50 border border-blue-200 text-blue-700" :
                        "bg-white border border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30"
                      }`}>
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        showCorrect ? "border-green-500 bg-green-500" : showWrong ? "border-red-500 bg-red-500" :
                        isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                      }`}>
                        {(isSelected || showCorrect) && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="flex-1">{opt.text}</span>
                      {showCorrect && <Check className="h-3.5 w-3.5 text-green-600" />}
                      {showWrong && <Circle className="h-3.5 w-3.5 text-red-600" />}
                    </button>
                  )
                })}
              </div>
            )}

            {/* essay */}
            {q.type === "essay" && (
              <div className="ml-7">
                {!submitted ? (
                  <textarea value={answers[q.id] ?? ""} onChange={(e) => onAnswer(q.id, e.target.value)}
                    placeholder="请输入你的答案..." rows={3}
                    className="w-full p-3 rounded-md border border-gray-200 bg-white text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-y" />
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 rounded-md bg-white border border-gray-200">
                      <p className="text-xs text-gray-400 mb-1">你的答案：</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{answers[q.id] || "（未作答）"}</p>
                    </div>
                    {q.correctText && (
                      <div className="p-3 rounded-md bg-green-50 border border-green-100">
                        <p className="text-xs text-green-600 mb-1">参考答案：</p>
                        <p className="text-sm text-green-700 whitespace-pre-wrap">{q.correctText}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {!submitted && (
        <div className="flex justify-end">
          <Button onClick={onSubmit} disabled={!allAnswered}>提交答案</Button>
        </div>
      )}
    </div>
  )
}

/* ---------- cn helper ---------- */

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
