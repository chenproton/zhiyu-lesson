"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { FileText, Download, Archive, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { ClassSchedulePicker } from "../_components/class-schedule-picker"

const initialItems = [
  { id: "a1", name: "Web前端开发混合课程-归档包", className: "软件工程2026级1班", size: "128MB", status: "generated" },
  { id: "a2", name: "软件测试技术混合课程-归档包", className: "软件工程2026级2班", size: "96MB", status: "pending" },
]

export default function MaterialArchivePage() {
  const [items, setItems] = useState(initialItems)

  const handleGenerateAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, status: "generated" })))
    toast.success("已批量生成所有归档包")
  }

  const handleDownload = (name: string) => {
    toast.success(`开始下载：${name}`)
  }

  const handlePush = (id: string) => {
    const item = items.find((i) => i.id === id)
    toast.success(`${item?.name} 已推送至教务平台归档`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">教学资料归档</h1>
          <p className="text-muted-foreground mt-1">教案、课件、过程数据、成绩台账打包推送给教务平台归档</p>
        </div>
        <Button onClick={handleGenerateAll}><Archive className="h-4 w-4 mr-1" /> 批量归档</Button>
      </div>

      <ClassSchedulePicker />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">归档包列表</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.className} · {item.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={item.status === "generated" ? "default" : "outline"}>
                  {item.status === "generated" ? "已生成" : "待生成"}
                </Badge>
                <Button variant="outline" size="sm" disabled={item.status !== "generated"} onClick={() => handleDownload(item.name)}>
                  <Download className="h-4 w-4 mr-1" /> 下载
                </Button>
                {item.status === "generated" ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> 推送教务
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认推送归档？</AlertDialogTitle>
                        <AlertDialogDescription>
                          推送后 {item.name} 将归档至教务平台，请确认包内容完整。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handlePush(item.id)}>确认推送</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button size="sm" disabled>
                    <CheckCircle2 className="h-4 w-4 mr-1" /> 推送教务
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
