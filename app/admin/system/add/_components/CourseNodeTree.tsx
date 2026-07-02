"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  Plus,
  MoreHorizontal,
  GripVertical,
  BookOpen,
  Search,
  CheckCircle2,
} from "lucide-react"
import type { SystemCourseNode, NodeRefType } from "@/lib/types"
import { NODE_REF_TYPE_LABELS, NODE_REF_TYPE_COLORS } from "@/lib/types"

interface GrainCourseOption {
  id: string
  name: string
  description: string
  source: string
  duration: number
}

interface CourseNodeTreeProps {
  nodes: SystemCourseNode[]
  selectedNodeId: string | null
  grainCourses: GrainCourseOption[]
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

type AddMode = "upload" | "clone" | "quote"

export default function CourseNodeTree({
  nodes,
  selectedNodeId,
  grainCourses,
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
  const [addMode, setAddMode] = useState<AddMode>("upload")
  const [selectedGrainId, setSelectedGrainId] = useState<string | null>(null)
  const [grainSearch, setGrainSearch] = useState("")
  const nextOrderRef = useRef(1)

  const [editNodeName, setEditNodeName] = useState("")
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const tree = useMemo(() => buildTree(nodes), [nodes])

  /* auto-fill node name when quoting a grain course */
  useEffect(() => {
    if (addMode === "quote") {
      if (selectedGrainId) {
        const grain = grainCourses.find((g) => g.id === selectedGrainId)
        if (grain) setNewNodeName(grain.name)
      } else {
        setNewNodeName("")
      }
    }
  }, [addMode, selectedGrainId, grainCourses])

  const filteredGrains = useMemo(() => {
    const kw = grainSearch.trim()
    if (!kw) return grainCourses
    return grainCourses.filter(
      (g) =>
        g.name.includes(kw) ||
        g.description.includes(kw) ||
        g.source.includes(kw)
    )
  }, [grainCourses, grainSearch])

  const openAddDialog = useCallback(
    (parentId: string | null = null) => {
      const siblings = nodes.filter((n) => n.parentId === parentId)
      const nextOrder = siblings.length > 0 ? Math.max(...siblings.map((n) => n.order)) + 1 : 1
      setNewNodeName("")
      setNewNodeParent(parentId ?? "root")
      setAddMode("upload")
      setSelectedGrainId(null)
      setGrainSearch("")
      nextOrderRef.current = nextOrder
      setAddDialogOpen(true)
    },
    [nodes]
  )

  const openEditDialog = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
      setEditingNodeId(nodeId)
      setEditNodeName(node.name)
      setEditDialogOpen(true)
    },
    [nodes]
  )

  const handleConfirmAdd = () => {
    if (!newNodeName.trim()) return
    const parentId = newNodeParent === "root" ? null : newNodeParent

    if (addMode === "upload") {
      onAddNode(parentId, newNodeName.trim(), nextOrderRef.current, "normal")
    } else {
      if (!selectedGrainId) return
      const grain = grainCourses.find((g) => g.id === selectedGrainId)
      if (!grain) return
      const nodeType: NodeRefType = addMode === "quote" ? "original" : "normal"
      onAddNode(
        parentId,
        newNodeName.trim(),
        nextOrderRef.current,
        nodeType,
        grain.id,
        grain.name
      )
    }
    setAddDialogOpen(false)
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

  const modeOptions: { key: AddMode; label: string }[] = [
    { key: "upload", label: "上传课程资源" },
    { key: "clone", label: "克隆颗粒课" },
    { key: "quote", label: "引用已有颗粒课" },
  ]

  const renderTreeNode = (item: TreeItem, indexPath: string) => {
    const { node, level, children } = item
    const isActive = selectedNodeId === node.id
    const isDragging = draggingId === node.id
    const isDragOver = dragOverId === node.id
    const seq = indexPath

    return (
      <div key={node.id}>
        <div
          className={cn(
            "tree-node flex items-center gap-1 px-1 py-1 rounded cursor-pointer text-sm transition-colors select-none",
            isActive ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500" : "text-gray-600 hover:bg-gray-50",
            isDragging && "opacity-40",
            isDragOver && "border-t-2 border-blue-500"
          )}
          style={{ paddingLeft: `${8 + level * 10}px` }}
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
          <span className="text-gray-400 text-xs w-5 shrink-0">{seq}</span>
          <span className="flex-1 truncate" title={node.name}>
            {node.name}
          </span>
          {node.type === "original" && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${NODE_REF_TYPE_COLORS["original"]}`}>
              {NODE_REF_TYPE_LABELS["original"]}
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
          <div className="border-l border-gray-100 ml-3">
            {children.map((child, idx) => renderTreeNode(child, `${seq}.${idx + 1}`))}
          </div>
        )}
      </div>
    )
  }

  const isRootAdd = newNodeParent === "root"
  const canConfirm =
    newNodeName.trim() && (addMode === "upload" || !!selectedGrainId)

  return (
    <aside className="w-64 shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 p-3 sticky top-[88px]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-500" />
            目录
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
            <DialogTitle>{isRootAdd ? "添加节点" : "添加子节点"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div>
              <Label>节点名称 <span className="text-red-500">*</span></Label>
              <Input
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder={addMode === "quote" ? "选择颗粒课后自动回填" : "请输入节点名称"}
                maxLength={50}
                disabled={addMode === "quote"}
                className="mt-1 disabled:bg-gray-50 disabled:text-gray-500"
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {newNodeName.length} / 50
              </p>
            </div>

            <div className="space-y-2">
              <Label>编辑方式</Label>
              <div className="flex items-center gap-6">
                {modeOptions.map((opt) => (
                  <label
                    key={opt.key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="addMode"
                      value={opt.key}
                      checked={addMode === opt.key}
                      onChange={() => {
                        setAddMode(opt.key)
                        setSelectedGrainId(null)
                        if (opt.key !== "quote") setNewNodeName("")
                      }}
                      className="h-4 w-4 accent-blue-500"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {(addMode === "clone" || addMode === "quote") && (
              <div className="space-y-2">
                <Label>{addMode === "clone" ? "选择要克隆的颗粒课" : "选择要引用的颗粒课"}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={grainSearch}
                    onChange={(e) => setGrainSearch(e.target.value)}
                    placeholder="搜索颗粒课名称、来源..."
                    className="pl-9 text-sm h-9"
                  />
                </div>
                <div className="space-y-2 max-h-[240px] overflow-y-auto">
                  {filteredGrains.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">未找到匹配的颗粒课</p>
                  ) : (
                    filteredGrains.map((g) => {
                      const selected = selectedGrainId === g.id
                      return (
                        <button
                          key={g.id}
                          onClick={() => setSelectedGrainId(g.id)}
                          className={cn(
                            "w-full text-left p-3 rounded-lg border transition-all",
                            selected
                              ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full border flex items-center justify-center",
                                  selected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                                )}
                              >
                                {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-sm font-medium text-gray-800">{g.name}</span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                              {g.source}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 pl-7">
                            {g.description}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 pl-7">{g.duration} 课时</p>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            )}
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
