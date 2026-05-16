const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')

const files = [
  'app/(public)/page.tsx',
  'app/admin/granular/page.tsx',
  'app/admin/granular/add/page.tsx',
  'app/admin/system/page.tsx',
  'app/admin/system/add/page.tsx',
  'app/courses/granular/[id]/page.tsx',
  'app/courses/system/[id]/page.tsx',
  'app/courses/system/[id]/learn/page.tsx',
]

for (const f of files) {
  const p = path.join(projectRoot, f)
  if (!fs.existsSync(p)) continue
  let content = fs.readFileSync(p, 'utf-8')

  // Replace body { ... } with scoped class
  // Handle various body style declarations
  content = content.replace(/body \{([^}]*)\}/g, (match, inner) => {
    return `.legacy-page-root {${inner}}`
  })

  // Add className to the wrapper div
  content = content.replace(
    /<div ref={containerRef} dangerouslySetInnerHTML={{ __html: BODY_HTML }} \/>/,
    '<div ref={containerRef} className="legacy-page-root" dangerouslySetInnerHTML={{ __html: BODY_HTML }} />'
  )

  fs.writeFileSync(p, content, 'utf-8')
  console.log('Fixed body style in:', f)
}

// Special fix for smart-classroom which already had custom body replacement
const smartPath = path.join(projectRoot, 'app/admin/smart-classroom/page.tsx')
let smartContent = fs.readFileSync(smartPath, 'utf-8')
smartContent = smartContent.replace(
  /<div ref={containerRef} dangerouslySetInnerHTML={{ __html: BODY_HTML }} \/>/,
  '<div ref={containerRef} className="zhihuiketang-root legacy-page-root" dangerouslySetInnerHTML={{ __html: BODY_HTML }} />'
)
fs.writeFileSync(smartPath, smartContent, 'utf-8')
console.log('Fixed wrapper class in: app/admin/smart-classroom/page.tsx')
