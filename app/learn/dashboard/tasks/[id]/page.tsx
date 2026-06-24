"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, PlayCircle, CheckCircle2 } from "lucide-react"

const taskDetails: Record<string, { title: string; course: string; type: string; deadline: string; content: string; progress: number }> = {
  t1: {
    title: "第3章：响应式布局预习视频",
    course: "Web前端开发混合课程",
    type: "视频",
    deadline: "2027-03-25 23:59",
    content: "观看响应式布局章节视频，完成视频中提到的弹性盒布局示例练习。",
    progress: 60,
  },
  t2: {
    title: "课后作业：Flexbox布局练习",
    course: "Web前端开发混合课程",
    type: "作业",
    deadline: "2027-03-27 23:59",
    content: "使用Flexbox完成一个导航栏布局，要求适配移动端和桌面端。",
    progress: 0,
  },
}

export default function StudentTaskDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const task = taskDetails[id] || taskDetails["t1"]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/learn/dashboard/tasks">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> 返回</Button>
        </Link>
        <h1 className="text-2xl font-semibold">任务详情</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{task.title}</CardTitle>
            <Badge variant="outline">{task.type}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{task.course}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> 截止：{task.deadline}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>完成进度</span>
              <span>{task.progress}%</span>
            </div>
            <Progress value={task.progress} />
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">任务要求</p>
            <p className="text-sm text-muted-foreground">{task.content}</p>
          </div>
          <Button className="w-full">
            {task.progress >= 100 ? (
              <><CheckCircle2 className="h-4 w-4 mr-1" /> 已完成</>
            ) : (
              <><PlayCircle className="h-4 w-4 mr-1" /> 继续任务</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
