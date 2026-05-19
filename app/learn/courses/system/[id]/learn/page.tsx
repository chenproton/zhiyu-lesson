"use client"

import { useState, useMemo, useCallback } from "react"
import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import Link from "next/link"

import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  FileText,
  Circle,
  CheckCircle2,
  ArrowLeft,
  Download,
  StickyNote,
  GraduationCap,
  Clock,
  MonitorPlay,
  HelpCircle,
  Send,
  RotateCcw,
  Lightbulb,
  FolderOpen,
  ClipboardList,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

import { courses } from "@/lib/mock-data"

/* ---------- types ---------- */

type SectionType = "video" | "reading" | "quiz"
type SectionStatus = "done" | "current" | "not_started"
type QuizType = "single" | "essay"

interface QuizQuestion {
  id: string
  type: QuizType
  question: string
  options?: string[]
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
  questions?: QuizQuestion[]
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

  const quizQuestionsPool: QuizQuestion[] = [
    {
      id: "q1",
      type: "single",
      question: "下列哪种方法可以有效防御SQL注入攻击？",
      options: ["A. 使用明文存储密码", "B. 对用户输入进行参数化查询", "C. 关闭数据库日志", "D. 使用HTTP协议传输数据"],
      correctAnswer: "B",
      score: 10,
    },
    {
      id: "q2",
      type: "single",
      question: "SQL注入攻击主要利用的是应用程序的哪个薄弱环节？",
      options: ["A. 网络传输层", "B. 用户界面设计", "C. 输入验证不充分", "D. 服务器硬件配置"],
      correctAnswer: "C",
      score: 10,
    },
    {
      id: "q3",
      type: "essay",
      question: "请简述SQL注入的基本原理及三种常见防御措施。",
      correctText: "SQL注入是通过在用户输入中插入恶意SQL代码，利用应用程序未充分验证输入的漏洞，从而操纵数据库执行非预期操作。常见防御措施：1.参数化查询/预编译语句；2.输入验证与过滤；3.最小权限原则。",
      score: 20,
    },
    {
      id: "q4",
      type: "single",
      question: "在假设检验中，P值代表什么含义？",
      options: ["A. 备择假设为真的概率", "B. 在原假设为真时观察到当前结果的概率", "C. 第一类错误的概率", "D. 检验统计量的标准差"],
      correctAnswer: "B",
      score: 10,
    },
    {
      id: "q5",
      type: "essay",
      question: "请说明T检验和Z检验的适用场景及主要区别。",
      correctText: "T检验适用于小样本(n<30)或总体方差未知的情况，Z检验适用于大样本或总体方差已知的情况。主要区别在于：T检验使用t分布，Z检验使用正态分布；T检验对样本量更敏感。",
      score: 20,
    },
    {
      id: "q6",
      type: "single",
      question: "API未授权访问漏洞的核心风险是什么？",
      options: ["A. 导致网页加载缓慢", "B. 未验证用户身份即暴露敏感接口", "C. 影响前端界面美观", "D. 增加服务器CPU负载"],
      correctAnswer: "B",
      score: 10,
    },
  ]

  const chapters: Chapter[] = []
  for (let i = 1; i <= nodeCount; i++) {
    const sectionCount = i % 3 === 0 ? 3 : 2
    const sections: Section[] = []
    for (let j = 1; j <= sectionCount; j++) {
      const isLast = j === sectionCount
      const type: SectionType = isLast ? "quiz" : j % 2 === 1 ? "video" : "reading"
      const duration = isLast ? "10分钟" : `${10 + ((i + j) % 5) * 5}分钟`

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

      const section: Section = {
        id: `${i}-${j}`,
        title: `${i}.${j} ${sectionTitles[(i + j) % sectionTitles.length]}`,
        type,
        duration,
        status,
      }
      if (type === "quiz") {
        const qIdx = (i + j) % quizQuestionsPool.length
        section.questions = [
          quizQuestionsPool[qIdx],
          quizQuestionsPool[(qIdx + 1) % quizQuestionsPool.length],
          quizQuestionsPool[(qIdx + 2) % quizQuestionsPool.length],
        ]
      }
      sections.push(section)
    }

    chapters.push({
      id: i,
      title: `第${toChinese(i)}章 ${chapterTitles[(i - 1) % chapterTitles.length]}`,
      sections,
    })
  }
  return chapters
}

