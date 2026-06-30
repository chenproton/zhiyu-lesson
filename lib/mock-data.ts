import type { Course, CourseStats, AdminCourseStats, SystemCourseNode, QuizQuestion } from './types'

export const courseStats: CourseStats = {
  totalCourses: 28,
  systemCourses: 8,
  granularCourses: 8,
  hybridCourses: 8,
  knowledgePoints: 1342,
}

export const granularCourseStats: AdminCourseStats = {
  total: 8,
  draft: 1,
  pending: 2,
  rejected: 1,
  published: 4,
}

export const systemCourseStats: AdminCourseStats = {
  total: 8,
  draft: 1,
  pending: 1,
  rejected: 1,
  published: 5,
}

export const hybridCourseStats: AdminCourseStats = {
  total: 8,
  draft: 2,
  pending: 2,
  rejected: 0,
  published: 4,
}

export const courses: Course[] = [
  {
    id: '1',
    code: '2048580206462566401',
    name: 'SQL注入漏洞检测与利用',
    type: 'system',
    category: '公共基础课',
    major: '岗位优化测试专业02',
    teacher: '王老师',
    industry: '电子信息',
    version: 'v1',
    updateDate: '2026-04-27',
    nodeCount: 15,
    lessonCount: 30,
    resourceCount: 45,
    viewCount: 4952,
    studyCount: 16882,
    status: 'published',
    coverColor: 'from-blue-800 to-blue-500',
    creator: '杭州知与未来科技有限公司',
    createDate: '2025-12-15',
    coCreator: '知与未来',
    batchGroup: '2026年春季课程',
    courseTag: '体系课',
  },
  {
    id: '2',
    code: '2047126214624739330',
    name: 'API未授权访问漏洞检测与利用',
    type: 'granular',
    category: '数智化通识课',
    major: '岗位优化测试专业01',
    teacher: '马老师',
    industry: '软件测试工程师',
    version: 'v1',
    updateDate: '2026-04-23',
    nodeCount: 1,
    lessonCount: 1,
    resourceCount: 3,
    viewCount: 3166,
    studyCount: 15223,
    status: 'published',
    coverColor: 'from-orange-900 to-red-500',
    creator: '张教授团队',
    createDate: '2026-01-10',
    coCreator: '阿里云大学',
    batchGroup: '2026年秋季课程',
    courseTag: '颗粒课',
  },
  {
    id: '3',
    code: '2048581102063910913',
    name: '渗透测试实验室搭建',
    type: 'system',
    category: '专业基础课',
    major: '岗位优化测试专业02',
    teacher: '李老师',
    industry: '电子信息',
    version: 'v1',
    updateDate: '2026-04-27',
    nodeCount: 10,
    lessonCount: 30,
    resourceCount: 12,
    viewCount: 2522,
    studyCount: 14132,
    status: 'pending',
    coverColor: 'from-emerald-900 to-cyan-500',
    creator: '李主任课题组',
    createDate: '2026-02-20',
    coCreator: '华为ICT学院',
    batchGroup: '2025年冬季集训',
    courseTag: '体系课',
  },
  {
    id: '4',
    code: '2047126930722455554',
    name: '文件上传漏洞检测与利用',
    type: 'granular',
    category: '专业核心课',
    major: '岗位优化测试专业01',
    teacher: '张老师',
    industry: '软件测试工程师',
    version: 'v1',
    updateDate: '2026-04-23',
    nodeCount: 1,
    lessonCount: 1,
    resourceCount: 5,
    viewCount: 1688,
    studyCount: 11320,
    status: 'published',
    coverColor: 'from-slate-700 to-slate-400',
    creator: '王老师工作室',
    createDate: '2026-03-05',
    coCreator: '腾讯云学堂',
    batchGroup: '2026年暑期实训',
    courseTag: '颗粒课',
  },
  {
    id: '5',
    code: '2048580206462566402',
    name: 'XSS跨站脚本攻击原理与防御',
    type: 'system',
    category: '公共基础课',
    major: '软件工程专业',
    teacher: '赵老师',
    industry: '计算机行业',
    version: 'v1',
    updateDate: '2026-04-25',
    nodeCount: 12,
    lessonCount: 24,
    resourceCount: 38,
    viewCount: 3850,
    studyCount: 14200,
    status: 'draft',
    coverColor: 'from-violet-800 to-violet-500',
    creator: '杭州知与未来科技有限公司',
    createDate: '2025-11-01',
    coCreator: '百度AI教育',
    batchGroup: '2026年春季课程',
    courseTag: '体系课',
  },
  {
    id: '6',
    code: '2047126214624739331',
    name: 'CSRF漏洞检测与防护',
    type: 'granular',
    category: '数智化通识课',
    major: '人工智能专业',
    teacher: '刘老师',
    industry: '计算机行业',
    version: 'v1',
    updateDate: '2026-04-22',
    nodeCount: 1,
    lessonCount: 1,
    resourceCount: 4,
    viewCount: 2100,
    studyCount: 9800,
    status: 'draft',
    coverColor: 'from-pink-800 to-pink-500',
    creator: '张教授团队',
    createDate: '2026-04-01',
    coCreator: '知与未来',
    batchGroup: '2026年秋季课程',
    courseTag: '颗粒课',
  },
  {
    id: 'hybrid-1',
    code: 'HYB-SE-2026-001',
    name: 'Web前端开发混合课程',
    type: 'hybrid',
    category: '专业核心课',
    major: '软件工程专业',
    teacher: '周老师',
    industry: '计算机行业',
    version: 'v1.0',
    updateDate: '2026-06-20',
    nodeCount: 8,
    lessonCount: 16,
    resourceCount: 32,
    viewCount: 1200,
    studyCount: 8600,
    status: 'published',
    coverColor: 'from-purple-800 to-indigo-500',
    creator: '李主任课题组',
    createDate: '2025-10-20',
    coCreator: '阿里云大学',
    batchGroup: '2025年冬季集训',
    courseTag: '混合课程',
    onlineHours: 24,
    offlineHours: 24,
    onlineWeight: 40,
    offlineWeight: 60,
    semester: '2026-2027-1',
    className: '软件工程2026级1班',
  },
  {
    id: 'hybrid-2',
    code: 'HYB-SE-2026-002',
    name: '软件测试技术混合课程',
    type: 'hybrid',
    category: '专业核心课',
    major: '软件工程专业',
    teacher: '吴老师',
    industry: '软件测试工程师',
    version: 'v1.0',
    updateDate: '2026-06-18',
    nodeCount: 6,
    lessonCount: 12,
    resourceCount: 28,
    viewCount: 980,
    studyCount: 6200,
    status: 'published',
    coverColor: 'from-indigo-800 to-blue-500',
    creator: '王老师工作室',
    createDate: '2025-12-15',
    coCreator: '华为ICT学院',
    batchGroup: '2026年暑期实训',
    courseTag: '混合课程',
    onlineHours: 16,
    offlineHours: 32,
    onlineWeight: 30,
    offlineWeight: 70,
    semester: '2026-2027-1',
    className: '软件工程2026级2班',
  },
  {
    id: 'hybrid-3',
    code: 'HYB-AI-2026-003',
    name: '机器学习混合课程',
    type: 'hybrid',
    category: '专业核心课',
    major: '人工智能专业',
    teacher: '王老师',
    industry: '计算机行业',
    version: 'v1.0',
    updateDate: '2026-06-15',
    nodeCount: 10,
    lessonCount: 20,
    resourceCount: 36,
    viewCount: 850,
    studyCount: 4800,
    status: 'pending',
    coverColor: 'from-violet-800 to-purple-500',
    creator: '杭州知与未来科技有限公司',
    createDate: '2026-01-10',
    coCreator: '腾讯云学堂',
    batchGroup: '2026年春季课程',
    courseTag: '混合课程',
    onlineHours: 20,
    offlineHours: 28,
    onlineWeight: 35,
    offlineWeight: 65,
    semester: '2026-2027-1',
    className: '人工智能2026级1班',
  },
  {
    id: 'hybrid-4',
    code: 'HYB-CN-2026-004',
    name: '网络安全攻防混合课程',
    type: 'hybrid',
    category: '专业拓展课',
    major: '计算机网络技术专业',
    teacher: '李老师',
    industry: '电子信息',
    version: 'v1.0',
    updateDate: '2026-06-10',
    nodeCount: 7,
    lessonCount: 14,
    resourceCount: 26,
    viewCount: 720,
    studyCount: 3500,
    status: 'draft',
    coverColor: 'from-fuchsia-800 to-pink-500',
    creator: '张教授团队',
    createDate: '2026-02-20',
    coCreator: '百度AI教育',
    batchGroup: '2026年秋季课程',
    courseTag: '混合课程',
    onlineHours: 18,
    offlineHours: 30,
    onlineWeight: 35,
    offlineWeight: 65,
    semester: '2026-2027-1',
    className: '计算机网络技术2026级1班',
  },
  /* ====== Additional System Courses ====== */
  {
    id: '7',
    code: 'SYS-DB-2026-007',
    name: '数据库原理与安全防护',
    type: 'system',
    category: '专业基础课',
    major: '软件工程专业',
    teacher: '陈老师',
    industry: '计算机行业',
    version: 'v1',
    updateDate: '2026-05-10',
    nodeCount: 14,
    lessonCount: 28,
    resourceCount: 35,
    viewCount: 3200,
    studyCount: 12800,
    status: 'published',
    coverColor: 'from-teal-800 to-cyan-600',
    creator: '李主任课题组',
    createDate: '2026-03-05',
    coCreator: '知与未来',
    batchGroup: '2025年冬季集训',
    courseTag: '体系课',
  },
  {
    id: '8',
    code: 'SYS-NET-2026-008',
    name: '网络协议深度解析',
    type: 'system',
    category: '专业核心课',
    major: '计算机网络技术专业',
    teacher: '杨老师',
    industry: '电子信息',
    version: 'v2',
    updateDate: '2026-05-15',
    nodeCount: 11,
    lessonCount: 22,
    resourceCount: 28,
    viewCount: 2800,
    studyCount: 10500,
    status: 'published',
    coverColor: 'from-rose-800 to-pink-600',
    creator: '王老师工作室',
    createDate: '2025-11-01',
    coCreator: '阿里云大学',
    batchGroup: '2026年暑期实训',
    courseTag: '体系课',
  },
  {
    id: '9',
    code: 'SYS-AI-2026-009',
    name: '人工智能算法基础',
    type: 'system',
    category: '专业核心课',
    major: '人工智能专业',
    teacher: '孙老师',
    industry: '计算机行业',
    version: 'v1',
    updateDate: '2026-05-20',
    nodeCount: 18,
    lessonCount: 36,
    resourceCount: 52,
    viewCount: 4100,
    studyCount: 15800,
    status: 'published',
    coverColor: 'from-amber-800 to-orange-500',
    creator: '杭州知与未来科技有限公司',
    createDate: '2026-04-01',
    coCreator: '华为ICT学院',
    batchGroup: '2026年春季课程',
    courseTag: '体系课',
  },
  {
    id: '10',
    code: 'SYS-SEC-2026-010',
    name: '内网渗透与横向移动',
    type: 'system',
    category: '专业拓展课',
    major: '信息安全',
    teacher: '黄老师',
    industry: '互联网/信息安全',
    version: 'v1',
    updateDate: '2026-05-25',
    nodeCount: 13,
    lessonCount: 26,
    resourceCount: 30,
    viewCount: 1950,
    studyCount: 8500,
    status: 'draft',
    coverColor: 'from-stone-800 to-zinc-500',
    creator: '张教授团队',
    createDate: '2025-10-20',
    coCreator: '腾讯云学堂',
    batchGroup: '2026年秋季课程',
    courseTag: '体系课',
  },
  {
    id: '11',
    code: 'SYS-DEV-2026-011',
    name: '微服务架构设计与实践',
    type: 'system',
    category: '专业核心课',
    major: '软件工程专业',
    teacher: '林老师',
    industry: '计算机行业',
    version: 'v1',
    updateDate: '2026-06-01',
    nodeCount: 16,
    lessonCount: 32,
    resourceCount: 40,
    viewCount: 2560,
    studyCount: 9800,
    status: 'pending',
    coverColor: 'from-lime-800 to-green-600',
    creator: '李主任课题组',
    createDate: '2025-12-15',
    coCreator: '百度AI教育',
    batchGroup: '2025年冬季集训',
    courseTag: '体系课',
  },
  /* ====== Additional Granular Courses ====== */
  {
    id: '7g',
    code: 'GRA-RE-2026-007',
    name: '正则表达式从入门到精通',
    type: 'granular',
    category: '专业基础课',
    major: '软件工程专业',
    teacher: '赵老师',
    industry: '计算机行业',
    version: 'v1',
    updateDate: '2026-05-08',
    nodeCount: 1,
    lessonCount: 1,
    resourceCount: 4,
    viewCount: 1800,
    studyCount: 9500,
    status: 'published',
    coverColor: 'from-red-800 to-orange-500',
    creator: '王老师工作室',
    createDate: '2026-01-10',
    coCreator: '知与未来',
    batchGroup: '2026年暑期实训',
    courseTag: '颗粒课',
  },
  {
    id: '8g',
    code: 'GRA-DO-2026-008',
    name: 'Docker容器快速上手',
    type: 'granular',
    category: '专业基础课',
    major: '计算机网络技术专业',
    teacher: '王老师',
    industry: '电子信息',
    version: 'v1',
    updateDate: '2026-05-12',
    nodeCount: 1,
    lessonCount: 1,
    resourceCount: 3,
    viewCount: 2300,
    studyCount: 11200,
    status: 'published',
    coverColor: 'from-blue-800 to-sky-600',
    creator: '杭州知与未来科技有限公司',
    createDate: '2026-02-20',
    coCreator: '阿里云大学',
    batchGroup: '2026年春季课程',
    courseTag: '颗粒课',
  },
  {
    id: '9g',
    code: 'GRA-GI-2026-009',
    name: 'Git版本控制实战',
    type: 'granular',
    category: '公共基础课',
    major: '岗位优化测试专业01',
    teacher: '李老师',
    industry: '软件测试工程师',
    version: 'v1',
    updateDate: '2026-05-18',
    nodeCount: 1,
    lessonCount: 1,
    resourceCount: 5,
    viewCount: 3500,
    studyCount: 18000,
    status: 'published',
    coverColor: 'from-orange-800 to-amber-500',
    creator: '张教授团队',
    createDate: '2026-03-05',
    coCreator: '华为ICT学院',
    batchGroup: '2026年秋季课程',
    courseTag: '颗粒课',
  },
  {
    id: '10g',
    code: 'GRA-LI-2026-010',
    name: 'Linux命令行基础',
    type: 'granular',
    category: '专业基础课',
    major: '人工智能专业',
    teacher: '张老师',
    industry: '计算机行业',
    version: 'v1',
    updateDate: '2026-05-22',
    nodeCount: 1,
    lessonCount: 1,
    resourceCount: 4,
    viewCount: 4100,
    studyCount: 20500,
    status: 'published',
    coverColor: 'from-emerald-800 to-teal-500',
    creator: '李主任课题组',
    createDate: '2025-11-01',
    coCreator: '腾讯云学堂',
    batchGroup: '2025年冬季集训',
    courseTag: '颗粒课',
  },
  {
    id: '11g',
    code: 'GRA-REA-2026-011',
    name: 'React Hooks深入理解',
    type: 'granular',
    category: '专业核心课',
    major: '软件工程专业',
    teacher: '马老师',
    industry: '计算机行业',
    version: 'v1',
    updateDate: '2026-06-05',
    nodeCount: 1,
    lessonCount: 1,
    resourceCount: 3,
    viewCount: 1650,
    studyCount: 7800,
    status: 'pending',
    coverColor: 'from-cyan-800 to-blue-600',
    creator: '王老师工作室',
    createDate: '2026-04-01',
    coCreator: '百度AI教育',
    batchGroup: '2026年暑期实训',
    courseTag: '颗粒课',
  },
  /* ====== Additional Hybrid Courses ====== */
  {
    id: 'hybrid-5',
    code: 'HYB-BI-2026-005',
    name: '大数据分析混合课程',
    type: 'hybrid',
    category: '专业核心课',
    major: '人工智能专业',
    teacher: '陈老师',
    industry: '计算机行业',
    version: 'v1.0',
    updateDate: '2026-06-25',
    nodeCount: 10,
    lessonCount: 20,
    resourceCount: 30,
    viewCount: 680,
    studyCount: 4200,
    status: 'published',
    coverColor: 'from-yellow-700 to-amber-500',
    creator: '杭州知与未来科技有限公司',
    createDate: '2025-10-20',
    coCreator: '知与未来',
    batchGroup: '2026年春季课程',
    courseTag: '混合课程',
    onlineHours: 22,
    offlineHours: 26,
    onlineWeight: 40,
    offlineWeight: 60,
    semester: '2026-2027-1',
    className: '人工智能2026级2班',
  },
  {
    id: 'hybrid-6',
    code: 'HYB-UI-2026-006',
    name: 'UI/UX设计混合课程',
    type: 'hybrid',
    category: '专业拓展课',
    major: '软件工程专业',
    teacher: '林老师',
    industry: '计算机行业',
    version: 'v1.0',
    updateDate: '2026-06-28',
    nodeCount: 8,
    lessonCount: 16,
    resourceCount: 24,
    viewCount: 550,
    studyCount: 3100,
    status: 'published',
    coverColor: 'from-pink-700 to-rose-500',
    creator: '张教授团队',
    createDate: '2025-12-15',
    coCreator: '阿里云大学',
    batchGroup: '2026年秋季课程',
    courseTag: '混合课程',
    onlineHours: 18,
    offlineHours: 30,
    onlineWeight: 35,
    offlineWeight: 65,
    semester: '2026-2027-1',
    className: '软件工程2026级3班',
  },
  {
    id: 'hybrid-7',
    code: 'HYB-DB-2026-007',
    name: '数据库管理与优化混合课程',
    type: 'hybrid',
    category: '专业基础课',
    major: '计算机网络技术专业',
    teacher: '杨老师',
    industry: '电子信息',
    version: 'v1.0',
    updateDate: '2026-07-02',
    nodeCount: 6,
    lessonCount: 12,
    resourceCount: 20,
    viewCount: 480,
    studyCount: 2600,
    status: 'pending',
    coverColor: 'from-slate-700 to-gray-500',
    creator: '李主任课题组',
    createDate: '2026-01-10',
    coCreator: '华为ICT学院',
    batchGroup: '2025年冬季集训',
    courseTag: '混合课程',
    onlineHours: 14,
    offlineHours: 34,
    onlineWeight: 30,
    offlineWeight: 70,
    semester: '2026-2027-1',
    className: '计算机网络技术2026级2班',
  },
  {
    id: 'hybrid-8',
    code: 'HYB-CS-2026-008',
    name: '云计算平台实践混合课程',
    type: 'hybrid',
    category: '专业核心课',
    major: '软件工程专业',
    teacher: '周老师',
    industry: '计算机行业',
    version: 'v1.0',
    updateDate: '2026-07-05',
    nodeCount: 9,
    lessonCount: 18,
    resourceCount: 28,
    viewCount: 420,
    studyCount: 2100,
    status: 'draft',
    coverColor: 'from-sky-700 to-indigo-500',
    creator: '王老师工作室',
    createDate: '2026-02-20',
    coCreator: '腾讯云学堂',
    batchGroup: '2026年暑期实训',
    courseTag: '混合课程',
    onlineHours: 20,
    offlineHours: 28,
    onlineWeight: 35,
    offlineWeight: 65,
    semester: '2026-2027-1',
    className: '软件工程2026级4班',
  },
]

