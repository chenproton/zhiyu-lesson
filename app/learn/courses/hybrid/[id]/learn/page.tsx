"use client"

import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  ArrowLeft, PlayCircle, FileText, CheckCircle2, Circle, MessageCircle,
  Users, MonitorPlay, Calendar, BookOpen, ClipboardList, FolderOpen,
  HelpCircle, Wrench, BookMarked, Upload, ChevronDown, ChevronRight,
  Clock, Target, Layers, PenTool, Lightbulb, BarChart3, Zap
} from "lucide-react"
import { hybridCourses } from "@/lib/mock-data"

/* ======================== Mock Data ======================== */

interface ModuleItem {
  key: string
  label: string
  phase: "pre-class" | "in-class" | "post-class"
  icon: React.ComponentType<{ className?: string }>
  done: boolean
}

interface LearningUnit {
  id: string
  name: string
  phase: "pre-class" | "in-class" | "post-class"
  phaseLabel: string
  mode: "online" | "offline"
  week: number
  progress: number
  design: string
  review: string
  items: ModuleItem[]
}

const LEARNING_UNITS: LearningUnit[] = [
  {
    id: "s1", name: "第一周：课程导论与环境搭建", phase: "pre-class", phaseLabel: "课前", mode: "online", week: 1, progress: 100,
    design: "**教学重点**\n- 前端技术栈全景介绍\n- 开发环境搭建（VSCode + Node.js + Git）\n\n**教学难点**\n- 理解前后端分离架构\n- Git工作流概念理解\n\n**教学方法**\n在线预习视频 + 课堂讲解 + 实操演示",
    review: "本节课顺利完成课程导论与开发环境搭建。学生整体对前端技术栈有了初步了解，90%的学生成功完成环境搭建。个别学生对Git操作不熟练，下次课需加强练习。",
    items: [
      { key: "prePreview", label: "课前预习", phase: "pre-class", icon: BookOpen, done: true },
      { key: "preResources", label: "学习资源", phase: "pre-class", icon: FolderOpen, done: true },
      { key: "preTasks", label: "课前任务", phase: "pre-class", icon: ClipboardList, done: true },
    ],
  },
  {
    id: "s2", name: "第二周：HTML5与CSS3核心", phase: "in-class", phaseLabel: "课中", mode: "offline", week: 2, progress: 85,
    design: "**教学重点**\n- HTML5语义化标签\n- CSS3 Flexbox/Grid布局\n- 响应式设计原理\n\n**教学难点**\n- Grid布局的网格线概念\n- 媒体查询与移动端适配",
    review: "课堂互动积极，学生掌握了Flexbox布局核心属性。Grid布局部分需要更多练习。随堂测验平均分82分，整体情况良好。",
    items: [
      { key: "preQuizzes", label: "课前测验", phase: "pre-class", icon: HelpCircle, done: true },
      { key: "lecture", label: "课堂讲授", phase: "in-class", icon: MonitorPlay, done: true },
      { key: "inClassTasks", label: "课堂任务", phase: "in-class", icon: ClipboardList, done: false },
      { key: "inClassQuizzes", label: "随堂测验", phase: "in-class", icon: CheckCircle2, done: true },
      { key: "classQuestions", label: "课堂提问", phase: "in-class", icon: MessageCircle, done: true },
      { key: "practiceTasks", label: "实践任务", phase: "in-class", icon: Wrench, done: false },
    ],
  },
  {
    id: "s3", name: "第三周：JavaScript基础", phase: "post-class", phaseLabel: "课后", mode: "online", week: 3, progress: 65,
    design: "**教学重点**\n- JS变量、数据类型与运算\n- 函数、作用域与闭包\n- DOM操作与事件处理\n\n**教学难点**\n- 闭包的理解与应用\n- 事件委托机制",
    review: "JavaScript基础讲授完成。闭包概念对部分学生仍较难理解，建议下次课前再发布一个针对性预习视频。",
    items: [
      { key: "homeworks", label: "课后作业", phase: "post-class", icon: FileText, done: false },
      { key: "extensionMaterials", label: "拓展资料", phase: "post-class", icon: BookMarked, done: true },
      { key: "trainingReports", label: "实训报告", phase: "post-class", icon: ClipboardList, done: false },
    ],
  },
  {
    id: "s4", name: "第四周：JavaScript进阶", phase: "pre-class", phaseLabel: "课前", mode: "online", week: 4, progress: 40,
    design: "**教学重点**\n- ES6+新特性（箭头函数、解构、模板字符串）\n- 异步编程（Promise、async/await）\n- 模块化编程",
    review: "",
    items: [
      { key: "prePreview", label: "课前预习", phase: "pre-class", icon: BookOpen, done: false },
      { key: "preResources", label: "学习资源", phase: "pre-class", icon: FolderOpen, done: true },
      { key: "preTasks", label: "课前任务", phase: "pre-class", icon: ClipboardList, done: false },
    ],
  },
  {
    id: "s5", name: "第五周：React框架入门", phase: "in-class", phaseLabel: "课中", mode: "offline", week: 5, progress: 20,
    design: "**教学重点**\n- React核心概念与JSX\n- 组件Props与State管理\n- Hooks（useState, useEffect）",
    review: "",
    items: [
      { key: "preQuizzes", label: "课前测验", phase: "pre-class", icon: HelpCircle, done: false },
      { key: "lecture", label: "课堂讲授", phase: "in-class", icon: MonitorPlay, done: false },
      { key: "inClassTasks", label: "课堂任务", phase: "in-class", icon: ClipboardList, done: false },
    ],
  },
]

