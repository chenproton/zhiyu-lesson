"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { MonitorPlay, Download, ClipboardCheck, FileBarChart } from "lucide-react"

const videoData = [
  { course: "SQL注入", completion: 88 },
  { course: "渗透测试", completion: 75 },
  { course: "XSS防御", completion: 92 },
  { course: "密码学", completion: 68 },
  { course: "协议分析", completion: 80 },
]

const downloadData = [
  { name: "数据分析基础-第一章.pdf", count: 156 },
  { name: "假设检验案例演示.pptx", count: 132 },
  { name: "T检验实战数据集.csv", count: 98 },
  { name: "渗透测试工具清单.xlsx", count: 87 },
  { name: "安全编码规范指南.pdf", count: 76 },
]

const homeworkData = [
  { name: "第1次作业", rate: 95 },
  { name: "第2次作业", rate: 92 },
  { name: "第3次作业", rate: 88 },
  { name: "第4次作业", rate: 90 },
  { name: "第5次作业", rate: 85 },
  { name: "第6次作业", rate: 89 },
]

const quizAnalysis = [
  { name: "单元测验1", avg: 82, std: 8.5 },
  { name: "单元测验2", avg: 78, std: 12.3 },
  { name: "单元测验3", avg: 85, std: 7.2 },
  { name: "期中测验", avg: 80, std: 10.1 },
  { name: "单元测验4", avg: 88, std: 6.8 },
]

export default function ResourceAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">资源分析</h1>
        <p className="text-muted-foreground mt-1">分析教学资源的使用情况与学习效果</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MonitorPlay className="h-4 w-4 text-blue-500" />
              视频观看完成率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={videoData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="course" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip />
                <Bar dataKey="completion" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Download className="h-4 w-4 text-green-500" />
              课件下载排名
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {downloadData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-5">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.name}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{item.count} 次</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-purple-500" />
              作业提交率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={homeworkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="rate" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileBarChart className="h-4 w-4 text-orange-500" />
              测验难度分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={quizAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={2} name="平均分" />
                <Line type="monotone" dataKey="std" stroke="#94a3b8" strokeWidth={2} name="标准差" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
