"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  SystemCourseNode,
  NodeRefType,
} from "@/lib/types"

import {
  Save,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Upload,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  X,
  BookOpen,
  CheckCircle2,
  Layers,
  FileStack,
} from "lucide-react"

interface NodeEditorProps {
  node: SystemCourseNode | undefined
  allNodes: SystemCourseNode[]
  onChange: (nodeId: string, updates: Partial<SystemCourseNode>) => void
  onSave: () => void
  onSubmitApproval: () => void
  hasUnsavedChanges: boolean
  lastSavedAt: string | null
  onOpenGrainModal: (mode: "clone" | "quote") => void
  onOpenQuizModal: () => void
  onSaveAsGrainCourse?: () => void
}

const FILE_TYPE_COLORS: Record<string, string> = {
  PDF: "bg-red-50 text-red-500",
  PPT: "bg-blue-50 text-blue-500",
  PPTX: "bg-blue-50 text-blue-500",
  DOC: "bg-blue-50 text-blue-500",
  DOCX: "bg-blue-50 text-blue-500",
  XLS: "bg-green-50 text-green-500",
  XLSX: "bg-green-50 text-green-500",
  ZIP: "bg-green-50 text-green-500",
  CSV: "bg-purple-50 text-purple-500",
  MP4: "bg-orange-50 text-orange-500",
}

const KNOWLEDGE_GRAPH_NODES = [
  "假设检验",
  "P值与显著性",
  "T 检验",
  "卡方检验",
  "方差分析",
  "A/B 测试",
  "贝叶斯统计",
  "置信区间",
  "中心极限定理",
  "回归分析",
  "相关性分析",
  "数据清洗",
  "数据可视化",
]