export const granularCourses = courses.filter((c) => c.type === 'granular')
export const systemCourses = courses.filter((c) => c.type === 'system')
export const hybridCourses = courses.filter((c) => c.type === 'hybrid')

// ========== Batch & Approval (from zhiyu-scene) ==========

export interface Batch {
  id: string
  name: string
  code: string
  departmentId: string
  departmentName: string
  professionId?: string
  professionName?: string
  workflowId: string
  workflowName: string
  scenarioCount: number
  createdAt: string
}

export interface ApprovalWorkflow {
  id: string
  name: string
  description: string
  steps: ApprovalStep[]
  createdAt: string
}

export interface ApprovalStep {
  id: string
  order: number
  name: string
  approverRole: string
}

export interface ApprovalItem {
  id: string
  scenarioId: string
  scenarioName: string
  scenarioCode: string
  version: string
  positionName?: string
  batchId: string
  batchName: string
  submitterId: string
  submitterName: string
  currentStep: number
  totalSteps: number
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  comments?: string
  rejectReason?: string
}

export const approvalWorkflows: ApprovalWorkflow[] = [
  {
    id: "wf-1",
    name: "教研组长审批",
    description: "仅需教研组长审批即可通过",
    steps: [
      { id: "step-1", order: 1, name: "教研组长审批", approverRole: "教研组长" },
    ],
    createdAt: "2024-01-01",
  },
  {
    id: "wf-2",
    name: "校企联合审批",
    description: "需经教研组长、系主任、企业导师三级审批",
    steps: [
      { id: "step-1", order: 1, name: "教研组长审批", approverRole: "教研组长" },
      { id: "step-2", order: 2, name: "系主任审批", approverRole: "系主任" },
      { id: "step-3", order: 3, name: "企业导师审批", approverRole: "企业导师" },
    ],
    createdAt: "2024-01-01",
  },
  {
    id: "wf-3",
    name: "部门审批",
    description: "教研组长和系主任两级审批",
    steps: [
      { id: "step-1", order: 1, name: "教研组长审批", approverRole: "教研组长" },
      { id: "step-2", order: 2, name: "系主任审批", approverRole: "系主任" },
    ],
    createdAt: "2024-01-05",
  },
]

