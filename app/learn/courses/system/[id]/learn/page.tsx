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
  StickyNote,
  GraduationCap,
  Clock,
  MonitorPlay,
  Send,
  RotateCcw,
  Lightbulb,
  FolderOpen,
  ClipboardList,
  Check,
  X,
  Target,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

import { courses } from "@/lib/mock-data"
import type { KnowledgeGraphNode, KnowledgeGraphEdge } from "@/lib/types"
import KnowledgeGraph from "@/components/KnowledgeGraph"

/* ---------- types ---------- */

type SectionType = "video" | "reading"
type SectionStatus = "done" | "current" | "not_started"
type QuizType = "single" | "multiple" | "judge" | "essay"

interface ChapterQuizQuestion {
  id: string
  type: QuizType
  question: string
  options?: { key: string; text: string }[]
  correctAnswer?: string
  correctText?: string
  score: number
}

interface Section {
  id: string
  title: string
  type: SectionType
  duration: string
  status: SectionStatus
}

interface Chapter {
  id: number
  title: string
  sections: Section[]
}

/* ---------- helpers ---------- */

const DIGITS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]

function toChinese(num: number): string {
  if (num <= 10) return DIGITS[num]
  const ten = Math.floor(num / 10)
  const rest = num % 10
  if (ten === 1) return "十" + (rest ? DIGITS[rest] : "")
  return DIGITS[ten] + "十" + (rest ? DIGITS[rest] : "")
}

function generateChapters(nodeCount: number, courseName: string, completedIds: Set<string>): Chapter[] {
  const chapterTitles = [
    `${courseName}概述`,
    "核心概念与原理",
    "实践操作方法",
    "进阶技巧与策略",
    "案例分析",
    "综合应用",
    "拓展与延伸",
    "项目实战",
    "测试与评估",
    "总结与展望",
    "行业应用",
    "前沿技术",
    "最佳实践",
    "常见问题",
    "能力提升",
  ]

  const sectionTitles = [
    "基础理论讲解",
    "核心知识点解析",
    "操作演示",
    "实战练习",
    "案例研究",
    "进阶应用",
    "技巧分享",
    "难点突破",
    "综合训练",
    "测验与反馈",
  ]

  const chapters: Chapter[] = []
  for (let i = 1; i <= nodeCount; i++) {
    const sectionCount = i % 3 === 0 ? 3 : 2
    const sections: Section[] = []
    for (let j = 1; j <= sectionCount; j++) {
      const type: SectionType = j % 2 === 1 ? "video" : "reading"
      const duration = `${10 + ((i + j) % 5) * 5}分钟`

      let status: SectionStatus = "not_started"
      const sid = `${i}-${j}`
      if (completedIds.has(sid)) {
        status = "done"
      } else if (i === 1) {
        status = "done"
      } else if (i === 2) {
        if (j < sectionCount) status = "done"
        else status = "current"
      } else if (i === 3 && j === 1) {
        status = "current"
      }

      sections.push({
        id: `${i}-${j}`,
        title: `${i}.${j} ${sectionTitles[(i + j) % sectionTitles.length]}`,
        type,
        duration,
        status,
      })
    }

    chapters.push({
      id: i,
      title: `第${toChinese(i)}章 ${chapterTitles[(i - 1) % chapterTitles.length]}`,
      sections,
    })
  }
  return chapters
}

/* ---------- chapter assessment mock data ---------- */

