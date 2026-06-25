"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, FileText, CheckCircle2, Plus } from "lucide-react"
import { ClassSchedulePicker } from "../../../../teacher/_components/class-schedule-picker"
import { toast } from "sonner"

const previewTasks = [
  { id: "p1", name: "HTML基础微课", type: "video", completed: 38, total: 42, dueDate: "2026-09-05" },
  { id: "p2", name: "CSS选择器预习测验", type: "quiz", completed: 35, total: 42, dueDate: "2026-09-05" },
  { id: "p3", name: "电子讲义：Web前端概述", type: "doc", completed: 40, total: 42, dueDate: "2026-09-06" },
]

export function PreClassTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">发布预习微课、电子讲义、课前小测，自动统计预习数据</p>
        <Button size="sm" onClick={() => toast.success("打开预习任务发布（演示）")}>
          <Plus className="h-4 w-4 mr-1" /> 发布预习任务
        </Button>
      </div>

      <ClassSchedulePicker />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><PlayCircle className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">微课任务</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">平均完成率</p>
                <p className="text-2xl font-bold">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><FileText className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">未预习预警</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">当前预习任务</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {previewTasks.map((task) => (
            <div key={task.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{task.name}</h3>
                  <Badge variant="outline">
                    {task.type === "video" ? "微课" : task.type === "quiz" ? "测验" : "讲义"}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">截止 {task.dueDate}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>完成进度</span>
                  <span>{task.completed}/{task.total}</span>
                </div>
                <Progress value={(task.completed / task.total) * 100} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
