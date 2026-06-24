"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, FolderOpen, Layers, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { ClassSchedulePicker } from "../_components/class-schedule-picker"

const templates = [
  { id: "t1", name: "Web前端开发混合课程模板", type: "混合式", usage: 5, source: "2026-2027-1 优秀课程" },
  { id: "t2", name: "软件测试技术混合课程模板", type: "混合式", usage: 3, source: "2025-2026-2 优秀课程" },
  { id: "t3", name: "机器学习混合课程模板", type: "混合式", usage: 2, source: "2025-2026-2 优秀课程" },
]

const semesters = ["2026-2027-1", "2026-2027-2", "2027-2028-1", "2027-2028-2"]

export default function ResourceReusePage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null)
  const [courseName, setCourseName] = useState("")
  const [semester, setSemester] = useState(semesters[0])
  const [className, setClassName] = useState("")

  const openDialog = (t: typeof templates[0]) => {
    setSelectedTemplate(t)
    setCourseName(`${t.name}（复用）`)
    setSemester(semesters[0])
    setClassName("")
    setDialogOpen(true)
  }

  const handleConfirm = () => {
    if (!courseName) {
      toast.error("请输入课程名称")
      return
    }
    toast.success(`已复用模板「${selectedTemplate?.name}」创建课程：${courseName}`)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">资源复用</h1>
        <p className="text-muted-foreground mt-1">结课后的课程资源自动保留在资源库，下学期可直接复用开课</p>
      </div>

      <ClassSchedulePicker />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">可复用课程模板/课程包</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {templates.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{t.name}</h3>
                    <Badge variant="outline">{t.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">来源：{t.source} · 已使用 {t.usage} 次</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => openDialog(t)}>
                <Copy className="h-4 w-4 mr-1" /> 一键复用
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5 text-purple-500" /> 一键复用
            </DialogTitle>
            <DialogDescription>
              基于「{selectedTemplate?.name}」创建新学期课程
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>课程名称</Label>
              <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="请输入新课程名称" />
            </div>
            <div className="space-y-2">
              <Label>开课学期</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {semesters.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>上课班级</Label>
              <Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="如：软件工程2026级1班" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleConfirm}>
              <CheckCircle2 className="h-4 w-4 mr-1" /> 确认复用
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