const CHAPTER_QUIZZES: Record<number, ChapterQuizQuestion[]> = {}
for (let c = 1; c <= 15; c++) {
  const idx = c - 1
  CHAPTER_QUIZZES[c] = [
    {
      id: `cq${c}-1`,
      type: "single",
      question: "SQL注入攻击主要利用的是应用程序的哪个薄弱环节？",
      options: [
        { key: "A", text: "网络传输层" },
        { key: "B", text: "用户界面设计" },
        { key: "C", text: "输入验证不充分" },
        { key: "D", text: "服务器硬件配置" },
      ],
      correctAnswer: "C",
      score: 10,
    },
    {
      id: `cq${c}-2`,
      type: "multiple",
      question: "以下哪些属于常见的安全测试工具？",
      options: [
        { key: "A", text: "Burp Suite" },
        { key: "B", text: "SQLMap" },
        { key: "C", text: "Nmap" },
        { key: "D", text: "Microsoft Word" },
      ],
      correctAnswer: "A,B,C",
      score: 15,
    },
    {
      id: `cq${c}-3`,
      type: "judge",
      question: "使用参数化查询可以完全防止所有类型的SQL注入攻击。",
      correctAnswer: "false",
      score: 5,
    },
    {
      id: `cq${c}-4`,
      type: "essay",
      question: "请简述SQL注入的基本原理及三种常见防御措施。",
      correctText: "SQL注入是通过在用户输入中插入恶意SQL代码，利用应用程序未充分验证输入的漏洞，从而操纵数据库执行非预期操作。常见防御措施：1.参数化查询/预编译语句；2.输入验证与过滤；3.最小权限原则。",
      score: 20,
    },
  ]
}

/* ---------- knowledge graph mock data ---------- */

const CHAPTER_KG: Record<number, { nodes: KnowledgeGraphNode[]; edges: KnowledgeGraphEdge[] }> = {
  1: {
    nodes: [
      { id: "kg1-1", label: "数据分析", x: 400, y: 200, type: "core", description: "从数据中提取有用信息的过程" },
      { id: "kg1-2", label: "数据清洗", x: 280, y: 320, type: "related", description: "处理缺失值、异常值和重复数据" },
      { id: "kg1-3", label: "描述性统计", x: 520, y: 320, type: "related", description: "用图表和数值概括数据特征" },
      { id: "kg1-4", label: "数据预处理", x: 400, y: 400, type: "extended", description: "为分析做数据准备工作" },
    ],
    edges: [
      { from: "kg1-1", to: "kg1-2", label: "包含" },
      { from: "kg1-1", to: "kg1-3", label: "应用" },
      { from: "kg1-2", to: "kg1-4", label: "前置" },
    ],
  },
  2: {
    nodes: [
      { id: "kg2-1", label: "假设检验", x: 400, y: 200, type: "core", description: "统计推断的核心方法之一" },
      { id: "kg2-2", label: "P值", x: 280, y: 320, type: "related", description: "衡量统计显著性的关键指标" },
      { id: "kg2-3", label: "T检验", x: 520, y: 320, type: "related", description: "用于小样本均值比较的检验方法" },
      { id: "kg2-4", label: "卡方检验", x: 400, y: 400, type: "extended", description: "用于分类变量独立性检验" },
    ],
    edges: [
      { from: "kg2-1", to: "kg2-2", label: "依赖" },
      { from: "kg2-1", to: "kg2-3", label: "应用" },
      { from: "kg2-1", to: "kg2-4", label: "应用" },
    ],
  },
  3: {
    nodes: [
      { id: "kg3-1", label: "回归分析", x: 400, y: 200, type: "core", description: "探索变量间关系的方法" },
      { id: "kg3-2", label: "线性回归", x: 280, y: 320, type: "related", description: "拟合线性关系预测连续值" },
      { id: "kg3-3", label: "相关系数", x: 520, y: 320, type: "related", description: "衡量变量间线性相关程度" },
    ],
    edges: [
      { from: "kg3-1", to: "kg3-2", label: "包含" },
      { from: "kg3-1", to: "kg3-3", label: "关联" },
    ],
  },
  4: {
    nodes: [
      { id: "kg4-1", label: "数据可视化", x: 400, y: 200, type: "core", description: "将数据转化为图表的过程" },
      { id: "kg4-2", label: "图表设计", x: 280, y: 320, type: "related", description: "选择合适的图表类型呈现数据" },
      { id: "kg4-3", label: "色彩理论", x: 520, y: 320, type: "related", description: "运用色彩提升信息传达效率" },
      { id: "kg4-4", label: "信息可视化", x: 400, y: 400, type: "extended", description: "将复杂数据转化为直观图形" },
    ],
    edges: [
      { from: "kg4-1", to: "kg4-2", label: "包含" },
      { from: "kg4-1", to: "kg4-3", label: "应用" },
      { from: "kg4-2", to: "kg4-4", label: "扩展" },
    ],
  },
}
// fallback for chapters 5-15: use chapter 1-4 kg data cycled
for (let c = 5; c <= 15; c++) {
  const ref = ((c - 1) % 4) + 1
  CHAPTER_KG[c] = {
    nodes: CHAPTER_KG[ref].nodes.map((n) => ({ ...n, id: n.id.replace(/^kg\d/, `kg${c}`) })),
    edges: CHAPTER_KG[ref].edges.map((e) => ({
      ...e,
      from: e.from.replace(/^kg\d/, `kg${c}`),
      to: e.to.replace(/^kg\d/, `kg${c}`),
    })),
  }
}

