"use client"

import { PlatformShell } from "@/components/platform-shell"
import { teacherNavigationConfig } from "@/lib/navigation-config"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PlatformShell config={teacherNavigationConfig}>
      {children}
    </PlatformShell>
  )
}
