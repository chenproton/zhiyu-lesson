"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, PlayCircle, FileText, MessageCircle, MonitorPlay, Users, GraduationCap, BarChart3 } from "lucide-react"
import { hybridCourses } from "@/lib/mock-data"
import { COURSE_STATUS_LABELS, COURSE_TYPE_LABELS } from "@/lib/types"

export default function HybridCourseDetailPage() {
  const params = useParams()
  const course = hybridCourses.find((c) => c.id === params.id)

  if (!course) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        未找到该混合课程
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/learn">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{COURSE_TYPE_LABELS[course.type]}</Badge>
            <Badge>{COURSE_STATUS_LABELS[course.status]}</Badge>
          </div>
          <h1 className="text-2xl font-bold mt-1">{course.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/learn/courses/hybrid/${course.id}/learn`}>
            <PlayCircle className="h-4 w-4 mr-1" /> 进入学习
          </Link>
        </Button>
      </div>

      <div className={`h-48 rounded-xl bg-gradient-to-br ${course.coverColor} flex items-center justify-center text-white`}>
        <div className="text-center">
          <h2 className="text-3xl font-bold">{course.name}</h2>
          <p className="mt-2 opacity-90">{course.major} · {course.teacher}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MonitorPlay className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">线上学时</p>
                <p className="text-xl font-bold">{course.onlineHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">线下学时</p>
                <p className="text-xl font-bold">{course.offlineHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">学习人数</p>
                <p className="text-xl font-bold">{course.studyCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">成绩权重</p>
                <p className="text-xl font-bold">{course.onlineWeight}/{course.offlineWeight}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="intro" className="space-y-4">
        <TabsList>
          <TabsTrigger value="intro"><BookOpen className="h-4 w-4 mr-1" /> 课程介绍</TabsTrigger>
          <TabsTrigger value="outline"><FileText className="h-4 w-4 mr-1" /> 教学大纲</TabsTrigger>
          <TabsTrigger value="discuss"><MessageCircle className="h-4 w-4 mr-1" /> 讨论答疑</TabsTrigger>
        </TabsList>

        <TabsContent value="intro">
          <Card>
            <CardHeader>
              <CardTitle>课程简介</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                本课程为线上线下混合式课程，融合传统混合式教学理念与数字课程资源，形成“课前线上自主学习 + 课中线下智慧课堂 + 课后线上作业测验 + 期末过程性考核归档”的完整教学闭环。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-medium">课程信息</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>课程编码：{course.code}</p>
                    <p>授课教师：{course.teacher}</p>
                    <p>上课学期：{course.semester}</p>
                    <p>上课班级：{course.className}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">考核方式</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>线上成绩：{course.onlineWeight}%（观看时长、作业、测验）</p>
                    <p>线下成绩：{course.offlineWeight}%（签到、课堂互动、项目实践）</p>
                    <p>总评：线上 + 线下加权汇总</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outline">
          <Card>
            <CardHeader>
              <CardTitle>教学安排</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { phase: "课前", mode: "线上", content: "发布预习微课、电子讲义、课前小测，学生提前完成，平台自动统计预习数据。" },
                { phase: "课中", mode: "线下", content: "教室上课签到、随堂答题、课堂互动、项目实训。" },
                { phase: "课后", mode: "线上", content: "线上布置作业、单元测试、讨论题，AI自动批改客观题，全过程留学习数据。" },
                { phase: "期末", mode: "综合", content: "平台自动汇总观看时长、作业得分、课堂表现，生成过程性考核成绩。" },
              ].map((item) => (
                <div key={item.phase} className="flex gap-4 border-b last:border-0 pb-4 last:pb-0">
                  <div className="w-16 shrink-0">
                    <Badge variant={item.mode === "线上" ? "default" : item.mode === "线下" ? "secondary" : "outline"}>
                      {item.phase}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">{item.mode}教学</p>
                    <p className="text-sm text-muted-foreground">{item.content}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discuss">
          <Card>
            <CardContent className="pt-6 text-center py-16 text-muted-foreground">
              <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>讨论答疑区（演示）</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
