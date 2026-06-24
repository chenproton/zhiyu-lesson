"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { MonitorPlay, Users, Calendar, Save, BookOpen, BarChart3 } from "lucide-react"
import { ClassSchedulePicker } from "../_components/class-schedule-picker"

export default function CourseConfigPage() {
  const [config, setConfig] = useState({
    mode: "hybrid",
    onlineWeight: 40,
    offlineWeight: 60,
    onlineHours: 20,
    offlineHours: 28,
    startDate: "2026-09-01",
    endDate: "2027-01-15",
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">课程模式配置</h1>
        <p className="text-muted-foreground mt-1">选择混合式课程或纯在线课，配置线上线下成绩权重、开放学习时间、结课时间</p>
      </div>

      <ClassSchedulePicker />

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic"><BookOpen className="h-4 w-4 mr-1" /> 基本模式</TabsTrigger>
          <TabsTrigger value="grade"><BarChart3 className="h-4 w-4 mr-1" /> 成绩权重</TabsTrigger>
          <TabsTrigger value="time"><Calendar className="h-4 w-4 mr-1" /> 学习时间</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">课程模式</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setConfig({ ...config, mode: "hybrid" })}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${config.mode === "hybrid" ? "border-purple-500 bg-purple-50" : "hover:bg-muted/50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><MonitorPlay className="h-5 w-5" /></div>
                    <div>
                      <p className="font-medium">混合式课程</p>
                      <p className="text-xs text-muted-foreground">课前线上自主学习 + 课中线下智慧课堂 + 课后线上作业测验</p>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setConfig({ ...config, mode: "online" })}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${config.mode === "online" ? "border-blue-500 bg-blue-50" : "hover:bg-muted/50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><MonitorPlay className="h-5 w-5" /></div>
                    <div>
                      <p className="font-medium">纯在线课</p>
                      <p className="text-xs text-muted-foreground">完全线上自主学习，适合选修课、公开课等场景</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">成绩权重配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>线上成绩权重（%）</Label>
                  <Input type="number" value={config.onlineWeight} onChange={(e) => setConfig({ ...config, onlineWeight: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>线下成绩权重（%）</Label>
                  <Input type="number" value={config.offlineWeight} onChange={(e) => setConfig({ ...config, offlineWeight: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>线上学时</Label>
                  <Input type="number" value={config.onlineHours} onChange={(e) => setConfig({ ...config, onlineHours: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>线下学时</Label>
                  <Input type="number" value={config.offlineHours} onChange={(e) => setConfig({ ...config, offlineHours: Number(e.target.value) })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">学习时间窗口</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>开放学习时间</Label>
                  <Input type="date" value={config.startDate} onChange={(e) => setConfig({ ...config, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>结课时间</Label>
                  <Input type="date" value={config.endDate} onChange={(e) => setConfig({ ...config, endDate: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("课程配置已保存")}><Save className="h-4 w-4 mr-1" /> 保存配置</Button>
      </div>
    </div>
  )
}
