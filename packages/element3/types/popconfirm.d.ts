import { ElementUIComponent } from './component'
import { ElPopover } from './popover'

export const ElPopconfirm: IPopconfirm

type IPopover = typeof ElPopover
/** Popconfirm Component */
interface IPopconfirm extends IPopover {
  /** Popconfirm title */
  title: string

  /** Popconfirm ok text */
  confirmButtonText: string

  /** Popconfirm cancel text */
  cancelButtonText: string

  /** Popconfirm ok type */
  confirmButtonType: string

  /** Popconfirm cancal type */
  cancelButtonType: string

  /** Popconfirm icon */
  icon: string

  /** Popconfirm icon color */
  iconColor: string

  /** Popconfirm hide icon */
  hideIcon: boolean
}
