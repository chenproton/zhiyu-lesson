"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Upload, Plus, X, FileUp } from "lucide-react"
import { toast } from "sonner"
import { ClassSchedulePicker } from "../_components/class-schedule-picker"

const initialMaterials: Record<string, string[]> = {
  教案: ["第1章教案.docx", "第2章教案.docx"],
  课件PPT: ["课程导论.pptx"],
  实训任务单: [],
  电子讲义: [],
}

export default function SyllabusPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogLabel, setDialogLabel] = useState("")
  const [materials, setMaterials] = useState(initialMaterials)
  const [uploadFile, setUploadFile] = useState("")

  const openDialog = (label: string) => {
    setDialogLabel(label)
    setUploadFile("")
    setDialogOpen(true)
  }

  const handleUpload = () => {
    if (!uploadFile) {
      toast.error("请输入文件名")
      return
    }
    setMaterials((prev) => ({
      ...prev,
      [dialogLabel]: [...(prev[dialogLabel] || []), uploadFile],
    }))
    toast.success(`已上传 ${dialogLabel}：${uploadFile}`)
    setUploadFile("")
  }

  const removeFile = (label: string, file: string) => {
    setMaterials((prev) => ({
      ...prev,
      [label]: prev[label].filter((f) => f !== file),
    }))
    toast.success(`已移除 ${file}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">教学大纲与教案</h1>
        <p className="text-muted-foreground mt-1">在线编辑课程大纲、上传教案、课件、实训任务单</p>
      </div>

      <ClassSchedulePicker />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">课程教学大纲</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>课程目标</Label>
              <Textarea rows={4} placeholder="请输入课程教学目标..." />
            </div>
            <div className="space-y-2">
              <Label>教学内容与学时安排</Label>
              <Textarea rows={6} placeholder="请输入教学内容与学时安排..." />
            </div>
            <div className="space-y-2">
              <Label>考核方式</Label>
              <Textarea rows={3} placeholder="请输入考核方式..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">教学资料</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["教案", "课件PPT", "实训任务单", "电子讲义"].map((label) => (
              <div key={label} onClick={() => openDialog(label)} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">点击上传或管理{label}</p>
              </div>
            ))}
            <Button className="w-full" variant="outline" onClick={() => openDialog("教案")}>
              <Upload className="h-4 w-4 mr-1" /> 批量上传资料
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5 text-blue-500" /> 管理{dialogLabel}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>上传新文件</Label>
              <div className="flex gap-2">
                <Input value={uploadFile} onChange={(e) => setUploadFile(e.target.value)} placeholder="输入文件名，如：第3章教案.docx" />
                <Button onClick={handleUpload}>
                  <Plus className="h-4 w-4 mr-1" /> 添加
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>已上传文件</Label>
              <div className="space-y-2">
                {materials[dialogLabel]?.length > 0 ? (
                  materials[dialogLabel].map((file) => (
                    <div key={file} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{file}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFile(dialogLabel, file)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">暂无{dialogLabel}，请上传</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
