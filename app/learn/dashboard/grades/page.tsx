"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { GraduationCap, TrendingUp, Award, FileText } from "lucide-react"
import { courses } from "@/lib/mock-data"

const gradeData = courses.slice(0, 4).map((c) => ({
  courseId: c.id,
  courseName: c.name,
  teacher: c.teacher,
  usual: Math.floor(70 + Math.random() * 25),
  midterm: Math.floor(60 + Math.random() * 35),
  final: Math.floor(65 + Math.random() * 30),
  practice: Math.floor(75 + Math.random() * 20),
  total: 0,
  status: Math.random() > 0.3 ? "published" : "entering" as "published" | "entering" | "pending",
}))

gradeData.forEach((g) => {
  g.total = Math.round(g.usual * 0.2 + g.midterm * 0.2 + g.final * 0.5 + g.practice * 0.1)
})

const trendData = [
  { name: "第1周", usual: 78, midterm: 0, final: 0, total: 78 },
  { name: "第4周", usual: 82, midterm: 0, final: 0, total: 82 },
  { name: "第8周", usual: 85, midterm: 76, final: 0, total: 81 },
  { name: "第12周", usual: 88, midterm: 80, final: 0, total: 84 },
  { name: "第16周", usual: 90, midterm: 82, final: 85, total: 85 },
]

const compareData = [
  { name: "平时", self: 88, avg: 82 },
  { name: "期中", self: 82, avg: 78 },
  { name: "期末", self: 85, avg: 80 },
  { name: "总评", self: 85, avg: 80 },
]

const statusMap = {
  published: { label: "已发布", color: "bg-green-100 text-green-700" },
  entering: { label: "录入中", color: "bg-yellow-100 text-yellow-700" },
  pending: { label: "待发布", color: "bg-gray-100 text-gray-700" },
}

export default function GradesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">成绩查看</h1>
        <p className="text-muted-foreground mt-1">查看本学期各课程的成绩明细与趋势</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">本学期课程</p>
                <p className="text-2xl font-bold">{gradeData.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">已通过</p>
                <p className="text-2xl font-bold">{gradeData.filter((g) => g.total >= 60).length}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">平均绩点</p>
                <p className="text-2xl font-bold">3.42</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">平均成绩</p>
                <p className="text-2xl font-bold">{Math.round(gradeData.reduce((s, g) => s + g.total, 0) / gradeData.length)}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {gradeData.map((g) => (
          <Card key={g.courseId} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                    {g.courseName.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{g.courseName}</h3>
                    <p className="text-xs text-muted-foreground">{g.teacher}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{g.total}</p>
                    <p className="text-xs text-muted-foreground">总评成绩</p>
                  </div>
                  <Badge className={statusMap[g.status].color}>{statusMap[g.status].label}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(expandedId === g.courseId ? null : g.courseId)}
                  >
                    {expandedId === g.courseId ? "收起" : "展开"}
                  </Button>
                </div>
              </div>

              {expandedId === g.courseId && (
                <div className="mt-5 pt-5 border-t space-y-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-blue-50">
                      <p className="text-xs text-blue-600">平时成绩</p>
                      <p className="text-lg font-bold text-blue-700">{g.usual} <span className="text-xs font-normal">×20%</span></p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50">
                      <p className="text-xs text-green-600">期中成绩</p>
                      <p className="text-lg font-bold text-green-700">{g.midterm} <span className="text-xs font-normal">×20%</span></p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50">
                      <p className="text-xs text-purple-600">期末成绩</p>
                      <p className="text-lg font-bold text-purple-700">{g.final} <span className="text-xs font-normal">×50%</span></p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-50">
                      <p className="text-xs text-orange-600">实践成绩</p>
                      <p className="text-lg font-bold text-orange-700">{g.practice} <span className="text-xs font-normal">×10%</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">成绩趋势</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="总评" />
                            <Line type="monotone" dataKey="usual" stroke="#10b981" strokeWidth={2} name="平时" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">个人 vs 班级平均</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={compareData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="self" fill="#3b82f6" name="个人" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="avg" fill="#94a3b8" name="班级平均" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
