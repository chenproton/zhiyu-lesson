"use client"

import { PlatformShell } from "@/components/platform-shell"
import { unifiedNavigationConfig } from "@/lib/navigation-config"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PlatformShell config={unifiedNavigationConfig}>
      {children}
    </PlatformShell>
  )
}
