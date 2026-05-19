"use client"

import { useState } from "react"
import {
  Check,
  CheckCircle2,
  Database,
  FileQuestion,
  Info,
  Plus,
  Search,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const paperMocks = [
  { id: "paper-1", name: "Web安全基础能力测试卷", questionCount: 30, totalScore: 100 },
  { id: "paper-2", name: "SQL注入专项测评卷", questionCount: 20, totalScore: 100 },
  { id: "paper-3", name: "渗透测试综合评估卷", questionCount: 25, totalScore: 100 },
  { id: "paper-4", name: "网络安全协议测试卷", questionCount: 15, totalScore: 100 },
  { id: "paper-5", name: "漏洞挖掘实践考核卷", questionCount: 10, totalScore: 100 },
]

const questionTypeLabels: Record<string, string> = {
  single: "单选题",
  multiple: "多选题",
  judge: "判断题",
  fill: "填空题",
  short: "简答题",
  code: "编程题",
}

const difficultyLabels: Record<string, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
}

const questionBankLabels: Record<string, string> = {
  frontend: "前端题库",
  backend: "后端题库",
  draft: "草稿题库",
}

const allQuestions = [
  { id: "q-1", name: "HTTP协议中GET和POST的区别", type: "single", difficulty: "easy", score: 5, source: "my", questionBank: "frontend", content: "以下关于GET和POST请求的描述，正确的是？" },
  { id: "q-2", name: "XSS攻击的基本原理", type: "single", difficulty: "medium", score: 5, source: "my", questionBank: "frontend", content: "XSS（跨站脚本攻击）的核心原理是？" },
  { id: "q-3", name: "SQL注入防护方法", type: "multiple", difficulty: "medium", score: 10, source: "my", questionBank: "backend", content: "以下哪些是有效的SQL注入防护措施？" },
  { id: "q-4", name: "Cookie的HttpOnly属性", type: "judge", difficulty: "easy", score: 3, source: "collab", questionBank: "frontend", content: "设置HttpOnly属性可以完全防止XSS攻击。" },
  { id: "q-5", name: "CSRF攻击的防御手段", type: "multiple", difficulty: "hard", score: 10, source: "collab", questionBank: "frontend", content: "以下哪些措施可以有效防御CSRF攻击？" },
  { id: "q-6", name: "缓冲区溢出漏洞成因", type: "short", difficulty: "hard", score: 15, source: "public", questionBank: "backend", content: "简述缓冲区溢出漏洞的形成原因及危害。" },
  { id: "q-7", name: "对称加密与非对称加密的区别", type: "single", difficulty: "medium", score: 5, source: "public", questionBank: "backend", content: "以下关于对称加密和非对称加密的描述，错误的是？" },
  { id: "q-8", name: "渗透测试的基本流程", type: "short", difficulty: "medium", score: 15, source: "my", questionBank: "draft", content: "请简述一次完整的渗透测试流程。" },
  { id: "q-9", name: "OWASP Top 10 概述", type: "multiple", difficulty: "medium", score: 10, source: "collab", questionBank: "frontend", content: "以下哪些属于OWASP Top 10中的安全风险？" },
  { id: "q-10", name: "JWT令牌的安全使用", type: "single", difficulty: "hard", score: 5, source: "public", questionBank: "backend", content: "关于JWT令牌的安全使用，以下说法正确的是？" },
  { id: "q-11", name: "密码哈希算法选择", type: "single", difficulty: "medium", score: 5, source: "my", questionBank: "backend", content: "以下哪种密码哈希算法不推荐用于密码存储？" },
  { id: "q-12", name: "DDoS攻击的类型", type: "multiple", difficulty: "hard", score: 10, source: "public", questionBank: "draft", content: "以下哪些属于DDoS攻击的常见类型？" },
]

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface EvalResourceConfig {
  /* 通用 */
  questionCount?: number
  difficulty?: string
  shuffle?: boolean
  showScore?: boolean
  timeLimit?: number
  passScore?: number

  /* 试卷 / 考试 */
  paperId?: string | null
  duration?: number
  allowRetake?: boolean
  retakeCount?: number
  activationMode?: "manual" | "scheduled" | "always"
  scheduledTime?: string

  /* 题库 / 随堂测 */
  selectedQuestionIds?: string[]
  questionScores?: Record<string, number>
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
  const defaults: Record<string, EvalResourceConfig> = {
    paper: {
      questionCount: 10,
      difficulty: "mixed",
      shuffle: true,
      showScore: true,
      timeLimit: 60,
      passScore: 60,
      paperId: null,
      duration: 60,
      allowRetake: false,
      retakeCount: 1,
      activationMode: "manual",
      scheduledTime: "",
    },
    exam: {
      questionCount: 10,
      difficulty: "mixed",
      shuffle: true,
      showScore: true,
      timeLimit: 60,
      passScore: 60,
      paperId: null,
      duration: 60,
      allowRetake: false,
      retakeCount: 1,
      activationMode: "manual",
      scheduledTime: "",
    },
    question_bank: {
      questionCount: 10,
      difficulty: "mixed",
      shuffle: true,
      showScore: true,
      timeLimit: 60,
      passScore: 60,
      selectedQuestionIds: [],
      questionScores: {},
      allowRetake: false,
      retakeCount: 1,
    },
    quiz: {
      questionCount: 5,
      difficulty: "mixed",
      shuffle: true,
      showScore: true,
      timeLimit: 15,
      passScore: 60,
      selectedQuestionIds: [],
      questionScores: {},
      allowRetake: true,
      retakeCount: 3,
    },
  }
  const existing = configs[key]
  if (!existing?.resource) {
    return { resource: defaults[key] || defaults.paper }
  }
  return { resource: { ...defaults[key], ...existing.resource } }
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

  /* Paper dialog */
  const [paperSearch, setPaperSearch] = useState("")
  const [showCreatePaper, setShowCreatePaper] = useState(false)
  const [newPaperName, setNewPaperName] = useState("")
  const [newPaperQuestionCount, setNewPaperQuestionCount] = useState(10)
  const [newPaperTotalScore, setNewPaperTotalScore] = useState(100)

  /* Question dialog */
  const [questionTab, setQuestionTab] = useState<"my" | "collab" | "public">("my")
  const [questionSearch, setQuestionSearch] = useState("")

  const openDialog = (methodKey: string) => {
    setDialogMethod(methodKey)
    setDialogOpen(true)
    setPaperSearch("")
    setQuestionSearch("")
    setQuestionTab("my")
    setShowCreatePaper(false)
  }

  const updateConfig = (methodKey: string, updater: (cfg: EvalMethodConfig) => EvalMethodConfig) => {
    const cfg = ensureConfig(configs, methodKey)
    onChange({ ...configs, [methodKey]: updater(cfg) })
  }

  const toggleQuestion = (qid: string, methodKey: string) => {
    const cfg = ensureConfig(configs, methodKey)
    const ids = cfg.resource?.selectedQuestionIds || []
    const newArr = ids.includes(qid) ? ids.filter((id) => id !== qid) : [...ids, qid]
    updateConfig(methodKey, (c) => ({
      ...c,
      resource: { ...c.resource!, selectedQuestionIds: newArr },
    }))
  }

  const updateQuestionScore = (qid: string, methodKey: string, val: number) => {
    updateConfig(methodKey, (c) => ({
      ...c,
      resource: {
        ...c.resource!,
        questionScores: { ...c.resource!.questionScores, [qid]: val },
      },
    }))
  }

  /* ---------- Question Selector Panel ---------- */
  const QuestionSelectorPanel = ({ methodKey }: { methodKey: string }) => {
    const cfg = ensureConfig(configs, methodKey)
    const selectedIds = cfg.resource?.selectedQuestionIds || []

    const filteredQuestions = allQuestions.filter((q) => {
      const matchTab =
        questionTab === "my" ? q.source === "my" : questionTab === "collab" ? q.source === "collab" : q.source === "public"
      const matchSearch = !questionSearch || q.name.includes(questionSearch) || q.content.includes(questionSearch)
      return matchTab && matchSearch
    })

    return (
      <div className="flex gap-4 h-[50vh] min-h-[360px]">
        {/* Left column */}
        <div className="w-3/5 flex flex-col min-h-0 border rounded-xl p-3">
          <Tabs value={questionTab} onValueChange={(v) => setQuestionTab(v as "my" | "collab" | "public")} className="mb-3">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my">我的</TabsTrigger>
              <TabsTrigger value="collab">共建</TabsTrigger>
              <TabsTrigger value="public">公共题库</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                placeholder="搜索题目名称..."
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredQuestions.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <FileQuestion className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无题目</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[30%]">题目名称</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[12%]">题目类型</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[12%]">题目难度</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[15%]">所属题库</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-3 py-2 w-[31%]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredQuestions.map((q) => {
                    const isSelected = selectedIds.includes(q.id)
                    return (
                      <tr
                        key={q.id}
                        className={cn("hover:bg-gray-50 transition-colors cursor-pointer", isSelected ? "bg-primary/[0.03]" : "")}
                        onClick={() => toggleQuestion(q.id, methodKey)}
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                                isSelected ? "bg-primary border-primary" : "border-gray-300"
                              )}
                            >
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-sm font-medium text-gray-800 line-clamp-1">{q.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant="secondary" className="text-xs">
                            {questionTypeLabels[q.type] || q.type}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-xs text-gray-500">{difficultyLabels[q.difficulty] || q.difficulty}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-xs text-gray-500">
                            {questionBankLabels[q.questionBank] || q.questionBank || "-"}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-end gap-1">
                            {isSelected ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-[11px] px-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleQuestion(q.id, methodKey)
                                }}
                              >
                                取消
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="h-6 text-[11px] px-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleQuestion(q.id, methodKey)
                                }}
                              >
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

        {/* Right column */}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-gray-400 -mr-1 -mt-1"
                          onClick={() => toggleQuestion(qid, methodKey)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {questionTypeLabels[q.type] || q.type}
                        </Badge>
                        <span className="text-[10px] text-gray-400">{difficultyLabels[q.difficulty] || q.difficulty}</span>
                        <div className="flex items-center gap-1 ml-auto">
                          <span className="text-[10px] text-gray-400">分值</span>
                          <Input
                            type="number"
                            value={cfg.resource?.questionScores?.[qid] ?? q.score}
                            onChange={(e) => {
                              const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                              updateQuestionScore(qid, methodKey, val)
                            }}
                            className="w-14 h-5 text-[10px] px-1 py-0"
                            min={0}
                            max={100}
                          />
                        </div>
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

  /* ---------- Paper Selector Panel ---------- */
  const PaperSelectorPanel = ({ methodKey }: { methodKey: string }) => {
    const cfg = ensureConfig(configs, methodKey)
    const res = cfg.resource!

    return (
      <div className="space-y-4">
        <div className="border rounded-xl p-4">
          <p className="text-sm font-medium mb-3">选择已有试卷</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={paperSearch}
                onChange={(e) => setPaperSearch(e.target.value)}
                placeholder="搜索试卷..."
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => {
                setShowCreatePaper(true)
                setNewPaperName("")
                setNewPaperQuestionCount(10)
                setNewPaperTotalScore(100)
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />新建试卷
            </Button>
          </div>

          {showCreatePaper && (
            <div className="mb-3 p-3 border rounded-lg bg-gray-50 space-y-2">
              <p className="text-xs font-medium text-gray-600">新建试卷</p>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="试卷名称"
                  value={newPaperName}
                  onChange={(e) => setNewPaperName(e.target.value)}
                  className="text-sm h-8"
                />
                <Input
                  type="number"
                  placeholder="题数"
                  value={newPaperQuestionCount}
                  onChange={(e) => setNewPaperQuestionCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-sm h-8"
                  min={1}
                />
                <Input
                  type="number"
                  placeholder="总分"
                  value={newPaperTotalScore}
                  onChange={(e) => setNewPaperTotalScore(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-sm h-8"
                  min={1}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    if (!newPaperName.trim()) return
                    const newId = `paper-${Date.now()}`
                    paperMocks.push({
                      id: newId,
                      name: newPaperName,
                      questionCount: newPaperQuestionCount,
                      totalScore: newPaperTotalScore,
                    })
                    updateConfig(methodKey, (c) => ({
                      ...c,
                      resource: { ...c.resource!, paperId: newId },
                    }))
                    setShowCreatePaper(false)
                  }}
                >
                  保存
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowCreatePaper(false)}>
                  取消
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {paperMocks
              .filter((p) => !paperSearch || p.name.includes(paperSearch))
              .map((paper) => {
                const selected = res.paperId === paper.id
                return (
                  <div
                    key={paper.id}
                    onClick={() =>
                      updateConfig(methodKey, (c) => ({
                        ...c,
                        resource: { ...c.resource!, paperId: selected ? null : paper.id },
                      }))
                    }
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer",
                      selected ? "border-primary bg-primary/5" : "hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                            selected ? "bg-primary border-primary" : "border-gray-300"
                          )}
                        >
                          {selected && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{paper.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge className="text-[10px] bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50">
                              {paper.questionCount} 题
                            </Badge>
                            <Badge className="text-[10px] bg-green-50 text-green-600 border-green-200 hover:bg-green-50">
                              总分 {paper.totalScore}
                            </Badge>
                          </div>
                        </div>
                      </div>
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
              <Input
                type="number"
                value={res.duration}
                onChange={(e) =>
                  updateConfig(methodKey, (c) => ({
                    ...c,
                    resource: { ...c.resource!, duration: Math.max(5, parseInt(e.target.value) || 5) },
                  }))
                }
                className="mt-1 text-sm"
                min={5}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">允许重考</Label>
              <div className="mt-2 flex items-center gap-2">
                <Switch
                  checked={res.allowRetake}
                  onCheckedChange={(v) =>
                    updateConfig(methodKey, (c) => ({
                      ...c,
                      resource: { ...c.resource!, allowRetake: v },
                    }))
                  }
                />
                <span className="text-xs text-gray-600">{res.allowRetake ? "是" : "否"}</span>
              </div>
            </div>
            {res.allowRetake && (
              <div>
                <Label className="text-xs text-gray-500">最多重考次数</Label>
                <Input
                  type="number"
                  value={res.retakeCount}
                  onChange={(e) =>
                    updateConfig(methodKey, (c) => ({
                      ...c,
                      resource: { ...c.resource!, retakeCount: Math.max(1, parseInt(e.target.value) || 1) },
                    }))
                  }
                  className="mt-1 text-sm"
                  min={1}
                />
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={res.shuffle}
                onCheckedChange={(v) =>
                  updateConfig(methodKey, (c) => ({
                    ...c,
                    resource: { ...c.resource!, shuffle: v },
                  }))
                }
              />
              <span className="text-xs text-gray-600">题目乱序</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={res.showScore}
                onCheckedChange={(v) =>
                  updateConfig(methodKey, (c) => ({
                    ...c,
                    resource: { ...c.resource!, showScore: v },
                  }))
                }
              />
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
                  onClick={() =>
                    updateConfig(methodKey, (c) => ({
                      ...c,
                      resource: {
                        ...c.resource!,
                        activationMode: mode.key as "manual" | "scheduled" | "always",
                      },
                    }))
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs border transition-all",
                    res.activationMode === mode.key
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            {res.activationMode === "scheduled" && (
              <div className="mt-2">
                <Label className="text-xs text-gray-500">启用时间</Label>
                <Input
                  type="datetime-local"
                  value={res.scheduledTime}
                  onChange={(e) =>
                    updateConfig(methodKey, (c) => ({
                      ...c,
                      resource: { ...c.resource!, scheduledTime: e.target.value },
                    }))
                  }
                  className="mt-1 text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ---------- QuestionBank / Quiz Panel ---------- */
  const QuestionBankPanel = ({ methodKey }: { methodKey: string }) => {
    const cfg = ensureConfig(configs, methodKey)
    const res = cfg.resource!

    return (
      <div className="space-y-4">
        <QuestionSelectorPanel methodKey={methodKey} />
        <div className="border rounded-xl p-4">
          <p className="text-sm font-medium mb-3">抽题规则</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500">
                {methodKey === "quiz" ? "随堂测题数" : "随机抽题数量"}
              </Label>
              <Input
                type="number"
                value={res.questionCount}
                onChange={(e) =>
                  updateConfig(methodKey, (c) => ({
                    ...c,
                    resource: { ...c.resource!, questionCount: Math.max(1, parseInt(e.target.value) || 1) },
                  }))
                }
                className="mt-1 text-sm"
                min={1}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">难度分布</Label>
              <Select
                value={res.difficulty}
                onValueChange={(v) =>
                  updateConfig(methodKey, (c) => ({
                    ...c,
                    resource: { ...c.resource!, difficulty: v },
                  }))
                }
              >
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
                onChange={(e) =>
                  updateConfig(methodKey, (c) => ({
                    ...c,
                    resource: { ...c.resource!, timeLimit: Math.max(5, parseInt(e.target.value) || 5) },
                  }))
                }
                className="mt-1 text-sm"
                min={5}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">及格分数线</Label>
              <Input
                type="number"
                value={res.passScore}
                onChange={(e) =>
                  updateConfig(methodKey, (c) => ({
                    ...c,
                    resource: { ...c.resource!, passScore: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) },
                  }))
                }
                className="mt-1 text-sm"
                min={0}
                max={100}
              />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={res.allowRetake}
                onCheckedChange={(v) =>
                  updateConfig(methodKey, (c) => ({
                    ...c,
                    resource: { ...c.resource!, allowRetake: v },
                  }))
                }
              />
              <span className="text-xs text-gray-600">允许重复测评</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={res.shuffle}
                onCheckedChange={(v) =>
                  updateConfig(methodKey, (c) => ({
                    ...c,
                    resource: { ...c.resource!, shuffle: v },
                  }))
                }
              />
              <span className="text-xs text-gray-600">题目乱序</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={res.showScore}
                onCheckedChange={(v) =>
                  updateConfig(methodKey, (c) => ({
                    ...c,
                    resource: { ...c.resource!, showScore: v },
                  }))
                }
              />
              <span className="text-xs text-gray-600">提交后展示成绩</span>
            </div>
          </div>
          {res.allowRetake && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-500">最多重考次数</Label>
                <Input
                  type="number"
                  value={res.retakeCount}
                  onChange={(e) =>
                    updateConfig(methodKey, (c) => ({
                      ...c,
                      resource: { ...c.resource!, retakeCount: Math.max(1, parseInt(e.target.value) || 1) },
                    }))
                  }
                  className="mt-1 text-sm"
                  min={1}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ---------- Dialog Content Router ---------- */
  const ResourceDialog = () => {
    const methodKey = dialogMethod

    return (
      <div className="space-y-5">
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-700">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4" />
            <span className="font-medium">资源配置说明</span>
          </div>
          <p>
            {methodKey === "paper" || methodKey === "exam"
              ? "请选择已有试卷或新建试卷，并配置考试时长、重考规则等参数。"
              : methodKey === "question_bank"
              ? "从题库中选择题目，配置抽题规则和评分标准。"
              : "配置随堂测验的题目和规则。"}
          </p>
        </div>

        {methodKey === "paper" || methodKey === "exam" ? (
          <PaperSelectorPanel methodKey={methodKey} />
        ) : methodKey === "question_bank" || methodKey === "quiz" ? (
          <QuestionBankPanel methodKey={methodKey} />
        ) : null}
      </div>
    )
  }

  /* ---------- Summary Helpers ---------- */
  const getMethodSummary = (methodKey: string, cfg: EvalMethodConfig) => {
    const res = cfg.resource
    if (!res) return null

    if (methodKey === "paper" || methodKey === "exam") {
      const paper = paperMocks.find((p) => p.id === res.paperId)
      return (
        <div className="mt-3 grid grid-cols-4 gap-3 text-xs">
          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-gray-400 mb-0.5">试卷</p>
            <p className="font-medium text-gray-700 truncate">{paper ? paper.name : "未选择"}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-gray-400 mb-0.5">考试时长</p>
            <p className="font-medium text-gray-700">{res.duration} 分钟</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-gray-400 mb-0.5">题目乱序</p>
            <p className="font-medium text-gray-700">{res.shuffle ? "开启" : "关闭"}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-gray-400 mb-0.5">启用方式</p>
            <p className="font-medium text-gray-700">
              {res.activationMode === "manual" ? "手动启用" : res.activationMode === "scheduled" ? "定时启用" : "随时作答"}
            </p>
          </div>
        </div>
      )
    }

    if (methodKey === "question_bank" || methodKey === "quiz") {
      const selectedCount = res.selectedQuestionIds?.length || 0
      return (
        <div className="mt-3 grid grid-cols-4 gap-3 text-xs">
          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-gray-400 mb-0.5">已选题目</p>
            <p className="font-medium text-gray-700">{selectedCount} 题</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-gray-400 mb-0.5">抽题数量</p>
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
        </div>
      )
    }

    return (
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
            const hasConfig = !!res && (
              (methodKey === "paper" || methodKey === "exam" ? !!res.paperId : true) ||
              (methodKey === "question_bank" || methodKey === "quiz" ? (res.selectedQuestionIds?.length || 0) > 0 : true)
            )

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

                {hasConfig && res && getMethodSummary(methodKey, cfg)}
              </div>
            )
          })}
        </div>
      )}

      {/* Resource Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(v) => !v && setDialogOpen(false)}>
        <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>测评资源配置</DialogTitle>
            <DialogDescription>
              配置 {dialogMethod ? methodOptions.find((o) => o.key === dialogMethod)?.label : ""} 的测评资源
            </DialogDescription>
          </DialogHeader>
          {dialogMethod && <ResourceDialog />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
