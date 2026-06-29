"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft, BookOpen, Clock, FileText, FolderOpen, Info, Layers, List,
  PlayCircle, Target, User, BrainCircuit, ClipboardList, Lightbulb,
  ChevronDown, ChevronRight,
} from "lucide-react"
import { courses } from "@/lib/mock-data"
import { type Course, COURSE_STATUS_LABELS, COURSE_STATUS_COLORS } from "@/lib/types"
import KnowledgeGraph from "@/components/KnowledgeGraph"

/* ---------- mock tree data ---------- */
interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
}

const COURSE_TREE: TreeNode[] = [
  {
    id: "ch1", name: "第一章：数据分析概述",
    children: [
      { id: "s1-1", name: "1.1 数据分析概念" },
      { id: "s1-2", name: "1.2 数据预处理" },
      { id: "s1-3", name: "1.3 描述性统计" },
    ],
  },
  {
    id: "ch2", name: "第二章：假设检验",
    children: [
      { id: "s2-1", name: "2.1 P值与显著性" },
      { id: "s2-2", name: "2.2 T检验实战" },
      { id: "s2-3", name: "2.3 卡方检验" },
    ],
  },
  {
    id: "ch3", name: "第三章：回归分析",
    children: [
      { id: "s3-1", name: "3.1 线性回归" },
      { id: "s3-2", name: "3.2 相关系数" },
    ],
  },
  {
    id: "ch4", name: "第四章：数据可视化",
    children: [
      { id: "s4-1", name: "4.1 图表设计" },
      { id: "s4-2", name: "4.2 色彩理论" },
      { id: "s4-3", name: "4.3 信息可视化" },
    ],
  },
]

const CHAPTER_GOALS: Record<string, string> = {
  ch1: "掌握数据分析的基本概念与流程，理解数据预处理的重要性。",
  ch2: "掌握假设检验的基本原理，能够运用T检验和卡方检验解决实际问题。",
  ch3: "掌握线性回归分析方法，理解相关系数的含义与应用。",
  ch4: "掌握常用数据可视化图表的制作方法与审美原则。",
}

const COURSE_OBJECTIVES = `## 💡 知识目标

1. 掌握数据分析的基本概念、流程与方法论，理解数据驱动的决策思维
2. 掌握假设检验的基本原理，能够正确理解和运用P值进行统计推断
3. 掌握线性回归分析的核心思想，理解最小二乘法与相关系数的含义
4. 掌握数据可视化的设计原则，熟悉常用图表的制作方法与审美规范

## 🔧 能力目标

1. 能够独立完成从数据清洗到分析报告撰写的完整数据分析流程
2. 能够根据业务场景选择合适的统计检验方法并正确解释结果
3. 能够使用专业工具（Python/R/Excel）进行数据处理与可视化
4. 具备基于数据发现问题、提出假设、验证结论的分析思维

## 🎯 素质目标

1. 培养严谨求实的数据分析态度，以客观事实为依据进行判断
2. 建立系统化的分析思维，能够从多维度解读数据
3. 提升数据叙事与可视化沟通能力，使分析结果易于理解

---

> 📋 **课程说明**：本体系课面向数据分析方向，通过系统化的知识结构帮助学习者从零基础逐步掌握数据科学核心技能。涵盖统计分析、回归建模、数据可视化等关键领域。`

const CHAPTER_KNOWLEDGE: Record<string, string[]> = {
  ch1: ["数据分析", "数据清洗", "描述性统计"],
  ch2: ["假设检验", "P值", "显著性水平", "T检验", "卡方检验"],
  ch3: ["线性回归", "相关系数", "最小二乘法"],
  ch4: ["图表设计", "色彩理论", "信息可视化"],
}

const CHAPTER_QUIZZES: Record<string, { title: string; questions: number; score: number }> = {
  ch1: { title: "数据分析概述单元测验", questions: 5, score: 50 },
  ch2: { title: "假设检验单元测验", questions: 8, score: 80 },
  ch3: { title: "回归分析单元测验", questions: 6, score: 60 },
  ch4: { title: "数据可视化单元测验", questions: 5, score: 50 },
}

