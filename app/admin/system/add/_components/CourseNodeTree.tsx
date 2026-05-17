"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Plus,
  MoreHorizontal,
  GripVertical,
  BookOpen,
  Search,
  CheckCircle2,
  Lock,
  Copy,
  Link2,
} from "lucide-react"
import type { SystemCourseNode, NodeRefType } from "@/lib/types"
import { NODE_REF_TYPE_LABELS, NODE_REF_TYPE_COLORS } from "@/lib/types"

interface CourseNodeTreeProps {
  nodes: SystemCourseNode[]
  selectedNodeId: string | null
  onSelect: (nodeId: string) => void
  onAddNode: (parentId: string | null, name: string, order: number, type?: NodeRefType, sourceId?: string, sourceName?: string) => void
  onUpdateNode: (nodeId: string, updates: Partial<SystemCourseNode>) => void
  onDeleteNode: (nodeId: string) => void
  onReorderNodes: (nodeId: string, targetNodeId: string) => void
}

interface TreeItem {
  node: SystemCourseNode
  level: number
  children: TreeItem[]
}

/* ---------- mock grain course pool ---------- */
const MOCK_GRAIN_COURSES = [
  { id: "grain-1", name: "P值与显著性", description: "统计推断基础概念", source: "统计学院", duration: 2 },
  { id: "grain-2", name: "T检验实战", description: "小样本均值检验方法", source: "数据分析系", duration: 4 },
  { id: "grain-3", name: "SQL注入防御", description: "Web安全防护技术", source: "网络安全系", duration: 3 },
  { id: "grain-4", name: "XSS攻击原理", description: "跨站脚本攻击分析", source: "网络安全系", duration: 2 },
  { id: "grain-5", name: "组件封装实践", description: "前端组件化开发规范", source: "前端工程系", duration: 3 },
  { id: "grain-6", name: "状态管理进阶", description: "React/Vue 状态管理", source: "前端工程系", duration: 4 },
  { id: "grain-7", name: "回归分析入门", description: "线性回归与非线性回归", source: "统计学院", duration: 5 },
  { id: "grain-8", name: "数据可视化", description: "常用图表制作与美化", source: "数据分析系", duration: 3 },
]

function buildTree(nodes: SystemCourseNode[]): TreeItem[] {
  const map = new Map<string, TreeItem>()
  const roots: TreeItem[] = []

  const sorted = [...nodes].sort((a, b) => a.order - b.order)

  sorted.forEach((node) => {
    map.set(node.id, { node, level: 0, children: [] })
  })

  sorted.forEach((node) => {
    const item = map.get(node.id)!
    if (node.parentId && map.has(node.parentId)) {
      const parent = map.get(node.parentId)!
      item.level = parent.level + 1
      parent.children.push(item)
    } else {
      roots.push(item)
    }
  })

  return roots
}

