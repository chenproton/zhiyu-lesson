"use client"

import { useState } from "react"
import { Lightbulb, Plus, Search, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { KnowledgePointItem } from "@/lib/mock-data"

interface KnowledgeSelectorProps {
  selected: KnowledgePointItem[]
  pool: KnowledgePointItem[]
  onChange?: (selected: KnowledgePointItem[]) => void
  onAddCustom?: (name: string, description?: string) => void
}

export function KnowledgeSelector({ selected, pool, onChange, onAddCustom }: KnowledgeSelectorProps) {
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newKpName, setNewKpName] = useState("")
  const [newKpDesc, setNewKpDesc] = useState("")

  const filtered = pool.filter(
    (kp) =>
      !selected.find((s) => s.id === kp.id) &&
      (!search || kp.name.includes(search) || (kp.code && kp.code.includes(search)) || (kp.description && kp.description.includes(search)))
  )

  const toggle = (kp: KnowledgePointItem) => {
    const exists = selected.find((s) => s.id === kp.id)
    if (exists) {
      onChange?.(selected.filter((s) => s.id !== kp.id))
    } else {
      onChange?.([...selected, { ...kp, linked: true }])
    }
  }

  const handleAddCustom = () => {
    if (!newKpName.trim()) return
    onAddCustom?.(newKpName.trim(), newKpDesc.trim())
    setNewKpName("")
    setNewKpDesc("")
    setIsAddDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((kp) => (
            <Badge
              key={kp.id}
              variant="secondary"
              className="px-2.5 py-1 text-xs font-normal bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer"
            >
              {kp.name}
              <button
                className="ml-1 text-indigo-400 hover:text-indigo-700"
                onClick={() => toggle(kp)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add button + dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full border-dashed">
            <Plus className="mr-2 h-4 w-4" />
            添加知识点
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>添加知识点</DialogTitle>
            <DialogDescription>从知识库中选择或新建知识点</DialogDescription>
          </DialogHeader>

          <div className="flex gap-4 h-[400px]">
            {/* Left: search results */}
            <div className="w-3/5 flex flex-col min-h-0 border rounded-xl p-3">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索知识点名称、描述或编码..."
                  className="pl-9"
                />
              </div>
              <div className="flex-1 overflow-y-auto pr-1">
                {!search && filtered.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">请输入关键词搜索知识点</p>
                  </div>
                )}
                {search && filtered.length === 0 && (
                  <div className="p-6 text-center text-gray-500 text-sm border border-dashed rounded-lg">
                    <p className="mb-2">未找到 &quot;{search}&quot; 相关的知识点</p>
                    <Button variant="outline" size="sm" onClick={() => { setNewKpName(search); setIsAddDialogOpen(true); }}>
                      <Plus className="h-3 w-3 mr-1" />新增此知识点
                    </Button>
                  </div>
                )}
                {filtered.length > 0 && (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">知识点名称</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">编码</th>
                        <th className="text-right text-xs font-medium text-gray-500 px-3 py-2">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtered.map((kp) => {
                        const isSelected = !!selected.find((s) => s.id === kp.id)
                        return (
                          <tr key={kp.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-2">
                              <span className="text-sm font-medium text-gray-800">{kp.name}</span>
                              {kp.description && (
                                <p className="text-xs text-gray-400 line-clamp-1">{kp.description}</p>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {kp.code ? (
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5">{kp.code}</Badge>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex items-center justify-end gap-1">
                                {isSelected ? (
                                  <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => toggle(kp)}>
                                    取消
                                  </Button>
                                ) : (
                                  <Button size="sm" className="h-6 text-[11px] px-2" onClick={() => toggle(kp)}>
                                    选择
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Right: selected */}
            <div className="w-2/5 border rounded-xl p-3 flex flex-col min-h-0">
              <p className="text-sm font-medium mb-3 text-gray-700">已选择知识点 ({selected.length})</p>
              <div className="flex-1 overflow-y-auto">
                {selected.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">从左侧搜索并选择知识点</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {selected.map((kp) => (
                      <div
                        key={kp.id}
                        className="p-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors relative"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-medium flex-1 truncate">{kp.name}</span>
                          <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 -mr-1 -mt-1" onClick={() => toggle(kp)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        {kp.description && (
                          <p className="text-[11px] text-gray-500 line-clamp-1">{kp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add custom knowledge dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>新增知识点</DialogTitle>
            <DialogDescription>创建一个新的知识点</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>知识点名称</Label>
              <Input
                value={newKpName}
                onChange={(e) => setNewKpName(e.target.value)}
                placeholder="输入知识点名称"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>描述</Label>
              <Textarea
                value={newKpDesc}
                onChange={(e) => setNewKpDesc(e.target.value)}
                placeholder="输入知识点描述"
                className="mt-1.5"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>取消</Button>
            <Button onClick={handleAddCustom} disabled={!newKpName.trim()}>添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
