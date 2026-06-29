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

const MOCK_LEARNING_GOAL = `## 💡 知识目标

1. 理解API未授权访问漏洞的产生原理，掌握水平越权（IDOR）与垂直越权两类核心攻击模式的区别与关联
2. 熟悉RESTful API的安全设计规范，了解OWASP API Security Top 10中的关键风险项（BOLA、BFLA、过量数据暴露等）
3. 掌握JWT Token、OAuth 2.0等现代API认证授权机制的工作原理与常见配置缺陷

## 🔧 能力目标

1. 能够使用 Burp Suite、Postman 等工具对目标 API 进行安全测试，识别未授权访问漏洞
2. 具备编写清晰的 API 安全测试报告的能力，能够准确描述漏洞成因、风险等级与修复建议
3. 能够根据业务场景设计合理的 API 访问控制策略（RBAC/ABAC），并进行安全加固

## 🎯 素养目标

1. 培养安全第一的开发意识，将安全设计融入 API 开发全生命周期
2. 建立严谨的测试思维与规范化测试流程，养成"先验证权限，再处理请求"的编码习惯

---

> 📋 **教学提示**：本颗粒课聚焦 API 未授权访问这一具体安全场景，通过理论讲解 + 工具实操 + 靶场演练结合的方式，帮助学习者在 1-2 个课时内快速掌握核心技能。建议配合 /admin/granular/add 后台的「学习目标」富文本编辑器查看完整编辑态效果。`

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

          {/* Learning Goal - single rich text card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-[#1890ff]" />
                学习目标
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {MOCK_LEARNING_GOAL}
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
