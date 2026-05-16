"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  CircleDot,
  Radio,
  GraduationCap,
  MonitorPlay,
  Users,
  Hand,
  Dices,
  ClipboardCheck,
  LogOut,
  FileText,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

import KnowledgeEditor from "./_components/KnowledgeEditor"
import ResourceUploader from "./_components/ResourceUploader"
import QuizHomeworkPanel from "./_components/QuizHomeworkPanel"
import PublishCheckPanel from "./_components/PublishCheckPanel"

export default function AddGranularPage() {
  const [mode, setMode] = useState<"prep" | "teach" | "learn">("prep")
  const [courseName, setCourseName] = useState("假设检验")
  const [courseCode, setCourseCode] = useState("STAT-101")

  const checkItems = [
    { label: "课程名称", completed: courseName.length > 0 },
    { label: "课程编码", completed: courseCode.length > 0 },
    { label: "学习目标", completed: true },
    { label: "涉及知识点", completed: true },
    { label: "课程资源", completed: true },
    { label: "随堂测验", completed: true },
    { label: "课后作业", completed: false },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/granular">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  返回列表
                </Button>
              </Link>
              <h1 className="text-2xl font-semibold">{courseName || "新建颗粒课"}</h1>
              {courseCode && (
                <Badge variant="outline" className="text-xs font-normal text-gray-500">
                  {courseCode}
                </Badge>
              )}
            </div>

            {/* 三态切换 */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setMode("prep")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    mode === "prep"
                      ? "bg-white text-[#1890ff] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <CircleDot className="w-3 h-3" />
                  备课态
                </button>
                <button
                  onClick={() => setMode("teach")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    mode === "teach"
                      ? "bg-white text-red-500 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Radio className="w-3 h-3" />
                  教师上课态
                </button>
                <button
                  onClick={() => setMode("learn")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    mode === "learn"
                      ? "bg-white text-green-500 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <GraduationCap className="w-3 h-3" />
                  学生学习态
                </button>
              </div>

              {mode === "prep" && (
                <div className="flex items-center gap-2 ml-3">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Save className="w-4 h-4" />
                    保存
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="w-4 h-4" />
                    预览
                  </Button>
                  <Button size="sm" className="gap-1 bg-[#1890ff] hover:bg-[#40a9ff]">
                    <Send className="w-4 h-4" />
                    提交
                  </Button>
                </div>
              )}
              {mode === "teach" && (
                <Button size="sm" variant="destructive" className="gap-1 ml-3">
                  <LogOut className="w-4 h-4" />
                  下课
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1440px] mx-auto px-6 py-5">
        {mode === "prep" && (
          <div className="flex gap-5">
            {/* Left */}
            <div className="w-[280px] shrink-0 space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#1890ff]" />
                    基本信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">课程名称</Label>
                    <Input
                      size="sm"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">课程编码</Label>
                    <Input
                      size="sm"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">所属行业</Label>
                    <Select defaultValue="software">
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="software">软件测试工程师</SelectItem>
                        <SelectItem value="electronic">电子信息</SelectItem>
                        <SelectItem value="finance">金融</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">所属专业</Label>
                    <Select defaultValue="major01">
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="major01">岗位优化测试专业01</SelectItem>
                        <SelectItem value="major02">岗位优化测试专业02</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">预计课时</Label>
                    <Input type="number" defaultValue="2" className="h-8 text-sm" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">课程资源</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResourceUploader />
                </CardContent>
              </Card>
            </div>

            {/* Center */}
            <div className="flex-1 min-w-0 space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">知识图谱</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <KnowledgeEditor />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">导学教案</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Textarea
                    placeholder="请输入课前备课内容..."
                    rows={5}
                    className="text-sm resize-y"
                    defaultValue="本节课将介绍SQL注入的基本原理、常见分类及防御方法。通过理论讲解与实操演示相结合的方式，帮助学生掌握SQL注入漏洞的检测与利用技术。"
                  />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">学习目标</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Textarea
                    placeholder="请输入学习目标..."
                    rows={3}
                    className="text-sm resize-y"
                    defaultValue="1. 理解SQL注入的基本原理\n2. 掌握常见的SQL注入分类（联合查询、报错注入、盲注等）\n3. 学会使用SQLMap进行自动化注入检测"
                  />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">测验与作业</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <QuizHomeworkPanel />
                </CardContent>
              </Card>
            </div>

            {/* Right */}
            <div className="w-[240px] shrink-0 space-y-4">
              <Card className="border-0 shadow-sm sticky top-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">发布检查</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <PublishCheckPanel items={checkItems} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {mode === "teach" && (
          <div className="flex gap-5 h-[calc(100vh-160px)]">
            {/* Left: Slide list */}
            <Card className="w-[260px] border-0 shadow-sm flex flex-col shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  课件列表
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto pt-0 space-y-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button
                    key={i}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      i === 3 ? "bg-red-50 text-red-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    第 {i + 1} 页
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Center: Presentation */}
            <Card className="flex-1 border-0 shadow-sm flex flex-col min-h-0">
              <CardContent className="flex-1 p-0 flex flex-col">
                <div className="flex-1 bg-slate-800 flex items-center justify-center relative">
                  <div className="text-center text-white p-8">
                    <MonitorPlay className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                    <p className="text-lg font-medium">{courseName}</p>
                    <p className="text-sm text-slate-400 mt-2">第 4 / 8 页</p>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur rounded-full px-4 py-2">
                    <button className="text-white/80 hover:text-white text-xs">◀ 上一页</button>
                    <span className="text-white/30">|</span>
                    <button className="text-white/80 hover:text-white text-xs">下一页 ▶</button>
                    <span className="text-white/30">|</span>
                    <button className="text-white/80 hover:text-white text-xs">批注</button>
                    <span className="text-white/30">|</span>
                    <button className="text-white/80 hover:text-white text-xs">聚焦</button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 p-4 bg-white border-t">
                  <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <ClipboardCheck className="w-5 h-5 text-cyan-500" />
                    <span className="text-xs text-gray-700">签到</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="text-xs text-gray-700">一键下发测验</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <Hand className="w-5 h-5 text-purple-500" />
                    <span className="text-xs text-gray-700">举手/抢答</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <Dices className="w-5 h-5 text-orange-500" />
                    <span className="text-xs text-gray-700">随机点名</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Right: Students */}
            <Card className="w-[240px] border-0 shadow-sm flex flex-col shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  学生状态
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto pt-0 space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-green-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-700">李明</span>
                  </div>
                  <span className="text-xs text-green-600">在线</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-green-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-700">王芳</span>
                  </div>
                  <span className="text-xs text-green-600">专注</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-orange-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-sm text-gray-700">张伟</span>
                  </div>
                  <span className="text-xs text-orange-600">挂机</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-300" />
                    <span className="text-sm text-gray-400">刘洋</span>
                  </div>
                  <span className="text-xs text-gray-400">缺席</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {mode === "learn" && (
          <div className="flex gap-5 h-[calc(100vh-160px)]">
            {/* Left: Course content */}
            <Card className="flex-1 border-0 shadow-sm flex flex-col min-h-0">
              <CardContent className="flex-1 p-0 flex flex-col">
                <div className="flex-1 bg-white flex items-center justify-center relative p-8">
                  <div className="max-w-2xl w-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{courseName}</h2>
                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <MonitorPlay className="w-12 h-12 text-slate-300" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      本节课正在学习{courseName}的相关内容。学生端将同步显示教师课件，并支持在线答题、笔记记录等功能。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Observation panel */}
            <Card className="w-[320px] border-0 shadow-sm flex flex-col shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-500" />
                  学生学习观察
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto pt-0 space-y-4">
                {/* Overview */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-green-50">
                    <p className="text-lg font-bold text-green-600">24</p>
                    <p className="text-[10px] text-green-700">在线</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-blue-50">
                    <p className="text-lg font-bold text-blue-600">18</p>
                    <p className="text-[10px] text-blue-700">专注</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-orange-50">
                    <p className="text-lg font-bold text-orange-600">3</p>
                    <p className="text-[10px] text-orange-700">挂机</p>
                  </div>
                </div>

                {/* Quiz progress */}
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">随堂测验进度</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">答题人数</span>
                      <span className="text-gray-700">20/24</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "83%" }} />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">平均得分</span>
                      <span className="text-gray-700 font-medium">78分</span>
                    </div>
                  </div>
                </div>

                {/* Student list */}
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">学生答题情况</h4>
                  <div className="space-y-1.5">
                    {[
                      { name: "李明", status: "已完成", score: 95, color: "green" },
                      { name: "王芳", status: "已完成", score: 88, color: "green" },
                      { name: "赵强", status: "已完成", score: 82, color: "green" },
                      { name: "孙丽", status: "答题中", score: 0, color: "blue" },
                      { name: "周杰", status: "答题中", score: 0, color: "blue" },
                      { name: "张伟", status: "未开始", score: 0, color: "gray" },
                    ].map((s) => (
                      <div key={s.name} className="flex items-center justify-between p-2 rounded bg-gray-50/50">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            s.color === "green" ? "bg-green-500" : s.color === "blue" ? "bg-blue-500" : "bg-gray-300"
                          }`} />
                          <span className="text-sm text-gray-700">{s.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">{s.status}</span>
                          {s.score > 0 && <span className="text-xs font-medium text-green-600">{s.score}分</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
