"use client"

import React, { useState } from "react"
import {
  BookOpen,
  MonitorPlay,
  FileText,
  ClipboardList,
  Plus,
  Trash2,
  Upload,
  Database,
  HelpCircle,
  CheckCircle2,
  MessageCircleQuestion,
  Wrench,
  FolderOpen,
  Award,
} from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MAJORS } from "@/lib/types"
import { EvaluationMethodSelector } from "../../../_components/assessment/evaluation-method-selector"
import { TeachingResourceSelector } from "./teaching-resource-selector"

// ==================== Types ====================

export const COURSE_CATEGORIES = [
  "公共基础必修课程",
  "公共基础限选课程",
  "公共基础任选课程",
  "专业基础课程",
  "专业核心课程",
  "专业拓展课程",
] as const
export type CourseCategory = (typeof COURSE_CATEGORIES)[number]

export interface CourseBasicForm {
  name: string
  code: string
  major: string
  semester: string
  category: CourseCategory
  courseObjectives: string
  coverImage: string
}

export interface TaskItem {
  id: string
  name: string
  requirement: string
  attachments: string[]
}

export interface QuestionOption {
  id: string
  label: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  type: "single" | "multiple" | "judge" | "essay"
  stem: string
  options: QuestionOption[]
  answer: string
}

export interface QuizItem {
  id: string
  name: string
  questions: QuizQuestion[]
}

export interface ClassroomQuestion {
  id: string
  stem: string
  answer: string
}

export interface HomeworkItem {
  id: string
  requirement: string
  allowText: boolean
  allowAttachment: boolean
  deadline: string
}

export interface ResourceItem {
  id: string
  name: string
  type: "system" | "granular" | "case" | "question" | "material" | "simulation" | "custom"
  source: string
}

export interface ReportItem {
  id: string
  name: string
  template: string
  requirement: string
  required: boolean
}

export interface NodeModuleData {
  form: CourseBasicForm
  teachingDesignContent: string
  postLessonReviewContent: string
  teachingDesignSharedNodeIds: string[]
  moduleModes: Record<AtomicModuleKey, "online" | "offline">
  previewContent: string
  preClassResources: ResourceItem[]
  preClassTasks: TaskItem[]
  preClassQuizzes: QuizItem[]
  preQuizEvalMethods: string[]
  lectureContent: string
  lectureResources: ResourceItem[]
  inClassTasks: TaskItem[]
  inClassQuizzes: QuizItem[]
  inClassQuizEvalMethods: string[]
  classQuestions: ClassroomQuestion[]
  practiceTasks: TaskItem[]
  homeworks: HomeworkItem[]
  homeworkEvalMethods: string[]
  extensionMaterials: ResourceItem[]
  trainingReports: ReportItem[]
}

export type AtomicModuleCategory = "pre-class" | "in-class" | "post-class"

export type AtomicModuleKey =
  | "prePreview"
  | "preResources"
  | "preTasks"
  | "preQuizzes"
  | "lecture"
  | "inClassTasks"
  | "inClassQuizzes"
  | "classQuestions"
  | "practiceTasks"
  | "homeworks"
  | "extensionMaterials"
  | "trainingReports"

export interface AtomicModuleMeta {
  key: AtomicModuleKey
  label: string
  category: AtomicModuleCategory
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType<AtomicModuleProps>
}

export interface AtomicModuleProps {
  nodeId: string
  data: NodeModuleData
  onChange: (patch: Partial<NodeModuleData>) => void
}

// ==================== Default data ====================

