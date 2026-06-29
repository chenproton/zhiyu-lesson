"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  BookOpen,
  Clock,
  Loader2,
  XCircle,
  CheckCircle2,
  Settings,
  FolderOpen,
  Upload,
  Download,
  Grid3X3,
  LayoutList,
  Copy,
  CheckSquare,
  Square,
  GripVertical,
  UserPlus,
} from "lucide-react"
import { granularCourses, granularCourseStats } from "@/lib/mock-data"
import { Checkbox } from "@/components/ui/checkbox"
import { COURSE_STATUS_LABELS, COURSE_STATUS_COLORS, INDUSTRIES, MAJORS } from "@/lib/types"
import type { CourseStatus } from "@/lib/types"

export default function GranularCoursePage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "all">("all")
  const [scopeFilter, setScopeFilter] = useState<"mine" | "shared" | "public">("mine")
  const [industryFilter, setIndustryFilter] = useState<string>("all")
  const [majorFilter, setMajorFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "grid" | "group">("list")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map((c) => c.id)))
    }
  }

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return
    alert(`批量删除 ${selectedIds.size} 门课程（演示）`)
    setSelectedIds(new Set())
  }

  const handleBatchExport = () => {
    if (selectedIds.size === 0) return
    alert(`批量导出 ${selectedIds.size} 门课程（演示）`)
  }

  const handleImport = () => {
    alert("导入颗粒课包（演示：请选择.zip格式的课程包文件）")
  }

  const handleApprovalConfig = () => {
    alert("配置审批流程（演示）")
  }

  const handleBatchGroup = () => {
    alert("配置批次分组（演示）")
  }

  const filtered = useMemo(() => {
    let result = granularCourses
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }
    if (industryFilter !== "all") {
      result = result.filter((c) => c.industry === industryFilter)
    }
    if (majorFilter !== "all") {
      result = result.filter((c) => c.major === majorFilter)
    }
    if (search.trim()) {
      const kw = search.trim().toLowerCase()
      result = result.filter((c) => c.name.toLowerCase().includes(kw) || c.code.toLowerCase().includes(kw))
    }
    return result
  }, [search, statusFilter, industryFilter, majorFilter])

  const stats = [
    { label: "颗粒课总数", value: granularCourseStats.total, icon: BookOpen, color: "text-blue-600 bg-blue-100" },
    { label: "未提交", value: granularCourseStats.draft, icon: Clock, color: "text-gray-600 bg-gray-100" },
    { label: "审批中", value: granularCourseStats.pending, icon: Loader2, color: "text-yellow-600 bg-yellow-100" },
    { label: "已驳回", value: granularCourseStats.rejected, icon: XCircle, color: "text-red-600 bg-red-100" },
    { label: "已发布", value: granularCourseStats.published, icon: CheckCircle2, color: "text-green-600 bg-green-100" },
  ]

  const statusTabs: { key: CourseStatus | "all"; label: string }[] = [
    { key: "all", label: "全部" },
    { key: "draft", label: "未提交" },
    { key: "pending", label: "审批中" },
    { key: "rejected", label: "已驳回" },
    { key: "published", label: "已发布" },
  ]

  const scopeTabs = [
    { key: "mine" as const, label: "我的颗粒课" },
    { key: "shared" as const, label: "共建颗粒课" },
    { key: "public" as const, label: "公共库颗粒课" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">颗粒课资源</h1>
        <p className="text-muted-foreground mt-1">
          维护颗粒课信息，包含颗粒课创建、提交审批、颗粒课发布等功能
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scope Tabs + Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {scopeTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setScopeFilter(t.key)}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                scopeFilter === t.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleApprovalConfig}>
            <Settings className="h-4 w-4 mr-1" />
            配置审批流程
          </Button>
          <Button variant="outline" size="sm" onClick={handleBatchGroup}>
            <FolderOpen className="h-4 w-4 mr-1" />
            配置批次分组
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-1" />
            导入颗粒课包
          </Button>
          <Link href="/admin/granular/add">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              新增颗粒课
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter + List Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  statusFilter === t.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="flex flex-wrap gap-3 flex-1">
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-[160px] h-8 text-xs">
                  <SelectValue placeholder="所属行业" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部行业</SelectItem>
                  {INDUSTRIES.filter((i) => i !== "全部").map((i) => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={majorFilter} onValueChange={setMajorFilter}>
                <SelectTrigger className="w-[160px] h-8 text-xs">
                  <SelectValue placeholder="所属专业" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部专业</SelectItem>
                  {MAJORS.filter((m) => m !== "全部").map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索课程名称、编码..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"
                }`}
                title="列表展示"
              >
                <LayoutList className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"
                }`}
                title="卡片展示"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("group")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "group" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"
                }`}
                title="按分组展示"
              >
                <GripVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Batch Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                {selectedIds.size === filtered.length && filtered.length > 0 ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span>
                  已选 <span className="text-primary font-medium">{selectedIds.size}</span> / {filtered.length} 条
                </span>
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={selectedIds.size === 0}
                onClick={handleBatchExport}
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                导出
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-red-600 hover:text-red-700"
                disabled={selectedIds.size === 0}
                onClick={handleBatchDelete}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                批量删除
              </Button>
            </div>
          </div>
        </CardContent>

        {/* List View */}
        {viewMode === "list" && (
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={filtered.length > 0 && selectedIds.size === filtered.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>课程名称</TableHead>
                  <TableHead>课程编号</TableHead>
                  <TableHead>行业</TableHead>
                  <TableHead>专业</TableHead>
                  <TableHead>课时</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((course) => (
                    <TableRow key={course.id} className="group">
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(course.id)}
                          onCheckedChange={() => toggleSelect(course.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Link href="/admin/granular/add?mode=edit" className="font-medium hover:text-primary hover:underline">
                          {course.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{course.code}</TableCell>
                      <TableCell>{course.industry}</TableCell>
                      <TableCell>{course.major}</TableCell>
                      <TableCell>{course.lessonCount}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${COURSE_STATUS_COLORS[course.status]}`}>
                          {COURSE_STATUS_LABELS[course.status]}
                        </span>
                      </TableCell>
                      <TableCell className="relative">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm z-10 px-2 py-1 rounded-lg shadow-sm border border-slate-100">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                            <Link href={`/learn/courses/granular/${course.id}`} className="flex items-center">
                              <Eye className="mr-1 h-3 w-3" />
                              查看
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                            <Link href="/admin/granular/add?mode=edit" className="flex items-center">
                              <Pencil className="mr-1 h-3 w-3" />
                              编辑
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => alert(`导出课程：${course.name}（演示）`)}>
                            <Download className="mr-1 h-3 w-3" />
                            导出
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => alert(`邀请共建：${course.name}（演示）`)}>
                            <UserPlus className="mr-1 h-3 w-3" />
                            邀请共建
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <Copy className="mr-1 h-3 w-3" />
                            复制
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-600 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="mr-1 h-3 w-3" />
                            删除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      暂无符合条件的颗粒课
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length > 0 ? (
            filtered.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${course.coverColor || "from-blue-800 to-blue-500"} flex items-center justify-center text-white text-xs font-bold`}>
                      {course.name.slice(0, 2)}
                    </div>
                    <Checkbox
                      checked={selectedIds.has(course.id)}
                      onCheckedChange={() => toggleSelect(course.id)}
                    />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{course.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{course.code}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3">
                    <span>{course.industry}</span>
                    <span>{course.major}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span>{course.lessonCount} 课时</span>
                    <span>{course.nodeCount} 节点</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
                      <Link href={`/learn/courses/granular/${course.id}`}>查看</Link>
                    </Button>
                    <Button size="sm" className="flex-1 text-xs" asChild>
                      <Link href="/admin/granular/add?mode=edit">编辑</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              暂无符合条件的颗粒课
            </div>
          )}
        </div>
      )}

      {/* Group View */}
      {viewMode === "group" && (
        <div className="space-y-6">
          {["已发布", "审批中", "未提交", "已驳回"].map((statusLabel) => {
            const statusKey = statusLabel === "已发布" ? "published" : statusLabel === "审批中" ? "pending" : statusLabel === "未提交" ? "draft" : "rejected" as CourseStatus
            const groupCourses = filtered.filter((c) => c.status === statusKey)
            if (groupCourses.length === 0) return null
            return (
              <div key={statusKey}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${statusKey === "published" ? "bg-green-500" : statusKey === "pending" ? "bg-yellow-500" : statusKey === "draft" ? "bg-gray-400" : "bg-red-500"}`} />
                  <h3 className="text-sm font-semibold text-gray-700">{statusLabel}</h3>
                  <Badge variant="secondary" className="text-xs">{groupCourses.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-sm transition-shadow border-l-4 border-l-transparent hover:border-l-blue-400">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium text-gray-800 truncate">{course.name}</h4>
                            <p className="text-xs text-gray-400 mt-1">{course.code}</p>
                          </div>
                          <Checkbox
                            checked={selectedIds.has(course.id)}
                            onCheckedChange={() => toggleSelect(course.id)}
                          />
                        </div>
                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                          <span>{course.industry}</span>
                          <span>·</span>
                          <span>{course.lessonCount} 课时</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">暂无符合条件的颗粒课</div>
          )}
        </div>
      )}
    </div>
  )
}
