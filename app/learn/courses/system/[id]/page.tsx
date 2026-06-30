"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen, Clock, FileText, FolderOpen, List,
  PlayCircle, Target, User, BrainCircuit, ClipboardList, Lightbulb,
  ChevronDown, ChevronRight, Plus, Minus, Maximize2, X,
} from "lucide-react"
import * as d3 from "d3"
import { courses } from "@/lib/mock-data"

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

/* ---------- knowledge graph component ---------- */

interface KgNode {
  id: string
  name: string
  type: "core" | "ability" | "knowledge"
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  type: "core" | "ability" | "knowledge"
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode
  target: string | SimNode
}

function KnowledgeGraphTab({ course }: { course: { name: string; code: string } }) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const initRef = useRef(false)
  const simRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, any> | null>(null)
  const containerRef = useRef<d3.Selection<SVGGElement, any, null, undefined> | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<KgNode | null>(null)

  useEffect(() => {
    if (initRef.current || !canvasRef.current || !svgRef.current) return
    initRef.current = true

    const area = canvasRef.current!
    const svgEl = d3.select(svgRef.current!)
    const W = area.clientWidth
    const H = area.clientHeight

    svgEl.attr("width", W).attr("height", H)

    const zoom = d3.zoom<SVGSVGElement, any>()
      .scaleExtent([0.2, 4])
      .on("zoom", (ev) => containerRef.current?.attr("transform", ev.transform))
    svgEl.call(zoom)
    zoomRef.current = zoom

    const container = svgEl.append("g")
    containerRef.current = container

    const nodes: SimNode[] = [
      { id: "core", name: course.name, type: "core" } as SimNode,
      { id: "a01", name: "SQL注入原理", type: "ability" } as SimNode,
      { id: "a02", name: "漏洞检测方法", type: "ability" } as SimNode,
      { id: "a03", name: "渗透测试技术", type: "ability" } as SimNode,
      { id: "a04", name: "安全防护策略", type: "ability" } as SimNode,
      { id: "a05", name: "代码审计能力", type: "ability" } as SimNode,
      { id: "a06", name: "数据库安全", type: "ability" } as SimNode,
      { id: "a07", name: "Web安全基础", type: "ability" } as SimNode,
      { id: "a08", name: "工具链应用", type: "ability" } as SimNode,
      { id: "a09", name: "漏洞利用分析", type: "ability" } as SimNode,
      { id: "a10", name: "报告撰写规范", type: "ability" } as SimNode,
      { id: "a11", name: "应急响应能力", type: "ability" } as SimNode,
      { id: "a12", name: "合规与标准", type: "ability" } as SimNode,
    ]

    const links: SimLink[] = []
    nodes.filter(n => n.type === "ability").forEach(n => {
      links.push({ source: "core", target: n.id })
    })

    const kMap: Record<string, string[]> = {
      a01: ["SQL语法基础", "注入类型分类", "盲注技术", "报错注入"],
      a02: ["黑盒测试", "白盒审计", "自动化扫描", "手工探测"],
      a03: ["信息收集", "漏洞扫描", "权限提升", "横向移动"],
      a04: ["输入过滤", "参数化查询", "WAF配置", "最小权限原则"],
      a05: ["源码分析", "静态扫描", "动态调试", "逆向工程"],
      a06: ["数据库加固", "加密存储", "访问控制", "审计日志"],
      a07: ["HTTP协议", "同源策略", "XSS防御", "CSRF防护"],
      a08: ["Burp Suite", "SQLMap", "Nmap", "Metasploit"],
      a09: ["漏洞复现", "POC编写", "EXP开发", "影响评估"],
      a10: ["技术写作", "风险评估", "修复建议", "漏洞评级"],
      a11: ["事件响应", "溯源分析", "取证技术", "通报流程"],
      a12: ["等保2.0", "GDPR", "OWASP Top10", "CVE标准"],
    }

    let kid = 1
    Object.entries(kMap).forEach(([abId, kns]) => {
      kns.forEach(kName => {
        const id = "k" + kid++
        nodes.push({ id, name: kName, type: "knowledge" } as SimNode)
        links.push({ source: abId, target: id })
      })
    })

    const typeR: Record<string, number> = { core: 40, ability: 18, knowledge: 9 }
    const typeColor: Record<string, string> = { core: "#722ed1", ability: "#52c41a", knowledge: "#f59e0b" }
    const typeFont: Record<string, number> = { core: 15, ability: 12, knowledge: 10 }

    const simNodes: SimNode[] = nodes.map(n => ({ ...n }))
    const simLinks: SimLink[] = links.map(l => ({ ...l }))

    const linkG = container.append("g")
      .selectAll("path")
      .data(simLinks)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", "#c8d8f0")
      .attr("stroke-width", d => ((d as any).source as SimNode).type === "core" ? 2 : 1)
      .attr("opacity", 0.5)

    const nodeG = container.append("g")
      .selectAll("g")
      .data(simNodes)
      .join("g")
      .style("cursor", "pointer")
      .call((d3.drag() as any)
        .on("start", (ev: any, d: any) => {
          if (!ev.active) simRef.current?.alphaTarget(0.3).restart()
          d.fx = d.x; d.fy = d.y
        })
        .on("drag", (ev: any, d: any) => { d.fx = ev.x; d.fy = ev.y })
        .on("end", (ev: any, d: any) => {
          if (!ev.active) simRef.current?.alphaTarget(0)
          d.fx = undefined; d.fy = undefined
        })
      )

    nodeG.append("circle")
      .attr("r", d => typeR[d.type])
      .attr("fill", d => typeColor[d.type])
      .attr("stroke", "#fff")
      .attr("stroke-width", d => d.type === "core" ? 3 : 1.5)

    nodeG.append("text")
      .attr("dy", d => typeR[d.type] + 14)
      .attr("text-anchor", "middle")
      .attr("font-size", d => typeFont[d.type])
      .attr("fill", "#333")
      .attr("font-weight", d => d.type === "core" ? "600" : "400")
      .attr("pointer-events", "none")
      .text(d => d.name)

    nodeG.on("click", (ev, d: any) => {
      if (d.type !== "core") {
        setModalData(d)
        setModalOpen(true)
      }
    })

    const tooltip = tooltipRef.current
    nodeG.on("mouseover", (ev, d: any) => {
      if (!tooltip) return
      tooltip.style.display = "block"
      const label = d.type === "core" ? "核心课程" : d.type === "ability" ? "章节" : "知识点"
      tooltip.innerHTML = `<strong>${d.name}</strong><br><span style="font-size:10px;opacity:0.8;">${label}</span>`
    }).on("mousemove", (ev) => {
      if (!tooltip) return
      const rect = area.getBoundingClientRect()
      tooltip.style.left = (ev.clientX - rect.left + 15) + "px"
      tooltip.style.top = (ev.clientY - rect.top - 35) + "px"
    }).on("mouseout", () => { if (tooltip) tooltip.style.display = "none" })

    const sim = d3.forceSimulation<SimNode, SimLink>(simNodes)
      .force("link", d3.forceLink<SimNode, SimLink>(simLinks).id(d => d.id).distance(d => ((d.source as any) as SimNode).type === "core" ? 180 : 80))
      .force("charge", d3.forceManyBody<SimNode>().strength(d => d.type === "core" ? -1600 : d.type === "ability" ? -400 : -80))
      .force("center", d3.forceCenter(W / 2, H / 2))
      .on("tick", () => {
        linkG.attr("d", (d: any) => {
          const sx = d.source.x, sy = d.source.y, tx = d.target.x, ty = d.target.y
          const mx = (sx + tx) / 2, my = (sy + ty) / 2
          const dx = tx - sx, dy = ty - sy
          return `M${sx},${sy} Q${mx - dy * 0.1},${my + dx * 0.1} ${tx},${ty}`
        })
        nodeG.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      })
    simRef.current = sim

    const handleResize = () => {
      const w = area.clientWidth, h = area.clientHeight
      svgEl.attr("width", w).attr("height", h)
      sim.force("center", d3.forceCenter(w / 2, h / 2)).alpha(0.3).restart()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      sim.stop()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const relatedCourses = courses.filter(c => c.id !== "1").slice(0, 3)

  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.3)
    }
  }
  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.75)
    }
  }
  const handleReset = () => {
    if (svgRef.current && zoomRef.current) {
      const svgEl = d3.select(svgRef.current)
      const w = canvasRef.current?.clientWidth || 800
      const h = canvasRef.current?.clientHeight || 560
      svgEl.transition().duration(600).call(zoomRef.current.transform, d3.zoomIdentity.translate(w / 2, h / 2).scale(0.7).translate(-w / 2, -h / 2))
    }
  }

  return (
    <>
      <div className="flex h-[600px]">
        <div ref={canvasRef} className="flex-1 relative bg-[#fdfdff] overflow-hidden min-w-0">
          <svg ref={svgRef} className="w-full h-full" />
          <div className="absolute top-3.5 right-3.5 bg-white/95 border border-[#f5f5f4] rounded-lg p-2.5 shadow-sm text-xs z-10">
            <div className="font-semibold text-[#64748b] mb-1.5 text-[11px]">图例</div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#722ed1] shrink-0" />
              <span>课程核心</span>
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#52c41a] shrink-0" />
              <span>章节 (可点击)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
              <span>知识点 (可点击)</span>
            </div>
          </div>
          <div className="absolute top-3.5 left-3.5 flex gap-1 z-10">
            <button onClick={handleZoomIn} className="w-7 h-7 border border-[#e0e0e0] rounded bg-white/95 flex items-center justify-center text-[#64748b] hover:bg-[#eff6ff] hover:text-[#2563eb] hover:border-[#2563eb] transition-colors">
              <Plus className="w-3 h-3" />
            </button>
            <button onClick={handleZoomOut} className="w-7 h-7 border border-[#e0e0e0] rounded bg-white/95 flex items-center justify-center text-[#64748b] hover:bg-[#eff6ff] hover:text-[#2563eb] hover:border-[#2563eb] transition-colors">
              <Minus className="w-3 h-3" />
            </button>
            <button onClick={handleReset} className="w-7 h-7 border border-[#e0e0e0] rounded bg-white/95 flex items-center justify-center text-[#64748b] hover:bg-[#eff6ff] hover:text-[#2563eb] hover:border-[#2563eb] transition-colors">
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 bg-black/55 text-white text-[11px] px-3 py-1 rounded-full pointer-events-none whitespace-nowrap">
            拖拽节点 · 滚轮缩放 · 点击章节与知识点查看详情
          </div>
          <div ref={tooltipRef} className="absolute bg-black/75 text-white text-xs px-2.5 py-1.5 rounded-md pointer-events-none hidden z-[100] max-w-[220px] leading-relaxed" />
        </div>
        <div className="w-[260px] shrink-0 bg-white border-l border-[#f5f5f4] overflow-y-auto p-4 flex flex-col gap-3">
          <div className="text-sm font-semibold text-[#1f2937] flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-[#3b82f6]" />
            相关课程
          </div>
          {relatedCourses.map(c => (
            <Link key={c.id} href={`/learn/courses/system/${c.id}`} className="flex items-center gap-3 p-3 border border-[#f5f5f4] rounded-lg hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:shadow-sm transition-all">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.coverColor || "from-blue-500 to-blue-700"} flex items-center justify-center text-white text-lg shrink-0`}>
                {c.courseTag?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#1f2937] truncate">{c.name}</div>
                <div className="text-xs text-[#64748b] leading-relaxed">{c.industry}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {modalOpen && modalData && (
        <div className="fixed inset-0 bg-black/40 z-[2000] flex items-center justify-center" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ width: 440, maxHeight: "80vh" }} onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[#f5f5f4] flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-[#1f2937] flex items-center gap-2">{modalData.name}</div>
                <div className="mt-1">
                  {modalData.type === "ability" ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-xl bg-[#f6ffed] text-[#52c41a] border border-[#b7eb8f]">章节</span>
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-xl bg-[#fff7e6] text-[#f59e0b] border border-[#ffd591]">知识点</span>
                  )}
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-[#94a3b8] hover:text-[#1f2937] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              {modalData.type === "ability" ? (
                <>
                  <div className="text-sm text-[#1f2937] mb-3 font-semibold">能力详情介绍：</div>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    该能力要求掌握<b> {modalData.name} </b>的核心原理，设计高可用、高复用性的解决方案。能够独立排查并解决业务边界问题。
                  </p>
                  <div className="mt-5 p-3 bg-[#f6ffed] rounded-md border border-[#b7eb8f]">
                    <div className="text-[#389e0d] font-semibold mb-1.5 text-sm">胜任要求参考</div>
                    <ul className="pl-4 text-[#555] text-[13px] leading-relaxed space-y-1">
                      <li>能独立主导完成中等复杂度以上的功能模块设计。</li>
                      <li>产出代码符合团队规范与最佳实践指南。</li>
                      <li>具备较强的线上排错与调优能力。</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    <b>{modalData.name}</b> 是构建该领域核心能力不可或缺的基础知识环节，深入理解其逻辑有助于编写更高性能的代码架构。
                  </p>
                  <div className="font-semibold text-[#1f2937] mt-4 mb-2 text-sm">推荐学习资源</div>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 p-2.5 bg-[#fafafa] border border-[#f5f5f4] rounded-lg cursor-pointer hover:border-[#3b82f6] hover:bg-[#eff6ff] transition-all">
                      <span className="text-xl text-[#ff4d4f]">▶</span>
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-[#1f2937]">深入剖析 {modalData.name} 原理</div>
                        <div className="text-[11px] text-[#94a3b8]">视频教程 · 45分钟</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 bg-[#fafafa] border border-[#f5f5f4] rounded-lg cursor-pointer hover:border-[#3b82f6] hover:bg-[#eff6ff] transition-all">
                      <span className="text-xl text-[#3b82f6]">📄</span>
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-[#1f2937]">{modalData.name} 最佳实践.pdf</div>
                        <div className="text-[11px] text-[#94a3b8]">内部核心讲义 · 12页</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="px-5 py-3 border-t border-[#f5f5f4] bg-[#fafafa] flex justify-end">
              <Button size="sm" className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white border-0">查看完整要求</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ---------- page ---------- */

export default function SystemCourseDetailPage() {
  const params = useParams()
  const id = params.id as string
  const course = courses.find((c) => String(c.id) === String(id))
  if (!course) return notFound()

  const [activeTab, setActiveTab] = useState("goal")
  const [selectedNodeId, setSelectedNodeId] = useState("ch1")

  const selectedChapter = COURSE_TREE.find((c) => c.id === selectedNodeId || c.children?.some((s) => s.id === selectedNodeId))
  const selectedSection = selectedChapter?.children?.find((s) => s.id === selectedNodeId)

  const coverLabel = course.category || course.courseTag || "体系课"

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground transition-colors">课程首页</Link>
        <span>/</span>
        <span className="text-foreground">体系课详情</span>
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
              <Link href={`/learn/courses/system/${course.id}/learn`}>
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
          { label: "章节数", value: course.nodeCount },
          { label: "预计课时", value: course.lessonCount },
          { label: "资源数", value: course.resourceCount },
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
              { value: "goal", label: "课程目标", icon: Target },
              { value: "catalog", label: "课程目录", icon: List },
              { value: "resource", label: "课程资源", icon: FolderOpen },
              { value: "knowledge", label: "课程知识点", icon: BrainCircuit },
              { value: "quiz", label: "课程测评", icon: ClipboardList },
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
                <Target className="w-4 h-4 text-[#3b82f6]" />课程目标
              </h3>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {COURSE_OBJECTIVES}
              </div>
            </TabsContent>

            {/* Catalog */}
            <TabsContent value="catalog" className="mt-0">
              <h3 className="text-base font-semibold text-[#1f2937] mb-4">课程目录</h3>
              <TreeView nodes={COURSE_TREE} />
            </TabsContent>

            {/* Resources */}
            <TabsContent value="resource" className="mt-0">
              <div className="flex gap-4">
                <CatalogNav selectedId={selectedNodeId} onSelect={setSelectedNodeId} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[#1f2937] mb-4 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    课程资源
                    <span className="text-xs font-normal text-gray-400">— {selectedSection?.name || selectedChapter?.name || "请选择章节"}</span>
                  </h3>
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
                </div>
              </div>
            </TabsContent>

            {/* Knowledge Graph */}
            <TabsContent value="knowledge" className="mt-0">
              <KnowledgeGraphTab course={course} />
            </TabsContent>

            {/* Quiz */}
            <TabsContent value="quiz" className="mt-0">
              <div className="flex gap-4">
                <CatalogNav selectedId={selectedNodeId} onSelect={setSelectedNodeId} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[#1f2937] mb-4">课程测评</h3>
                  <div className="space-y-4">
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
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
