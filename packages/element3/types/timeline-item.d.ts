import { ElementUIComponent } from './component'

export type TimelineItemPlacement = 'top' | 'bottom'
export type TimelineItemType =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
export type TimelineItemSize = 'normal' | 'large'

export const ElTimelineItem: ITimelineItem
/** TimelineItem Component */
interface ITimelineItem extends ElementUIComponent {
  timestamp: string

  hideTimestamp: boolean

  placement: TimelineItemPlacement

  type: TimelineItemType

  size: TimelineItemSize

  icon: string
}
