"use client"

import { usePathname } from "next/navigation"
import { PlatformShell } from "@/platform-navigation-shell"
import { learnNavigationConfig } from "@/lib/navigation-config"

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPortal = pathname === "/learn" || pathname.startsWith("/learn/courses")

  const config = {
    ...learnNavigationConfig,
    hideSideNav: isPortal,
  }

  return (
    <PlatformShell config={config}>
      {children}
    </PlatformShell>
  )
}
