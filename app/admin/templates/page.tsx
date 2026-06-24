"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layers, Plus, Copy, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const templates = [
  { id: "t1", name: "Web前端开发混合课程包", type: "混合式", tags: ["专业核心", "优秀课程"], usage: 5 },
  { id: "t2", name: "软件测试技术课程包", type: "混合式", tags: ["专业核心"], usage: 3 },
  { id: "t3", name: "Python程序设计体系课包", type: "纯在线", tags: ["专业基础"], usage: 8 },
]

const semesters = ["2026-2027-1", "2026-2027-2", "2027-2028-1", "2027-2028-2"]

export default function TemplatesPage() {
  const router = useRouter()
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
    toast.success(`已使用模板「${selectedTemplate?.name}」创建课程：${courseName}`)
    setDialogOpen(false)
    router.push("/admin/hybrid")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">课程模板/课程包</h1>
          <p className="text-muted-foreground mt-1">优秀课程沉淀为模板，跨学期/跨教师一键复用</p>
        </div>
        <Link href="/admin/templates/new">
          <Button><Plus className="h-4 w-4 mr-1" /> 新建模板</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">课程模板库</CardTitle>
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
                  <div className="flex items-center gap-2 mt-1">
                    {t.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-full">{tag}</span>
                    ))}
                    <span className="text-xs text-muted-foreground">已复用 {t.usage} 次</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => openDialog(t)}>
                <Copy className="h-4 w-4 mr-1" /> 使用模板
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5 text-purple-500" /> 使用模板
            </DialogTitle>
            <DialogDescription>
              基于「{selectedTemplate?.name}」创建新课程
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
              <CheckCircle2 className="h-4 w-4 mr-1" /> 确认创建
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
