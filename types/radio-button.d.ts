import { ElementUIComponent } from './component'

export const ElRadioButton: IRadioButton
/** Radio Button Component */
interface IRadioButton extends ElementUIComponent {
  /** The form input value */
  value: string

  /** The value of radio */
  label: string | number

  /** Whether radio is disabled */
  disabled: boolean

  /** Native 'name' attribute */
  name: string
}
