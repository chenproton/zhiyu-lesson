"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Layers, Plus, BookOpen, Microscope, Briefcase, Database, MonitorPlay, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const resources = [
  { id: "r1", name: "Web前端开发体系课", type: "体系课", icon: BookOpen, options: ["HTML/CSS基础", "JavaScript核心", "Vue框架应用", "React进阶"] },
  { id: "r2", name: "CSS选择器颗粒微课", type: "颗粒课", icon: Microscope, options: ["基础选择器", "组合选择器", "伪类选择器", "属性选择器"] },
  { id: "r3", name: "企业官网实战场景任务", type: "场景任务", icon: Briefcase, options: ["首页布局", "响应式适配", "交互效果", "部署上线"] },
  { id: "r4", name: "Web前端单元测试题库", type: "题库", icon: Database, options: ["HTML基础题", "CSS布局题", "JS语法题", "综合应用题"] },
  { id: "r5", name: "响应式布局虚拟仿真", type: "虚拟仿真", icon: MonitorPlay, options: ["Flexbox仿真", "Grid仿真", "媒体查询仿真", "移动端适配仿真"] },
]

export default function CourseBuilderPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<typeof resources[0] | null>(null)
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({})

  const openDialog = (resource: typeof resources[0]) => {
    setSelectedResource(resource)
    setDialogOpen(true)
  }

  const toggleItem = (item: string) => {
    if (!selectedResource) return
    setSelectedItems((prev) => {
      const list = prev[selectedResource.id] || []
      const exists = list.includes(item)
      return {
        ...prev,
        [selectedResource.id]: exists ? list.filter((i) => i !== item) : [...list, item],
      }
    })
  }

  const handleConfirm = () => {
    if (!selectedResource) return
    const count = selectedItems[selectedResource.id]?.length || 0
    toast.success(`已引用 ${selectedResource.name} 下的 ${count} 个资源`)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">资源组课工作台</h1>
          <p className="text-muted-foreground mt-1">引用体系课、颗粒课、产业案例、项目任务、题库、课件、虚拟仿真资源进行组课</p>
        </div>
        <Link href="/admin/builder/new">
          <Button><Plus className="h-4 w-4 mr-1" /> 新建组课</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">可引用资源</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {resources.map((r) => {
            const Icon = r.icon
            const count = selectedItems[r.id]?.length || 0
            return (
              <div key={r.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => openDialog(r)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{r.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{r.type}</Badge>
                      {count > 0 && <Badge>已引用 {count} 项</Badge>}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openDialog(r) }}>引用</Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedResource && <>
                {(() => {
                  const Icon = selectedResource.icon
                  return <Icon className="h-5 w-5 text-blue-500" />
                })()}
                引用 {selectedResource?.name}
              </>}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {selectedResource?.options.map((option) => {
              const checked = selectedItems[selectedResource.id]?.includes(option) || false
              return (
                <label
                  key={option}
                  onClick={() => toggleItem(option)}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${checked ? "bg-blue-50 border-blue-300" : "hover:bg-muted/50"}`}
                >
                  <Checkbox checked={checked} />
                  <span className="text-sm">{option}</span>
                </label>
              )
            })}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleConfirm}>
              <CheckCircle2 className="h-4 w-4 mr-1" /> 确认引用
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