export const batches: Batch[] = [
  {
    id: "batch-1",
    name: "2026春季网络安全课程开发",
    code: "DH2DW3",
    departmentId: "dept-1",
    departmentName: "信息工程系",
    professionId: "prof-2",
    professionName: "网络安全",
    workflowId: "wf-2",
    workflowName: "多级校企联合审批",
    scenarioCount: 12,
    createdAt: "2026-01-15",
  },
  {
    id: "batch-2",
    name: "2026春季渗透测试课程建设",
    code: "A1B2C3",
    departmentId: "dept-1",
    departmentName: "信息工程系",
    professionId: "prof-1",
    professionName: "软件测试",
    workflowId: "wf-1",
    workflowName: "单级教研组长审批",
    scenarioCount: 8,
    createdAt: "2026-01-10",
  },
  {
    id: "batch-3",
    name: "2025秋季漏洞检测课程",
    code: "X9Y8Z7",
    departmentId: "dept-2",
    departmentName: "计算机系",
    professionId: "prof-3",
    professionName: "计算机科学",
    workflowId: "wf-3",
    workflowName: "两级部门审批",
    scenarioCount: 6,
    createdAt: "2025-09-01",
  },
]

export const approvalItems: ApprovalItem[] = [
  {
    id: "approval-1",
    scenarioId: "course-1",
    scenarioName: "SQL注入漏洞检测与利用",
    scenarioCode: "SC-2026-0001",
    version: "v2.1",
    positionName: "渗透测试工程师",
    batchId: "batch-2",
    batchName: "2026春季渗透测试课程建设",
    submitterId: "user-1",
    submitterName: "张老师",
    currentStep: 1,
    totalSteps: 1,
    status: "pending",
    submittedAt: "2026-04-18",
  },
  {
    id: "approval-2",
    scenarioId: "course-2",
    scenarioName: "API未授权访问漏洞检测与利用",
    scenarioCode: "SC-2026-0004",
    version: "v3.0",
    positionName: "安全测试工程师",
    batchId: "batch-1",
    batchName: "2026春季网络安全课程开发",
    submitterId: "user-2",
    submitterName: "李老师",
    currentStep: 2,
    totalSteps: 3,
    status: "pending",
    submittedAt: "2026-04-15",
  },
  {
    id: "approval-3",
    scenarioId: "course-3",
    scenarioName: "渗透测试实验室搭建",
    scenarioCode: "SC-2026-0003",
    version: "v1.2",
    positionName: "渗透测试工程师",
    batchId: "batch-2",
    batchName: "2026春季渗透测试课程建设",
    submitterId: "user-2",
    submitterName: "李老师",
    currentStep: 1,
    totalSteps: 1,
    status: "rejected",
    submittedAt: "2026-04-10",
    comments: "请补充实验室环境配置相关的任务节点",
    rejectReason: "课程任务链不完整，缺少环境配置环节，请补充后再提交。",
  },
  {
    id: "approval-4",
    scenarioId: "course-5",
    scenarioName: "XSS跨站脚本攻击原理与防御",
    scenarioCode: "SC-2025-0005",
    version: "v2.0",
    positionName: "安全开发工程师",
    batchId: "batch-3",
    batchName: "2025秋季漏洞检测课程",
    submitterId: "user-3",
    submitterName: "王老师",
    currentStep: 2,
    totalSteps: 2,
    status: "approved",
    submittedAt: "2026-03-20",
    comments: "内容完整，审核通过。",
  },
]


