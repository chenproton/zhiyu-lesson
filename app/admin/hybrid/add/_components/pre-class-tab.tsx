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
import { Plus, Trash2, PlayCircle, FileText, CheckCircle2, MessageCircle } from "lucide-react"
import { toast } from "sonner"

type PreTaskType = "video" | "quiz" | "doc" | "discuss"

interface PreTask {
  id: string
  name: string
  type: PreTaskType
  resource: string
  dueDate: string
  required: boolean
}

const TYPE_CONFIG: Record<
  PreTaskType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  video: {
    label: "微课",
    icon: <PlayCircle className="w-3.5 h-3.5" />,
    color: "bg-blue-100 text-blue-700",
  },
  quiz: {
    label: "测验",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    color: "bg-green-100 text-green-700",
  },
  doc: {
    label: "讲义",
    icon: <FileText className="w-3.5 h-3.5" />,
    color: "bg-orange-100 text-orange-700",
  },
  discuss: {
    label: "讨论",
    icon: <MessageCircle className="w-3.5 h-3.5" />,
    color: "bg-purple-100 text-purple-700",
  },
}

export function PreClassTab() {
  const [tasks, setTasks] = useState<PreTask[]>([
    {
      id: "p1",
      name: "HTML基础微课",
      type: "video",
      resource: "HTML基础视频.mp4",
      dueDate: "2026-09-05",
      required: true,
    },
    {
      id: "p2",
      name: "CSS选择器预习测验",
      type: "quiz",
      resource: "CSS基础题库",
      dueDate: "2026-09-05",
      required: true,
    },
    {
      id: "p3",
      name: "电子讲义：Web前端概述",
      type: "doc",
      resource: "Web前端概述.pdf",
      dueDate: "2026-09-06",
      required: false,
    },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<Partial<PreTask>>({
    type: "video",
    required: true,
  })

  const handleAdd = () => {
    if (!form.name || !form.dueDate) return
    const newTask: PreTask = {
      id: `p-${Date.now()}`,
      name: form.name,
      type: (form.type as PreTaskType) || "video",
      resource: form.resource || "",
      dueDate: form.dueDate,
      required: form.required ?? true,
    }
    setTasks([...tasks, newTask])
    setDialogOpen(false)
    setForm({ type: "video", required: true })
    toast.success("课前任务已添加")
  }

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          配置学生课前需要完成的线上自主学习任务
        </p>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> 添加课前任务
        </Button>
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
                      {task.required && <Badge variant="outline">必做</Badge>}
                    </div>
                    <p className="font-medium text-sm">{task.name}</p>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>关联资源：{task.resource || "—"}</p>
                      <p>截止时间：{task.dueDate}</p>
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
            <DialogTitle>添加课前任务</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>任务名称</Label>
              <Input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="如：HTML基础微课"
              />
            </div>
            <div className="space-y-2">
              <Label>任务类型</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm({ ...form, type: v as PreTaskType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">微课视频</SelectItem>
                  <SelectItem value="doc">电子讲义/文档</SelectItem>
                  <SelectItem value="quiz">课前小测</SelectItem>
                  <SelectItem value="discuss">讨论话题</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>关联资源</Label>
              <Input
                value={form.resource || ""}
                onChange={(e) =>
                  setForm({ ...form, resource: e.target.value })
                }
                placeholder="如：HTML基础视频.mp4"
              />
            </div>
            <div className="space-y-2">
              <Label>截止时间</Label>
              <Input
                type="date"
                value={form.dueDate || ""}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="cursor-pointer">是否必做</Label>
              <Switch
                checked={form.required}
                onCheckedChange={(v) => setForm({ ...form, required: v })}
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
