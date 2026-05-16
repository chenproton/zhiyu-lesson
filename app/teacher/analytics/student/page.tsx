"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Search, Send, Bookmark, Clock, Award, TrendingUp, AlertTriangle } from "lucide-react"

const learningHours = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}日`,
  hours: Math.random() > 0.3 ? Math.round(Math.random() * 4 * 10) / 10 : 0,
}))

const gradeTrend = [
  { course: "SQL注入", score: 88 },
  { course: "渗透测试", score: 82 },
  { course: "XSS防御", score: 90 },
  { course: "密码学", score: 78 },
  { course: "协议分析", score: 85 },
]

const weakPoints = [
  { name: "SQL注入进阶技巧", wrong: 5, total: 8, node: "第二章·2.3" },
  { name: "渗透测试报告撰写", wrong: 4, total: 6, node: "第四章·4.3" },
  { name: "会话固定攻击", wrong: 3, total: 5, node: "第三章·3.2" },
]

export default function StudentAnalyticsPage() {
  const [search, setSearch] = useState("")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">学生个体分析</h1>
        <p className="text-muted-foreground mt-1">搜索学生，查看个体学习画像与薄弱点</p>
      </div>

      {/* 搜索 */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="输入学号或姓名搜索学生..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* 学生画像 */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
              李
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">李明</h2>
                <Badge variant="secondary">学号：202301001</Badge>
                <Badge className="bg-yellow-100 text-yellow-700">重点关注</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                软件工程2301班 · 本学期 4 门课程 · 总学习时长 45 小时
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1">
                <Bookmark className="h-3.5 w-3.5" />
                标记关注
              </Button>
              <Button size="sm" className="gap-1">
                <Send className="h-3.5 w-3.5" />
                发送提醒
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              近30天学习时长趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={learningHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              各课程总评成绩
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={gradeTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              薄弱知识点
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakPoints.map((wp) => (
              <div key={wp.name} className="p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800">{wp.name}</span>
                  <Badge variant="secondary" className="bg-red-100 text-red-600 text-xs">
                    错误 {wp.wrong}/{wp.total}
                  </Badge>
                </div>
                <p className="text-xs text-red-600 mt-1">关联节点：{wp.node}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" />
              课堂表现
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "出勤率", value: "95%", color: "text-green-600" },
              { label: "抢答参与", value: "8 次", color: "text-blue-600" },
              { label: "点名应答率", value: "100%", color: "text-green-600" },
              { label: "随堂测验平均分", value: "85 分", color: "text-blue-600" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