// ====== 体系课节点 Mock 数据 ======

export const mockSystemCourseNodes: SystemCourseNode[] = [
  {
    id: 'node-1',
    courseId: '1',
    parentId: null,
    name: '数据分析概述',
    order: 1,
    type: 'normal',
    teachingGoals: '1. 了解数据分析的基本概念\n2. 掌握数据分析的基本流程\n3. 熟悉常用数据分析工具',
    knowledgePoints: [
      { name: '数据分析', linked: true },
      { name: '数据清洗', linked: true },
    ],
    duration: 45,
    resources: [
      { id: 'res-1', name: '数据分析基础-第一章.pdf', type: 'PDF', size: 2.4, url: '#' },
    ],
    quizzes: [],
    homeworks: [],
    status: 'published',
  },
  {
    id: 'node-2',
    courseId: '1',
    parentId: null,
    name: '假设检验',
    order: 2,
    type: 'normal',
    teachingGoals: '1. **掌握**假设检验的基本流程与方法论\n2. **熟练运用** P 值进行结果验证\n3. **能独立完成**简单业务场景下的假设检验',
    knowledgePoints: [
      { name: '假设检验', linked: true },
      { name: 'P值与显著性', linked: true },
      { name: '自定义概念A', linked: false },
    ],
    duration: 60,
    resources: [
      { id: 'res-2', name: '数据分析基础-第三章.pdf', type: 'PDF', size: 2.4, url: '#' },
      { id: 'res-3', name: '假设检验案例演示.pptx', type: 'PPT', size: 5.1, url: '#' },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        title: '假设检验单元测验',
        type: 'question_bank',
        questions: [
          { id: 'q1', type: 'single', question: '假设检验中，p值小于显著性水平意味着？', options: [{ key: 'A', text: '接受原假设' }, { key: 'B', text: '拒绝原假设，结果显著' }, { key: 'C', text: '数据存在偏差' }, { key: 'D', text: '样本量不足' }], answer: 'B', score: 10 },
          { id: 'q2', type: 'single', question: '下列哪种场景适合使用 T 检验？', options: [{ key: 'A', text: '大样本（n>100）' }, { key: 'B', text: '总体方差已知' }, { key: 'C', text: '小样本且总体方差未知' }, { key: 'D', text: '比例数据' }], answer: 'C', score: 10 },
          { id: 'q3', type: 'essay', question: '请简述 A/B 测试的基本流程。', score: 20 },
        ],
        timeLimit: 120,
      },
    ],
    homeworks: [],
    status: 'draft',
  },
  {
    id: 'node-2-1',
    courseId: '1',
    parentId: 'node-2',
    name: 'P值与显著性',
    order: 1,
    type: 'clone',
    sourceId: 'gk-1',
    sourceName: 'P值与显著性',
    teachingGoals: '1. 理解P值的统计含义\n2. 掌握显著性水平的设定方法',
    knowledgePoints: [
      { name: 'P值与显著性', linked: true },
    ],
    duration: 30,
    resources: [],
    quizzes: [],
    homeworks: [],
    status: 'draft',
  },
  {
    id: 'node-2-2',
    courseId: '1',
    parentId: 'node-2',
    name: 'T 检验实战',
    order: 2,
    type: 'quote',
    sourceId: 'gk-2',
    sourceName: 'T检验实战案例',
    teachingGoals: '1. 掌握T检验的适用场景\n2. 能使用工具完成T检验',
    knowledgePoints: [
      { name: 'T 检验', linked: true },
    ],
    duration: 30,
    resources: [
      { id: 'res-4', name: 'T检验实战数据集.csv', type: 'CSV', size: 0.5, url: '#' },
    ],
    quizzes: [],
    homeworks: [],
    status: 'published',
  },
  {
    id: 'node-3',
    courseId: '1',
    parentId: null,
    name: '回归分析',
    order: 3,
    type: 'normal',
    teachingGoals: '',
    knowledgePoints: [],
    duration: undefined,
    resources: [],
    quizzes: [],
    homeworks: [],
    status: 'draft',
  },
  {
    id: 'node-4',
    courseId: '1',
    parentId: null,
    name: '数据可视化',
    order: 4,
    type: 'normal',
    teachingGoals: '',
    knowledgePoints: [],
    duration: undefined,
    resources: [],
    quizzes: [],
    homeworks: [],
    status: 'draft',
  },
]

