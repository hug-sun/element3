import { ElementUIComponent } from './component'

export const ElPageHeader: IPageHeader
/** PageHeader Component */
interface IPageHeader extends ElementUIComponent {
  /** title */
  title: String

  /** content */
  content: String
}
