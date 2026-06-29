export interface AnnotationItem {
  id: string
  title: string
  content: string
}

const annotations: Record<string, AnnotationItem> = {}

export function getAnnotation(id: string): AnnotationItem | undefined {
  return annotations[id]
}
