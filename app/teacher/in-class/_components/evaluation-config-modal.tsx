"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  X,
  CheckCircle2,
  Info,
  FileQuestion,
  Pencil,
  Trash2,
  RotateCcw,
  Settings2,
} from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type EvalMethodKey = "random_draw" | "review" | "paper" | "question_bank" | "homework" | "outcome"

interface EvalConfigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskName: string
  methods: EvalMethodKey[]
}

const methodLabels: Record<EvalMethodKey, string> = {
  random_draw: "现场问答",
  review: "现场评审",
  paper: "试卷",
  question_bank: "题库",
  homework: "作业",
  outcome: "成果评价",
}

const methodColors: Record<EvalMethodKey, string> = {
  random_draw: "bg-blue-50 text-blue-600 border-blue-200",
  review: "bg-purple-50 text-purple-600 border-purple-200",
  paper: "bg-green-50 text-green-600 border-green-200",
  question_bank: "bg-orange-50 text-orange-600 border-orange-200",
  homework: "bg-pink-50 text-pink-600 border-pink-200",
  outcome: "bg-cyan-50 text-cyan-600 border-cyan-200",
}

// ============ Mock Data ============
const allQuestions = [
  { id: "qb-1", name: "React Hooks 识别", type: "single", score: 10, difficulty: "easy" as const },
  { id: "qb-2", name: "CSS flex 属性", type: "single", score: 10, difficulty: "medium" as const },
  { id: "qb-3", name: "Virtual DOM 性能判断", type: "judgment", score: 10, difficulty: "medium" as const },
  { id: "qb-4", name: "JS 基本数据类型", type: "multiple", score: 15, difficulty: "hard" as const },
  { id: "qb-5", name: "HTTP 状态码", type: "single", score: 10, difficulty: "easy" as const },
  { id: "qb-6", name: "RESTful API 方法", type: "judgment", score: 10, difficulty: "easy" as const },
  { id: "qb-7", name: "React 生命周期理解", type: "subjective", score: 20, difficulty: "hard" as const },
  { id: "qb-8", name: "CSS 盒模型", type: "single", score: 10, difficulty: "easy" as const },
  { id: "qb-9", name: "Promise 机制", type: "judgment", score: 10, difficulty: "medium" as const },
  { id: "qb-10", name: "前端性能优化", type: "subjective", score: 20, difficulty: "medium" as const },
  { id: "qb-11", name: "数据库索引原理", type: "multiple", score: 15, difficulty: "hard" as const },
  { id: "qb-12", name: "微服务架构", type: "subjective", score: 25, difficulty: "hard" as const },
]

const questionTypeLabels: Record<string, string> = {
  single: "单选",
  multiple: "多选",
  judgment: "判断",
  subjective: "主观",
}

const difficultyLabels: Record<string, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
}

const paperMocks = [
  { id: "paper-1", name: "前端基础综合试卷", questionCount: 20, totalScore: 100 },
  { id: "paper-2", name: "React 进阶测试", questionCount: 15, totalScore: 100 },
  { id: "paper-3", name: "API 设计规范测验", questionCount: 10, totalScore: 100 },
]

const subjectLabels: Record<string, string> = {
  teacher: "教师",
  enterprise_mentor: "企业导师",
  peer: "互评",
  self: "自评",
  ai: "AI 评价",
  service_target: "服务对象",
}

interface ReviewStep {
  id: string
  label: string
  desc: string
  enabled: boolean
  subjectType: string | null
  weight: number
}

interface RandomDrawQuestion {
  id: string
  name: string
  description: string
  answer: string
  major: string
}

