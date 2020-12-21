import { ElementUIComponent } from './component'

export type DateType = Date | String | Number

export const ElCalendar: ICalendar
/** Calendar Component */
interface ICalendar extends ElementUIComponent {
  /** Binding value */
  value: DateType

  /** Specify the display range of the calendar */
  range: DateType[]

  /** First day of week */
  firstDayOfWeek: number
}
