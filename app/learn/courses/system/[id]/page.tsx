"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  FolderOpen,
  Info,
  Layers,
  List,
  PlayCircle,
  Target,
  User,
  BrainCircuit,
  ClipboardList,
  Lightbulb,
  Heart,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { courses, mockKnowledgeGraphNodes, mockKnowledgeGraphEdges } from "@/lib/mock-data"
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
    id: "ch1",
    name: "第一章：数据分析概述",
    children: [
      { id: "s1-1", name: "1.1 数据分析概念" },
      { id: "s1-2", name: "1.2 数据预处理" },
      { id: "s1-3", name: "1.3 描述性统计" },
    ],
  },
  {
    id: "ch2",
    name: "第二章：假设检验",
    children: [
      { id: "s2-1", name: "2.1 P值与显著性" },
      { id: "s2-2", name: "2.2 T检验实战" },
      { id: "s2-3", name: "2.3 卡方检验" },
    ],
  },
  {
    id: "ch3",
    name: "第三章：回归分析",
    children: [
      { id: "s3-1", name: "3.1 线性回归" },
      { id: "s3-2", name: "3.2 相关系数" },
    ],
  },
  {
    id: "ch4",
    name: "第四章：数据可视化",
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

const CHAPTER_QUIZZES: Record<string, { title: string; questions: number; score: number }> = {
  ch1: { title: "数据分析概述单元测验", questions: 5, score: 50 },
  ch2: { title: "假设检验单元测验", questions: 8, score: 80 },
  ch3: { title: "回归分析单元测验", questions: 6, score: 60 },
  ch4: { title: "数据可视化单元测验", questions: 5, score: 50 },
}

const CHAPTER_KNOWLEDGE: Record<string, string[]> = {
  ch1: ["数据分析", "数据清洗", "描述性统计"],
  ch2: ["假设检验", "P值", "显著性水平", "T检验", "卡方检验"],
  ch3: ["线性回归", "相关系数", "最小二乘法"],
  ch4: ["图表设计", "色彩理论", "信息可视化"],
}

/* ---------- sub components ---------- */

function TreeView({
  nodes,
  level = 0,
}: {
  nodes: TreeNode[]
  level?: number
}) {
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
                <button onClick={() => toggle(node.id)} className="text-gray-400 hover:text-gray-600">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
              {!hasChildren && <span className="w-4" />}
              <FileText className="w-4 h-4 text-[#1890ff] shrink-0" />
              <span className="flex-1 truncate text-sm">{node.name}</span>
              <Link href={`/learn/courses/system/1/learn?chapter=${node.id}`}>
                <Button size="sm" className="h-7 text-xs bg-[#1890ff] hover:bg-[#40a9ff]">
                  <PlayCircle className="w-3 h-3 mr-1" />
                  开始学习
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
    <div className="w-[240px] shrink-0 border-r border-gray-100 bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <List className="w-4 h-4 text-[#1890ff]" />
        课程目录
      </h3>
      <div className="space-y-1">
        {COURSE_TREE.map((ch) => {
          const isExpanded = expanded.has(ch.id)
          const isActive = selectedId === ch.id
          return (
            <div key={ch.id}>
              <button
                onClick={() => {
                  toggle(ch.id)
                  onSelect(ch.id)
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  isActive ? "bg-[#e6f7ff] text-[#1890ff] font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
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
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground transition-colors">
          课程首页
        </Link>
        <span>/</span>
        <span className="text-foreground">体系课详情</span>
      </div>

      {/* 头部 */}
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
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回列表
            </Button>
          </Link>
          <Link href={`/learn/courses/system/${course.id}/learn`}>
            <Button size="sm">
              <PlayCircle className="h-4 w-4 mr-1" />
              开始学习
            </Button>
          </Link>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">章节数</p>
              <p className="text-xl font-bold">{course.nodeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-100 text-green-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">预计课时</p>
              <p className="text-xl font-bold">{course.lessonCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">资源数</p>
              <p className="text-xl font-bold">{course.resourceCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-100 text-purple-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">授课教师</p>
              <p className="text-xl font-bold">{course.teacher}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="info">
            <Info className="h-4 w-4 mr-1" />
            课程信息
          </TabsTrigger>
          <TabsTrigger value="catalog">
            <List className="h-4 w-4 mr-1" />
            课程目录
          </TabsTrigger>
          <TabsTrigger value="resource">
            <FolderOpen className="h-4 w-4 mr-1" />
            课程资源
          </TabsTrigger>
          <TabsTrigger value="goal">
            <Target className="h-4 w-4 mr-1" />
            学习目标
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <BrainCircuit className="h-4 w-4 mr-1" />
            知识点
          </TabsTrigger>
          <TabsTrigger value="graph">
            <Lightbulb className="h-4 w-4 mr-1" />
            知识图谱
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <ClipboardList className="h-4 w-4 mr-1" />
            作业测试
          </TabsTrigger>
        </TabsList>

        {/* 课程信息 */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">课程名称</span>
                  <span className="font-medium">{course.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">课程编码</span>
                  <span className="font-medium">{course.code}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">所属行业</span>
                  <span className="font-medium">{course.industry}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">所属专业</span>
                  <span className="font-medium">{course.major}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">课程类型</span>
                  <span className="font-medium">{course.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">授课教师</span>
                  <span className="font-medium">{course.teacher}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">版本号</span>
                  <span className="font-medium">{course.version}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">更新时间</span>
                  <span className="font-medium">{course.updateDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 课程目录 */}
        <TabsContent value="catalog">
          <Card>
            <CardHeader>
              <CardTitle>课程目录</CardTitle>
            </CardHeader>
            <CardContent>
              <TreeView nodes={COURSE_TREE} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 课程资源 - 全课程汇总 */}
        <TabsContent value="resource">
          <Card>
            <CardHeader>
              <CardTitle>课程资源</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: course.resourceCount }).map((_, i) => (
                  <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6 text-center">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">资源 {i + 1}</p>
                      <p className="text-xs text-muted-foreground">PDF 文档</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 学习目标 - 按章节 */}
        <TabsContent value="goal">
          <div className="flex gap-4">
            <CatalogNav selectedId={selectedNodeId} onSelect={setSelectedNodeId} />
            <div className="flex-1 min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle>学习目标</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedChapter && (
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                      <h4 className="text-sm font-semibold text-blue-700 mb-2">
                        {selectedSection?.name || selectedChapter.name}
                      </h4>
                      <p className="text-sm text-blue-800/80 leading-relaxed">
                        {CHAPTER_GOALS[selectedChapter.id] || "暂无学习目标"}
                      </p>
                    </div>
                  )}
                  <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                    <h4 className="text-sm font-semibold text-green-700 mb-2">📌 能力目标</h4>
                    <p className="text-sm text-green-800/80 leading-relaxed">
                      能够运用所学知识分析与解决实际问题，具备独立完成相关实验、项目或任务的能力，并形成系统化的技术思维。
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                    <h4 className="text-sm font-semibold text-amber-700 mb-2">📌 素养目标</h4>
                    <p className="text-sm text-amber-800/80 leading-relaxed">
                      培养严谨求实的学习态度、团队协作精神与持续学习的意识，提升信息安全意识与职业责任感。
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 知识点 - 按章节 */}
        <TabsContent value="knowledge">
          <div className="flex gap-4">
            <CatalogNav selectedId={selectedNodeId} onSelect={setSelectedNodeId} />
            <div className="flex-1 min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle>涉及知识点</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(selectedChapter ? CHAPTER_KNOWLEDGE[selectedChapter.id] : [])?.map((kp) => (
                      <span
                        key={kp}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        {kp}
                      </span>
                    )) || (
                      <span className="text-sm text-gray-400">请选择左侧章节查看知识点</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 知识图谱 - 全课程汇总 */}
        <TabsContent value="graph">
          <Card>
            <CardHeader>
              <CardTitle>知识图谱</CardTitle>
            </CardHeader>
            <CardContent>
              <KnowledgeGraph
                nodes={mockKnowledgeGraphNodes}
                edges={mockKnowledgeGraphEdges}
                height={520}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 作业测试 - 按章节 */}
        <TabsContent value="quiz">
          <div className="flex gap-4">
            <CatalogNav selectedId={selectedNodeId} onSelect={setSelectedNodeId} />
            <div className="flex-1 min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle>作业与测试</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedChapter && CHAPTER_QUIZZES[selectedChapter.id] ? (
                    <div className="p-4 rounded-lg border border-blue-100 bg-blue-50/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-800">{CHAPTER_QUIZZES[selectedChapter.id].title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {CHAPTER_QUIZZES[selectedChapter.id].questions} 题 · {CHAPTER_QUIZZES[selectedChapter.id].score} 分
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="p-2 rounded bg-white border border-gray-100">
                          <div className="flex items-start gap-2">
                            <span className="px-1.5 py-0.5 text-[10px] rounded shrink-0 mt-0.5 bg-blue-50 text-blue-500">单选</span>
                            <p className="text-sm text-gray-700">1. 假设检验中，p值小于显著性水平意味着？</p>
                          </div>
                        </div>
                        <div className="p-2 rounded bg-white border border-gray-100">
                          <div className="flex items-start gap-2">
                            <span className="px-1.5 py-0.5 text-[10px] rounded shrink-0 mt-0.5 bg-blue-50 text-blue-500">单选</span>
                            <p className="text-sm text-gray-700">2. 下列哪种场景适合使用 T 检验？</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">请选择左侧章节查看作业测试</div>
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

      {/* Right Sidebar */}
      <div className="w-[280px] shrink-0 space-y-4 hidden xl:block fixed right-6 top-24">
        {/* 这里为了布局不重叠，实际项目中可以用 grid 布局 */}
      </div>
    </div>
  )
}
