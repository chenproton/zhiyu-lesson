"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft, BookOpen, Clock, FileText, User, Layers, PlayCircle,
  Star, BrainCircuit, FolderOpen, Target, PenTool, Heart, Share2, Bookmark
} from "lucide-react"
import { courses } from "@/lib/mock-data"
import { COURSE_STATUS_LABELS, COURSE_STATUS_COLORS } from "@/lib/types"
import { notFound, useParams } from "next/navigation"

/* ==================== Mock Data ==================== */

const MOCK_KNOWLEDGE_POINTS = [
  { id: "kp-1", name: "SQL注入", code: "KP-001", desc: "常见的Web安全漏洞，攻击者通过构造恶意SQL语句操作后端数据库" },
  { id: "kp-2", name: "漏洞检测", code: "KP-002", desc: "通过自动化工具或手动方式发现系统安全漏洞的过程" },
  { id: "kp-3", name: "渗透测试", code: "KP-003", desc: "模拟攻击者行为对目标系统进行安全评估的方法论" },
  { id: "kp-4", name: "Web安全", code: "KP-004", desc: "保护Web应用免受网络威胁的安全实践与技术" },
  { id: "kp-5", name: "安全防护", code: "KP-005", desc: "通过安全策略、工具与实践构建系统防御体系" },
]

const MOCK_RESOURCES = [
  { id: "r1", name: "API未授权访问漏洞检测课件.pptx", type: "PPT", size: "3.2MB", teacher: "马老师" },
  { id: "r2", name: "漏洞检测实战手册.pdf", type: "PDF", size: "5.8MB", teacher: "马老师" },
  { id: "r3", name: "安全测试教学视频（共3集）", type: "视频", size: "1.2GB", teacher: "王老师" },
  { id: "r4", name: "OWASP Top 10 参考链接", type: "链接", size: "在线", teacher: "李老师" },
  { id: "r5", name: "漏洞扫描工具使用指南.docx", type: "文档", size: "1.5MB", teacher: "马老师" },
]

const MOCK_LEARNING_GOAL = {
  knowledge: [
    "理解API未授权访问漏洞的产生原理与常见类型",
    "掌握水平越权和垂直越权的区别与检测方法",
    "了解RESTful API的安全设计规范",
  ],
  ability: [
    "能够使用Burp Suite等工具进行API安全测试",
    "具备编写API安全测试报告的能力",
    "能够设计安全的API访问控制策略",
  ],
  quality: [
    "培养安全第一的开发意识",
    "建立严谨的测试思维与流程规范",
  ],
}

const MOCK_QUIZ = [
  { type: "单选", stem: "API未授权访问漏洞属于OWASP Top 10中的哪一类？", options: ["A. 注入", "B. 失效的访问控制", "C. 安全配置错误", "D. 跨站脚本"], answer: "B" },
  { type: "单选", stem: "以下哪种方法无法有效防御API未授权访问？", options: ["A. JWT Token验证", "B. IP白名单", "C. 隐藏API端点", "D. RBAC权限控制"], answer: "C" },
  { type: "单选", stem: "水平越权和垂直越权的根本区别是？", options: ["A. 攻击方向", "B. 权限层级", "C. 影响范围", "D. 利用难度"], answer: "B" },
  { type: "简答", stem: "请简述检测API未授权访问漏洞的常用步骤。" },
]

/* ==================== Sub Components ==================== */

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < value ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  )
}

/* ==================== Main Page ==================== */

