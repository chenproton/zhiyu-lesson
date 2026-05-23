"use client"

import { useState, useMemo } from "react"
import {
  Calendar as CalendarIcon,
  ChevronRight,
  FileText,
  FolderOpen,
  Save,
  Eye,
  Send,
  BookOpen,
  Layers,
  MonitorPlay,
  Users,
  Hand,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronDown,
  Settings2,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EvaluationConfigModal, type EvalMethodKey } from "./_components/evaluation-config-modal"

type ScheduleType = "scene" | "course"

interface ScheduleItem {
  id: string
  name: string
  type: ScheduleType
  time: string
  location?: string
  grade?: string
  className?: string
  date: string
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
    label: "实践场景",
    color: "text-purple-600",
    bg: "bg-purple-50",
    icon: <Layers className="w-3.5 h-3.5 text-purple-500" />,
  },
  course: {
    label: "课程",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: <BookOpen className="w-3.5 h-3.5 text-blue-500" />,
  },
}

const WEEK_SCHEDULE: DaySchedule[] = [
  {
    day: "周一",
    date: "10/16",
    courses: [
      { id: "c1", name: "SQL注入漏洞检测", type: "course", time: "08:00-09:40", location: "教学楼 A-301", grade: "2023级", className: "软件工程1班", date: "10/16" },
      { id: "c2", name: "渗透测试基础", type: "scene", time: "10:00-11:40", location: "实训楼 B-205", grade: "2023级", className: "网络安全2班", date: "10/16" },
      { id: "c3", name: "XSS跨站脚本防御", type: "course", time: "14:00-15:40", location: "教学楼 A-302", grade: "2022级", className: "信息安全1班", date: "10/16" },
    ],
  },
  {
    day: "周二",
    date: "10/17",
    courses: [
      { id: "c4", name: "CSRF攻击原理与防护", type: "course", time: "08:00-09:40", location: "教学楼 A-301", grade: "2023级", className: "软件工程1班", date: "10/17" },
      { id: "c5", name: "缓冲区溢出分析", type: "scene", time: "10:00-11:40", location: "实训楼 B-205", grade: "2023级", className: "网络安全2班", date: "10/17" },
    ],
  },
  {
    day: "周三",
    date: "10/18",
    isToday: true,
    courses: [
      { id: "c6", name: "密码学基础", type: "course", time: "08:00-09:40", location: "教学楼 A-301", grade: "2023级", className: "软件工程1班", date: "10/18" },
      { id: "c7", name: "网络协议分析", type: "scene", time: "10:00-11:40", location: "实训楼 B-205", grade: "2022级", className: "信息安全1班", date: "10/18" },
      { id: "c8", name: "Web应用安全扫描", type: "course", time: "14:00-15:40", location: "教学楼 A-302", grade: "2023级", className: "软件工程2班", date: "10/18" },
    ],
  },
  {
    day: "周四",
    date: "10/19",
    courses: [
      { id: "c9", name: "逆向工程入门", type: "course", time: "08:00-09:40", location: "教学楼 A-301", grade: "2023级", className: "软件工程1班", date: "10/19" },
      { id: "c10", name: "恶意代码分析", type: "scene", time: "10:00-11:40", location: "实训楼 B-205", grade: "2022级", className: "信息安全1班", date: "10/19" },
    ],
  },
  {
    day: "周五",
    date: "10/20",
    courses: [
      { id: "c11", name: "安全编码规范", type: "course", time: "08:00-09:40", location: "教学楼 A-301", grade: "2023级", className: "软件工程1班", date: "10/20" },
      { id: "c12", name: "漏洞挖掘实践", type: "scene", time: "10:00-11:40", location: "实训楼 B-205", grade: "2023级", className: "网络安全2班", date: "10/20" },
      { id: "c13", name: "应急响应流程", type: "scene", time: "14:00-15:40", location: "实训楼 B-206", grade: "2022级", className: "信息安全1班", date: "10/20" },
    ],
  },
  { day: "周六", date: "10/21", courses: [] },
  { day: "周日", date: "10/22", courses: [] },
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

const SCENE_TASK_DATA = [
  {
    id: "scene-1",
    name: "Web渗透测试实验室",
    tasks: [
      { id: "task-1-1", name: "信息收集与侦察" },
      { id: "task-1-2", name: "漏洞扫描与分析" },
      { id: "task-1-3", name: "漏洞利用与后渗透" },
    ],
  },
  {
    id: "scene-2",
    name: "应急响应演练",
    tasks: [
      { id: "task-2-1", name: "事件发现与报告" },
      { id: "task-2-2", name: "威胁分析与溯源" },
      { id: "task-2-3", name: "处置与恢复" },
    ],
  },
  {
    id: "scene-3",
    name: "代码审计工坊",
    tasks: [
      { id: "task-3-1", name: "静态代码扫描" },
      { id: "task-3-2", name: "漏洞模式识别" },
      { id: "task-3-3", name: "修复方案验证" },
    ],
  },
]

function isCoursePast(dateStr: string) {
  const [m, d] = dateStr.split("/").map(Number)
  const date = new Date(2023, m - 1, d)
  const today = new Date(2023, 9, 18)
  return date < today
}

function ScheduleCard({
  course,
  onPrep,
  onGoClass,
}: {
  course: ScheduleItem
  onPrep?: (course: ScheduleItem) => void
  onGoClass?: (course: ScheduleItem) => void
}) {
  const t = TYPE_MAP[course.type]

  return (
    <div className={`group relative rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-gray-200 overflow-hidden ${course.type === "course" ? "border-l-4 border-l-blue-400 border-gray-100" : "border-l-4 border-l-purple-400 border-gray-100"}`}>
      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-gray-800 leading-snug">{course.name}</h4>
          <Badge
            variant="outline"
            className={`text-[10px] font-medium border-current shrink-0 mt-0.5 ${t.color} ${t.bg}`}
          >
            {t.label}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <div className={`w-1.5 h-1.5 rounded-full ${course.type === "course" ? "bg-blue-500" : "bg-purple-500"}`} />
          <span className="font-medium">{course.time}</span>
        </div>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{course.location || "教学楼 A-301"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{course.grade || "2023级"} · {course.className || "软件工程1班"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs flex-1 border-[#1890ff] text-[#1890ff] hover:bg-[#e6f7ff]"
            onClick={(e) => {
              e.stopPropagation()
              onPrep?.(course)
            }}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            前往备课
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs flex-1 bg-[#1890ff] hover:bg-[#40a9ff]"
            onClick={(e) => {
              e.stopPropagation()
              onGoClass?.(course)
            }}
          >
            <MonitorPlay className="w-3.5 h-3.5 mr-1" />
            前往上课
          </Button>
        </div>
      </div>
    </div>
  )
}

function WorkspaceScheduleList({
  schedules,
  selectedId,
  onSelect,
  filterType,
}: {
  schedules: DaySchedule[]
  selectedId: string | null
  onSelect: (id: string) => void
  filterType: ScheduleType
}) {
  const items = schedules.flatMap((day) =>
    day.courses
      .filter((c) => c.type === filterType)
      .map((c) => ({ ...c, dayLabel: day.day }))
  )

  if (items.length === 0) {
    return (
      <div className="text-center text-sm text-gray-400 py-8">
        暂无{filterType === "course" ? "课程" : "实践场景"}日程
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`text-left rounded-lg border p-3 transition-all ${
            selectedId === item.id
              ? "border-[#1890ff] bg-[#e6f7ff] shadow-sm"
              : "border-gray-100 bg-white hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${selectedId === item.id ? "text-[#1890ff]" : "text-gray-800"}`}>
              {item.name}
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] font-normal border-current ${
                item.type === "course" ? "text-blue-600 bg-blue-50" : "text-purple-600 bg-purple-50"
              }`}
            >
              {TYPE_MAP[item.type].label}
            </Badge>
          </div>
          <div className="text-xs text-gray-400 space-y-0.5">
            <div>{item.dayLabel} {item.time}</div>
            <div>{item.location}</div>
          </div>
        </button>
      ))}
    </div>
  )
}

function CourseRelationSelector({
  selectedIds,
  onChange,
}: {
  selectedIds: string[]
  onChange: (ids: string[]) => void
}) {
  const [courseId, setCourseId] = useState("sys-1")
  const course = COURSE_OPTIONS.find((c) => c.id === courseId)

  const toggleNode = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  const allLessons = CATALOG_DATA.flatMap((ch) => ch.children || [])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-xs text-gray-500 shrink-0">选择课程</Label>
        <Select value={courseId} onValueChange={setCourseId}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COURSE_OPTIONS.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                <span className="flex items-center gap-2">
                  <span className="text-[10px] px-1 py-0.5 rounded bg-gray-100 text-gray-500">{c.type}</span>
                  {c.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedIds.map((id) => {
            const name = allLessons.find((n) => n.id === id)?.title || id
            return (
              <Badge key={id} variant="secondary" className="text-xs font-normal gap-1">
                {name}
                <button
                  type="button"
                  onClick={() => toggleNode(id)}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}

      <div className="border rounded-lg p-2 max-h-[200px] overflow-y-auto">
        {course?.type === "体系课" ? (
          <div className="space-y-2">
            {CATALOG_DATA.map((chapter) => (
              <div key={chapter.id}>
                <div className="text-xs font-medium text-gray-700 px-2 py-1 flex items-center gap-1">
                  <FolderOpen className="w-3.5 h-3.5 text-[#1890ff]" />
                  {chapter.title}
                </div>
                <div className="ml-4 space-y-0.5">
                  {(chapter.children || []).map((lesson) => (
                    <label
                      key={lesson.id}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#1890ff] focus:ring-[#1890ff]"
                        checked={selectedIds.includes(lesson.id)}
                        onChange={() => toggleNode(lesson.id)}
                      />
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-600">{lesson.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <label className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-[#1890ff] focus:ring-[#1890ff]"
              checked={selectedIds.includes(courseId)}
              onChange={() => toggleNode(courseId)}
            />
            <div className="w-6 h-6 rounded bg-[#1890ff] flex items-center justify-center text-white text-[10px] font-bold">
              颗
            </div>
            <span className="text-xs text-gray-600">{course?.name}</span>
          </label>
        )}
      </div>
    </div>
  )
}

function SceneRelationSelector({
  selectedIds,
  onChange,
}: {
  selectedIds: string[]
  onChange: (ids: string[]) => void
}) {
  const toggleTask = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div className="space-y-3">
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedIds.map((id) => {
            const task = SCENE_TASK_DATA.flatMap((s) => s.tasks).find((t) => t.id === id)
            return (
              <Badge key={id} variant="secondary" className="text-xs font-normal gap-1">
                {task?.name || id}
                <button
                  type="button"
                  onClick={() => toggleTask(id)}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}

      <div className="border rounded-lg p-2 max-h-[200px] overflow-y-auto space-y-2">
        {SCENE_TASK_DATA.map((scene) => (
          <div key={scene.id}>
            <div className="text-xs font-medium text-gray-700 px-2 py-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              {scene.name}
            </div>
            <div className="ml-4 space-y-0.5">
              {scene.tasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                    checked={selectedIds.includes(task.id)}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className="text-xs text-gray-600">{task.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PrepContent({ stage }: { stage: "pre" | "in" | "post" }) {
  return (
    <>
      {stage === "pre" && (
        <>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
              <div className="w-1 h-4 bg-gradient-to-b from-[#1890ff] to-[#66b1ff] rounded-full" />
              <h3 className="text-sm font-semibold text-gray-800">教学目标</h3>
            </div>
            <div className="min-h-[80px] rounded-lg border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-400 leading-relaxed">
              请输入本节课的教学目标...（富文本编辑器占位区域）
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
              <div className="w-1 h-4 bg-gradient-to-b from-[#1890ff] to-[#66b1ff] rounded-full" />
              <h3 className="text-sm font-semibold text-gray-800">导学教案</h3>
            </div>
            <div className="min-h-[100px] rounded-lg border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-400 leading-relaxed">
              请输入课前备课内容...（富文本编辑器占位区域）
            </div>
          </div>
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

      {stage === "in" && (
        <>
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

      {stage === "post" && (
        <>
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
    </>
  )
}

export default function SmartClassroomPage() {
  const [activeTab, setActiveTab] = useState("schedule")
  const [prepStage, setPrepStage] = useState<"pre" | "in" | "post">("pre")

  // Schedule state
  const [schedule] = useState<DaySchedule[]>(WEEK_SCHEDULE)
  const [weekOffset, setWeekOffset] = useState(0)

  // Course workspace state
  const [selectedCourseScheduleId, setSelectedCourseScheduleId] = useState<string | null>(null)
  const [selectedCourseNodes, setSelectedCourseNodes] = useState<string[]>([])
  const [courseRelationExpanded, setCourseRelationExpanded] = useState(false)

  // Scene workspace state
  const [selectedSceneScheduleId, setSelectedSceneScheduleId] = useState<string | null>(null)
  const [selectedSceneTasks, setSelectedSceneTasks] = useState<string[]>([])
  const [sceneRelationExpanded, setSceneRelationExpanded] = useState(false)

  // Evaluation config modal state
  const [evalModalOpen, setEvalModalOpen] = useState(false)
  const [evalModalTaskName, setEvalModalTaskName] = useState("")
  const [evalModalMethods, setEvalModalMethods] = useState<EvalMethodKey[]>([])

  const weekLabel = useMemo(() => {
    const base = new Date(2023, 9, 16)
    const start = new Date(base.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000)
    const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000)
    return `${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`
  }, [weekOffset])

  const handleGoPrep = (course: ScheduleItem) => {
    if (course.type === "course") {
      setActiveTab("workspace-course")
      setSelectedCourseScheduleId(course.id)
    } else {
      setActiveTab("workspace-scene")
      setSelectedSceneScheduleId(course.id)
    }
  }

  const handleGoClass = (course: ScheduleItem) => {
    alert(`前往上课：${course.name}`)
  }

  // Deterministically assign 1-6 random evaluation methods per task
  const getTaskEvalMethods = useMemo(() => {
    const allMethods: EvalMethodKey[] = ["random_draw", "review", "paper", "question_bank", "homework", "outcome"]
    const cache = new Map<string, EvalMethodKey[]>()
    return (taskId: string): EvalMethodKey[] => {
      if (cache.has(taskId)) return cache.get(taskId)!
      let hash = 0
      for (let i = 0; i < taskId.length; i++) {
        hash = ((hash << 5) - hash + taskId.charCodeAt(i)) | 0
      }
      const count = (Math.abs(hash) % 6) + 1
      const shuffled = [...allMethods].sort((a, b) => {
        const ha = ((hash + a.charCodeAt(0)) % 7) - ((hash + b.charCodeAt(0)) % 7)
        return ha
      })
      const methods = shuffled.slice(0, count)
      cache.set(taskId, methods)
      return methods
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-[1440px] mx-auto px-6 py-4">
            {/* 第一行：标题 + Tabs */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                  <Layers className="w-5 h-5 text-[#1890ff]" />
                  智慧课堂管理
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">教学日程与备课系统</p>
              </div>
              <TabsList className="bg-gray-50/80 border border-gray-100 shadow-sm h-9">
                <TabsTrigger
                  value="schedule"
                  className="text-xs data-[state=active]:bg-[#1890ff] data-[state=active]:text-white data-[state=active]:shadow-sm px-3"
                >
                  <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                  教学日程
                </TabsTrigger>
                <TabsTrigger
                  value="workspace-course"
                  className="text-xs data-[state=active]:bg-[#1890ff] data-[state=active]:text-white data-[state=active]:shadow-sm px-3"
                >
                  <BookOpen className="w-3.5 h-3.5 mr-1" />
                  课程备课
                </TabsTrigger>
                <TabsTrigger
                  value="workspace-scene"
                  className="text-xs data-[state=active]:bg-[#1890ff] data-[state=active]:text-white data-[state=active]:shadow-sm px-3"
                >
                  <Layers className="w-3.5 h-3.5 mr-1" />
                  场景备课
                </TabsTrigger>
              </TabsList>
            </div>

            {/* 第二行：工具栏（根据 tab 变化） */}
            {activeTab === "schedule" && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                    <Button size="sm" className="h-7 text-xs bg-white text-[#1890ff] shadow-sm hover:bg-white hover:text-[#1890ff]">周视图</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-gray-500 hover:text-gray-700">月视图</Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setWeekOffset((w) => w - 1)} className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="text-sm text-gray-700 font-medium min-w-[160px] text-center">{weekLabel}</span>
                    <button onClick={() => setWeekOffset((w) => w + 1)} className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"><ChevronRightIcon className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-xs">
                  <div className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-purple-500 ring-2 ring-purple-100" /><span className="text-gray-500">实践场景</span></div>
                  <div className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-blue-500 ring-2 ring-blue-100" /><span className="text-gray-500">课程</span></div>
                </div>
              </div>
            )}

            {activeTab === "workspace-course" && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <BookOpen className="w-3.5 h-3.5 text-[#1890ff]" />
                  <span>课程备课工作台</span>
                  <span className="text-gray-300">|</span>
                  <span>请从左侧选择一个课程日程开始备课</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-normal text-gray-500 h-6">
                    自动保存
                  </Badge>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                    <Save className="w-3 h-3" />
                    保存
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                    <Eye className="w-3 h-3" />
                    预览
                  </Button>
                  <Button size="sm" className="h-7 text-xs gap-1 bg-[#1890ff] hover:bg-[#40a9ff]">
                    <Send className="w-3 h-3" />
                    提交
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "workspace-scene" && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  <span>实践场景备课工作台</span>
                  <span className="text-gray-300">|</span>
                  <span>请从左侧选择一个场景日程开始备课</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-normal text-gray-500 h-6">
                    自动保存
                  </Badge>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                    <Save className="w-3 h-3" />
                    保存
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                    <Eye className="w-3 h-3" />
                    预览
                  </Button>
                  <Button size="sm" className="h-7 text-xs gap-1 bg-[#1890ff] hover:bg-[#40a9ff]">
                    <Send className="w-3 h-3" />
                    提交
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-5">
          {/* 教学日程 Tab */}
          <TabsContent value="schedule" className="mt-0">
            <div className="max-w-[1440px] mx-auto">
              {/* Calendar Grid */}
              <div className="relative">
                {/* 左滑提示 */}
                <div className="absolute left-0 top-0 bottom-3 w-8 bg-gradient-to-r from-[#f0f2f5] to-transparent pointer-events-none z-10 rounded-l-xl" />
                {/* 右滑提示 */}
                <div className="absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-[#f0f2f5] to-transparent pointer-events-none z-10 rounded-r-xl" />
                <div className="overflow-x-auto pb-3" style={{ scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent" }}>
                  <div className="flex gap-4 min-w-max px-1">
                    {schedule.map((day) => (
                      <div
                        key={day.day}
                        className={`flex flex-col gap-3 rounded-xl p-4 min-h-[460px] w-[300px] flex-shrink-0 ${
                          day.isToday
                            ? "bg-gradient-to-b from-[#f0f7ff] to-white ring-2 ring-[#1890ff] shadow-md"
                            : "bg-white shadow-sm border border-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-dashed border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className={`text-base font-bold ${day.isToday ? "text-[#1890ff]" : "text-gray-800"}`}>
                              {day.day}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">{day.date}</span>
                          </div>
                          {day.isToday && (
                            <Badge className="bg-[#1890ff] text-white text-[10px] font-medium hover:bg-[#1890ff] px-2 py-0.5">
                              今日
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-col gap-3 flex-1">
                          {day.courses.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-2 min-h-[120px]">
                              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                                <CalendarIcon className="w-5 h-5 text-gray-300" />
                              </div>
                              <span className="text-xs">暂无安排</span>
                            </div>
                          ) : (
                            day.courses.map((course) => (
                              <ScheduleCard
                                key={course.id}
                                course={course}
                                onPrep={handleGoPrep}
                                onGoClass={handleGoClass}
                              />
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 课程备课工作台 Tab */}
          <TabsContent value="workspace-course" className="mt-0">
            <div className="flex gap-4 h-[calc(100vh-152px)]">
                {/* Left: Schedule List */}
                <Card className="w-[280px] border-0 shadow-sm flex flex-col shrink-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#1890ff]" />
                      课程日程
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto pt-0">
                    <WorkspaceScheduleList
                      schedules={schedule}
                      selectedId={selectedCourseScheduleId}
                      onSelect={setSelectedCourseScheduleId}
                      filterType="course"
                    />
                  </CardContent>
                </Card>

                {/* Right: Editor Area */}
                <Card className="flex-1 border-0 shadow-sm flex flex-col min-h-0">
                  <CardHeader className="pb-3 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-sm font-semibold text-gray-800">
                        备课内容编辑区
                      </CardTitle>
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
                  </CardHeader>

                  {/* 关联体系课/颗粒课 - 可折叠 */}
                  {selectedCourseScheduleId && (
                    <div className="border-b border-gray-50">
                      <div
                        className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
                        onClick={() => setCourseRelationExpanded((v) => !v)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="w-1 h-4 bg-gradient-to-b from-[#1890ff] to-[#66b1ff] rounded-full" />
                            <span className="text-sm font-medium text-gray-800">关联体系课/颗粒课</span>
                          </div>
                          {selectedCourseNodes.length > 0 ? (
                            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                              <Badge variant="secondary" className="text-[10px] h-5 shrink-0">
                                已关联 {selectedCourseNodes.length} 项
                              </Badge>
                              <span className="text-xs text-gray-400 truncate">
                                {(() => {
                                  const allLessons = CATALOG_DATA.flatMap((ch) => ch.children || [])
                                  return selectedCourseNodes.map((id) => allLessons.find((n) => n.id === id)?.title).filter(Boolean).join("、")
                                })()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">未关联</span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${courseRelationExpanded ? "rotate-180" : ""}`} />
                      </div>
                      {courseRelationExpanded && (
                        <div className="px-5 pb-4 bg-gray-50/30">
                          <CourseRelationSelector
                            selectedIds={selectedCourseNodes}
                            onChange={setSelectedCourseNodes}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <CardContent className="flex-1 overflow-y-auto pt-4">
                    {selectedCourseScheduleId ? (
                      <PrepContent stage={prepStage} />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                        <BookOpen className="w-10 h-10 text-gray-300" />
                        <span className="text-sm">请从左侧选择一个课程日程</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
          </TabsContent>

          {/* 实践场景备课工作台 Tab */}
          <TabsContent value="workspace-scene" className="mt-0">
            <div className="flex gap-4 h-[calc(100vh-152px)]">
                {/* Left: Schedule List */}
                <Card className="w-[280px] border-0 shadow-sm flex flex-col shrink-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-500" />
                      实践场景日程
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto pt-0">
                    <WorkspaceScheduleList
                      schedules={schedule}
                      selectedId={selectedSceneScheduleId}
                      onSelect={setSelectedSceneScheduleId}
                      filterType="scene"
                    />
                  </CardContent>
                </Card>

                {/* Right: Editor Area */}
                <Card className="flex-1 border-0 shadow-sm flex flex-col min-h-0">
                  <CardHeader className="pb-3 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-sm font-semibold text-gray-800">
                        备课内容编辑区
                      </CardTitle>
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
                  </CardHeader>

                  {/* 关联场景/任务 - 可折叠 */}
                  {selectedSceneScheduleId && (
                    <div className="border-b border-gray-50">
                      <div
                        className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
                        onClick={() => setSceneRelationExpanded((v) => !v)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                            <span className="text-sm font-medium text-gray-800">关联场景/任务</span>
                          </div>
                          {selectedSceneTasks.length > 0 ? (
                            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                              <Badge variant="secondary" className="text-[10px] h-5 shrink-0">
                                已关联 {selectedSceneTasks.length} 项
                              </Badge>
                              <span className="text-xs text-gray-400 truncate">
                                {(() => {
                                  const allTasks = SCENE_TASK_DATA.flatMap((s) => s.tasks)
                                  return selectedSceneTasks.map((id) => allTasks.find((t) => t.id === id)?.name).filter(Boolean).join("、")
                                })()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">未关联</span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${sceneRelationExpanded ? "rotate-180" : ""}`} />
                      </div>
                      {sceneRelationExpanded && (
                        <div className="px-5 pb-4 bg-gray-50/30">
                          <SceneRelationSelector
                            selectedIds={selectedSceneTasks}
                            onChange={setSelectedSceneTasks}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <CardContent className="flex-1 overflow-y-auto pt-4 space-y-4">
                    {selectedSceneScheduleId ? (
                      <>
                        {/* Selected task rows */}
                        {selectedSceneTasks.length > 0 && (
                          <div className="space-y-2">
                            {selectedSceneTasks.map((taskId) => {
                              const allTasks = SCENE_TASK_DATA.flatMap((s) => s.tasks)
                              const task = allTasks.find((t) => t.id === taskId)
                              if (!task) return null
                              const methods = getTaskEvalMethods(taskId)
                              return (
                                <div
                                  key={taskId}
                                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full shrink-0" />
                                    <span className="text-sm font-medium text-gray-800 truncate">{task.name}</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                      {methods.map((m) => {
                                        const labelMap: Record<string, string> = {
                                          random_draw: "现场问答",
                                          review: "现场评审",
                                          paper: "试卷",
                                          question_bank: "题库",
                                          homework: "作业",
                                          outcome: "成果评价",
                                        }
                                        const colorMap: Record<string, string> = {
                                          random_draw: "bg-blue-50 text-blue-600 border-blue-200",
                                          review: "bg-purple-50 text-purple-600 border-purple-200",
                                          paper: "bg-green-50 text-green-600 border-green-200",
                                          question_bank: "bg-orange-50 text-orange-600 border-orange-200",
                                          homework: "bg-pink-50 text-pink-600 border-pink-200",
                                          outcome: "bg-cyan-50 text-cyan-600 border-cyan-200",
                                        }
                                        return (
                                          <Badge key={m} variant="outline" className={`text-[10px] h-5 px-1.5 ${colorMap[m]}`}>
                                            {labelMap[m]}
                                          </Badge>
                                        )
                                      })}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs gap-1 shrink-0 ml-2"
                                    onClick={() => {
                                      setEvalModalTaskName(task.name)
                                      setEvalModalMethods(methods)
                                      setEvalModalOpen(true)
                                    }}
                                  >
                                    <Settings2 className="h-3 w-3" />
                                    测评方式配置
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                        <PrepContent stage={prepStage} />
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                        <Layers className="w-10 h-10 text-gray-300" />
                        <span className="text-sm">请从左侧选择一个实践场景日程</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
          </TabsContent>
        </div>
      </Tabs>

      <EvaluationConfigModal
        open={evalModalOpen}
        onOpenChange={setEvalModalOpen}
        taskName={evalModalTaskName}
        methods={evalModalMethods}
      />
    </div>
  )
}
