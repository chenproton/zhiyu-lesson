"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { BookOpen, Users, Calendar, CheckCircle2, Search, MapPin } from "lucide-react"
import { toast } from "sonner"
import { hybridCourses } from "@/lib/mock-data"

const semesters = [
  "2025 年第一学期",
  "2025 年第二学期",
  "2026 年第一学期",
]

interface ClassSession {
  id: string
  classId: string
  venue: string
  week: number
  weekday: string
  period: string
  status: "pending" | "associated"
  hybridCourseId?: string
}

const initialClasses = [
  { id: "cls-1", name: "软件工程2026级1班", course: "Web前端开发混合课程", term: "2025 年第一学期", students: 42, status: "pending" },
  { id: "cls-2", name: "软件工程2026级2班", course: "软件测试技术混合课程", term: "2025 年第一学期", students: 40, status: "claimed" },
  { id: "cls-3", name: "人工智能2026级1班", course: "机器学习混合课程", term: "2025 年第一学期", students: 38, status: "pending" },
  { id: "cls-4", name: "大数据技术2026级1班", course: "数据分析与可视化混合课程", term: "2025 年第二学期", students: 36, status: "pending" },
  { id: "cls-5", name: "云计算2026级1班", course: "云原生应用开发混合课程", term: "2025 年第二学期", students: 35, status: "claimed" },
  { id: "cls-6", name: "物联网2026级1班", course: "嵌入式系统开发混合课程", term: "2026 年第一学期", students: 33, status: "pending" },
]

const initialSessions: ClassSession[] = [
  { id: "s-1-1", classId: "cls-1", venue: "教学楼 A-101", week: 1, weekday: "周一", period: "上午 1", status: "pending" },
  { id: "s-1-2", classId: "cls-1", venue: "教学楼 A-101", week: 2, weekday: "周三", period: "上午 2", status: "pending" },
  { id: "s-1-3", classId: "cls-1", venue: "实训楼 B-202", week: 4, weekday: "周五", period: "下午 1", status: "pending" },
  { id: "s-2-1", classId: "cls-2", venue: "教学楼 A-102", week: 1, weekday: "周二", period: "上午 1", status: "associated", hybridCourseId: "hybrid-2" },
  { id: "s-2-2", classId: "cls-2", venue: "实训楼 B-203", week: 3, weekday: "周四", period: "上午 2", status: "pending" },
]

const weekdayOrder = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]

const hybridStatusLabel: Record<string, string> = {
  published: "已发布",
  pending: "审批中",
  draft: "未提交",
  rejected: "已驳回",
}

export default function ClassClaimPage() {
  const [classes] = useState(initialClasses)
  const [sessions, setSessions] = useState<ClassSession[]>(initialSessions)
  const [selectedTerm, setSelectedTerm] = useState(semesters[0])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const termClasses = classes.filter((c) => c.term === selectedTerm)
  const termClassIds = new Set(termClasses.map((c) => c.id))
  const termSessions = sessions.filter((s) => termClassIds.has(s.classId))
  const associatedCount = termSessions.filter((s) => s.status === "associated").length

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId),
    [sessions, activeSessionId]
  )

  const filteredHybridCourses = useMemo(() => {
    const q = searchQuery.trim()
    if (!q) return hybridCourses
    return hybridCourses.filter(
      (c) =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.code.toLowerCase().includes(q.toLowerCase())
    )
  }, [searchQuery])

  const openAssociateDialog = (sessionId: string) => {
    setActiveSessionId(sessionId)
    setSearchQuery("")
    setDialogOpen(true)
  }

  const handleAssociate = (courseId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, status: "associated", hybridCourseId: courseId }
          : s
      )
    )
    const course = hybridCourses.find((c) => c.id === courseId)
    toast.success(`已关联混合课程：${course?.name}`)
    setDialogOpen(false)
    setActiveSessionId(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">课程节次开课管理</h1>
        <p className="text-muted-foreground mt-1">管理课程节次并关联混合课程资源</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">课程节次列表</p>
                <p className="text-2xl font-bold">{termSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">已关联混合课程</p>
                <p className="text-2xl font-bold">{associatedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Users className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">覆盖学生</p>
                <p className="text-2xl font-bold">{termClasses.reduce((sum, c) => sum + c.students, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-base">课程节次列表</CardTitle>
          <Tabs value={selectedTerm} onValueChange={setSelectedTerm}>
            <TabsList className="h-9">
              {semesters.map((term) => (
                <TabsTrigger key={term} value={term} className="text-xs px-3">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {term}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-4">
          {termClasses.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">该学期暂无课程安排</div>
          ) : (
            termClasses.map((cls) => {
              const classSessions = sessions
                .filter((s) => s.classId === cls.id)
                .sort(
                  (a, b) =>
                    a.week - b.week ||
                    weekdayOrder.indexOf(a.weekday) - weekdayOrder.indexOf(b.weekday)
                )

              return (
                <div key={cls.id} className="p-4 border rounded-lg space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{cls.course}</h3>
                      <Badge variant="outline">{cls.name}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{cls.students}人 · {cls.term}</p>
                  </div>

                  {classSessions.length > 0 ? (
                    <div className="space-y-2 pl-4 border-l-2 border-muted">
                      {classSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-muted/40 rounded-md"
                        >
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{session.venue}</span>
                            </div>
                            <div>第 {session.week} 周</div>
                            <div>{session.weekday}</div>
                            <div>{session.period}</div>
                          </div>
                          <Button
                            size="sm"
                            variant={session.status === "associated" ? "outline" : "default"}
                            onClick={() => openAssociateDialog(session.id)}
                          >
                            {session.status === "associated" ? "已关联混合课程" : "开课"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pl-4 text-sm text-muted-foreground">暂无课程节次</div>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>关联混合课程</DialogTitle>
            <DialogDescription>
              {activeSession
                ? `为 ${activeSession.venue} · 第 ${activeSession.week} 周 · ${activeSession.weekday} · ${activeSession.period} 选择混合课程`
                : "选择要关联的混合课程"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索混合课程名称或编号"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredHybridCourses.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">未找到匹配的混合课程</div>
              ) : (
                filteredHybridCourses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    className="w-full text-left p-3 border rounded-md hover:bg-muted transition-colors"
                    onClick={() => handleAssociate(course.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{course.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {course.code} · {course.major} · {course.teacher}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {hybridStatusLabel[course.status] ?? course.status}
                      </Badge>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
