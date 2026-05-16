"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, BookOpen } from "lucide-react"
import CourseNodeTree from "./_components/CourseNodeTree"
import NodeEditor from "./_components/NodeEditor"
import PublishCheckPanel from "./_components/PublishCheckPanel"
import GrainCourseModal from "./_components/GrainCourseModal"
import QuizConfigModal from "./_components/QuizConfigModal"
import { mockSystemCourseNodes } from "@/lib/mock-data"
import type {
  SystemCourseNode,
  CourseStatus,
  Course,
  NodeQuiz,
} from "@/lib/types"
import { COURSE_STATUS_LABELS, COURSE_STATUS_COLORS, INDUSTRIES, MAJORS } from "@/lib/types"

interface CourseInfo {
  name: string
  code: string
  industry: string
  major: string
  teacher: string
  description: string
  status: CourseStatus
}

export default function AddSystemPage() {
  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    name: "",
    code: "",
    industry: "",
    major: "",
    teacher: "",
    description: "",
    status: "draft",
  })

  const [nodes, setNodes] = useState<SystemCourseNode[]>(mockSystemCourseNodes)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    mockSystemCourseNodes[0]?.id ?? null
  )
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [showBasicInfo, setShowBasicInfo] = useState(false)

  const [grainModalOpen, setGrainModalOpen] = useState(false)
  const [grainModalMode, setGrainModalMode] = useState<"clone" | "quote">("clone")

  const [quizModalOpen, setQuizModalOpen] = useState(false)

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  )

  const handleSelectNode = useCallback(
    (nodeId: string) => {
      if (hasUnsavedChanges && selectedNodeId && selectedNodeId !== nodeId) {
        if (!confirm("当前节点有未保存的修改，是否保存后再切换？")) {
          // User cancelled - still allow switch but keep changes in memory
        }
      }
      setSelectedNodeId(nodeId)
      setShowBasicInfo(false)
    },
    [hasUnsavedChanges, selectedNodeId]
  )

  const handleAddNode = useCallback(
    (parentId: string | null, name: string, order: number) => {
      const newNode: SystemCourseNode = {
        id: `node-${Date.now()}`,
        courseId: "new-course",
        parentId,
        name,
        order,
        type: "normal",
        status: "draft",
      }
      setNodes((prev) => [...prev, newNode])
      setHasUnsavedChanges(true)
    },
    []
  )

  const handleUpdateNode = useCallback(
    (nodeId: string, updates: Partial<SystemCourseNode>) => {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, ...updates } : n))
      )
      setHasUnsavedChanges(true)
    },
    []
  )

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => {
      const toDelete = new Set<string>()
      const collect = (id: string) => {
        toDelete.add(id)
        prev.filter((n) => n.parentId === id).forEach((n) => collect(n.id))
      }
      collect(nodeId)
      return prev.filter((n) => !toDelete.has(n.id))
    })
    setHasUnsavedChanges(true)
  }, [])

  const handleReorderNodes = useCallback(
    (nodeId: string, targetNodeId: string) => {
      setNodes((prev) => {
        const node = prev.find((n) => n.id === nodeId)
        const target = prev.find((n) => n.id === targetNodeId)
        if (!node || !target) return prev
        if (node.parentId !== target.parentId) return prev

        const siblings = prev
          .filter((n) => n.parentId === node.parentId)
          .sort((a, b) => a.order - b.order)

        const nodeIndex = siblings.findIndex((n) => n.id === nodeId)
        const targetIndex = siblings.findIndex((n) => n.id === targetNodeId)

        if (nodeIndex === -1 || targetIndex === -1) return prev

        const newSiblings = [...siblings]
        newSiblings.splice(nodeIndex, 1)
        newSiblings.splice(targetIndex, 0, node)

        const orderMap = new Map<string, number>()
        newSiblings.forEach((n, idx) => {
          orderMap.set(n.id, idx + 1)
        })

        return prev.map((n) =>
          orderMap.has(n.id) ? { ...n, order: orderMap.get(n.id)! } : n
        )
      })
      setHasUnsavedChanges(true)
    },
    []
  )

  const handleSave = useCallback(() => {
    setHasUnsavedChanges(false)
    setLastSavedAt(
      new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    )
  }, [])

  const handleSaveAsGrainCourse = useCallback(() => {
    // In a real app, this would create a new grain course entity
    // and update the node's sourceId to reference it.
    // For now, we simulate by saving and showing an alert.
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNodeId
          ? {
              ...n,
              type: "original" as const,
              sourceId: undefined,
              sourceName: undefined,
            }
          : n
      )
    )
    handleSave()
    alert("已将当前节点内容保存为新的颗粒课")
  }, [selectedNodeId, handleSave])

  const handleSubmitApproval = useCallback(() => {
    handleSave()
    alert("已保存并提交审批")
  }, [handleSave])

  const handleOpenGrainModal = useCallback((mode: "clone" | "quote") => {
    setGrainModalMode(mode)
    setGrainModalOpen(true)
  }, [])

  const handleGrainSelect = useCallback(
    (course: Course, mode: "clone" | "quote") => {
      if (!selectedNodeId) return
      setNodes((prev) =>
        prev.map((n) =>
          n.id === selectedNodeId
            ? {
                ...n,
                type: mode === "clone" ? "clone" : "quote",
                sourceId: course.id,
                sourceName: course.name,
                name: mode === "clone" ? `${course.name}-克隆` : course.name,
                duration: course.lessonCount,
              }
            : n
        )
      )
      setHasUnsavedChanges(true)
    },
    [selectedNodeId]
  )

  const handleAddQuiz = useCallback(
    (quiz: NodeQuiz) => {
      if (!selectedNodeId) return
      setNodes((prev) =>
        prev.map((n) =>
          n.id === selectedNodeId
            ? { ...n, quizzes: [...(n.quizzes ?? []), quiz] }
            : n
        )
      )
      setHasUnsavedChanges(true)
    },
    [selectedNodeId]
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/system">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>

      {/* Course Info Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-1 h-6 bg-blue-500 rounded-full" />
            <h1 className="text-2xl font-semibold">
              {courseInfo.name || "新建体系课"}
            </h1>
            <span
              className={`px-2 py-0.5 text-xs rounded-md ${
                COURSE_STATUS_COLORS[courseInfo.status]
              }`}
            >
              {COURSE_STATUS_LABELS[courseInfo.status]}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBasicInfo(!showBasicInfo)}
          >
            {showBasicInfo ? "隐藏基本信息" : "编辑基本信息"}
          </Button>
        </div>
        {courseInfo.description && (
          <p className="mt-2 text-xs text-gray-400 pl-4">{courseInfo.description}</p>
        )}
      </div>

      {/* Basic Info Form */}
      {showBasicInfo && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            课程基本信息
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>课程名称</Label>
              <Input
                value={courseInfo.name}
                onChange={(e) =>
                  setCourseInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="请输入课程名称"
              />
            </div>
            <div>
              <Label>课程编号</Label>
              <Input
                value={courseInfo.code}
                onChange={(e) =>
                  setCourseInfo((prev) => ({ ...prev, code: e.target.value }))
                }
                placeholder="请输入课程编号"
              />
            </div>
            <div>
              <Label>所属行业</Label>
              <Select
                value={courseInfo.industry}
                onValueChange={(v) =>
                  setCourseInfo((prev) => ({ ...prev, industry: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择所属行业" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.filter((i) => i !== "全部").map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>所属专业</Label>
              <Select
                value={courseInfo.major}
                onValueChange={(v) =>
                  setCourseInfo((prev) => ({ ...prev, major: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择所属专业" />
                </SelectTrigger>
                <SelectContent>
                  {MAJORS.filter((m) => m !== "全部").map((major) => (
                    <SelectItem key={major} value={major}>
                      {major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>授课教师</Label>
              <Input
                value={courseInfo.teacher}
                onChange={(e) =>
                  setCourseInfo((prev) => ({ ...prev, teacher: e.target.value }))
                }
                placeholder="请输入授课教师"
              />
            </div>
            <div className="md:col-span-2">
              <Label>课程简介</Label>
              <Textarea
                value={courseInfo.description}
                onChange={(e) =>
                  setCourseInfo((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="请输入课程简介..."
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* Three Column Layout */}
      <div className="flex gap-6">
        <CourseNodeTree
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelect={handleSelectNode}
          onAddNode={handleAddNode}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onReorderNodes={handleReorderNodes}
        />

        {selectedNode ? (
          <NodeEditor
            node={selectedNode}
            allNodes={nodes}
            onChange={handleUpdateNode}
            onSave={handleSave}
            onSubmitApproval={handleSubmitApproval}
            hasUnsavedChanges={hasUnsavedChanges}
            lastSavedAt={lastSavedAt}
            onOpenGrainModal={handleOpenGrainModal}
            onOpenQuizModal={() => setQuizModalOpen(true)}
            onSaveAsGrainCourse={handleSaveAsGrainCourse}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[400px] bg-white rounded-xl border border-gray-100">
            <div className="text-center text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>请在左侧选择一个节点进行编辑</p>
            </div>
          </div>
        )}

        <PublishCheckPanel node={selectedNode} />
      </div>

      {/* Modals */}
      <GrainCourseModal
        open={grainModalOpen}
        onOpenChange={setGrainModalOpen}
        mode={grainModalMode}
        onSelect={handleGrainSelect}
      />

      <QuizConfigModal
        open={quizModalOpen}
        onOpenChange={setQuizModalOpen}
        onConfirm={handleAddQuiz}
      />
    </div>
  )
}
