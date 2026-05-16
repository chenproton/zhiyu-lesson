"use client"

import { PlatformShell } from "@/platform-navigation-shell"
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
