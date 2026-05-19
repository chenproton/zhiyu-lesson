"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Database,
  Info,
  Plus,
  Trash2,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface EvalResourceConfig {
  questionCount: number
  difficulty: string
  shuffle: boolean
  showScore: boolean
  timeLimit?: number
  passScore?: number
}

interface EvalMethodConfig {
  resource?: EvalResourceConfig
}

interface EvaluationRulesFullEditorProps {
  methodKeys: string[]
  methodOptions: { key: string; label: string; icon: React.ReactNode; color: string; desc: string }[]
  configs: Record<string, EvalMethodConfig>
  onChange: (configs: Record<string, EvalMethodConfig>) => void
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function ensureConfig(configs: Record<string, EvalMethodConfig>, key: string): EvalMethodConfig {
  return configs[key] || {
    resource: {
      questionCount: 10,
      difficulty: "mixed",
      shuffle: true,
      showScore: true,
      timeLimit: 60,
      passScore: 60,
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function EvaluationRulesFullEditor({
  methodKeys,
  methodOptions,
  configs,
  onChange,
}: EvaluationRulesFullEditorProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMethod, setDialogMethod] = useState<string>("")

  const openDialog = (methodKey: string) => {
    setDialogMethod(methodKey)
    setDialogOpen(true)
  }

  const updateConfig = (methodKey: string, updater: (cfg: EvalMethodConfig) => EvalMethodConfig) => {
    const cfg = ensureConfig(configs, methodKey)
    onChange({ ...configs, [methodKey]: updater(cfg) })
  }

  const ResourceDialog = () => {
    const cfg = ensureConfig(configs, dialogMethod)
    const res = cfg.resource || {
      questionCount: 10,
      difficulty: "mixed",
      shuffle: true,
      showScore: true,
      timeLimit: 60,
      passScore: 60,
    }

    const updateResource = (updates: Partial<EvalResourceConfig>) => {
      updateConfig(dialogMethod, (c) => ({
        ...c,
        resource: { ...res, ...updates },
      }))
    }

    return (
      <div className="space-y-5">
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-700">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4" />
            <span className="font-medium">资源配置说明</span>
          </div>
          <p>请根据评价方式配置相应的测评资源。试卷/题库/考试需选择具体题目或配置抽题规则，随堂测需配置课堂即时测验规则。</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">题目数量 / 资源数量</Label>
            <Input
              type="number"
              value={res.questionCount}
              onChange={(e) => updateResource({ questionCount: Math.max(1, parseInt(e.target.value) || 1) })}
              className="mt-1 text-sm"
              min={1}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">难度分布</Label>
            <Select value={res.difficulty} onValueChange={(v) => updateResource({ difficulty: v })}>
              <SelectTrigger className="mt-1 text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">简单为主</SelectItem>
                <SelectItem value="mixed">难易混合</SelectItem>
                <SelectItem value="hard">困难为主</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-gray-500">时间限制（分钟）</Label>
            <Input
              type="number"
              value={res.timeLimit}
              onChange={(e) => updateResource({ timeLimit: Math.max(1, parseInt(e.target.value) || 1) })}
              className="mt-1 text-sm"
              min={1}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">及格分数线</Label>
            <Input
              type="number"
              value={res.passScore}
              onChange={(e) => updateResource({ passScore: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
              className="mt-1 text-sm"
              min={0}
              max={100}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch checked={res.shuffle} onCheckedChange={(v) => updateResource({ shuffle: v })} />
            <span className="text-xs text-gray-600">题目乱序</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={res.showScore} onCheckedChange={(v) => updateResource({ showScore: v })} />
            <span className="text-xs text-gray-600">提交后展示成绩</span>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- main render ---------- */
  return (
    <div className="space-y-4">
      {methodKeys.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-400 py-12">
          <Database className="h-12 w-12 mb-3 opacity-50" />
          <p className="text-sm">尚未配置评价方式</p>
          <p className="text-xs mt-1">请先在「配置课程测评方式」中选择评价类型</p>
        </div>
      ) : (
        <div className="space-y-3">
          {methodKeys.map((methodKey) => {
            const method = methodOptions.find((o) => o.key === methodKey)
            if (!method) return null
            const cfg = ensureConfig(configs, methodKey)
            const res = cfg.resource
            const hasConfig = !!res

            return (
              <div key={methodKey} className="border rounded-xl p-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", method.color)}>{method.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{method.label}</p>
                    <p className="text-xs text-gray-400">{method.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasConfig ? (
                      <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-50">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        已配置
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-gray-400">
                        未配置
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => openDialog(methodKey)}>
                      {hasConfig ? "编辑配置" : "配置资源"}
                    </Button>
                  </div>
                </div>

                {/* 已配置的简要展示 */}
                {hasConfig && res && (
                  <div className="mt-3 grid grid-cols-4 gap-3 text-xs">
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-gray-400 mb-0.5">题目数量</p>
                      <p className="font-medium text-gray-700">{res.questionCount} 题</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-gray-400 mb-0.5">难度</p>
                      <p className="font-medium text-gray-700">
                        {res.difficulty === "easy" ? "简单为主" : res.difficulty === "mixed" ? "难易混合" : "困难为主"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-gray-400 mb-0.5">时间限制</p>
                      <p className="font-medium text-gray-700">{res.timeLimit} 分钟</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-gray-400 mb-0.5">及格分</p>
                      <p className="font-medium text-gray-700">{res.passScore} 分</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Resource Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(v) => !v && setDialogOpen(false)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>测评资源配置</DialogTitle>
            <DialogDescription>配置 {dialogMethod ? methodOptions.find((o) => o.key === dialogMethod)?.label : ""} 的测评资源</DialogDescription>
          </DialogHeader>
          {dialogMethod && <ResourceDialog />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
