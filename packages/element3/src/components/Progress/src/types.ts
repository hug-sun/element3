export interface LevelColor {
  color: string
  percentage: number
}

export type FnColor = (percentage: number) => string

// export type AnyColor = string | string[] | LevelColor[] | FnColor
export type AnyColor = string | FnColor | unknown[]

export type FnFormat = (percentage: number) => string

export interface StrokeStyle {
  strokeDasharray: string
  strokeDashoffset: string
  transition?: string
}

export interface ProgressProps {
  percentage?: number
  color?: AnyColor
  status?: string
  strokeWidth?: number
  type?: string
  format?: FnFormat
  showText?: boolean
  textInside?: boolean
  width?: number
}