export function createDefaultNodeModuleData(
  existing?: {
    name?: string
    code?: string
    major?: string
    semester?: string
    category?: CourseCategory
    coverImage?: string
  }
): NodeModuleData {
  const incomingCategory = existing?.category
  const category: CourseCategory =
    incomingCategory && COURSE_CATEGORIES.includes(incomingCategory)
      ? incomingCategory
      : "专业核心课程"
  const ts = Date.now().toString()
  return {
    form: {
      name: existing?.name ?? "",
      code: existing?.code ?? `HYB-${ts.slice(-6)}`,
      major: existing?.major ?? MAJORS[1],
      semester: existing?.semester ?? "2026-2027-1",
      category,
      courseObjectives: "",
      coverImage: "",
    },
    teachingDesignContent: `● 知识目标
● 能力目标
● 素质目标
● 教学重点
● 教学难点
● 教学方法
● 考核方式`,
    postLessonReviewContent: "请输入课后总结内容",
    teachingDesignSharedNodeIds: [],
    moduleModes: {},
    previewContent: "",
    preClassResources: [],
    preClassTasks: [],
    preClassQuizzes: [],
    preQuizEvalMethods: [],
    lectureContent: "",
    lectureResources: [],
    inClassTasks: [],
    inClassQuizzes: [],
    inClassQuizEvalMethods: [],
    classQuestions: [],
    practiceTasks: [],
    homeworks: [],
    homeworkEvalMethods: [],
    extensionMaterials: [],
    trainingReports: [],
  }
}

// ==================== Shared helpers ====================

function MockRichEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="border rounded-md bg-white overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b bg-gray-50/50 text-muted-foreground">
        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => {}}>
          <span className="text-xs font-bold">B</span>
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => {}}>
          <span className="text-xs italic">I</span>
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => {}}>
          <span className="text-xs underline">U</span>
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-0 rounded-none shadow-none focus-visible:ring-0 text-sm min-h-[80px] resize-y"
      />
    </div>
  )
}

function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

// ==================== Task editor ====================

