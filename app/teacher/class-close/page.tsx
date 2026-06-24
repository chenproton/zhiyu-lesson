"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Lock, Archive, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { ClassSchedulePicker } from "../_components/class-schedule-picker"

const initialClasses = [
  { id: "c1", name: "Web前端开发混合课程", className: "软件工程2026级1班", term: "2026-2027-1", status: "active" },
  { id: "c2", name: "软件测试技术混合课程", className: "软件工程2026级2班", term: "2026-2027-1", status: "active" },
  { id: "c3", name: "机器学习混合课程", className: "人工智能2026级1班", term: "2025-2026-2", status: "closed" },
]

export default function ClassClosePage() {
  const [classes, setClasses] = useState(initialClasses)

  const handleClose = (id: string) => {
    setClasses((prev) => prev.map((c) => c.id === id ? { ...c, status: "closed" } : c))
    toast.success("教学班已结课，成绩已锁定")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">教学班结课</h1>
        <p className="text-muted-foreground mt-1">到达结课时间或教师手动结课，冻结教学班，关闭学习入口</p>
      </div>

      <ClassSchedulePicker />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">教学班列表</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{cls.name}</h3>
                  <Badge variant={cls.status === "closed" ? "secondary" : "default"}>
                    {cls.status === "closed" ? "已结课" : "教学中"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{cls.className} · {cls.term}</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={cls.status === "closed" ? "outline" : "default"} disabled={cls.status === "closed"}>
                    <Lock className="h-4 w-4 mr-1" /> {cls.status === "closed" ? "已冻结" : "结课"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认结课？</AlertDialogTitle>
                    <AlertDialogDescription>
                      结课后该教学班将冻结，学生无法继续学习，过程成绩将锁定并推送至教务平台。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleClose(cls.id)}>确认结课</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
