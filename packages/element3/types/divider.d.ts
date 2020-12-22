import { ElementUIComponent } from './component'

export type ContentPosition = 'left' | 'center' | 'right'

export const ElDivider: IDivider
/** Divider Component */
interface IDivider extends ElementUIComponent {
  /** enable vertical divider */
  vertical: boolean

  /** customize the content on the divider line */
  posiiton: ContentPosition
}
