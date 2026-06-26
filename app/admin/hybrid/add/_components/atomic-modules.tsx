"use client"

import { useState } from "react"
import type { TaskEvaluationConfig } from "../_types/registrar-adapted"
import {
  BookOpen,
  MonitorPlay,
  Users,
  Sun,
  Layers,
  BookMarked,
  Microscope,
  Briefcase,
  Database,
  FileStack,
  Monitor,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  BarChart3,
  ClipboardList,
  Zap,
  Shuffle,
  MessageSquare,
  HelpCircle,
  FileText,
  Award,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { INDUSTRIES, MAJORS } from "@/lib/types"
import { INITIAL_CONFIG, PostClassTab } from "./post-class-tab"
import {
  RollCallPanel,
  CheckInPanel,
  VotePanel,
  SurveyPanel,
  QuickQuizPanel,
  GroupingPanel,
  DiscussionPanel,
  MOCK_STUDENTS,
} from "./in-class-tab"

// ==================== Types ====================

export type AtomicModuleCategory = "basic" | "pre-class" | "in-class" | "post-class"

export type AtomicModuleKey =
  | "courseBasicInfo"
  | "onlineOfflineConfig"
  | "teachingObjectives"
  | "teachingUnits"
  | "resourceGroup-system"
  | "resourceGroup-granular"
  | "resourceGroup-case"
  | "resourceGroup-question"
  | "resourceGroup-material"
  | "resourceGroup-simulation"
  | "rollCall"
  | "checkIn"
  | "vote"
  | "survey"
  | "quickQuiz"
  | "grouping"
  | "discussion"
  | "quiz"
  | "todayAttendance"
  | "postClassAssessment"
  | "homework"
  | "finalExam"
  | "gradeStats"

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
}

export interface OnlineOfflineConfig {
  onlineHours: number
  offlineHours: number
  onlineWeight: number
  offlineWeight: number
}

export interface TeachingUnit {
  id: string
  name: string
  online: string
  offline: string
}

export interface NodeModuleData {
  form: CourseBasicForm
  onlineOffline: OnlineOfflineConfig
  objectives: string
  units: TeachingUnit[]
  selectedResources: Record<string, string[]>
  prepStage: "pre" | "in" | "post"
  postClassConfig: TaskEvaluationConfig
}

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

export function createDefaultNodeModuleData(existing?: { name?: string; code?: string; major?: string; semester?: string; category?: CourseCategory }): NodeModuleData {
  const incomingCategory = existing?.category
  const category: CourseCategory =
    incomingCategory && COURSE_CATEGORIES.includes(incomingCategory)
      ? incomingCategory
      : "专业核心课程"
  return {
    form: {
      name: existing?.name || "",
      code: existing?.code || `HYB-${Date.now().toString().slice(-6)}`,
      major: existing?.major || MAJORS[1],
      semester: existing?.semester || "2026-2027-1",
      category,
    },
    onlineOffline: {
      onlineHours: 24,
      offlineHours: 24,
      onlineWeight: 40,
      offlineWeight: 60,
    },
    objectives: "",
    units: [
      { id: "u1", name: "第一单元：课程导论", online: "微课预习、课前测验", offline: "课堂导入、案例研讨" },
      { id: "u2", name: "第二单元：核心理论", online: "视频学习、知识点测验", offline: "讲授、随堂练习" },
      { id: "u3", name: "第三单元：项目实践", online: "任务单、资源包", offline: "小组实训、教师指导" },
    ],
    selectedResources: {
      system: [],
      granular: [],
      case: [],
      question: [],
      material: [],
      simulation: [],
    },
    prepStage: "pre",
    postClassConfig: INITIAL_CONFIG,
  }
}

export const RESOURCE_TYPES = [
  { key: "system", label: "体系课资源", icon: BookMarked, options: ["Web前端开发体系课", "Java程序设计体系课", "软件工程导论体系课"] },
  { key: "granular", label: "颗粒微课", icon: Microscope, options: ["CSS选择器颗粒微课", "Flexbox布局颗粒微课", "JavaScript闭包颗粒微课"] },
  { key: "case", label: "产业案例/场景任务", icon: Briefcase, options: ["企业官网实战场景任务", "电商平台首页场景任务", "移动端H5营销页场景任务"] },
  { key: "question", label: "题库资源", icon: Database, options: ["Web前端单元测试题库", "CSS基础测试题库", "JavaScript进阶测试题库"] },
  { key: "material", label: "课件教案", icon: FileStack, options: ["Web前端开发课件PPT", "课程教案模板", "实训任务单模板"] },
  { key: "simulation", label: "虚拟仿真资源", icon: Monitor, options: ["响应式布局虚拟仿真", "浏览器渲染原理虚拟仿真", "前端性能优化虚拟仿真"] },
]

