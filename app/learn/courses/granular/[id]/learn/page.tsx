"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useParams, notFound } from "next/navigation"

import {
  BookOpen,
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
  ClipboardList,
  Check,
  X,
  Target,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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

const CHAPTER_QUIZZES: ChapterQuizQuestion[] = [
  {
    id: "q1",
    type: "single",
    question: "API未授权访问漏洞（IDOR）的核心成因是什么？",
    options: [
      { key: "A", text: "网络防火墙配置不当" },
      { key: "B", text: "服务端未验证请求者对目标资源的访问权限" },
      { key: "C", text: "数据库密码过于简单" },
      { key: "D", text: "HTTPS证书未正确配置" },
    ],
    correctAnswer: "B",
    score: 10,
  },
  {
    id: "q2",
    type: "multiple",
    question: "以下哪些属于API安全测试的常用工具？",
    options: [
      { key: "A", text: "Burp Suite" },
      { key: "B", text: "Postman" },
      { key: "C", text: "OWASP ZAP" },
      { key: "D", text: "Microsoft Excel" },
    ],
    correctAnswer: "A,B,C",
    score: 15,
  },
  {
    id: "q3",
    type: "judge",
    question: "使用JWT Token认证后就不需要再做接口级别的权限校验。",
    correctAnswer: "false",
    score: 5,
  },
  {
    id: "q4",
    type: "essay",
    question: "请简述水平越权（IDOR）与垂直越权的区别，并各举一个实例。",
    correctText: "水平越权（IDOR）：同一权限级别的用户访问了其他用户的数据，如用户A通过修改URL中的userId参数查看用户B的订单信息。\n\n垂直越权：低权限用户执行了高权限用户才能进行的操作，如普通用户通过API调用了管理员才能使用的删除用户接口。\n\n防御措施：后端必须对每个API请求进行权限校验，不依赖前端隐藏按钮等方式。",
    score: 20,
  },
]

const CHAPTER_KG: { nodes: KnowledgeGraphNode[]; edges: KnowledgeGraphEdge[] } = {
  nodes: [
    { id: "kg1-1", label: "API安全", x: 400, y: 200, type: "core", description: "保护API免受攻击的安全实践" },
    { id: "kg1-2", label: "IDOR漏洞", x: 250, y: 320, type: "related", description: "不安全的直接对象引用漏洞" },
    { id: "kg1-3", label: "权限校验", x: 550, y: 320, type: "related", description: "验证用户对资源的访问权限" },
    { id: "kg1-4", label: "JWT Token", x: 150, y: 420, type: "extended", description: "JSON Web Token认证机制" },
    { id: "kg1-5", label: "OWASP Top10", x: 400, y: 420, type: "extended", description: "十大Web应用安全风险" },
    { id: "kg1-6", label: "RBAC模型", x: 600, y: 420, type: "extended", description: "基于角色的访问控制" },
  ],
  edges: [
    { from: "kg1-1", to: "kg1-2", label: "包含" },
    { from: "kg1-1", to: "kg1-3", label: "核心" },
    { from: "kg1-2", to: "kg1-4", label: "关联" },
    { from: "kg1-1", to: "kg1-5", label: "参考" },
    { from: "kg1-3", to: "kg1-6", label: "实现" },
  ],
}

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

  const chapter = chapters[0]
  const currentSection = chapter?.sections.find((s) => s.id === currentSectionId)

  const [quizState, setQuizState] = useState<{
    answers: Record<string, string>
    submitted: boolean
    score: number
  }>({ answers: {}, submitted: false, score: 0 })

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
        </div>

        {/* tabs content */}
        <div className="p-6">
          <Tabs defaultValue="intro" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="intro">
                <GraduationCap className="mr-1.5 h-4 w-4" />
                章节介绍
              </TabsTrigger>
              <TabsTrigger value="materials">
                <Download className="mr-1.5 h-4 w-4" />
                课程资源
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

            {/* 章节介绍 */}
            <TabsContent value="intro" className="mt-0">
              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">课程信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <InfoRow label="课程名称" value={course.name} />
                      <InfoRow label="课程类型" value={course.category} />
                      <InfoRow label="授课教师" value={course.teacher} />
                      <InfoRow label="所属行业" value={course.industry} />
                      <InfoRow label="适用专业" value={course.major} />
                      <InfoRow label="课时安排" value={`${course.lessonCount} 课时`} />
                    </div>
                    <Separator />
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <Target className="h-4 w-4 text-[#3b82f6]" />学习目标
                      </h4>
                      <p className="text-sm leading-relaxed text-gray-600">
                        本颗粒课聚焦API未授权访问漏洞的检测与利用，通过理论学习、工具实操和靶场演练，帮助学习者在大约1个课时内掌握核心技能。已有 {course.studyCount.toLocaleString()} 人参与学习。
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">学习数据</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <StatItem icon={<BookOpen className="h-4 w-4 text-blue-500" />} label="课程节点" value={`${course.nodeCount} 个`} />
                    <StatItem icon={<Clock className="h-4 w-4 text-orange-500" />} label="课时数" value={`${course.lessonCount} 课时`} />
                    <StatItem icon={<Download className="h-4 w-4 text-green-500" />} label="资源数" value={`${course.resourceCount} 个`} />
                    <Separator />
                    <StatItem icon={<GraduationCap className="h-4 w-4 text-purple-500" />} label="学习人数" value={course.studyCount.toLocaleString()} />
                    <StatItem icon={<MonitorPlay className="h-4 w-4 text-pink-500" />} label="浏览次数" value={course.viewCount.toLocaleString()} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 课程资源 */}
            <TabsContent value="materials" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">课程资料</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "API安全测试课件.pptx", type: "PPT", size: "3.2MB" },
                    { name: "漏洞检测实战手册.pdf", type: "PDF", size: "5.8MB" },
                    { name: "安全测试教学视频（共3集）", type: "视频", size: "1.2GB" },
                    { name: "OWASP Top10参考链接", type: "链接", size: "在线" },
                  ].map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.type} · {r.size}</p>
                      </div>
                      <Button variant="outline" size="sm" className="flex-shrink-0 gap-1">
                        <Download className="h-3.5 w-3.5" />
                        下载
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 关联知识点 */}
            <TabsContent value="knowledge" className="mt-0">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">关联知识点</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {CHAPTER_KG.nodes.map((node) => (
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
                        nodes={CHAPTER_KG.nodes}
                        edges={CHAPTER_KG.edges}
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
                questions={CHAPTER_QUIZZES}
                quizData={quizState}
                onAnswer={(qId, answer) => {
                  setQuizState((prev) => ({
                    ...prev,
                    answers: { ...prev.answers, [qId]: answer },
                  }))
                }}
                onSubmit={() => {
                  let score = 0
                  CHAPTER_QUIZZES.forEach((q) => {
                    const ans = quizState.answers[q.id]
                    if (!ans) return
                    if (q.type === "single" && ans === q.correctAnswer) score += q.score
                    else if (q.type === "multiple") {
                      const userSet = new Set(ans.split(",").filter(Boolean))
                      const correctSet = new Set((q.correctAnswer ?? "").split(",").filter(Boolean))
                      const intersection = [...userSet].filter((k) => correctSet.has(k))
                      if (intersection.length === correctSet.size && userSet.size === correctSet.size)
                        score += q.score
                      else if (intersection.length > 0)
                        score += Math.floor(q.score * 0.5)
                    }
                    else if (q.type === "judge" && ans === q.correctAnswer) score += q.score
                    else if (q.type === "essay" && ans.trim().length > 5) score += Math.floor(q.score * 0.6)
                  })
                  setQuizState((prev) => ({ ...prev, submitted: true, score }))
                }}
                onRetake={() => {
                  setQuizState({ answers: {}, submitted: false, score: 0 })
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

/* ---------- quiz panel ---------- */

function ChapterQuizPanel({
  questions,
  quizData,
  onAnswer,
  onSubmit,
  onRetake,
}: {
  questions: ChapterQuizQuestion[]
  quizData: { answers: Record<string, string>; submitted: boolean; score: number }
  onAnswer: (qId: string, answer: string) => void
  onSubmit: () => void
  onRetake: () => void
}) {
  const { answers, submitted, score } = quizData
  const totalScore = questions.reduce((s, q) => s + q.score, 0)
  const allAnswered = questions.every((q) => {
    const ans = answers[q.id]?.trim()
    if (!ans) return false
    if (q.type === "multiple") return ans.split(",").filter(Boolean).length > 0
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
            <CardTitle className="text-base">课程测评</CardTitle>
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
                          showCorrect ? "border-green-500 bg-green-500" :
                          showWrong ? "border-red-500 bg-red-500" :
                          isSelected ? "border-blue-500 bg-blue-500" :
                          "border-gray-300"
                        }`}>
                          {(isSelected || showCorrect) && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="flex-1">{opt.key}. {opt.text}</span>
                        {showCorrect && <Check className="h-3.5 w-3.5 text-green-600" />}
                        {showWrong && <X className="h-3.5 w-3.5 text-red-600" />}
                      </button>
                    )
                  })}
                </div>
              )}

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
                            showCorrect ? "bg-green-50 border border-green-200 text-green-700" :
                            showWrong ? "bg-red-50 border border-red-200 text-red-700" :
                            isSelected ? "bg-blue-50 border border-blue-200 text-blue-700" :
                            "bg-white border border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30"
                          }`}
                        >
                          <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                            isSelected || showCorrect ? (showCorrect ? "border-green-500 bg-green-500" : showWrong ? "border-red-500 bg-red-500" : "border-blue-500 bg-blue-500") : "border-gray-300"
                          }`}>
                            {(isSelected || showCorrect) && <Check className="h-3 w-3 text-white" />}
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

              {q.type === "judge" && (
                <div className="space-y-2 ml-7">
                  {[{ key: "true", text: "正确" }, { key: "false", text: "错误" }].map((opt) => {
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
                          showCorrect ? "bg-green-50 border border-green-200 text-green-700" :
                          showWrong ? "bg-red-50 border border-red-200 text-red-700" :
                          isSelected ? "bg-blue-50 border border-blue-200 text-blue-700" :
                          "bg-white border border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          showCorrect ? "border-green-500 bg-green-500" :
                          showWrong ? "border-red-500 bg-red-500" :
                          isSelected ? "border-blue-500 bg-blue-500" :
                          "border-gray-300"
                        }`}>
                          {(isSelected || showCorrect) && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {showCorrect && <Check className="h-3.5 w-3.5 text-green-600" />}
                        {showWrong && <X className="h-3.5 w-3.5 text-red-600" />}
                      </button>
                    )
                  })}
                </div>
              )}

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