export default function NodeEditor({
  node,
  allNodes,
  onChange,
  onSave,
  onSubmitApproval,
  hasUnsavedChanges,
  lastSavedAt,
  onOpenGrainModal,
  onOpenQuizModal,
  onSaveAsGrainCourse,
}: NodeEditorProps) {
  const [showTypeSelector, setShowTypeSelector] = useState(false)
  const [showHomeworkForm, setShowHomeworkForm] = useState(false)
  const [kpInput, setKpInput] = useState("")
  const [kpSuggestions, setKpSuggestions] = useState<string[]>([])
  const [showKpSuggest, setShowKpSuggest] = useState(false)
  const [homeworkTitle, setHomeworkTitle] = useState("")
  const [homeworkRequirement, setHomeworkRequirement] = useState("")
  const [homeworkNeedAttachment, setHomeworkNeedAttachment] = useState(false)
  const [homeworkDeadline, setHomeworkDeadline] = useState("")
  const [showGrainSaveConfirm, setShowGrainSaveConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const kpBlurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (!node) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>请在左侧选择一个节点进行编辑</p>
        </div>
      </div>
    )
  }

  const isReadOnly = node.type === "quote"

  const updateField = useCallback(
    (updates: Partial<SystemCourseNode>) => {
      onChange(node.id, updates)
    },
    [node.id, onChange]
  )

  const handleFormatText = (action: string) => {
    const textarea = document.getElementById(
      "teaching-goals"
    ) as HTMLTextAreaElement
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selected = text.substring(start, end)
    let prefix = ""
    let suffix = ""
    switch (action) {
      case "bold":
        prefix = "**"
        suffix = "**"
        break
      case "italic":
        prefix = "*"
        suffix = "*"
        break
      case "underline":
        prefix = "__"
        suffix = "__"
        break
      case "ul":
        prefix = "\n- "
        break
      case "ol":
        prefix = "\n1. "
        break
    }
    const newText = text.substring(0, start) + prefix + selected + suffix + text.substring(end)
    updateField({ teachingGoals: newText })
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length)
    }, 0)
  }

  const handleKpInput = (value: string) => {
    setKpInput(value)
    if (!value.trim()) {
      setKpSuggestions([])
      setShowKpSuggest(false)
      return
    }
    const matches = KNOWLEDGE_GRAPH_NODES.filter((n) =>
      n.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 6)
    setKpSuggestions(matches)
    setShowKpSuggest(true)
  }

  const addKnowledgePoint = (name: string, linked: boolean) => {
    const current = node.knowledgePoints ?? []
    if (current.some((k) => k.name === name)) return
    updateField({
      knowledgePoints: [...current, { name, linked }],
    })
    setKpInput("")
    setKpSuggestions([])
    setShowKpSuggest(false)
  }

  const removeKnowledgePoint = (name: string) => {
    updateField({
      knowledgePoints: (node.knowledgePoints ?? []).filter((k) => k.name !== name),
    })
  }

  const handleKpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const v = kpInput.trim().replace(/,$/, "")
      if (!v) return
      const match = KNOWLEDGE_GRAPH_NODES.find((n) => n === v)
      addKnowledgePoint(v, !!match)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const newResources: NodeResource[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = file.name.split(".").pop()?.toUpperCase() || "FILE"
      newResources.push({
        id: `res-${Date.now()}-${i}`,
        name: file.name,
        type: ext,
        size: Number((file.size / (1024 * 1024)).toFixed(1)),
        url: "#",
      })
    }
    updateField({
      resources: [...(node.resources ?? []), ...newResources],
    })
    e.target.value = ""
  }

  const removeResource = (id: string) => {
    updateField({
      resources: (node.resources ?? []).filter((r) => r.id !== id),
    })
  }

  const removeQuiz = (id: string) => {
    updateField({
      quizzes: (node.quizzes ?? []).filter((q) => q.id !== id),
    })
  }

  const handleAddHomework = () => {
    if (!homeworkTitle.trim()) return
    const hw: NodeHomework = {
      id: `hw-${Date.now()}`,
      title: homeworkTitle.trim(),
      requirement: homeworkRequirement,
      needAttachment: homeworkNeedAttachment,
      deadline: homeworkNeedAttachment ? homeworkDeadline : undefined,
    }
    updateField({
      homeworks: [...(node.homeworks ?? []), hw],
    })
    setShowHomeworkForm(false)
    setHomeworkTitle("")
    setHomeworkRequirement("")
    setHomeworkNeedAttachment(false)
    setHomeworkDeadline("")
  }

  const removeHomework = (id: string) => {
    updateField({
      homeworks: (node.homeworks ?? []).filter((h) => h.id !== id),
    })
  }

  const resetAsType = (type: NodeRefType) => {
    updateField({ type, sourceId: undefined, sourceName: undefined })
    setShowTypeSelector(false)
  }

  // Determine node mode: normal course vs grain course
  const isGrainCourseMode = node.type !== "normal" && node.type !== "resource"

  const handleNodeModeChange = (value: string) => {
    if (value === "normal") {
      resetAsType("normal")
    } else {
      // Switch to grain course mode, default to original
      resetAsType("original")
    }
  }

  const handleSaveClick = () => {
    // If currently in grain course mode and type is original (new grain course),
    // prompt to save as grain course
    if (node.type === "original" && onSaveAsGrainCourse) {
      setShowGrainSaveConfirm(true)
      return
    }
    onSave()
  }

  const handleConfirmSaveAsGrain = () => {
    setShowGrainSaveConfirm(false)
    onSaveAsGrainCourse?.()
  }

  // If node has no type set yet (or we show type selector)
  const showSelector = showTypeSelector || (!node.type && node.type !== "resource")

  return (
    <div className="flex-1 space-y-6 min-w-0">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              hasUnsavedChanges ? "bg-amber-400" : "bg-green-400"
            }`}
          />
          <span>{hasUnsavedChanges ? "有未保存的修改" : "已保存"}</span>
          {lastSavedAt && (
            <>
              <span className="text-gray-300">|</span>
              <span>上次保存：{lastSavedAt}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={handleSaveClick}
          >
            <Save className="w-3 h-3 mr-1" />
            暂存草稿
          </Button>
          <Button size="sm" className="text-xs" onClick={onSubmitApproval}>
            <CheckCircle2 className="w-3 h-3 mr-1" />
            保存并提交审批
          </Button>
        </div>
      </div>

      {/* Type Selector */}
      {showTypeSelector && node.type !== "quote" && node.type !== "clone" && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-500" />
              上传节点资源
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">请上传该节点的课程资源</p>
          <div className="flex gap-4">
            <button
              className="flex-1 px-6 py-4 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              onClick={() => resetAsType("resource")}
            >
              <span className="text-2xl">📁</span>
              <span>上传节点课程资源</span>
            </button>
            <button
              className="flex-1 px-6 py-4 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              onClick={() => resetAsType("original")}
            >
              <span className="text-2xl">📚</span>
              <span>新增节点课程颗粒课</span>
            </button>
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onOpenGrainModal("clone")}
            >
              克隆（可编辑）
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onOpenGrainModal("quote")}
            >
              引用（只读）
            </Button>
          </div>
        </div>
      )}

      {/* Read-only hint */}
      {isReadOnly && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-4 py-2.5 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>当前节点为引用模式，内容不可编辑；如需修改请克隆</span>
        </div>
      )}

      {/* Basic Info Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            {node.type === "resource" ? "资源基本信息" : "课程基本信息"}
          </CardTitle>
          <div className="flex items-center gap-2">
            {node.type !== "resource" && (
              <Select
                value={isGrainCourseMode ? "grain" : "normal"}
                onValueChange={handleNodeModeChange}
              >
                <SelectTrigger className="h-7 text-xs w-[110px]" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">
                    <div className="flex items-center gap-1.5">
                      <FileStack className="w-3.5 h-3.5 text-gray-500" />
                      <span>普通课程</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="grain">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-500" />
                      <span>颗粒课</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
            {!isReadOnly && isGrainCourseMode && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => onOpenGrainModal("clone")}
                >
                  克隆
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => onOpenGrainModal("quote")}
                >
                  引用
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">节点名称</Label>
            <Input
              value={node.name}
              onChange={(e) => updateField({ name: e.target.value })}
              disabled={isReadOnly}
              className="mt-1"
            />
          </div>

          {node.type !== "resource" && (
            <>
              <div>
                <Label className="text-xs text-gray-500">学习目标</Label>
                {!isReadOnly && (
                  <div className="flex gap-1 p-1 bg-gray-50 border border-gray-200 border-b-0 rounded-t-md mt-1">
                    {[
                      { icon: Bold, action: "bold" },
                      { icon: Italic, action: "italic" },
                      { icon: Underline, action: "underline" },
                    ].map(({ icon: Icon, action }) => (
                      <button
                        key={action}
                        className="p-1 hover:bg-white rounded"
                        onClick={() => handleFormatText(action)}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                    <span className="w-px h-5 bg-gray-200 mx-1" />
                    {[
                      { icon: List, action: "ul" },
                      { icon: ListOrdered, action: "ol" },
                    ].map(({ icon: Icon, action }) => (
                      <button
                        key={action}
                        className="p-1 hover:bg-white rounded"
                        onClick={() => handleFormatText(action)}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                )}
                <Textarea
                  id="teaching-goals"
                  value={node.teachingGoals ?? ""}
                  onChange={(e) => updateField({ teachingGoals: e.target.value })}
                  disabled={isReadOnly}
                  placeholder="输入学习目标..."
                  rows={4}
                  className={!isReadOnly ? "rounded-t-none" : ""}
                />
              </div>

              <div>
                <Label className="text-xs text-gray-500">
                  涉及知识点（输入知识点名称，回车添加；命中知识图谱将自动关联 🔗）
                </Label>
                <div className="relative mt-1">
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-md min-h-[42px]">
                    {(node.knowledgePoints ?? []).map((kp) => (
                      <span
                        key={kp.name}
                        className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                          kp.linked
                            ? "bg-indigo-50 text-indigo-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                        title={kp.linked ? "已关联知识图谱节点" : "未关联知识图谱（纯文本）"}
                      >
                        {kp.linked ? "🔗" : "📝"} {kp.name}
                        {!isReadOnly && (
                          <button
                            className="ml-1 hover:text-red-500"
                            onClick={() => removeKnowledgePoint(kp.name)}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                    {!isReadOnly && (
                      <>
                        <input
                          value={kpInput}
                          onChange={(e) => handleKpInput(e.target.value)}
                          onKeyDown={handleKpKeyDown}
                          onFocus={() => kpInput.trim() && setShowKpSuggest(true)}
                          onBlur={() => {
                            kpBlurTimer.current = setTimeout(() => setShowKpSuggest(false), 200)
                          }}
                          placeholder="输入并回车"
                          className="text-xs outline-none flex-1 min-w-[140px]"
                        />
                        {showKpSuggest && kpSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 max-h-[200px] overflow-y-auto shadow-lg z-40">
                            {kpSuggestions.map((s) => (
                              <div
                                key={s}
                                className="px-3 py-2 text-xs cursor-pointer hover:bg-blue-50 flex items-center gap-2"
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  addKnowledgePoint(s, true)
                                }}
                              >
                                <span>🔗</span>
                                <span className="text-indigo-600">{s}</span>
                                <span className="ml-auto text-[10px] text-gray-400">知识图谱</span>
                              </div>
                            ))}
                            <div
                              className="px-3 py-2 text-xs cursor-pointer hover:bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-gray-500"
                              onMouseDown={(e) => {
                                e.preventDefault()
                                addKnowledgePoint(kpInput.trim(), false)
                              }}
                            >
                              <span>📝</span>
                              <span>作为纯文本添加 &quot;{kpInput.trim()}&quot;</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  图标说明：🔗 已关联图谱 · 📝 纯文本（不参与图谱推送）
                </p>
              </div>

              <div>
                <Label className="text-xs text-gray-500">预估课时</Label>
                <Input
                  type="number"
                  value={node.duration ?? ""}
                  onChange={(e) =>
                    updateField({ duration: Number(e.target.value) || undefined })
                  }
                  disabled={isReadOnly}
                  className="mt-1 w-32"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Resources Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-500" />
            课程资源
          </CardTitle>
          {!isReadOnly && (
            <button
              className="text-xs text-blue-500 hover:text-blue-600"
              onClick={() => fileInputRef.current?.click()}
            >
              点击上传课程资源
            </button>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {(node.resources ?? []).map((res) => (
            <div
              key={res.id}
              className="flex items-center gap-3 p-3 border border-gray-100 rounded-md hover:bg-gray-50"
            >
              <div
                className={`w-10 h-10 rounded flex items-center justify-center text-xs font-bold ${
                  FILE_TYPE_COLORS[res.type] || "bg-gray-50 text-gray-500"
                }`}
              >
                {res.type}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{res.name}</p>
                <p className="text-xs text-gray-400">
                  {res.size} MB · {res.type}
                </p>
              </div>
              {!isReadOnly && (
                <button
                  className="text-xs text-gray-400 hover:text-red-500"
                  onClick={() => removeResource(res.id)}
                >
                  移除
                </button>
              )}
            </div>
          ))}
          {!isReadOnly && (
            <div
              className="border-2 border-dashed border-gray-200 rounded-md p-4 text-center hover:border-blue-400 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="text-xs text-gray-400">点击上传课程资源</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.mp4,.zip,.csv"
            onChange={handleFileUpload}
          />
        </CardContent>
      </Card>

      {/* Quiz & Homework Card */}
      {node.type !== "resource" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              测验与作业
            </CardTitle>
            {!isReadOnly && (
              <div className="flex items-center gap-2">
                <button
                  className="text-xs text-blue-500 hover:text-blue-600"
                  onClick={() => onOpenQuizModal()}
                >
                  + 添加测验
                </button>
                <button
                  className="text-xs text-indigo-500 hover:text-indigo-600"
                  onClick={() => setShowHomeworkForm(true)}
                >
                  + 添加作业
                </button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Quiz List */}
            {(node.quizzes ?? []).map((quiz) => (
              <div
                key={quiz.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-500 rounded">
                    {quiz.type === "paper" ? "试卷" : "题库"}
                  </span>
                  <span className="text-sm text-gray-800">{quiz.title}</span>
                  <span className="text-xs text-gray-400">
                    {quiz.type === "paper" ? "试卷" : `${quiz.questions.length} 题`}
                  </span>
                </div>
                {!isReadOnly && (
                  <button
                    className="text-xs text-gray-400 hover:text-red-500"
                    onClick={() => removeQuiz(quiz.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {/* Homework List */}
            {(node.homeworks ?? []).map((hw) => (
              <div
                key={hw.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 text-[10px] bg-indigo-50 text-indigo-500 rounded">
                    作业
                  </span>
                  <span className="text-sm text-gray-800">{hw.title}</span>
                  {hw.needAttachment && (
                    <span className="text-xs text-gray-400">需附件</span>
                  )}
                </div>
                {!isReadOnly && (
                  <button
                    className="text-xs text-gray-400 hover:text-red-500"
                    onClick={() => removeHomework(hw.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {(!node.quizzes || node.quizzes.length === 0) &&
              (!node.homeworks || node.homeworks.length === 0) && (
                <p className="text-xs text-gray-400 text-center py-4">
                  暂无测验或作业
                </p>
              )}
          </CardContent>
        </Card>
      )}

      {/* Quiz Modal is rendered by parent */}

      {/* Homework Form Dialog */}
      <Dialog open={showHomeworkForm} onOpenChange={setShowHomeworkForm}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>添加作业</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs text-gray-500">作业题目</Label>
              <Input
                value={homeworkTitle}
                onChange={(e) => setHomeworkTitle(e.target.value)}
                placeholder="请输入作业题目"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">作业要求</Label>
              <Textarea
                value={homeworkRequirement}
                onChange={(e) => setHomeworkRequirement(e.target.value)}
                placeholder="请输入作业要求"
                rows={4}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 block mb-2">是否上传附件</Label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="needAttachment"
                    checked={homeworkNeedAttachment}
                    onChange={() => setHomeworkNeedAttachment(true)}
                  />
                  <span className="text-sm text-gray-700">是</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="needAttachment"
                    checked={!homeworkNeedAttachment}
                    onChange={() => setHomeworkNeedAttachment(false)}
                  />
                  <span className="text-sm text-gray-700">否</span>
                </label>
              </div>
            </div>
            {homeworkNeedAttachment && (
              <div>
                <Label className="text-xs text-gray-500">截止时间</Label>
                <Input
                  type="datetime-local"
                  value={homeworkDeadline}
                  onChange={(e) => setHomeworkDeadline(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHomeworkForm(false)}>
              取消
            </Button>
            <Button onClick={handleAddHomework}>添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grain Course Save Confirm Dialog */}
      <Dialog open={showGrainSaveConfirm} onOpenChange={setShowGrainSaveConfirm}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>保存为颗粒课</DialogTitle>
            <DialogDescription>
              当前节点为颗粒课模式，是否将当前节点内容保存为新的颗粒课？
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 text-sm text-gray-600">
            <p>保存为颗粒课后，该课程内容将被收录到颗粒课库中，可被其他体系课引用或克隆。</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowGrainSaveConfirm(false); onSave() }}>
              仅保存节点
            </Button>
            <Button onClick={handleConfirmSaveAsGrain}>
              保存为新颗粒课
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