// 题库 Mock 数据
export const mockQuestionBank: QuizQuestion[] = [
  { id: 'qb-1', type: 'single', question: 'React Hooks 识别', options: [{ key: 'A', text: 'useState 是用来处理副作用的' }, { key: 'B', text: 'useEffect 是用来管理状态的' }, { key: 'C', text: 'useState 返回 [state, setState]' }, { key: 'D', text: 'useRef 不能用来访问 DOM' }], answer: 'C', score: 10 },
  { id: 'qb-2', type: 'single', question: 'CSS flex 属性', options: [{ key: 'A', text: 'flex: 1 等同于 flex: 1 1 auto' }, { key: 'B', text: 'justify-content 用于设置交叉轴对齐' }, { key: 'C', text: 'align-items 用于设置主轴对齐' }, { key: 'D', text: 'flex-direction: column 表示横向排列' }], answer: 'A', score: 10 },
  { id: 'qb-3', type: 'judge', question: 'Virtual DOM 性能判断', answer: '正确', score: 10 },
  { id: 'qb-4', type: 'multiple', question: 'JS 基本数据类型', options: [{ key: 'A', text: 'string' }, { key: 'B', text: 'number' }, { key: 'C', text: 'boolean' }, { key: 'D', text: 'object' }], answer: 'A,B,C', score: 10 },
  { id: 'qb-5', type: 'essay', question: 'React 生命周期理解', score: 10 },
  { id: 'qb-6', type: 'single', question: 'HTTP 状态码', options: [{ key: 'A', text: '200 表示未授权' }, { key: 'B', text: '404 表示未找到资源' }, { key: 'C', text: '500 表示重定向' }, { key: 'D', text: '301 表示服务器错误' }], answer: 'B', score: 5 },
]


