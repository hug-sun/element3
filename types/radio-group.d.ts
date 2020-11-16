import { ElementUIComponent } from './component'

export type RadioGroupSize = 'large' | 'small'
export const ElRadioGroup: IRadioGroup
/** Radio Group Component */
interface IRadioGroup extends ElementUIComponent {
  /** The size of radio buttons */
  size: RadioGroupSize

  /** Border and background color when button is active */
  fill: string

  /** Whether the nesting radios are disabled */
  disabled: boolean

  /** Font color when button is active */
  textColor: string
}
