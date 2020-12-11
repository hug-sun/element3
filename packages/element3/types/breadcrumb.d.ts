import { ElementUIComponent } from './component'

interface IBreadcrumb extends ElementUIComponent {
  /** Separator character */
  separator: string

  /** Class name of the icon separator */
  separatorClass: string
}

/** Breadcrumb Component */
export const ElBreadcrumb: IBreadcrumb
