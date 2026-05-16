"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Clock,
  Download,
  FileText,
  GraduationCap,
  MonitorPlay,
  StickyNote,
  Award,
  CalendarDays,
} from "lucide-react"

export default function ArchivePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">学习档案</h1>
        <p className="text-muted-foreground mt-1">查看你的学习过程统计与成绩汇总</p>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
              张
            </div>
            <div>
              <h2 className="text-lg font-semibold">张同学</h2>
              <p className="text-sm text-muted-foreground">学号：2023010001 · 软件工程专业 · 2023级</p>
            </div>
            <div className="ml-auto">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-4 w-4" />
                导出 PDF 档案
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 学习过程统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600">
                <MonitorPlay className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">已观看视频</p>
                <p className="text-xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-green-100 text-green-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">已阅读课件</p>
                <p className="text-xl font-bold">38</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-100 text-purple-600">
                <StickyNote className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">作业提交</p>
                <p className="text-xl font-bold">16</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-orange-100 text-orange-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">测验参与</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              学习时长统计
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "今日", value: 2.5, unit: "小时" },
              { label: "本周", value: 12.5, unit: "小时" },
              { label: "本月", value: 48.0, unit: "小时" },
              { label: "本学期", value: 186.0, unit: "小时" },
              { label: "累计", value: 420.0, unit: "小时" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold">
                  {item.value} {item.unit}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-green-500" />
              学习活跃度
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "登录次数", value: "128 次" },
              { label: "本月登录天数", value: "18 天" },
              { label: "连续学习天数", value: "5 天" },
              { label: "课堂互动参与", value: "32 次" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 教师评价 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            教师评价
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-xs text-blue-600 font-medium mb-1">系统自动评价</p>
            <p className="text-sm text-blue-800">
              学习积极，能够按时完成课程任务。建议加强课后复习，深化对核心知识点的理解。
            </p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border border-green-100">
            <p className="text-xs text-green-600 font-medium mb-1">教师人工评语</p>
            <p className="text-sm text-green-800">
              该生在本学期表现优异，作业完成质量高，课堂参与积极。希望在项目实践中继续发挥主动性。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
