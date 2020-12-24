import { ElementUIComponent } from './component'

export const ElOptionGroup: IOptionGroup
/** Dropdown Select Option Group Component */
interface IOptionGroup extends ElementUIComponent {
  /** Name of the group */
  label: string

  /** Whether to disable all options in this group */
  disabled: boolean
}