const CHAPTER_RESOURCES: Record<string, { id: string; name: string; type: string; size: string }[]> = {
  ch1: [
    { id: "cr1-1", name: "数据分析基础-第一章.pdf", type: "PDF", size: "2.4MB" },
    { id: "cr1-2", name: "数据预处理实战指南.pdf", type: "PDF", size: "3.1MB" },
    { id: "cr1-3", name: "描述性统计教学视频", type: "视频", size: "45min" },
  ],
  ch2: [
    { id: "cr2-1", name: "数据分析基础-第三章.pdf", type: "PDF", size: "2.4MB" },
    { id: "cr2-2", name: "假设检验案例演示.pptx", type: "PPT", size: "5.1MB" },
    { id: "cr2-3", name: "统计实验手册.pdf", type: "PDF", size: "4.7MB" },
    { id: "cr2-4", name: "假设检验教学视频（共3集）", type: "视频", size: "1.8GB" },
  ],
  ch3: [
    { id: "cr3-1", name: "回归分析理论与实践.pdf", type: "PDF", size: "5.3MB" },
    { id: "cr3-2", name: "实验数据集.xlsx", type: "Excel", size: "0.5MB" },
  ],
  ch4: [
    { id: "cr4-1", name: "数据可视化设计指南.pdf", type: "PDF", size: "6.2MB" },
    { id: "cr4-2", name: "图表配色方案.pptx", type: "PPT", size: "3.8MB" },
    { id: "cr4-3", name: "信息可视化案例集", type: "链接", size: "在线" },
  ],
}

const CHAPTER_KG: Record<string, { nodes: import("@/lib/types").KnowledgeGraphNode[]; edges: import("@/lib/types").KnowledgeGraphEdge[] }> = {
  ch1: {
    nodes: [
      { id: "kg1-1", label: "数据分析", x: 400, y: 200, type: "core", description: "从数据中提取有用信息的过程" },
      { id: "kg1-2", label: "数据清洗", x: 280, y: 300, type: "related", description: "处理缺失值、异常值和重复数据" },
      { id: "kg1-3", label: "描述性统计", x: 520, y: 300, type: "related", description: "用图表和数值概括数据特征" },
      { id: "kg1-4", label: "数据预处理", x: 400, y: 380, type: "extended", description: "为分析做数据准备工作" },
    ],
    edges: [
      { from: "kg1-1", to: "kg1-2", label: "包含" },
      { from: "kg1-1", to: "kg1-3", label: "应用" },
      { from: "kg1-2", to: "kg1-4", label: "前置" },
    ],
  },
  ch2: {
    nodes: [
      { id: "kg2-1", label: "假设检验", x: 400, y: 200, type: "core", description: "统计推断的核心方法之一" },
      { id: "kg2-2", label: "P值", x: 280, y: 300, type: "related", description: "衡量统计显著性的关键指标" },
      { id: "kg2-3", label: "T检验", x: 520, y: 300, type: "related", description: "用于小样本均值比较的检验方法" },
      { id: "kg2-4", label: "卡方检验", x: 400, y: 380, type: "extended", description: "用于分类变量独立性检验" },
    ],
    edges: [
      { from: "kg2-1", to: "kg2-2", label: "依赖" },
      { from: "kg2-1", to: "kg2-3", label: "应用" },
      { from: "kg2-1", to: "kg2-4", label: "应用" },
    ],
  },
  ch3: {
    nodes: [
      { id: "kg3-1", label: "回归分析", x: 400, y: 200, type: "core", description: "探索变量间关系的方法" },
      { id: "kg3-2", label: "线性回归", x: 280, y: 300, type: "related", description: "拟合线性关系预测连续值" },
      { id: "kg3-3", label: "相关系数", x: 520, y: 300, type: "related", description: "衡量变量间线性相关程度" },
    ],
    edges: [
      { from: "kg3-1", to: "kg3-2", label: "包含" },
      { from: "kg3-1", to: "kg3-3", label: "关联" },
    ],
  },
  ch4: {
    nodes: [
      { id: "kg4-1", label: "数据可视化", x: 400, y: 200, type: "core", description: "将数据转化为图表的过程" },
      { id: "kg4-2", label: "图表设计", x: 280, y: 300, type: "related", description: "选择合适的图表类型呈现数据" },
      { id: "kg4-3", label: "色彩理论", x: 520, y: 300, type: "related", description: "运用色彩提升信息传达效率" },
      { id: "kg4-4", label: "信息可视化", x: 400, y: 380, type: "extended", description: "将复杂数据转化为直观图形" },
    ],
    edges: [
      { from: "kg4-1", to: "kg4-2", label: "包含" },
      { from: "kg4-1", to: "kg4-3", label: "应用" },
      { from: "kg4-2", to: "kg4-4", label: "扩展" },
    ],
  },
}

