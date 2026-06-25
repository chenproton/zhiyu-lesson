"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Plus,
  Trash2,
  FileText,
  PenTool,
  MessageCircle,
  BookOpen,
} from "lucide-react"
import { toast } from "sonner"

type PostTaskType = "homework" | "quiz" | "discuss" | "resource"

interface PostTask {
  id: string
  name: string
  type: PostTaskType
  deadline: string
  score: number
  aiGrade: boolean
}

const TYPE_CONFIG: Record<
  PostTaskType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  homework: {
    label: "作业",
    icon: <FileText className="w-3.5 h-3.5" />,
    color: "bg-blue-100 text-blue-700",
  },
  quiz: {
    label: "测验",
    icon: <PenTool className="w-3.5 h-3.5" />,
    color: "bg-purple-100 text-purple-700",
  },
  discuss: {
    label: "答疑",
    icon: <MessageCircle className="w-3.5 h-3.5" />,
    color: "bg-orange-100 text-orange-700",
  },
  resource: {
    label: "拓展",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: "bg-cyan-100 text-cyan-700",
  },
}

export function PostClassTab() {
  const [tasks, setTasks] = useState<PostTask[]>([
    {
      id: "h1",
      name: "个人主页布局作业",
      type: "homework",
      deadline: "2026-09-10",
      score: 20,
      aiGrade: false,
    },
    {
      id: "h2",
      name: "第二单元测验",
      type: "quiz",
      deadline: "2026-09-12",
      score: 30,
      aiGrade: true,
    },
    {
      id: "h3",
      name: "CSS 布局讨论答疑",
      type: "discuss",
      deadline: "2026-09-14",
      score: 10,
      aiGrade: false,
    },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<Partial<PostTask>>({
    type: "homework",
    aiGrade: false,
  })

  const handleAdd = () => {
    if (!form.name || !form.deadline) return
    const newTask: PostTask = {
      id: `h-${Date.now()}`,
      name: form.name,
      type: (form.type as PostTaskType) || "homework",
      deadline: form.deadline,
      score: Number(form.score) || 0,
      aiGrade: form.aiGrade ?? false,
    }
    setTasks([...tasks, newTask])
    setDialogOpen(false)
    setForm({ type: "homework", aiGrade: false })
    toast.success("课后任务已添加")
  }

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const totalScore = tasks.reduce((sum, t) => sum + t.score, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          配置课后线上作业、单元测验、讨论答疑及拓展资源
        </p>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> 添加课后任务
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>任务总数：{tasks.length}</span>
        <span>·</span>
        <span>分值合计：{totalScore} 分</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const cfg = TYPE_CONFIG[task.type]
          return (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${cfg.color} gap-1`}>
                        {cfg.icon}
                        {cfg.label}
                      </Badge>
                      {task.aiGrade && (
                        <Badge variant="outline">AI 批改客观题</Badge>
                      )}
                    </div>
                    <p className="font-medium text-sm">{task.name}</p>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>截止时间：{task.deadline}</p>
                      {task.score > 0 && <p>分值：{task.score} 分</p>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>添加课后任务</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>任务名称</Label>
              <Input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="如：个人主页布局作业"
              />
            </div>
            <div className="space-y-2">
              <Label>任务类型</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm({ ...form, type: v as PostTaskType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homework">作业</SelectItem>
                  <SelectItem value="quiz">单元测验</SelectItem>
                  <SelectItem value="discuss">讨论答疑</SelectItem>
                  <SelectItem value="resource">拓展资源</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>截止时间</Label>
              <Input
                type="date"
                value={form.deadline || ""}
                onChange={(e) =>
                  setForm({ ...form, deadline: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>分值</Label>
              <Input
                type="number"
                value={form.score || ""}
                onChange={(e) =>
                  setForm({ ...form, score: Number(e.target.value) })
                }
                placeholder="如：20"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="cursor-pointer">AI 批改客观题</Label>
              <Switch
                checked={form.aiGrade}
                onCheckedChange={(v) => setForm({ ...form, aiGrade: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAdd}>确认添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
