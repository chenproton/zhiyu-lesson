const fs = require('fs')
const path = require('path')

const replacements = [
  // public pages
  { file: 'app/(public)/page.tsx', map: {
    "kechengqiantaixiangqingkelike.html": "/courses/granular/1",
    "kechengqiantaixiangqingtixike.html": "/courses/system/1",
    "yingyongfuwuzhognxin.html": "http://111.170.170.202:3001/portal/apps",
  }},
  // admin granular
  { file: 'app/admin/granular/page.tsx', map: {
    "kechengqiantai.html": "/",
    "yingyongfuwuzhognxin.html": "http://111.170.170.202:3001/portal/apps",
    "kechengkeliketianjia.html": "/admin/granular/add",
    "PlanA.html": "#",
  }},
  // admin granular add
  { file: 'app/admin/granular/add/page.tsx', map: {
    "kechengkelike.html": "/admin/granular",
    "peizhiTaskResource.html": "#",
  }},
  // admin system
  { file: 'app/admin/system/page.tsx', map: {
    "kechengqiantai.html": "/",
    "yingyongfuwuzhognxin.html": "http://111.170.170.202:3001/portal/apps",
    "kechengtixiketianjia.html": "/admin/system/add",
    "PlanA.html": "#",
  }},
  // admin system add
  { file: 'app/admin/system/add/page.tsx', map: {
    "kechengtixike.html": "/admin/system",
  }},
  // smart classroom
  { file: 'app/admin/smart-classroom/page.tsx', map: {
    "kechengqiantai.html": "/",
    "yingyongfuwuzhognxin.html": "http://111.170.170.202:3001/portal/apps",
  }},
  // course detail granular
  { file: 'app/courses/granular/[id]/page.tsx', map: {
    "kechengqiantai.html": "/",
  }},
  // course detail system
  { file: 'app/courses/system/[id]/page.tsx', map: {
    "kechengqiantai.html": "/",
    "kechengxuexi.html": "/courses/system/1/learn",
  }},
  // course learn
  { file: 'app/courses/system/[id]/learn/page.tsx', map: {
    "kechengqiantai.html": "/",
    "kechengqiantaixiangqingtixike.html": "/courses/system/1",
  }},
]

const projectRoot = path.resolve(__dirname, '..')

for (const item of replacements) {
  const filePath = path.join(projectRoot, item.file)
  if (!fs.existsSync(filePath)) {
    console.warn('Missing:', filePath)
    continue
  }
  let content = fs.readFileSync(filePath, 'utf-8')
  for (const [oldStr, newStr] of Object.entries(item.map)) {
    content = content.split(oldStr).join(newStr)
  }
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log('Fixed links in:', item.file)
}

// Fix zhihuiketang body style issue
const smartPath = path.join(projectRoot, 'app/admin/smart-classroom/page.tsx')
let smartContent = fs.readFileSync(smartPath, 'utf-8')
// Replace body { ... height: 100vh; overflow: hidden; } with a scoped class
smartContent = smartContent.replace(
  /body \{ background-color: var\(--bg\); min-width: 1300px; height: 100vh; overflow: hidden; \}/,
  '.zhihuiketang-root { background-color: var(--bg); min-width: 1300px; height: calc(100vh - 56px); overflow: hidden; }'
)
// Also fix other body references inside the style block for this specific file if needed
fs.writeFileSync(smartPath, smartContent, 'utf-8')
console.log('Fixed zhihuiketang body style')
