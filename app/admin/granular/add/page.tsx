"use client"

import { useState, Suspense, useMemo } from "react"
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
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { SystemCourseNode, NodeResource } from "@/lib/types"

import { KnowledgeSelector } from "../../_components/knowledge/knowledge-selector"
import { ResourceSelector, type ResourceItem } from "../../_components/resources/resource-selector"
import { EvaluationMethodSelector } from "../../_components/assessment/evaluation-method-selector"
import { RichTextEditor } from "../../_components/common/rich-text-editor"

import PublishCheckPanel from "../../system/add/_components/PublishCheckPanel"

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
  { id: "kp-6", name: "P值与显著性", code: "KP-006", description: "统计推断基础" },
  { id: "kp-7", name: "假设检验", code: "KP-007", description: "统计假设验证方法" },
  { id: "kp-8", name: "T检验", code: "KP-008", description: "小样本均值检验" },
  { id: "kp-9", name: "组件封装", code: "KP-009", description: "前端组件化开发" },
  { id: "kp-10", name: "状态管理", code: "KP-010", description: "应用状态管理方案" },
]

const MOCK_RESOURCE_POOL: ResourceItem[] = [
  { id: "res-1", name: "假设检验课件.pptx", type: "document", url: "/resources/1.pptx", uploadedBy: "张老师", uploadedAt: "2024-01-15" },
  { id: "res-2", name: "统计实验手册.pdf", type: "document", url: "/resources/2.pdf", uploadedBy: "李老师", uploadedAt: "2024-02-20" },
  { id: "res-3", name: "假设检验教学视频", type: "video", url: "/resources/3.mp4", uploadedBy: "王老师", uploadedAt: "2024-03-10" },
  { id: "res-4", name: "统计学习资料链接", type: "link", url: "https://example.com/stats", uploadedBy: "赵老师", uploadedAt: "2024-03-15" },
  { id: "res-5", name: "实验数据集.xlsx", type: "spreadsheet", url: "/resources/5.xlsx", uploadedBy: "刘老师", uploadedAt: "2024-04-01" },
  { id: "res-6", name: "教学图片素材", type: "image", url: "/resources/6.jpg", uploadedBy: "陈老师", uploadedAt: "2024-04-10" },
  { id: "res-7", name: "课程音频讲解", type: "audio", url: "/resources/7.mp3", uploadedBy: "周老师", uploadedAt: "2024-05-01" },
]

/* ---------- main component ---------- */

function AddGranularPageInner() {
  const searchParams = useSearchParams()
  const isEdit = searchParams.get("mode") === "edit"

  /* module 1: basic info */
  const [courseName, setCourseName] = useState(isEdit ? "假设检验" : "")
  const [courseCode] = useState(isEdit ? "GRA-STAT101" : `GRA-${Date.now().toString(36).toUpperCase()}`)
  const [hours, setHours] = useState(isEdit ? "2" : "")
  const [learningGoal, setLearningGoal] = useState(isEdit ? "掌握假设检验的基本原理与方法论" : "")
  const [courseType, setCourseType] = useState<"normal" | "granular">("normal")
  const [difficulty, setDifficulty] = useState<number>(isEdit ? 3 : 0)

  /* module 2: knowledge points */
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePointItem[]>(
    isEdit
      ? [
          { id: "kp-7", name: "假设检验", code: "KP-007", description: "统计假设验证方法", linked: true },
          { id: "kp-6", name: "P值与显著性", code: "KP-006", description: "统计推断基础", linked: true },
        ]
      : []
  )

  /* module 3: resources */
  const [resourcePool, setResourcePool] = useState<ResourceItem[]>(MOCK_RESOURCE_POOL)
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>(
    isEdit ? ["res-1", "res-2"] : []
  )

  /* module 4: assessment */
  const [selectedEvalMethods, setSelectedEvalMethods] = useState<string[]>(
    isEdit ? ["exam", "paper"] : []
  )

  /* module 5: evaluation rules */
  const [passScore, setPassScore] = useState("60")

  /* ---------- construct current node for publish check ---------- */
  const currentCheckNode: SystemCourseNode | undefined = useMemo(() => {
    const kpForCheck = knowledgePoints.map((kp) => ({
      name: kp.name,
      linked: kp.linked ?? false,
    }))

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

    const quizzesForCheck = selectedEvalMethods.length > 0
      ? selectedEvalMethods.map((method, i) => ({
          id: `qz-${i}`,
          title: method === "exam" ? "作业测评" : method === "question_bank" ? "题库测验" : method === "paper" ? "试卷测验" : "现场问答",
          type: method === "question_bank" ? "question_bank" as const : "paper" as const,
          questions: [] as any[],
        }))
      : []

    return {
      id: "granular-current",
      courseId: "granular-1",
      parentId: null,
      name: courseName || "未命名",
      order: 1,
      type: courseType === "granular" ? "original" : "normal",
      status: "draft" as const,
      teachingGoals: learningGoal,
      duration: parseInt(hours) || 0,
      knowledgePoints: kpForCheck,
      resources: resForCheck,
      quizzes: quizzesForCheck,
      homeworks: [],
    }
  }, [courseName, hours, learningGoal, knowledgePoints, selectedResourceIds, resourcePool, selectedEvalMethods, courseType])

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/granular">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  返回列表
                </Button>
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">
                {isEdit ? "编辑颗粒课" : "新建颗粒课"}
                {courseName && <span className="text-gray-400 font-normal ml-2">- {courseName}</span>}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.success("颗粒课草稿已保存")}>
                <Save className="h-4 w-4" />
                保存草稿
              </Button>
              <Button size="sm" className="gap-1 bg-[#1890ff] hover:bg-[#40a9ff]" onClick={() => toast.success("颗粒课已提交审核")}>
                <Send className="h-4 w-4" />
                提交
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* ========== Two-column layout: center content + right publish check ========== */}
        <div className="grid grid-cols-[1fr_260px] gap-6">

          {/* Center: Content modules */}
          <main className="space-y-5 min-w-0">
            {/* Module 1: Basic Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#1890ff]" />
                  基本信息配置
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">课程名称</Label>
                    <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="请输入课程名称" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">课程编码</Label>
                    <Input value={courseCode} disabled className="h-9 text-sm bg-gray-50 text-gray-500" />
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
                        <button
                          key={star}
                          onClick={() => setDifficulty(star)}
                          className="p-1 transition-colors"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= difficulty
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-200"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-gray-400 ml-2">
                        {difficulty > 0 ? `${difficulty} 星` : "请选择难度"}
                      </span>
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
                  onUpload={(r) => setResourcePool((prev) => [...prev, r])}
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
                  isGranular={true}
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
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Label className="text-xs text-gray-500 shrink-0">及格分数线</Label>
                  <Input
                    type="number"
                    value={passScore}
                    onChange={(e) => setPassScore(e.target.value)}
                    className="w-20 h-8 text-sm"
                  />
                  <span className="text-xs text-gray-400">分</span>
                </div>
              </CardContent>
            </Card>

            {/* Bottom spacer */}
            <div className="h-12" />
          </main>

          {/* Right: Publish Check Panel */}
          <PublishCheckPanel node={currentCheckNode} />
        </div>
      </div>
    </div>
  )
}

export default function AddGranularPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center text-gray-400">加载中...</div>}>
      <AddGranularPageInner />
    </Suspense>
  )
}
