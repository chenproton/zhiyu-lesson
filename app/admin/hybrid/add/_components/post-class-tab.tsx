"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, CheckCircle2, MessageCircle, Plus, PenTool } from "lucide-react"
import { ClassSchedulePicker } from "../../../../teacher/_components/class-schedule-picker"
import { toast } from "sonner"

const homeworkTasks = [
  { id: "h1", name: "个人主页布局作业", type: "homework", submitCount: 38, total: 42, deadline: "2026-09-10" },
  { id: "h2", name: "第二单元测验", type: "quiz", submitCount: 40, total: 42, deadline: "2026-09-12" },
]

export function PostClassTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">线上布置作业、单元测试、讨论题，AI自动批改客观题，全过程留学习数据</p>
        <Button size="sm" onClick={() => toast.success("打开课后任务发布（演示）")}>
          <Plus className="h-4 w-4 mr-1" /> 发布课后任务
        </Button>
      </div>

      <ClassSchedulePicker />

      <Tabs defaultValue="homework" className="space-y-4">
        <TabsList>
          <TabsTrigger value="homework"><FileText className="h-4 w-4 mr-1" /> 作业</TabsTrigger>
          <TabsTrigger value="quiz"><PenTool className="h-4 w-4 mr-1" /> 单元测验</TabsTrigger>
          <TabsTrigger value="discuss"><MessageCircle className="h-4 w-4 mr-1" /> 讨论答疑</TabsTrigger>
        </TabsList>

        <TabsContent value="homework" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">作业列表</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {homeworkTasks.filter((t) => t.type === "homework").map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{task.name}</h3>
                    <p className="text-sm text-muted-foreground">已提交 {task.submitCount}/{task.total} · 截止 {task.deadline}</p>
                  </div>
                  <Button variant="outline" size="sm">批改</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">单元测验</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {homeworkTasks.filter((t) => t.type === "quiz").map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{task.name}</h3>
                    <p className="text-sm text-muted-foreground">已提交 {task.submitCount}/{task.total} · 截止 {task.deadline}</p>
                  </div>
                  <Badge>AI已批改客观题</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discuss" className="space-y-4">
          <Card>
            <CardContent className="pt-6 text-center py-16 text-muted-foreground">
              <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>讨论答疑区（可调用AI智能问答助手）</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
