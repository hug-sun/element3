import { ElementUIComponent, ElementUIComponentSize } from './component'

export type ColorFormat = 'hsl' | 'hsv' | 'hex' | 'rgb'

/** ColorPicker Component */
interface IColorPicker extends ElementUIComponent {
  /** Whether to display the alpha slider */
  showAlpha: boolean

  /** Whether to disable the ColorPicker */
  disabled: boolean

  /** Size of ColorPicker */
  size: ElementUIComponentSize

  /** Whether to display the alpha slider */
  popperClass: string

  /** Custom class name for ColorPicker's dropdown */
  colorFormat: ColorFormat
}

export const ElColorPicker: IColorPicker
