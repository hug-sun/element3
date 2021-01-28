export interface LevelColor {
  color: string
  percentage: number
}

export type FnColor = (percentage: number) => string

// export type AnyColor = string | string[] | LevelColor[] | FnColor
/* eslint-disable*/
export type AnyColor = string | Function | unknown[]
/* eslint-enable*/

export type FormatCallBackFunction = (percentage: number) => void

export interface ProgressProps {
  percentage?: number
  color?: AnyColor
  status?: string
  strokeWidth?: number
  type?: string
  format?: FormatCallBackFunction
  showText?: boolean
  textInside?: boolean
  width?: number
}
