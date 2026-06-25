"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Search, BookOpen, Layers, MonitorPlay, Check } from "lucide-react"
import { courses } from "@/lib/mock-data"
import type { Course, CourseType } from "@/lib/types"
import { COURSE_TYPE_LABELS, COURSE_TYPE_COLORS } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BindCourseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule: { id: string; name: string; type: string } | null
  onBind: (scheduleId: string, course: Course) => void
}

const TABS: { key: CourseType; label: string; icon: React.ReactNode }[] = [
  { key: "system", label: "体系课", icon: <BookOpen className="w-4 h-4" /> },
  { key: "granular", label: "颗粒课", icon: <Layers className="w-4 h-4" /> },
  { key: "hybrid", label: "混合课程", icon: <MonitorPlay className="w-4 h-4" /> },
]

export function BindCourseModal({
  open,
  onOpenChange,
  schedule,
  onBind,
}: BindCourseModalProps) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<CourseType>("system")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (c.type !== activeTab) return false
      if (!search.trim()) return true
      const keyword = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(keyword) ||
        c.code.toLowerCase().includes(keyword)
      )
    })
  }, [activeTab, search])

  const selectedCourse = courses.find((c) => c.id === selectedId)

  const handleConfirm = () => {
    if (!schedule || !selectedCourse) return
    onBind(schedule.id, selectedCourse)
    setSelectedId(null)
    setSearch("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>绑定课程资源</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="text-sm text-gray-500">
            为课时「
            <span className="font-medium text-gray-700">
              {schedule?.name}
            </span>
            」选择要绑定的课程
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索课程名称或编码..."
              className="pl-9"
            />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as CourseType)
              setSelectedId(null)
            }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-3">
              {TABS.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key} className="gap-2">
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent
              value={activeTab}
              className="flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col mt-0"
            >
              <div className="flex-1 overflow-y-auto mt-4 border rounded-lg p-4 bg-gray-50/50">
                {filtered.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
                    <Search className="w-8 h-8 text-gray-300" />
                    <span>未找到匹配课程</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {filtered.map((course) => {
                      const selected = selectedId === course.id
                      return (
                        <div
                          key={course.id}
                          onClick={() => setSelectedId(course.id)}
                          className={cn(
                            "relative p-4 rounded-lg border cursor-pointer transition-all bg-white",
                            selected
                              ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/30"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-800 truncate">
                                {course.name}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                编码：{course.code}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full shrink-0",
                                COURSE_TYPE_COLORS[course.type]
                              )}
                            >
                              {COURSE_TYPE_LABELS[course.type]}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                            <span>课时：{course.lessonCount}</span>
                            <span>节点：{course.nodeCount}</span>
                            <span>资源：{course.resourceCount}</span>
                          </div>

                          {selected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedId}>
            确认绑定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
