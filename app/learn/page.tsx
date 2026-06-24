"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  Link2,
  Microscope,
  Eye,
  Search,
  Grid3X3,
  LayoutList,
  Clock,
  FileText,
  Layers,
  Briefcase,
  ChevronDown,
  GraduationCap,
  BarChart3,
  Archive,
} from "lucide-react"
import { courses, courseStats } from "@/lib/mock-data"
import { COURSE_TYPE_OPTIONS, INDUSTRIES, MAJORS } from "@/lib/types"

export default function HomePage() {
  const [activeIndustry, setActiveIndustry] = useState("全部")
  const [activeMajor, setActiveMajor] = useState("全部")
  const [activeSort, setActiveSort] = useState("all")
  const [search, setSearch] = useState("")

  const filteredCourses = useMemo(() => {
    let result = courses
    if (activeIndustry !== "全部") {
      result = result.filter((c) => c.industry === activeIndustry)
    }
    if (activeMajor !== "全部") {
      result = result.filter((c) => c.major === activeMajor)
    }
    if (activeSort === "system") {
      result = result.filter((c) => c.type === "system")
    } else if (activeSort === "granular") {
      result = result.filter((c) => c.type === "granular")
    } else if (activeSort === "hybrid") {
      result = result.filter((c) => c.type === "hybrid")
    }
    if (search.trim()) {
      const kw = search.trim().toLowerCase()
      result = result.filter((c) => c.name.toLowerCase().includes(kw))
    }
    return result
  }, [activeIndustry, activeMajor, activeSort, search])

  const stats = [
    { label: "收录课程总数", value: courseStats.totalCourses, icon: BookOpen, color: "text-blue-600 bg-blue-100" },
    { label: "体系课总数", value: courseStats.systemCourses, icon: Link2, color: "text-indigo-600 bg-indigo-100" },
    { label: "颗粒课总数", value: courseStats.granularCourses, icon: Microscope, color: "text-emerald-600 bg-emerald-100" },
    { label: "混合课程总数", value: courseStats.hybridCourses, icon: Layers, color: "text-purple-600 bg-purple-100" },
    { label: "知识点总数", value: courseStats.knowledgePoints, icon: Eye, color: "text-amber-600 bg-amber-100" },
  ]

  const sortButtons = [
    { key: "all", label: "默认排序" },
    { key: "recent", label: "最近收录" },
    { key: "hot", label: "最多点击" },
    { key: "frontier", label: "前沿课程" },
    { key: "system", label: "体系课" },
    { key: "granular", label: "颗粒课" },
    { key: "hybrid", label: "混合课程" },
  ]

  const tagColorMap: Record<string, string> = {
    "公共基础课": "bg-blue-100 text-blue-700",
    "数智化通识课": "bg-green-100 text-green-700",
    "专业基础课": "bg-orange-100 text-orange-700",
    "专业核心课": "bg-purple-100 text-purple-700",
    "专业拓展课": "bg-pink-100 text-pink-700",
  }

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between">
        <div />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Briefcase className="h-4 w-4" />
              我的学习台
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/learn/dashboard/courses" className="flex items-center gap-2 cursor-pointer">
                <GraduationCap className="h-4 w-4" />
                我的课程
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/learn/dashboard/grades" className="flex items-center gap-2 cursor-pointer">
                <BarChart3 className="h-4 w-4" />
                成绩查看
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/learn/dashboard/archive" className="flex items-center gap-2 cursor-pointer">
                <Archive className="h-4 w-4" />
                学习档案
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1 bg-gradient-to-br from-slate-50 to-slate-100 border-0">
          <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
            <div className="text-center">
              <Grid3X3 className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <span className="text-sm">暂无轮播名称</span>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-blue-800">数字课程服务平台</h2>
              <p className="text-blue-600">产教融合 · 课程资源 · 智慧课堂</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-sm text-muted-foreground w-10 pt-1.5 shrink-0">行业</span>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveIndustry(item)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeIndustry === item
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-sm text-muted-foreground w-10 pt-1.5 shrink-0">专业</span>
            <div className="flex flex-wrap gap-2">
              {MAJORS.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveMajor(item)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeMajor === item
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {sortButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setActiveSort(btn.key)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                activeSort === btn.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-white border hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="请输入课程名称"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        当前共展示 <span className="text-primary font-medium">{filteredCourses.length}</span> 个课程学习入口
      </p>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredCourses.map((course) => (
          <Link
            key={course.id}
            href={course.type === "hybrid" ? `/learn/courses/hybrid/${course.id}` : "/student.html"}
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
              {/* Cover */}
              <div className={`h-36 bg-gradient-to-br ${course.coverColor || "from-blue-800 to-blue-500"} relative p-4 flex flex-col justify-end`}>
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {course.version}
                  </Badge>
                  <Badge variant="secondary" className="bg-black/30 text-white border-0">
                    {course.updateDate}
                  </Badge>
                </div>
                <Badge className="absolute top-3 right-3 bg-purple-600/80 hover:bg-purple-600/80 text-white border-0">
                  {course.courseTag}
                </Badge>
                <div className="absolute bottom-0 right-0 bg-black/40 text-white text-xs px-2 py-0.5 rounded-tl-md">
                  课程编码：{course.code}
                </div>
              </div>

              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-sm line-clamp-1">{course.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${tagColorMap[course.category] || "bg-gray-100 text-gray-700"}`}>
                    {course.category}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y">
                  <div className="text-center">
                    <p className="text-lg font-bold">{course.nodeCount}</p>
                    <p className="text-xs text-muted-foreground">涉及节点</p>
                  </div>
                  <div className="text-center border-l">
                    <p className="text-lg font-bold">{course.lessonCount}</p>
                    <p className="text-xs text-muted-foreground">预计课时</p>
                  </div>
                  <div className="text-center border-l">
                    <p className="text-lg font-bold">{course.resourceCount}</p>
                    <p className="text-xs text-muted-foreground">资源数</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground w-8">行业</span>
                    <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded">{course.industry}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground w-8">专业</span>
                    <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded">{course.major}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>{course.teacher} · 浏览 {course.viewCount} · 学习 {course.studyCount}</span>
                  <span>{course.updateDate}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
