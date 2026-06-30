"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useParams, notFound } from "next/navigation"

import {
  PlayCircle,
  FileText,
  Circle,
  CheckCircle2,
  StickyNote,
  MonitorPlay,
  Lightbulb,
  ClipboardList,
  Target,
  FolderOpen,
  X,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

import { courses } from "@/lib/mock-data"
import KnowledgeGraphTab from "@/components/KnowledgeGraphTab"

/* ---------- types ---------- */

type SectionType = "video" | "reading"
type SectionStatus = "done" | "current" | "not_started"

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

/* ---------- mock data ---------- */

function generateSections(): Chapter[] {
  return [{
    id: 1,
    title: "API未授权访问漏洞检测与利用",
    sections: [
      { id: "1-1", title: "漏洞原理讲解", type: "video" as SectionType, duration: "25分钟", status: "done" as SectionStatus },
      { id: "1-2", title: "工具实操演示", type: "video" as SectionType, duration: "20分钟", status: "current" as SectionStatus },
      { id: "1-3", title: "安全测试规范文档", type: "reading" as SectionType, duration: "15分钟", status: "not_started" as SectionStatus },
      { id: "1-4", title: "靶场实战演练", type: "video" as SectionType, duration: "30分钟", status: "not_started" as SectionStatus },
    ],
  }]
}

const QUIZ_LISTING = [
  { title: "API安全基础题库", count: 25, type: "题库" },
  { title: "IDOR漏洞专项测验", count: 10, type: "试卷" },
  { title: "Burp Suite实操作业", count: 3, type: "作业" },
  { title: "API安全在线评审", count: 4, type: "在线评审" },
  { title: "渗透测试成果评价", count: 6, type: "成果评价" },
]

/* ---------- helpers ---------- */

function getSectionIcon(type: SectionType) {
  switch (type) {
    case "video": return <PlayCircle className="h-3.5 w-3.5 text-blue-400" />
    case "reading": return <FileText className="h-3.5 w-3.5 text-orange-400" />
  }
}

function getStatusIcon(status: SectionStatus) {
  switch (status) {
    case "done": return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
    case "current": return <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
    case "not_started": return <Circle className="h-3.5 w-3.5 text-gray-300" />
  }
}

/* ---------- page ---------- */

export default function GranularCourseLearnPage() {
  const params = useParams()
  const courseId = params.id as string

  const course = useMemo(() => courses.find((c) => String(c.id) === String(courseId)), [courseId])
  if (!course) notFound()

  const chapters = useMemo(() => generateSections(), [])
  const [currentSectionId, setCurrentSectionId] = useState<string>(chapters[0]?.sections[1]?.id ?? "1-2")
  const [showResources, setShowResources] = useState(true)

  const chapter = chapters[0]
  const currentSection = chapter?.sections.find((s) => s.id === currentSectionId)

  const totalProgress = useMemo(() => {
    const allSections = chapters.flatMap((c) => c.sections)
    const done = allSections.filter((s) => s.status === "done").length
    return Math.round((done / allSections.length) * 100)
  }, [chapters])

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] overflow-hidden bg-white">
      <main className="flex flex-1 flex-col overflow-y-auto">
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3 bg-white">
          <Link
            href={`/learn/courses/granular/${courseId}`}
            className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#2563eb] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            返回课程详情
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-purple-50 text-purple-600 hover:bg-purple-50 text-xs">
              {course.courseTag ?? "颗粒课"}
            </Badge>
            <span className="text-sm font-semibold text-gray-700 truncate max-w-[400px]">{course.name}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>进度 {totalProgress}%</span>
            <Progress value={totalProgress} className="h-1.5 w-24 bg-gray-100" />
          </div>
        </div>

        {/* section nav bar */}
        <div className="flex items-center gap-1 border-b border-gray-100 bg-white px-4 overflow-x-auto">
          {chapter.sections.map((section) => {
            const isActive = section.id === currentSectionId
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSectionId(section.id)}
                className={`flex items-center gap-1.5 shrink-0 px-3 py-2.5 text-xs transition-colors border-b-2 -mb-px ${
                  isActive
                    ? "border-[#3b82f6] text-[#3b82f6] font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {getStatusIcon(section.status)}
                {getSectionIcon(section.type)}
                <span className="truncate max-w-[160px]">{section.title}</span>
                <span className="text-[10px] text-gray-300">{section.duration}</span>
              </button>
            )
          })}
        </div>

        {/* video / reading area */}
        <div className="relative mx-6 mt-4 rounded-lg bg-slate-900 overflow-hidden flex-shrink-0">
          <div className="flex w-full max-h-[55vh] aspect-video items-center justify-center">
            <div className="text-center">
              <MonitorPlay className="mx-auto h-16 w-16 text-slate-600" />
              <p className="mt-4 text-sm text-slate-400">
                {currentSection?.type === "reading" ? "阅读内容区域" : "视频播放区域"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {currentSection?.title ?? "请选择小节开始学习"}
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
                {[
                  { name: "API安全测试课件.pptx", type: "PPT", size: "3.2MB" },
                  { name: "漏洞检测实战手册.pdf", type: "PDF", size: "5.8MB" },
                  { name: "安全测试教学视频（共3集）", type: "视频", size: "1.2GB" },
                  { name: "OWASP Top10参考链接", type: "链接", size: "在线" },
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

1. 理解API未授权访问漏洞的产生原理，掌握水平越权（IDOR）与垂直越权两类核心攻击模式的区别与关联
2. 熟悉RESTful API的安全设计规范，了解OWASP API Security Top 10中的关键风险项（BOLA、BFLA、过量数据暴露等）
3. 掌握JWT Token、OAuth 2.0等现代API认证授权机制的工作原理与常见配置缺陷

## 🔧 能力目标

1. 能够使用 Burp Suite、Postman 等工具对目标 API 进行安全测试，识别未授权访问漏洞
2. 具备编写清晰的 API 安全测试报告的能力，能够准确描述漏洞成因、风险等级与修复建议
3. 能够根据业务场景设计合理的 API 访问控制策略（RBAC/ABAC），并进行安全加固

## 🎯 素质目标

1. 培养安全第一的开发意识，将安全设计融入 API 开发全生命周期
2. 建立严谨的测试思维与规范化测试流程，养成"先验证权限，再处理请求"的编码习惯

---

> 📋 **课程说明**：本颗粒课聚焦 API 未授权访问这一具体安全场景，通过理论讲解 + 工具实操 + 靶场演练结合的方式，帮助学习者在${course.lessonCount}个课时内快速掌握核心技能。`}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 关联知识点 - 知识图谱 */}
            <TabsContent value="knowledge" className="mt-0">
              <KnowledgeGraphTab course={course} showSidebar={false} />
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
                      <p className="text-xs text-gray-400">2026-04-23 10:15</p>
                      <p className="mt-1 text-sm text-gray-600">
                        重点理解IDOR漏洞的检测方法，使用Burp Suite进行实操练习效果很好。
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
