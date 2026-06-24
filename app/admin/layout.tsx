"use client"

import { PlatformShell } from "@/components/platform-shell"
import { unifiedNavigationConfig } from "@/lib/navigation-config"

export default function AdminLayout({
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
