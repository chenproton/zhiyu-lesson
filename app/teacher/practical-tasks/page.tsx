"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ClipboardList, Wrench, Users, Clock, Eye, Plus } from "lucide-react"
import { ClassSchedulePicker } from "../_components/class-schedule-picker"

const tasks = [
  {
    id: "pt-001",
    name: "网络设备基础配置实训",
    course: "计算机网络技术",
    className: "计网 2301 班",
    scene: "网络实训室 A",
    status: "published",
    progress: 100,
    bindType: "线下实践任务",
  },
  {
    id: "pt-002",
    name: "小型企业网络搭建",
    course: "计算机网络技术",
    className: "计网 2301 班",
    scene: "网络实训室 B",
    status: "draft",
    progress: 60,
    bindType: "场景化任务",
  },
  {
    id: "pt-003",
    name: "Linux 服务器配置",
    course: "Linux 操作系统",
    className: "计网 2302 班",
    scene: "云计算实训室",
    status: "published",
    progress: 80,
    bindType: "岗位能力任务",
  },
]

const statusConfig: Record<string, { label: string; badge: string }> = {
  published: { label: "已发布", badge: "bg-emerald-100 text-emerald-700" },
  draft: { label: "草稿", badge: "bg-amber-100 text-amber-700" },
  archived: { label: "已归档", badge: "bg-gray-100 text-gray-700" },
}

export default function PracticalTasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">实训任务单</h1>
          <p className="text-muted-foreground mt-1">绑定线下实践/实训任务，支撑混合式课程课中实施</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-1" /> 新建实训任务</Button>
      </div>

      <ClassSchedulePicker />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{tasks.length}</div>
            <div className="text-xs text-muted-foreground">实训任务总数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{tasks.filter((t) => t.status === "published").length}</div>
            <div className="text-xs text-muted-foreground">已发布</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{tasks.filter((t) => t.status === "draft").length}</div>
            <div className="text-xs text-muted-foreground">草稿</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{new Set(tasks.map((t) => t.scene)).size}</div>
            <div className="text-xs text-muted-foreground">关联实训场景</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            实训任务列表
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => {
            const cfg = statusConfig[task.status] || statusConfig.draft
            return (
              <div key={task.id} className="rounded-lg border p-4 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{task.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {task.course} · {task.className}
                      </div>
                    </div>
                  </div>
                  <Badge className={cfg.badge}>{cfg.label}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>类型：{task.bindType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>场景：{task.scene}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>完成度：</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Progress value={task.progress} className="flex-1 h-2" />
                  <span className="text-sm font-medium shrink-0">{task.progress}%</span>
                  <Button variant="ghost" size="sm" className="shrink-0 h-7">
                    <Eye className="h-3.5 w-3.5 mr-1" />详情
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
