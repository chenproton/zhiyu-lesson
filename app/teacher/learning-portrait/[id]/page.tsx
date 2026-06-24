"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, BookOpen, Activity, Award } from "lucide-react"

const portraits: Record<string, { name: string; className: string; stats: { label: string; value: number }[]; tags: string[]; advice: string }> = {
  s1: {
    name: "李明",
    className: "软件工程2026级1班",
    stats: [
      { label: "自主学习能力", value: 85 },
      { label: "协作能力", value: 78 },
      { label: "实践能力", value: 90 },
      { label: "理论掌握", value: 72 },
    ],
    tags: ["视觉型学习者", "前端开发优势", "需加强理论"],
    advice: "建议多参与理论课程讨论，巩固基础知识。",
  },
}

export default function PortraitDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const data = portraits[id] || portraits["s1"]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/teacher/learning-portrait">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> 返回</Button>
        </Link>
        <h1 className="text-2xl font-semibold">学习画像详情</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">{data.name[0]}</div>
            <div>
              <h2 className="text-xl font-semibold">{data.name}</h2>
              <p className="text-sm text-muted-foreground">{data.className}</p>
              <div className="flex gap-2 mt-2">
                {data.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">能力维度</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {data.stats.map((s) => (
            <div key={s.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{s.label}</span>
                <span>{s.value}%</span>
              </div>
              <Progress value={s.value} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">学习建议</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{data.advice}</p>
        </CardContent>
      </Card>
    </div>
  )
}