/* ===================== Activity Content Data ===================== */

const ACTIVITY_CONTENT: Record<string, { preview?: string; resources?: { name: string; type: string; size: string }[]; tasks?: { name: string; requirement: string }[]; quizzes?: { id: string; type: string; stem: string; options?: string[]; answer: string }[]; lecture?: string; questions?: { stem: string; answer: string }[]; homeworks?: { requirement: string; deadline: string }[]; materials?: { name: string; type: string; source: string }[]; reports?: { name: string; template: string; required: boolean }[] }> = {
  "s1-prePreview": {
    preview: "### 课前预习：前端技术栈总览\n\n本节预习将帮助你了解前端开发的核心技术栈体系，为后续课程奠定基础。\n\n**预习内容**\n\n1. 观看课程导论视频（15分钟左右），了解课程整体安排\n2. 理解前端发展历程：从静态网页到现代SPA应用\n3. 初步了解 HTML、CSS、JavaScript 三者之间的职责分工\n4. 认识前端工程化开发流程\n\n**核心概念**\n\n- **HTML（超文本标记语言）**：负责网页的结构和内容\n- **CSS（层叠样式表）**：负责网页的样式和布局\n- **JavaScript**：负责网页的交互和动态功能\n\n**预习要求**\n\n完成视频观看后，尝试回答以下问题：\n- 前端三大核心技术各自负责什么？\n- 什么是前后端分离？有什么优势？",
  },
  "s1-preResources": {
    resources: [
      { name: "前端开发环境搭建指南.pdf", type: "PDF", size: "2.3MB" },
      { name: "Node.js 安装与配置教程（视频）", type: "视频", size: "35min" },
      { name: "Git 基础操作快速入门", type: "链接", size: "在线文档" },
      { name: "VSCode 高效开发插件推荐", type: "文章", size: "在线" },
    ],
  },
  "s1-preTasks": {
    tasks: [
      { name: "安装 Node.js LTS 版本", requirement: "访问 nodejs.org 下载并安装 LTS 版本（建议 v22.x），安装完成后在终端执行 `node -v` 和 `npm -v` 验证安装成功。" },
      { name: "配置 Git 环境", requirement: "安装 Git，配置全局用户名和邮箱：`git config --global user.name '你的姓名'` 和 `git config --global user.email '你的邮箱'`。" },
      { name: "克隆课程仓库", requirement: "在终端中执行 `git clone [课程仓库地址]`，将课程代码克隆到本地。完成后进入仓库目录确认文件结构。" },
    ],
  },
  "s2-preQuizzes": {
    quizzes: [
      { id: "pq1", type: "single", stem: "HTML5新增的语义化标签不包括以下哪个？", options: ["<header>", "<nav>", "<section>", "<container>"], answer: "<container>" },
      { id: "pq2", type: "single", stem: "CSS中以下哪个属性用于设置盒子模型？", options: ["box-sizing", "box-model", "box-shadow", "box-style"], answer: "box-sizing" },
      { id: "pq3", type: "single", stem: "Flexbox中，justify-content: center 的作用是？", options: ["主轴居中", "交叉轴居中", "水平拉伸", "垂直居中"], answer: "主轴居中" },
      { id: "pq4", type: "judge", stem: "HTML5中，<div>标签是语义化标签。", answer: "错误" },
      { id: "pq5", type: "judge", stem: "CSS Grid 布局可以同时处理行和列的布局。", answer: "正确" },
      { id: "pq6", type: "multiple", stem: "以下哪些是CSS3新特性？", options: ["圆角（border-radius）", "阴影（box-shadow）", "弹性盒（Flexbox）", "表格布局（table）"], answer: "圆角（border-radius）,阴影（box-shadow）,弹性盒（Flexbox）" },
    ],
  },
  "s2-lecture": {
    lecture: "### 课堂讲授：HTML5语义化与CSS3布局\n\n#### 一、HTML5语义化标签\n\nHTML5 新增了许多语义化标签，让页面结构更加清晰易读：\n\n| 标签 | 用途 |\n|------|------|\n| `<header>` | 页面或区域的头部 |\n| `<nav>` | 导航链接区域 |\n| `<main>` | 页面主体内容 |\n| `<article>` | 独立的文章内容 |\n| `<section>` | 文档中的节或段落 |\n| `<aside>` | 侧边栏或附加内容 |\n| `<footer>` | 页面或区域的底部 |\n\n使用语义化标签的好处：\n- SEO 友好：搜索引擎能更好地理解页面结构\n- 无障碍访问：屏幕阅读器能准确解析内容\n- 代码可读性高：开发者一眼就能看懂页面布局\n\n#### 二、CSS3 Flexbox 弹性布局\n\n**核心概念**\n\nFlexbox 是一种一维布局模型，通过**容器**和**子项**两个层面来控制布局。\n\n**容器属性**\n- `display: flex` / `inline-flex`：创建弹性容器\n- `flex-direction`：设置主轴方向（row / column）\n- `justify-content`：主轴对齐方式\n- `align-items`：交叉轴对齐方式\n- `flex-wrap`：是否允许换行\n- `gap`：子项之间的间距\n\n**子项属性**\n- `flex`：flex-grow、flex-shrink、flex-basis 的简写\n- `align-self`：单个子项的对齐方式\n- `order`：排列顺序\n\n**常见布局场景**\n- 导航栏：`justify-content: space-between`\n- 居中对齐：`justify-content: center; align-items: center`\n- 自适应列：`flex: 1`\n\n#### 三、CSS Grid 网格布局\n\nGrid 是一种二维布局模型，同时控制行和列。适用于页面整体布局和复杂网格场景。\n\n**核心概念**\n- 网格容器：`display: grid`\n- 网格线：分隔行和列的线\n- 网格轨道：行或列\n- 网格单元格：行和列交叉的区域\n- `grid-template-columns`：定义列\n- `grid-template-rows`：定义行\n- `fr` 单位：弹性单位，按比例分配剩余空间\n\n**Flexbox vs Grid 选择**\n- Flexbox：适合一维布局（导航栏、列表、工具栏）\n- Grid：适合二维布局（页面布局、卡片网格、表单布局）",
  },
  "s2-inClassTasks": {
    tasks: [
      { name: "Flexbox导航栏练习", requirement: "使用Flexbox实现一个水平导航栏，包含Logo（左对齐）、导航菜单（居中）、用户头像（右对齐）。要求：使用语义化HTML标签，CSS使用Flexbox实现。" },
      { name: "Grid卡片布局", requirement: "使用CSS Grid实现一个响应式卡片布局。要求：桌面端4列，平板端2列，移动端1列。每个卡片包含图片、标题、描述、操作按钮。" },
    ],
  },
  "s2-inClassQuizzes": {
    quizzes: [
      { id: "iq1", type: "single", stem: "Flexbox中，设置主轴方向为垂直应该使用？", options: ["flex-direction: row", "flex-direction: column", "flex-wrap: wrap", "align-items: center"], answer: "flex-direction: column" },
      { id: "iq2", type: "single", stem: "Grid布局中，fr单位的含义是？", options: ["固定像素值", "百分比", "按比例分配剩余空间", "相对em单位"], answer: "按比例分配剩余空间" },
      { id: "iq3", type: "single", stem: "以下哪个CSS属性用于Grid的响应式列定义？", options: ["grid-template-areas", "grid-auto-flow", "repeat(auto-fill, minmax())", "grid-gap"], answer: "repeat(auto-fill, minmax())" },
      { id: "iq4", type: "judge", stem: "Flexbox和Grid可以混合使用，在Grid容器内的元素可以同时设为Flex容器。", answer: "正确" },
      { id: "iq5", type: "multiple", stem: "以下哪些是媒体查询的正确写法？", options: ["@media (max-width: 768px)", "@media screen and (min-width: 1024px)", "@media (width > 500px)", "@media all"], answer: "@media (max-width: 768px),@media screen and (min-width: 1024px)" },
    ],
  },
  "s2-classQuestions": {
    questions: [
      { stem: "Flexbox和Grid布局分别适用于什么场景？", answer: "Flexbox适用于一维线性布局（如导航栏、工具栏、列表），强调单行或单列的弹性分配；Grid适用于二维网格布局（如页面整体布局、卡片阵列），同时控制行和列。" },
      { stem: "什么是BFC（块级格式化上下文）？如何创建BFC？", answer: "BFC是一个独立的渲染区域，内部元素的布局不会影响外部元素。创建方式：overflow: hidden/auto/scroll, display: flow-root, float, position: absolute/fixed等。" },
      { stem: "CSS选择器的优先级是如何计算的？", answer: "!important > 内联样式(1000) > ID选择器(100) > 类/属性/伪类(10) > 元素/伪元素(1)。权重是叠加的，但不会进位。" },
    ],
  },
  "s2-practiceTasks": {
    tasks: [
      { name: "仿写京东首页静态布局", requirement: "使用HTML5语义化标签 + CSS3 Flexbox/Grid搭配，仿写京东商城首页。要求：1) 包含顶部搜索栏、主导航、轮播图区域、分类导航、商品列表、底部信息；2) 适配PC端（>1200px）和移动端（<768px）两种屏幕；3) 使用合适的语义化标签。" },
    ],
  },
  "s3-homeworks": {
    homeworks: [
      { requirement: "**Todo List 应用开发**\n\n使用 HTML + CSS + 原生 JavaScript 实现一个 Todo List 应用，要求如下：\n\n1. **添加任务**：输入框 + 添加按钮，支持回车添加\n2. **完成任务**：点击任务文字切换完成/未完成状态（添加删除线样式）\n3. **删除任务**：每个任务有删除按钮\n4. **任务统计**：显示\"已完成 N / 全部 M\"的统计信息\n5. **数据持久化**：使用 localStorage 存储任务数据\n6. **代码规范**：使用语义化HTML、模块化JS代码\n\n**提交格式**：将 HTML/CSS/JS 代码打包为 .zip 文件上传\n\n**评分标准**：功能完整性(40%) + 代码质量(30%) + UI美观度(20%) + 额外功能(10%)", deadline: "2026-07-15 23:59" },
    ],
  },
  "s3-extensionMaterials": {
    materials: [
      { name: "MDN Web Docs - JavaScript 高级教程", type: "链接", source: "https://developer.mozilla.org" },
      { name: "You Don't Know JS 系列书籍（中文版）", type: "PDF", source: "GitHub 开源" },
      { name: "JavaScript设计模式与开发实践", type: "PDF", source: "图书馆电子资源" },
      { name: "CodeWars 编程挑战平台", type: "链接", source: "https://codewars.com" },
    ],
  },
  "s3-trainingReports": {
    reports: [
      { name: "DOM操作实训报告", template: "## 实训目的\n\n## 实训内容\n\n## 实验步骤与代码\n\n## 实验结果截图\n\n## 遇到的问题及解决方案\n\n## 心得体会", required: true },
    ],
  },
  "s4-prePreview": {
    preview: "### 课前预习：ES6+新特性\n\n#### 一、箭头函数\n\n箭头函数是ES6引入的更简洁的函数写法：\n\n```javascript\n// 传统函数\nconst add = function(a, b) { return a + b; };\n\n// 箭头函数\nconst add = (a, b) => a + b;\n```\n\n**特点**：\n- 没有自己的 `this`，继承外层作用域的 `this`\n- 不能用作构造函数\n- 没有 `arguments` 对象\n\n#### 二、解构赋值\n\n```javascript\n// 数组解构\nconst [a, b, ...rest] = [1, 2, 3, 4, 5];\n\n// 对象解构\nconst { name, age, address: addr } = person;\n```\n\n#### 三、模板字符串\n\n```javascript\nconst name = '张三';\nconst greeting = `你好，${name}！欢迎学习前端课程。`;\n```\n\n#### 四、Promise 与 async/await\n\nPromise 是异步编程的解决方案：\n\n```javascript\n// Promise 链式调用\nfetch('/api/data')\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));\n\n// async/await 语法\nasync function loadData() {\n  try {\n    const res = await fetch('/api/data');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n}\n```",
  },
  "s4-preResources": {
    resources: [
      { name: "ES6 标准入门（阮一峰 著）", type: "链接", size: "在线" },
      { name: "JavaScript Promise 迷你书", type: "PDF", size: "1.8MB" },
      { name: "Understanding ECMAScript 6", type: "PDF", size: "4.2MB" },
    ],
  },
  "s4-preTasks": {
    tasks: [
      { name: "箭头函数转换练习", requirement: "将以下传统函数改写为箭头函数形式，并对比两者的区别。完成后截图提交。" },
      { name: "Promise 编程练习", requirement: "使用 Promise + fetch 获取 JSON 数据，实现数据加载、错误处理、加载状态显示。提交代码截图。" },
    ],
  },
  "s5-preQuizzes": {
    quizzes: [
      { id: "pq5-1", type: "single", stem: "React中，以下哪个Hook用于在函数组件中管理状态？", options: ["useEffect", "useState", "useContext", "useReducer"], answer: "useState" },
      { id: "pq5-2", type: "single", stem: "JSX中，以下哪个是正确的注释写法？", options: ["// 注释", "{/* 注释 */}", "<!-- 注释 -->", "/* 注释 */"], answer: "{/* 注释 */}" },
      { id: "pq5-3", type: "judge", stem: "React组件必须以大写字母开头。", answer: "正确" },
    ],
  },
  "s5-lecture": {
    lecture: "### 课堂讲授：React核心概念\n\n#### 一、React是什么\n\nReact 是 Facebook 开源的用于构建用户界面的 JavaScript 库。核心特点：\n- **声明式**：描述UI应该是什么样子，React负责更新DOM\n- **组件化**：将UI拆分为独立、可复用的组件\n- **虚拟DOM**：通过虚拟DOM实现高效的DOM更新\n\n#### 二、JSX 语法\n\nJSX 是 JavaScript 的语法扩展，让你可以在JS中写类HTML代码：\n\n```jsx\nconst element = <h1>Hello, {name}!</h1>;\n```\n\n**JSX 规则**：\n- 必须有且只有一个根元素（或用Fragment `<></>`）\n- 使用 `{}` 嵌入 JavaScript 表达式\n- 属性名使用驼峰命名（className, onClick）\n- 自闭合标签必须以 `/` 结尾\n\n#### 三、组件与Props\n\n```jsx\n// 函数组件\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\n// 使用组件\n<Welcome name=\"张三\" />\n```\n\nProps 是只读的，组件不能修改自己的 props。\n\n#### 四、State与Hooks\n\n**useState**：在函数组件中添加状态\n\n```jsx\nconst [count, setCount] = useState(0);\n```\n\n**useEffect**：处理副作用（数据获取、订阅、DOM操作）\n\n```jsx\nuseEffect(() => {\n  document.title = `点击了 ${count} 次`;\n  return () => { /* 清理函数 */ };\n}, [count]); // 依赖数组\n```",
  },
  "s5-inClassTasks": {
    tasks: [
      { name: "React计数器组件", requirement: "使用 create-react-app 或 Vite 创建一个React项目，实现一个计数器组件。要求：1) 显示当前计数值 2) 点击\"+\"按钮增加 3) 点击\"-\"按钮减少 4) 点击\"重置\"恢复为0 5) 使用 useState Hook。" },
    ],
  },
}

