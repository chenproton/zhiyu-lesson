"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, Calendar, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const semesters = [
  "2025 年第一学期",
  "2025 年第二学期",
  "2026 年第一学期",
]

const initialClasses = [
  { id: "cls-1", name: "软件工程2026级1班", course: "Web前端开发混合课程", term: "2025 年第一学期", students: 42, status: "pending" },
  { id: "cls-2", name: "软件工程2026级2班", course: "软件测试技术混合课程", term: "2025 年第一学期", students: 40, status: "claimed" },
  { id: "cls-3", name: "人工智能2026级1班", course: "机器学习混合课程", term: "2025 年第一学期", students: 38, status: "pending" },
  { id: "cls-4", name: "大数据技术2026级1班", course: "数据分析与可视化混合课程", term: "2025 年第二学期", students: 36, status: "pending" },
  { id: "cls-5", name: "云计算2026级1班", course: "云原生应用开发混合课程", term: "2025 年第二学期", students: 35, status: "claimed" },
  { id: "cls-6", name: "物联网2026级1班", course: "嵌入式系统开发混合课程", term: "2026 年第一学期", students: 33, status: "pending" },
]

export default function ClassClaimPage() {
  const [classes, setClasses] = useState(initialClasses)
  const [selectedTerm, setSelectedTerm] = useState(semesters[0])

  const termClasses = classes.filter((c) => c.term === selectedTerm)
  const pendingCount = termClasses.filter((c) => c.status === "pending").length
  const claimedCount = termClasses.filter((c) => c.status === "claimed").length

  const handleClaim = (id: string) => {
    setClasses((prev) => prev.map((c) => c.id === id ? { ...c, status: "claimed" } : c))
    const cls = classes.find((c) => c.id === id)
    toast.success(`已确认 ${cls?.course} · ${cls?.name}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">排课下发确认</h1>
        <p className="text-muted-foreground mt-1">查看并确认教务平台下发的课时安排</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">待确认课时</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">已确认课时</p>
                <p className="text-2xl font-bold">{claimedCount}</p>
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
          <CardTitle className="text-base">待确认课时</CardTitle>
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
            <div className="text-center py-8 text-sm text-muted-foreground">该学期暂无课时安排</div>
          ) : (
            termClasses.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{cls.course}</h3>
                    <Badge variant={cls.status === "claimed" ? "default" : "outline"}>
                      {cls.status === "claimed" ? "已确认" : "待确认"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{cls.name} · {cls.students}人 · {cls.term}</p>
                </div>
                <Button
                  variant={cls.status === "claimed" ? "outline" : "default"}
                  disabled={cls.status === "claimed"}
                  onClick={() => handleClaim(cls.id)}
                >
                  {cls.status === "claimed" ? "已确认" : "确认课时"}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
