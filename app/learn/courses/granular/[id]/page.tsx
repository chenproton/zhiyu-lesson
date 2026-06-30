"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen, Clock, FileText, FolderOpen, List,
  PlayCircle, Target, User, BrainCircuit,
} from "lucide-react"
import { courses } from "@/lib/mock-data"

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

> 📋 **教学提示**：本颗粒课聚焦 API 未授权访问这一具体安全场景，通过理论讲解 + 工具实操 + 靶场演练结合的方式，帮助学习者在 1-2 个课时内快速掌握核心技能。`

/* ==================== Main Page ==================== */

export default function GranularCourseDetailPage() {
  const params = useParams()
  const id = params.id as string
  const course = courses.find((c) => c.id === id && c.type === "granular")
  if (!course) return notFound()

  const [activeTab, setActiveTab] = useState("goal")
  const coverLabel = course.category || course.courseTag || "颗粒课"

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground transition-colors">课程首页</Link>
        <span>/</span>
        <span className="text-foreground">颗粒课详情</span>
      </div>

      {/* Top Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#e7e5e4] shadow-[0_4px_20px_rgba(69,26,3,0.06)]">
        <div className="flex gap-6">
          <div className={`w-[260px] min-h-[180px] rounded-xl bg-gradient-to-br ${course.coverColor || "from-blue-800 to-blue-500"} flex items-center justify-center relative overflow-hidden shrink-0`}>
            <span className="absolute top-3 left-3 bg-white/25 text-white px-3 py-1 rounded-md text-sm font-semibold backdrop-blur-sm">{course.version}</span>
            <span className="text-white text-5xl font-bold opacity-25">{coverLabel}</span>
            <span className="absolute bottom-3 right-3 bg-black/40 text-white px-3 py-1 rounded-md text-xs">{course.code}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-2xl font-bold text-[#0f172a]">{course.name}</h1>
              <Badge className="text-xs bg-[#eff6ff] text-[#2563eb] hover:bg-[#eff6ff] border-none">{course.courseTag}</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs border border-[#ffedd5] bg-[#fff7ed] text-[#c2410c]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" /></svg>
                面向行业：{course.industry}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs border border-[#bbf7d0] bg-[#dcfce7] text-[#15803d]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                适用专业：{course.major}
              </span>
            </div>
            <div className="flex flex-col gap-2.5 mb-4">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <User className="h-3.5 w-3.5 text-[#94a3b8]" />
                  <span>授课教师：{course.teacher}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <Clock className="h-3.5 w-3.5 text-[#94a3b8]" />
                  <span>更新时间：{course.updateDate}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <BookOpen className="h-3.5 w-3.5 text-[#94a3b8]" />
                  <span>课程类型：{course.category}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/learn/courses/granular/${course.id}/learn`}>
                <Button className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] hover:from-[#2563eb] hover:to-[#3b82f6] text-white border-0 px-8 py-2.5 text-base rounded-lg">
                  <PlayCircle className="h-4 w-4 mr-2" />开始学习
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Box */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "涉及节点", value: course.nodeCount },
          { label: "预计课时", value: course.lessonCount },
          { label: "课程资源", value: MOCK_RESOURCES.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] py-3 px-4 text-center hover:border-[#bfdbfe] hover:shadow-[0_4px_12px_rgba(37,99,235,0.08)] transition-all">
            <div className="text-[24px] font-bold text-[#1e293b] leading-tight">{stat.value}</div>
            <div className="text-[13px] text-[#64748b]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom Tab Card */}
      <div className="bg-white rounded-2xl border border-[#e7e5e4] shadow-[0_4px_20px_rgba(69,26,3,0.06)] overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start gap-0 rounded-none border-b border-[#f5f5f4] bg-white h-auto p-0 overflow-x-auto">
            {[
              { value: "goal", label: "学习目标", icon: Target },
              { value: "knowledge", label: "关联知识点", icon: BrainCircuit },
              { value: "resource", label: "课程资源", icon: FolderOpen },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative shrink-0 px-4 py-4 text-[15px] text-[#64748b] rounded-none border-0 bg-transparent data-[state=active]:text-[#3b82f6] data-[state=active]:font-semibold data-[state=active]:shadow-none data-[state=active]:bg-transparent hover:text-[#2563eb] transition-colors
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-sm data-[state=active]:after:bg-[#3b82f6]"
              >
                <tab.icon className="h-4 w-4 mr-1.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="p-6 min-h-[500px]">
            {/* Goals */}
            <TabsContent value="goal" className="mt-0">
              <h3 className="text-base font-semibold text-[#1f2937] mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#3b82f6]" />学习目标
              </h3>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {MOCK_LEARNING_GOAL}
              </div>
            </TabsContent>

            {/* Knowledge Points */}
            <TabsContent value="knowledge" className="mt-0">
              <h3 className="text-base font-semibold text-[#1f2937] mb-4 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#3b82f6]" />关联知识点
                <span className="text-xs font-normal text-gray-400">({MOCK_KNOWLEDGE_POINTS.length} 项)</span>
              </h3>
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
            </TabsContent>

            {/* Resources */}
            <TabsContent value="resource" className="mt-0">
              <h3 className="text-base font-semibold text-[#1f2937] mb-4 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#3b82f6]" />课程资源
                <span className="text-xs font-normal text-gray-400">({MOCK_RESOURCES.length} 项)</span>
              </h3>
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
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
