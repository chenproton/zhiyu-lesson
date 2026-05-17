"use client"

import {
  CheckCircle2,
  FileQuestion,
  Gavel,
  ClipboardList,
  Database,
  MessageSquare,
  PenTool,
  Presentation,
  Bot,
  FolderCheck,
  Wrench,
  Users,
  UserCheck,
  BookOpen,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface EvalMethodOption {
  key: string
  label: string
  icon: React.ReactNode
  color: string
  available: boolean
  desc: string
  category: string
}

interface EvaluationMethodSelectorProps {
  selectedKeys: string[]
  onChange: (keys: string[]) => void
}

const evaluationMethodOptions: EvalMethodOption[] = [
  { key: "random_draw", label: "现场问答", icon: <FileQuestion className="h-5 w-5" />, color: "bg-blue-50 text-blue-600 border-blue-200", available: true, desc: "从题库抽取题目，教师现场提问", category: "综合评估" },
  { key: "review", label: "现场评审", icon: <Gavel className="h-5 w-5" />, color: "bg-purple-50 text-purple-600 border-purple-200", available: true, desc: "教师根据表现/材料给评价点打分", category: "综合评估" },
  { key: "paper", label: "试卷", icon: <ClipboardList className="h-5 w-5" />, color: "bg-green-50 text-green-600 border-green-200", available: true, desc: "使用固定试卷进行考核", category: "基础考核" },
  { key: "question_bank", label: "题库", icon: <Database className="h-5 w-5" />, color: "bg-orange-50 text-orange-600 border-orange-200", available: true, desc: "从题库选题组成测评资源", category: "基础考核" },
  { key: "defense", label: "答辩", icon: <MessageSquare className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "学生进行现场答辩", category: "互动评价" },
  { key: "debate", label: "辩论", icon: <PenTool className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "学生分组进行辩论", category: "互动评价" },
  { key: "presentation", label: "汇报", icon: <Presentation className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "学生进行成果汇报", category: "互动评价" },
  { key: "quiz", label: "随堂测", icon: <FileQuestion className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "课堂即时测验", category: "基础考核" },
  { key: "ai_qa", label: "Ai 问答", icon: <Bot className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "AI 自动问答评测", category: "智能评测" },
  { key: "outcome", label: "成果评价", icon: <FolderCheck className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "对学生成果进行评价", category: "综合评估" },
  { key: "practical", label: "现场实操", icon: <Wrench className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "现场操作技能考核", category: "互动评价" },
  { key: "roleplay", label: "角色扮演", icon: <Users className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "模拟场景角色扮演", category: "互动评价" },
  { key: "peer", label: "学生互评", icon: <UserCheck className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "学生之间互相评价", category: "综合评估" },
]

const categoryBgColors: Record<string, string> = {
  "基础考核": "bg-blue-50/50",
  "综合评估": "bg-purple-50/50",
  "互动评价": "bg-amber-50/50",
  "智能评测": "bg-cyan-50/50",
}

export function EvaluationMethodSelector({ selectedKeys, onChange }: EvaluationMethodSelectorProps) {
  const toggleMethod = (key: string) => {
    const opts = evaluationMethodOptions.find((o) => o.key === key)
    if (!opts || !opts.available) return
    const enabled = selectedKeys.includes(key)
    onChange(enabled ? selectedKeys.filter((m) => m !== key) : [...selectedKeys, key])
  }

  const categories = Array.from(new Set(evaluationMethodOptions.map((m) => m.category)))

  return (
    <div className="space-y-5">
      {categories.map((cat) => {
        const catMethods = evaluationMethodOptions.filter((m) => m.category === cat)
        const bgClass = categoryBgColors[cat] || "bg-gray-50/50"
        return (
          <div key={cat} className={cn("rounded-xl p-3.5 border", bgClass, "border-gray-100")}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-gray-800">{cat}</h3>
              <div className="h-px flex-1 bg-gray-200/60" />
              <span className="text-xs text-gray-400">{catMethods.length} 种</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {catMethods.map((method) => {
                const enabled = selectedKeys.includes(method.key)
                return (
                  <button
                    key={method.key}
                    disabled={!method.available}
                    onClick={() => toggleMethod(method.key)}
                    className={cn(
                      "p-2.5 rounded-lg border text-left transition-all flex flex-col gap-1.5 relative overflow-hidden",
                      !method.available
                        ? "opacity-50 cursor-not-allowed bg-white border-gray-200"
                        : enabled
                          ? "border-primary bg-white ring-1 ring-primary/20 shadow-sm"
                          : "border-gray-200 hover:border-primary/40 bg-white hover:shadow-sm"
                    )}
                  >
                    {!method.available && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <span className="text-xl font-bold text-gray-300/60 rotate-[-12deg] select-none border-2 border-gray-300/40 px-3 py-1 rounded">未开通</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2.5">
                        <div className={cn("p-2 rounded-lg", method.available ? method.color : "bg-gray-100 text-gray-400")}>{method.icon}</div>
                        <div>
                          <p className={cn("text-sm font-semibold", !method.available && "text-gray-400")}>{method.label}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{method.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {method.available && (
                          <span
                            className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); window.open(`/wiki/eval-method?key=${method.key}`, "_blank") }}
                            title="查看介绍"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                          </span>
                        )}
                        {enabled && (
                          <div className="flex items-center gap-1.5 text-primary text-xs font-medium bg-primary/5 px-2 py-1 rounded-full">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            已开通
                          </div>
                        )}
                        {!method.available && (
                          <Badge variant="outline" className="text-[10px] text-gray-400 border-gray-300 bg-white">未开通</Badge>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
      {selectedKeys.length === 0 && (
        <div className="p-12 text-center text-gray-400 border border-dashed rounded-xl">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">请选择至少一种评价方式</p>
        </div>
      )}
    </div>
  )
}
