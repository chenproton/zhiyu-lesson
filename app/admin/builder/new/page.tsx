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
import { ArrowLeft, Save, BookOpen, Microscope, Briefcase, Database, MonitorPlay } from "lucide-react"

const resourceTypes = [
  { id: "system", label: "体系课", icon: BookOpen },
  { id: "granular", label: "颗粒课", icon: Microscope },
  { id: "task", label: "场景任务", icon: Briefcase },
  { id: "question", label: "题库", icon: Database },
  { id: "simulation", label: "虚拟仿真", icon: MonitorPlay },
]

const mockResources = [
  { id: "r1", name: "Web前端开发体系课", type: "system" },
  { id: "r2", name: "CSS选择器颗粒微课", type: "granular" },
  { id: "r3", name: "企业官网实战场景任务", type: "task" },
  { id: "r4", name: "Web前端单元测试题库", type: "question" },
  { id: "r5", name: "响应式布局虚拟仿真", type: "simulation" },
]

export default function NewBuilderPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [type, setType] = useState("混合式")
  const [selectedResources, setSelectedResources] = useState<string[]>([])
  const [description, setDescription] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/builder">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> 返回</Button>
          </Link>
          <h1 className="text-2xl font-semibold">新建组课</h1>
        </div>
        <Button onClick={() => router.push("/admin/builder")}><Save className="h-4 w-4 mr-1" /> 保存组课</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">组课信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>组课名称</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入组课名称" />
            </div>
            <div className="space-y-2">
              <Label>课程类型</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["混合式", "纯在线", "纯线下"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>组课说明</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="请输入组课说明..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">引用资源</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockResources.map((r) => {
            const rt = resourceTypes.find((t) => t.id === r.type)
            const Icon = rt?.icon || BookOpen
            const checked = selectedResources.includes(r.id)
            return (
              <div key={r.id} onClick={() => setSelectedResources((prev) => checked ? prev.filter((id) => id !== r.id) : [...prev, r.id])} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${checked ? "bg-blue-50 border-blue-300" : "hover:bg-muted/50"}`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Icon className="h-5 w-5" /></div>
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{rt?.label}</p>
                  </div>
                </div>
                <input type="checkbox" checked={checked} readOnly className="h-4 w-4" />
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
