import { ElementUIComponent } from './component'

export const ElOption: IOption
/** Dropdown Select Option Component */
interface IOption extends ElementUIComponent {
  /** Value of option */
  value: any

  /** Label of option, same as value if omitted */
  label: string

  /** Whether option is disabled */
  disabled: boolean
}
