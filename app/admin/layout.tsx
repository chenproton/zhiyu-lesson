"use client"

import { PlatformShell } from "@/platform-navigation-shell"
import { adminNavigationConfig } from "@/lib/navigation-config"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PlatformShell config={adminNavigationConfig}>
      {children}
    </PlatformShell>
  )
}
