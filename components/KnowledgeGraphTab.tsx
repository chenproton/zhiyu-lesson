"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Maximize2, X, BrainCircuit } from "lucide-react"
import * as d3 from "d3"
import { courses } from "@/lib/mock-data"

export interface KgNode {
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

export default function KnowledgeGraphTab({ course, showSidebar = true }: {
  course: { name: string; code: string; id: string }
  showSidebar?: boolean
}) {
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

  const relatedCourses = courses.filter(c => c.id !== course.id).slice(0, 3)

  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.3)
  }
  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.75)
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
      <div className={`flex ${showSidebar ? "h-[600px]" : "h-[480px]"}`}>
        <div ref={canvasRef} className="flex-1 relative bg-[#fdfdff] overflow-hidden min-w-0 rounded-l-xl">
          <svg ref={svgRef} className="w-full h-full" />
          <div className="absolute top-3.5 right-3.5 bg-white/95 border border-[#f5f5f4] rounded-lg p-2.5 shadow-sm text-xs z-10">
            <div className="font-semibold text-[#64748b] mb-1.5 text-[11px]">图例</div>
            <div className="flex items-center gap-1.5 mb-1"><span className="w-2.5 h-2.5 rounded-full bg-[#722ed1] shrink-0" /><span>课程核心</span></div>
            <div className="flex items-center gap-1.5 mb-1"><span className="w-2.5 h-2.5 rounded-full bg-[#52c41a] shrink-0" /><span>章节 (可点击)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" /><span>知识点 (可点击)</span></div>
          </div>
          <div className="absolute top-3.5 left-3.5 flex gap-1 z-10">
            <button onClick={handleZoomIn} className="w-7 h-7 border border-[#e0e0e0] rounded bg-white/95 flex items-center justify-center text-[#64748b] hover:bg-[#eff6ff] hover:text-[#2563eb] hover:border-[#2563eb] transition-colors"><Plus className="w-3 h-3" /></button>
            <button onClick={handleZoomOut} className="w-7 h-7 border border-[#e0e0e0] rounded bg-white/95 flex items-center justify-center text-[#64748b] hover:bg-[#eff6ff] hover:text-[#2563eb] hover:border-[#2563eb] transition-colors"><Minus className="w-3 h-3" /></button>
            <button onClick={handleReset} className="w-7 h-7 border border-[#e0e0e0] rounded bg-white/95 flex items-center justify-center text-[#64748b] hover:bg-[#eff6ff] hover:text-[#2563eb] hover:border-[#2563eb] transition-colors"><Maximize2 className="w-3 h-3" /></button>
          </div>
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 bg-black/55 text-white text-[11px] px-3 py-1 rounded-full pointer-events-none whitespace-nowrap">
            拖拽节点 · 滚轮缩放 · 点击章节与知识点查看详情
          </div>
          <div ref={tooltipRef} className="absolute bg-black/75 text-white text-xs px-2.5 py-1.5 rounded-md pointer-events-none hidden z-[100] max-w-[220px] leading-relaxed" />
        </div>
        {showSidebar && (
          <div className="w-[260px] shrink-0 bg-white border-l border-[#f5f5f4] overflow-y-auto p-4 flex flex-col gap-3 rounded-r-xl">
            <div className="text-sm font-semibold text-[#1f2937] flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#3b82f6]" />相关课程
            </div>
            {relatedCourses.map(c => (
              <Link key={c.id} href={`/learn/courses/system/${c.id}`} className="flex items-center gap-3 p-3 border border-[#f5f5f4] rounded-lg hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:shadow-sm transition-all">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.coverColor || "from-blue-500 to-blue-700"} flex items-center justify-center text-white text-lg shrink-0`}>{c.courseTag?.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#1f2937] truncate">{c.name}</div>
                  <div className="text-xs text-[#64748b] leading-relaxed">{c.industry}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
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
              <button onClick={() => setModalOpen(false)} className="text-[#94a3b8] hover:text-[#1f2937] transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 overflow-y-auto">
              {modalData.type === "ability" ? (
                <>
                  <div className="text-sm text-[#1f2937] mb-3 font-semibold">能力详情介绍：</div>
                  <p className="text-sm text-[#64748b] leading-relaxed">该能力要求掌握<b> {modalData.name} </b>的核心原理，设计高可用、高复用性的解决方案。能够独立排查并解决业务边界问题。</p>
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
                  <p className="text-sm text-[#64748b] leading-relaxed"><b>{modalData.name}</b> 是构建该领域核心能力不可或缺的基础知识环节，深入理解其逻辑有助于编写更高性能的代码架构。</p>
                  <div className="font-semibold text-[#1f2937] mt-4 mb-2 text-sm">推荐学习资源</div>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 p-2.5 bg-[#fafafa] border border-[#f5f5f4] rounded-lg cursor-pointer hover:border-[#3b82f6] hover:bg-[#eff6ff] transition-all">
                      <span className="text-xl text-[#ff4d4f]">▶</span>
                      <div className="flex-1"><div className="text-[13px] font-medium text-[#1f2937]">深入剖析 {modalData.name} 原理</div><div className="text-[11px] text-[#94a3b8]">视频教程 · 45分钟</div></div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 bg-[#fafafa] border border-[#f5f5f4] rounded-lg cursor-pointer hover:border-[#3b82f6] hover:bg-[#eff6ff] transition-all">
                      <span className="text-xl text-[#3b82f6]">📄</span>
                      <div className="flex-1"><div className="text-[13px] font-medium text-[#1f2937]">{modalData.name} 最佳实践.pdf</div><div className="text-[11px] text-[#94a3b8]">内部核心讲义 · 12页</div></div>
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
