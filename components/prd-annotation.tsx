"use client"

interface PrdAnnotationProps {
  data?: { id: string; title: string; content: string }
  children: React.ReactNode
}

export function PrdAnnotation({ children }: PrdAnnotationProps) {
  return <>{children}</>
}
