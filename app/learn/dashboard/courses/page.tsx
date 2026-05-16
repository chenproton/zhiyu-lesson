"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, PlayCircle, RotateCcw } from "lucide-react"
import { courses } from "@/lib/mock-data"

const myCourses = courses.map((c) => ({
  ...c,
  progress: c.status === "published" ? Math.floor(Math.random() * 100) : 0,
  isCompleted: Math.random() > 0.7,
}))

export default function MyCoursesPage() {
  const [filter, setFilter] = useState<"all" | "learning" | "completed">("all")

  const filtered = myCourses.filter((c) => {
    if (filter === "learning") return c.progress > 0 && !c.isCompleted
    if (filter === "completed") return c.isCompleted
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">我的课程</h1>
        <p className="text-muted-foreground mt-1">查看你正在学习和已完成的课程</p>
      </div>

      <div className="flex gap-2">
        {[
          { key: "all" as const, label: "全部" },
          { key: "learning" as const, label: "学习中" },
          { key: "completed" as const, label: "已完成" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
              filter === t.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className={`h-32 bg-gradient-to-br ${course.coverColor || "from-blue-800 to-blue-500"} relative p-4 flex flex-col justify-end`}>
              <Badge className="absolute top-3 right-3 bg-white/20 text-white border-0">
                {course.courseTag}
              </Badge>
              <div className="absolute bottom-0 right-0 bg-black/40 text-white text-xs px-2 py-0.5 rounded-tl-md">
                课程编码：{course.code}
              </div>
            </div>
            <CardContent className="pt-4 space-y-3">
              <h3 className="font-semibold text-sm">{course.name}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {course.nodeCount} 节点
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {course.lessonCount} 课时
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">学习进度</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-1.5" />
              </div>
              <div className="flex gap-2 pt-1">
                <Link href={`/learn/courses/system/${course.id}/learn`} className="flex-1">
                  <Button size="sm" className="w-full gap-1">
                    {course.isCompleted ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" />
                        重新学习
                      </>
                    ) : course.progress > 0 ? (
                      <>
                        <PlayCircle className="h-3.5 w-3.5" />
                        继续学习
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-3.5 w-3.5" />
                        开始学习
                      </>
                    )}
                  </Button>
                </Link>
                <Link href={`/learn/courses/system/${course.id}`}>
                  <Button size="sm" variant="outline">
                    详情
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p>暂无符合条件的课程</p>
        </div>
      )}
    </div>
  )
}