/* ---------- sub components ---------- */

function CatalogNav({
  selectedId,
  onSelect,
}: {
  selectedId: string
  onSelect: (id: string) => void
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(COURSE_TREE.map((n) => n.id)))

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="w-[250px] shrink-0 bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <List className="w-4 h-4 text-[#1890ff]" />
        课程目录
      </h3>
      <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
        {COURSE_TREE.map((ch) => {
          const isExpanded = expanded.has(ch.id)
          const isActive = selectedId === ch.id
          return (
            <div key={ch.id}>
              <button
                onClick={() => { toggle(ch.id); onSelect(ch.id); }}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  isActive ? "bg-[#e6f7ff] text-[#1890ff] font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                <FolderOpen className="w-4 h-4 shrink-0" />
                <span className="truncate">{ch.name}</span>
              </button>
              {isExpanded && ch.children && (
                <div className="ml-5 mt-0.5 space-y-0.5 border-l border-gray-100 pl-2">
                  {ch.children.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSelect(s.id)}
                      className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs transition-colors ${
                        selectedId === s.id ? "bg-[#e6f7ff] text-[#1890ff] font-medium" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{s.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TreeView({ nodes, level = 0 }: { nodes: TreeNode[]; level?: number }) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(nodes.map((n) => n.id)))

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-1">
      {nodes.map((node) => {
        const isExpanded = expanded.has(node.id)
        const hasChildren = node.children && node.children.length > 0
        return (
          <div key={node.id}>
            <div
              className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                level === 0 ? "bg-gray-50 font-medium text-gray-800" : "text-gray-600 hover:bg-gray-50"
              }`}
              style={{ paddingLeft: `${12 + level * 16}px` }}
            >
              {hasChildren && (
                <button onClick={() => toggle(node.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
              {!hasChildren && <span className="w-4" />}
              <FileText className="w-4 h-4 text-[#1890ff] shrink-0" />
              <span className="flex-1 truncate text-sm">{node.name}</span>
              <Link href={`/learn/courses/system/1/learn?chapter=${node.id}`}>
                <Button size="sm" className="h-7 text-xs bg-[#1890ff] hover:bg-[#40a9ff]">
                  <PlayCircle className="w-3 h-3 mr-1" />开始学习
                </Button>
              </Link>
            </div>
            {hasChildren && isExpanded && (
              <div className="mt-0.5">
                <TreeView nodes={node.children!} level={level + 1} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ---------- page ---------- */

export default function SystemCourseDetailPage() {
  const params = useParams()
  const id = params.id as string
  const course = courses.find((c) => String(c.id) === String(id))
  if (!course) return notFound()

  const [activeTab, setActiveTab] = useState("info")
  const [selectedNodeId, setSelectedNodeId] = useState("ch1")

  const selectedChapter = COURSE_TREE.find((c) => c.id === selectedNodeId || c.children?.some((s) => s.id === selectedNodeId))
  const selectedSection = selectedChapter?.children?.find((s) => s.id === selectedNodeId)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground transition-colors">课程首页</Link>
        <span>/</span>
        <span className="text-foreground">体系课详情</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{course.courseTag}</Badge>
            <Badge variant="outline">{course.version}</Badge>
          </div>
          <h1 className="text-2xl font-semibold">{course.name}</h1>
          <p className="text-muted-foreground mt-1">课程编码：{course.code}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/learn">
            <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-1" />返回列表</Button>
          </Link>
          <Link href={`/learn/courses/system/${course.id}/learn`}>
            <Button size="sm"><PlayCircle className="h-4 w-4 mr-1" />开始学习</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 flex items-center gap-3"><div className="p-2.5 rounded-lg bg-blue-100 text-blue-600"><Layers className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">章节数</p><p className="text-xl font-bold">{course.nodeCount}</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><div className="p-2.5 rounded-lg bg-green-100 text-green-600"><Clock className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">预计课时</p><p className="text-xl font-bold">{course.lessonCount}</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><div className="p-2.5 rounded-lg bg-amber-100 text-amber-600"><FileText className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">资源数</p><p className="text-xl font-bold">{course.resourceCount}</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><div className="p-2.5 rounded-lg bg-purple-100 text-purple-600"><User className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">授课教师</p><p className="text-xl font-bold">{course.teacher}</p></div></CardContent></Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="info"><Info className="h-4 w-4 mr-1" />课程信息</TabsTrigger>
          <TabsTrigger value="goal"><Target className="h-4 w-4 mr-1" />课程目标</TabsTrigger>
          <TabsTrigger value="catalog"><List className="h-4 w-4 mr-1" />课程目录</TabsTrigger>
          <TabsTrigger value="resource"><FolderOpen className="h-4 w-4 mr-1" />课程资源</TabsTrigger>
          <TabsTrigger value="knowledge"><BrainCircuit className="h-4 w-4 mr-1" />课程知识点</TabsTrigger>
          <TabsTrigger value="quiz"><ClipboardList className="h-4 w-4 mr-1" />课程测评</TabsTrigger>
        </TabsList>

        {/* Info */}
        <TabsContent value="info">
          <Card>
            <CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["课程名称", course.name], ["课程编码", course.code],
                  ["所属行业", course.industry], ["所属专业", course.major],
                  ["课程类型", course.category], ["授课教师", course.teacher],
                  ["版本号", course.version], ["更新时间", course.updateDate],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals */}
        <TabsContent value="goal">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-4 h-4 text-[#1890ff]" />课程目标</CardTitle></CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {COURSE_OBJECTIVES}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Catalog */}
        <TabsContent value="catalog">
          <Card>
            <CardHeader><CardTitle>课程目录</CardTitle></CardHeader>
            <CardContent><TreeView nodes={COURSE_TREE} /></CardContent>
          </Card>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resource">
          <div className="flex gap-4">
            <CatalogNav selectedId={selectedNodeId} onSelect={setSelectedNodeId} />
            <div className="flex-1 min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    课程资源
                    <span className="text-xs font-normal text-gray-400">— {selectedSection?.name || selectedChapter?.name || "请选择章节"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedChapter && (CHAPTER_RESOURCES[selectedChapter.id] || []).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(CHAPTER_RESOURCES[selectedChapter.id] || []).map((r) => (
                        <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#1890ff] hover:shadow-sm transition-all cursor-pointer">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{r.name}</p>
                            <p className="text-xs text-gray-400">{r.size}</p>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">{r.type}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-400 text-sm">
                      <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>请选择左侧章节查看对应资源</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Knowledge Points + Graph */}
        <TabsContent value="knowledge">
          <div className="flex gap-4">
            <CatalogNav selectedId={selectedNodeId} onSelect={setSelectedNodeId} />
            <div className="flex-1 min-w-0 space-y-4">
              <Card>
                <CardHeader><CardTitle>涉及知识点</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(selectedChapter ? CHAPTER_KNOWLEDGE[selectedChapter.id] : [])?.map((kp) => (
                      <span key={kp} className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">{kp}</span>
                    )) || <span className="text-sm text-gray-400">请选择左侧章节查看知识点</span>}
                  </div>
                </CardContent>
              </Card>
              {selectedChapter && CHAPTER_KG[selectedChapter.id] && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" />知识关联图谱</CardTitle></CardHeader>
                  <CardContent>
                    <KnowledgeGraph
                      nodes={CHAPTER_KG[selectedChapter.id].nodes}
                      edges={CHAPTER_KG[selectedChapter.id].edges}
                      height={360}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Quiz */}
        <TabsContent value="quiz">
          <div className="flex gap-4">
            <CatalogNav selectedId={selectedNodeId} onSelect={setSelectedNodeId} />
            <div className="flex-1 min-w-0">
              <Card>
                <CardHeader><CardTitle>课程测评</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {selectedChapter && CHAPTER_QUIZZES[selectedChapter.id] ? (
                    <div className="p-4 rounded-lg border border-blue-100 bg-blue-50/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-800">{CHAPTER_QUIZZES[selectedChapter.id].title}</h4>
                        <Badge variant="outline" className="text-xs">{CHAPTER_QUIZZES[selectedChapter.id].questions} 题 · {CHAPTER_QUIZZES[selectedChapter.id].score} 分</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">请选择左侧章节查看测评</div>
                  )}
                  <div className="p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-800">课后作业</h4>
                      <Badge variant="outline" className="text-xs">需提交</Badge>
                    </div>
                    <p className="text-sm text-gray-600">使用所学方法，对给定的业务数据集进行分析，撰写一份不少于 500 字的分析报告。</p>
                    <p className="text-xs text-gray-400 mt-2">截止时间：2025-01-20 23:59</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
