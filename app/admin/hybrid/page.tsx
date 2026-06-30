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
  Layers,
  MonitorPlay,
  Users,
} from "lucide-react"
import { hybridCourses, hybridCourseStats } from "@/lib/mock-data"
import { Checkbox } from "@/components/ui/checkbox"
import { COURSE_STATUS_LABELS, COURSE_STATUS_COLORS, INDUSTRIES, MAJORS } from "@/lib/types"
import type { CourseStatus } from "@/lib/types"

export default function HybridCoursePage() {
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
    alert(`批量删除 ${selectedIds.size} 门混合课程（演示）`)
    setSelectedIds(new Set())
  }

  const handleBatchExport = () => {
    if (selectedIds.size === 0) return
    alert(`批量导出 ${selectedIds.size} 门混合课程（演示）`)
  }

  const handleImport = () => {
    alert("导入混合课程包（演示：请选择.zip格式的课程包文件）")
  }

  const handleApprovalConfig = () => {
    alert("配置审批流程（演示）")
  }

  const handleBatchGroup = () => {
    alert("配置批次分组（演示）")
  }

  const filtered = useMemo(() => {
    let result = hybridCourses
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
    { label: "混合课程总数", value: hybridCourseStats.total, icon: Layers, color: "text-purple-600 bg-purple-100" },
    { label: "未提交", value: hybridCourseStats.draft, icon: Clock, color: "text-gray-600 bg-gray-100" },
    { label: "审批中", value: hybridCourseStats.pending, icon: Loader2, color: "text-yellow-600 bg-yellow-100" },
    { label: "已驳回", value: hybridCourseStats.rejected, icon: XCircle, color: "text-red-600 bg-red-100" },
    { label: "已发布", value: hybridCourseStats.published, icon: CheckCircle2, color: "text-green-600 bg-green-100" },
  ]

  const statusTabs: { key: CourseStatus | "all"; label: string }[] = [
    { key: "all", label: "全部" },
    { key: "draft", label: "未提交" },
    { key: "pending", label: "审批中" },
    { key: "rejected", label: "已驳回" },
    { key: "published", label: "已发布" },
  ]

  const scopeTabs = [
    { key: "mine" as const, label: "我的混合课" },
    { key: "shared" as const, label: "共建混合课" },
    { key: "public" as const, label: "公共库混合课" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">混合课管理</h1>
        <p className="text-muted-foreground mt-1">
          维护线上线下混合式课程，支持课程创建、大纲设计、资源组课、教学实施与过程性评价
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
            导入
          </Button>
          <Button variant="outline" size="sm" onClick={handleBatchExport}>
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/hybrid/add">
              <Plus className="h-4 w-4 mr-1" />
              新建混合课程
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter + List Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-col md:flex-row gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索课程名称/编码"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as CourseStatus | "all")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="课程状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="draft">未提交</SelectItem>
                <SelectItem value="pending">审批中</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
              </SelectContent>
            </Select>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="所属行业" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={majorFilter} onValueChange={setMajorFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="所属专业" />
              </SelectTrigger>
              <SelectContent>
                {MAJORS.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 flex-wrap">
            {statusTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  statusFilter === t.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
                disabled={filtered.length === 0}
              >
                {selectedIds.size === filtered.length && filtered.length > 0 ? (
                  <CheckSquare className="h-4 w-4 mr-1" />
                ) : (
                  <Square className="h-4 w-4 mr-1" />
                )}
                全选
              </Button>
              {selectedIds.size > 0 && (
                <span className="text-sm text-muted-foreground">已选 {selectedIds.size} 项</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "secondary" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "group" ? "secondary" : "outline"}
                size="icon"
                onClick={() => setViewMode("group")}
              >
                <Layers className="h-4 w-4" />
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
                  <TableHead className="w-10">
                    <Checkbox
                      checked={filtered.length > 0 && selectedIds.size === filtered.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>混合课名称</TableHead>
                  <TableHead>混合课编码</TableHead>
                  <TableHead>版本号</TableHead>
                  <TableHead>所属批次分组</TableHead>
                  <TableHead>创建人</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>共建人</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((course) => (
                  <TableRow key={course.id} className="group">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(course.id)}
                        onCheckedChange={() => toggleSelect(course.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <Link href={`/admin/hybrid/add?id=${course.id}`} className="font-medium hover:text-primary hover:underline">
                          {course.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{course.code}</TableCell>
                    <TableCell className="text-sm">{course.version}</TableCell>
                    <TableCell className="text-sm">{course.batchGroup || "-"}</TableCell>
                    <TableCell className="text-sm">{course.creator || "-"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{course.createDate || "-"}</TableCell>
                    <TableCell className="text-sm">{course.coCreator || "-"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${COURSE_STATUS_COLORS[course.status]}`}>
                        {COURSE_STATUS_LABELS[course.status]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right relative">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm z-10 px-2 py-1 rounded-lg shadow-sm border border-slate-100">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                          <Link href={`/learn/courses/hybrid/${course.id}`} className="flex items-center">
                            <Eye className="mr-1 h-3 w-3" />
                            预览
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                          <Link href={`/admin/hybrid/add?id=${course.id}`} className="flex items-center">
                            <Pencil className="mr-1 h-3 w-3" />
                            编辑
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => alert(`复制课程：${course.name}（演示）`)}>
                          <Copy className="mr-1 h-3 w-3" />
                          复制
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-600 hover:text-red-600 hover:bg-red-50" onClick={() => alert(`删除课程：${course.name}（演示）`)}>
                          <Trash2 className="mr-1 h-3 w-3" />
                          删除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      暂无匹配的混合课程
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
          {filtered.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className={`h-24 bg-gradient-to-br ${course.coverColor}`} />
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{course.name}</h3>
                    <p className="text-xs text-muted-foreground">{course.code}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${COURSE_STATUS_COLORS[course.status]}`}>
                    {COURSE_STATUS_LABELS[course.status]}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MonitorPlay className="h-3.5 w-3.5" />
                    线上 {course.onlineHours}h
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    线下 {course.offlineHours}h
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/admin/hybrid/add?id=${course.id}`}>
                      <Pencil className="h-3.5 w-3.5 mr-1" /> 编辑
                    </Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/learn/courses/hybrid/${course.id}`}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> 预览
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Group View */}
      {viewMode === "group" && (
        <Card>
          <CardContent className="pt-6 text-center py-16 text-muted-foreground">
            <GripVertical className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>分组视图：按专业/状态聚合展示（演示）</p>
          </CardContent>
        </Card>
      )}

      {/* Batch Actions */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-background border shadow-lg rounded-full px-4 py-2 flex items-center gap-3 z-50">
          <span className="text-sm">已选择 {selectedIds.size} 门课程</span>
          <Button variant="outline" size="sm" onClick={handleBatchExport}>
            <Download className="h-4 w-4 mr-1" /> 批量导出
          </Button>
          <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
            <Trash2 className="h-4 w-4 mr-1" /> 批量删除
          </Button>
        </div>
      )}
    </div>
  )
}
