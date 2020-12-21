import { ElementUIComponent } from './component'

export const ElMenuItem: IMenuItem
/** Menu Item Component */
interface IMenuItem extends ElementUIComponent {
  /** Unique identification */
  index: string

  /** Vue Router object */
  route: object
}