// ====== 知识图谱 Mock 数据 ======

export const mockKnowledgeGraphNodes: import('./types').KnowledgeGraphNode[] = [
  { id: 'kg-1', label: '假设检验', x: 400, y: 250, type: 'core', description: '统计推断的核心方法之一' },
  { id: 'kg-2', label: 'P值', x: 280, y: 180, type: 'related', description: '衡量统计显著性的关键指标' },
  { id: 'kg-3', label: '显著性水平', x: 520, y: 180, type: 'related', description: '判断结果是否显著的阈值' },
  { id: 'kg-4', label: 'T检验', x: 200, y: 320, type: 'related', description: '用于小样本均值比较的检验方法' },
  { id: 'kg-5', label: '卡方检验', x: 600, y: 320, type: 'related', description: '用于分类变量独立性检验' },
  { id: 'kg-6', label: 'A/B测试', x: 320, y: 380, type: 'extended', description: '互联网产品常用的实验方法' },
  { id: 'kg-7', label: '置信区间', x: 480, y: 380, type: 'extended', description: '估计不确定范围的方法' },
  { id: 'kg-8', label: '回归分析', x: 400, y: 120, type: 'extended', description: '探索变量间关系的方法' },
  { id: 'kg-9', label: '正态分布', x: 150, y: 220, type: 'extended', description: '统计学中最重要的分布' },
  { id: 'kg-10', label: '中心极限定理', x: 650, y: 220, type: 'extended', description: '大样本理论的基石' },
]

