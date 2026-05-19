"use client"

import { useState, useMemo } from "react"
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderOpen,
  Save,
  Eye,
  Send,
  BookOpen,
  Clock,
  Layers,
  MonitorPlay,
  Users,
  Hand,
  Dices,
  ClipboardCheck,
  GraduationCap,
  X,
  Trash2,
  MapPin,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  CheckSquare,
  RefreshCw,
  LayoutList,
  Plus,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

type ScheduleType = "scene" | "course" | "exam"

interface ScheduleItem {
  id: string
  name: string
  type: ScheduleType
  time: string
  location?: string
}

interface DaySchedule {
  day: string
  date: string
  isToday?: boolean
  courses: ScheduleItem[]
}

const TYPE_MAP: Record<
  ScheduleType,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  scene: {
    label: "场景教学",
    color: "text-purple-600",
    bg: "bg-purple-50",
    icon: <Layers className="w-3.5 h-3.5 text-purple-500" />,
  },
  course: {
    label: "课程教学",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: <BookOpen className="w-3.5 h-3.5 text-blue-500" />,
  },
  exam: {
    label: "考试",
    color: "text-red-600",
    bg: "bg-red-50",
    icon: <ClipboardCheck className="w-3.5 h-3.5 text-red-500" />,
  },
}

const WEEK_SCHEDULE: DaySchedule[] = [
  {
    day: "周一",
    date: "10/16",
    courses: [
      { id: "c1", name: "SQL注入漏洞检测", type: "course", time: "08:00-09:40", location: "教学楼 A-301" },
      { id: "c2", name: "渗透测试基础", type: "scene", time: "10:00-11:40", location: "实训楼 B-205" },
      { id: "c3", name: "XSS跨站脚本防御", type: "course", time: "14:00-15:40", location: "教学楼 A-302" },
    ],
  },
  {
    day: "周二",
    date: "10/17",
    courses: [
      { id: "c4", name: "CSRF攻击原理与防护", type: "course", time: "08:00-09:40", location: "教学楼 A-301" },
      { id: "c5", name: "缓冲区溢出分析", type: "exam", time: "10:00-11:40", location: "机房 C-401" },
    ],
  },
  {
    day: "周三",
    date: "10/18",
    isToday: true,
    courses: [
      { id: "c6", name: "密码学基础", type: "course", time: "08:00-09:40", location: "教学楼 A-301" },
      { id: "c7", name: "网络协议分析", type: "scene", time: "10:00-11:40", location: "实训楼 B-205" },
      { id: "c8", name: "Web应用安全扫描", type: "course", time: "14:00-15:40", location: "教学楼 A-302" },
    ],
  },
  {
    day: "周四",
    date: "10/19",
    courses: [
      { id: "c9", name: "逆向工程入门", type: "course", time: "08:00-09:40", location: "教学楼 A-301" },
      { id: "c10", name: "恶意代码分析", type: "scene", time: "10:00-11:40", location: "实训楼 B-205" },
    ],
  },
  {
    day: "周五",
    date: "10/20",
    courses: [
      { id: "c11", name: "安全编码规范", type: "course", time: "08:00-09:40", location: "教学楼 A-301" },
      { id: "c12", name: "漏洞挖掘实践", type: "scene", time: "10:00-11:40", location: "实训楼 B-205" },
      { id: "c13", name: "应急响应流程", type: "exam", time: "14:00-15:40", location: "机房 C-401" },
    ],
  },
]

interface CatalogNode {
  id: string
  title: string
  type: "chapter" | "lesson"
  children?: CatalogNode[]
}

const CATALOG_DATA: CatalogNode[] = [
  {
    id: "ch1",
    title: "第一章：Web安全基础",
    type: "chapter",
    children: [
      { id: "l1", title: "1.1 HTTP协议与Web架构", type: "lesson" },
      { id: "l2", title: "1.2 常见Web漏洞概述", type: "lesson" },
      { id: "l3", title: "1.3 安全测试环境搭建", type: "lesson" },
    ],
  },
  {
    id: "ch2",
    title: "第二章：注入攻击",
    type: "chapter",
    children: [
      { id: "l4", title: "2.1 SQL注入原理与分类", type: "lesson" },
      { id: "l5", title: "2.2 SQLMap工具实战", type: "lesson" },
      { id: "l6", title: "2.3 命令注入与代码注入", type: "lesson" },
    ],
  },
  {
    id: "ch3",
    title: "第三章：身份认证与会话管理",
    type: "chapter",
    children: [
      { id: "l7", title: "3.1 认证机制设计缺陷", type: "lesson" },
      { id: "l8", title: "3.2 会话固定与劫持", type: "lesson" },
    ],
  },
  {
    id: "ch4",
    title: "第四章：渗透测试实战",
    type: "chapter",
    children: [
      { id: "l9", title: "4.1 信息收集与 reconnaissance", type: "lesson" },
      { id: "l10", title: "4.2 漏洞利用与后渗透", type: "lesson" },
      { id: "l11", title: "4.3 渗透测试报告撰写", type: "lesson" },
    ],
  },
]

