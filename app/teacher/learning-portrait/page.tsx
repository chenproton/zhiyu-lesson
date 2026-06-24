"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, TrendingUp, BookOpen, Activity } from "lucide-react"
import { ClassSchedulePicker } from "../_components/class-schedule-picker"

export default function LearningPortraitPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">学习画像</h1>
        <p className="text-muted-foreground mt-1">学生个人学习行为画像，为岗位能力画像提供学习侧数据</p>
      </div>

      <ClassSchedulePicker />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><User className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">已生成画像</p>
                <p className="text-2xl font-bold">120</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg"><TrendingUp className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">平均学习活跃度</p>
                <p className="text-2xl font-bold">82%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><BookOpen className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">知识掌握度</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">学生画像示例</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">李</div>
            <div className="flex-1">
              <h3 className="font-semibold">李明</h3>
              <p className="text-sm text-muted-foreground">软件工程2026级1班 · 学习风格：视觉型 · 优势领域：前端开发</p>
              <div className="mt-3 space-y-2">
                {[
                  { label: "自主学习能力", value: 85 },
                  { label: "协作能力", value: 78 },
                  { label: "实践能力", value: 90 },
                  { label: "理论掌握", value: 72 },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <Progress value={item.value} />
                  </div>
                ))}
              </div>
            </div>
            <Link href="/teacher/learning-portrait/s1">
              <Button variant="outline" size="sm">查看详情</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