export const mockKnowledgeGraphEdges: import('./types').KnowledgeGraphEdge[] = [
  { from: 'kg-1', to: 'kg-2', label: '包含' },
  { from: 'kg-1', to: 'kg-3', label: '依赖' },
  { from: 'kg-1', to: 'kg-4', label: '应用' },
  { from: 'kg-1', to: 'kg-5', label: '应用' },
  { from: 'kg-2', to: 'kg-3', label: '对比' },
  { from: 'kg-1', to: 'kg-6', label: '实践' },
  { from: 'kg-1', to: 'kg-7', label: '关联' },
  { from: 'kg-1', to: 'kg-8', label: '前置' },
  { from: 'kg-4', to: 'kg-9', label: '前提' },
  { from: 'kg-4', to: 'kg-10', label: '理论基础' },
]


// ====== Add / Edit Page Types (mirrored from zhiyu-scene) ======

export type ResourceType = "document" | "video" | "link" | "file"

export interface Resource {
  id: string
  name: string
  type: ResourceType
  url: string
  size?: string
}

export type QuestionType = "single" | "multiple" | "judgment"

export interface QuestionItem {
  id: string
  type: QuestionType
  content: string
  options?: string[]
  answer: string | string[]
  score: number
}

export interface ObjectiveConfig {
  questions: QuestionItem[]
  totalScore: number
}

export interface RubricLevel {
  id: string
  name: string
  minScore: number
  maxScore: number
  description: string
  color: string
}

export interface RubricPoint {
  id: string
  name: string
  weight: number
  maxScore: number
  levels: RubricLevel[]
}

export interface SubjectiveConfig {
  rubricPoints: RubricPoint[]
  synthesisRule: "sum" | "weighted"
}

export interface GradeMapping {
  id: string
  grade: string
  minScore: number
  maxScore: number
  color: string
  remark?: string
}

export interface KnowledgePointItem {
  id: string
  name: string
  code?: string
  description?: string
  linked: boolean
  granularLessons?: string[]
}

export interface EvalPoint {
  id: string
  name: string
  desc: string
  subType?: string
  types?: string[]
  knowledgePointIds?: string[]
  abilityPointIds?: string[]
  scoringMethod?: "score" | "level" | "rubric"
  gradeMapping?: GradeMapping[]
  weight?: number
}

export interface EvalSubjectConfig {
  subject: string
  enabled: boolean
  weight: number
}
