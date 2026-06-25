"use client"

import { Suspense, useState, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Send, BookOpen, MonitorPlay, Users, FileText, Layers, Plus, Trash2, BookMarked, Microscope, Briefcase, Database, FileStack, Monitor, Info } from "lucide-react"
import { toast } from "sonner"
import { hybridCourses } from "@/lib/mock-data"
import { INDUSTRIES, MAJORS } from "@/lib/types"
import type { SystemCourseNode, NodeRefType } from "@/lib/types"
import CourseNodeTree from "../../system/add/_components/CourseNodeTree"

const FIRST_NODE_ID = "hybrid-node-1"

function HybridCourseAddForm() {
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")
  const existing = editId ? hybridCourses.find((c) => c.id === editId) : null

  /* ========== course node tree ========== */
  const [nodes, setNodes] = useState<SystemCourseNode[]>([
    {
      id: FIRST_NODE_ID,
      courseId: editId || "hybrid-new",
      parentId: null,
      name: existing?.name || "混合课程",
      order: 1,
      type: "normal",
      status: "draft",
    },
  ])
  const [selectedNodeId, setSelectedNodeId] = useState<string>(FIRST_NODE_ID)

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
  }, [editId])

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
      return prev.filter((n) => !deleteIds.has(n.id))
    })
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null)
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

  /* ========== existing hybrid form state (mounted under first node) ========== */
  const [form, setForm] = useState({
    name: existing?.name || "",
    code: existing?.code || `HYB-${Date.now().toString().slice(-6)}`,
    major: existing?.major || MAJORS[1],
    industry: existing?.industry || INDUSTRIES[1],
    teacher: existing?.teacher || "",
    semester: existing?.semester || "2026-2027-1",
    className: existing?.className || "",
    onlineHours: existing?.onlineHours || 24,
    offlineHours: existing?.offlineHours || 24,
    onlineWeight: existing?.onlineWeight || 40,
    offlineWeight: existing?.offlineWeight || 60,
    category: existing?.category || "专业核心课",
    objectives: "",
    outline: "",
  })

  const [units, setUnits] = useState([
    { id: "u1", name: "第一单元：课程导论", online: "微课预习、课前测验", offline: "课堂导入、案例研讨" },
    { id: "u2", name: "第二单元：核心理论", online: "视频学习、知识点测验", offline: "讲授、随堂练习" },
    { id: "u3", name: "第三单元：项目实践", online: "任务单、资源包", offline: "小组实训、教师指导" },
  ])

  const [selectedResources, setSelectedResources] = useState<Record<string, string[]>>({
    system: [],
    granular: [],
    case: [],
    question: [],
    material: [],
    simulation: [],
  })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<string | null>(null)

  const resourceTypes = [
    { key: "system", label: "体系课资源", icon: BookMarked, options: ["Web前端开发体系课", "Java程序设计体系课", "软件工程导论体系课"] },
    { key: "granular", label: "颗粒微课", icon: Microscope, options: ["CSS选择器颗粒微课", "Flexbox布局颗粒微课", "JavaScript闭包颗粒微课"] },
    { key: "case", label: "产业案例/场景任务", icon: Briefcase, options: ["企业官网实战场景任务", "电商平台首页场景任务", "移动端H5营销页场景任务"] },
    { key: "question", label: "题库资源", icon: Database, options: ["Web前端单元测试题库", "CSS基础测试题库", "JavaScript进阶测试题库"] },
    { key: "material", label: "课件教案", icon: FileStack, options: ["Web前端开发课件PPT", "课程教案模板", "实训任务单模板"] },
    { key: "simulation", label: "虚拟仿真资源", icon: Monitor, options: ["响应式布局虚拟仿真", "浏览器渲染原理虚拟仿真", "前端性能优化虚拟仿真"] },
  ]

  const openDialog = (key: string) => {
    setDialogType(key)
    setDialogOpen(true)
  }

  const toggleResource = (key: string, value: string) => {
    setSelectedResources((prev) => {
      const list = prev[key] || []
      const exists = list.includes(value)
      return { ...prev, [key]: exists ? list.filter((v) => v !== value) : [...list, value] }
    })
  }

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    toast.success(`${editId ? "更新" : "保存"}混合课程：${form.name}（演示）`)
  }

  const handleSubmit = () => {
    toast.success(`提交混合课程审批：${form.name}（演示）`)
  }

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
                {form.name && <span className="text-gray-400 font-normal ml-2">- {form.name}</span>}
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
                    <span>上次保存：2025-01-15 14:10</span>
                  </div>
                </div>
              )}

              {!selectedNode && (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
                  <Info className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">请从左侧目录选择一个节点进行编辑</p>
                </div>
              )}

              {selectedNode && selectedNodeId === FIRST_NODE_ID && (
                <div className="space-y-6">
                  <Tabs defaultValue="basic" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="basic"><BookOpen className="h-4 w-4 mr-1" /> 基本信息</TabsTrigger>
                      <TabsTrigger value="outline"><Layers className="h-4 w-4 mr-1" /> 课程大纲</TabsTrigger>
                      <TabsTrigger value="resources"><FileText className="h-4 w-4 mr-1" /> 资源组课</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">课程基本信息</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>课程名称</Label>
                            <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="请输入课程名称" />
                          </div>
                          <div className="space-y-2">
                            <Label>课程编码</Label>
                            <Input value={form.code} onChange={(e) => updateField("code", e.target.value)} placeholder="请输入课程编码" />
                          </div>
                          <div className="space-y-2">
                            <Label>所属专业</Label>
                            <Select value={form.major} onValueChange={(v) => updateField("major", v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {MAJORS.filter((m) => m !== "全部").map((m) => (
                                  <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>所属行业</Label>
                            <Select value={form.industry} onValueChange={(v) => updateField("industry", v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {INDUSTRIES.filter((i) => i !== "全部").map((i) => (
                                  <SelectItem key={i} value={i}>{i}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>授课教师</Label>
                            <Input value={form.teacher} onChange={(e) => updateField("teacher", e.target.value)} placeholder="请输入授课教师" />
                          </div>
                          <div className="space-y-2">
                            <Label>课程分类</Label>
                            <Input value={form.category} onChange={(e) => updateField("category", e.target.value)} placeholder="如：专业核心课" />
                          </div>
                          <div className="space-y-2">
                            <Label>学期</Label>
                            <Input value={form.semester} onChange={(e) => updateField("semester", e.target.value)} placeholder="如：2026-2027-1" />
                          </div>
                          <div className="space-y-2">
                            <Label>上课班级</Label>
                            <Input value={form.className} onChange={(e) => updateField("className", e.target.value)} placeholder="如：软件工程2026级1班" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">线上线下配置</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <MonitorPlay className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">线上学习</p>
                                <p className="text-xs text-muted-foreground">课前预习、微课、测验、作业</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>线上学时</Label>
                                <Input type="number" value={form.onlineHours} onChange={(e) => updateField("onlineHours", Number(e.target.value))} />
                              </div>
                              <div className="space-y-2">
                                <Label>线上成绩权重（%）</Label>
                                <Input type="number" value={form.onlineWeight} onChange={(e) => updateField("onlineWeight", Number(e.target.value))} />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                                <Users className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">线下课堂</p>
                                <p className="text-xs text-muted-foreground">课堂讲授、实训、项目实践、考核</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>线下学时</Label>
                                <Input type="number" value={form.offlineHours} onChange={(e) => updateField("offlineHours", Number(e.target.value))} />
                              </div>
                              <div className="space-y-2">
                                <Label>线下成绩权重（%）</Label>
                                <Input type="number" value={form.offlineWeight} onChange={(e) => updateField("offlineWeight", Number(e.target.value))} />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="outline" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">教学目标</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            placeholder="请输入课程教学目标..."
                            rows={4}
                            value={form.objectives}
                            onChange={(e) => updateField("objectives", e.target.value)}
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="text-base">教学单元</CardTitle>
                          <Button size="sm" variant="outline" onClick={() => setUnits([...units, { id: `u${Date.now()}`, name: `新单元`, online: "", offline: "" }])}>
                            <Plus className="h-4 w-4 mr-1" /> 添加单元
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {units.map((unit, idx) => (
                            <div key={unit.id} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <Input
                                  value={unit.name}
                                  onChange={(e) => {
                                    const next = [...units]
                                    next[idx].name = e.target.value
                                    setUnits(next)
                                  }}
                                  className="font-medium border-0 px-0 text-base"
                                />
                                <Button variant="ghost" size="icon" onClick={() => setUnits(units.filter((_, i) => i !== idx))}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-xs text-blue-600">线上环节</Label>
                                  <Textarea
                                    value={unit.online}
                                    onChange={(e) => {
                                      const next = [...units]
                                      next[idx].online = e.target.value
                                      setUnits(next)
                                    }}
                                    rows={2}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs text-orange-600">线下环节</Label>
                                  <Textarea
                                    value={unit.offline}
                                    onChange={(e) => {
                                      const next = [...units]
                                      next[idx].offline = e.target.value
                                      setUnits(next)
                                    }}
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="resources" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">资源组课</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {resourceTypes.map((type) => {
                              const Icon = type.icon
                              const count = selectedResources[type.key]?.length || 0
                              return (
                                <div
                                  key={type.key}
                                  onClick={() => openDialog(type.key)}
                                  className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-blue-500" />
                                    <p className="font-medium">{type.label}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {count > 0 ? `已选择 ${count} 项` : "点击选择或引用资源"}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>
                              {resourceTypes.find((t) => t.key === dialogType)?.label || "选择资源"}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2 py-2">
                            {resourceTypes
                              .find((t) => t.key === dialogType)
                              ?.options.map((option) => {
                                const checked = selectedResources[dialogType || ""]?.includes(option) || false
                                return (
                                  <label
                                    key={option}
                                    onClick={() => dialogType && toggleResource(dialogType, option)}
                                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${checked ? "bg-blue-50 border-blue-300" : "hover:bg-muted/50"}`}
                                  >
                                    <Checkbox checked={checked} />
                                    <span className="text-sm">{option}</span>
                                  </label>
                                )
                              })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {selectedNode && selectedNodeId !== FIRST_NODE_ID && (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
                  <Info className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">该节点内容为空</p>
                </div>
              )}

              {/* Bottom spacer */}
              <div className="h-12" />
            </main>
          </div>
        </div>
      </div>
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
