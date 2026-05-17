"use client"

import { useState } from "react"
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Database,
  FileQuestion,
  Gavel,
  ClipboardList,
  Info,
  ListOrdered,
  Plus,
  RotateCcw,
  Scale,
  Search,
  Target,
  Trash2,
  User,
  Users,
  UserCheck,
  X,
  BookOpen,
  Pencil,
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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { EvalPoint, GradeMapping, KnowledgePointItem } from "@/lib/mock-data"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface EvalSubjectItem {
  type: string
  label: string
  enabled: boolean
  weightPercent: number
  params?: Record<string, any>
}

interface EvalMethodConfig {
  objectType: "individual" | "group"
  subjects: EvalSubjectItem[]
  evalPoints: EvalPoint[]
}

interface EvaluationRulesFullEditorProps {
  methodKeys: string[]
  methodOptions: { key: string; label: string; icon: React.ReactNode; color: string; desc: string }[]
  knowledgePoints: KnowledgePointItem[]
  configs: Record<string, EvalMethodConfig>
  onChange: (configs: Record<string, EvalMethodConfig>) => void
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const subjectTypeLabels: Record<string, string> = {
  teacher: "教师",
  enterprise_mentor: "企业导师",
  self: "自评",
  peer: "互评",
  ai: "AI 评价",
  service_target: "服务对象",
}

const defaultSubjects: EvalSubjectItem[] = [
  { type: "teacher", label: "教师", enabled: true, weightPercent: 60, params: { scorerCount: 1, aggregationRule: "average" } },
  { type: "enterprise_mentor", label: "企业导师", enabled: false, weightPercent: 0 },
  { type: "self", label: "自评", enabled: true, weightPercent: 20 },
  { type: "peer", label: "互评", enabled: false, weightPercent: 0 },
  { type: "ai", label: "AI 评价", enabled: false, weightPercent: 0 },
  { type: "service_target", label: "服务对象", enabled: false, weightPercent: 0 },
]

const defaultGradeMapping: GradeMapping[] = [
  { id: "gm-1", grade: "优秀", minScore: 90, maxScore: 100, color: "bg-green-500" },
  { id: "gm-2", grade: "良好", minScore: 75, maxScore: 89, color: "bg-blue-500" },
  { id: "gm-3", grade: "及格", minScore: 60, maxScore: 74, color: "bg-yellow-500" },
  { id: "gm-4", grade: "不合格", minScore: 0, maxScore: 59, color: "bg-red-500" },
]

const evalSubTypeLabels: Record<string, string> = {
  knowledge_mastery: "知识掌握",
  operation_standard: "操作规范",
  task_completion: "任务完成",
  result_quality: "成果质量",
  communication: "沟通表达",
  collaboration: "团队协作",
  professionalism: "职业素养",
  innovation: "创新思维",
  adaptability: "应变能力",
}

const evalSubTypeColors: Record<string, string> = {
  knowledge_mastery: "bg-blue-50 text-blue-600 border-blue-200",
  operation_standard: "bg-teal-50 text-teal-600 border-teal-200",
  task_completion: "bg-green-50 text-green-600 border-green-200",
  result_quality: "bg-purple-50 text-purple-600 border-purple-200",
  communication: "bg-orange-50 text-orange-600 border-orange-200",
  collaboration: "bg-pink-50 text-pink-600 border-pink-200",
  professionalism: "bg-gray-50 text-gray-600 border-gray-200",
  innovation: "bg-indigo-50 text-indigo-600 border-indigo-200",
  adaptability: "bg-cyan-50 text-cyan-600 border-cyan-200",
}

function ensureConfig(configs: Record<string, EvalMethodConfig>, key: string): EvalMethodConfig {
  return configs[key] || {
    objectType: "individual",
    subjects: JSON.parse(JSON.stringify(defaultSubjects)),
    evalPoints: [],
  }
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function EvaluationRulesFullEditor({
  methodKeys,
  methodOptions,
  knowledgePoints,
  configs,
  onChange,
}: EvaluationRulesFullEditorProps) {
  const [dialogOpen, setDialogOpen] = useState<"object" | "subject" | "resource" | "method" | null>(null)
  const [dialogMethod, setDialogMethod] = useState<string>("")
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [weightDialogOpen, setWeightDialogOpen] = useState(false)

  const openDialog = (type: "object" | "subject" | "resource" | "method", methodKey: string) => {
    setDialogMethod(methodKey)
    setDialogOpen(type)
  }

  const updateConfig = (methodKey: string, updater: (cfg: EvalMethodConfig) => EvalMethodConfig) => {
    const cfg = ensureConfig(configs, methodKey)
    onChange({ ...configs, [methodKey]: updater(cfg) })
  }

  /* ---------- weight helpers ---------- */
  const methodWeights = methodKeys.map((k) => ({ key: k, weight: ensureConfig(configs, k).subjects.filter((s) => s.enabled).reduce((sum, s) => sum + s.weightPercent, 0) }))
  const totalWeight = methodWeights.reduce((s, m) => s + m.weight, 0)

  /* ---------- step cards ---------- */
  const ObjectCard = ({ methodKey, onClick }: { methodKey: string; onClick: () => void }) => {
    const cfg = ensureConfig(configs, methodKey)
    const opts = [
      { key: "individual", label: "个人", desc: "以学生个人为单位进行测评", icon: <User className="h-6 w-6" /> },
      { key: "group", label: "小组", desc: "以小组为单位进行测评", icon: <Users className="h-6 w-6" /> },
    ]
    const opt = opts.find((o) => o.key === cfg.objectType)
    return (
      <button onClick={onClick} className="flex-1 min-w-0 p-4 rounded-xl border text-left transition-all hover:border-primary/50 hover:bg-primary/[0.02] bg-white group">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-gray-400 group-hover:text-primary" />
          <span className="text-xs font-medium text-gray-500">测评对象</span>
        </div>
        <p className="text-sm font-semibold truncate">{opt?.label || "未选择"}</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{opt?.desc || "点击配置"}</p>
      </button>
    )
  }

  const SubjectCard = ({ methodKey, onClick }: { methodKey: string; onClick: () => void }) => {
    const cfg = ensureConfig(configs, methodKey)
    const enabled = cfg.subjects.filter((s) => s.enabled)
    const w = enabled.reduce((sum, s) => sum + s.weightPercent, 0)
    return (
      <button onClick={onClick} className="flex-1 min-w-0 p-4 rounded-xl border text-left transition-all hover:border-primary/50 hover:bg-primary/[0.02] bg-white group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-gray-400 group-hover:text-primary" />
            <span className="text-xs font-medium text-gray-500">评价主体</span>
          </div>
          {enabled.length > 0 && <Badge variant="outline" className="text-[10px]">{enabled.length} 类</Badge>}
        </div>
        <p className="text-sm font-semibold truncate">{enabled.length === 0 ? "未配置" : enabled.map((s) => s.label).join("、")}</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{enabled.length === 0 ? "点击配置" : `总权重 ${w}%`}</p>
      </button>
    )
  }

  const ResourceCard = ({ methodKey, onClick }: { methodKey: string; onClick: () => void }) => {
    return (
      <button onClick={onClick} className="flex-1 min-w-0 p-4 rounded-xl border text-left transition-all hover:border-primary/50 hover:bg-primary/[0.02] bg-white group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-gray-400 group-hover:text-primary" />
            <span className="text-xs font-medium text-gray-500">测评资源</span>
          </div>
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
        </div>
        <p className="text-sm font-semibold truncate">已配置</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">&nbsp;</p>
      </button>
    )
  }

  const StandardCard = ({ methodKey, onClick }: { methodKey: string; onClick: () => void }) => {
    const cfg = ensureConfig(configs, methodKey)
    const count = cfg.evalPoints.length
    const grouped = cfg.evalPoints.reduce((acc, ep) => {
      const k = ep.subType || "uncategorized"
      if (!acc[k]) acc[k] = 0
      acc[k]++
      return acc
    }, {} as Record<string, number>)
    const labels = Object.entries(grouped).map(([k, v]) => `${evalSubTypeLabels[k] || k}${v}`)
    return (
      <button onClick={onClick} className="flex-1 min-w-0 p-4 rounded-xl border text-left transition-all hover:border-primary/50 hover:bg-primary/[0.02] bg-white group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-gray-400 group-hover:text-primary" />
            <span className="text-xs font-medium text-gray-500">评价标准配置</span>
          </div>
          {count > 0 && <Badge variant="outline" className="text-[10px]">{count} 点</Badge>}
        </div>
        <p className="text-sm font-semibold truncate">{count === 0 ? "未配置评价点" : `${count} 个评价点`}</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{labels.length === 0 ? "点击配置" : labels.join(" · ")}</p>
      </button>
    )
  }

  /* ---------- dialog contents ---------- */
  const ObjectDialog = () => {
    const cfg = ensureConfig(configs, dialogMethod)
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500 mb-4">选择本评价方式的测评对象类型</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "individual" as const, label: "个人", desc: "以学生个人为单位进行测评", icon: <User className="h-6 w-6" /> },
            { key: "group" as const, label: "小组", desc: "以小组为单位进行测评", icon: <Users className="h-6 w-6" /> },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => updateConfig(dialogMethod, (c) => ({ ...c, objectType: opt.key }))}
              className={cn(
                "p-5 rounded-xl border text-left transition-all flex items-center gap-4",
                cfg.objectType === opt.key ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20" : "border-gray-200 hover:border-gray-300 bg-white"
              )}
            >
              <div className={cn("p-3 rounded-lg", cfg.objectType === opt.key ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400")}>
                {opt.icon}
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">{opt.label}</p>
                <p className="text-xs text-gray-400">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const SubjectDialog = () => {
    const cfg = ensureConfig(configs, dialogMethod)
    const currentSubjects = cfg.subjects.length ? cfg.subjects : JSON.parse(JSON.stringify(defaultSubjects))

    const updateSubject = (idx: number, updates: Partial<EvalSubjectItem>) => {
      updateConfig(dialogMethod, (c) => {
        const subs = [...(c.subjects.length ? c.subjects : JSON.parse(JSON.stringify(defaultSubjects)))]
        subs[idx] = { ...subs[idx], ...updates }
        return { ...c, subjects: subs }
      })
    }

    const distribute = () => {
      const enabled = currentSubjects.filter((s) => s.enabled)
      const count = enabled.length
      if (count === 0) return
      const base = Math.floor(100 / count)
      const remainder = 100 % count
      const enabledMap = new Map(enabled.map((s, i) => [s.type, i]))
      const newSubs = currentSubjects.map((s) => {
        if (!s.enabled) return s
        const idx = enabledMap.get(s.type) ?? 0
        return { ...s, weightPercent: base + (idx < remainder ? 1 : 0) }
      })
      updateConfig(dialogMethod, (c) => ({ ...c, subjects: newSubs }))
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">配置参与评价的主体及其参数</p>
          <Button variant="outline" size="sm" className="text-xs h-8" onClick={distribute}>
            <Scale className="h-3.5 w-3.5 mr-1" />一键平均权重
          </Button>
        </div>
        <div className="space-y-3">
          {currentSubjects.map((subject, idx) => (
            <div key={subject.type} className={cn("p-4 rounded-xl border transition-all", subject.enabled ? "border-primary bg-primary/[0.03]" : "border-gray-200 bg-white")}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Switch checked={subject.enabled} onCheckedChange={(v) => updateSubject(idx, { enabled: v })} />
                  <span className="text-sm font-medium">{subject.label}</span>
                </div>
                {subject.enabled && subject.weightPercent !== undefined && (
                  <Badge variant="outline" className="text-[10px]">权重 {subject.weightPercent}%</Badge>
                )}
              </div>
              {subject.enabled && (
                <div className="pl-12 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500">评分权重 (%)</Label>
                      <Input type="number" value={subject.weightPercent || 0} onChange={(e) => updateSubject(idx, { weightPercent: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })} className="mt-1 text-sm" min={0} max={100} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">评分人数</Label>
                      <Input type="number" value={subject.params?.scorerCount || 1} onChange={(e) => updateSubject(idx, { params: { ...subject.params, scorerCount: Math.max(1, parseInt(e.target.value) || 1) } })} className="mt-1 text-sm" min={1} />
                    </div>
                  </div>
                  {(subject.params?.scorerCount || 1) > 1 && (
                    <div>
                      <Label className="text-xs text-gray-500">统计规则</Label>
                      <Select value={subject.params?.aggregationRule || "average"} onValueChange={(v) => updateSubject(idx, { params: { ...subject.params, aggregationRule: v } })}>
                        <SelectTrigger className="mt-1 text-sm h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="average">平均值</SelectItem>
                          <SelectItem value="median">中位数</SelectItem>
                          <SelectItem value="max">最高分</SelectItem>
                          <SelectItem value="min">最低分</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {subject.type === "peer" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500">互评人数</Label>
                        <Input type="number" value={subject.params?.peerCount || 3} onChange={(e) => updateSubject(idx, { params: { ...subject.params, peerCount: Math.max(1, parseInt(e.target.value) || 1) } })} className="mt-1 text-sm" min={1} />
                      </div>
                      <div className="flex items-end pb-2">
                        <div className="flex items-center gap-2">
                          <Switch checked={subject.params?.anonymous || false} onCheckedChange={(v) => updateSubject(idx, { params: { ...subject.params, anonymous: v } })} />
                          <span className="text-xs text-gray-600">匿名评价</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {subject.type === "self" && (
                    <div className="flex items-center gap-2">
                      <Switch checked={subject.params?.requiresReflection || false} onCheckedChange={(v) => updateSubject(idx, { params: { ...subject.params, requiresReflection: v } })} />
                      <span className="text-xs text-gray-600">需要提交反思报告</span>
                    </div>
                  )}
                  {subject.type === "ai" && (
                    <div>
                      <Label className="text-xs text-gray-500">AI 模型</Label>
                      <Select value={subject.params?.aiModel || "GPT-4"} onValueChange={(v) => updateSubject(idx, { params: { ...subject.params, aiModel: v } })}>
                        <SelectTrigger className="mt-1 text-sm h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GPT-4">GPT-4</SelectItem>
                          <SelectItem value="GPT-3.5">GPT-3.5</SelectItem>
                          <SelectItem value="Claude">Claude</SelectItem>
                          <SelectItem value="文心一言">文心一言</SelectItem>
                          <SelectItem value="通义千问">通义千问</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const ResourceDialog = () => {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-700">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4" />
            <span className="font-medium">资源配置说明</span>
          </div>
          <p>请根据评价方式配置相应的测评资源。现场问答需配置题库抽题规则，现场评审需配置评审材料要求，试卷/题库需选择具体题目或试卷。</p>
        </div>
        <div className="border rounded-xl p-4">
          <p className="text-sm font-medium mb-3">抽题规则 / 资源配置</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500">题目数量 / 资源数量</Label>
              <Input type="number" defaultValue={10} className="mt-1 text-sm" min={1} />
            </div>
            <div>
              <Label className="text-xs text-gray-500">难度分布</Label>
              <Select defaultValue="mixed">
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
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch defaultChecked />
              <span className="text-xs text-gray-600">题目乱序</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch defaultChecked />
              <span className="text-xs text-gray-600">提交后展示成绩</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- standard config dialog (evaluation points) ---------- */
  const MethodDialog = () => {
    const cfg = ensureConfig(configs, dialogMethod)
    const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({})
    const [kpSearch, setKpSearch] = useState("")
    const [gradeDialogOpen, setGradeDialogOpen] = useState(false)
    const [editingPointId, setEditingPointId] = useState<string | null>(null)

    const addEvalPoint = (subType?: string, presetName?: string) => {
      updateConfig(dialogMethod, (c) => {
        const newPoint: EvalPoint = {
          id: `ep-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          name: presetName || "未命名评价点",
          desc: "",
          subType,
          scoringMethod: "level",
          gradeMapping: JSON.parse(JSON.stringify(defaultGradeMapping)),
          weight: 10,
          knowledgePointIds: [],
        }
        return { ...c, evalPoints: [...c.evalPoints, newPoint] }
      })
    }

    const removeEvalPoint = (id: string) => {
      updateConfig(dialogMethod, (c) => ({ ...c, evalPoints: c.evalPoints.filter((p) => p.id !== id) }))
    }

    const updateEvalPoint = (id: string, updates: Partial<EvalPoint>) => {
      updateConfig(dialogMethod, (c) => ({ ...c, evalPoints: c.evalPoints.map((p) => p.id === id ? { ...p, ...updates } : p) }))
    }

    const toggleType = (st: string) => {
      setExpandedTypes((prev) => ({ ...prev, [st]: !prev[st] }))
    }

    const grouped = cfg.evalPoints.reduce((acc, ep) => {
      const key = ep.subType || "uncategorized"
      if (!acc[key]) acc[key] = []
      acc[key].push(ep)
      return acc
    }, {} as Record<string, EvalPoint[]>)

    const subTypeKeys = Object.keys(evalSubTypeLabels)
    const usedSubTypes = subTypeKeys.filter((st) => grouped[st]?.length > 0)

    return (
      <div className="space-y-4">
        <div className="border rounded-xl p-4">
          <p className="text-sm font-medium mb-3">评价点配置</p>
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">选择细分类型并添加评价点</p>
            <div className="flex flex-wrap gap-1.5">
              {subTypeKeys.map((st) => {
                const count = grouped[st]?.length || 0
                const active = count > 0
                return (
                  <button
                    key={st}
                    onClick={() => {
                      if (!active) addEvalPoint(st, `${evalSubTypeLabels[st]}评价点`)
                      toggleType(st)
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs border transition-all",
                      active ? cn(evalSubTypeColors[st], "border-current") : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {evalSubTypeLabels[st]}
                    {count > 0 && <span className="ml-1 font-medium">({count})</span>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            {usedSubTypes.map((st) => {
              const expanded = expandedTypes[st] !== false
              const eps = grouped[st]
              return (
                <div key={st} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleType(st)}
                    className={cn("w-full flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors", expanded ? "bg-gray-50" : "bg-white hover:bg-gray-50")}
                  >
                    {expanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                    <Badge variant="outline" className={cn("text-[10px]", evalSubTypeColors[st])}>{evalSubTypeLabels[st]}</Badge>
                    <span className="flex-1 text-left text-gray-600">{eps.length} 个评价点</span>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-gray-400 hover:text-primary" onClick={(e) => { e.stopPropagation(); addEvalPoint(st, ""); }}>
                      <Plus className="h-3 w-3 mr-1" />手动添加
                    </Button>
                  </button>
                  {expanded && (
                    <div className="p-3 space-y-2 border-t">
                      {eps.map((ep) => (
                        <div key={ep.id} className="p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <Input value={ep.name} onChange={(e) => updateEvalPoint(ep.id, { name: e.target.value })} className="flex-1 h-8 text-sm" placeholder="评价点名称" />
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => removeEvalPoint(ep.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Badge variant="outline" className={cn("text-[10px]", evalSubTypeColors[ep.subType || ""])}>{ep.subType ? evalSubTypeLabels[ep.subType] : "未分类"}</Badge>
                            <Select value={ep.scoringMethod || "level"} onValueChange={(v) => updateEvalPoint(ep.id, { scoringMethod: v as "score" | "level" | "rubric" })}>
                              <SelectTrigger className="h-7 text-[10px] w-28">
                                <SelectValue placeholder="评分方式" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="score">分值制</SelectItem>
                                <SelectItem value="level">等级制</SelectItem>
                                <SelectItem value="rubric">rubric量表</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">关联知识点</p>
                            <div className="flex flex-wrap gap-1">
                              {(ep.knowledgePointIds || []).map((kpid) => {
                                const kp = knowledgePoints.find((k) => k.id === kpid)
                                return kp ? (
                                  <Badge key={kpid} variant="secondary" className="text-[10px] font-normal">
                                    {kp.name}
                                    <button onClick={() => updateEvalPoint(ep.id, { knowledgePointIds: (ep.knowledgePointIds || []).filter((id) => id !== kpid) })} className="ml-1 text-gray-400 hover:text-red-500">×</button>
                                  </Badge>
                                ) : null
                              })}
                              <Dialog>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader><DialogTitle>关联知识点</DialogTitle></DialogHeader>
                                  <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input value={kpSearch} onChange={(e) => setKpSearch(e.target.value)} placeholder="搜索知识点..." className="pl-9" />
                                  </div>
                                  <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {knowledgePoints.filter((k) => !kpSearch || k.name.includes(kpSearch)).map((k) => {
                                      const alreadyLinked = (ep.knowledgePointIds || []).includes(k.id)
                                      return (
                                        <div key={k.id} onClick={() => {
                                          if (alreadyLinked) return
                                          updateEvalPoint(ep.id, { knowledgePointIds: [...(ep.knowledgePointIds || []), k.id] })
                                        }} className={cn("p-2 rounded-lg border cursor-pointer text-sm", alreadyLinked ? "border-primary bg-primary/5 opacity-50" : "hover:border-gray-300")}>
                                          <div className="flex items-center gap-2">
                                            <span className="flex-1">{k.name}</span>
                                            {alreadyLinked && <CheckCircle2 className="h-4 w-4 text-primary" />}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          {ep.scoringMethod === "level" && ep.gradeMapping && (
                            <button
                              onClick={() => { setEditingPointId(ep.id); setGradeDialogOpen(true); }}
                              className="text-xs text-left text-primary hover:underline w-full block"
                            >
                              {ep.gradeMapping.map((gm) => (
                                <div key={gm.id} className="truncate leading-relaxed">
                                  {gm.grade} ({gm.minScore}-{gm.maxScore}分) {gm.remark}
                                </div>
                              ))}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {grouped["uncategorized"]?.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <button onClick={() => toggleType("uncategorized")} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white hover:bg-gray-50 transition-colors">
                  {expandedTypes["uncategorized"] !== false ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                  <span className="text-gray-600">未分类评价点</span>
                  <span className="text-gray-400">({grouped["uncategorized"].length})</span>
                </button>
                {expandedTypes["uncategorized"] !== false && (
                  <div className="p-3 space-y-2 border-t">
                    {grouped["uncategorized"].map((ep) => (
                      <div key={ep.id} className="p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Input value={ep.name} onChange={(e) => updateEvalPoint(ep.id, { name: e.target.value })} className="flex-1 h-8 text-sm" placeholder="评价点名称" />
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => removeEvalPoint(ep.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge variant="outline" className="text-[10px]">未分类</Badge>
                          <Select value={ep.scoringMethod || "level"} onValueChange={(v) => updateEvalPoint(ep.id, { scoringMethod: v as "score" | "level" | "rubric" })}>
                            <SelectTrigger className="h-7 text-[10px] w-28">
                              <SelectValue placeholder="评分方式" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="score">分值制</SelectItem>
                              <SelectItem value="level">等级制</SelectItem>
                              <SelectItem value="rubric">rubric量表</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {ep.scoringMethod === "level" && ep.gradeMapping && (
                          <button onClick={() => { setEditingPointId(ep.id); setGradeDialogOpen(true); }} className="text-xs text-left text-primary hover:underline w-full block">
                            {ep.gradeMapping.map((gm) => (
                              <div key={gm.id} className="truncate leading-relaxed">{gm.grade} ({gm.minScore}-{gm.maxScore}分) {gm.remark}</div>
                            ))}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Grade Mapping Edit Dialog */}
        <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>编辑评分等级</DialogTitle></DialogHeader>
            {(() => {
              const ep = cfg.evalPoints.find((p) => p.id === editingPointId)
              if (!ep || !ep.gradeMapping) return null
              return (
                <div className="space-y-3 py-2">
                  {ep.gradeMapping.map((g, i) => (
                    <div key={g.id} className="flex items-start gap-2 p-3 rounded-lg border bg-gray-50/50">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Input value={g.grade} onChange={(e) => updateEvalPoint(ep.id, { gradeMapping: ep.gradeMapping!.map((x) => x.id === g.id ? { ...x, grade: e.target.value } : x) })} className="w-14 h-7 text-center text-xs font-semibold" placeholder="等级" />
                          <Input type="number" value={g.minScore} onChange={(e) => updateEvalPoint(ep.id, { gradeMapping: ep.gradeMapping!.map((x) => x.id === g.id ? { ...x, minScore: parseInt(e.target.value) || 0 } : x) })} className="w-16 h-7 text-center text-xs" min={0} max={100} />
                          <span className="text-gray-500 text-xs">-</span>
                          <Input type="number" value={g.maxScore} onChange={(e) => updateEvalPoint(ep.id, { gradeMapping: ep.gradeMapping!.map((x) => x.id === g.id ? { ...x, maxScore: parseInt(e.target.value) || 0 } : x) })} className="w-16 h-7 text-center text-xs" min={0} max={100} />
                          <span className="text-xs text-gray-500">分</span>
                        </div>
                        <Input value={g.remark || ""} onChange={(e) => updateEvalPoint(ep.id, { gradeMapping: ep.gradeMapping!.map((x) => x.id === g.id ? { ...x, remark: e.target.value } : x) })} className="h-7 text-xs" placeholder="等级描述" />
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-red-500" onClick={() => updateEvalPoint(ep.id, { gradeMapping: ep.gradeMapping!.filter((x) => x.id !== g.id) })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => {
                    const colors = ["bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-red-500", "bg-purple-500", "bg-orange-500"]
                    const newId = `grade-${Date.now()}`
                    updateEvalPoint(ep.id, { gradeMapping: [...ep.gradeMapping, { id: newId, grade: "新等级", minScore: 0, maxScore: 100, color: colors[ep.gradeMapping.length % colors.length], remark: "" }] })
                  }}>
                    <Plus className="h-3.5 w-3.5 mr-1" />新增等级
                  </Button>
                </div>
              )
            })()}
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setGradeDialogOpen(false)}>关闭</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  /* ---------- main render ---------- */
  return (
    <div className="space-y-5">
      {methodKeys.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-400 py-12">
          <Target className="h-12 w-12 mb-3 opacity-50" />
          <p className="text-sm">尚未配置评价方式</p>
          <p className="text-xs mt-1">请先在「配置课程测评方式」中选择评价类型</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Order & Weight buttons */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="text-xs h-9" onClick={() => setOrderDialogOpen(true)}>
              <ListOrdered className="h-3.5 w-3.5 mr-1.5" />
              配置评价顺序
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-9" onClick={() => setWeightDialogOpen(true)}>
              <Scale className="h-3.5 w-3.5 mr-1.5" />
              配置评价权重
              <span className={cn(
                "ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                totalWeight === 100 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                {totalWeight}%
              </span>
            </Button>
          </div>

          {/* Method cards */}
          {methodKeys.map((methodKey) => {
            const method = methodOptions.find((o) => o.key === methodKey)
            if (!method) return null
            return (
              <div key={methodKey} className="border rounded-xl p-4 bg-gray-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn("p-2 rounded-lg", method.color)}>{method.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{method.label}</p>
                    <p className="text-xs text-gray-400">{method.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <ObjectCard methodKey={methodKey} onClick={() => openDialog("object", methodKey)} />
                  <div className="flex flex-col items-center justify-center text-gray-300 shrink-0 px-0.5">
                    <span className="text-[10px] font-medium">①</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                  <SubjectCard methodKey={methodKey} onClick={() => openDialog("subject", methodKey)} />
                  <div className="flex flex-col items-center justify-center text-gray-300 shrink-0 px-0.5">
                    <span className="text-[10px] font-medium">②</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                  <ResourceCard methodKey={methodKey} onClick={() => openDialog("resource", methodKey)} />
                  <div className="flex flex-col items-center justify-center text-gray-300 shrink-0 px-0.5">
                    <span className="text-[10px] font-medium">③</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                  {(methodKey === "question_bank" || methodKey === "paper") ? (
                    <div className="flex-1 min-w-0 p-4 rounded-xl border text-left bg-green-50/50 border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-medium text-green-600">评价标准配置</span>
                      </div>
                      <p className="text-sm font-semibold text-green-700">自动读取得分</p>
                      <p className="text-xs text-green-500 truncate mt-0.5">系统将自动读取上一步测评资源的得分</p>
                    </div>
                  ) : (
                    <StandardCard methodKey={methodKey} onClick={() => openDialog("method", methodKey)} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Dialogs */}
      <Dialog open={dialogOpen === "object"} onOpenChange={(v) => !v && setDialogOpen(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>测评对象配置</DialogTitle>
            <DialogDescription>配置 {dialogMethod ? methodOptions.find((o) => o.key === dialogMethod)?.label : ""} 的测评对象</DialogDescription>
          </DialogHeader>
          {dialogMethod && <ObjectDialog />}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen === "subject"} onOpenChange={(v) => !v && setDialogOpen(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>评价主体配置</DialogTitle>
            <DialogDescription>配置 {dialogMethod ? methodOptions.find((o) => o.key === dialogMethod)?.label : ""} 的评价主体</DialogDescription>
          </DialogHeader>
          {dialogMethod && <SubjectDialog />}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen === "resource"} onOpenChange={(v) => !v && setDialogOpen(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>测评资源配置</DialogTitle>
            <DialogDescription>配置 {dialogMethod ? methodOptions.find((o) => o.key === dialogMethod)?.label : ""} 的测评资源</DialogDescription>
          </DialogHeader>
          {dialogMethod && <ResourceDialog />}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen === "method"} onOpenChange={(v) => !v && setDialogOpen(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>评价标准配置</DialogTitle>
            <DialogDescription>配置 {dialogMethod ? methodOptions.find((o) => o.key === dialogMethod)?.label : ""} 的评价点与评分规则</DialogDescription>
          </DialogHeader>
          {dialogMethod && <MethodDialog />}
        </DialogContent>
      </Dialog>

      {/* Order config dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>评价方式顺序配置</DialogTitle>
            <DialogDescription>点击箭头调整评价方式的执行顺序</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-4">
            {methodKeys.map((methodKey, index) => {
              const method = methodOptions.find((o) => o.key === methodKey)
              if (!method) return null
              return (
                <div key={methodKey} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 bg-gray-50/50">
                  <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 text-[10px] flex items-center justify-center font-medium">{index + 1}</span>
                  <div className={cn("p-1.5 rounded-md", method.color)}>{method.icon}</div>
                  <span className="text-sm font-medium flex-1">{method.label}</span>
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setOrderDialogOpen(false)}>完成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Weight config dialog */}
      <Dialog open={weightDialogOpen} onOpenChange={setWeightDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>评价方式权重配置</DialogTitle>
            <DialogDescription>配置各评价方式的权重占比，合计需等于 100%</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className={cn(
                "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium",
                totalWeight === 100 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                <span>合计</span>
                <span>{totalWeight}%</span>
                {totalWeight !== 100 && <span className="text-[10px]">(需等于100%)</span>}
              </div>
              <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => {
                const count = methodKeys.length
                if (count === 0) return
                const base = Math.floor(100 / count)
                const remainder = 100 % count
                const newConfigs = { ...configs }
                methodKeys.forEach((k, i) => {
                  const cfg = ensureConfig(newConfigs, k)
                  const enabled = cfg.subjects.filter((s) => s.enabled)
                  const newSubs = cfg.subjects.map((s) => s.enabled ? { ...s, weightPercent: base + (i < remainder ? 1 : 0) } : s)
                  newConfigs[k] = { ...cfg, subjects: newSubs }
                })
                onChange(newConfigs)
              }}>
                <RotateCcw className="h-3.5 w-3.5 mr-1" />一键平均
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {methodKeys.map((methodKey) => {
                const method = methodOptions.find((o) => o.key === methodKey)
                if (!method) return null
                const weight = ensureConfig(configs, methodKey).subjects.filter((s) => s.enabled).reduce((sum, s) => sum + s.weightPercent, 0)
                return (
                  <div key={methodKey} className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                    <div className={cn("p-1.5 rounded-md shrink-0", method.color)}>
                      {method.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{method.label}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Input type="number" value={weight} onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          updateConfig(methodKey, (c) => {
                            const enabled = c.subjects.filter((s) => s.enabled)
                            if (enabled.length === 0) return c
                            const newSubs = c.subjects.map((s) => s.enabled ? { ...s, weightPercent: val } : s)
                            return { ...c, subjects: newSubs }
                          })
                        }} className="h-7 text-xs w-16 text-center" min={0} max={100} />
                        <span className="text-xs text-gray-400">%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setWeightDialogOpen(false)}>完成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
