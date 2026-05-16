const fs = require('fs')
const path = require('path')

const files = [
  { src: 'kechengqiantai.html', dest: 'app/(public)/page.tsx', isClient: true },
  { src: 'kechengqiantaixiangqingkelike.html', dest: 'app/courses/granular/[id]/page.tsx', isClient: true },
  { src: 'kechengqiantaixiangqingtixike.html', dest: 'app/courses/system/[id]/page.tsx', isClient: true },
  { src: 'kechengxuexi.html', dest: 'app/courses/system/[id]/learn/page.tsx', isClient: true },
  { src: 'kechengkelike.html', dest: 'app/admin/granular/page.tsx', isClient: true },
  { src: 'kechengkeliketianjia.html', dest: 'app/admin/granular/add/page.tsx', isClient: true },
  { src: 'kechengtixike.html', dest: 'app/admin/system/page.tsx', isClient: true },
  { src: 'kechengtixiketianjia.html', dest: 'app/admin/system/add/page.tsx', isClient: true },
  { src: 'zhihuiketang.html', dest: 'app/admin/smart-classroom/page.tsx', isClient: true },
]

function escapeTemplateLiteral(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\$/g, '\\$')
    .replace(/`/g, '\\`')
}

function extractSections(html) {
  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  let bodyHtml = bodyMatch ? bodyMatch[1].trim() : html

  // Remove annotation tool json script
  bodyHtml = bodyHtml.replace(/<script type="application\/json" id="annotation-tool-data">[\s\S]*?<\/script>/gi, '')

  // Extract style tags from full html
  const styles = []
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
  let m
  while ((m = styleRegex.exec(html)) !== null) {
    styles.push(m[1].trim())
  }

  // Extract script tags from body only, excluding annotation tool
  const scripts = []
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
  while ((m = scriptRegex.exec(bodyHtml)) !== null) {
    const fullTag = m[0]
    const content = m[1].trim()
    if (fullTag.includes('data-annotation-tool')) continue
    if (fullTag.includes('annotation-tool-data')) continue
    if (fullTag.includes('cdn.tailwindcss.com')) continue
    if (content.includes('annotation-tool')) continue
    scripts.push(content)
  }
  // Remove script tags from body html
  bodyHtml = bodyHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')

  // Remove font-awesome link from body (sometimes present)
  bodyHtml = bodyHtml.replace(/<link[^>]*font-awesome[^>]*>/gi, '')

  // Remove tailwind script from body
  bodyHtml = bodyHtml.replace(/<script[^>]*cdn\.tailwindcss\.com[^>]*><\/script>/gi, '')

  return { bodyHtml, styles, scripts }
}

const projectRoot = path.resolve(__dirname, '..')

for (const item of files) {
  const srcPath = path.join(projectRoot, item.src)
  const destPath = path.join(projectRoot, item.dest)

  if (!fs.existsSync(srcPath)) {
    console.warn('Missing:', srcPath)
    continue
  }

  const html = fs.readFileSync(srcPath, 'utf-8')
  const { bodyHtml, styles, scripts } = extractSections(html)

  const bodyHtmlEscaped = escapeTemplateLiteral(bodyHtml)
  const stylesEscaped = styles.map(s => escapeTemplateLiteral(s)).join('\n\n')
  const scriptsEscaped = scripts.map(s => escapeTemplateLiteral(s)).join('\n\n')

  const pageContent = `\"use client\"

import { useEffect, useRef } from "react"

const BODY_HTML = \`${bodyHtmlEscaped}\`

const STYLES = \`${stylesEscaped}\`

const SCRIPTS = \`${scriptsEscaped}\`

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Remove original header/nav elements to avoid duplication with PlatformShell
    const selectors = [".header-bar", ".header", ".side-nav", ".nav"]
    selectors.forEach((sel) => {
      containerRef.current?.querySelectorAll(sel).forEach((el) => el.remove())
    })

    // Execute extracted scripts
    if (SCRIPTS.trim()) {
      const script = document.createElement("script")
      script.textContent = SCRIPTS
      document.body.appendChild(script)
      return () => {
        try {
          document.body.removeChild(script)
        } catch {}
      }
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
    </>
  )
}
`

  fs.mkdirSync(path.dirname(destPath), { recursive: true })
  fs.writeFileSync(destPath, pageContent, 'utf-8')
  console.log('Generated:', destPath)
}