const COURSE_OPTIONS = [
  { id: "sys-1", name: "Web安全攻防体系课", type: "体系课" },
  { id: "sys-2", name: "数据结构与算法", type: "体系课" },
  { id: "grain-1", name: "SQL注入原理与分类", type: "颗粒课" },
  { id: "grain-2", name: "缓冲区溢出分析", type: "颗粒课" },
]

function ScheduleCard({
  course,
  onDelete,
}: {
  course: ScheduleItem
  onDelete?: (id: string) => void
}) {
  const t = TYPE_MAP[course.type]
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="group relative rounded-md border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium text-gray-800 truncate">{course.name}</span>
          <span className="text-xs text-gray-400">{course.time}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {t.icon}
          <Badge
            variant="outline"
            className={`text-xs font-normal border-current ${t.color} ${t.bg}`}
          >
            {t.label}
          </Badge>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-gray-50 pt-2 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{course.location || "教学楼 A-301"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs flex-1 border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={(e) => {
                e.stopPropagation()
                alert(`${course.name} - 签到功能（演示）`)
              }}
            >
              <CheckSquare className="w-3 h-3 mr-1" />
              签到
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs flex-1 bg-[#1890ff] hover:bg-[#40a9ff]"
              onClick={(e) => {
                e.stopPropagation()
                alert(`前往上课：${course.name}`)
              }}
            >
              前往上课
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs text-red-600 hover:text-red-700 hover:border-red-200"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(course.id)
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function CatalogTree({
  nodes,
  selectedId,
  onSelect,
}: {
  nodes: CatalogNode[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      {nodes.map((node) =>
        node.type === "chapter" ? (
          <Collapsible key={node.id} defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-400 transition-transform data-[state=open]:rotate-90" />
              <FolderOpen className="w-4 h-4 text-[#1890ff]" />
              <span className="truncate">{node.title}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {node.children && (
                <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-gray-100 pl-2">
                  <CatalogTree
                    nodes={node.children}
                    selectedId={selectedId}
                    onSelect={onSelect}
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <button
            key={node.id}
            onClick={() => onSelect(node.id)}
            className={`
              flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left transition-colors
              ${
                selectedId === node.id
                  ? "bg-[#e6f7ff] text-[#1890ff] font-medium border-l-2 border-[#1890ff]"
                  : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="truncate">{node.title}</span>
          </button>
        )
      )}
    </div>
  )
}

export default function SmartClassroomPage() {
  const [selectedLessonId, setSelectedLessonId] = useState("l4")
  const [activeTab, setActiveTab] = useState("schedule")
  const [prepStage, setPrepStage] = useState<"pre" | "in" | "post">("pre")

  // Schedule state
  const [schedule, setSchedule] = useState<DaySchedule[]>(WEEK_SCHEDULE)
  const [weekOffset, setWeekOffset] = useState(0)

  // Course selector state
  const [selectedCourseId, setSelectedCourseId] = useState("sys-1")

  const handleDeleteCourse = (dayIndex: number, courseId: string) => {
    setSchedule((prev) => {
      const next = [...prev]
      next[dayIndex] = {
        ...next[dayIndex],
        courses: next[dayIndex].courses.filter((c) => c.id !== courseId),
      }
      return next
    })
  }

  const weekLabel = useMemo(() => {
    const base = new Date(2023, 9, 16)
    const start = new Date(base.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000)
    const end = new Date(start.getTime() + 4 * 24 * 60 * 60 * 1000)
    return `${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`
  }, [weekOffset])

  const selectedCourse = COURSE_OPTIONS.find((c) => c.id === selectedCourseId)

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#1890ff]" />
                智慧课堂管理
              </h1>
              <p className="text-muted-foreground mt-1">教学日程与备课系统</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md">
                <CalendarIcon className="w-4 h-4" />
                <span>2023年10月 第3周</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-4">
          <TabsList className="w-fit bg-white border border-gray-100 shadow-sm">
            <TabsTrigger
              value="schedule"
              className="data-[state=active]:bg-[#1890ff] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <CalendarIcon className="w-4 h-4 mr-1.5" />
              教学日程
            </TabsTrigger>
            <TabsTrigger
              value="workspace"
              className="data-[state=active]:bg-[#1890ff] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <BookOpen className="w-4 h-4 mr-1.5" />
              备课工作台
            </TabsTrigger>
          </TabsList>

          {/* 教学日程 Tab */}
          <TabsContent value="schedule" className="mt-0">
            <div className="flex flex-col gap-4">
              {/* Toolbar */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                        <Button size="sm" className="bg-white text-[#1890ff] shadow-sm hover:bg-white hover:text-[#1890ff]">周视图</Button>
                        <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700">月视图</Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setWeekOffset((w) => w - 1)} className="p-1 rounded hover:bg-gray-100 text-gray-500"><ChevronLeft className="w-4 h-4" /></button>
                        <span className="text-sm text-gray-600 min-w-[180px] text-center">{weekLabel}</span>
                        <button onClick={() => setWeekOffset((w) => w + 1)} className="p-1 rounded hover:bg-gray-100 text-gray-500"><ChevronRightIcon className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-5 text-sm">
                        <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-purple-100" /><span className="text-gray-600">场景教学</span></div>
                        <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-100" /><span className="text-gray-600">课程教学</span></div>
                        <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-100" /><span className="text-gray-600">考试</span></div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Button size="sm" variant="outline" className="gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5" />
                          从教务系统同步
                        </Button>
                        <span className="text-[11px] text-gray-400 mt-1">最近同步时间 2026/05/21 18:22</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calendar Grid */}
              <div className="grid grid-cols-5 gap-3">
                {schedule.map((day, dayIdx) => (
                  <div
                    key={day.day}
                    className={`flex flex-col gap-3 rounded-xl p-4 min-h-[420px] ${day.isToday ? "bg-[#f0f7ff] ring-2 ring-[#1890ff]" : "bg-white shadow-sm"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">{day.day} ({day.date})</span>
                      {day.isToday && <Badge className="bg-[#1890ff] text-white text-xs font-normal hover:bg-[#1890ff]">今日</Badge>}
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {day.courses.map((course) => (
                        <ScheduleCard
                          key={course.id}
                          course={course}
                          onDelete={(id) => handleDeleteCourse(dayIdx, id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 备课工作台 Tab */}
          <TabsContent value="workspace" className="mt-0">
            <div className="flex flex-col gap-4 h-[calc(100vh-220px)]">
              {/* Workspace Toolbar */}
              <Card className="border-0 shadow-sm shrink-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        当前备课：{selectedCourse ? `《${selectedCourse.name}》` : "请选择课程"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workspace Body - Prep Mode */}
              <div className="flex gap-4 flex-1 min-h-0">
                {/* Left: Course Selector + Catalog Tree */}
                <Card className="w-[320px] border-0 shadow-sm flex flex-col shrink-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#1890ff]" />
                      课程目录
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto pt-0 space-y-3">
                    {/* Course Selector */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">选择课程</Label>
                      <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COURSE_OPTIONS.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              <span className="flex items-center gap-2">
                                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{c.type}</span>
                                {c.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="border-t border-gray-50 pt-2">
                      <CatalogTree
                        nodes={CATALOG_DATA}
                        selectedId={selectedLessonId}
                        onSelect={setSelectedLessonId}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Right: Editor Area */}
                <Card className="flex-1 border-0 shadow-sm flex flex-col min-h-0">
                  <CardHeader className="pb-3 border-b border-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-sm font-semibold text-gray-800">
                          备课内容编辑区
                        </CardTitle>
                        {/* 三环节切换 */}
                        <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-0.5">
                          <button
                            onClick={() => setPrepStage("pre")}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              prepStage === "pre" ? "bg-white text-[#1890ff] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            课前环节
                          </button>
                          <button
                            onClick={() => setPrepStage("in")}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              prepStage === "in" ? "bg-white text-[#1890ff] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            课中环节
                          </button>
                          <button
                            onClick={() => setPrepStage("post")}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              prepStage === "post" ? "bg-white text-[#1890ff] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            课后环节
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-normal text-gray-500">
                          自动保存
                        </Badge>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Save className="w-4 h-4" />
                          保存
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Eye className="w-4 h-4" />
                          预览
                        </Button>
                        <Button size="sm" className="gap-1.5 bg-[#1890ff] hover:bg-[#40a9ff]">
                          <Send className="w-4 h-4" />
                          提交
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto pt-4">
                    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                      {prepStage === "pre" && (
                        <>
                          {/* 课前：教学目标 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-[#1890ff] to-[#66b1ff] rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">教学目标</h3>
                            </div>
                            <div className="min-h-[80px] rounded-lg border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-400 leading-relaxed">
                              请输入本节课的教学目标...（富文本编辑器占位区域）
                            </div>
                          </div>
                          {/* 课前：导学教案 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-[#1890ff] to-[#66b1ff] rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">导学教案</h3>
                            </div>
                            <div className="min-h-[100px] rounded-lg border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-400 leading-relaxed">
                              请输入课前备课内容...（富文本编辑器占位区域）
                            </div>
                          </div>
                          {/* 课前：课前预习 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-[#1890ff] to-[#66b1ff] rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">课前预习</h3>
                              <div className="ml-auto flex items-center gap-2">
                                <Button size="sm" className="h-7 text-xs bg-[#1890ff] hover:bg-[#40a9ff]">+ 从题库导入</Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs">批量设置分数</Button>
                              </div>
                            </div>
                            <div className="min-h-[80px] rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-6 text-center text-sm text-gray-400">
                              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              暂无预习题目，请点击上方按钮导入
                            </div>
                          </div>
                        </>
                      )}

                      {prepStage === "in" && (
                        <>
                          {/* 课中：课件资源 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">课件资源</h3>
                              <div className="ml-auto">
                                <Button size="sm" className="h-7 text-xs bg-green-500 hover:bg-green-600">+ 添加资源</Button>
                              </div>
                            </div>
                            <div className="min-h-[80px] rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-6 text-center text-sm text-gray-400">
                              <MonitorPlay className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              暂无课件资源，可上传PPT、PDF或视频
                            </div>
                          </div>
                          {/* 课中：随堂测 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">随堂测验</h3>
                              <div className="ml-auto flex items-center gap-2">
                                <Button size="sm" className="h-7 text-xs bg-green-500 hover:bg-green-600">+ 从题库导入</Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs">批量设置分数</Button>
                              </div>
                            </div>
                            <div className="min-h-[80px] rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-6 text-center text-sm text-gray-400">
                              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              暂无随堂测试题目
                            </div>
                          </div>
                          {/* 课中：互动讨论 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">互动讨论</h3>
                              <div className="ml-auto">
                                <Button size="sm" className="h-7 text-xs bg-green-500 hover:bg-green-600">+ 添加话题</Button>
                              </div>
                            </div>
                            <div className="min-h-[80px] rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-6 text-center text-sm text-gray-400">
                              <Hand className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              暂无讨论话题，可添加投票或讨论主题
                            </div>
                          </div>
                        </>
                      )}

                      {prepStage === "post" && (
                        <>
                          {/* 课后：课后作业 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">课后作业</h3>
                              <div className="ml-auto flex items-center gap-2">
                                <Button size="sm" className="h-7 text-xs bg-purple-500 hover:bg-purple-600">+ 添加作业</Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs">批量设置分数</Button>
                              </div>
                            </div>
                            <div className="min-h-[80px] rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-6 text-center text-sm text-gray-400">
                              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              暂无课后作业，可添加主观题或客观题
                            </div>
                          </div>
                          {/* 课后：课后测验 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">课后测验</h3>
                              <div className="ml-auto flex items-center gap-2">
                                <Button size="sm" className="h-7 text-xs bg-purple-500 hover:bg-purple-600">+ 从题库导入</Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs">批量设置分数</Button>
                              </div>
                            </div>
                            <div className="min-h-[80px] rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-6 text-center text-sm text-gray-400">
                              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              暂无课后测验题目
                            </div>
                          </div>
                          {/* 课后：课后拓展 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">课后拓展</h3>
                              <div className="ml-auto">
                                <Button size="sm" className="h-7 text-xs bg-purple-500 hover:bg-purple-600">+ 添加拓展资料</Button>
                              </div>
                            </div>
                            <div className="min-h-[80px] rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-6 text-center text-sm text-gray-400">
                              <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              暂无课后拓展资料，可添加推荐阅读或延伸学习资源
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
