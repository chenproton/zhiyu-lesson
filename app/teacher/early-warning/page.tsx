"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Bell, Mail, Clock } from "lucide-react"
import { ClassSchedulePicker } from "../_components/class-schedule-picker"

const warnings = [
  { id: "w1", student: "张三", type: "未预习", course: "Web前端开发混合课程", time: "2天前", level: "high" },
  { id: "w2", student: "李四", type: "未提交作业", course: "Web前端开发混合课程", time: "1天前", level: "high" },
  { id: "w3", student: "王五", type: "缺勤", course: "软件测试技术混合课程", time: "3天前", level: "medium" },
  { id: "w4", student: "赵六", type: "视频学习进度低", course: "机器学习混合课程", time: "5天前", level: "medium" },
]

export default function EarlyWarningPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">预警提醒</h1>
          <p className="text-muted-foreground mt-1">未预习、未作业、未签到等学习异常自动预警与消息推送</p>
        </div>
        <Button variant="outline"><Bell className="h-4 w-4 mr-1" /> 推送设置</Button>
      </div>

      <ClassSchedulePicker />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">高风险预警</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Clock className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">中风险预警</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Mail className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">今日已推送</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">学习异常预警列表</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {warnings.map((w) => (
            <div key={w.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${w.level === "high" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{w.student}</span>
                    <Badge variant="destructive">{w.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{w.course} · {w.time}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">提醒学生</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