// ============ Question Selector Panel ============
function QuestionSelectorPanel({
  selectedIds,
  onChange,
}: {
  selectedIds: string[]
  onChange: (ids: string[]) => void
}) {
  const [qSearch, setQSearch] = useState("")

  const toggleQuestion = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  const filtered = allQuestions.filter(
    (q) => !qSearch || q.name.includes(qSearch) || questionTypeLabels[q.type]?.includes(qSearch)
  )

  return (
    <div className="flex gap-4 flex-1 min-h-0">
      <div className="w-3/5 flex flex-col min-h-0 border rounded-xl p-3">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={qSearch}
            onChange={(e) => setQSearch(e.target.value)}
            placeholder="搜索题目..."
            className="pl-9"
          />
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <FileQuestion className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">未找到匹配题目</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[40%]">题目名称</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[20%]">题型</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[15%]">难度</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-3 py-2 w-[25%]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((q) => {
                  const isSelected = selectedIds.includes(q.id)
                  return (
                    <tr key={q.id} className={cn("hover:bg-gray-50 transition-colors", isSelected ? "bg-primary/[0.03]" : "")}>
                      <td className="px-3 py-2 text-sm font-medium text-gray-800">{q.name}</td>
                      <td className="px-3 py-2">
                        <Badge variant="secondary" className="text-[10px]">{questionTypeLabels[q.type] || q.type}</Badge>
                      </td>
                      <td className="px-3 py-2 text-[10px] text-gray-400">{difficultyLabels[q.difficulty] || q.difficulty}</td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end">
                          {isSelected ? (
                            <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => toggleQuestion(q.id)}>
                              取消
                            </Button>
                          ) : (
                            <Button size="sm" className="h-6 text-[11px] px-2" onClick={() => toggleQuestion(q.id)}>
                              使用
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="w-2/5 border rounded-xl p-3 flex flex-col min-h-0">
        <p className="text-sm font-medium mb-3 text-gray-700">已选择题目 ({selectedIds.length})</p>
        <div className="flex-1 overflow-y-auto">
          {selectedIds.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <FileQuestion className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">从左侧搜索并选择题目</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedIds.map((qid) => {
                const q = allQuestions.find((aq) => aq.id === qid)
                if (!q) return null
                return (
                  <div key={qid} className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 relative">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium flex-1 truncate">{q.name}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 -mr-1 -mt-1" onClick={() => toggleQuestion(q.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="text-[10px]">{questionTypeLabels[q.type] || q.type}</Badge>
                      <span className="text-[10px] text-gray-400">{difficultyLabels[q.difficulty] || q.difficulty}</span>
                      <span className="text-[10px] text-gray-400 ml-auto">{q.score}分</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ Random Draw Panel ============
function RandomDrawPanel() {
  const [questions, setQuestions] = useState<RandomDrawQuestion[]>([
    { id: "rdq-1", name: "简述 XSS 攻击原理", description: "请简述跨站脚本攻击的基本原理和常见类型", answer: "XSS 攻击是指攻击者向 Web 页面注入恶意脚本...", major: "通用" },
    { id: "rdq-2", name: "SQL 注入防御措施", description: "列举至少 3 种防御 SQL 注入的有效措施", answer: "1. 使用参数化查询 2. 输入验证 3. 最小权限原则...", major: "后端开发" },
  ])
  const [selectedIds, setSelectedIds] = useState<string[]>(["rdq-1"])
  const [search, setSearch] = useState("")
  const [actionOpen, setActionOpen] = useState(false)
  const [actionMode, setActionMode] = useState<"add" | "edit">("add")
  const [actionTarget, setActionTarget] = useState<RandomDrawQuestion | null>(null)
  const [form, setForm] = useState({ name: "", description: "", answer: "", major: "" })
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)

  const rdqMajorOptions = ["前端开发", "后端开发", "运维部署", "通用"]
  const filtered = questions.filter(
    (q) => !search || q.name.includes(search) || q.description.includes(search) || q.major.includes(search)
  )
  const selectedList = selectedIds.map((id) => questions.find((q) => q.id === id)).filter(Boolean) as RandomDrawQuestion[]

  const handleAdd = () => {
    setForm({ name: "", description: "", answer: "", major: "" })
    setActionMode("add")
    setActionTarget(null)
    setActionOpen(true)
  }

  const handleEdit = (q: RandomDrawQuestion) => {
    setForm({ name: q.name, description: q.description, answer: q.answer, major: q.major })
    setActionMode("edit")
    setActionTarget(q)
    setActionOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (actionMode === "edit" && actionTarget) {
      setQuestions(questions.map((q) => (q.id === actionTarget.id ? { ...q, ...form } : q)))
    } else {
      const newId = `rdq-${Date.now()}`
      setQuestions([...questions, { id: newId, ...form }])
    }
    setActionOpen(false)
    setSearch("")
  }

  const handleDelete = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
    setSelectedIds(selectedIds.filter((sid) => sid !== id))
  }

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索现场问答题名称、描述或适用专业..." className="pl-9" />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />新增现场问答题
        </Button>
      </div>

      <div className="flex gap-4 flex-1 min-h-[300px]">
        <div className="w-3/5 flex flex-col min-h-0 border rounded-xl p-3">
          <p className="text-sm font-medium mb-3 text-gray-700">{search ? `搜索结果 (${filtered.length})` : "全部现场问答题"}</p>
          <div className="flex-1 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <FileQuestion className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{search ? "未找到匹配的现场问答题" : "暂无现场问答题，请点击上方按钮新增"}</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[26%]">题目名称</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[30%]">题目描述</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[14%]">适用专业</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-3 py-2 w-[30%]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((q) => {
                    const isSelected = selectedIds.includes(q.id)
                    return (
                      <tr key={q.id} className={cn("hover:bg-gray-50 transition-colors", isSelected ? "bg-primary/[0.03]" : "")}>
                        <td className="px-3 py-2 text-sm font-medium text-gray-800">{q.name}</td>
                        <td className="px-3 py-2">
                          <p className="text-xs text-gray-500 line-clamp-1" title={q.description}>{q.description || "-"}</p>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant="secondary" className="text-[10px]">{q.major || "-"}</Badge>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-6 text-[11px] px-1.5 text-gray-500 hover:text-primary" onClick={() => { setDetailId(q.id); setDetailOpen(true) }}>
                              详情
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 text-[11px] px-1.5 text-gray-500 hover:text-primary" onClick={() => handleEdit(q)}>
                              编辑
                            </Button>
                            {isSelected ? (
                              <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => handleToggle(q.id)}>取消</Button>
                            ) : (
                              <Button size="sm" className="h-6 text-[11px] px-2" onClick={() => handleToggle(q.id)}>选择</Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-6 text-[11px] px-1.5 text-red-400 hover:text-red-600" onClick={() => handleDelete(q.id)}>
                              删除
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="w-2/5 border rounded-xl p-3 flex flex-col min-h-0">
          <p className="text-sm font-medium mb-3 text-gray-700">已配置现场问答题 ({selectedList.length})</p>
          <div className="flex-1 overflow-y-auto">
            {selectedList.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <FileQuestion className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">请从左侧选择现场问答题</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedList.map((q) => (
                  <div key={q.id} className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 relative">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium flex-1 truncate">{q.name}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 -mr-1 -mt-1" onClick={() => handleToggle(q.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-1">{q.description || "暂无描述"}</p>
                    <Badge variant="outline" className="text-[9px] mt-1 font-normal px-1 py-0 h-4">{q.major || "通用"}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={actionOpen} onOpenChange={setActionOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{actionMode === "add" ? "新增现场问答题" : "编辑现场问答题"}</DialogTitle>
            <DialogDescription>{actionMode === "add" ? "创建一个新的现场问答题" : "修改现场问答题信息"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>题目名称</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="输入题目名称" className="mt-1.5" />
            </div>
            <div>
              <Label>适用专业</Label>
              <Select value={form.major} onValueChange={(v) => setForm({ ...form, major: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="选择适用专业" /></SelectTrigger>
                <SelectContent>
                  {rdqMajorOptions.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>题目描述</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="输入题目描述" className="mt-1.5" rows={3} />
            </div>
            <div>
              <Label>题目答案</Label>
              <Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="输入题目答案" className="mt-1.5" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionOpen(false)}>取消</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {actionMode === "add" ? "新增" : "保存修改"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>现场问答题详情</DialogTitle>
          </DialogHeader>
          {(() => {
            const q = questions.find((x) => x.id === detailId)
            if (!q) return null
            return (
              <div className="space-y-4 py-2">
                <div>
                  <Label className="text-xs text-gray-500">题目名称</Label>
                  <p className="text-sm font-medium mt-1">{q.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">适用专业</Label>
                  <Badge variant="secondary" className="text-[10px] mt-1">{q.major || "通用"}</Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">题目描述</Label>
                  <p className="text-sm mt-1 text-gray-700 whitespace-pre-wrap">{q.description || "-"}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">题目答案</Label>
                  <p className="text-sm mt-1 text-gray-700 whitespace-pre-wrap">{q.answer || "-"}</p>
                </div>
              </div>
            )
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============ Review Panel ============
function ReviewPanel() {
  const [requiresMaterial, setRequiresMaterial] = useState(true)
  const [deadlineDays, setDeadlineDays] = useState(3)
  const [submitFormatDesc, setSubmitFormatDesc] = useState("")
  const [venueResources, setVenueResources] = useState("")
  const [allowResubmit, setAllowResubmit] = useState(false)
  const [reviewSteps, setReviewSteps] = useState<ReviewStep[]>([
    { id: "rs-1", label: "初评", desc: "对提交材料进行初步审核", enabled: true, subjectType: "teacher", weight: 40 },
    { id: "rs-2", label: "复评", desc: "对初评结果进行复核", enabled: true, subjectType: "enterprise_mentor", weight: 60 },
  ])
  const [editingStepId, setEditingStepId] = useState<string | null>(null)
  const [editingLabel, setEditingLabel] = useState("")
  const [editingDesc, setEditingDesc] = useState("")
  const [showAddStep, setShowAddStep] = useState(false)
  const [newStepLabel, setNewStepLabel] = useState("")
  const [newStepDesc, setNewStepDesc] = useState("")
  const [newStepSubjectType, setNewStepSubjectType] = useState("")

  return (
    <div className="space-y-4">
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-700">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4" />
          <span className="font-medium">评审说明</span>
        </div>
        <p>评审时教师根据学生现场表现或提交的材料进行打分。评价点配置请在「评价标准配置」卡片中设置。</p>
      </div>
      <div className="border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">评审材料要求</p>
          <div className="flex items-center gap-2">
            <Switch checked={requiresMaterial} onCheckedChange={setRequiresMaterial} />
            <span className="text-xs text-gray-600">是否需要提交评审材料</span>
          </div>
        </div>
        {requiresMaterial && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-500">预估提交天数</Label>
                <Input type="number" value={deadlineDays} onChange={(e) => setDeadlineDays(Math.max(1, parseInt(e.target.value) || 1))} className="mt-1 text-sm" min={1} />
              </div>
            </div>
            <div className="mt-3">
              <Label className="text-xs text-gray-500 mb-1.5">提交材料要求</Label>
              <Textarea value={submitFormatDesc} onChange={(e) => setSubmitFormatDesc(e.target.value)} placeholder="请用一句话说明学生需要提交的材料要求..." rows={2} className="text-sm" />
            </div>
          </>
        )}
        <div className="mt-3">
          <Label className="text-xs text-gray-500 mb-1.5">评审场地/环境资源准备</Label>
          <Textarea value={venueResources} onChange={(e) => setVenueResources(e.target.value)} placeholder="请描述评审所需的场地、设备及环境资源准备要求..." rows={2} className="text-sm" />
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <Switch checked={allowResubmit} onCheckedChange={setAllowResubmit} />
            <span className="text-xs text-gray-600">允许重新提交</span>
          </div>
        </div>
      </div>
      <div className="border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">评审流程设置</p>
            {(() => {
              const enabledSteps = reviewSteps.filter((s) => s.enabled)
              const totalWeight = enabledSteps.reduce((sum, s) => sum + (s.weight || 0), 0)
              return enabledSteps.length > 0 && (
                <div className={cn(
                  "flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium",
                  totalWeight === 100 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                  <span>权重合计 {totalWeight}%</span>
                  {totalWeight !== 100 && <span className="text-[10px]">(需等于100%)</span>}
                </div>
              )
            })()}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => {
              const enabled = reviewSteps.filter((s) => s.enabled)
              const count = enabled.length
              if (count === 0) return
              const base = Math.floor(100 / count)
              const remainder = 100 % count
              const newSteps = reviewSteps.map((s) => {
                if (!s.enabled) return s
                const idx = enabled.findIndex((e) => e.id === s.id)
                return { ...s, weight: base + (idx < remainder ? 1 : 0) }
              })
              setReviewSteps(newSteps)
            }}>
              <RotateCcw className="h-3.5 w-3.5 mr-1" />一键平均权重
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => { setShowAddStep(true); setNewStepLabel(""); setNewStepDesc(""); setNewStepSubjectType(""); }}>
              <Plus className="h-3.5 w-3.5 mr-1" />新增步骤
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {reviewSteps.map((step) => (
            <div key={step.id} className="p-3 rounded-lg border">
              {editingStepId === step.id ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={editingLabel} onChange={(e) => setEditingLabel(e.target.value)} placeholder="步骤名称" className="text-sm h-8" />
                    <Select value={step.subjectType || ""} onValueChange={(v) => setReviewSteps(reviewSteps.map((s) => s.id === step.id ? { ...s, subjectType: v } : s))}>
                      <SelectTrigger className="text-sm h-8"><SelectValue placeholder="请选择评价主体" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher">教师</SelectItem>
                        <SelectItem value="enterprise_mentor">企业导师</SelectItem>
                        <SelectItem value="peer">互评</SelectItem>
                        <SelectItem value="self">自评</SelectItem>
                        <SelectItem value="ai">AI 评价</SelectItem>
                        <SelectItem value="service_target">服务对象</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input value={editingDesc} onChange={(e) => setEditingDesc(e.target.value)} placeholder="步骤描述" className="text-sm h-8" />
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="h-7 text-xs" onClick={() => {
                      setReviewSteps(reviewSteps.map((s) => s.id === step.id ? { ...s, label: editingLabel || s.label, desc: editingDesc || s.desc } : s))
                      setEditingStepId(null)
                    }}>保存</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditingStepId(null)}>取消</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch checked={step.enabled} onCheckedChange={(v) => {
                        if (v && !step.subjectType) {
                          setReviewSteps(reviewSteps.map((s) => s.id === step.id ? { ...s, enabled: v, subjectType: "teacher" } : s))
                        } else {
                          setReviewSteps(reviewSteps.map((s) => s.id === step.id ? { ...s, enabled: v } : s))
                        }
                      }} />
                      <div>
                        <p className="text-sm font-medium">{step.label}</p>
                        <p className="text-xs text-gray-400">{step.desc}</p>
                      </div>
                    </div>
                    <Badge variant={step.subjectType ? "secondary" : "outline"} className="text-[10px]">{step.subjectType ? (subjectLabels[step.subjectType] || step.subjectType) : "未绑定"}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {step.enabled && (
                      <div className="flex items-center gap-1">
                        <Input type="number" value={step.weight || 0} onChange={(e) => setReviewSteps(reviewSteps.map((s) => s.id === step.id ? { ...s, weight: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) } : s))} className="h-7 text-xs w-14 text-center" min={0} max={100} />
                        <span className="text-xs text-gray-400">%</span>
                      </div>
                    )}
                    <Button variant="ghost" size="sm" className="h-6 text-[11px] px-1.5 text-gray-400 hover:text-primary" onClick={() => { setEditingStepId(step.id); setEditingLabel(step.label); setEditingDesc(step.desc); }}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    {reviewSteps.length > 1 && (
                      <Button variant="ghost" size="sm" className="h-6 text-[11px] px-1.5 text-gray-400 hover:text-red-500" onClick={() => setReviewSteps(reviewSteps.filter((s) => s.id !== step.id))}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {showAddStep && (
          <div className="mt-2 p-3 rounded-lg border border-dashed border-primary/30 bg-primary/[0.02] space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input value={newStepLabel} onChange={(e) => setNewStepLabel(e.target.value)} placeholder="步骤名称" className="text-sm h-8" />
              <Select value={newStepSubjectType} onValueChange={(v) => setNewStepSubjectType(v)}>
                <SelectTrigger className="text-sm h-8"><SelectValue placeholder="请选择评价主体" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">教师</SelectItem>
                  <SelectItem value="enterprise_mentor">企业导师</SelectItem>
                  <SelectItem value="peer">互评</SelectItem>
                  <SelectItem value="self">自评</SelectItem>
                  <SelectItem value="ai">AI 评价</SelectItem>
                  <SelectItem value="service_target">服务对象</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input value={newStepDesc} onChange={(e) => setNewStepDesc(e.target.value)} placeholder="步骤描述" className="text-sm h-8" />
            <div className="flex items-center gap-2">
              <Button size="sm" className="h-7 text-xs" onClick={() => {
                if (!newStepLabel.trim() || !newStepSubjectType) return
                setReviewSteps([...reviewSteps, { id: `rs-${Date.now()}`, label: newStepLabel, desc: newStepDesc, enabled: true, subjectType: newStepSubjectType, weight: 0 }])
                setShowAddStep(false)
                setNewStepLabel("")
                setNewStepDesc("")
                setNewStepSubjectType("")
              }}>添加</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setShowAddStep(false); setNewStepLabel(""); setNewStepDesc(""); setNewStepSubjectType(""); }}>取消</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ Paper Panel ============
function PaperPanel() {
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null)
  const [pSearch, setPSearch] = useState("")
  const [duration, setDuration] = useState(60)
  const [allowRetake, setAllowRetake] = useState(false)
  const [retakeCount, setRetakeCount] = useState(1)
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [showResult, setShowResult] = useState(true)
  const [activationMode, setActivationMode] = useState<"manual" | "scheduled" | "always">("always")
  const [scheduledTime, setScheduledTime] = useState("")
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailPaperId, setDetailPaperId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="border rounded-xl p-4">
        <p className="text-sm font-medium mb-3">选择已有试卷</p>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input value={pSearch} onChange={(e) => setPSearch(e.target.value)} placeholder="搜索试卷..." className="pl-9" />
          </div>
          <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => alert("新建试卷功能开发中")}>
            <Plus className="h-3.5 w-3.5 mr-1" />新建试卷
          </Button>
        </div>
        <div className="space-y-2">
          {paperMocks.filter((p) => !pSearch || p.name.includes(pSearch)).map((paper) => {
            const selected = selectedPaperId === paper.id
            return (
              <div key={paper.id} onClick={() => setSelectedPaperId(selected ? null : paper.id)} className={cn("p-4 rounded-lg border cursor-pointer", selected ? "border-primary bg-primary/5" : "hover:border-gray-300")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", selected ? "bg-primary border-primary" : "border-gray-300")}>{selected && <CheckCircle2 className="h-3 w-3 text-white" />}</div>
                    <div>
                      <p className="text-sm font-medium">{paper.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge className="text-[10px] bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50">{paper.questionCount} 题</Badge>
                        <Badge className="text-[10px] bg-green-50 text-green-600 border-green-200 hover:bg-green-50">总分 {paper.totalScore}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-[11px] px-2 text-gray-400 hover:text-primary" onClick={(e) => { e.stopPropagation(); setDetailPaperId(paper.id); setDetailOpen(true); }}>
                    查看详情
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="border rounded-xl p-4">
        <p className="text-sm font-medium mb-3">考卷设置</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-500">考试时长（分钟）</Label>
            <Input type="number" value={duration} onChange={(e) => setDuration(Math.max(5, parseInt(e.target.value) || 5))} className="mt-1 text-sm" min={5} />
          </div>
          <div>
            <Label className="text-xs text-gray-500">允许重考</Label>
            <div className="mt-2 flex items-center gap-2">
              <Switch checked={allowRetake} onCheckedChange={setAllowRetake} />
              <span className="text-xs text-gray-600">{allowRetake ? "是" : "否"}</span>
            </div>
          </div>
          {allowRetake && (
            <div>
              <Label className="text-xs text-gray-500">最多重考次数</Label>
              <Input type="number" value={retakeCount} onChange={(e) => setRetakeCount(Math.max(1, parseInt(e.target.value) || 1))} className="mt-1 text-sm" min={1} />
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={shuffleQuestions} onCheckedChange={setShuffleQuestions} />
            <span className="text-xs text-gray-600">题目乱序</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={showResult} onCheckedChange={setShowResult} />
            <span className="text-xs text-gray-600">交卷后显示成绩</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <Label className="text-xs text-gray-500 mb-2">试卷启用条件</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {[
              { key: "manual", label: "后台手动启用" },
              { key: "scheduled", label: "定时启用" },
              { key: "always", label: "随时作答" },
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => setActivationMode(mode.key as "manual" | "scheduled" | "always")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs border transition-all",
                  activationMode === mode.key ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>
          {activationMode === "scheduled" && (
            <div className="mt-2">
              <Label className="text-xs text-gray-500">启用时间</Label>
              <Input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="mt-1 text-sm" />
            </div>
          )}
        </div>
      </div>

      {/* Paper Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>试卷详情</DialogTitle>
          </DialogHeader>
          {(() => {
            const paper = paperMocks.find((p) => p.id === detailPaperId)
            if (!paper) return null
            return (
              <div className="space-y-4 py-2">
                <div>
                  <Label className="text-xs text-gray-500">试卷名称</Label>
                  <p className="text-sm font-medium mt-1">{paper.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="text-[10px] bg-blue-50 text-blue-600 border-blue-200">{paper.questionCount} 题</Badge>
                  <Badge className="text-[10px] bg-green-50 text-green-600 border-green-200">总分 {paper.totalScore}</Badge>
                </div>
              </div>
            )
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============ Question Bank Panel ============
function QuestionBankPanel() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [questionCount, setQuestionCount] = useState(10)
  const [difficulty, setDifficulty] = useState("mixed")
  const [timeLimit, setTimeLimit] = useState(30)
  const [allowRetake, setAllowRetake] = useState(false)
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [showResult, setShowResult] = useState(true)
  const [retakeCount, setRetakeCount] = useState(1)

  return (
    <div className="space-y-4">
      <div className="border rounded-xl p-3 flex flex-col" style={{ minHeight: 320 }}>
        <QuestionSelectorPanel selectedIds={selectedIds} onChange={setSelectedIds} />
      </div>
      <div className="border rounded-xl p-4">
        <p className="text-sm font-medium mb-3">抽题规则</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-500">随机抽题数量</Label>
            <Input type="number" value={questionCount} onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 1))} className="mt-1 text-sm" min={1} />
          </div>
          <div>
            <Label className="text-xs text-gray-500">难度分布</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="mt-1 text-sm h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">简单为主</SelectItem>
                <SelectItem value="mixed">难易混合</SelectItem>
                <SelectItem value="hard">困难为主</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-gray-500">时间限制（分钟）</Label>
            <Input type="number" value={timeLimit} onChange={(e) => setTimeLimit(Math.max(5, parseInt(e.target.value) || 5))} className="mt-1 text-sm" min={5} />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={allowRetake} onCheckedChange={setAllowRetake} />
            <span className="text-xs text-gray-600">允许重复测评</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={shuffleQuestions} onCheckedChange={setShuffleQuestions} />
            <span className="text-xs text-gray-600">题目乱序</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={showResult} onCheckedChange={setShowResult} />
            <span className="text-xs text-gray-600">提交后展示成绩</span>
          </div>
        </div>
        {allowRetake && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500">最多重考次数</Label>
              <Input type="number" value={retakeCount} onChange={(e) => setRetakeCount(Math.max(1, parseInt(e.target.value) || 1))} className="mt-1 text-sm" min={1} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ Outcome Panel ============
function OutcomePanel() {
  const [requiresMaterial, setRequiresMaterial] = useState(true)
  const [deadlineDays, setDeadlineDays] = useState(5)
  const [submitFormatDesc, setSubmitFormatDesc] = useState("")
  const [venueResources, setVenueResources] = useState("")
  const [allowResubmit, setAllowResubmit] = useState(false)

  return (
    <div className="space-y-4">
      <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-100 text-sm text-cyan-700">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4" />
          <span className="font-medium">成果评价说明</span>
        </div>
        <p>成果评价时教师根据学生提交的成果材料进行打分。评价点配置请在「评价标准配置」卡片中设置。</p>
      </div>
      <div className="border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">成果材料要求</p>
          <div className="flex items-center gap-2">
            <Switch checked={requiresMaterial} onCheckedChange={setRequiresMaterial} />
            <span className="text-xs text-gray-600">是否需要提交成果材料</span>
          </div>
        </div>
        {requiresMaterial && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-500">预估提交天数</Label>
                <Input type="number" value={deadlineDays} onChange={(e) => setDeadlineDays(Math.max(1, parseInt(e.target.value) || 1))} className="mt-1 text-sm" min={1} />
              </div>
            </div>
            <div className="mt-3">
              <Label className="text-xs text-gray-500 mb-1.5">提交材料要求</Label>
              <Textarea value={submitFormatDesc} onChange={(e) => setSubmitFormatDesc(e.target.value)} placeholder="请用一句话说明学生需要提交的成果材料要求..." rows={2} className="text-sm" />
            </div>
          </>
        )}
        <div className="mt-3">
          <Label className="text-xs text-gray-500 mb-1.5">评价场地/环境资源准备</Label>
          <Textarea value={venueResources} onChange={(e) => setVenueResources(e.target.value)} placeholder="请描述评价所需的场地、设备及环境资源准备要求..." rows={2} className="text-sm" />
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <Switch checked={allowResubmit} onCheckedChange={setAllowResubmit} />
            <span className="text-xs text-gray-600">允许重新提交</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ Homework Panel ============
function HomeworkPanel() {
  const [requiresMaterial, setRequiresMaterial] = useState(true)
  const [deadlineDays, setDeadlineDays] = useState(3)
  const [submitFormatDesc, setSubmitFormatDesc] = useState("")
  const [allowResubmit, setAllowResubmit] = useState(false)

  return (
    <div className="space-y-4">
      <div className="p-4 bg-pink-50 rounded-lg border border-pink-100 text-sm text-pink-700">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4" />
          <span className="font-medium">作业说明</span>
        </div>
        <p>学生提交作业后，教师按评分规则进行打分。评价点配置请在「评价标准配置」卡片中设置。</p>
      </div>
      <div className="border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">作业提交要求</p>
          <div className="flex items-center gap-2">
            <Switch checked={requiresMaterial} onCheckedChange={setRequiresMaterial} />
            <span className="text-xs text-gray-600">是否需要提交作业材料</span>
          </div>
        </div>
        {requiresMaterial && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-500">预估提交天数</Label>
                <Input type="number" value={deadlineDays} onChange={(e) => setDeadlineDays(Math.max(1, parseInt(e.target.value) || 1))} className="mt-1 text-sm" min={1} />
              </div>
            </div>
            <div className="mt-3">
              <Label className="text-xs text-gray-500 mb-1.5">作业格式要求</Label>
              <Textarea value={submitFormatDesc} onChange={(e) => setSubmitFormatDesc(e.target.value)} placeholder="请用一句话说明学生需要提交的作业格式要求..." rows={2} className="text-sm" />
            </div>
          </>
        )}
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <Switch checked={allowResubmit} onCheckedChange={setAllowResubmit} />
            <span className="text-xs text-gray-600">允许重新提交</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ Main Modal ============
export function EvaluationConfigModal({ open, onOpenChange, taskName, methods }: EvalConfigModalProps) {
  const [activeMethod, setActiveMethod] = useState<string>(methods[0] || "")

  const renderPanel = (key: EvalMethodKey) => {
    switch (key) {
      case "random_draw": return <RandomDrawPanel />
      case "review": return <ReviewPanel />
      case "paper": return <PaperPanel />
      case "question_bank": return <QuestionBankPanel />
      case "outcome": return <OutcomePanel />
      case "homework": return <HomeworkPanel />
      default: return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[85vw] max-w-[85vw] h-[92vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            测评方式配置
          </DialogTitle>
          <DialogDescription>
            为任务「{taskName}」配置测评资源
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeMethod} onValueChange={setActiveMethod} className="flex-1 flex flex-col min-h-0">
          <TabsList className="mb-4 flex-wrap h-auto gap-1 bg-transparent p-0">
            {methods.map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs border transition-all data-[state=active]:shadow-sm",
                  activeMethod === key
                    ? methodColors[key].replace("bg-", "border-").split(" ")[0] + " " + methodColors[key] + " data-[state=active]:" + methodColors[key]
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                {methodLabels[key]}
              </TabsTrigger>
            ))}
          </TabsList>

          {methods.map((key) => (
            <TabsContent key={key} value={key} className="flex-1 overflow-y-auto mt-0">
              <div className="py-2">
                {renderPanel(key)}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter className="mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>关闭</Button>
          <Button onClick={() => onOpenChange(false)}>保存配置</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
