"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { ClassSchedulePicker } from "../_components/class-schedule-picker"

const gradePreview = [
  { id: "s1", name: "李明", video: 90, homework: 88, quiz: 85, sign: 100, interaction: 82, practice: 85, total: 88.1 },
  { id: "s2", name: "王芳", video: 95, homework: 92, quiz: 90, sign: 100, interaction: 88, practice: 90, total: 91.6 },
  { id: "s3", name: "张伟", video: 78, homework: 75, quiz: 72, sign: 90, interaction: 70, practice: 75, total: 75.4 },
]

export default function OnlineGradesPage() {
  const handleRecalculate = () => {
    toast.success("线上成绩已按成绩规则重新计算")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">线上成绩自动计算</h1>
          <p className="text-muted-foreground mt-1">根据成绩规则配置，自动计算各维度线上过程成绩</p>
        </div>
        <Button onClick={handleRecalculate}><Calculator className="h-4 w-4 mr-1" /> 重新计算</Button>
      </div>

      <ClassSchedulePicker />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">线上成绩明细</CardTitle>
          <Badge variant="outline">已按成绩规则自动计算</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>学生</TableHead>
                <TableHead>视频(20%)</TableHead>
                <TableHead>作业(25%)</TableHead>
                <TableHead>测验(20%)</TableHead>
                <TableHead>签到(10%)</TableHead>
                <TableHead>表现(15%)</TableHead>
                <TableHead>实训(10%)</TableHead>
                <TableHead>线上总评</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradePreview.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.video}</TableCell>
                  <TableCell>{s.homework}</TableCell>
                  <TableCell>{s.quiz}</TableCell>
                  <TableCell>{s.sign}</TableCell>
                  <TableCell>{s.interaction}</TableCell>
                  <TableCell>{s.practice}</TableCell>
                  <TableCell className="font-bold">{s.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
