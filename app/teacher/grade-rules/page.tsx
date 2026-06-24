"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Save, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { ClassSchedulePicker } from "../_components/class-schedule-picker"

const defaultRules = [
  { id: "video", name: "视频学习", weight: 20, description: "微课观看时长、完成率" },
  { id: "homework", name: "作业", weight: 25, description: "线上作业提交与得分" },
  { id: "quiz", name: "单元测验", weight: 20, description: "课前/课后测验得分" },
  { id: "sign", name: "签到", weight: 10, description: "课堂签到记录" },
  { id: "interaction", name: "课堂表现", weight: 15, description: "随堂答题、互动参与" },
  { id: "practice", name: "实训实践", weight: 10, description: "线下项目/任务完成情况" },
]

export default function GradeRulesPage() {
  const [rules, setRules] = useState(defaultRules)
  const total = rules.reduce((sum, r) => sum + r.weight, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">成绩规则配置</h1>
        <p className="text-muted-foreground mt-1">按教学班配置过程性成绩构成，视频学习、作业、测验、签到、课堂表现、实训等占比</p>
      </div>

      <ClassSchedulePicker />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">线上过程成绩构成</CardTitle>
          <div className={`text-sm font-medium ${total === 100 ? "text-green-600" : "text-amber-600"}`}>
            当前合计：{total}%
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {rules.map((rule) => (
            <div key={rule.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">{rule.name}</Label>
                  <p className="text-xs text-muted-foreground">{rule.description}</p>
                </div>
                <div className="flex items-center gap-3 w-48">
                  <Slider
                    value={[rule.weight]}
                    onValueChange={([v]) => setRules(rules.map((r) => r.id === rule.id ? { ...r, weight: v } : r))}
                    max={100}
                    step={1}
                  />
                  <Input
                    type="number"
                    value={rule.weight}
                    onChange={(e) => setRules(rules.map((r) => r.id === rule.id ? { ...r, weight: Number(e.target.value) } : r))}
                    className="w-16"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => { setRules(defaultRules); toast.info("已重置为默认规则") }}><RotateCcw className="h-4 w-4 mr-1" /> 重置</Button>
        <Button disabled={total !== 100} onClick={() => toast.success("成绩规则已保存")}><Save className="h-4 w-4 mr-1" /> 保存规则</Button>
      </div>
    </div>
  )
}
