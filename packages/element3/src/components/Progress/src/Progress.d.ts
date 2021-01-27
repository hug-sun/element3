export interface LevelColor {
  color: string
  percentage: number
}

export type FnColor = (percentage: number) => string

export type AnyColor = string | string[] | LevelColor[] | FnColor

export interface ProgressProps {
  percentage?: number
  color?: AnyColor
  status?: string
  strokeWidth?: number
  type?: string
}
