"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, Calendar, CheckCircle2, MapPin, Clock } from "lucide-react"

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

export default function ClassClaimPage() {
  const [classes] = useState(initialClasses)
  const [sessions] = useState<ClassSession[]>(initialSessions)
  const [selectedTerm, setSelectedTerm] = useState(semesters[0])

  const termClasses = classes.filter((c) => c.term === selectedTerm)
  const termClassIds = new Set(termClasses.map((c) => c.id))
  const termSessions = sessions.filter((s) => termClassIds.has(s.classId))
  const associatedCount = termSessions.filter((s) => s.status === "associated").length

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {classSessions.map((session) => (
                        <div
                          key={session.id}
                          className="border rounded-lg p-4 bg-card hover:shadow-sm transition-shadow"
                        >
                          <div className="space-y-2">
                            <div className="text-sm font-semibold">第 {session.week} 周</div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              <span>{session.weekday} · {session.period}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span>{session.venue}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">暂无课程节次</div>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