export default function CourseNodeTree({
  nodes,
  selectedNodeId,
  onSelect,
  onAddNode,
  onUpdateNode,
  onDeleteNode,
  onReorderNodes,
}: CourseNodeTreeProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)

  /* add dialog state */
  const [newNodeName, setNewNodeName] = useState("")
  const [newNodeParent, setNewNodeParent] = useState<string>("root")
  const [newNodeOrder, setNewNodeOrder] = useState(1)
  const [addMode, setAddMode] = useState<NodeRefType>("normal")
  const [sourceSearch, setSourceSearch] = useState("")
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)

  const [editNodeName, setEditNodeName] = useState("")
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const tree = useMemo(() => buildTree(nodes), [nodes])

  const filteredSources = MOCK_GRAIN_COURSES.filter((g) =>
    !sourceSearch ||
    g.name.includes(sourceSearch) ||
    g.description.includes(sourceSearch) ||
    g.source.includes(sourceSearch)
  )

  const selectedSource = MOCK_GRAIN_COURSES.find((g) => g.id === selectedSourceId)

  const openAddDialog = useCallback(
    (parentId: string | null = null) => {
      const siblings = nodes.filter((n) => n.parentId === parentId)
      const nextOrder = siblings.length > 0 ? Math.max(...siblings.map((n) => n.order)) + 1 : 1
      setNewNodeName("")
      setNewNodeParent(parentId ?? "root")
      setNewNodeOrder(nextOrder)
      setAddMode("normal")
      setSourceSearch("")
      setSelectedSourceId(null)
      setAddDialogOpen(true)
    },
    [nodes]
  )

  const openEditDialog = useCallback((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return
    setEditingNodeId(nodeId)
    setEditNodeName(node.name)
    setEditDialogOpen(true)
  }, [nodes])

  const handleConfirmAdd = () => {
    if (!newNodeName.trim()) return
    const parentId = newNodeParent === "root" ? null : newNodeParent

    if (addMode === "clone" || addMode === "quote") {
      if (!selectedSourceId) return
      const source = MOCK_GRAIN_COURSES.find((g) => g.id === selectedSourceId)
      if (!source) return
      onAddNode(parentId, newNodeName.trim(), newNodeOrder, addMode, source.id, source.name)
    } else {
      onAddNode(parentId, newNodeName.trim(), newNodeOrder, "normal")
    }

    setAddDialogOpen(false)
    setNewNodeName("")
    setSelectedSourceId(null)
    setSourceSearch("")
  }

  const handleConfirmEdit = () => {
    if (!editingNodeId || !editNodeName.trim()) return
    onUpdateNode(editingNodeId, { name: editNodeName.trim() })
    setEditDialogOpen(false)
    setEditingNodeId(null)
  }

  const handleDelete = (nodeId: string) => {
    if (confirm("确定删除该节点吗？删除后其所有子节点也将被删除。")) {
      onDeleteNode(nodeId)
    }
  }

  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    setDraggingId(nodeId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, nodeId: string) => {
    e.preventDefault()
    if (draggingId && draggingId !== nodeId) {
      setDragOverId(nodeId)
    }
  }

  const handleDragLeave = () => {
    setDragOverId(null)
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (draggingId && draggingId !== targetId) {
      onReorderNodes(draggingId, targetId)
    }
    setDraggingId(null)
    setDragOverId(null)
  }

  const renderTreeNode = (item: TreeItem, indexPath: string) => {
    const { node, level, children } = item
    const isActive = selectedNodeId === node.id
    const isDragging = draggingId === node.id
    const isDragOver = dragOverId === node.id
    const seq = indexPath
    const isQuote = node.type === "quote"

    return (
      <div key={node.id}>
        <div
          className={cn(
            "tree-node flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer text-sm transition-colors select-none",
            isActive ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500" : "text-gray-600 hover:bg-gray-50",
            isDragging && "opacity-40",
            isDragOver && "border-t-2 border-blue-500",
            isQuote && !isActive && "bg-blue-50/30"
          )}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          draggable
          onDragStart={(e) => handleDragStart(e, node.id)}
          onDragOver={(e) => handleDragOver(e, node.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, node.id)}
          onClick={() => onSelect(node.id)}
        >
          <span className="text-gray-300 cursor-grab opacity-0 hover:opacity-50 transition-opacity">
            <GripVertical className="w-3 h-3" />
          </span>
          <span className="text-gray-400 text-xs w-6 shrink-0">{seq}</span>
          <span className="flex-1 truncate" title={node.name}>
            {node.name}
          </span>
          {isQuote && (
            <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0 bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-0.5">
              <Lock className="w-2.5 h-2.5" />
              引用
            </span>
          )}
          {node.type === 'original' && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${NODE_REF_TYPE_COLORS[node.type]}`}>
              {NODE_REF_TYPE_LABELS[node.type]}
            </span>
          )}
          {node.type === 'clone' && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${NODE_REF_TYPE_COLORS[node.type]}`}>
              克隆
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="text-gray-400 hover:text-gray-700 text-xs px-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs">
              <DropdownMenuItem onClick={() => openEditDialog(node.id)}>
                ✏ 编辑名称
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openAddDialog(node.id)}>
                + 添加子节点
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => handleDelete(node.id)}
              >
                🗑 删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {children.length > 0 && (
          <div className="border-l border-gray-100 ml-4">
            {children.map((child, idx) => renderTreeNode(child, `${seq}.${idx + 1}`))}
          </div>
        )}
      </div>
    )
  }

  const canConfirm =
    newNodeName.trim() &&
    (addMode === "normal" || (addMode !== "normal" && selectedSourceId))

  return (
    <aside className="w-64 shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-[88px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-500" />
            课程目录
          </h3>
        </div>
        <div className="space-y-0.5 text-sm">
          {tree.map((item, idx) => renderTreeNode(item, String(idx + 1)))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 text-xs"
          onClick={() => openAddDialog(null)}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          添加节点
        </Button>
        <p className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
          💡 拖拽节点可调整顺序
        </p>
      </div>

      {/* Add Node Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>添加节点</DialogTitle>
          </DialogHeader>

          {/* Basic fields - always visible */}
          <div className="space-y-4 py-2">
            <div>
              <Label>节点名称 <span className="text-red-500">*</span></Label>
              <Input
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder="请输入节点名称"
                maxLength={50}
                className="mt-1"
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {newNodeName.length} / 50
              </p>
            </div>
            <div>
              <Label>上级节点</Label>
              <Select value={newNodeParent} onValueChange={setNewNodeParent}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="选择上级节点" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">— 无（顶级节点）—</SelectItem>
                  {nodes.map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      {n.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>显示顺序 <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                min={1}
                value={newNodeOrder}
                onChange={(e) => setNewNodeOrder(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">
                💡 已建议顺序号 <span className="text-blue-500 font-medium">{newNodeOrder}</span>
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t pt-4">
            <Tabs
              value={addMode}
              onValueChange={(v) => {
                setAddMode(v as NodeRefType)
                setSelectedSourceId(null)
                setSourceSearch("")
              }}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="clone">克隆其他颗粒课</TabsTrigger>
                <TabsTrigger value="quote">引用其他颗粒课</TabsTrigger>
                <TabsTrigger value="normal">新建普通课程</TabsTrigger>
              </TabsList>

              {/* Clone tab */}
              {addMode === "clone" && (
                <div className="mt-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={sourceSearch}
                      onChange={(e) => setSourceSearch(e.target.value)}
                      placeholder="搜索颗粒课名称、来源..."
                      className="pl-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2 max-h-[240px] overflow-y-auto">
                    {filteredSources.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">未找到匹配的颗粒课</p>
                    ) : (
                      filteredSources.map((g) => {
                        const selected = selectedSourceId === g.id
                        return (
                          <button
                            key={g.id}
                            onClick={() => {
                              setSelectedSourceId(g.id)
                              setNewNodeName(g.name)
                            }}
                            className={cn(
                              "w-full text-left p-3 rounded-lg border transition-all",
                              selected
                                ? "border-primary bg-primary/5 ring-1 ring-primary/10"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-5 h-5 rounded-full border flex items-center justify-center",
                                  selected ? "bg-primary border-primary" : "border-gray-300"
                                )}>
                                  {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{g.name}</span>
                              </div>
                              <Badge variant="outline" className="text-[10px]">{g.source}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 pl-7">{g.description}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 pl-7">{g.duration} 课时</p>
                          </button>
                        )
                      })
                    )}
                  </div>
                  {selectedSource && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-700 flex items-start gap-2">
                      <Copy className="h-4 w-4 shrink-0 mt-0.5" />
                      已选择「{selectedSource.name}」，克隆后该节点内容可独立编辑，与原颗粒课解除关联。
                    </div>
                  )}
                </div>
              )}

              {/* Quote tab */}
              {addMode === "quote" && (
                <div className="mt-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={sourceSearch}
                      onChange={(e) => setSourceSearch(e.target.value)}
                      placeholder="搜索颗粒课名称、来源..."
                      className="pl-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2 max-h-[240px] overflow-y-auto">
                    {filteredSources.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">未找到匹配的颗粒课</p>
                    ) : (
                      filteredSources.map((g) => {
                        const selected = selectedSourceId === g.id
                        return (
                          <button
                            key={g.id}
                            onClick={() => {
                              setSelectedSourceId(g.id)
                              setNewNodeName(g.name)
                            }}
                            className={cn(
                              "w-full text-left p-3 rounded-lg border transition-all",
                              selected
                                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-5 h-5 rounded-full border flex items-center justify-center",
                                  selected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                                )}>
                                  {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{g.name}</span>
                              </div>
                              <Badge variant="outline" className="text-[10px]">{g.source}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 pl-7">{g.description}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 pl-7">{g.duration} 课时</p>
                          </button>
                        )
                      })
                    )}
                  </div>
                  {selectedSource && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-700 flex items-start gap-2">
                      <Lock className="h-4 w-4 shrink-0 mt-0.5" />
                      已选择「{selectedSource.name}」，引用后该节点内容不可编辑，将自动随原颗粒课更新。
                    </div>
                  )}
                </div>
              )}

              {/* Normal tab */}
              {addMode === "normal" && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <p className="text-sm text-gray-600">创建一个新的普通课程节点，内容可自由编辑。</p>
                </div>
              )}
            </Tabs>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmAdd} disabled={!canConfirm}>
              确认添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Node Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>编辑节点名称</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label>节点名称</Label>
            <Input
              value={editNodeName}
              onChange={(e) => setEditNodeName(e.target.value)}
              placeholder="请输入节点名称"
              maxLength={50}
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  )
}
