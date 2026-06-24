"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Send } from "lucide-react"

export default function NewPostClassTaskPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [type, setType] = useState("homework")
  const [course, setCourse] = useState("Web前端开发混合课程")
  const [deadline, setDeadline] = useState("")
  const [content, setContent] = useState("")
  const [aiGrade, setAiGrade] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/teacher/post-class">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> 返回</Button>
          </Link>
          <h1 className="text-2xl font-semibold">发布课后任务</h1>
        </div>
        <Button onClick={() => router.push("/teacher/post-class")}><Send className="h-4 w-4 mr-1" /> 发布任务</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">任务信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>任务名称</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入任务名称" />
            </div>
            <div className="space-y-2">
              <Label>所属课程</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Web前端开发混合课程", "软件测试技术混合课程", "机器学习混合课程"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>任务类型</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[
                    { value: "homework", label: "作业" },
                    { value: "quiz", label: "单元测验" },
                    { value: "discuss", label: "讨论题" },
                  ].map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>截止时间</Label>
              <Input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>任务内容</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} placeholder="请输入作业/测验要求..." />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="text-sm font-medium">AI自动批改客观题</p>
              <p className="text-xs text-muted-foreground">开启后，选择题、判断题将由AI自动批改</p>
            </div>
            <Switch checked={aiGrade} onCheckedChange={setAiGrade} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