// ==================== Basic modules ====================

function CourseBasicInfoModule({ data, onChange }: AtomicModuleProps) {
  const form = data.form
  const update = (field: keyof CourseBasicForm, value: string | number) => {
    onChange({ form: { ...form, [field]: value } })
  }
  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>课程名称</Label>
        <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="请输入课程名称" />
      </div>
      <div className="space-y-2">
        <Label>课程编码</Label>
        <Input value={form.code} onChange={(e) => update("code", e.target.value)} placeholder="请输入课程编码" />
      </div>
      <div className="space-y-2">
        <Label>所属专业</Label>
        <Select value={form.major} onValueChange={(v) => update("major", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {MAJORS.filter((m) => m !== "全部").map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>课程分类</Label>
        <Select value={form.category} onValueChange={(v) => update("category", v as CourseCategory)}>
          <SelectTrigger><SelectValue placeholder="请选择课程分类" /></SelectTrigger>
          <SelectContent>
            {COURSE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>学期</Label>
        <Input value={form.semester} onChange={(e) => update("semester", e.target.value)} placeholder="如：2026-2027-1" />
      </div>
    </CardContent>
  )
}

function OnlineOfflineConfigModule({ data, onChange }: AtomicModuleProps) {
  const cfg = data.onlineOffline
  const update = (field: keyof OnlineOfflineConfig, value: number) => {
    onChange({ onlineOffline: { ...cfg, [field]: value } })
  }
  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <MonitorPlay className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">线上学习</p>
            <p className="text-xs text-muted-foreground">课前预习、微课、测验、作业</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>线上学时</Label>
            <Input type="number" value={cfg.onlineHours} onChange={(e) => update("onlineHours", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>线上成绩权重（%）</Label>
            <Input type="number" value={cfg.onlineWeight} onChange={(e) => update("onlineWeight", Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">线下课堂</p>
            <p className="text-xs text-muted-foreground">课堂讲授、实训、项目实践、考核</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>线下学时</Label>
            <Input type="number" value={cfg.offlineHours} onChange={(e) => update("offlineHours", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>线下成绩权重（%）</Label>
            <Input type="number" value={cfg.offlineWeight} onChange={(e) => update("offlineWeight", Number(e.target.value))} />
          </div>
        </div>
      </div>
    </CardContent>
  )
}

// ==================== Pre-class modules ====================

function TeachingObjectivesModule({ data, onChange }: AtomicModuleProps) {
  return (
    <CardContent>
      <Textarea
        placeholder="请输入课程教学目标..."
        rows={4}
        value={data.objectives}
        onChange={(e) => onChange({ objectives: e.target.value })}
      />
    </CardContent>
  )
}

function TeachingUnitsModule({ data, onChange }: AtomicModuleProps) {
  const units = data.units
  const update = (next: TeachingUnit[]) => onChange({ units: next })
  return (
    <CardContent className="space-y-4">
      {units.map((unit, idx) => (
        <div key={unit.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Input
              value={unit.name}
              onChange={(e) => {
                const next = [...units]
                next[idx].name = e.target.value
                update(next)
              }}
              className="font-medium border-0 px-0 text-base"
            />
            <Button variant="ghost" size="icon" onClick={() => update(units.filter((_, i) => i !== idx))}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-blue-600">线上环节</Label>
              <Textarea
                value={unit.online}
                onChange={(e) => {
                  const next = [...units]
                  next[idx].online = e.target.value
                  update(next)
                }}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-orange-600">线下环节</Label>
              <Textarea
                value={unit.offline}
                onChange={(e) => {
                  const next = [...units]
                  next[idx].offline = e.target.value
                  update(next)
                }}
                rows={2}
              />
            </div>
          </div>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={() => update([...units, { id: `u${Date.now()}`, name: "新单元", online: "", offline: "" }])}>
        <Plus className="h-4 w-4 mr-1" /> 添加单元
      </Button>
    </CardContent>
  )
}

function ResourceGroupModule({ data, onChange, resourceKey }: AtomicModuleProps & { resourceKey: string }) {
  const type = RESOURCE_TYPES.find((t) => t.key === resourceKey)!
  const Icon = type.icon
  const selected = data.selectedResources[resourceKey] || []
  const [dialogOpen, setDialogOpen] = useState(false)

  const toggle = (value: string) => {
    const exists = selected.includes(value)
    const next = exists ? selected.filter((v) => v !== value) : [...selected, value]
    onChange({ selectedResources: { ...data.selectedResources, [resourceKey]: next } })
  }

  return (
    <CardContent>
      <div
        onClick={() => setDialogOpen(true)}
        className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-blue-500" />
          <p className="font-medium">{type.label}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {selected.length > 0 ? `已选择 ${selected.length} 项` : "点击选择或引用资源"}
        </p>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selected.map((name) => (
              <Badge key={name} variant="secondary" className="text-xs font-normal truncate max-w-full">
                {name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{type.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {type.options.map((option) => {
              const checked = selected.includes(option)
              return (
                <label
                  key={option}
                  onClick={() => toggle(option)}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${checked ? "bg-blue-50 border-blue-300" : "hover:bg-muted/50"}`}
                >
                  <Checkbox checked={checked} />
                  <span className="text-sm">{option}</span>
                </label>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </CardContent>
  )
}

// ==================== In-class modules ====================

function RollCallModule({ nodeId }: AtomicModuleProps) {
  return <RollCallPanel key={`${nodeId}-rollcall`} />
}

function CheckInModule({ nodeId }: AtomicModuleProps) {
  return <CheckInPanel key={`${nodeId}-checkin`} />
}

function VoteModule({ nodeId }: AtomicModuleProps) {
  return <VotePanel key={`${nodeId}-vote`} />
}

function SurveyModule({ nodeId }: AtomicModuleProps) {
  return <SurveyPanel key={`${nodeId}-survey`} />
}

function QuickQuizModule({ nodeId }: AtomicModuleProps) {
  return <QuickQuizPanel key={`${nodeId}-quickquiz`} />
}

function GroupingModule({ nodeId }: AtomicModuleProps) {
  return <GroupingPanel key={`${nodeId}-grouping`} />
}

function DiscussionModule({ nodeId }: AtomicModuleProps) {
  return <DiscussionPanel key={`${nodeId}-discussion`} />
}

function QuizModule({ nodeId }: AtomicModuleProps) {
  return <QuickQuizPanel key={`${nodeId}-quiz`} />
}

function TodayAttendanceModule(_props: AtomicModuleProps) {
  return (
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="space-y-1">
          <p className="text-2xl font-bold">{MOCK_STUDENTS.length}</p>
          <p className="text-xs text-muted-foreground">应到人数</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-green-600">{MOCK_STUDENTS.filter((s) => s.status === "present").length}</p>
          <p className="text-xs text-muted-foreground">实到人数</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-amber-500">{MOCK_STUDENTS.filter((s) => s.status === "late").length}</p>
          <p className="text-xs text-muted-foreground">迟到人数</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-blue-600">{Math.round((MOCK_STUDENTS.filter((s) => s.status === "present").length / MOCK_STUDENTS.length) * 100)}%</p>
          <p className="text-xs text-muted-foreground">出勤率</p>
        </div>
      </div>
    </CardContent>
  )
}

// ==================== Post-class module ====================

function PostClassAssessmentModule({ nodeId }: AtomicModuleProps) {
  return (
    <CardContent>
      <div className="-mx-6 -my-4">
        <PostClassTab key={`${nodeId}-postclass`} />
      </div>
    </CardContent>
  )
}

function HomeworkModule(_props: AtomicModuleProps) {
  return (
    <CardContent>
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>作业名称</Label>
            <Input defaultValue="课后综合练习一" placeholder="请输入作业名称" />
          </div>
          <div className="space-y-2">
            <Label>截止时间</Label>
            <Input defaultValue="2026-07-10 23:59" placeholder="请选择截止时间" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>作业要求</Label>
          <Textarea defaultValue="完成本章课后习题，提交电子版实验报告。" rows={3} placeholder="请输入作业要求" />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>已模拟配置：允许补交、需附件提交</span>
        </div>
      </div>
    </CardContent>
  )
}

function FinalExamModule(_props: AtomicModuleProps) {
  return (
    <CardContent>
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>考试名称</Label>
            <Input defaultValue="期末综合考试" placeholder="请输入考试名称" />
          </div>
          <div className="space-y-2">
            <Label>考试时长（分钟）</Label>
            <Input type="number" defaultValue={90} placeholder="请输入考试时长" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>开考时间</Label>
            <Input defaultValue="2026-07-15 14:00" placeholder="请选择开考时间" />
          </div>
          <div className="space-y-2">
            <Label>及格分数线</Label>
            <Input type="number" defaultValue={60} placeholder="请输入及格分数线" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Award className="h-3.5 w-3.5" />
          <span>已模拟配置：随机抽题、限时提交、防作弊监控</span>
        </div>
      </div>
    </CardContent>
  )
}

function GradeStatsModule(_props: AtomicModuleProps) {
  return (
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="space-y-1">
          <p className="text-2xl font-bold">92</p>
          <p className="text-xs text-muted-foreground">平均分</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-green-600">85%</p>
          <p className="text-xs text-muted-foreground">及格率</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-amber-500">12</p>
          <p className="text-xs text-muted-foreground">优秀人数</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-blue-600">3</p>
          <p className="text-xs text-muted-foreground">待补考</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <TrendingUp className="h-3.5 w-3.5" />
        <span>已模拟成绩分布：正态分布，含平时/作业/考试加权统计</span>
      </div>
    </CardContent>
  )
}

// ==================== Module registry ====================

export const ATOMIC_MODULES: AtomicModuleMeta[] = [
  { key: "courseBasicInfo", label: "课程基本信息", category: "basic", icon: BookOpen, component: CourseBasicInfoModule },
  { key: "onlineOfflineConfig", label: "线上线下配置", category: "basic", icon: MonitorPlay, component: OnlineOfflineConfigModule },
  { key: "teachingObjectives", label: "教学目标", category: "pre-class", icon: Sun, component: TeachingObjectivesModule },
  { key: "teachingUnits", label: "教学大纲", category: "pre-class", icon: Layers, component: TeachingUnitsModule },
  { key: "resourceGroup-system", label: "体系课资源", category: "pre-class", icon: BookMarked, component: (props) => <ResourceGroupModule {...props} resourceKey="system" /> },
  { key: "resourceGroup-granular", label: "颗粒微课", category: "pre-class", icon: Microscope, component: (props) => <ResourceGroupModule {...props} resourceKey="granular" /> },
  { key: "resourceGroup-case", label: "产业案例/场景任务", category: "pre-class", icon: Briefcase, component: (props) => <ResourceGroupModule {...props} resourceKey="case" /> },
  { key: "resourceGroup-question", label: "题库资源", category: "pre-class", icon: Database, component: (props) => <ResourceGroupModule {...props} resourceKey="question" /> },
  { key: "resourceGroup-material", label: "课件教案", category: "pre-class", icon: FileStack, component: (props) => <ResourceGroupModule {...props} resourceKey="material" /> },
  { key: "resourceGroup-simulation", label: "虚拟仿真资源", category: "pre-class", icon: Monitor, component: (props) => <ResourceGroupModule {...props} resourceKey="simulation" /> },
  { key: "rollCall", label: "课堂点名", category: "in-class", icon: Users, component: RollCallModule },
  { key: "checkIn", label: "签到管理", category: "in-class", icon: CheckCircle2, component: CheckInModule },
  { key: "vote", label: "课堂投票", category: "in-class", icon: BarChart3, component: VoteModule },
  { key: "survey", label: "课堂问卷", category: "in-class", icon: ClipboardList, component: SurveyModule },
  { key: "quickQuiz", label: "课堂抢答", category: "in-class", icon: Zap, component: QuickQuizModule },
  { key: "grouping", label: "随机分组", category: "in-class", icon: Shuffle, component: GroupingModule },
  { key: "discussion", label: "课堂讨论", category: "in-class", icon: MessageSquare, component: DiscussionModule },
  { key: "quiz", label: "随堂测验", category: "in-class", icon: HelpCircle, component: QuizModule },
  { key: "todayAttendance", label: "今日签到统计", category: "in-class", icon: BarChart3, component: TodayAttendanceModule },
  { key: "postClassAssessment", label: "课后测验", category: "post-class", icon: BookOpen, component: PostClassAssessmentModule },
  { key: "homework", label: "课后作业", category: "post-class", icon: FileText, component: HomeworkModule },
  { key: "finalExam", label: "课程考试", category: "post-class", icon: Award, component: FinalExamModule },
  { key: "gradeStats", label: "成绩统计", category: "post-class", icon: TrendingUp, component: GradeStatsModule },
]

export const ATOMIC_MODULES_BY_KEY = Object.fromEntries(
  ATOMIC_MODULES.map((m) => [m.key, m])
) as Record<AtomicModuleKey, AtomicModuleMeta>

export const DEFAULT_MODULES: AtomicModuleKey[] = []

export const CATEGORY_LABELS: Record<AtomicModuleCategory, string> = {
  basic: "基本信息",
  "pre-class": "课前准备",
  "in-class": "教学实施",
  "post-class": "课后测验",
}
