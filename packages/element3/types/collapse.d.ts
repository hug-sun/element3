import { ElementUIComponent } from './component'

/** Use Collapse to store contents. */
interface ICollapse extends ElementUIComponent {
  /** Whether to activate accordion mode */
  accordion: boolean

  /** Currently active panel */
  value: string | number | string[] | number[]
}

export const ElCollapse: ICollapse
