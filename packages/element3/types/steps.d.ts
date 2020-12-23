import { ElementUIComponent } from './component'
import { ElStep, StepStatus } from './step'

export type StepsDirection = 'vertical' | 'horizontal'
export const ElSteps: ISteps
/** Guide the user to complete tasks in accordance with the process. Its steps can be set according to the actual application scenario and the number of the steps can't be less than 2. */
interface ISteps extends ElementUIComponent {
  /** The spacing of each step, will be responsive if omitted. Support percentage. */
  space: number | string

  /** Display direction */
  direction: StepsDirection

  /** Current activation step */
  active: number

  /** Status of current step */
  processStatus: StepStatus

  /** Status of end step */
  finishStatus: StepStatus

  /** Whether step description is centered */
  alignCenter: boolean

  /** Whether to apply simple theme */
  simple: boolean
}
