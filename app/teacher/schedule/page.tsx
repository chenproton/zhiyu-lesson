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
  AlertCircle,
  CheckCircle2,
  CircleDot,
  Layers,
  MonitorPlay,
  Users,
  Hand,
  Dices,
  ClipboardCheck,
  LogOut,
  Radio,
  GraduationCap,
  X,
  Trash2,
  Plus,
  MapPin,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  CheckSquare,
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

type CourseStatus = "unprep" | "doing" | "prep"

interface CourseItem {
  id: string
  name: string
  status: CourseStatus
  time: string
}

interface DaySchedule {
  day: string
  date: string
  isToday?: boolean
  courses: CourseItem[]
}

const STATUS_MAP: Record<
  CourseStatus,
  { label: string; color: string; bg: string; border: string; dot: string; icon: React.ReactNode }
> = {
  unprep: {
    label: "未备课",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-l-red-500",
    dot: "bg-red-500",
    icon: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
  },
  doing: {
    label: "备课中",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-l-amber-500",
    dot: "bg-amber-500",
    icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  },
  prep: {
    label: "已备课",
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-l-green-500",
    dot: "bg-green-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />,
  },
}

const WEEK_SCHEDULE: DaySchedule[] = [
  {
    day: "周一",
    date: "10/16",
    courses: [
      { id: "c1", name: "SQL注入漏洞检测", status: "prep", time: "08:00-09:40" },
      { id: "c2", name: "渗透测试基础", status: "doing", time: "10:00-11:40" },
      { id: "c3", name: "XSS跨站脚本防御", status: "unprep", time: "14:00-15:40" },
    ],
  },
  {
    day: "周二",
    date: "10/17",
    courses: [
      { id: "c4", name: "CSRF攻击原理与防护", status: "prep", time: "08:00-09:40" },
      { id: "c5", name: "缓冲区溢出分析", status: "unprep", time: "10:00-11:40" },
    ],
  },
  {
    day: "周三",
    date: "10/18",
    isToday: true,
    courses: [
      { id: "c6", name: "密码学基础", status: "doing", time: "08:00-09:40" },
      { id: "c7", name: "网络协议分析", status: "unprep", time: "10:00-11:40" },
      { id: "c8", name: "Web应用安全扫描", status: "prep", time: "14:00-15:40" },
    ],
  },
  {
    day: "周四",
    date: "10/19",
    courses: [
      { id: "c9", name: "逆向工程入门", status: "unprep", time: "08:00-09:40" },
      { id: "c10", name: "恶意代码分析", status: "doing", time: "10:00-11:40" },
    ],
  },
  {
    day: "周五",
    date: "10/20",
    courses: [
      { id: "c11", name: "安全编码规范", status: "prep", time: "08:00-09:40" },
      { id: "c12", name: "漏洞挖掘实践", status: "prep", time: "10:00-11:40" },
      { id: "c13", name: "应急响应流程", status: "doing", time: "14:00-15:40" },
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

function CourseCard({
  course,
  onDelete,
  onEnterWorkspace,
}: {
  course: CourseItem
  onDelete?: (id: string) => void
  onEnterWorkspace?: () => void
}) {
  const s = STATUS_MAP[course.status]
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`
        group relative rounded-md border border-gray-100
        bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md
        border-l-4 ${s.border}
      `}
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
          {s.icon}
          <Badge
            variant="outline"
            className={`text-xs font-normal border-current ${s.color} ${s.bg}`}
          >
            {s.label}
          </Badge>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-gray-50 pt-2 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>教学楼 A-301</span>
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
                onEnterWorkspace?.()
              }}
            >
              进入备课
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
  const [workspaceMode, setWorkspaceMode] = useState<"prep" | "teach" | "learn">("prep")
  const [activeTab, setActiveTab] = useState("schedule")
  const [prepStage, setPrepStage] = useState<"pre" | "in" | "post">("pre")

  // Schedule state
  const [schedule, setSchedule] = useState<DaySchedule[]>(WEEK_SCHEDULE)
  const [weekOffset, setWeekOffset] = useState(0)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addDay, setAddDay] = useState("")
  const [newCourseName, setNewCourseName] = useState("")
  const [newCourseTime, setNewCourseTime] = useState("08:00-09:40")

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

  const handleAddCourse = () => {
    if (!newCourseName.trim() || !addDay) return
    const dayIndex = parseInt(addDay)
    setSchedule((prev) => {
      const next = [...prev]
      next[dayIndex] = {
        ...next[dayIndex],
        courses: [
          ...next[dayIndex].courses,
          {
            id: `c${Date.now()}`,
            name: newCourseName,
            status: "unprep",
            time: newCourseTime,
          },
        ],
      }
      return next
    })
    setNewCourseName("")
    setAddModalOpen(false)
  }

  const weekLabel = useMemo(() => {
    const base = new Date(2023, 9, 16)
    const start = new Date(base.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000)
    const end = new Date(start.getTime() + 4 * 24 * 60 * 60 * 1000)
    return `${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`
  }, [weekOffset])

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

                    <div className="flex items-center gap-5 text-sm">
                      <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-100" /><span className="text-gray-600">未备课</span></div>
                      <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100" /><span className="text-gray-600">备课中</span></div>
                      <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-100" /><span className="text-gray-600">已备课</span></div>
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

                    {day.isToday && (
                      <div className="flex items-start gap-1.5 rounded-md bg-red-50 border border-dashed border-red-200 px-2.5 py-2 text-xs text-red-500">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>距离上课不到48小时，请及时备课！</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2.5">
                      {day.courses.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          onDelete={(id) => handleDeleteCourse(dayIdx, id)}
                          onEnterWorkspace={() => {
                            setActiveTab("workspace")
                            setWorkspaceMode("prep")
                          }}
                        />
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto w-full border-dashed text-gray-400 hover:text-[#1890ff] hover:border-[#1890ff] hover:bg-[#e6f7ff]"
                      onClick={() => {
                        setAddDay(String(dayIdx))
                        setAddModalOpen(true)
                      }}
                    >
                      + 新增课程
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Course Modal */}
            <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>新建排课</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>课程名称</Label>
                    <Input
                      placeholder="请输入课程名称"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>上课时间</Label>
                    <Select value={newCourseTime} onValueChange={setNewCourseTime}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00-09:40">08:00-09:40</SelectItem>
                        <SelectItem value="10:00-11:40">10:00-11:40</SelectItem>
                        <SelectItem value="14:00-15:40">14:00-15:40</SelectItem>
                        <SelectItem value="16:00-17:40">16:00-17:40</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>上课日期</Label>
                    <Select value={addDay} onValueChange={setAddDay}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {schedule.map((d, i) => (
                          <SelectItem key={i} value={String(i)}>{d.day} ({d.date})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddModalOpen(false)}>取消</Button>
                  <Button onClick={handleAddCourse} className="bg-[#1890ff] hover:bg-[#40a9ff]">确认</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* 备课工作台 Tab */}
          <TabsContent value="workspace" className="mt-0">
            <div className="flex flex-col gap-4 h-[calc(100vh-220px)]">
              {/* Workspace Toolbar */}
              <Card className="border-0 shadow-sm shrink-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* 三态切换 */}
                      <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                        <button
                          onClick={() => setWorkspaceMode("prep")}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                            workspaceMode === "prep"
                              ? "bg-white text-[#1890ff] shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <CircleDot className="w-3 h-3" />
                          备课态
                        </button>
                        <button
                          onClick={() => setWorkspaceMode("teach")}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                            workspaceMode === "teach"
                              ? "bg-white text-red-500 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <Radio className="w-3 h-3" />
                          教师上课态
                        </button>
                        <button
                          onClick={() => setWorkspaceMode("learn")}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                            workspaceMode === "learn"
                              ? "bg-white text-green-500 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <GraduationCap className="w-3 h-3" />
                          学生学习态
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        SQL注入原理与分类
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {workspaceMode === "prep" && (
                        <>
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
                        </>
                      )}
                      {workspaceMode === "teach" && (
                        <Button size="sm" variant="destructive" className="gap-1.5">
                          <LogOut className="w-4 h-4" />
                          下课
                        </Button>
                      )}
                      {workspaceMode === "learn" && (
                        <span className="text-xs text-gray-400">学生视角预览模式</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workspace Body - Prep Mode */}
              {workspaceMode === "prep" && (
              <div className="flex gap-4 flex-1 min-h-0">
                {/* Left: Catalog Tree */}
                <Card className="w-[320px] border-0 shadow-sm flex flex-col shrink-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#1890ff]" />
                      课程目录
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto pt-0">
                    <CatalogTree
                      nodes={CATALOG_DATA}
                      selectedId={selectedLessonId}
                      onSelect={setSelectedLessonId}
                    />
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
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto pt-4">
                    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                      {prepStage === "pre" && (
                        <>
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
                          {/* 课前：学习目标 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-[#1890ff] to-[#66b1ff] rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">学习目标</h3>
                            </div>
                            <div className="min-h-[100px] rounded-lg border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-400 leading-relaxed">
                              请输入学习目标...（富文本编辑器占位区域）
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
                          {/* 课中：签到 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">课堂签到</h3>
                              <div className="ml-auto">
                                <Button size="sm" className="h-7 text-xs bg-green-500 hover:bg-green-600">+ 添加签到</Button>
                              </div>
                            </div>
                            <div className="min-h-[80px] rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-6 text-center text-sm text-gray-400">
                              <ClipboardCheck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              暂无签到配置，可添加限时签到或位置签到
                            </div>
                          </div>
                          {/* 课中：课件资源 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">课中资源</h3>
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
                          {/* 课后：学习反馈 */}
                          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                              <h3 className="text-sm font-semibold text-gray-800">学习反馈</h3>
                              <div className="ml-auto">
                                <Button size="sm" className="h-7 text-xs bg-purple-500 hover:bg-purple-600">+ 添加问卷</Button>
                              </div>
                            </div>
                            <div className="min-h-[80px] rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-6 text-center text-sm text-gray-400">
                              <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              暂无学习反馈问卷，可添加满意度调查或学习评价
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              )}

              {/* Workspace Body - Teach Mode */}
              {workspaceMode === "teach" && (
              <div className="flex gap-4 flex-1 min-h-0">
                {/* Left: Catalog Tree */}
                <Card className="w-[280px] border-0 shadow-sm flex flex-col shrink-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-red-500" />
                      课程目录
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto pt-0">
                    <CatalogTree
                      nodes={CATALOG_DATA}
                      selectedId={selectedLessonId}
                      onSelect={setSelectedLessonId}
                    />
                  </CardContent>
                </Card>

                {/* Center: Presentation Area */}
                <Card className="flex-1 border-0 shadow-sm flex flex-col min-h-0">
                  <CardContent className="flex-1 p-0 flex flex-col">
                    {/* Slide Area */}
                    <div className="flex-1 bg-slate-800 flex items-center justify-center relative">
                      <div className="text-center text-white p-8">
                        <MonitorPlay className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                        <p className="text-lg font-medium">SQL注入原理与分类</p>
                        <p className="text-sm text-slate-400 mt-2">第 12 / 28 页</p>
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur rounded-full px-4 py-2">
                        <button className="text-white/80 hover:text-white text-xs">◀ 上一页</button>
                        <span className="text-white/30">|</span>
                        <button className="text-white/80 hover:text-white text-xs">下一页 ▶</button>
                        <span className="text-white/30">|</span>
                        <button className="text-white/80 hover:text-white text-xs">批注</button>
                        <span className="text-white/30">|</span>
                        <button className="text-white/80 hover:text-white text-xs">聚焦</button>
                      </div>
                    </div>
                    {/* Quick Actions */}
                    <div className="grid grid-cols-4 gap-3 p-4 bg-white border-t">
                      <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <ClipboardCheck className="w-5 h-5 text-cyan-500" />
                        <span className="text-xs text-gray-700">签到</span>
                      </button>
                      <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span className="text-xs text-gray-700">一键下发测验</span>
                      </button>
                      <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <Hand className="w-5 h-5 text-purple-500" />
                        <span className="text-xs text-gray-700">举手/抢答</span>
                      </button>
                      <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <Dices className="w-5 h-5 text-orange-500" />
                        <span className="text-xs text-gray-700">随机点名</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Right: Student Monitor */}
                <Card className="w-[260px] border-0 shadow-sm flex flex-col shrink-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-500" />
                      学生状态
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto pt-0 space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-green-50">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-700">李明</span>
                      </div>
                      <span className="text-xs text-green-600">在线</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-green-50">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-700">王芳</span>
                      </div>
                      <span className="text-xs text-green-600">专注</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-orange-50">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-sm text-gray-700">张伟</span>
                      </div>
                      <span className="text-xs text-orange-600">挂机</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                        <span className="text-sm text-gray-400">刘洋</span>
                      </div>
                      <span className="text-xs text-gray-400">缺席</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              )}

              {/* Workspace Body - Learn Mode */}
              {workspaceMode === "learn" && (
              <div className="flex-1 min-h-0 flex items-center justify-center">
                <Card className="max-w-2xl w-full p-8 text-center">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">学生学习态预览</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    此模式下将模拟学生端的学习界面，包括课件浏览、测验答题、学习进度跟踪等功能。
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setWorkspaceMode("prep")}>
                      返回备课态
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-600">
                      <a href="/learn/courses/system/1/learn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-white">
                        <Eye className="w-4 h-4" />
                        打开学习页面预览
                      </a>
                    </Button>
                  </div>
                </Card>
              </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
