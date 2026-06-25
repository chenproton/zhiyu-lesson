"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, CheckCircle2, AlertCircle, FileText } from "lucide-react"
import { ClassSchedulePicker } from "../../../../teacher/_components/class-schedule-picker"
import { toast } from "sonner"

const assessmentItems = [
  { id: "a1", name: "视频学习", weight: 20, avgScore: 88, status: "collected" },
  { id: "a2", name: "作业", weight: 25, avgScore: 85, status: "collected" },
  { id: "a3", name: "单元测验", weight: 20, avgScore: 82, status: "collected" },
  { id: "a4", name: "签到", weight: 10, avgScore: 95, status: "collected" },
  { id: "a5", name: "课堂表现", weight: 15, avgScore: 80, status: "collecting" },
  { id: "a6", name: "实训实践", weight: 10, avgScore: 78, status: "collecting" },
]

export function FinalAssessmentTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">平台自动汇总观看时长、作业得分、测验得分、签到、互动等过程数据</p>
        <Button size="sm" onClick={() => toast.success("生成考核报告（演示）")}>
          <FileText className="h-4 w-4 mr-1" /> 生成考核报告
        </Button>
      </div>

      <ClassSchedulePicker />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BarChart3 className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">班级平均分</p>
                <p className="text-2xl font-bold">84.5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">数据采集完成度</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><AlertCircle className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">需关注学生</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><FileText className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">待归档资料</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">过程性考核维度汇总</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assessmentItems.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="outline">{item.weight}%</Badge>
                  <Badge variant={item.status === "collected" ? "default" : "secondary"}>
                    {item.status === "collected" ? "已汇总" : "采集中"}
                  </Badge>
                </div>
                <span className="text-sm font-medium">平均分 {item.avgScore}</span>
              </div>
              <Progress value={item.avgScore} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
