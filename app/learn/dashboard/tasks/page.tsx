"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Play, FileText, Clock, AlertCircle } from "lucide-react"

const tasks = [
  { id: "t1", title: "第3章：响应式布局预习视频", course: "Web前端开发混合课程", type: "视频", deadline: "2027-03-25 23:59", status: "pending" },
  { id: "t2", title: "课后作业：Flexbox布局练习", course: "Web前端开发混合课程", type: "作业", deadline: "2027-03-27 23:59", status: "pending" },
  { id: "t3", title: "单元测验：CSS基础", course: "Web前端开发混合课程", type: "测验", deadline: "2027-03-28 23:59", status: "done" },
]

export default function StudentTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">学习任务</h1>
        <p className="text-muted-foreground mt-1">预习、作业、测验、考试等学习活动任务清单</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">待完成与已完成任务</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Checkbox checked={task.status === "done"} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>{task.title}</h3>
                    <Badge variant="outline">{task.type}</Badge>
                    {task.status === "done" && <Badge>已完成</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{task.course}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> 截止：{task.deadline}
                  </div>
                </div>
              </div>
              <Link href={`/learn/dashboard/tasks/${task.id}`}>
                <Button size="sm" variant={task.status === "done" ? "outline" : "default"} disabled={task.status === "done"}>
                  {task.status === "done" ? "已完成" : "开始任务"}
                </Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
