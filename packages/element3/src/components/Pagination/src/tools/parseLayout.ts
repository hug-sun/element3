export function parseLayout(layout: string): string[] {
  return layout.split(',').map((v) => v.trim())
}
