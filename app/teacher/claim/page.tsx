"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Calendar, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const initialClasses = [
  { id: "cls-1", name: "软件工程2026级1班", course: "Web前端开发混合课程", term: "2026-2027-1", students: 42, status: "pending" },
  { id: "cls-2", name: "软件工程2026级2班", course: "软件测试技术混合课程", term: "2026-2027-1", students: 40, status: "claimed" },
  { id: "cls-3", name: "人工智能2026级1班", course: "机器学习混合课程", term: "2026-2027-1", students: 38, status: "pending" },
]

export default function ClassClaimPage() {
  const [classes, setClasses] = useState(initialClasses)
  const pendingCount = classes.filter((c) => c.status === "pending").length
  const claimedCount = classes.filter((c) => c.status === "claimed").length

  const handleClaim = (id: string) => {
    setClasses((prev) => prev.map((c) => c.id === id ? { ...c, status: "claimed" } : c))
    const cls = classes.find((c) => c.id === id)
    toast.success(`已成功认领 ${cls?.course} · ${cls?.name}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">教学班认领</h1>
        <p className="text-muted-foreground mt-1">从教务平台接收的教学班列表中认领，自动带入班级、学生、学期、课表</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">待认领班级</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">已认领班级</p>
                <p className="text-2xl font-bold">{claimedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Users className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">覆盖学生</p>
                <p className="text-2xl font-bold">120</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">待认领教学班</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{cls.course}</h3>
                  <Badge variant={cls.status === "claimed" ? "default" : "outline"}>
                    {cls.status === "claimed" ? "已认领" : "待认领"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{cls.name} · {cls.students}人 · {cls.term}</p>
              </div>
              <Button
                variant={cls.status === "claimed" ? "outline" : "default"}
                disabled={cls.status === "claimed"}
                onClick={() => handleClaim(cls.id)}
              >
                {cls.status === "claimed" ? "已认领" : "认领班级"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
