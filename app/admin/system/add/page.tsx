"use client"

import { useState, Suspense, useMemo, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Send,
  Star,
  BookOpen,
  GraduationCap,
  ClipboardList,
  Award,
  Database,
  ChevronDown,
  ChevronRight,
  Info,
  Lock,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { INDUSTRIES, MAJORS } from "@/lib/types"
import type { SystemCourseNode, NodeResource, NodeRefType } from "@/lib/types"

import { KnowledgeSelector } from "../../_components/knowledge/knowledge-selector"
import { ResourceSelector, type ResourceItem } from "../../_components/resources/resource-selector"
import { EvaluationMethodSelector } from "../../_components/assessment/evaluation-method-selector"
import { RichTextEditor } from "../../_components/common/rich-text-editor"

import CourseNodeTree from "./_components/CourseNodeTree"
import PublishCheckPanel from "./_components/PublishCheckPanel"

import type {
  KnowledgePointItem,
} from "@/lib/mock-data"

/* ---------- mock data ---------- */

const MOCK_KNOWLEDGE_POOL: KnowledgePointItem[] = [
  { id: "kp-1", name: "SQL注入", code: "KP-001", description: "常见的Web安全漏洞" },
  { id: "kp-2", name: "XSS攻击", code: "KP-002", description: "跨站脚本攻击" },
  { id: "kp-3", name: "CSRF防护", code: "KP-003", description: "跨站请求伪造防护" },
  { id: "kp-4", name: "密码学", code: "KP-004", description: "加密与解密技术" },
  { id: "kp-5", name: "渗透测试", code: "KP-005", description: "安全评估方法" },
  { id: "kp-6", name: "缓冲区溢出", code: "KP-006", description: "内存安全问题" },
  { id: "kp-7", name: "逆向工程", code: "KP-007", description: "程序分析与还原" },
  { id: "kp-8", name: "恶意代码", code: "KP-008", description: "病毒与木马分析" },
  { id: "kp-9", name: "安全编码", code: "KP-009", description: "防御性编程实践" },
  { id: "kp-10", name: "漏洞挖掘", code: "KP-010", description: "发现未知漏洞的方法" },
]

const MOCK_RESOURCE_POOL: ResourceItem[] = [
  { id: "res-1", name: "SQL注入课件.pptx", type: "document", url: "/resources/1.pptx", uploadedBy: "张老师", uploadedAt: "2024-01-15" },
  { id: "res-2", name: "渗透测试实验手册.pdf", type: "document", url: "/resources/2.pdf", uploadedBy: "李老师", uploadedAt: "2024-02-20" },
  { id: "res-3", name: "Web安全教学视频", type: "video", url: "/resources/3.mp4", uploadedBy: "王老师", uploadedAt: "2024-03-10" },
  { id: "res-4", name: "OWASP官方文档", type: "link", url: "https://owasp.org", uploadedBy: "赵老师", uploadedAt: "2024-03-15" },
  { id: "res-5", name: "漏洞案例数据集.xlsx", type: "spreadsheet", url: "/resources/5.xlsx", uploadedBy: "刘老师", uploadedAt: "2024-04-01" },
  { id: "res-6", name: "安全工具截图", type: "image", url: "/resources/6.jpg", uploadedBy: "陈老师", uploadedAt: "2024-04-10" },
  { id: "res-7", name: "课程音频讲解", type: "audio", url: "/resources/7.mp3", uploadedBy: "周老师", uploadedAt: "2024-05-01" },
]

const INITIAL_NODES: SystemCourseNode[] = [
  {
    id: "node-1",
    courseId: "course-1",
    parentId: null,
    name: "数据分析概述",
    order: 1,
    type: "normal",
    status: "draft",
    teachingGoals: "掌握数据分析的基本概念与流程",
    duration: 4,
    knowledgePoints: [{ name: "数据分析概念", linked: true }, { name: "数据预处理", linked: true }],
    resources: [{ id: "res-a1", name: "第一章课件.pptx", type: "document", size: 2400, url: "/r/1.pptx" }],
    quizzes: [{ id: "qz-1", title: "入门测验", type: "question_bank", questions: [] }],
    homeworks: [],
  },
  {
    id: "node-2",
    courseId: "course-1",
    parentId: null,
    name: "假设检验",
    order: 2,
    type: "original",
    status: "draft",
    teachingGoals: "掌握假设检验的基本原理与应用",
    duration: 6,
    knowledgePoints: [{ name: "假设检验", linked: true }, { name: "P值", linked: true }],
    resources: [
      { id: "res-b1", name: "假设检验案例.pdf", type: "document", size: 5100, url: "/r/2.pdf" },
      { id: "res-b2", name: "实验数据集.xlsx", type: "spreadsheet", size: 1200, url: "/r/3.xlsx" },
    ],
    quizzes: [{ id: "qz-2", title: "假设检验测验", type: "question_bank", questions: [] }],
    homeworks: [{ id: "hw-1", title: "T检验实战作业", requirement: "完成课后习题", needAttachment: true }],
  },
  {
    id: "node-2-1",
    courseId: "course-1",
    parentId: "node-2",
    name: "P值与显著性",
    order: 1,
    type: "clone",
    sourceId: "grain-1",
    sourceName: "P值与显著性",
    status: "draft",
    duration: 2,
    teachingGoals: "理解P值的含义与显著性水平",
    knowledgePoints: [{ name: "P值", linked: true }],
    resources: [{ id: "res-c1", name: "P值讲解视频.mp4", type: "video", size: 8500, url: "/r/4.mp4" }],
    quizzes: [],
    homeworks: [],
  },
  {
    id: "node-2-2",
    courseId: "course-1",
    parentId: "node-2",
    name: "T检验实战",
    order: 2,
    type: "quote",
    sourceId: "grain-2",
    sourceName: "T检验实战",
    status: "draft",
    duration: 4,
    teachingGoals: "掌握T检验的实际应用方法",
    knowledgePoints: [{ name: "T检验", linked: true }],
    resources: [],
    quizzes: [{ id: "qz-3", title: "T检验测验", type: "paper", questions: [] }],
    homeworks: [],
  },
  {
    id: "node-3",
    courseId: "course-1",
    parentId: null,
    name: "回归分析",
    order: 3,
    type: "normal",
    status: "draft",
    duration: 5,
    teachingGoals: "掌握线性回归与非线性回归方法",
    knowledgePoints: [],
    resources: [],
    quizzes: [],
    homeworks: [],
  },
  {
    id: "node-4",
    courseId: "course-1",
    parentId: null,
    name: "数据可视化",
    order: 4,
    type: "original",
    status: "draft",
    duration: 3,
    teachingGoals: "掌握常用数据可视化图表的制作",
    knowledgePoints: [{ name: "图表设计", linked: true }],
    resources: [{ id: "res-d1", name: "可视化工具介绍", type: "link", size: 0, url: "https://viz.tools" }],
    quizzes: [],
    homeworks: [],
  },
]

/* ---------- main component ---------- */

function AddSystemPageInner() {
  const searchParams = useSearchParams()
  const isEdit = searchParams.get("mode") === "edit"

  /* ========== global config (collapsible) ========== */
  const [globalInfoOpen, setGlobalInfoOpen] = useState(true)
  const [courseName, setCourseName] = useState(isEdit ? "数据分析基础" : "")
  const [courseCode] = useState(isEdit ? "SYS-DATA2024" : `SYS-${Date.now().toString(36).toUpperCase()}`)
  const [industry, setIndustry] = useState(isEdit ? "软件测试工程师" : "")
  const [major, setMajor] = useState(isEdit ? "岗位优化测试专业01" : "")
  const [description, setDescription] = useState(isEdit ? "本课程系统介绍数据分析的基本方法与工具。" : "")

  /* ========== course node tree ========== */
  const [nodes, setNodes] = useState<SystemCourseNode[]>(isEdit ? INITIAL_NODES : [])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(isEdit ? "node-2" : null)

  const handleAddNode = useCallback((parentId: string | null, name: string, order: number, type?: NodeRefType, sourceId?: string, sourceName?: string) => {
    const newNode: SystemCourseNode = {
      id: `node-${Date.now()}`,
      courseId: "course-1",
      parentId,
      name,
      order,
      type: type || "normal",
      status: "draft",
      sourceId,
      sourceName,
    }
    setNodes((prev) => [...prev, newNode])
  }, [])

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
      // Re-order siblings
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

  /* ========== current node form state ========== */
  const selectedNode = nodes.find((n) => n.id === selectedNodeId)
  const isQuoteNode = selectedNode?.type === "quote"
  const isGranularNode = selectedNode?.type === "original" || selectedNode?.type === "quote"

  /* module 1: basic info */
  const [contentName, setContentName] = useState(selectedNode?.name || "")
  const [contentCode] = useState(isEdit ? "CNT-SQL001" : `CNT-${Date.now().toString(36).toUpperCase()}`)
  const [hours, setHours] = useState(String(selectedNode?.duration || ""))
  const [learningGoal, setLearningGoal] = useState(selectedNode?.teachingGoals || "")
  const [courseType, setCourseType] = useState<"normal" | "granular">("normal")
  const [showGranularConfirm, setShowGranularConfirm] = useState(false)
  const [pendingCourseType, setPendingCourseType] = useState<"normal" | "granular">("normal")
  const [difficulty, setDifficulty] = useState<number>(isEdit ? 4 : 0)

  /* sync courseType with selected node */
  useEffect(() => {
    const node = nodes.find((n) => n.id === selectedNodeId)
    if (node) {
      setCourseType(node.type === "original" || node.type === "quote" ? "granular" : "normal")
    }
  }, [selectedNodeId, nodes])

  /* module 2: knowledge points */
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePointItem[]>(
    selectedNode?.knowledgePoints
      ? selectedNode.knowledgePoints.map((kp, i) => ({
          id: `kp-${i}`,
          name: kp.name,
          description: "",
          linked: kp.linked,
        }))
      : []
  )

  /* module 3: resources */
  const [resourcePool] = useState<ResourceItem[]>(MOCK_RESOURCE_POOL)
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>(
    isEdit ? ["res-1", "res-2"] : []
  )

  /* module 4: assessment */
  const [selectedEvalMethods, setSelectedEvalMethods] = useState<string[]>(
    isEdit ? ["exam", "question_bank"] : []
  )

  /* module 5: evaluation rules */

  /* ---------- construct current node for publish check ---------- */
  const currentCheckNode: SystemCourseNode | undefined = useMemo(() => {
    if (!selectedNodeId) return undefined
    const node = nodes.find((n) => n.id === selectedNodeId)
    if (!node) return undefined

    // Map knowledgePoints
    const kpForCheck = knowledgePoints.map((kp) => ({
      name: kp.name,
      linked: kp.linked ?? false,
    }))

    // Map resources
    const resForCheck: NodeResource[] = selectedResourceIds
      .map((id) => {
        const r = resourcePool.find((x) => x.id === id)
        if (!r) return null
        return {
          id: r.id,
          name: r.name,
          type: r.type,
          size: 0,
          url: r.url,
        }
      })
      .filter(Boolean) as NodeResource[]

    // Map quizzes from eval methods
    const quizzesForCheck = selectedEvalMethods.length > 0
      ? selectedEvalMethods.map((method, i) => ({
          id: `qz-${i}`,
          title: method === "exam" ? "作业测评" : method === "question_bank" ? "题库测验" : method === "paper" ? "试卷测验" : "现场问答",
          type: method === "question_bank" ? "question_bank" as const : "paper" as const,
          questions: [] as any[],
        }))
      : []

    return {
      ...node,
      name: contentName || node.name,
      teachingGoals: learningGoal || node.teachingGoals,
      duration: parseInt(hours) || node.duration || 0,
      knowledgePoints: kpForCheck.length > 0 ? kpForCheck : node.knowledgePoints,
      resources: resForCheck.length > 0 ? resForCheck : node.resources,
      quizzes: quizzesForCheck.length > 0 ? quizzesForCheck : node.quizzes,
    }
  }, [selectedNodeId, nodes, contentName, learningGoal, hours, knowledgePoints, selectedResourceIds, resourcePool, selectedEvalMethods])

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/system">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  返回列表
                </Button>
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">
                {isEdit ? "编辑体系课" : "新建体系课"}
                {courseName && <span className="text-gray-400 font-normal ml-2">- {courseName}</span>}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.success("草稿已保存")}>
                <Save className="h-4 w-4" />
                保存草稿
              </Button>
              <Button size="sm" className="gap-1 bg-[#1890ff] hover:bg-[#40a9ff]" onClick={() => toast.success("课程已提交审核")}>
                <Send className="h-4 w-4" />
                提交
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
                      全局课程信息
                      <span className="text-xs font-normal text-gray-400">
                        {courseName ? `《${courseName}》` : "未填写课程名称"}
                      </span>
                      {industry && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                          {industry}
                        </span>
                      )}
                      {major && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                          {major}
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
                  {!globalInfoOpen && description && (
                    <p className="text-xs text-gray-400 mt-1 pl-6 text-left">{description}</p>
                  )}
                </CardHeader>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">课程名称</Label>
                    <Input
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      placeholder="请输入课程名称"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">课程编码</Label>
                    <Input value={courseCode} disabled className="h-9 text-sm bg-gray-50 text-gray-500" />
                    <p className="text-[10px] text-gray-400">系统自动生成，不可修改</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">所属行业</Label>
                    <Select value={industry} onValueChange={setIndustry}>
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
                    <Label className="text-xs">所属专业</Label>
                    <Select value={major} onValueChange={setMajor}>
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
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-xs">课程简介</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="请输入课程简介..."
                      rows={2}
                      className="text-sm resize-y"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* ========== Three-column layout ========== */}
        <div className="grid grid-cols-[260px_1fr_260px] gap-6">

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
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => toast.success("节点草稿已暂存")}>
                    <Save className="h-3 w-3 mr-1" />
                    暂存草稿
                  </Button>
                </div>
              </div>
            )}

            {!selectedNode && (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
                <Info className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">请从左侧目录选择一个节点进行编辑</p>
              </div>
            )}

            {selectedNode && (
              <>
                {/* Module 1: Basic Info */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#1890ff]" />
                      基本信息配置
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">是否将该课程保存为颗粒课</span>
                      <Switch
                        checked={courseType === "granular"}
                        onCheckedChange={(checked) => {
                          const newType = checked ? "granular" : "normal"
                          if (newType === "granular" && courseType === "normal") {
                            setPendingCourseType(newType)
                            setShowGranularConfirm(true)
                          } else {
                            setCourseType(newType)
                            if (selectedNodeId) {
                              setNodes((prev) =>
                                prev.map((n) =>
                                  n.id === selectedNodeId
                                    ? { ...n, type: newType === "granular" ? "original" : "normal" }
                                    : n
                                )
                              )
                            }
                          }
                        }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs">内容名称</Label>
                        <Input value={contentName} onChange={(e) => setContentName(e.target.value)} placeholder="请输入内容名称" className="h-9 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">内容编码</Label>
                        <Input value={contentCode} disabled className="h-9 text-sm bg-gray-50 text-gray-500" />
                        <p className="text-[10px] text-gray-400">系统自动生成，不可修改</p>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">预计课时</Label>
                        <Input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="请输入课时数" className="h-9 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">难度等级</Label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onClick={() => setDifficulty(star)} className="p-1 transition-colors">
                              <Star className={`w-5 h-5 ${star <= difficulty ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                            </button>
                          ))}
                          <span className="text-xs text-gray-400 ml-2">{difficulty > 0 ? `${difficulty} 星` : "请选择难度"}</span>
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <Label className="text-xs">学习目标</Label>
                        <RichTextEditor
                          value={learningGoal}
                          onChange={setLearningGoal}
                          minHeight={280}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Module 2: Knowledge Points */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#1890ff]" />
                      关联知识点
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <KnowledgeSelector
                      selected={knowledgePoints}
                      pool={MOCK_KNOWLEDGE_POOL}
                      onChange={setKnowledgePoints}
                      onAddCustom={(name, description) => {
                        const newKp: KnowledgePointItem = {
                          id: `kp-custom-${Date.now()}`,
                          name,
                          description,
                          linked: false,
                        }
                        setKnowledgePoints((prev) => [...prev, newKp])
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Module 3: Resources */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#1890ff]" />
                      配置课程资源
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ResourceSelector
                      pool={resourcePool}
                      selectedIds={selectedResourceIds}
                      onChange={setSelectedResourceIds}
                      onUpload={(r) => {/* resourcePool is read-only in this simplified version */}}
                    />
                  </CardContent>
                </Card>

                {/* Module 4: Assessment */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-[#1890ff]" />
                      配置课程测评方式
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <EvaluationMethodSelector
                      selectedKeys={selectedEvalMethods}
                      onChange={setSelectedEvalMethods}
                      isGranular={isGranularNode}
                    />
                  </CardContent>
                </Card>

                {/* Module 5: Evaluation Rules */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#1890ff]" />
                      配置课程评价规则
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    {selectedEvalMethods.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-gray-400 py-12">
                        <Database className="h-12 w-12 mb-3 opacity-50" />
                        <p className="text-sm">尚未配置评价方式</p>
                        <p className="text-xs mt-1">请先在「配置课程测评方式」中选择评价类型</p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg bg-gray-50 text-sm text-gray-600">
                        参考实践场景学习平台中的测评方式配置功能即可
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Bottom spacer */}
            <div className="h-12" />
            </main>
            {isQuoteNode && (
              <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                <div className="bg-white border border-blue-200 rounded-xl px-6 py-4 shadow-lg text-center">
                  <Lock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">引用节点不可编辑</p>
                  <p className="text-xs text-gray-400 mt-1">该节点内容随原颗粒课自动更新</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Publish Check Panel */}
          <PublishCheckPanel node={currentCheckNode} />
        </div>
      </div>

      {/* Granular course type confirmation dialog */}
      <Dialog open={showGranularConfirm} onOpenChange={setShowGranularConfirm}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>切换为颗粒课</DialogTitle>
            <DialogDescription>
              将课程类型切换为「颗粒课」后，该课程将自动保存到颗粒课库中，可在其他体系课中引用或克隆。
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                切换后，当前节点的课程内容将被纳入颗粒课管理体系，支持跨课程复用。
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGranularConfirm(false)}>
              取消
            </Button>
            <Button
              onClick={() => {
                setCourseType(pendingCourseType)
                if (selectedNodeId) {
                  setNodes((prev) =>
                    prev.map((n) =>
                      n.id === selectedNodeId
                        ? { ...n, type: pendingCourseType === "granular" ? "original" : "normal" }
                        : n
                    )
                  )
                }
                setShowGranularConfirm(false)
              }}
            >
              确认切换
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AddSystemPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">加载中...</div>}>
      <AddSystemPageInner />
    </Suspense>
  )
}
