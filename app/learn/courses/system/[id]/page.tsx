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
  CalendarDays,
  ShieldCheck,
  Eye,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { courses, mockKnowledgeGraphNodes, mockKnowledgeGraphEdges } from "@/lib/mock-data"
import { type Course, COURSE_STATUS_LABELS, COURSE_STATUS_COLORS } from "@/lib/types"
import KnowledgeGraph from "@/components/KnowledgeGraph"

export default function SystemCourseDetailPage() {
  const params = useParams()
  const id = params.id as string
  const course = courses.find(
    (c) => String(c.id) === String(id)
  )
  if (!course) return notFound()

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
              <p className="text-xs text-muted-foreground">节点数</p>
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

      {/* Main + Sidebar */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <Tabs defaultValue="info">
        <TabsList>
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
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">浏览人次</span>
                  <span className="font-medium">{course.viewCount}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">学习人次</span>
                  <span className="font-medium">{course.studyCount}</span>
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
              <div className="space-y-2">
                {Array.from({ length: course.nodeCount }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {course.name} - 第{i + 1}节点
                      </p>
                      <p className="text-xs text-muted-foreground">预计 15 分钟</p>
                    </div>
                    <PlayCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 课程资源 */}
        <TabsContent value="resource">
          <Card>
            <CardHeader>
              <CardTitle>课程资源</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: course.resourceCount }).map((_, i) => (
                  <Card
                    key={i}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
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

        {/* 学习目标 */}
        <TabsContent value="goal">
          <Card>
            <CardHeader>
              <CardTitle>学习目标</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-700 mb-2">📌 知识目标</h4>
                <p className="text-sm text-blue-800/80 leading-relaxed">
                  掌握{course.name}的基本概念、核心原理与关键技术，理解相关理论框架及其在实际场景中的应用方法。
                </p>
              </div>
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
        </TabsContent>

        {/* 知识点 */}
        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <CardTitle>涉及知识点</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  "假设检验", "P值与显著性", "T检验", "卡方检验", "方差分析",
                  "A/B测试", "置信区间", "回归分析", "正态分布", "中心极限定理",
                ].map((kp) => (
                  <span key={kp} className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
                    {kp}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">第一章 · 数据分析概述</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["数据分析", "数据清洗", "描述性统计"].map((kp) => (
                      <span key={kp} className="px-2 py-0.5 text-xs bg-white text-gray-600 rounded border border-gray-200">{kp}</span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">第二章 · 假设检验</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["假设检验", "P值", "显著性水平", "T检验"].map((kp) => (
                      <span key={kp} className="px-2 py-0.5 text-xs bg-white text-gray-600 rounded border border-gray-200">{kp}</span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">第三章 · 回归分析</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["线性回归", "相关系数", "最小二乘法"].map((kp) => (
                      <span key={kp} className="px-2 py-0.5 text-xs bg-white text-gray-600 rounded border border-gray-200">{kp}</span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">第四章 · 数据可视化</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["图表设计", "色彩理论", "信息可视化"].map((kp) => (
                      <span key={kp} className="px-2 py-0.5 text-xs bg-white text-gray-600 rounded border border-gray-200">{kp}</span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 知识图谱 */}
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

        {/* 作业测试 */}
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle>作业与测试</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quiz Group */}
              <QuizGroup
                title="假设检验单元测验"
                badge="3 题 · 30 分"
                questions={[
                  { type: "single", text: "假设检验中，p值小于显著性水平意味着？", options: ["A. 拒绝原假设", "B. 接受原假设", "C. 无法判断", "D. 需要增加样本量"], answer: "A" },
                  { type: "single", text: "下列哪种场景适合使用 T 检验？", options: ["A. 总体方差已知的大样本", "B. 总体方差未知的小样本", "C. 两个独立总体比例比较", "D. 分类变量独立性检验"], answer: "B" },
                  { type: "essay", text: "请简述 A/B 测试的基本流程。", answer: "确定目标→设计实验→分流用户→收集数据→统计分析→得出结论" },
                ]}
              />
              {/* Homework */}
              <div className="p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-800">课后作业</h4>
                  <Badge variant="outline" className="text-xs">需提交</Badge>
                </div>
                <p className="text-sm text-gray-600">使用所学假设检验方法，对给定的业务数据集进行分析，撰写一份不少于 500 字的分析报告。</p>
                <p className="text-xs text-gray-400 mt-2">截止时间：2025-01-20 23:59</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>

        {/* Right Sidebar */}
        <aside className="w-[280px] shrink-0 space-y-4 hidden xl:block">
          {/* Creator Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-800">创建信息</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">创建人</span>
                <span className="text-gray-700">{course.teacher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">所属部门</span>
                <span className="text-gray-700">课程研发部</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">创建时间</span>
                <span className="text-gray-700">{course.updateDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">更新时间</span>
                <span className="text-gray-700">{course.updateDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-800">课程状态</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">当前状态</span>
                <Badge className={COURSE_STATUS_COLORS[course.status]}>
                  {COURSE_STATUS_LABELS[course.status]}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">版本号</span>
                <span className="text-sm text-gray-700">{course.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">审批记录</span>
                <span className="text-sm text-gray-400">暂无</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-800">快捷操作</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-2">
                <button className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-colors">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-[10px] text-gray-600">收藏</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] text-gray-600">分享</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-100 hover:border-amber-200 hover:bg-amber-50 transition-colors">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] text-gray-600">标记</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Related Courses */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-800">相关推荐</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {courses
                .filter((c) => c.type === course.type && c.id !== course.id)
                .slice(0, 3)
                .map((rc) => (
                  <Link
                    key={rc.id}
                    href={`/learn/courses/${rc.type}/${rc.id}`}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${rc.coverColor ?? 'from-gray-400 to-gray-600'} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold`}>
                      {rc.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-700 truncate group-hover:text-blue-600 transition-colors">
                        {rc.name}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {rc.major} · {rc.lessonCount}课时
                      </p>
                    </div>
                  </Link>
                ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function QuizGroup({
  title,
  badge,
  questions,
}: {
  title: string
  badge: string
  questions: { type: "single" | "essay"; text: string; options?: string[]; answer?: string }[]
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="p-4 rounded-lg border border-blue-100 bg-blue-50/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-3"
      >
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{badge}</Badge>
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      </button>
      <div className="space-y-2">
        {questions.map((q, idx) => (
          <div key={idx} className="p-2 rounded bg-white border border-gray-100">
            <div className="flex items-start gap-2">
              <span className={`px-1.5 py-0.5 text-[10px] rounded shrink-0 mt-0.5 ${
                q.type === "single" ? "bg-blue-50 text-blue-500" : "bg-purple-50 text-purple-500"
              }`}>
                {q.type === "single" ? "单选" : "简答"}
              </span>
              <p className="text-sm text-gray-700">{idx + 1}. {q.text}</p>
            </div>
            {expanded && q.type === "single" && q.options && (
              <div className="mt-2 ml-6 space-y-1">
                {q.options.map((opt) => (
                  <p key={opt} className="text-xs text-gray-500">{opt}</p>
                ))}
              </div>
            )}
            {expanded && q.answer && (
              <div className="mt-2 ml-6 p-1.5 rounded bg-green-50 border border-green-100">
                <p className="text-xs text-green-600">参考答案：{q.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