function getSectionIcon(type: SectionType) {
  switch (type) {
    case "video":
      return <PlayCircle className="h-3.5 w-3.5 text-blue-400" />
    case "reading":
      return <FileText className="h-3.5 w-3.5 text-orange-400" />
  }
}

function getStatusIcon(status: SectionStatus) {
  switch (status) {
    case "done":
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
    case "current":
      return <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
    case "not_started":
      return <Circle className="h-3.5 w-3.5 text-gray-300" />
  }
}

function chapterProgress(chapter: Chapter) {
  const done = chapter.sections.filter((s) => s.status === "done").length
  const total = chapter.sections.length
  return { done, total, percent: Math.round((done / total) * 100) }
}

/* ---------- page ---------- */

export default function CourseLearnPage() {
  const params = useParams()
  const courseId = params.id as string

  const course = useMemo(() => courses.find((c) => String(c.id) === String(courseId)), [courseId])

  if (!course) {
    notFound()
  }

  const [completedSectionIds, setCompletedSectionIds] = useState<Set<string>>(new Set())
  const [showResources, setShowResources] = useState(true)
  const chapters = useMemo(() => generateChapters(course.nodeCount, course.name, completedSectionIds), [course, completedSectionIds])

  const [currentChapterId, setCurrentChapterId] = useState<number>(chapters[0]?.id ?? 1)
  const [currentSectionId, setCurrentSectionId] = useState<string>(chapters[0]?.sections[0]?.id ?? "1-1")
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    () => new Set(chapters.map((c) => c.id))
  )
  // quiz state: sectionId -> { answers: questionId -> answer, submitted: boolean, score: number }
  const [quizState, setQuizState] = useState<Record<number, {
    answers: Record<string, string>
    submitted: boolean
    score: number
  }>>({})

  const currentChapter = chapters.find((c) => c.id === currentChapterId) ?? chapters[0]
  const currentSection = currentChapter?.sections.find((s) => s.id === currentSectionId)

  const totalProgress = useMemo(() => {
    const allSections = chapters.flatMap((c) => c.sections)
    const done = allSections.filter((s) => s.status === "done").length
    return Math.round((done / allSections.length) * 100)
  }, [chapters])

  const toggleExpand = useCallback((chapterId: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev)
      if (next.has(chapterId)) next.delete(chapterId)
      else next.add(chapterId)
      return next
    })
  }, [])

  const selectSection = useCallback(
    (chapterId: number, sectionId: string) => {
      setCurrentChapterId(chapterId)
      setCurrentSectionId(sectionId)
      setExpandedChapters((prev) => {
        const next = new Set(prev)
        next.add(chapterId)
        return next
      })
    },
    []
  )

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] overflow-hidden bg-white">
      {/* ---------- left sidebar: chapter catalog ---------- */}
      <aside className="flex w-[300px] flex-shrink-0 flex-col border-r border-gray-100 bg-white">
        {/* course header */}
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-start gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white">
              课
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold text-gray-800">《{course.name}》</h2>
              <Badge variant="secondary" className="mt-1 bg-purple-50 text-purple-600 hover:bg-purple-50">
                #{course.courseTag ?? "体系课"}
              </Badge>
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-gray-400">
            <span>
              共 {course.nodeCount} 章 · {course.lessonCount} 节
            </span>
            <span className="mx-2">|</span>
            <span>学习进度 {totalProgress}%</span>
          </div>
          <Progress value={totalProgress} className="mt-2 h-1.5 bg-gray-100" />
        </div>

        {/* chapter list */}
        <ScrollArea className="flex-1">
          <div className="py-2">
            {chapters.map((chapter) => {
              const isExpanded = expandedChapters.has(chapter.id)
              const isCurrentChapter = chapter.id === currentChapterId
              const progress = chapterProgress(chapter)

              return (
                <div
                  key={chapter.id}
                  className={cn(
                    "border-b border-gray-50 last:border-b-0",
                    isCurrentChapter && "bg-blue-50/50"
                  )}
                >
                  {/* chapter header */}
                  <button
                    onClick={() => toggleExpand(chapter.id)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50",
                      isCurrentChapter && "hover:bg-blue-50/80"
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <span
                        className={cn(
                          "truncate text-sm",
                          isCurrentChapter ? "font-semibold text-blue-600" : "text-gray-700"
                        )}
                      >
                        {chapter.title}
                      </span>
                      {progress.percent === 100 && (
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    )}
                  </button>

                  {/* progress bar */}
                  <div className="px-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Progress
                          value={progress.percent}
                          className="h-1 bg-gray-100"
                        />
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {progress.done}/{progress.total}
                      </span>
                    </div>
                  </div>

                  {/* sections */}
                  {isExpanded && (
                    <div className="space-y-0.5 pb-2">
                      {chapter.sections.map((section) => {
                        const isActive = section.id === currentSectionId && chapter.id === currentChapterId
                        return (
                          <button
                            key={section.id}
                            onClick={() => selectSection(chapter.id, section.id)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-4 py-2.5 text-left transition-colors",
                              isActive
                                ? "bg-blue-100 text-blue-700"
                                : section.status === "current"
                                  ? "text-blue-600 hover:bg-gray-50"
                                  : section.status === "done"
                                    ? "text-gray-600 hover:bg-gray-50"
                                    : "text-gray-400 hover:bg-gray-50"
                            )}
                          >
                            <span className="flex-shrink-0">{getStatusIcon(section.status)}</span>
                            <span className="flex-shrink-0">{getSectionIcon(section.type)}</span>
                            <span
                              className={cn(
                                "min-w-0 flex-1 truncate text-xs",
                                isActive && "font-semibold"
                              )}
                            >
                              {section.title}
                            </span>
                            <span className="flex-shrink-0 text-[10px] text-gray-300">
                              {section.duration}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </aside>

      {/* ---------- right main area ---------- */}
      <main className="flex flex-1 flex-col overflow-y-auto bg-gray-50/50">
        {/* content area: video / reading */}
        <div className="relative mx-4 mt-4 rounded-lg bg-slate-900 overflow-hidden flex-shrink-0">
          <div className="flex w-full max-h-[65vh] aspect-video items-center justify-center">
            <div className="text-center">
              <MonitorPlay className="mx-auto h-16 w-16 text-slate-600" />
              <p className="mt-4 text-sm text-slate-400">
                {currentSection?.type === "reading" ? "阅读内容区域" : "视频播放区域"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {currentSection?.title ?? "请选择章节开始学习"}
              </p>
            </div>
          </div>
          {currentSection && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <Badge variant="outline" className="border-slate-600 bg-slate-800/80 text-slate-300">
                {currentSection.type === "video" ? "视频" : "阅读"}
              </Badge>
              <span className="text-xs text-slate-400">{currentSection.duration}</span>
            </div>
          )}

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
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-slate-700/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-700 text-slate-400 group-hover:bg-blue-600/50 group-hover:text-blue-300 shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-200 truncate group-hover:text-white transition-colors">
                        {course.name} - 配套资料 {i}.pdf
                      </p>
                      <p className="text-[10px] text-slate-500">
                        PDF · {(2.5 + i * 1.2).toFixed(1)} MB · 2026-04-27
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* tabs content */}
        <div className="p-6">
          <Tabs defaultValue="goals" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="goals">
                <Target className="mr-1.5 h-4 w-4" />
                学习目标
              </TabsTrigger>
              <TabsTrigger value="knowledge">
                <Lightbulb className="mr-1.5 h-4 w-4" />
                关联知识点
              </TabsTrigger>
              <TabsTrigger value="assessment">
                <ClipboardList className="mr-1.5 h-4 w-4" />
                课程测评
              </TabsTrigger>
              <TabsTrigger value="notes">
                <StickyNote className="mr-1.5 h-4 w-4" />
                笔记
              </TabsTrigger>
            </TabsList>

            {/* 学习目标 */}
            <TabsContent value="goals" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#3b82f6]" />
                    学习目标
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
{`## 💡 知识目标

1. 掌握SQL注入漏洞的基本概念与产生原理，理解OWASP Top 10中注入类漏洞的危害评级与防御策略
2. 熟悉常见SQL注入类型（联合查询注入、布尔盲注、时间盲注、报错注入）的技术原理与利用条件
3. 掌握SQLMap、Burp Suite等安全测试工具在SQL注入场景中的应用方法

## 🔧 能力目标

1. 能够独立完成SQL注入漏洞的检测、验证与漏洞利用操作
2. 具备使用参数化查询、输入过滤、WAF配置等方式完成SQL注入漏洞修复的能力
3. 能够撰写规范的渗透测试报告，清晰描述漏洞成因、风险等级与修复建议

## 🎯 素质目标

1. 培养安全第一的开发意识，将安全思维融入软件开发全生命周期
2. 建立严谨的测试方法论与规范化测试流程
3. 提升信息安全领域的专业素养与职业道德意识

---

> 📋 **课程说明**：本体系课共计${course.nodeCount}章${course.lessonCount}课时，通过系统化的知识结构帮助学习者从零基础逐步掌握SQL注入漏洞检测与利用的核心技能，涵盖理论基础、工具实操、靶场演练等关键环节。`}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 关联知识点 - 含知识图谱 */}
            <TabsContent value="knowledge" className="mt-0">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">关联知识点</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {(CHAPTER_KG[currentChapterId]?.nodes ?? []).map((node) => (
                        <span
                          key={node.id}
                          className={`px-3 py-1.5 text-sm rounded-full border cursor-pointer transition-colors ${
                            node.type === "core"
                              ? "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                              : node.type === "related"
                                ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"
                                : "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100"
                          }`}
                        >
                          {node.label}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">知识图谱</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center overflow-x-auto">
                      <KnowledgeGraph
                        nodes={CHAPTER_KG[currentChapterId]?.nodes ?? []}
                        edges={CHAPTER_KG[currentChapterId]?.edges ?? []}
                        width={700}
                        height={450}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 课程测评 */}
            <TabsContent value="assessment" className="mt-0">
              <ChapterQuizPanel
                chapterId={currentChapterId}
                questions={CHAPTER_QUIZZES[currentChapterId] ?? []}
                quizData={quizState[currentChapterId]}
                onAnswer={(qId, answer) => {
                  setQuizState((prev) => ({
                    ...prev,
                    [currentChapterId]: {
                      ...(prev[currentChapterId] ?? { answers: {}, submitted: false, score: 0 }),
                      answers: {
                        ...(prev[currentChapterId]?.answers ?? {}),
                        [qId]: answer,
                      },
                    },
                  }))
                }}
                onSubmit={() => {
                  const qs = CHAPTER_QUIZZES[currentChapterId] ?? []
                  const answers = quizState[currentChapterId]?.answers ?? {}
                  let score = 0
                  qs.forEach((q) => {
                    const ans = answers[q.id]
                    if (!ans) return
                    if (q.type === "single" && ans === q.correctAnswer) {
                      score += q.score
                    } else if (q.type === "multiple") {
                      const userSet = new Set(ans.split(",").filter(Boolean))
                      const correctSet = new Set((q.correctAnswer ?? "").split(",").filter(Boolean))
                      const intersection = [...userSet].filter((k) => correctSet.has(k))
                      if (intersection.length === correctSet.size && userSet.size === correctSet.size) {
                        score += q.score
                      } else if (intersection.length > 0) {
                        score += Math.floor(q.score * 0.5)
                      }
                    } else if (q.type === "judge" && ans === q.correctAnswer) {
                      score += q.score
                    } else if (q.type === "essay" && ans.trim().length > 5) {
                      score += Math.floor(q.score * 0.6)
                    }
                  })
                  setQuizState((prev) => ({
                    ...prev,
                    [currentChapterId]: {
                      ...(prev[currentChapterId] ?? { answers: {}, submitted: false, score: 0 }),
                      submitted: true,
                      score,
                    },
                  }))
                }}
                onRetake={() => {
                  setQuizState((prev) => ({
                    ...prev,
                    [currentChapterId]: { answers: {}, submitted: false, score: 0 },
                  }))
                }}
              />
            </TabsContent>

            {/* 笔记 */}
            <TabsContent value="notes" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">学习笔记</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    className="min-h-[160px] w-full resize-y rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    placeholder="在这里记录你的学习笔记..."
                    defaultValue={""}
                  />
                  <div className="flex justify-end">
                    <Button size="sm">保存笔记</Button>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">历史笔记</p>
                    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                      <p className="text-xs text-gray-400">2026-04-27 14:30</p>
                      <p className="mt-1 text-sm text-gray-600">
                        本章重点掌握了{course.name}的核心概念，需要课后多做练习巩固。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

/* ---------- sub components ---------- */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-700">{value}</span>
    </div>
  )
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  )
}

/* ---------- cn helper (local) ---------- */

/* ---------- quiz panel (per chapter) ---------- */

function ChapterQuizPanel({
  chapterId,
  questions,
  quizData,
  onAnswer,
  onSubmit,
  onRetake,
}: {
  chapterId: number
  questions: ChapterQuizQuestion[]
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
    if (q.type === "multiple") {
      return ans.split(",").filter(Boolean).length > 0
    }
    return true
  })

  const typeLabel = (type: QuizType) => {
    switch (type) {
      case "single": return { text: "单选题", color: "bg-blue-50 text-blue-500" }
      case "multiple": return { text: "多选题", color: "bg-purple-50 text-purple-500" }
      case "judge": return { text: "判断题", color: "bg-orange-50 text-orange-500" }
      case "essay": return { text: "简答题", color: "bg-green-50 text-green-600" }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">第{chapterId}章 课程测评</CardTitle>
            <p className="text-xs text-gray-400 mt-1">
              共 {questions.length} 题 · 满分 {totalScore} 分
            </p>
          </div>
          {submitted && (
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{score}</p>
              <p className="text-xs text-gray-400">得分</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((q, idx) => {
          const tl = typeLabel(q.type)
          return (
            <div key={q.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
              <div className="flex items-start gap-2 mb-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium">{q.question}</p>
                  <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] ${tl.color}`}>
                    {tl.text}
                  </span>
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
                      <button
                        key={opt.key}
                        disabled={submitted}
                        onClick={() => onAnswer(q.id, opt.key)}
                        className={`w-full flex items-center gap-2 p-2.5 rounded-md text-left text-sm transition-all ${
                          showCorrect
                            ? "bg-green-50 border border-green-200 text-green-700"
                            : showWrong
                              ? "bg-red-50 border border-red-200 text-red-700"
                              : isSelected
                                ? "bg-blue-50 border border-blue-200 text-blue-700"
                                : "bg-white border border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          showCorrect
                            ? "border-green-500 bg-green-500"
                            : showWrong
                              ? "border-red-500 bg-red-500"
                              : isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                        }`}>
                          {(isSelected || showCorrect) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                        <span className="flex-1">{opt.key}. {opt.text}</span>
                        {showCorrect && <Check className="h-3.5 w-3.5 text-green-600" />}
                        {showWrong && <X className="h-3.5 w-3.5 text-red-600" />}
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
                        <button
                          key={opt.key}
                          disabled={submitted}
                          onClick={() => {
                            const next = new Set(selectedKeys)
                            if (next.has(opt.key)) next.delete(opt.key)
                            else next.add(opt.key)
                            onAnswer(q.id, [...next].join(","))
                          }}
                          className={`w-full flex items-center gap-2 p-2.5 rounded-md text-left text-sm transition-all ${
                            showCorrect
                              ? "bg-green-50 border border-green-200 text-green-700"
                              : showWrong
                                ? "bg-red-50 border border-red-200 text-red-700"
                                : isSelected
                                  ? "bg-blue-50 border border-blue-200 text-blue-700"
                                  : "bg-white border border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30"
                          }`}
                        >
                          <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                            isSelected || showCorrect
                              ? showCorrect
                                ? "border-green-500 bg-green-500"
                                : showWrong
                                  ? "border-red-500 bg-red-500"
                                  : "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}>
                            {(isSelected || showCorrect) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </span>
                          <span className="flex-1">{opt.key}. {opt.text}</span>
                          {showCorrect && <Check className="h-3.5 w-3.5 text-green-600" />}
                          {showWrong && <X className="h-3.5 w-3.5 text-red-600" />}
                        </button>
                      )
                    })}
                  </div>
                )
              })()}

              {/* judge */}
              {q.type === "judge" && (
                <div className="space-y-2 ml-7">
                  {[
                    { key: "true", text: "正确" },
                    { key: "false", text: "错误" },
                  ].map((opt) => {
                    const isSelected = answers[q.id] === opt.key
                    const isCorrect = opt.key === q.correctAnswer
                    const showCorrect = submitted && isCorrect
                    const showWrong = submitted && isSelected && !isCorrect
                    return (
                      <button
                        key={opt.key}
                        disabled={submitted}
                        onClick={() => onAnswer(q.id, opt.key)}
                        className={`w-full flex items-center gap-2 p-2.5 rounded-md text-left text-sm transition-all ${
                          showCorrect
                            ? "bg-green-50 border border-green-200 text-green-700"
                            : showWrong
                              ? "bg-red-50 border border-red-200 text-red-700"
                              : isSelected
                                ? "bg-blue-50 border border-blue-200 text-blue-700"
                                : "bg-white border border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          showCorrect
                            ? "border-green-500 bg-green-500"
                            : showWrong
                              ? "border-red-500 bg-red-500"
                              : isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                        }`}>
                          {(isSelected || showCorrect) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {showCorrect && <Check className="h-3.5 w-3.5 text-green-600" />}
                        {showWrong && <X className="h-3.5 w-3.5 text-red-600" />}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* essay */}
              {q.type === "essay" && (
                <div className="ml-7">
                  {!submitted ? (
                    <textarea
                      value={answers[q.id] ?? ""}
                      onChange={(e) => onAnswer(q.id, e.target.value)}
                      placeholder="请输入你的答案..."
                      rows={3}
                      className="w-full p-3 rounded-md border border-gray-200 bg-white text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-y"
                    />
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

        <div className="mt-5 flex items-center justify-between">
          {!submitted ? (
            <Button onClick={onSubmit} disabled={!allAnswered} className="gap-1.5">
              <Send className="h-4 w-4" />
              提交答案
            </Button>
          ) : (
            <Button variant="outline" onClick={onRetake} className="gap-1.5">
              <RotateCcw className="h-4 w-4" />
              重新作答
            </Button>
          )}
          {submitted && (
            <p className="text-sm text-gray-500">
              得分：<span className="font-bold text-blue-600">{score}</span> / {totalScore}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
