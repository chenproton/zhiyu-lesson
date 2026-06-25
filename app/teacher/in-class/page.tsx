"use client"

import { useState, useMemo } from "react"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Layers,
  BookOpen,
  MonitorPlay,
  MapPin,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type ScheduleType = "scene" | "course" | "hybrid"

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
  hybrid: {
    label: "混合课程",
    color: "text-pink-600",
    bg: "bg-pink-50",
    icon: <MonitorPlay className="w-3.5 h-3.5 text-pink-500" />,
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
      { id: "h1", name: "Web前端开发混合课程", type: "hybrid", time: "14:00-15:40", location: "教学楼 A-201", grade: "2026级", className: "软件工程1班", date: "10/17" },
    ],
  },
  {
    day: "周三",
    date: "10/18",
    isToday: true,
    courses: [
      { id: "c6", name: "密码学基础", type: "course", time: "08:00-09:40", location: "教学楼 A-301", grade: "2023级", className: "软件工程1班", date: "10/18" },
      { id: "c7", name: "网络协议分析", type: "scene", time: "10:00-11:40", location: "实训楼 B-205", grade: "2022级", className: "信息安全1班", date: "10/18" },
      { id: "h2", name: "软件测试技术混合课程", type: "hybrid", time: "14:00-15:40", location: "实训楼 C-102", grade: "2026级", className: "软件工程2班", date: "10/18" },
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
      { id: "h3", name: "机器学习混合课程", type: "hybrid", time: "14:00-15:40", location: "机房 D-305", grade: "2026级", className: "人工智能1班", date: "10/20" },
    ],
  },
  { day: "周六", date: "10/21", courses: [] },
  { day: "周日", date: "10/22", courses: [] },
]

const BASE_DATE = new Date(2023, 9, 16)
const TODAY = new Date(2023, 9, 18)

