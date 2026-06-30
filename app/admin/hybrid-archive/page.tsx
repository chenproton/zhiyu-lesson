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
  Search,
  Pencil,
  Archive,
  GraduationCap,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Users,
  Clock,
  Building2,
  MonitorPlay,
} from "lucide-react"
import { COURSE_STATUS_LABELS, COURSE_STATUS_COLORS } from "@/lib/types"
import {
  archiveTree,
  archiveEntries,
  filterArchiveEntries,
  type ArchiveTreeNode,
} from "@/lib/hybrid-archive-mock"

function TreeNode({
  node,
  selectedCollege,
  selectedMajor,
  selectedGrade,
  onSelect,
  expandedIds,
  onToggle,
  depth,
}: {
  node: ArchiveTreeNode
  selectedCollege: string | null
  selectedMajor: string | null
  selectedGrade: string | null
  onSelect: (node: ArchiveTreeNode) => void
  expandedIds: Set<string>
  onToggle: (id: string) => void
  depth: number
}) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id)

  const isSelected =
    (node.level === "college" && selectedCollege === node.label && !selectedMajor) ||
    (node.level === "major" && selectedMajor === node.label && !selectedGrade) ||
    (node.level === "grade" && selectedGrade === node.label)

  return (
    <div>
      <div
        onClick={() => {
          if (hasChildren) {
            onToggle(node.id)
          }
          onSelect(node)
        }}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors
          ${isSelected
            ? "bg-primary/10 text-primary font-medium"
            : "text-gray-600 hover:bg-gray-100"
          }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          )
        ) : (
          <div className="w-3.5 shrink-0" />
        )}
        <span className="truncate">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedCollege={selectedCollege}
              selectedMajor={selectedMajor}
              selectedGrade={selectedGrade}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}


export default function HybridArchivePage() {
  const [search, setSearch] = useState("")
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null)
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const allExpandableIds = useMemo(() => {
    const ids: string[] = []
    const walk = (nodes: ArchiveTreeNode[]) => {
      for (const node of nodes) {
        if (node.children?.length) {
          ids.push(node.id)
          walk(node.children)
        }
      }
    }
    walk(archiveTree)
    return ids
  }, [])

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(allExpandableIds))

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSelect = (node: ArchiveTreeNode) => {
    if (node.level === "college") {
      if (selectedCollege === node.label && !selectedMajor) {
        setSelectedCollege(null)
        setSelectedMajor(null)
        setSelectedGrade(null)
      } else {
        setSelectedCollege(node.label)
        setSelectedMajor(null)
        setSelectedGrade(null)
      }
    } else if (node.level === "major") {
      if (selectedMajor === node.label && !selectedGrade) {
        setSelectedMajor(null)
        setSelectedGrade(null)
      } else {
        setSelectedMajor(node.label)
        setSelectedGrade(null)
      }
    } else if (node.level === "grade") {
      if (selectedGrade === node.label) {
        setSelectedGrade(null)
      } else {
        setSelectedGrade(node.label)
      }
    }
  }

  const filtered = useMemo(
    () => filterArchiveEntries(selectedCollege, selectedMajor, selectedGrade, search),
    [selectedCollege, selectedMajor, selectedGrade, search]
  )

  const breadcrumb = useMemo(() => {
    const parts: string[] = []
    if (selectedCollege) parts.push(selectedCollege)
    if (selectedMajor) parts.push(selectedMajor)
    if (selectedGrade) parts.push(selectedGrade)
    return parts
  }, [selectedCollege, selectedMajor, selectedGrade])

  return (
    <div className="flex gap-6 h-full -m-6">
      {/* Left Sidebar */}
      <div className="w-60 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-primary" />
            <h2 className="font-medium text-sm text-gray-800">历史档案目录</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {archiveTree.map((college) => (
            <TreeNode
              key={college.id}
              node={college}
              selectedCollege={selectedCollege}
              selectedMajor={selectedMajor}
              selectedGrade={selectedGrade}
              onSelect={handleSelect}
              expandedIds={expandedIds}
              onToggle={handleToggle}
              depth={0}
            />
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 min-w-0 p-6 pl-0 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">混合课历史档案库</h1>
          <p className="text-muted-foreground mt-1">
            按学院、专业、年级查看历史开课归档记录，每个学期开课后自动归档至对应目录
          </p>
        </div>

        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            {breadcrumb.map((part, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                <span className="font-medium text-gray-700">{part}</span>
              </span>
            ))}
            <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
              {filtered.length} 门课程
            </span>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">归档课程总数</p>
                  <p className="text-2xl font-bold mt-1">{archiveEntries.length}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-purple-100 text-purple-600">
                  <Archive className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">覆盖学院</p>
                  <p className="text-2xl font-bold mt-1">{archiveTree.length}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">覆盖专业</p>
                  <p className="text-2xl font-bold mt-1">
                    {archiveTree.reduce((sum, c) => sum + (c.children?.length || 0), 0)}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-green-100 text-green-600">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search + Table */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索课程名称/编码"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardContent>

          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>课程名称</TableHead>
                  <TableHead>课程编码</TableHead>
                  <TableHead>学期</TableHead>
                  <TableHead>班级</TableHead>
                  <TableHead>授课教师</TableHead>
                  <TableHead>线上/线下学时</TableHead>
                  <TableHead>学生人数</TableHead>
                  <TableHead>归档时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">
                          {entry.course.name}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {entry.college} · {entry.major} · {entry.grade}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.course.code}
                    </TableCell>
                    <TableCell className="text-sm">{entry.semester}</TableCell>
                    <TableCell className="text-sm">{entry.course.className || "-"}</TableCell>
                    <TableCell className="text-sm">{entry.course.teacher}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-blue-600">
                          <MonitorPlay className="h-3 w-3" />
                          {entry.course.onlineHours}h
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <Users className="h-3 w-3" />
                          {entry.course.offlineHours}h
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        {entry.studentCount}人
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {entry.archivedAt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${COURSE_STATUS_COLORS[entry.course.status]}`}
                      >
                        {COURSE_STATUS_LABELS[entry.course.status]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                        <Link
                          href="/admin/hybrid/add?id=hybrid-1"
                          className="flex items-center"
                        >
                          <Pencil className="mr-1 h-3 w-3" />
                          编辑
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                      暂无匹配的归档课程
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
