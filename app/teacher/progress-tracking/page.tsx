"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, BookOpen, ClipboardCheck, UserCheck, Send } from "lucide-react"
import { ClassSchedulePicker } from "../_components/class-schedule-picker"

const scoreDist = [
  { range: "90-100", count: 8 },
  { range: "80-89", count: 15 },
  { range: "70-79", count: 12 },
  { range: "60-69", count: 7 },
  { range: "<60", count: 3 },
]

const attendanceTrend = [
  { week: "第1周", rate: 95 },
  { week: "第2周", rate: 93 },
  { week: "第3周", rate: 90 },
  { week: "第4周", rate: 92 },
  { week: "第5周", rate: 88 },
  { week: "第6周", rate: 91 },
  { week: "第7周", rate: 94 },
  { week: "第8周", rate: 89 },
]

const homeworkTrend = [
  { week: "第1周", rate: 92 },
  { week: "第2周", rate: 88 },
  { week: "第3周", rate: 85 },
  { week: "第4周", rate: 90 },
  { week: "第5周", rate: 87 },
  { week: "第6周", rate: 91 },
  { week: "第7周", rate: 89 },
  { week: "第8周", rate: 93 },
]

const students = [
  { name: "李明", id: "202301001", hours: 45, hwAvg: 88, quizAvg: 85, attendance: 95, total: 86 },
  { name: "王芳", id: "202301002", hours: 52, hwAvg: 92, quizAvg: 90, attendance: 98, total: 91 },
  { name: "张伟", id: "202301003", hours: 38, hwAvg: 78, quizAvg: 72, attendance: 85, total: 76 },
  { name: "刘洋", id: "202301004", hours: 42, hwAvg: 85, quizAvg: 88, attendance: 92, total: 84 },
  { name: "陈静", id: "202301005", hours: 48, hwAvg: 90, quizAvg: 86, attendance: 96, total: 88 },
]

export default function ClassAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">班级学情</h1>
        <p className="text-muted-foreground mt-1">查看班级整体学习数据与趋势分析</p>
      </div>

      <ClassSchedulePicker />

      {/* 核心指标 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-green-100 text-green-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">平均出勤率</p>
                <p className="text-2xl font-bold">91%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">作业提交率</p>
                <p className="text-2xl font-bold">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-100 text-purple-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">平均测验得分</p>
                <p className="text-2xl font-bold">83.5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-orange-100 text-orange-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">平均学习进度</p>
                <p className="text-2xl font-bold">72%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">成绩分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={scoreDist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">出勤率趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">作业提交趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={homeworkTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">知识点掌握热力图（示意）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => {
                const intensity = Math.random()
                const bg = intensity > 0.7 ? "bg-green-500" : intensity > 0.4 ? "bg-green-300" : "bg-green-100"
                return <div key={i} className={`h-8 rounded ${bg}`} title={`学生${(i % 5) + 1} · 知识点${Math.floor(i / 5) + 1}`} />
              })}
            </div>
            <div className="flex items-center justify-end gap-2 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 rounded" />薄弱</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-300 rounded" />一般</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded" />掌握</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 学生排名 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">学生排名</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs">姓名</TableHead>
                  <TableHead className="text-xs">学号</TableHead>
                  <TableHead className="text-xs">学习时长</TableHead>
                  <TableHead className="text-xs">作业均分</TableHead>
                  <TableHead className="text-xs">测验均分</TableHead>
                  <TableHead className="text-xs">出勤率</TableHead>
                  <TableHead className="text-xs">总评</TableHead>
                  <TableHead className="text-xs">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-sm font-medium">{s.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.id}</TableCell>
                    <TableCell className="text-sm">{s.hours}h</TableCell>
                    <TableCell className="text-sm">{s.hwAvg}</TableCell>
                    <TableCell className="text-sm">{s.quizAvg}</TableCell>
                    <TableCell className="text-sm">{s.attendance}%</TableCell>
                    <TableCell className="text-sm font-semibold">{s.total}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Send className="h-3.5 w-3.5" />
                        提醒
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