function formatMD(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getMonday(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - (day === 0 ? 6 : day - 1)
  return new Date(d.setDate(diff))
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function getDayLabel(date: Date) {
  const labels = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
  return labels[date.getDay()]
}

const scheduleMap = new Map<string, ScheduleItem[]>()
WEEK_SCHEDULE.forEach((d) => scheduleMap.set(d.date, d.courses))

function ScheduleCard({ course }: { course: ScheduleItem }) {
  const t = TYPE_MAP[course.type]

  return (
    <div
      className={`group relative rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-gray-200 overflow-hidden border-l-4 ${
        course.type === "course"
          ? "border-l-blue-400 border-gray-100"
          : course.type === "hybrid"
          ? "border-l-pink-400 border-gray-100"
          : "border-l-purple-400 border-gray-100"
      }`}
    >
      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-gray-800 leading-snug">
            {course.name}
          </h4>
          <Badge
            variant="outline"
            className={`text-[10px] font-medium border-current shrink-0 mt-0.5 ${t.color} ${t.bg}`}
          >
            {t.label}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              course.type === "course"
                ? "bg-blue-500"
                : course.type === "hybrid"
                ? "bg-pink-500"
                : "bg-purple-500"
            }`}
          />
          <span className="font-medium">{course.time}</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{course.location || "教学楼 A-301"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>
              {course.grade || "2023级"} · {course.className || "软件工程1班"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WeekView({ currentDate }: { currentDate: Date }) {
  const days = useMemo(() => {
    const monday = getMonday(currentDate)
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(monday, i)
      const md = formatMD(date)
      return {
        date,
        md,
        label: getDayLabel(date),
        courses: scheduleMap.get(md) ?? [],
        isToday: isSameDay(date, TODAY),
      }
    })
  }, [currentDate])

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-3 w-8 bg-gradient-to-r from-[#f0f2f5] to-transparent pointer-events-none z-10 rounded-l-xl" />
      <div className="absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-[#f0f2f5] to-transparent pointer-events-none z-10 rounded-r-xl" />
      <div
        className="overflow-x-auto pb-3"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent" }}
      >
        <div className="flex gap-4 min-w-max px-1">
          {days.map((day) => (
            <div
              key={day.md}
              className={`flex flex-col gap-3 rounded-xl p-4 min-h-[460px] w-[300px] flex-shrink-0 ${
                day.isToday
                  ? "bg-gradient-to-b from-[#f0f7ff] to-white ring-2 ring-[#1890ff] shadow-md"
                  : "bg-white shadow-sm border border-gray-50"
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-dashed border-gray-200">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-base font-bold ${
                      day.isToday ? "text-[#1890ff]" : "text-gray-800"
                    }`}
                  >
                    {day.label}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {day.md}
                  </span>
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
                    <ScheduleCard key={course.id} course={course} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MonthView({ currentDate }: { currentDate: Date }) {
  const weeks = useMemo(() => {
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    )
    const start = getMonday(firstDay)
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    )
    const end = addDays(lastDay, lastDay.getDay() === 0 ? 0 : 7 - lastDay.getDay())

    const rows: {
      date: Date
      md: string
      inMonth: boolean
      isToday: boolean
      courses: ScheduleItem[]
    }[][] = []
    let cursor = new Date(start)

    while (cursor <= end) {
      const week: (typeof rows)[number][number][] = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(cursor)
        const md = formatMD(date)
        week.push({
          date,
          md,
          inMonth: date.getMonth() === currentDate.getMonth(),
          isToday: isSameDay(date, TODAY),
          courses: scheduleMap.get(md) ?? [],
        })
        cursor = addDays(cursor, 1)
      }
      rows.push(week)
    }
    return rows
  }, [currentDate])

  const flatDays = weeks.flat()

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="grid grid-cols-7">
        {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {flatDays.map((cell, idx) => (
          <div
            key={idx}
            className={`min-h-[120px] rounded-lg border p-2 flex flex-col ${
              cell.inMonth
                ? "bg-white border-gray-100"
                : "bg-gray-50/50 border-gray-50"
            } ${cell.isToday ? "ring-2 ring-[#1890ff]" : ""}`}
          >
            <div
              className={`text-sm font-medium mb-1 ${
                cell.inMonth
                  ? cell.isToday
                    ? "text-[#1890ff]"
                    : "text-gray-700"
                  : "text-gray-400"
              }`}
            >
              {cell.date.getDate()}
            </div>
            <div className="flex flex-col gap-1 overflow-hidden">
              {cell.courses.map((course) => (
                <div
                  key={course.id}
                  className={`text-[10px] px-1.5 py-1 rounded border ${TYPE_MAP[course.type].color} ${TYPE_MAP[course.type].bg} border-current truncate`}
                  title={course.name}
                >
                  {course.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SmartClassroomPage() {
  const [currentDate, setCurrentDate] = useState<Date>(BASE_DATE)
  const [viewMode, setViewMode] = useState<"week" | "month">("week")

  const headerLabel = useMemo(() => {
    if (viewMode === "week") {
      const monday = getMonday(currentDate)
      const sunday = addDays(monday, 6)
      return `${monday.getMonth() + 1}月${monday.getDate()}日 - ${
        sunday.getMonth() + 1
      }月${sunday.getDate()}日`
    }
    return `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`
  }, [currentDate, viewMode])

  const handlePrev = () => {
    if (viewMode === "week") {
      setCurrentDate((d) => addDays(d, -7))
    } else {
      setCurrentDate((d) => addMonths(d, -1))
    }
  }

  const handleNext = () => {
    if (viewMode === "week") {
      setCurrentDate((d) => addDays(d, 7))
    } else {
      setCurrentDate((d) => addMonths(d, 1))
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                <Button
                  size="sm"
                  className={`h-7 text-xs ${
                    viewMode === "week"
                      ? "bg-white text-[#1890ff] shadow-sm hover:bg-white hover:text-[#1890ff]"
                      : "bg-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setViewMode("week")}
                >
                  周视图
                </Button>
                <Button
                  size="sm"
                  className={`h-7 text-xs ${
                    viewMode === "month"
                      ? "bg-white text-[#1890ff] shadow-sm hover:bg-white hover:text-[#1890ff]"
                      : "bg-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setViewMode("month")}
                >
                  月视图
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-700 font-medium min-w-[160px] text-center">
                  {headerLabel}
                </span>
                <button
                  onClick={handleNext}
                  className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="px-6 py-5">
        <div className="max-w-[1440px] mx-auto">
          {viewMode === "week" ? (
            <WeekView currentDate={currentDate} />
          ) : (
            <MonthView currentDate={currentDate} />
          )}
        </div>
      </div>
    </div>
  )
}
