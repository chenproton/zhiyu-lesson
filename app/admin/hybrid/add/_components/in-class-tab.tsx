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
  UserCheck,
  Presentation,
  ClipboardCheck,
  Users,
  Wrench,
  Zap,
} from "lucide-react"
import { toast } from "sonner"

type ActivityType = "sign" | "lecture" | "quiz" | "discuss" | "practical" | "interactive"

interface ClassActivity {
  id: string
  name: string
  type: ActivityType
  duration: number
  platformLink: boolean
}

const TYPE_CONFIG: Record<
  ActivityType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  sign: {
    label: "签到",
    icon: <UserCheck className="w-3.5 h-3.5" />,
    color: "bg-green-100 text-green-700",
  },
  lecture: {
    label: "讲授",
    icon: <Presentation className="w-3.5 h-3.5" />,
    color: "bg-blue-100 text-blue-700",
  },
  quiz: {
    label: "随堂测",
    icon: <ClipboardCheck className="w-3.5 h-3.5" />,
    color: "bg-purple-100 text-purple-700",
  },
  discuss: {
    label: "讨论",
    icon: <Users className="w-3.5 h-3.5" />,
    color: "bg-orange-100 text-orange-700",
  },
  practical: {
    label: "实训",
    icon: <Wrench className="w-3.5 h-3.5" />,
    color: "bg-cyan-100 text-cyan-700",
  },
  interactive: {
    label: "互动",
    icon: <Zap className="w-3.5 h-3.5" />,
    color: "bg-pink-100 text-pink-700",
  },
}

export function InClassTab() {
  const [activities, setActivities] = useState<ClassActivity[]>([
    {
      id: "a1",
      name: "课堂签到",
      type: "sign",
      duration: 5,
      platformLink: true,
    },
    {
      id: "a2",
      name: "CSS 选择器讲解",
      type: "lecture",
      duration: 35,
      platformLink: false,
    },
    {
      id: "a3",
      name: "随堂小测",
      type: "quiz",
      duration: 10,
      platformLink: true,
    },
    {
      id: "a4",
      name: "Flexbox 小组实训",
      type: "practical",
      duration: 40,
      platformLink: true,
    },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<Partial<ClassActivity>>({
    type: "sign",
    platformLink: true,
  })

  const handleAdd = () => {
    if (!form.name || !form.duration) return
    const newActivity: ClassActivity = {
      id: `a-${Date.now()}`,
      name: form.name,
      type: (form.type as ActivityType) || "sign",
      duration: Number(form.duration),
      platformLink: form.platformLink ?? true,
    }
    setActivities([...activities, newActivity])
    setDialogOpen(false)
    setForm({ type: "sign", platformLink: true })
    toast.success("教学活动已添加")
  }

  const handleDelete = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id))
  }

  const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          配置线下课堂活动及需要平台联动的教学环节
        </p>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> 添加教学活动
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>活动总数：{activities.length}</span>
        <span>·</span>
        <span>预计总时长：{totalDuration} 分钟</span>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => {
          const cfg = TYPE_CONFIG[activity.type]
          return (
            <Card key={activity.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${cfg.color} gap-1`}>
                        {cfg.icon}
                        {cfg.label}
                      </Badge>
                      {activity.platformLink && (
                        <Badge variant="outline">平台联动</Badge>
                      )}
                    </div>
                    <p className="font-medium text-sm">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">
                      预计时长：{activity.duration} 分钟
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(activity.id)}
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
            <DialogTitle>添加教学活动</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>活动名称</Label>
              <Input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="如：课堂签到"
              />
            </div>
            <div className="space-y-2">
              <Label>活动类型</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm({ ...form, type: v as ActivityType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sign">签到</SelectItem>
                  <SelectItem value="lecture">课堂讲授</SelectItem>
                  <SelectItem value="quiz">随堂测验</SelectItem>
                  <SelectItem value="discuss">小组讨论</SelectItem>
                  <SelectItem value="practical">实训任务</SelectItem>
                  <SelectItem value="interactive">抢答/点名/互动</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>预计时长（分钟）</Label>
              <Input
                type="number"
                value={form.duration || ""}
                onChange={(e) =>
                  setForm({ ...form, duration: Number(e.target.value) })
                }
                placeholder="如：10"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="cursor-pointer">平台联动采集数据</Label>
              <Switch
                checked={form.platformLink}
                onCheckedChange={(v) =>
                  setForm({ ...form, platformLink: v })
                }
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