export default function GranularCourseDetailPage() {
  const params = useParams()
  const id = params.id as string
  const course = courses.find((c) => c.id === id && c.type === "granular")
  if (!course) return notFound()

  const relatedCourses = courses
    .filter((c) => c.type === "granular" && c.id !== course.id)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground transition-colors">
          课程首页
        </Link>
        <span>/</span>
        <span className="text-foreground">颗粒课</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">{course.courseTag}</Badge>
            <Badge className={COURSE_STATUS_COLORS[course.status]}>
              {COURSE_STATUS_LABELS[course.status]}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold">{course.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            课程编码 {course.code} · 授课教师 {course.teacher}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/learn">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />返回
            </Button>
          </Link>
          <Button size="sm">
            <PlayCircle className="h-4 w-4 mr-1" />开始学习
          </Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        {/* Main column */}
        <div className="space-y-6">

          {/* Basic info card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#1890ff]" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 rounded-lg bg-blue-50">
                  <p className="text-xs text-blue-500 mb-1">涉及节点</p>
                  <p className="text-xl font-bold text-blue-700">{course.nodeCount}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50">
                  <p className="text-xs text-green-500 mb-1">预计课时</p>
                  <p className="text-xl font-bold text-green-700">{course.lessonCount}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-50">
                  <p className="text-xs text-amber-500 mb-1">课程资源</p>
                  <p className="text-xl font-bold text-amber-700">{MOCK_RESOURCES.length}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-purple-50">
                  <p className="text-xs text-purple-500 mb-1">难度等级</p>
                  <div className="flex justify-center mt-1">
                    <StarRating value={3} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-muted-foreground">课程名称</span>
                  <span className="font-medium">{course.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-muted-foreground">课程编码</span>
                  <span className="font-medium font-mono text-xs">{course.code}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-muted-foreground">课程分类</span>
                  <span className="font-medium">{course.category}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-muted-foreground">所属行业</span>
                  <span className="font-medium">{course.industry}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-muted-foreground">所属专业</span>
                  <span className="font-medium">{course.major}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-muted-foreground">授课教师</span>
                  <span className="font-medium">{course.teacher}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-muted-foreground">浏览人次</span>
                  <span className="font-medium">{course.viewCount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-muted-foreground">学习人次</span>
                  <span className="font-medium">{course.studyCount?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Goal */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-[#1890ff]" />
                学习目标
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />知识目标
                  </p>
                  <ul className="space-y-1.5">
                    {MOCK_LEARNING_GOAL.knowledge.map((g, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-blue-800/80">
                        <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                  <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5" />能力目标
                  </p>
                  <ul className="space-y-1.5">
                    {MOCK_LEARNING_GOAL.ability.map((g, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-green-800/80">
                        <span className="text-green-400 mt-0.5 shrink-0">•</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                  <p className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" />素质目标
                  </p>
                  <ul className="space-y-1.5">
                    {MOCK_LEARNING_GOAL.quality.map((g, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-purple-800/80">
                        <span className="text-purple-400 mt-0.5 shrink-0">•</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Points */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#1890ff]" />
                关联知识点
                <span className="text-xs font-normal text-gray-400">({MOCK_KNOWLEDGE_POINTS.length} 项)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MOCK_KNOWLEDGE_POINTS.map((kp) => (
                  <div
                    key={kp.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <BrainCircuit className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-gray-700">{kp.name}</p>
                        <span className="text-[10px] font-mono text-gray-400">{kp.code}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{kp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#1890ff]" />
                课程资源
                <span className="text-xs font-normal text-gray-400">({MOCK_RESOURCES.length} 项)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {MOCK_RESOURCES.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate group-hover:text-[#1890ff] transition-colors">
                        {r.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] px-1.5 h-4">{r.type}</Badge>
                        <span className="text-[10px] text-gray-400">{r.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quiz / Homework */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1890ff]" />
                单元测验
                <span className="text-xs font-normal text-gray-400">({MOCK_QUIZ.length} 题)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_QUIZ.map((q, i) => (
                  <div key={i} className="p-3 rounded-lg border border-gray-100 hover:border-blue-100 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant="secondary" className="text-[10px] px-1.5 h-4">{q.type}</Badge>
                          <span className="text-sm text-gray-700">{q.stem}</span>
                        </div>
                        {q.options && (
                          <div className="grid grid-cols-2 gap-1.5 ml-8 mt-2">
                            {q.options.map((opt) => (
                              <span key={opt} className="text-xs text-gray-500 px-2 py-0.5 rounded bg-gray-50 border border-gray-100">
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button size="sm" variant="outline" className="gap-1">
                  <PlayCircle className="h-4 w-4" />开始答题
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right sidebar */}
        <aside className="space-y-4 hidden xl:block">
          {/* Status */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">课程状态</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">当前状态</span>
                <Badge className={COURSE_STATUS_COLORS[course.status]}>
                  {COURSE_STATUS_LABELS[course.status]}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">版本号</span>
                <span className="text-gray-700">{course.version}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">更新时间</span>
                <span className="text-gray-700">{course.updateDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">快捷操作</CardTitle>
            </CardHeader>
            <CardContent>
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

          {/* Related courses */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">相关推荐</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {relatedCourses.map((rc) => (
                <Link
                  key={rc.id}
                  href={`/learn/courses/granular/${rc.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-md bg-gradient-to-br ${rc.coverColor} shrink-0 flex items-center justify-center text-white text-xs font-bold`}>
                    {rc.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700 truncate group-hover:text-blue-600">{rc.name}</p>
                    <p className="text-[10px] text-gray-400">{rc.major} · {rc.lessonCount}课时</p>
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
