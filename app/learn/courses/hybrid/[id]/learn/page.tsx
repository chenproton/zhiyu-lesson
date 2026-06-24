"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, PlayCircle, FileText, CheckCircle2, Circle, MessageCircle, Users, MonitorPlay, Calendar } from "lucide-react"
import { hybridCourses } from "@/lib/mock-data"

const learningUnits = [
  {
    id: "u1",
    name: "第一单元：课程导论",
    phase: "pre",
    phaseLabel: "课前",
    mode: "online",
    progress: 100,
    items: [
      { id: "i1", name: "课程导入微课", type: "video", done: true },
      { id: "i2", name: "电子讲义", type: "doc", done: true },
      { id: "i3", name: "课前小测", type: "quiz", done: true },
    ],
  },
  {
    id: "u2",
    name: "第二单元：核心理论",
    phase: "in",
    phaseLabel: "课中",
    mode: "offline",
    progress: 80,
    items: [
      { id: "i4", name: "课堂签到", type: "checkin", done: true },
      { id: "i5", name: "随堂答题", type: "quiz", done: true },
      { id: "i6", name: "案例研讨", type: "discuss", done: false },
    ],
  },
  {
    id: "u3",
    name: "第三单元：项目实践",
    phase: "post",
    phaseLabel: "课后",
    mode: "online",
    progress: 40,
    items: [
      { id: "i7", name: "项目任务单", type: "doc", done: true },
      { id: "i8", name: "线上作业提交", type: "homework", done: false },
      { id: "i9", name: "单元测试", type: "quiz", done: false },
    ],
  },
]

export default function HybridCourseLearnPage() {
  const params = useParams()
  const course = hybridCourses.find((c) => c.id === params.id)
  const [activeUnit, setActiveUnit] = useState(learningUnits[0])

  if (!course) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        未找到该混合课程
      </div>
    )
  }

  const totalProgress = Math.round(learningUnits.reduce((sum, u) => sum + u.progress, 0) / learningUnits.length)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/learn/courses/hybrid/${course.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{course.name}</h1>
          <p className="text-sm text-muted-foreground">{course.teacher} · {course.semester}</p>
        </div>
        <div className="w-48">
          <div className="flex justify-between text-xs mb-1">
            <span>总进度</span>
            <span>{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">课程目录</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {learningUnits.map((unit) => (
              <button
                key={unit.id}
                onClick={() => setActiveUnit(unit)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeUnit.id === unit.id ? "bg-primary/10" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{unit.name}</span>
                  <Badge variant={unit.mode === "online" ? "default" : "secondary"} className="text-xs">
                    {unit.phaseLabel}
                  </Badge>
                </div>
                <div className="mt-2">
                  <Progress value={unit.progress} className="h-1.5" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>{activeUnit.name}</CardTitle>
                <Badge variant={activeUnit.mode === "online" ? "default" : "secondary"}>
                  {activeUnit.mode === "online" ? "线上" : "线下"}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">进度 {activeUnit.progress}%</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {activeUnit.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  {item.type === "video" && <PlayCircle className="h-5 w-5 text-blue-500" />}
                  {item.type === "doc" && <FileText className="h-5 w-5 text-orange-500" />}
                  {item.type === "quiz" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {item.type === "checkin" && <Calendar className="h-5 w-5 text-purple-500" />}
                  {item.type === "discuss" && <MessageCircle className="h-5 w-5 text-pink-500" />}
                  {item.type === "homework" && <FileText className="h-5 w-5 text-indigo-500" />}
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {item.done ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-muted-foreground">已完成</span>
                    </>
                  ) : (
                    <>
                      <Circle className="h-5 w-5 text-muted-foreground" />
                      <Button size="sm" variant="outline">去学习</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">学习数据</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <MonitorPlay className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">观看时长</p>
                <p className="font-bold">12.5h</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">作业得分</p>
                <p className="font-bold">88/100</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">课堂互动</p>
                <p className="font-bold">15次</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">签到</p>
                <p className="font-bold">8/10</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
