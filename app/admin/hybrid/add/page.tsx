"use client"

import { Suspense, useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { INDUSTRIES, MAJORS } from "@/lib/types"
import { ArrowLeft, Save, Send, Info, Plus, X, BookOpen, MonitorPlay, Users, Sun, Layers, BookMarked, Microscope, Briefcase, Database, FileStack, Monitor, CheckCircle2, BarChart3, ClipboardList, Zap, Shuffle, MessageSquare, HelpCircle, ChevronDown, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { hybridCourses } from "@/lib/mock-data"
import type { SystemCourseNode, NodeRefType } from "@/lib/types"
import CourseNodeTree from "../../system/add/_components/CourseNodeTree"
import { WEB_FRONTEND_SEMESTER_NODES } from "./_mock/semester-nodes"
import {
  ATOMIC_MODULES,
  ATOMIC_MODULES_BY_KEY,
  DEFAULT_MODULES,
  CATEGORY_LABELS,
  createDefaultNodeModuleData,
  type AtomicModuleKey,
  type NodeModuleData,
  type CourseBasicForm,
} from "./_components/atomic-modules"

const FIRST_NODE_ID = "hybrid-node-1"

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  basic: BookOpen,
  "pre-class": Sun,
  "in-class": Users,
  "post-class": MonitorPlay,
}

function HybridCourseAddForm() {
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")
  const claimCourse = searchParams.get("claimCourse")
  const claimSessionsParam = searchParams.get("claimSessions")
  const existing = editId ? hybridCourses.find((c) => c.id === editId) : null

  const claimSessionNames = useMemo<string[]>(() => {
    if (!claimSessionsParam) return []
    try {
      const decoded = decodeURIComponent(atob(claimSessionsParam))
      const sessions = JSON.parse(decoded) as Array<{ week: number; weekday: string; period: string; venue?: string }>
      return sessions.map((s) => `第 ${s.week} 周 · ${s.weekday} · ${s.period}`)
    } catch {
      return []
    }
  }, [claimSessionsParam])

  /* ========== course node tree ========== */
  const initialNodes = useMemo<SystemCourseNode[]>(() => {
    if (editId === "hybrid-1") {
      return WEB_FRONTEND_SEMESTER_NODES
    }

    const rootName = claimCourse || existing?.name || "混合课程"
    const rootNode: SystemCourseNode = {
      id: FIRST_NODE_ID,
      courseId: editId || "hybrid-new",
      parentId: null,
      name: rootName,
      order: 1,
      type: "normal",
      status: "draft",
    }

    if (claimSessionNames.length === 0) {
      return [rootNode]
    }

    const childNodes: SystemCourseNode[] = claimSessionNames.map((name, idx) => ({
      id: `hybrid-node-child-${idx + 1}`,
      courseId: editId || "hybrid-new",
      parentId: FIRST_NODE_ID,
      name,
      order: idx + 1,
      type: "normal",
      status: "draft",
    }))

    return [rootNode, ...childNodes]
  }, [editId, existing?.name, claimCourse, claimSessionNames])

  const [nodes, setNodes] = useState<SystemCourseNode[]>(initialNodes)
  const [selectedNodeId, setSelectedNodeId] = useState<string>(FIRST_NODE_ID)

  /* ========== atomic module assignments per node ========== */
  const [moduleAssignments, setModuleAssignments] = useState<Record<string, AtomicModuleKey[]>>(() => ({
    [FIRST_NODE_ID]: [...DEFAULT_MODULES],
  }))

  /* ========== independent data per node ========== */
  const [nodeDataMap, setNodeDataMap] = useState<Record<string, NodeModuleData>>(() => ({
    [FIRST_NODE_ID]: createDefaultNodeModuleData({
      name: existing?.name,
      code: existing?.code,
      major: existing?.major,
      industry: existing?.industry,
      teacher: existing?.teacher,
      semester: existing?.semester,
      className: existing?.className,
      category: existing?.category,
    }),
  }))

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [globalInfoOpen, setGlobalInfoOpen] = useState(true)

  const rootForm = nodeDataMap[FIRST_NODE_ID]?.form || createDefaultNodeModuleData().form

  const updateRootForm = useCallback((patch: Partial<CourseBasicForm>) => {
    setNodeDataMap((prev) => ({
      ...prev,
      [FIRST_NODE_ID]: {
        ...prev[FIRST_NODE_ID],
        form: { ...prev[FIRST_NODE_ID].form, ...patch },
      },
    }))
  }, [])

  const handleAddNode = useCallback((parentId: string | null, name: string, order: number, type?: NodeRefType, sourceId?: string, sourceName?: string) => {
    const newNode: SystemCourseNode = {
      id: `node-${Date.now()}`,
      courseId: editId || "hybrid-new",
      parentId,
      name,
      order,
      type: type || "normal",
      status: "draft",
      sourceId,
      sourceName,
    }
    setNodes((prev) => [...prev, newNode])
    setModuleAssignments((prev) => ({
      ...prev,
      [newNode.id]: [...DEFAULT_MODULES],
    }))
    setNodeDataMap((prev) => ({
      ...prev,
      [newNode.id]: createDefaultNodeModuleData({
        name: existing?.name,
        code: existing?.code,
        major: existing?.major,
        industry: existing?.industry,
        teacher: existing?.teacher,
        semester: existing?.semester,
        className: existing?.className,
        category: existing?.category,
      }),
    }))
  }, [editId, existing])

  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<SystemCourseNode>) => {
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)))
  }, [])

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => {
      const deleteIds = new Set<string>()
      const collect = (id: string) => {
        deleteIds.add(id)
        prev.filter((n) => n.parentId === id).forEach((n) => collect(n.id))
      }
      collect(nodeId)
      const next = prev.filter((n) => !deleteIds.has(n.id))
      return next
    })
    setModuleAssignments((prev) => {
      const next = { ...prev }
      delete next[nodeId]
      return next
    })
    setNodeDataMap((prev) => {
      const next = { ...prev }
      delete next[nodeId]
      return next
    })
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(FIRST_NODE_ID)
    }
  }, [selectedNodeId])

  const handleReorderNodes = useCallback((nodeId: string, targetNodeId: string) => {
    setNodes((prev) => {
      const dragged = prev.find((n) => n.id === nodeId)
      const target = prev.find((n) => n.id === targetNodeId)
      if (!dragged || !target) return prev
      const newNodes = prev.map((n) => {
        if (n.id === nodeId) {
          return { ...n, parentId: target.parentId, order: target.order + 0.5 }
        }
        return n
      })
      const siblings = newNodes
        .filter((n) => n.parentId === target.parentId)
        .sort((a, b) => a.order - b.order)
      siblings.forEach((n, idx) => {
        const idxInPrev = newNodes.findIndex((x) => x.id === n.id)
        if (idxInPrev >= 0) {
          newNodes[idxInPrev] = { ...newNodes[idxInPrev], order: idx + 1 }
        }
      })
      return [...newNodes]
    })
  }, [])

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  const ensureNodeData = (nodeId: string): NodeModuleData => {
    if (!nodeDataMap[nodeId]) {
      const next = createDefaultNodeModuleData({
        name: existing?.name,
        code: existing?.code,
        major: existing?.major,
        industry: existing?.industry,
        teacher: existing?.teacher,
        semester: existing?.semester,
        className: existing?.className,
        category: existing?.category,
      })
      setNodeDataMap((prev) => ({ ...prev, [nodeId]: next }))
      return next
    }
    return nodeDataMap[nodeId]
  }

  const currentModules = selectedNodeId ? (moduleAssignments[selectedNodeId] || []) : []
  const currentData = selectedNodeId ? ensureNodeData(selectedNodeId) : null

  const addModule = (key: AtomicModuleKey) => {
    if (!selectedNodeId) return
    setModuleAssignments((prev) => {
      const list = prev[selectedNodeId] || []
      if (list.includes(key)) return prev
      return { ...prev, [selectedNodeId]: [...list, key] }
    })
    setAddDialogOpen(false)
  }

  const removeModule = (key: AtomicModuleKey) => {
    if (!selectedNodeId) return
    setModuleAssignments((prev) => ({
      ...prev,
      [selectedNodeId]: (prev[selectedNodeId] || []).filter((k) => k !== key),
    }))
  }

  const updateNodeData = (patch: Partial<NodeModuleData>) => {
    if (!selectedNodeId || !currentData) return
    setNodeDataMap((prev) => ({
      ...prev,
      [selectedNodeId]: { ...prev[selectedNodeId], ...patch },
    }))
  }

  const handleSave = () => {
    toast.success(`${editId ? "更新" : "保存"}混合课程：${rootForm.name || ""}（演示）`)
  }

  const handleSubmit = () => {
    toast.success(`提交混合课程审批：${rootForm.name || ""}（演示）`)
  }

  const availableModules = ATOMIC_MODULES.filter(
    (m) => !currentModules.includes(m.key) && m.category !== "basic"
  )
  const groupedAvailable = useMemo(() => {
    const groups: Record<string, typeof ATOMIC_MODULES> = {}
    availableModules.forEach((m) => {
      if (!groups[m.category]) groups[m.category] = []
      groups[m.category].push(m)
    })
    return groups
  }, [availableModules])

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/hybrid">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  返回列表
                </Button>
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">
                {editId ? "编辑混合课程" : "新建混合课程"}
                {rootForm.name && <span className="text-gray-400 font-normal ml-2">- {rootForm.name}</span>}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={handleSave}>
                <Save className="h-4 w-4" />
                保存草稿
              </Button>
              <Button size="sm" className="gap-1 bg-[#1890ff] hover:bg-[#40a9ff]" onClick={handleSubmit}>
                <Send className="h-4 w-4" />
                提交审批
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* ========== Global Course Info (collapsible, spans full width) ========== */}
        <Collapsible open={globalInfoOpen} onOpenChange={setGlobalInfoOpen} className="mb-6">
          <Card className="border-0 shadow-sm">
            <CollapsibleTrigger asChild>
              <button className="w-full">
                <CardHeader className="pb-3 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#1890ff]" />
                      课程基本信息
                      <span className="text-xs font-normal text-gray-400">
                        {rootForm.name ? `《${rootForm.name}》` : "未填写课程名称"}
                      </span>
                      {rootForm.industry && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                          {rootForm.industry}
                        </span>
                      )}
                      {rootForm.major && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                          {rootForm.major}
                        </span>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="text-xs">
                        {globalInfoOpen ? "收起" : "展开编辑"}
                      </span>
                      {globalInfoOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">课程名称</Label>
                    <Input
                      value={rootForm.name}
                      onChange={(e) => updateRootForm({ name: e.target.value })}
                      placeholder="请输入课程名称"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">课程编码</Label>
                    <Input
                      value={rootForm.code}
                      onChange={(e) => updateRootForm({ code: e.target.value })}
                      placeholder="请输入课程编码"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">所属专业</Label>
                    <Select value={rootForm.major} onValueChange={(v) => updateRootForm({ major: v })}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="请选择所属专业" />
                      </SelectTrigger>
                      <SelectContent>
                        {MAJORS.filter((m) => m !== "全部").map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">所属行业</Label>
                    <Select value={rootForm.industry} onValueChange={(v) => updateRootForm({ industry: v })}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="请选择所属行业" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.filter((i) => i !== "全部").map((i) => (
                          <SelectItem key={i} value={i}>{i}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">授课教师</Label>
                    <Input
                      value={rootForm.teacher}
                      onChange={(e) => updateRootForm({ teacher: e.target.value })}
                      placeholder="请输入授课教师"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">课程分类</Label>
                    <Input
                      value={rootForm.category}
                      onChange={(e) => updateRootForm({ category: e.target.value })}
                      placeholder="如：专业核心课"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">学期</Label>
                    <Input
                      value={rootForm.semester}
                      onChange={(e) => updateRootForm({ semester: e.target.value })}
                      placeholder="如：2026-2027-1"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">上课班级</Label>
                    <Input
                      value={rootForm.className}
                      onChange={(e) => updateRootForm({ className: e.target.value })}
                      placeholder="如：软件工程2026级1班"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* ========== Two-column layout ========== */}
        <div className="grid grid-cols-[260px_1fr] gap-6">

          {/* Left: Course Node Tree */}
          <CourseNodeTree
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelect={setSelectedNodeId}
            onAddNode={handleAddNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onReorderNodes={handleReorderNodes}
          />

          {/* Center: Content modules */}
          <div className="relative min-w-0">
            <main className="space-y-5 min-w-0">
              {/* Node info bar */}
              {selectedNode && (
                <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-5 py-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    <span>当前编辑节点：<span className="font-medium text-gray-700">{selectedNode.name}</span></span>
                    <span className="text-gray-300">|</span>
                    <span>已挂载 {currentModules.length} 个原子模块</span>
                  </div>
                </div>
              )}

              {!selectedNode && (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
                  <Info className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">请从左侧目录选择一个节点进行编辑</p>
                </div>
              )}

              {selectedNode && currentData && (
                <div className="space-y-6">
                  {/* Add module bar */}
                  <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-5 py-3">
                    <div className="text-sm text-gray-600">
                      当前节点可自由组合原子模块
                    </div>
                    <Button size="sm" onClick={() => setAddDialogOpen(true)} disabled={availableModules.length === 0}>
                      <Plus className="h-4 w-4 mr-1" />
                      添加模块
                    </Button>
                  </div>

                  {/* Atomic modules */}
                  {currentModules.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
                      <Layers className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">当前节点尚未挂载任何模块，请点击上方“添加模块”</p>
                    </div>
                  )}

                  {currentModules.map((key) => {
                    const meta = ATOMIC_MODULES_BY_KEY[key]
                    const Icon = meta.icon
                    const Component = meta.component
                    return (
                      <Card key={key} className="overflow-visible">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Icon className="h-4 w-4 text-blue-500" />
                            {meta.label}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-red-500"
                            onClick={() => removeModule(key)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <Component
                          nodeId={selectedNodeId}
                          data={currentData}
                          onChange={updateNodeData}
                        />
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* Bottom spacer */}
              <div className="h-12" />
            </main>
          </div>
        </div>
      </div>

      {/* Add module dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>添加原子模块</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {availableModules.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">所有原子模块已挂载</p>
            ) : (
              Object.entries(groupedAvailable).map(([category, modules]) => {
                const CatIcon = CATEGORY_ICONS[category] || Layers
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <CatIcon className="h-4 w-4 text-blue-500" />
                      {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {modules.map((m) => {
                        const Icon = m.icon
                        return (
                          <button
                            key={m.key}
                            onClick={() => addModule(m.key)}
                            className="flex items-center gap-2 p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                          >
                            <Icon className="h-4 w-4 text-blue-500 shrink-0" />
                            <span className="text-sm">{m.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function HybridCourseAddPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">加载中...</div>}>
      <HybridCourseAddForm />
    </Suspense>
  )
}
