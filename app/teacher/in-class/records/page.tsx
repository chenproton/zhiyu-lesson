"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CalendarDays, Users, FileText, Download, ChevronDown, ChevronUp } from "lucide-react"

const records = [
  {
    id: "r1",
    courseName: "SQL注入漏洞检测与利用",
    className: "软件工程2301班",
    date: "2026-05-12",
    time: "08:00-09:40",
    duration: "1小时40分",
    attendance: { total: 45, present: 42, rate: 93 },
    quizAvg: 82,
    interactions: 5,
  },
  {
    id: "r2",
    courseName: "渗透测试基础",
    className: "软件工程2301班",
    date: "2026-05-10",
    time: "10:00-11:40",
    duration: "1小时40分",
    attendance: { total: 45, present: 40, rate: 89 },
    quizAvg: 78,
    interactions: 4,
  },
  {
    id: "r3",
    courseName: "XSS跨站脚本防御",
    className: "网络安全2302班",
    date: "2026-05-08",
    time: "14:00-15:40",
    duration: "1小时40分",
    attendance: { total: 38, present: 36, rate: 95 },
    quizAvg: 85,
    interactions: 6,
  },
]

export default function ClassRecordsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">课堂记录</h1>
          <p className="text-muted-foreground mt-1">查看所有历史课堂的出勤、互动与测验数据</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="h-4 w-4" />
          导出 Excel
        </Button>
      </div>

      <div className="space-y-4">
        {records.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{r.courseName}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {r.date} {r.time}
                      </span>
                      <span>{r.className}</span>
                      <span>时长：{r.duration}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                >
                  {expandedId === r.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>

              {expandedId === r.id && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-green-50 border-green-100">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">出勤情况</span>
                        </div>
                        <p className="text-lg font-bold text-green-800 mt-1">
                          {r.attendance.present} / {r.attendance.total}
                        </p>
                        <p className="text-xs text-green-600">出勤率 {r.attendance.rate}%</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-100">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-700">随堂测验平均分</span>
                        </div>
                        <p className="text-lg font-bold text-blue-800 mt-1">{r.quizAvg} 分</p>
                        <p className="text-xs text-blue-600">共 3 题 / 满分 30 分</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-100">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-purple-700">课堂互动</span>
                        </div>
                        <p className="text-lg font-bold text-purple-800 mt-1">{r.interactions} 次</p>
                        <p className="text-xs text-purple-600">签到/抢答/点名/讨论</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">出勤明细</h4>
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="text-xs">姓名</TableHead>
                            <TableHead className="text-xs">学号</TableHead>
                            <TableHead className="text-xs">签到时间</TableHead>
                            <TableHead className="text-xs">签到方式</TableHead>
                            <TableHead className="text-xs">状态</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {["李明", "王芳", "张伟", "刘洋", "陈静"].map((name, i) => (
                            <TableRow key={i}>
                              <TableCell className="text-sm">{name}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">20230100{10 + i}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {i < 4 ? "08:02" : "—"}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {i < 4 ? "普通签到" : "—"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={
                                    i < 4
                                      ? "bg-green-50 text-green-600 text-xs"
                                      : "bg-red-50 text-red-600 text-xs"
                                  }
                                >
                                  {i < 4 ? "出勤" : "缺勤"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
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
