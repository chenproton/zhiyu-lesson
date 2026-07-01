"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  BookOpen, Search, Eye, Users, FileText, Clock,
} from "lucide-react"
import { courses, courseStats, getCourseCover } from "@/lib/mock-data"
import { INDUSTRIES, MAJORS, COURSE_TYPE_LABELS } from "@/lib/types"
import type { Course } from "@/lib/types"

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-5">
      <h2 className="text-lg font-bold text-slate-800 relative pl-3">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full" />
        {title}
      </h2>
      {subtitle && <span className="text-sm text-slate-400">{subtitle}</span>}
    </div>
  )
}

const courseIcons: Record<string, string> = {
  system: "📚",
  granular: "🔬",
  hybrid: "🔄",
}

function CourseCard({ course }: { course: Course }) {
  const imgSrc = course.coverImage || getCourseCover(course.id)
  return (
    <Link href={`/learn/courses/${course.type}/${course.id}`} className="block no-underline">
      <div
        className="rounded-xl bg-white overflow-hidden cursor-pointer transition-all duration-300 border border-slate-100"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)"
          e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.10)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"
        }}
      >
        <div className="h-28 relative overflow-hidden bg-slate-100">
          <img src={imgSrc} alt={course.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="flex items-center gap-2 absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs backdrop-blur-sm">{COURSE_TYPE_LABELS[course.type]}</Badge>
            <Badge variant="secondary" className="bg-black/30 text-white border-0 text-xs">v{course.version}</Badge>
          </div>
          <span className="text-white/80 text-[32px] absolute top-3 right-4 leading-none drop-shadow-lg">{courseIcons[course.type] || "📖"}</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-2">
            <h3 className="font-semibold text-sm text-slate-800 line-clamp-2 leading-snug">{course.name}</h3>
            <Badge variant="outline" className="text-[10px] shrink-0">{course.category}</Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 border-t border-slate-50">
            <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{course.nodeCount} 节点</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.lessonCount} 课时</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{course.viewCount}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded">{course.industry}</span>
            <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded">{course.major}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-50">
            <span>{course.teacher}</span>
            <span>{course.updateDate}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const [activeIndustry, setActiveIndustry] = useState("全部")
  const [activeMajor, setActiveMajor] = useState("全部")
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<"system" | "granular" | "hybrid">("system")

  const filteredCourses = useMemo(() => {
    let result = courses
    if (activeIndustry !== "全部") result = result.filter((c) => c.industry === activeIndustry)
    if (activeMajor !== "全部") result = result.filter((c) => c.major === activeMajor)
    if (search.trim()) {
      const kw = search.trim().toLowerCase()
      result = result.filter((c) => c.name.toLowerCase().includes(kw))
    }
    return result
  }, [activeIndustry, activeMajor, search])

  const systemCourses = filteredCourses.filter((c) => c.type === "system")
  const granularCourses = filteredCourses.filter((c) => c.type === "granular")
  const hybridCourses = filteredCourses.filter((c) => c.type === "hybrid")

  if (search.trim()) {
    const allCourses = systemCourses.concat(granularCourses, hybridCourses)
    const allGrouped = allCourses.length > 0 ? [{ label: "课程资源库", courses: allCourses }] : []

    return (
      <div>
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-700 text-white py-14 px-5 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 left-[5%] w-48 h-48 bg-white/5 rounded-full" />
          <div className="max-w-xl mx-auto relative z-10">
            <h1 className="text-3xl font-bold mb-2">数字课程服务平台</h1>
            <p className="text-sm text-blue-200 mb-6">产教融合 · 课程资源 · 智慧课堂</p>
            <div className="flex items-center bg-white rounded-full pl-5 pr-1.5 py-1.5 shadow-lg">
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <input
                type="text" placeholder="搜索课程名称..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border-none outline-none text-sm py-2.5 text-slate-700 bg-transparent"
              />
              <Button className="rounded-full px-6">{search ? "搜索" : "搜索"}</Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">搜索结果：<span className="text-blue-600 font-medium">{filteredCourses.length}</span> 门课程</p>
            <div className="flex gap-2">
              {INDUSTRIES.slice(0, 5).map((ind) => (
                <button
                  key={ind}
                  onClick={() => setActiveIndustry(ind === activeIndustry ? "全部" : ind)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    activeIndustry === ind ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >{ind}</button>
              ))}
            </div>
          </div>
          {allGrouped.map((group) => (
            <div key={group.label}>
              <SectionHeader title={group.label} subtitle={`${group.courses.length} 门`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {group.courses.map((c) => <CourseCard key={c.id} course={c} />)}
              </div>
            </div>
          ))}
          {filteredCourses.length === 0 && (
            <div className="text-center py-16 text-slate-400">未找到匹配的课程</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-700 text-white pt-16 pb-12 px-5 text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 left-[8%] w-56 h-56 bg-white/5 rounded-full" />
        <div className="max-w-2xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-3 tracking-wide">数字课程服务平台</h1>
          <p className="text-base text-blue-200 mb-8">产教融合 · 课程资源 · 智慧课堂 —— 一站式课程学习与成长平台</p>
          <div className="flex items-center bg-white rounded-full pl-5 pr-1.5 py-1.5 shadow-xl max-w-lg mx-auto">
            <Search className="h-5 w-5 text-slate-400 mr-2" />
            <input
              type="text" placeholder="搜索课程名称、行业、专业..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-none outline-none text-base py-3 text-slate-700 bg-transparent"
            />
            <Button className="rounded-full px-7 py-5 text-base">搜索</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-4">
        {/* Top bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-5 gap-5 mb-6">
          {[
            { label: "课程总数", value: courseStats.totalCourses },
            { label: "体系课", value: courseStats.systemCourses },
            { label: "颗粒课", value: courseStats.granularCourses },
            { label: "混合课程", value: courseStats.hybridCourses },
            { label: "知识点", value: courseStats.knowledgePoints },
          ].map((s, i) => (
            <div key={s.label} className="text-center border-r border-slate-100 last:border-0">
              <div className="text-[28px] font-bold text-blue-600 leading-tight">{s.value}</div>
              <div className="text-[13px] text-slate-400 mt-1.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-5 mb-8 space-y-3" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="flex items-start gap-3">
            <span className="text-sm text-slate-400 w-12 pt-1 shrink-0">行业</span>
            <div className="flex flex-wrap gap-2">{INDUSTRIES.map((item) => (
              <button key={item} onClick={() => setActiveIndustry(item)}
                className={`px-3.5 py-1.5 rounded-full text-sm transition-colors ${
                  activeIndustry === item ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}>{item}</button>
            ))}</div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-sm text-slate-400 w-12 pt-1 shrink-0">专业</span>
            <div className="flex flex-wrap gap-2">{MAJORS.map((item) => (
              <button key={item} onClick={() => setActiveMajor(item)}
                className={`px-3.5 py-1.5 rounded-full text-sm transition-colors ${
                  activeMajor === item ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}>{item}</button>
            ))}</div>
          </div>
        </div>

        {/* 课程资源库 */}
        <section className="mb-10">
          <SectionHeader title="课程资源库" subtitle={`${systemCourses.length + granularCourses.length + hybridCourses.length} 门课程`} />
          {/* tab switcher */}
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-5 w-fit">
            <button
              onClick={() => setTab("hybrid")}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                tab === "hybrid" ? "bg-white shadow-sm text-blue-600 font-medium" : "text-slate-500 hover:text-slate-700"
              }`}
            >混合课</button>
            <button
              onClick={() => setTab("system")}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                tab === "system" ? "bg-white shadow-sm text-blue-600 font-medium" : "text-slate-500 hover:text-slate-700"
              }`}
            >体系课</button>
            <button
              onClick={() => setTab("granular")}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                tab === "granular" ? "bg-white shadow-sm text-blue-600 font-medium" : "text-slate-500 hover:text-slate-700"
              }`}
            >颗粒课</button>
          </div>
          {tab === "system" && systemCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {systemCourses.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
          {tab === "granular" && granularCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {granularCourses.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
          {tab === "hybrid" && hybridCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {hybridCourses.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
        </section>

        <div className="text-center py-4 text-xs text-slate-300">
          当前共收录 <span className="text-blue-400 font-medium">{filteredCourses.length}</span> 门课程
        </div>
      </div>
    </div>
  )
}