function TaskListEditor({
  items,
  onChange,
  addLabel = "添加任务",
}: {
  items: TaskItem[]
  onChange: (items: TaskItem[]) => void
  addLabel?: string
}) {
  const update = (idx: number, patch: Partial<TaskItem>) => {
    const next = [...items]
    next[idx] = { ...next[idx], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={item.id} className="border rounded-lg p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={item.name}
              onChange={(e) => update(idx, { name: e.target.value })}
              placeholder="任务名称"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <MockRichEditor
            value={item.requirement}
            onChange={(v) => update(idx, { requirement: v })}
            placeholder="任务要求"
          />
          <div className="flex flex-wrap gap-2 items-center">
            {item.attachments.map((att, aidx) => (
              <Badge key={aidx} variant="secondary" className="font-normal">
                {att}
              </Badge>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                update(idx, {
                  attachments: [...item.attachments, `附件${item.attachments.length + 1}.pdf`],
                })
              }
            >
              <Upload className="h-3.5 w-3.5 mr-1" />
              上传附件
            </Button>
          </div>
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          onChange([...items, { id: uid("task"), name: "", requirement: "", attachments: [] }])
        }
      >
        <Plus className="h-4 w-4 mr-1" />
        {addLabel}
      </Button>
    </div>
  )
}

// ==================== Question list editor ====================

function QuestionListEditor({
  items,
  onChange,
}: {
  items: ClassroomQuestion[]
  onChange: (items: ClassroomQuestion[]) => void
}) {
  const update = (idx: number, patch: Partial<ClassroomQuestion>) => {
    const next = [...items]
    next[idx] = { ...next[idx], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={item.id} className="border rounded-lg p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={item.stem}
              onChange={(e) => update(idx, { stem: e.target.value })}
              placeholder="问题内容"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <Input
            value={item.answer}
            onChange={(e) => update(idx, { answer: e.target.value })}
            placeholder="参考答案"
          />
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          onChange([...items, { id: uid("q"), stem: "", answer: "" }])
        }
      >
        <Plus className="h-4 w-4 mr-1" />
        添加提问
      </Button>
    </div>
  )
}

// ==================== Quiz editor ====================

const QUIZ_TYPE_OPTIONS: { value: QuizQuestion["type"]; label: string }[] = [
  { value: "single", label: "单选题" },
  { value: "multiple", label: "多选题" },
  { value: "judge", label: "判断题" },
  { value: "essay", label: "主观题" },
]

function createEmptyQuestion(type: QuizQuestion["type"] = "single"): QuizQuestion {
  return {
    id: uid("question"),
    type,
    stem: "",
    options:
      type === "single" || type === "multiple"
        ? [
            { id: uid("opt"), label: "", isCorrect: false },
            { id: uid("opt"), label: "", isCorrect: false },
          ]
        : [],
    answer: "",
  }
}

function QuizListEditor({
  items,
  onChange,
  addLabel = "添加测验",
}: {
  items: QuizItem[]
  onChange: (items: QuizItem[]) => void
  addLabel?: string
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null)
  const [editing, setEditing] = useState<QuizQuestion | null>(null)

  const updateQuiz = (quizId: string, patch: Partial<QuizItem>) => {
    onChange(
      items.map((q) => (q.id === quizId ? { ...q, ...patch } : q))
    )
  }

  const openNewQuestion = (quizId: string) => {
    setActiveQuizId(quizId)
    setEditing(createEmptyQuestion())
    setDialogOpen(true)
  }

  const openEditQuestion = (quizId: string, question: QuizQuestion) => {
    setActiveQuizId(quizId)
    setEditing({ ...question })
    setDialogOpen(true)
  }

  const saveQuestion = () => {
    if (!activeQuizId || !editing) return
    const quiz = items.find((q) => q.id === activeQuizId)
    if (!quiz) return

    let answer = editing.answer
    if (editing.type === "single" || editing.type === "multiple") {
      answer = editing.options
        .filter((o) => o.isCorrect)
        .map((o) => o.label)
        .join(", ")
    }
    const saved: QuizQuestion = { ...editing, answer }

    const exists = quiz.questions.some((q) => q.id === saved.id)
    const nextQuestions = exists
      ? quiz.questions.map((q) => (q.id === saved.id ? saved : q))
      : [...quiz.questions, saved]

    updateQuiz(activeQuizId, { questions: nextQuestions })
    setDialogOpen(false)
    setEditing(null)
    setActiveQuizId(null)
  }

  const updateEditing = (patch: Partial<QuizQuestion>) => {
    setEditing((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  const updateOption = (optId: string, patch: Partial<QuestionOption>) => {
    if (!editing) return
    const nextOptions = editing.options.map((o) =>
      o.id === optId ? { ...o, ...patch } : o
    )
    if (editing.type === "single" && patch.isCorrect) {
      nextOptions.forEach((o) => {
        if (o.id !== optId) o.isCorrect = false
      })
    }
    updateEditing({ options: nextOptions })
  }

  return (
    <div className="space-y-4">
      {items.map((quiz) => (
        <div key={quiz.id} className="border rounded-lg p-3 space-y-3">
          <Input
            value={quiz.name}
            onChange={(e) => updateQuiz(quiz.id, { name: e.target.value })}
            placeholder="测验名称"
          />
          <div className="space-y-2">
            {quiz.questions.map((question) => (
              <div
                key={question.id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Badge variant="secondary" className="shrink-0">
                    {QUIZ_TYPE_OPTIONS.find((t) => t.value === question.type)?.label}
                  </Badge>
                  <span className="text-sm truncate">{question.stem || "未填写题干"}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditQuestion(quiz.id, question)}
                  >
                    编辑
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      updateQuiz(quiz.id, {
                        questions: quiz.questions.filter((q) => q.id !== question.id),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button size="sm" variant="outline" onClick={() => openNewQuestion(quiz.id)}>
              <Plus className="h-4 w-4 mr-1" />
              添加题目
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChange(items.filter((q) => q.id !== quiz.id))}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onChange([...items, { id: uid("quiz"), name: "", questions: [] }])}
      >
        <Plus className="h-4 w-4 mr-1" />
        {addLabel}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "编辑题目" : "新增题目"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>题型</Label>
                <Select
                  value={editing.type}
                  onValueChange={(v) =>
                    updateEditing(createEmptyQuestion(v as QuizQuestion["type"]))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUIZ_TYPE_OPTIONS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>题干</Label>
                <Textarea
                  value={editing.stem}
                  onChange={(e) => updateEditing({ stem: e.target.value })}
                  placeholder="请输入题干"
                />
              </div>

              {(editing.type === "single" || editing.type === "multiple") && (
                <div className="space-y-3">
                  <Label>选项</Label>
                  {editing.options.map((option, idx) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`opt-${option.id}`}
                        checked={option.isCorrect}
                        onCheckedChange={(checked) =>
                          updateOption(option.id, { isCorrect: checked === true })
                        }
                      />
                      <Input
                        value={option.label}
                        onChange={(e) =>
                          updateOption(option.id, { label: e.target.value })
                        }
                        placeholder={`选项 ${idx + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateEditing({
                            options: editing.options.filter((o) => o.id !== option.id),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateEditing({
                        options: [
                          ...editing.options,
                          { id: uid("opt"), label: "", isCorrect: false },
                        ],
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    添加选项
                  </Button>
                </div>
              )}

              {editing.type === "judge" && (
                <div className="space-y-2">
                  <Label>正确答案</Label>
                  <Select
                    value={editing.answer || "正确"}
                    onValueChange={(v) => updateEditing({ answer: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="正确">正确</SelectItem>
                      <SelectItem value="错误">错误</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {editing.type === "essay" && (
                <div className="space-y-2">
                  <Label>参考答案</Label>
                  <Textarea
                    value={editing.answer}
                    onChange={(e) => updateEditing({ answer: e.target.value })}
                    placeholder="请输入参考答案"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    setEditing(null)
                    setActiveQuizId(null)
                  }}
                >
                  取消
                </Button>
                <Button onClick={saveQuestion}>保存</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ==================== Resource editor ====================

const RESOURCE_TYPE_LABELS: Record<ResourceItem["type"], string> = {
  system: "体系课",
  granular: "颗粒微课",
  case: "产业案例",
  question: "题库",
  material: "课件教案",
  simulation: "虚拟仿真",
  custom: "自定义",
}

const MOCK_RESOURCES: ResourceItem[] = [
  { id: "mock-1", name: "Web前端开发体系课", type: "system", source: "体系课资源库" },
  { id: "mock-2", name: "CSS选择器颗粒微课", type: "granular", source: "颗粒微课库" },
  { id: "mock-3", name: "企业官网实战场景任务", type: "case", source: "产业案例库" },
  { id: "mock-4", name: "前端基础测试题库", type: "question", source: "题库资源库" },
  { id: "mock-5", name: "课程教案模板", type: "material", source: "课件教案库" },
  { id: "mock-6", name: "响应式布局虚拟仿真", type: "simulation", source: "虚拟仿真库" },
]

function ResourceListEditor({
  items,
  onChange,
  addLabel = "关联资源",
}: {
  items: ResourceItem[]
  onChange: (items: ResourceItem[]) => void
  addLabel?: string
}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const addResource = (res: ResourceItem) => {
    if (items.some((i) => i.id === res.id)) return
    onChange([...items, { ...res, id: uid(`${res.type}-`) }])
    setDialogOpen(false)
  }

  const addCustom = () => {
    onChange([
      ...items,
      {
        id: uid("custom"),
        name: `自定义资源${items.filter((i) => i.type === "custom").length + 1}`,
        type: "custom",
        source: "本地上传",
      },
    ])
  }

  const update = (idx: number, patch: Partial<ResourceItem>) => {
    const next = [...items]
    next[idx] = { ...next[idx], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={item.id} className="border rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={item.name}
              onChange={(e) => update(idx, { name: e.target.value })}
              placeholder="资源名称"
            />
            <Badge variant="secondary">{RESOURCE_TYPE_LABELS[item.type]}</Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">来源：{item.source}</p>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
          <Database className="h-4 w-4 mr-1" />
          从资源库关联
        </Button>
        <Button size="sm" variant="outline" onClick={addCustom}>
          <Upload className="h-4 w-4 mr-1" />
          自定义上传
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>从资源库关联</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {MOCK_RESOURCES.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{RESOURCE_TYPE_LABELS[res.type]}</Badge>
                  <span className="text-sm">{res.name}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => addResource(res)}>
                  关联
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ==================== Homework editor ====================

function HomeworkListEditor({
  items,
  onChange,
}: {
  items: HomeworkItem[]
  onChange: (items: HomeworkItem[]) => void
}) {
  const update = (idx: number, patch: Partial<HomeworkItem>) => {
    const next = [...items]
    next[idx] = { ...next[idx], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={item.id} className="border rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">作业 {idx + 1}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <MockRichEditor
            value={item.requirement}
            onChange={(v) => update(idx, { requirement: v })}
            placeholder="作业要求"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`hw-text-${item.id}`}
                checked={item.allowText}
                onCheckedChange={(checked) => update(idx, { allowText: checked === true })}
              />
              <Label htmlFor={`hw-text-${item.id}`} className="text-sm">
                允许文本提交
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`hw-attach-${item.id}`}
                checked={item.allowAttachment}
                onCheckedChange={(checked) =>
                  update(idx, { allowAttachment: checked === true })
                }
              />
              <Label htmlFor={`hw-attach-${item.id}`} className="text-sm">
                允许附件提交
              </Label>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">截止时间</Label>
            <Input
              type="datetime-local"
              value={item.deadline}
              onChange={(e) => update(idx, { deadline: e.target.value })}
            />
          </div>
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          onChange([
            ...items,
            {
              id: uid("hw"),
              requirement: "",
              allowText: true,
              allowAttachment: true,
              deadline: "",
            },
          ])
        }
      >
        <Plus className="h-4 w-4 mr-1" />
        添加作业
      </Button>
    </div>
  )
}

// ==================== Report editor ====================

function ReportListEditor({
  items,
  onChange,
}: {
  items: ReportItem[]
  onChange: (items: ReportItem[]) => void
}) {
  const update = (idx: number, patch: Partial<ReportItem>) => {
    const next = [...items]
    next[idx] = { ...next[idx], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={item.id} className="border rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Input
              value={item.name}
              onChange={(e) => update(idx, { name: e.target.value })}
              placeholder="报告名称"
            />
            <div className="flex items-center gap-2 shrink-0">
              <Switch
                id={`report-req-${item.id}`}
                checked={item.required}
                onCheckedChange={(checked) => update(idx, { required: checked })}
              />
              <Label htmlFor={`report-req-${item.id}`} className="text-sm whitespace-nowrap">
                必修
              </Label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          <MockRichEditor
            value={item.template}
            onChange={(v) => update(idx, { template: v })}
            placeholder="报告模板"
          />
          <MockRichEditor
            value={item.requirement}
            onChange={(v) => update(idx, { requirement: v })}
            placeholder="报告要求"
          />
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          onChange([
            ...items,
            {
              id: uid("report"),
              name: "",
              template: "",
              requirement: "",
              required: true,
            },
          ])
        }
      >
        <Plus className="h-4 w-4 mr-1" />
        添加报告
      </Button>
    </div>
  )
}

// ==================== Activity module wrappers ====================

function PrePreviewModule({ data, onChange }: AtomicModuleProps) {
  return (
    <CardContent>
      <MockRichEditor
        value={data.previewContent}
        onChange={(v) => onChange({ previewContent: v })}
        placeholder="请输入课前预习内容"
      />
    </CardContent>
  )
}

function PreResourcesModule({ data, onChange }: AtomicModuleProps) {
  return (
    <CardContent>
      <TeachingResourceSelector
        items={data.preClassResources}
        onChange={(v) => onChange({ preClassResources: v })}
      />
    </CardContent>
  )
}

function PreTasksModule({ data, onChange }: AtomicModuleProps) {
  return (
    <CardContent>
      <TaskListEditor
        items={data.preClassTasks}
        onChange={(v) => onChange({ preClassTasks: v })}
        addLabel="添加课前任务"
      />
    </CardContent>
  )
}

function PreQuizzesModule({ data, onChange }: AtomicModuleProps) {
  const methods = data.preQuizEvalMethods
  return (
    <CardContent className="space-y-4">
      <div>
        <p className="text-sm font-semibold flex items-center gap-2 mb-3">
          <ClipboardList className="w-4 h-4 text-[#1890ff]" />
          配置课程测评方式
        </p>
        <EvaluationMethodSelector
          selectedKeys={methods}
          onChange={(keys) => onChange({ preQuizEvalMethods: keys })}
        />
      </div>
      <div className="border-t pt-4">
        <p className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-[#1890ff]" />
          配置课程评价规则
        </p>
        {methods.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 py-12">
            <Database className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">尚未配置评价方式</p>
            <p className="text-xs mt-1">请先在「配置课程测评方式」中选择评价类型</p>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 text-sm text-gray-600">
            参考实践场景学习平台中的测评方式配置功能即可
          </div>
        )}
      </div>
    </CardContent>
  )
}

function LectureModule({ data, onChange }: AtomicModuleProps) {
  return (
    <CardContent className="space-y-4">
      <MockRichEditor
        value={data.lectureContent}
        onChange={(v) => onChange({ lectureContent: v })}
        placeholder="请输入课堂讲授内容"
      />
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">配套资源</Label>
        <ResourceListEditor
          items={data.lectureResources}
          onChange={(v) => onChange({ lectureResources: v })}
          addLabel="关联课堂资源"
        />
      </div>
    </CardContent>
  )
}

function InClassTasksModule({ data, onChange }: AtomicModuleProps) {
  return (
    <CardContent>
      <TaskListEditor
        items={data.inClassTasks}
        onChange={(v) => onChange({ inClassTasks: v })}
        addLabel="添加课堂任务"
      />
    </CardContent>
  )
}

function InClassQuizzesModule({ data, onChange }: AtomicModuleProps) {
  const methods = data.inClassQuizEvalMethods
  return (
    <CardContent className="space-y-4">
      <div>
        <p className="text-sm font-semibold flex items-center gap-2 mb-3">
          <ClipboardList className="w-4 h-4 text-[#1890ff]" />
          配置课程测评方式
        </p>
        <EvaluationMethodSelector
          selectedKeys={methods}
          onChange={(keys) => onChange({ inClassQuizEvalMethods: keys })}
        />
      </div>
      <div className="border-t pt-4">
        <p className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-[#1890ff]" />
          配置课程评价规则
        </p>
        {methods.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 py-12">
            <Database className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">尚未配置评价方式</p>
            <p className="text-xs mt-1">请先在「配置课程测评方式」中选择评价类型</p>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 text-sm text-gray-600">
            参考实践场景学习平台中的测评方式配置功能即可
          </div>
        )}
      </div>
    </CardContent>
  )
}

function ClassQuestionsModule({ data, onChange }: AtomicModuleProps) {
  return (
    <CardContent>
      <QuestionListEditor
        items={data.classQuestions}
        onChange={(v) => onChange({ classQuestions: v })}
      />
    </CardContent>
  )
}

function PracticeTasksModule({ data, onChange }: AtomicModuleProps) {
  return (
    <CardContent>
      <TaskListEditor
        items={data.practiceTasks}
        onChange={(v) => onChange({ practiceTasks: v })}
        addLabel="添加实践任务"
      />
    </CardContent>
  )
}

function HomeworksModule({ data, onChange }: AtomicModuleProps) {
  const methods = data.homeworkEvalMethods
  return (
    <CardContent className="space-y-4">
      <div>
        <p className="text-sm font-semibold flex items-center gap-2 mb-3">
          <ClipboardList className="w-4 h-4 text-[#1890ff]" />
          配置课程测评方式
        </p>
        <EvaluationMethodSelector
          selectedKeys={methods}
          onChange={(keys) => onChange({ homeworkEvalMethods: keys })}
        />
      </div>
      <div className="border-t pt-4">
        <p className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-[#1890ff]" />
          配置课程评价规则
        </p>
        {methods.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 py-12">
            <Database className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">尚未配置评价方式</p>
            <p className="text-xs mt-1">请先在「配置课程测评方式」中选择评价类型</p>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 text-sm text-gray-600">
            参考实践场景学习平台中的测评方式配置功能即可
          </div>
        )}
      </div>
    </CardContent>
  )
}

function ExtensionMaterialsModule({ data, onChange }: AtomicModuleProps) {
  return (
    <CardContent>
      <ResourceListEditor
        items={data.extensionMaterials}
        onChange={(v) => onChange({ extensionMaterials: v })}
        addLabel="关联拓展资料"
      />
    </CardContent>
  )
}

function TrainingReportsModule({ data, onChange }: AtomicModuleProps) {
  return (
    <CardContent>
      <ReportListEditor
        items={data.trainingReports}
        onChange={(v) => onChange({ trainingReports: v })}
      />
    </CardContent>
  )
}

// ==================== Module registry ====================

const icon = (Ic: React.ComponentType<{ className?: string }>) => Ic

export const ATOMIC_MODULES: AtomicModuleMeta[] = [
  {
    key: "prePreview",
    label: "课前预习",
    category: "pre-class",
    icon: icon(BookOpen),
    component: PrePreviewModule,
  },
  {
    key: "preResources",
    label: "学习资源",
    category: "pre-class",
    icon: icon(Database),
    component: PreResourcesModule,
  },
  {
    key: "preTasks",
    label: "课前任务",
    category: "pre-class",
    icon: icon(ClipboardList),
    component: PreTasksModule,
  },
  {
    key: "preQuizzes",
    label: "课前测验",
    category: "pre-class",
    icon: icon(HelpCircle),
    component: PreQuizzesModule,
  },
  {
    key: "lecture",
    label: "课堂讲授",
    category: "in-class",
    icon: icon(MonitorPlay),
    component: LectureModule,
  },
  {
    key: "inClassTasks",
    label: "课堂任务",
    category: "in-class",
    icon: icon(ClipboardList),
    component: InClassTasksModule,
  },
  {
    key: "inClassQuizzes",
    label: "随堂测验",
    category: "in-class",
    icon: icon(CheckCircle2),
    component: InClassQuizzesModule,
  },
  {
    key: "classQuestions",
    label: "课堂提问",
    category: "in-class",
    icon: icon(MessageCircleQuestion),
    component: ClassQuestionsModule,
  },
  {
    key: "practiceTasks",
    label: "实践任务",
    category: "in-class",
    icon: icon(Wrench),
    component: PracticeTasksModule,
  },
  {
    key: "homeworks",
    label: "课后作业",
    category: "post-class",
    icon: icon(FileText),
    component: HomeworksModule,
  },
  {
    key: "extensionMaterials",
    label: "拓展资料",
    category: "post-class",
    icon: icon(FolderOpen),
    component: ExtensionMaterialsModule,
  },
  {
    key: "trainingReports",
    label: "实训报告",
    category: "post-class",
    icon: icon(FileText),
    component: TrainingReportsModule,
  },
]

export const ATOMIC_MODULES_BY_KEY = Object.fromEntries(
  ATOMIC_MODULES.map((m) => [m.key, m])
) as Record<AtomicModuleKey, AtomicModuleMeta>

export const DEFAULT_MODULES: AtomicModuleKey[] = []

export const CATEGORY_LABELS: Record<AtomicModuleCategory, string> = {
  "pre-class": "课前准备",
  "in-class": "教学实施",
  "post-class": "课后拓展",
}