/* ======================== Sub Components ======================== */

function QuizWidget({ quizKey }: { quizKey: string }) {
  const content = ACTIVITY_CONTENT[quizKey]
  const quizzes = content?.quizzes || []
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  const handleSelect = (qId: string, value: string) => {
    if (showResults) return
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const handleToggleMultiple = (qId: string, opt: string) => {
    if (showResults) return
    setAnswers((prev) => {
      const current = (prev[qId] || "").split(",").filter(Boolean)
      const idx = current.indexOf(opt)
      if (idx >= 0) current.splice(idx, 1)
      else current.push(opt)
      return { ...prev, [qId]: current.sort().join(",") }
    })
  }

  const handleSubmit = () => {
    const s = quizzes.reduce((sum, q) => {
      const user = answers[q.id] || ""
      return sum + (user === q.answer ? 1 : 0)
    }, 0)
    setScore(s)
    setShowResults(true)
  }

  if (quizzes.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">暂未配置测验题目</p>
  }

  return (
    <div className="space-y-4">
      {quizzes.map((q, qi) => {
        const result = showResults ? ((answers[q.id] || "") === q.answer ? "correct" : "wrong") : null
        const typeLabel = q.type === "single" ? "单选" : q.type === "multiple" ? "多选" : "判断"

        return (
          <div key={q.id} className={`p-3 rounded-lg border ${result === "correct" ? "border-green-200 bg-green-50/30" : result === "wrong" ? "border-red-200 bg-red-50/30" : "border-gray-100"}`}>
            <div className="flex items-start gap-2 mb-2">
              <span className="px-1.5 py-0.5 rounded bg-[#1890ff] text-white text-xs font-semibold shrink-0">{qi + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{q.stem}</p>
                <Badge variant="secondary" className="text-[10px] mt-1">{typeLabel}</Badge>
              </div>
            </div>
            <div className="ml-7 space-y-1.5">
              {(q.options || ["正确", "错误"]).map((opt) => {
                const isSelected = q.type === "multiple"
                  ? (answers[q.id] || "").split(",").includes(opt)
                  : answers[q.id] === opt
                const isCorrectAnswer = q.answer.split(",").includes(opt)
                let cls = "border-gray-200 hover:border-gray-300"
                if (isSelected && !showResults) cls = "border-[#1890ff] bg-blue-50"
                if (showResults && isCorrectAnswer) cls = "border-green-500 bg-green-50"
                if (showResults && isSelected && !isCorrectAnswer) cls = "border-red-500 bg-red-50"

                return (
                  <button
                    key={opt}
                    disabled={showResults}
                    onClick={() => q.type === "multiple" ? handleToggleMultiple(q.id, opt) : handleSelect(q.id, opt)}
                    className={`flex items-center gap-2 w-full p-2 rounded border text-left text-xs transition-colors ${cls}`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-[#1890ff] bg-[#1890ff]" : "border-gray-300"}`}>
                      {isSelected && <span className="text-white text-[10px] leading-none">✓</span>}
                    </span>
                    {opt}
                    {showResults && isCorrectAnswer && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-auto" />}
                    {showResults && isSelected && !isCorrectAnswer && <span className="text-red-500 text-xs ml-auto">✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {showResults ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">得分：{score}/{quizzes.length}</span>
            <Badge variant={(score ?? 0) >= quizzes.length * 0.6 ? "default" : "destructive"}>
              {(score ?? 0) >= quizzes.length * 0.6 ? "通过" : "未通过"}
            </Badge>
          </div>
        ) : (
          <span className="text-xs text-gray-400">已答 {Object.keys(answers).length}/{quizzes.length} 题</span>
        )}
        <div className="flex gap-2">
          {showResults && (
            <Button size="sm" variant="outline" onClick={() => { setShowResults(false); setAnswers({}); setScore(null); }}>
              重新作答
            </Button>
          )}
          <Button size="sm" onClick={handleSubmit} disabled={showResults || Object.keys(answers).length === 0}>
            提交
          </Button>
        </div>
      </div>
    </div>
  )
}

function ActivityContent({ unitId, item }: { unitId: string; item: ModuleItem }) {
  const key = `${unitId}-${item.key}`
  const content = ACTIVITY_CONTENT[key]

  if (!content) {
    return (
      <div className="text-center py-8 text-gray-400">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">该活动暂未配置内容</p>
        <p className="text-xs mt-1">教师可在后台 /admin/hybrid/add 中编辑</p>
      </div>
    )
  }

  switch (item.key) {
    case "prePreview":
      return <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">{content.preview}</div>

    case "preResources":
    case "extensionMaterials":
      return (
        <div className="grid grid-cols-1 gap-2">
          {(content.resources || content.materials || []).map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-[#1890ff] transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{r.name}</p>
                <p className="text-xs text-gray-400">{(r as any).size || (r as any).source}</p>
              </div>
              <Badge variant="secondary" className="text-[10px]">{(r as any).type || "资源"}</Badge>
            </div>
          ))}
        </div>
      )

    case "preTasks":
    case "inClassTasks":
    case "practiceTasks":
      return (
        <div className="space-y-3">
          {(content.tasks || []).map((t, i) => (
            <div key={i} className="p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1890ff] text-white text-xs flex items-center justify-center font-medium shrink-0">{i + 1}</span>
                <span className="text-sm font-medium text-gray-700">{t.name}</span>
              </div>
              <p className="text-xs text-gray-500 ml-7 whitespace-pre-line leading-relaxed">{t.requirement}</p>
            </div>
          ))}
        </div>
      )

    case "preQuizzes":
    case "inClassQuizzes":
      return <QuizWidget quizKey={key} />

    case "lecture":
      return <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">{content.lecture}</div>

    case "classQuestions":
      return (
        <div className="space-y-3">
          {(content.questions || []).map((q, i) => (
            <div key={i} className="p-3 rounded-lg border border-gray-100">
              <div className="flex items-start gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-gray-700">{q.stem}</p>
              </div>
              <div className="ml-6 p-2 rounded bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500"><span className="font-medium text-[#1890ff]">参考答案：</span>{q.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )

    case "homeworks":
      return (
        <div className="space-y-3">
          {(content.homeworks || []).map((h, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">课后作业 {i + 1}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-[10px]">截止：{h.deadline}</Badge>
                </div>
              </div>
              <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed mb-3">{h.requirement}</div>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" onClick={() => toast("上传功能（演示）")}>
                  <Upload className="w-3.5 h-3.5 mr-1" /> 提交作业
                </Button>
                <span className="text-xs text-gray-400">支持 .zip, .pdf, .docx 格式</span>
              </div>
            </div>
          ))}
        </div>
      )

    case "trainingReports":
      return (
        <div className="space-y-3">
          {(content.reports || []).map((r, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">{r.name}</span>
                  {r.required && <Badge variant="outline" className="text-[10px] border-red-200 text-red-500">必修</Badge>}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 mb-3">
                <p className="text-xs text-gray-500 font-medium mb-1">报告模板：</p>
                <pre className="text-xs text-gray-600 whitespace-pre-line">{r.template}</pre>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast("上传功能（演示）")}>
                <Upload className="w-3.5 h-3.5 mr-1" /> 提交报告
              </Button>
            </div>
          ))}
        </div>
      )

    default:
      return null
  }
}

/* ======================== Main Page ======================== */

export default function HybridCourseLearnPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const course = hybridCourses.find((c) => c.id === params.id)
  const sessionParam = searchParams.get("session")
  const moduleParam = searchParams.get("module")

  const initialUnit = sessionParam
    ? LEARNING_UNITS.find((u) => u.id === sessionParam) || LEARNING_UNITS[0]
    : LEARNING_UNITS[0]

  const [activeUnit, setActiveUnit] = useState<LearningUnit>(initialUnit)
  const [activeModule, setActiveModule] = useState<string | null>(moduleParam || null)

  if (!course) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        未找到该混合课程
      </div>
    )
  }

  const totalProgress = Math.round(LEARNING_UNITS.reduce((sum, u) => sum + u.progress, 0) / LEARNING_UNITS.length)
  const totalItems = LEARNING_UNITS.reduce((sum, u) => sum + u.items.length, 0)
  const doneItems = LEARNING_UNITS.reduce((sum, u) => sum + u.items.filter((i) => i.done).length, 0)

  const phaseMeta: Record<string, { color: string; bg: string }> = {
    "pre-class": { color: "text-blue-600 border-blue-200 bg-blue-50", bg: "bg-blue-50" },
    "in-class": { color: "text-green-600 border-green-200 bg-green-50", bg: "bg-green-50" },
    "post-class": { color: "text-purple-600 border-purple-200 bg-purple-50", bg: "bg-purple-50" },
  }

  const currPhaseMeta = phaseMeta[activeUnit.phase] || phaseMeta["pre-class"]

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/learn/courses/hybrid/${course.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{course.name}</h1>
          <p className="text-sm text-muted-foreground">{course.teacher} · {course.semester}</p>
        </div>
        <div className="w-48">
          <div className="flex justify-between text-xs mb-1">
            <span>总进度</span>
            <span>{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Left sidebar: Session list */}
        <Card className="lg:col-span-1 h-fit sticky top-24">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1890ff]" />
              课程目录
              <span className="text-xs font-normal text-gray-400 ml-auto">{LEARNING_UNITS.length} 次课</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5 max-h-[calc(100vh-300px)] overflow-y-auto">
            {LEARNING_UNITS.map((unit) => (
              <button
                key={unit.id}
                onClick={() => { setActiveUnit(unit); setActiveModule(null); }}
                className={`w-full text-left p-2 rounded-md transition-colors ${
                  activeUnit.id === unit.id
                    ? `${currPhaseMeta.bg} ring-1 ring-[#1890ff]/20`
                    : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-5 h-5 rounded bg-[#1890ff]/10 text-[#1890ff] text-[10px] font-semibold flex items-center justify-center shrink-0">
                      {unit.week}
                    </span>
                    <span className="font-medium text-sm truncate mr-2">
                      {unit.name}
                    </span>
                  </div>
                  <Badge variant={unit.mode === "online" ? "default" : "secondary"} className="text-[10px] px-1.5 h-4 shrink-0">
                    {unit.mode === "online" ? "线上" : "线下"}
                  </Badge>
                </div>
                <Progress value={unit.progress} className="h-1" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Right: Active session content */}
        <div className="lg:col-span-1 space-y-6 min-w-0">
          {/* Session header */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{activeUnit.name}</CardTitle>
                  <Badge variant={activeUnit.mode === "online" ? "default" : "secondary"}>
                    {activeUnit.mode === "online" ? "线上" : "线下"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">进度</span>
                  <Progress value={activeUnit.progress} className="h-2 w-[80px]" />
                  <span className="text-xs font-medium">{activeUnit.progress}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-blue-50">
                  <p className="text-xs text-blue-500">第{activeUnit.week}周</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-green-50">
                  <p className="text-xs text-green-500">{activeUnit.mode === "online" ? "线上教学" : "线下教学"}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-purple-50">
                  <p className="text-xs text-purple-500">{activeUnit.items.filter(i => i.done).length}/{activeUnit.items.length} 已完成</p>
                </div>
              </div>

              {/* Activity modules - rendered as clickable cards */}
              <div className="space-y-2">
                {activeUnit.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeModule === item.key
                  return (
                    <div key={item.key}>
                      <button
                        onClick={() => setActiveModule(isActive ? null : item.key)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          isActive ? "border-[#1890ff] bg-blue-50/50 shadow-sm" :
                          item.done ? "border-green-100 bg-green-50/30" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg ${item.done ? "bg-green-100" : "bg-gray-100"} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${item.done ? "text-green-600" : "text-gray-500"}`} />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                            {item.done && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${phaseMeta[item.phase].color}`}>
                            {item.phase === "pre-class" ? "课前准备" : item.phase === "in-class" ? "教学实施" : "课后拓展"}
                          </span>
                        </div>
                        <Badge variant={item.done ? "default" : "outline"} className={`text-[10px] px-1.5 h-4 ${item.done ? "" : "text-gray-400"}`}>
                          {item.done ? "已完成" : "去学习"}
                        </Badge>
                        {isActive ? <ChevronDown className="w-4 h-4 text-[#1890ff]" /> : <ChevronRight className="w-4 h-4 text-gray-300" />}
                      </button>
                      {isActive && (
                        <div className="mt-2 ml-12 p-4 rounded-lg border border-[#1890ff]/20 bg-white shadow-sm">
                          <ActivityContent unitId={activeUnit.id} item={item} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Teaching Design */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-500" />
                教学设计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {activeUnit.design}
              </div>
            </CardContent>
          </Card>

          {/* Post-lesson Review */}
          {activeUnit.review && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-purple-500" />
                  课后复盘
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                  {activeUnit.review}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Learning stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-500" />
                学习数据
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MonitorPlay className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">观看时长</p>
                    <p className="font-bold">12.5h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">作业得分</p>
                    <p className="font-bold">88/100</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">课堂互动</p>
                    <p className="font-bold">15次</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">签到</p>
                    <p className="font-bold">8/10</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
