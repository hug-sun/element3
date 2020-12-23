import { ElementUIComponent } from './component'

export const ElBacktop: IBacktop
/** Backtop Component */
interface IBacktop extends ElementUIComponent {
  /** Backtop target */
  target: string

  /** Backtop visibility height */
  visibilityHeight: string | number

  /** Backtop right position */
  right: string | number

  /** Backtop bottom position */
  bottom: string | number
}
