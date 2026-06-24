"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"

export default function NewTemplatePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [type, setType] = useState("混合式")
  const [tags, setTags] = useState("")
  const [description, setDescription] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/templates">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> 返回</Button>
          </Link>
          <h1 className="text-2xl font-semibold">新建课程模板</h1>
        </div>
        <Button onClick={() => router.push("/admin/templates")}><Save className="h-4 w-4 mr-1" /> 保存模板</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">模板信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>模板名称</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入模板名称" />
            </div>
            <div className="space-y-2">
              <Label>课程类型</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["混合式", "纯在线", "纯线下"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>标签（用逗号分隔）</Label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="例如：专业核心, 优秀课程" />
          </div>
          <div className="space-y-2">
            <Label>模板说明</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="请输入模板说明..." />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