function getSectionIcon(type: SectionType) {
  switch (type) {
    case "video":
      return <PlayCircle className="h-3.5 w-3.5 text-blue-400" />
    case "reading":
      return <FileText className="h-3.5 w-3.5 text-orange-400" />
    case "quiz":
      return <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
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
  const chapters = useMemo(() => generateChapters(course.nodeCount, course.name, completedSectionIds), [course, completedSectionIds])

  const [currentChapterId, setCurrentChapterId] = useState<number>(chapters[0]?.id ?? 1)
  const [currentSectionId, setCurrentSectionId] = useState<string>(chapters[0]?.sections[0]?.id ?? "1-1")
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    () => new Set(chapters.map((c) => c.id))
  )
  // quiz state: sectionId -> { answers: questionId -> answer, submitted: boolean, score: number }
  const [quizState, setQuizState] = useState<Record<string, {
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
      <main className="flex flex-1 flex-col overflow-hidden bg-gray-50/50">
        {/* content area: video / reading / quiz */}
        {currentSection?.type === "quiz" ? (
          <QuizPanel
            section={currentSection}
            quizData={quizState[currentSection.id]}
            onAnswer={(qId, answer) => {
              setQuizState((prev) => ({
                ...prev,
                [currentSection.id]: {
                  ...(prev[currentSection.id] ?? { answers: {}, submitted: false, score: 0 }),
                  answers: {
                    ...(prev[currentSection.id]?.answers ?? {}),
                    [qId]: answer,
                  },
                },
              }))
            }}
            onSubmit={() => {
              const qs = currentSection.questions ?? []
              const answers = quizState[currentSection.id]?.answers ?? {}
              let score = 0
              qs.forEach((q) => {
                const ans = answers[q.id]
                if (!ans) return
                if (q.type === "single" && ans === q.correctAnswer) {
                  score += q.score
                } else if (q.type === "essay" && ans.trim().length > 5) {
                  score += Math.floor(q.score * 0.6)
                }
              })
              setQuizState((prev) => ({
                ...prev,
                [currentSection.id]: {
                  ...(prev[currentSection.id] ?? { answers: {}, submitted: false, score: 0 }),
                  submitted: true,
                  score,
                },
              }))
              // mark section as completed
              setCompletedSectionIds((prev) => {
                const next = new Set(prev)
                next.add(currentSection.id)
                return next
              })
            }}
            onRetake={() => {
              setQuizState((prev) => ({
                ...prev,
                [currentSection.id]: { answers: {}, submitted: false, score: 0 },
              }))
            }}
          />
        ) : (
          <div className="relative flex-shrink-0 bg-slate-900">
            <div className="flex aspect-video items-center justify-center">
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
                  {currentSection.type === "video"
                    ? "视频"
                    : currentSection.type === "reading"
                      ? "阅读"
                      : "测验"}
                </Badge>
                <span className="text-xs text-slate-400">{currentSection.duration}</span>
              </div>
            )}
          </div>
        )}

        {/* tabs content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="intro" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="intro">
                <GraduationCap className="mr-1.5 h-4 w-4" />
                章节介绍
              </TabsTrigger>
              <TabsTrigger value="materials">
                <Download className="mr-1.5 h-4 w-4" />
                资料下载
              </TabsTrigger>
              <TabsTrigger value="knowledge">
                <Lightbulb className="mr-1.5 h-4 w-4" />
                知识点
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
                    <CardTitle className="text-base">章节信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <InfoRow label="课程名称" value={course.name} />
                      <InfoRow label="当前章节" value={currentChapter?.title || "-"} />
                      <InfoRow label="当前小节" value={currentSection?.title || "-"} />
                      <InfoRow label="课程类型" value={course.category} />
                      <InfoRow label="授课教师" value={course.teacher} />
                      <InfoRow label="所属行业" value={course.industry} />
                    </div>
                    <Separator />
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-700">章节简介</h4>
                      <p className="text-sm leading-relaxed text-gray-600">
                        本章节为{course.name}的重要组成部分，涵盖核心知识与技能。
                        当前已有 {course.studyCount.toLocaleString()} 人参与学习，
                        累计浏览 {course.viewCount.toLocaleString()} 次。
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">学习数据</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <StatItem icon={<BookOpen className="h-4 w-4 text-blue-500" />} label="章节数" value={`${course.nodeCount} 章`} />
                    <StatItem icon={<Clock className="h-4 w-4 text-orange-500" />} label="课时数" value={`${course.lessonCount} 课时`} />
                    <StatItem icon={<Download className="h-4 w-4 text-green-500" />} label="资源数" value={`${course.resourceCount} 个`} />
                    <Separator />
                    <StatItem icon={<GraduationCap className="h-4 w-4 text-purple-500" />} label="学习人数" value={course.studyCount.toLocaleString()} />
                    <StatItem icon={<MonitorPlay className="h-4 w-4 text-pink-500" />} label="浏览次数" value={course.viewCount.toLocaleString()} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 资料下载 */}
            <TabsContent value="materials" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">课程资料</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {course.name} - 配套资料 {i}.pdf
                        </p>
                        <p className="text-xs text-gray-400">
                          PDF · {(2.5 + i * 1.2).toFixed(1)} MB · 2026-04-27
                        </p>
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

            {/* 知识点 */}
            <TabsContent value="knowledge" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">本节知识点</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "假设检验", "P值与显著性", "T检验", "卡方检验", "方差分析",
                      "A/B测试", "置信区间", "回归分析", "正态分布", "中心极限定理",
                    ].slice(0, 5).map((kp) => (
                      <span key={kp} className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
                        {kp}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
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

/* ---------- quiz panel ---------- */

function QuizPanel({
  section,
  quizData,
  onAnswer,
  onSubmit,
  onRetake,
}: {
  section: Section
  quizData?: { answers: Record<string, string>; submitted: boolean; score: number }
  onAnswer: (qId: string, answer: string) => void
  onSubmit: () => void
  onRetake: () => void
}) {
  const questions = section.questions ?? []
  const answers = quizData?.answers ?? {}
  const submitted = quizData?.submitted ?? false
  const score = quizData?.score ?? 0
  const totalScore = questions.reduce((s, q) => s + q.score, 0)
  const allAnswered = questions.every((q) => answers[q.id]?.trim())

  return (
    <div className="flex-shrink-0 bg-white border-b">
      <div className="max-w-3xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-800">{section.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
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

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
              <div className="flex items-start gap-2 mb-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium">{q.question}</p>
                  <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] ${
                    q.type === "single" ? "bg-blue-50 text-blue-500" : "bg-green-50 text-green-600"
                  }`}>
                    {q.type === "single" ? "单选题" : "简答题"}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{q.score}分</span>
              </div>

              {q.type === "single" && q.options && (
                <div className="space-y-2 ml-7">
                  {q.options.map((opt) => {
                    const optLetter = opt.charAt(0)
                    const isSelected = answers[q.id] === optLetter
                    const isCorrect = optLetter === q.correctAnswer
                    const showCorrect = submitted && isCorrect
                    const showWrong = submitted && isSelected && !isCorrect

                    return (
                      <button
                        key={opt}
                        disabled={submitted}
                        onClick={() => onAnswer(q.id, optLetter)}
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
                        <span className="flex-1">{opt}</span>
                        {showCorrect && <span className="text-xs text-green-600">正确答案</span>}
                        {showWrong && <span className="text-xs text-red-600">你的选择</span>}
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
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {answers[q.id] || "（未作答）"}
                        </p>
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
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          {!submitted ? (
            <Button
              onClick={onSubmit}
              disabled={!allAnswered}
              className="gap-1.5"
            >
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
      </div>
    </div>
  )
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
